/**
 * Lector de texto.
 *
 * Envuelve el motor de reconocimiento para que el resto de la app no sepa nada
 * de él. Dos decisiones de peso:
 *
 * 1. Se carga cuando hace falta, no al arrancar. Son nueve megas: descargarlos
 *    para abrir la pantalla de Inicio sería una falta de respeto.
 *
 * 2. Si la carpeta del lector no está, la app NO se rompe. Lo dice y sigue
 *    funcionando por la vía de pegar texto, que en un iPhone da mejor
 *    resultado. El reconocimiento automático es una comodidad, no un requisito.
 */

let motorLector = null;
let cargando = null;
/** Por qué no se ha podido, para poder decirlo en pantalla. */
let motivoNoDisponible = '';

export function porQueNoHayLector() {
  return motivoNoDisponible ||
    'El lector automático no está instalado en esta copia de la app. Usa la vía de pegar texto: en tu iPhone sale mejor.';
}

export const RUTA_LECTOR = 'lector/';

/**
 * Ruta absoluta desde la raíz de la app.
 *
 * Hace falta porque fetch() e import() NO resuelven igual una ruta relativa:
 * fetch la calcula desde la página, e import desde el fichero que la escribe,
 * que vive en js/. El resultado era que la comprobación encontraba el fichero
 * y la carga lo buscaba en js/escaner/, donde no hay nada, y la app concluía
 * que el lector no estaba instalado.
 */
function rutaApp(relativa) {
  return new URL(relativa, document.baseURI).href;
}


/**
 * ¿Admite este móvil las instrucciones SIMD?
 *
 * El lector trae dos núcleos, uno para móviles que las admiten y otro para los
 * que no, y cada uno pesa casi siete megas. Incluir los dos serían dieciséis.
 * Así que va solo el rápido y se comprueba antes: más vale decir "tu móvil no
 * lo admite" que dejar que falle sin explicar por qué.
 *
 * Safari las admite desde iOS 16.4, de marzo de 2023.
 */
async function admiteSIMD() {
  try {
    // Un módulo WebAssembly mínimo que usa una instrucción SIMD. Si el
    // navegador no las entiende, ni siquiera lo compila.
    const prueba = new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3,
      2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
    ]);
    return WebAssembly.validate(prueba);
  } catch {
    return false;
  }
}

/** ¿Está la carpeta del lector en el servidor? */
export async function lectorDisponible() {
  try {
    const r = await fetch(rutaApp(`${RUTA_LECTOR}tesseract.js`), { method: 'HEAD' });
    return r.ok;
  } catch {
    return false;
  }
}

/**
 * Prepara el lector. Devuelve null si no está instalado.
 * `alProgresar` recibe un número de 0 a 1 mientras se descarga y arranca.
 */
async function prepararLector(alProgresar = () => {}) {
  if (motorLector) return motorLector;
  if (cargando) return cargando;

  cargando = (async () => {
    if (!(await lectorDisponible())) return null;
    if (!(await admiteSIMD())) {
      motivoNoDisponible = 'Este navegador no admite las instrucciones que necesita el lector de texto. Hace falta iOS 16.4 o posterior. Las otras dos vías funcionan igual.';
      return null;
    }

    // Sin este try/catch, un fallo al arrancar el lector se perdía por el
    // camino y la pantalla se quedaba en "Preparando el lector…" para siempre.
    // Un error que no se cuenta es peor que un error.
    try {
      return await arrancar(alProgresar);
    } catch (err) {
      motivoNoDisponible = `El lector no ha podido arrancar. ${err.message}. Usa la vía de pegar texto, que no necesita descargar nada.`;
      cargando = null;
      return null;
    }
  })();

  return cargando;
}

