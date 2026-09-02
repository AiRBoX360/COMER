/**
 * Leer el código de barras con la cámara.
 *
 * Dos caminos, y se usa el mejor de los dos que haya:
 *
 * 1. El lector que trae el propio navegador (BarcodeDetector). No descarga
 *    nada y va acelerado por hardware. Existe en Android, no en Safari.
 * 2. Un lector propio, empaquetado en la app. 1,2 MB, se carga solo cuando
 *    haces falta, y funciona en cualquier sitio.
 *
 * En un iPhone siempre será el segundo. Y si tampoco está, la app lo dice y
 * te deja teclear el número, que es lo que había hasta ahora.
 */

import { limpiarCodigo, codigoValido } from './motor.js';

const RUTA = './escaner/';
const TIPOS = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'];

let lectorPropio = null;
let cargando = null;

/** ¿Trae el navegador su propio lector? */
async function detectorNativo() {
  if (typeof BarcodeDetector === 'undefined') return null;
  try {
    const admitidos = await BarcodeDetector.getSupportedFormats();
    const formatos = TIPOS.filter((t) => admitidos.includes(t));
    if (formatos.length === 0) return null;
    return new BarcodeDetector({ formats: formatos });
  } catch {
    return null;
  }
}

/** Carga el lector propio. Devuelve null si no está subido a la app. */
async function cargarLectorPropio() {
  if (lectorPropio) return lectorPropio;
  if (cargando) return cargando;
  cargando = (async () => {
    try {
      const r = await fetch(`${RUTA}reader/index.js`, { method: 'HEAD' });
      if (!r.ok) return null;
      const mod = await import(`${RUTA}reader/index.js`);
      mod.prepareZXingModule({
        overrides: { locateFile: (f) => (f.endsWith('.wasm') ? `${RUTA}${f}` : f) },
      });
      lectorPropio = mod;
      return mod;
    } catch {
      return null;
    }
  })();
  return cargando;
}

export async function hayEscaner() {
  return Boolean(await detectorNativo()) || Boolean(await cargarLectorPropio());
}

/**
 * Enciende la cámara y busca un código.
 *
 * Devuelve el código en cuanto lo lee, o null si se cancela. Nunca lanza: un
 * fallo de cámara no debe romper la pantalla, y siempre queda teclearlo.
 */
export async function escanear({ video, alEstado = () => {} }) {
  let flujo = null;
  try {
    alEstado('Encendiendo la cámara…');
    flujo = await navigator.mediaDevices.getUserMedia({
      video: {
        // La trasera, y enfocando de cerca: un código de barras se lee a
        // un palmo, no a dos metros.
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
  } catch (err) {
    return {
      ok: false,
      motivo: err.name === 'NotAllowedError' ? 'permiso' : 'camara',
      mensaje: err.name === 'NotAllowedError'
        ? 'No has dado permiso para usar la cámara. Puedes darlo en los ajustes de Safari, o teclear el número a mano.'
        : `No se ha podido encender la cámara. ${err.message}. Puedes teclear el número a mano.`,
    };
  }

  video.srcObject = flujo;
  video.setAttribute('playsinline', '');   // sin esto, iOS abre el vídeo a pantalla completa
  await video.play().catch(() => {});

  const nativo = await detectorNativo();
  const propio = nativo ? null : await cargarLectorPropio();
  if (!nativo && !propio) {
    flujo.getTracks().forEach((t) => t.stop());
    return {
      ok: false, motivo: 'sin_lector',
      mensaje: 'El lector de códigos no está instalado en esta copia de la app. Teclea el número a mano.',
    };
  }

  alEstado('Apunta al código de barras…');

  const lienzo = document.createElement('canvas');
  const ctx = lienzo.getContext('2d', { willReadFrequently: true });
  const limite = Date.now() + 30000;   // medio minuto buscando y se rinde
  let parar = false;

  const detener = () => { parar = true; flujo.getTracks().forEach((t) => t.stop()); };

  try {
    while (!parar && Date.now() < limite) {
      if (video.readyState < 2) { await esperar(120); continue; }

      lienzo.width = video.videoWidth;
      lienzo.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      let codigo = null;
      if (nativo) {
        const encontrados = await nativo.detect(lienzo).catch(() => []);
        codigo = encontrados[0]?.rawValue ?? null;
      } else {
        const datos = ctx.getImageData(0, 0, lienzo.width, lienzo.height);
        const res = await propio.readBarcodesFromImageData(datos, {
          formats: ['EAN-13', 'EAN-8', 'UPC-A', 'UPC-E', 'Code128'],
          tryHarder: true,
        }).catch(() => []);
        codigo = res[0]?.text ?? null;
      }

      const limpio = limpiarCodigo(codigo ?? '');
      if (limpio && codigoValido(limpio)) {
        detener();
        return { ok: true, codigo: limpio };
      }
      // Un respiro entre intentos: sin él, el móvil se calienta y va a tirones.
      await esperar(nativo ? 150 : 320);
    }
  } finally {
    if (!parar) detener();
  }

  return {
    ok: false, motivo: 'no_leido',
    mensaje: 'No se ha podido leer ningún código en medio minuto. Prueba con más luz, sin reflejos y a un palmo de distancia, o teclea el número.',
  };
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
