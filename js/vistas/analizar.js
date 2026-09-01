import { esc, pendiente } from '../ui.js';
import { capturar, pedirFoto, aURL } from '../camara.js';
import { hayRecorte, RECORTE_COMPLETO } from '../motor.js';
import { leerTexto, lectorDisponible } from '../lector.js';
import { enCurso } from '../estado.js';
import { analizarTabla, analizarIngredientesTexto, validar, validarContraIngredientes, normalizarNutrientes } from '../motor.js';

/**
 * Las tres tomas.
 *
 * El frontal es opcional a propósito: sirve para reconocer el producto de un
 * vistazo en la Despensa, pero no aporta nada al análisis. Exigirlo alargaría
 * el proceso a cambio de nada.
 */
const TOMAS = [
  { clave: 'tabla', titulo: 'Tabla nutricional', pista: 'La rejilla de valores por 100 g', obligatoria: true },
  { clave: 'ingredientes', titulo: 'Lista de ingredientes', pista: 'Donde pone "Ingredientes:"', obligatoria: true },
  { clave: 'frontal', titulo: 'Frente del envase', pista: 'Para reconocerlo en la Despensa', obligatoria: false },
];

/** Lo capturado en esta sesión. Se pierde al salir, y es lo correcto: guardar
 *  a medias un análisis sin terminar solo ensuciaría la Despensa. */
const capturas = new Map();

const ICONO_CAMARA = `<svg viewBox="0 0 24 24" aria-hidden="true" class="toma__icono">
  <path d="M3 8h3l1.5-2.5h9L18 8h3v11H3z"/><circle cx="12" cy="13" r="3.5"/></svg>`;

/**
 * Recorte con cuatro deslizadores.
 *
 * No se arrastran esquinas con el dedo a propósito. Un deslizador es un
 * control que el navegador ya sabe manejar al tacto, funciona con una sola
 * mano y, sobre todo, su lógica se puede probar fuera del navegador. Los
 * gestos táctiles habría habido que entregarlos sin probar.
 */
function marcoRecorte(clave, c) {
  if (!c.recortando) {
    return `<button class="boton" data-recortar="${clave}" style="width:100%; margin-top:12px">
      ${hayRecorte(c.recorte) ? 'Cambiar el recorte' : 'Recortar la zona que interesa'}
    </button>`;
  }
  const r = c.recorte;
  const desl = (eje, etiqueta, valor) => `
    <label class="desliza">
      <span>${etiqueta}</span>
      <input type="range" min="0" max="100" step="1" value="${valor}"
             data-desliza="${eje}" data-toma="${clave}">
    </label>`;

  return `
    <div class="recorte" data-marco="${clave}">
      <p class="texto" style="font-size:0.92rem; margin-top:12px">Deja dentro solo la tabla o los ingredientes. Todo lo que quede fuera se descarta antes de leer.</p>
      <div class="recorte__lienzo">
        <img src="${c.urlCompleta}" alt="Foto completa">
        <div class="recorte__marco" id="marco_${clave}"
             style="left:${r.x0}%; top:${r.y0}%; width:${r.x1 - r.x0}%; height:${r.y1 - r.y0}%"></div>
      </div>
      ${desl('x0', 'Izquierda', r.x0)}
      ${desl('x1', 'Derecha', r.x1)}
      ${desl('y0', 'Arriba', r.y0)}
      ${desl('y1', 'Abajo', r.y1)}
      <div class="toma__botones">
        <button class="boton" data-aplicar-recorte="${clave}">Aplicar</button>
        <button class="boton" data-quitar-recorte="${clave}">Sin recorte</button>
      </div>
    </div>`;
}