/** Arranca el lector, con tope de tiempo para que no se quede colgado. */
async function arrancar(alProgresar) {
  const TOPE = 180000;   // tres minutos: son casi nueve megas por una red móvil

  const conTope = (promesa) => Promise.race([
    promesa,
    new Promise((_, rechaza) => setTimeout(
      () => rechaza(new Error('Ha tardado más de tres minutos en descargarse')), TOPE)),
  ]);

  alProgresar(0.05, 'cargando el lector');
  const { createWorker } = await conTope(
    import(/* @vite-ignore */ rutaApp(`${RUTA_LECTOR}tesseract.js`)));

  alProgresar(0.1, 'arrancando el trabajador');
  const worker = await conTope(createWorker('spa', 1, {
      workerPath: rutaApp(`${RUTA_LECTOR}worker.js`),
      // Se apunta al fichero exacto y no a la carpeta: así el lector no busca
      // el núcleo alternativo, que no viene incluido para no doblar el peso.
      corePath: rutaApp(`${RUTA_LECTOR}tesseract-core-simd-lstm.wasm.js`),
      langPath: rutaApp(RUTA_LECTOR),
      gzip: true,
      logger: (m) => {
        if (typeof m.progress === 'number') alProgresar(m.progress, m.status);
      },
      errorHandler: (m) => { console.error('Lector:', m); },
    }));

  // Ajustes pensados para etiquetas, no para novelas.
  await worker.setParameters({
    // Un bloque de texto uniforme: es lo que es una tabla nutricional.
    tessedit_pageseg_mode: '6',
    // Conservar los espacios entre columnas: son la pista de qué número va
    // con qué campo cuando la tabla tiene dos columnas.
    preserve_interword_spaces: '1',
  });

  alProgresar(1, 'listo');
  motorLector = worker;
  return worker;
}

/**
 * Lee el texto de una imagen ya preparada.
 * Devuelve null si el lector no está instalado, para que quien llame decida.
 */
export async function leerTexto(imagen, alProgresar = () => {}) {
  const worker = await prepararLector(alProgresar);
  if (!worker) return null;

  const lienzo = document.createElement('canvas');
  lienzo.width = imagen.ancho;
  lienzo.height = imagen.alto;
  lienzo.getContext('2d').putImageData(
    new ImageData(imagen.datos, imagen.ancho, imagen.alto), 0, 0,
  );

  const { data } = await worker.recognize(lienzo);
  return {
    texto: data.text ?? '',
    // La confianza que declara el propio lector, de 0 a 1.
    confianza: typeof data.confidence === 'number' ? data.confidence / 100 : 0.5,
    lineas: (data.lines ?? []).map((l) => ({
      texto: l.text.trim(),
      confianza: (l.confidence ?? 50) / 100,
    })),
  };
}

/** Suelta la memoria del lector. Nueve megas no se dejan colgando. */
export async function soltarLector() {
  if (motorLector) {
    try { await motorLector.terminate(); } catch { /* daba igual, se va a descartar */ }
    motorLector = null;
    cargando = null;
  }
}

/**
 * Comprobación del lector, fichero por fichero.
 *
 * Existe porque cuando algo falla al arrancar, "no funciona" no es un
 * diagnóstico. Esto dice cuál de las cinco piezas falta y con qué respuesta
 * del servidor, que es lo único con lo que se puede arreglar algo.
 */
/** 67 KB no es "0.0 MB". */
function tamano(bytes) {
  if (!bytes) return 'encontrado';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export async function diagnosticarLector() {
  const FICHEROS = [
    'tesseract.js',
    'worker.js',
    'tesseract-core-simd-lstm.wasm.js',
    'tesseract-core-simd-lstm.wasm',
    'spa.traineddata.gz',
  ];

  const filas = [];
  for (const f of FICHEROS) {
    const url = rutaApp(`${RUTA_LECTOR}${f}`);
    try {
      const r = await fetch(url, { method: 'HEAD' });
      const tipo = r.headers.get('content-type') ?? '';
      const bytes = Number(r.headers.get('content-length') ?? 0);
      filas.push({
        fichero: f,
        ok: r.ok,
        detalle: r.ok
          ? `${tamano(bytes)}${tipo.includes('text/html') ? ' · OJO: el servidor devuelve una página, no el fichero' : ''}`
          : `no está (${r.status})`,
      });
    } catch (err) {
      filas.push({ fichero: f, ok: false, detalle: `error de red: ${err.message}` });
    }
  }

  filas.push({
    fichero: 'Instrucciones SIMD',
    ok: await admiteSIMD(),
    detalle: (await admiteSIMD()) ? 'admitidas' : 'no admitidas, hace falta iOS 16.4 o posterior',
  });

  filas.push({
    fichero: 'Trabajadores en segundo plano',
    ok: typeof Worker !== 'undefined',
    detalle: typeof Worker !== 'undefined' ? 'disponibles' : 'no disponibles en este navegador',
  });

  return filas;
}
