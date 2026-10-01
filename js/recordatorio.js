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
 * Con moderación: cada diez productos guardados DESDE LA ÚLTIMA COPIA. La
 * cuenta no se reinicia por cambiar de día ni por cerrar la app: si hiciste la
 * copia con quince productos, el aviso vuelve al llegar a veinticinco, los
 * escanees de golpe o a lo largo de un mes.
 *
 * Y si lo apartas con "más tarde", no vuelve al producto siguiente: vuelve
 * diez productos después. Un aviso que sale cada vez deja de ser un aviso.
 */

const CLAVE_DESDE = 'catario.copia.desde';
const CLAVE_FECHA = 'catario.copia.fecha';
/** En qué cuenta se avisó por última vez. Sin esto, pasados los diez el aviso
 *  saltaría con cada producto guardado. */
const CLAVE_AVISADO = 'catario.copia.avisado';
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
  poner(CLAVE_AVISADO, 0);
  poner(CLAVE_FECHA, Date.now());
}

/**
 * ¿Toca recordarlo?
 *
 * Diez más desde el último aviso, no "diez o más": si lo apartaste con nueve
 * sin copia y guardas uno, el aviso saltaría otra vez, y al siguiente, y al
 * siguiente. Se cuenta desde donde se avisó, así que apartarlo da otros diez
 * productos de tregua, y la tregua sobrevive a cerrar la app.
 */
export function tocaRecordar() {
  return leer(CLAVE_DESDE) - leer(CLAVE_AVISADO) >= CADA;
}

/** Se llama al enseñar el aviso: marca desde dónde contar los diez siguientes. */
export function avisoMostrado() {
  poner(CLAVE_AVISADO, leer(CLAVE_DESDE));
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