function tarjetaToma(t) {
  const c = capturas.get(t.clave);
  if (!c) {
    return `
      <div class="toma toma--vacia" data-toma="${t.clave}">
        ${ICONO_CAMARA}
        <span class="toma__titulo">${esc(t.titulo)}</span>
        <span class="toma__pista">${esc(t.pista)}${t.obligatoria ? '' : ' · opcional'}</span>
        <div class="toma__botones">
          <button class="boton" data-camara="${t.clave}">Hacer foto</button>
          <button class="boton" data-galeria="${t.clave}">Elegir una ya hecha</button>
        </div>
      </div>`;
  }

  const estado = c.calidad.repetir ? 'mala' : c.calidad.problemas.length ? 'regular' : 'lista';
  const dictamen = { mala: 'Conviene repetirla', regular: 'Servirá, pero puede mejorar', lista: 'Buena foto' }[estado];
  const problemas = c.calidad.problemas
    .map((p) => `<li><b>${esc(p.mensaje)}</b><br>${esc(p.consejo)}</li>`).join('');

  return `
    <div class="toma toma--${estado}" data-toma="${t.clave}">
      <div class="toma__cabecera">
        <span class="toma__titulo">${esc(t.titulo)}</span>
        <span class="toma__nota cifra">${c.calidad.puntuacion}/100</span>
      </div>
      <div class="toma__imagenes">
        <figure><img src="${c.urlOriginal}" alt="Tu foto de ${esc(t.titulo)}"><figcaption>${hayRecorte(c.recorte) ? 'Recortada' : 'Tu foto'}</figcaption></figure>
        <figure><img src="${c.urlPreparada}" alt="Versión preparada para leer"><figcaption>Lista para leer</figcaption></figure>
      </div>
      ${marcoRecorte(t.clave, c)}
      <p class="toma__dictamen toma__dictamen--${estado}">${dictamen}</p>
      ${problemas ? `<ul class="toma__problemas">${problemas}</ul>` : ''}
      <div class="toma__botones">
        <button class="boton" data-camara="${t.clave}">Repetir foto</button>
        <button class="boton" data-galeria="${t.clave}">Elegir otra</button>
      </div>
    </div>`;
}

export function analizar() {
  const listo = TOMAS.filter((t) => t.obligatoria).every((t) => capturas.has(t.clave));
  return `
    <h1 class="titulo">Analizar</h1>
    <p class="texto">Fotografía la tabla y los ingredientes. Las fotos no salen de tu teléfono: se procesan aquí dentro.</p>

    <div id="tomas">${TOMAS.map(tarjetaToma).join('')}</div>

    <button class="boton-grande" id="btnLeer" ${listo ? '' : 'disabled'} style="margin-top:24px">
      ${listo ? 'LEER LAS FOTOS' : 'FALTAN FOTOS'}
      <small>${listo ? 'Se lee aquí dentro, sin enviar nada' : 'Hacen falta la tabla y los ingredientes'}</small>
    </button>
    <p class="texto" id="estadoLectura" style="margin-top:12px"></p>

    <h2 class="subtitulo">O pega el texto</h2>
    <p class="texto">Haz la foto, mantén el dedo sobre el texto, copia y pega aquí. Tu iPhone lee mejor que ningún programa, y no hace falta descargar nada.</p>
    <label class="rotulo" for="pegaTabla">Tabla nutricional</label>
    <textarea id="pegaTabla" class="pegar pegar--alta" rows="12" placeholder="Valor energético 467 kcal&#10;Grasas 20 g&#10;..."></textarea>
    <label class="rotulo" for="pegaIng" style="margin-top:16px">Lista de ingredientes</label>
    <textarea id="pegaIng" class="pegar pegar--alta" rows="9" placeholder="Ingredientes: harina de trigo, azúcar, ..."></textarea>
    <button class="boton" id="btnPegado" style="margin-top:12px; width:100%">Interpretar el texto pegado</button>

    <div id="resumenLectura" style="margin-top:24px"></div>
    <button class="boton-grande" id="btnRevisar" style="margin-top:16px; display:none">
      REVISAR Y CORREGIR
      <small>Comprueba las cifras antes de analizar</small>
    </button>

    <div style="margin-top:24px">
      ${pendiente('<b>Hasta aquí llega el módulo 6.</b> La lectura ya funciona y verás abajo lo que ha entendido. La pantalla donde podrás corregir campo por campo antes de analizar es el módulo 7.')}
    </div>
  `;
}

