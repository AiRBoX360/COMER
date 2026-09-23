/**
 * El recordatorio de hacer copia de seguridad.
 *
 * Los datos viven solo en este teléfono. Si el navegador se queda sin espacio,
 * o se borran los datos del sitio, desaparecen. Eso ya se avisaba en la
 * Despensa, pero avisar donde nadie mira no es avisar.
 *
 * Así que se dice justo después de guardar un producto, que es el momento en
 * el que acabas de añadir algo que perderías.
 *
 * Con moderación: cada diez productos guardados desde la última copia. Ni cada
 * vez, que se convierte en ruido y se ignora, ni nunca.
 */

const CLAVE_DESDE = 'catario.copia.desde';
const CLAVE_FECHA = 'catario.copia.fecha';
/** Cada cuántos productos guardados se recuerda. */
export const CADA = 10;

const leer = (k, x = 0) => {
  try { return Number(localStorage.getItem(k) ?? x); } catch { return x; }
};
const poner = (k, v) => {
  try { localStorage.setItem(k, String(v)); } catch { /* sin memoria, se pierde la cuenta */ }
};

/** Se llama al guardar un producto. Devuelve cuántos van sin copia. */
export function contarGuardado() {
  const n = leer(CLAVE_DESDE) + 1;
  poner(CLAVE_DESDE, n);
  return n;
}

/** Se llama al hacer una copia: la cuenta vuelve a cero. */
export function copiaHecha() {
  poner(CLAVE_DESDE, 0);
  poner(CLAVE_FECHA, Date.now());
}

/** ¿Toca recordarlo? */
export function tocaRecordar() {
  return leer(CLAVE_DESDE) >= CADA;
}

/** Cuántos productos llevas sin guardar copia. */
export function sinCopia() {
  return leer(CLAVE_DESDE);
}

/** Cuándo se hizo la última, o null si no se ha hecho ninguna. */
export function ultimaCopia() {
  const t = leer(CLAVE_FECHA);
  return t > 0 ? new Date(t) : null;
}

/** Cómo contarlo, en una frase. */
export function textoRecordatorio() {
  const n = sinCopia();
  const ultima = ultimaCopia();
  if (!ultima) {
    return `Llevas ${n} productos guardados y ninguna copia de seguridad. `
      + 'Si este navegador se queda sin espacio, los perderías todos.';
  }
  const dias = Math.floor((Date.now() - ultima.getTime()) / 86400000);
  const cuando = dias === 0 ? 'hoy' : dias === 1 ? 'ayer' : `hace ${dias} días`;
  return `Has guardado ${n} productos desde tu última copia, que hiciste ${cuando}.`;
}
