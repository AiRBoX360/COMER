/**
 * Cámara.
 *
 * Es el único trozo del proyecto que toca el navegador de verdad: abrir la
 * cámara, decodificar la foto y pasarla a píxeles. Todo lo que viene después
 * son las funciones del motor, que están probadas fuera del navegador.
 *
 * Se usa <input capture> y no getMediaStream a propósito. La cámara nativa del
 * iPhone enfoca y estabiliza mejor que nada que yo pueda montar en HTML, y
 * getMediaStream da problemas en Safari según el contexto.
 */

import { evaluarCalidad, prepararParaLectura } from './motor.js';

/** Abre la cámara y devuelve el fichero elegido, o null si se cancela. */
export function pedirFoto({ camara = true } = {}) {
  return new Promise((resuelve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (camara) input.capture = 'environment';
    input.style.display = 'none';

    let resuelto = false;
    const acabar = (v) => { if (!resuelto) { resuelto = true; input.remove(); resuelve(v); } };

    input.addEventListener('change', () => acabar(input.files?.[0] ?? null));
    // Si el usuario cancela, iOS no dispara ningún evento. Se detecta cuando
    // la ventana recupera el foco sin que haya llegado ningún fichero.
    window.addEventListener('focus', () => setTimeout(() => {
      if (!input.files?.length) acabar(null);
    }, 1200), { once: true });

    document.body.appendChild(input);
    input.click();
  });
}

/** Decodifica un fichero de imagen a píxeles, reduciéndolo por el camino. */
export async function aPixeles(fichero, ladoMax = 2000) {
  const url = URL.createObjectURL(fichero);
  try {
    const bitmap = await cargarBitmap(url);
    const escala = Math.min(1, ladoMax / Math.max(bitmap.width, bitmap.height));
    const ancho = Math.max(1, Math.round(bitmap.width * escala));
    const alto = Math.max(1, Math.round(bitmap.height * escala));

    const lienzo = document.createElement('canvas');
    lienzo.width = ancho;
    lienzo.height = alto;
    const ctx = lienzo.getContext('2d', { willReadFrequently: true });
    // La reducción grande la hace el navegador, que va acelerada por hardware.
    // El trabajo fino ya lo hacen las funciones del motor sobre menos píxeles.
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, ancho, alto);
    if (bitmap.close) bitmap.close();

    const datos = ctx.getImageData(0, 0, ancho, alto);
    return { datos: datos.data, ancho, alto };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function cargarBitmap(url) {
  // createImageBitmap respeta la orientación EXIF; en Safari viejo no existe.
  if (typeof createImageBitmap === 'function') {
    return fetch(url)
      .then((r) => r.blob())
      .then((b) => createImageBitmap(b, { imageOrientation: 'from-image' }))
      .catch(() => cargarConImg(url));
  }
  return cargarConImg(url);
}

function cargarConImg(url) {
  return new Promise((resuelve, rechaza) => {
    const img = new Image();
    img.onload = () => resuelve(img);
    img.onerror = () => rechaza(new Error('No se ha podido abrir la imagen'));
    img.src = url;
  });
}

/** Convierte píxeles en algo que se pueda pintar en pantalla. */
export function aURL(imagen, calidad = 0.8) {
  const lienzo = document.createElement('canvas');
  lienzo.width = imagen.ancho;
  lienzo.height = imagen.alto;
  const ctx = lienzo.getContext('2d');
  ctx.putImageData(new ImageData(imagen.datos, imagen.ancho, imagen.alto), 0, 0);
  return lienzo.toDataURL('image/jpeg', calidad);
}

/** Convierte píxeles en bytes para guardarlos. */
export function aBytes(imagen, calidad = 0.72) {
  return new Promise((resuelve) => {
    const lienzo = document.createElement('canvas');
    lienzo.width = imagen.ancho;
    lienzo.height = imagen.alto;
    const ctx = lienzo.getContext('2d');
    ctx.putImageData(new ImageData(imagen.datos, imagen.ancho, imagen.alto), 0, 0);
    lienzo.toBlob(
      (blob) => blob.arrayBuffer().then(resuelve),
      'image/jpeg',
      calidad,
    );
  });
}

/**
 * El proceso completo de una captura.
 * Devuelve el original reducido, la versión preparada para leer, y el
 * dictamen sobre si la foto sirve.
 */
export async function capturar(fichero) {
  const original = await aPixeles(fichero);
  const calidad = evaluarCalidad(original);
  const preparada = prepararParaLectura(original, { ladoMax: 1600 });
  return { original, preparada, calidad };
}