export function analizarActivo(raiz, { repintar, irA }) {
  const zona = raiz.querySelector('#tomas');
  if (!zona) return;

  async function tomar(clave, deGaleria = false) {
    const fichero = await pedirFoto({ camara: !deGaleria });
    if (!fichero) return;

    const tarjeta = zona.querySelector(`[data-toma="${clave}"]`);
    if (tarjeta) tarjeta.classList.add('toma--trabajando');
    // Un respiro para que el navegador pinte el estado de espera antes de
    // ponerse con el procesado, que es pesado y en un móvil se nota.
    await new Promise((r) => setTimeout(r, 30));

    try {
      const { original, preparada, calidad } = await capturar(fichero);
      capturas.set(clave, {
        calidad, preparada, original, fichero,
        recorte: { ...RECORTE_COMPLETO },
        recortando: false,
        // Se guarda también la foto entera para poder enseñar el marco encima
        // cuando se vaya a recortar.
        urlCompleta: aURL(original, 0.6),
        urlOriginal: aURL(original, 0.6),
        urlPreparada: aURL(preparada, 0.6),
      });
    } catch (err) {
      capturas.delete(clave);
      alert(`No se ha podido usar esa imagen. ${err.message}`);
    }
    repintar();
  }

  /** Vuelve a procesar la foto con el recorte que haya marcado. */
  async function aplicarRecorte(clave, recorte) {
    const c = capturas.get(clave);
    if (!c) return;
    const tarjeta = zona.querySelector(`[data-toma="${clave}"]`);
    if (tarjeta) tarjeta.classList.add('toma--trabajando');
    await new Promise((r) => setTimeout(r, 30));
    try {
      const { original, preparada, calidad } = await capturar(c.fichero, recorte);
      capturas.set(clave, {
        ...c, calidad, preparada, original, recorte, recortando: false,
        urlOriginal: aURL(original, 0.6),
        urlPreparada: aURL(preparada, 0.6),
      });
    } catch (err) {
      alert(`No se ha podido recortar. ${err.message}`);
    }
    repintar();
  }

  // Mover un deslizador solo mueve el marco. Repintar en cada movimiento
  // robaría el foco del deslizador a media pasada.
  zona.addEventListener('input', (e) => {
    const eje = e.target.dataset.desliza;
    if (!eje) return;
    const clave = e.target.dataset.toma;
    const c = capturas.get(clave);
    if (!c) return;
    c.recorte[eje] = Number(e.target.value);
    const r = c.recorte;
    const marco = zona.querySelector(`#marco_${clave}`);
    if (!marco) return;
    // Se pinta enderezado aunque los deslizadores estén cruzados.
    const x0 = Math.min(r.x0, r.x1), x1 = Math.max(r.x0, r.x1);
    const y0 = Math.min(r.y0, r.y1), y1 = Math.max(r.y0, r.y1);
    marco.style.left = `${x0}%`;
    marco.style.top = `${y0}%`;
    marco.style.width = `${x1 - x0}%`;
    marco.style.height = `${y1 - y0}%`;
  });

  zona.addEventListener('click', (e) => {
    const abrir = e.target.closest('[data-recortar]');
    if (abrir) {
      const c = capturas.get(abrir.dataset.recortar);
      if (c) { c.recortando = true; repintar(); }
      return;
    }
    const aplicar = e.target.closest('[data-aplicar-recorte]');
    if (aplicar) {
      const c = capturas.get(aplicar.dataset.aplicarRecorte);
      if (c) aplicarRecorte(aplicar.dataset.aplicarRecorte, { ...c.recorte });
      return;
    }
    const quitar = e.target.closest('[data-quitar-recorte]');
    if (quitar) {
      aplicarRecorte(quitar.dataset.quitarRecorte, { ...RECORTE_COMPLETO });
      return;
    }
    const galeria = e.target.closest('[data-galeria]');
    if (galeria) { tomar(galeria.dataset.galeria, true); return; }
    const camara = e.target.closest('[data-camara]');
    if (camara) { tomar(camara.dataset.camara, false); return; }
    const repetir = e.target.closest('[data-repetir]');
    if (repetir) { tomar(repetir.dataset.repetir, false); return; }
  });

  const estado = raiz.querySelector('#estadoLectura');
  const resumen = raiz.querySelector('#resumenLectura');

  /** Cifra con coma decimal, que es como se escribe en español. */
  function conComa(v) {
    return String(v).replace('.', ',');
  }

  function pintarResumen() {
    const t = leido.tabla;
    const i = leido.ingredientes;
    if (!t && !i) { resumen.innerHTML = ''; return; }

    // El validador se ejecuta AQUÍ, sobre lo que se acaba de leer. Enseñar los
    // números sin comprobarlos antes fue un error: la app llegó a mostrar 8 g
    // de sal en un aperitivo sin decir una palabra.
    let incidencias = [];
    if (t) {
      const primero = (i?.ingredientes?.[0]?.texto ?? '').toLowerCase();
      const esSalado = /^sal\b/.test(primero) ||
        (i?.ingredientes ?? []).some((x) => /caldo|cubito|concentrado|sazonador/i.test(x.texto));
      const n = normalizarNutrientes(t.nutrientes);
      incidencias = validar(n, esSalado).incidencias;
      if (i?.ingredientes?.length) {
        const texto = i.ingredientes.map((x) => x.texto.toLowerCase()).join(' | ');
        incidencias = incidencias.concat(validarContraIngredientes(n, {
          total: i.ingredientes.length,
          hayFuenteAzucar: /azucar|azúcar|jarabe|dextrosa|glucosa|fructosa|maltodextrina|miel|melaza|sacarosa|panela|sirope/.test(texto),
          hayLacteo: /leche|lacteo|lácteo|yogur|nata|suero|queso|lactosa/.test(texto),
          hayFruta: /fruta|zumo|pure|puré|manzana|platano|plátano|naranja|fresa|melocoton|melocotón|pera|uva|datil|dátil/.test(texto),
          hayGrasaAnadida: /aceite|grasa|mantequilla|manteca|margarina/.test(texto),
          haySal: /\bsal\b|salmuera/.test(texto),
        }));
      }
    }
    const porCampo = new Map();
    for (const inc of incidencias) for (const c of inc.campos) porCampo.set(c, inc.gravedad);

    const campos = t ? Object.entries(t.nutrientes) : [];
    const filas = campos.map(([k, d]) => {
      const marca = porCampo.get(k);
      // Un campo leído con poca confianza se marca aunque no haya incidencia:
      // el aviso puede llegar tarde y la cifra ya está en pantalla.
      const flojo = typeof d.confianzaOCR === 'number' && d.confianzaOCR <= 0.5;
      const clase = marca === 'error' ? 'dudoso dudoso--error'
        : (marca === 'aviso' || flojo) ? 'dudoso' : '';
      const nota = flojo && !marca ? ' <em class="apunte">lectura dudosa</em>' : '';
      return `<li class="${clase}"><span>${esc(NOMBRES[k] ?? k)}${nota}</span>` +
             `<b class="valor cifra">${conComa(d.valor)} ${UNIDAD[k] ?? ''}</b></li>`;
    }).join('');

    const problemas = incidencias.map((inc) => `
      <li class="incidencia incidencia--${inc.gravedad}">
        <b>${inc.gravedad === 'error' ? 'No cuadra' : 'Revisa esto'}</b><br>${esc(inc.mensaje)}
        ${inc.correccion ? `<br><span class="cifra">${conComa(inc.correccion.valorActual)} → ${conComa(inc.correccion.valorPropuesto)}</span>` : ''}
      </li>`).join('');

    const avisos = [...(t?.avisos ?? []), ...(i?.avisos ?? [])]
      .map((a) => `<li>${esc(a)}</li>`).join('');

    const botonRevisar = raiz.querySelector('#btnRevisar');
    if (botonRevisar) botonRevisar.style.display = '';

    resumen.innerHTML = `
      <h2 class="subtitulo">Lo que se ha entendido</h2>
      ${t ? `<div class="tarjeta"><ul class="diagnostico">${filas || '<li>Nada reconocible en la tabla</li>'}</ul></div>` : ''}
      ${problemas ? `<h3 class="rotulo" style="margin-top:20px">Cifras que no encajan</h3><ul class="incidencias">${problemas}</ul>` : ''}
      ${i ? `<p class="texto" style="margin-top:12px"><strong>${i.ingredientes.length} ingrediente(s):</strong> ${esc(i.ingredientes.map((x) => x.texto).join(', ')) || 'ninguno'}</p>` : ''}
      ${i && i.trazas.length ? `<p class="texto">Trazas declaradas: ${esc(i.trazas.join(', '))}</p>` : ''}
      ${avisos ? `<div class="pendiente" style="margin-top:12px"><ul style="margin:0;padding-left:1.1em">${avisos}</ul></div>` : ''}`;
  }

  raiz.querySelector('#btnLeer')?.addEventListener('click', async () => {
    estado.textContent = 'Preparando el lector…';
    for (const clave of ['tabla', 'ingredientes']) {
      const r = await leerCaptura(clave, (p, s2) => {
        estado.textContent = `${s2 === 'recognizing text' ? 'Leyendo' : 'Preparando'} ${clave}… ${Math.round(p * 100)} %`;
      });
      if (!r.ok) { estado.textContent = r.motivo; return; }
      interpretar(clave, r.texto);
    }
    estado.textContent = 'Listo. Revisa abajo lo que ha entendido.';
    pintarResumen();
  });

  raiz.querySelector('#btnPegado')?.addEventListener('click', () => {
    const t = raiz.querySelector('#pegaTabla').value.trim();
    const i = raiz.querySelector('#pegaIng').value.trim();
    if (!t && !i) { estado.textContent = 'No has pegado nada todavía.'; return; }
    if (t) interpretar('tabla', t);
    if (i) interpretar('ingredientes', i);
    estado.textContent = 'Texto interpretado.';
    pintarResumen();
  });

  raiz.querySelector('#btnRevisar')?.addEventListener('click', () => irA('revisar'));

  pintarResumen();
}

const NOMBRES = {
  energia_kcal: 'Energía', energia_kj: 'Energía (kJ)', grasas_g: 'Grasas',
  saturadas_g: 'de las cuales saturadas', monoinsaturadas_g: 'Monoinsaturadas',
  poliinsaturadas_g: 'Poliinsaturadas', trans_g: 'Grasas trans',
  hidratos_g: 'Hidratos de carbono', azucares_g: 'de los cuales azúcares',
  polialcoholes_g: 'Polialcoholes', fibra_g: 'Fibra', proteinas_g: 'Proteínas',
  sal_g: 'Sal', sodio_mg: 'Sodio',
};
const UNIDAD = {
  energia_kcal: 'kcal', energia_kj: 'kJ', sodio_mg: 'mg',
  grasas_g: 'g', saturadas_g: 'g', monoinsaturadas_g: 'g', poliinsaturadas_g: 'g',
  trans_g: 'g', hidratos_g: 'g', azucares_g: 'g', polialcoholes_g: 'g',
  fibra_g: 'g', proteinas_g: 'g', sal_g: 'g',
};

/** Lo leído hasta ahora, para que el módulo 7 lo recoja. */
export const leido = { tabla: null, ingredientes: null };

export function capturasActuales() {
  return capturas;
}

/**
 * Lee una captura y la convierte en datos.
 * Devuelve el motivo si no se ha podido, para poder decirlo en pantalla.
 */
export async function leerCaptura(clave, alProgresar) {
  const c = capturas.get(clave);
  if (!c) return { ok: false, motivo: 'No hay foto todavía.' };

  const r = await leerTexto(c.preparada, alProgresar);
  if (!r) {
    return {
      ok: false,
      motivo: 'El lector automático no está instalado en esta copia de la app. Usa la vía de pegar texto: en tu iPhone sale mejor.',
    };
  }
  return { ok: true, texto: r.texto, confianza: r.confianza };
}

/** Convierte texto suelto en datos, venga de donde venga. */
export function interpretar(clave, texto) {
  if (clave === 'tabla') {
    leido.tabla = analizarTabla(texto);
    // Lo leído pasa al estado compartido para que Revisar trabaje sobre ello.
    // Lo ya corregido a mano no se pisa: ahí manda la persona.
    for (const [k, d] of Object.entries(leido.tabla.nutrientes)) {
      if (enCurso.nutrientes[k]?.estado === 'corregido') continue;
      enCurso.nutrientes[k] = d;
    }
    if (leido.tabla.racionGramos && !enCurso.racionGramos) {
      enCurso.racionGramos = leido.tabla.racionGramos;
    }
    enCurso.avisosLectura = leido.tabla.avisos;
    return leido.tabla;
  }
  leido.ingredientes = analizarIngredientesTexto(texto);
  enCurso.ingredientes = leido.ingredientes.ingredientes.map(
    (i) => ({ texto: i.texto, porcentaje: i.porcentaje }));
  enCurso.trazas = leido.ingredientes.trazas;
  return leido.ingredientes;
}

export { lectorDisponible };
