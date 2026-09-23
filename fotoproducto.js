/**
 * La foto del producto que trae Open Food Facts.
 *
 * Sus fichas incluyen fotografía del envase, hecha por la gente que las sube.
 * Nosotros pedíamos ese campo desde el principio, llegaba hasta el análisis y
 * nadie lo usaba: un descuido, no una limitación.
 *
 * Se descarga y se GUARDA en el teléfono como una foto más, igual que si la
 * hubieras hecho tú. Así:
 *   · el producto se reconoce de un vistazo en la Despensa
 *   · sigue viéndose sin conexión, porque ya no depende de su servidor
 *   · si la borras o pones otra encima, manda la tuya
 *
 * Las fotos de Open Food Facts son de licencia libre con atribución. Para uso
 * personal no hay nada que hacer; si algún día esto se publica, hay que citar
 * la fuente. Queda dicho aquí para que no se olvide.
 */

/** Más de esto y no es la foto de un envase: no se guarda. */
const TOPE_BYTES = 400 * 1024;
const ESPERA_MS = 6000;

/**
 * Descarga la foto y devuelve sus bytes, o null si no se puede.
 *
 * Nunca lanza: que falte una foto no puede estropear un análisis.
 */
export async function descargarFotoProducto(url) {
  if (typeof url !== 'string' || !url.startsWith('https://')) return null;
  if (!navigator.onLine) return null;

  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_MS);
  try {
    const resp = await fetch(url, { signal: control.signal });
    if (!resp.ok) return null;

    const tipo = resp.headers.get('content-type') ?? '';
    if (!tipo.startsWith('image/')) return null;

    const bytes = await resp.arrayBuffer();
    if (bytes.byteLength === 0 || bytes.byteLength > TOPE_BYTES) return null;
    return bytes;
  } catch {
    // Sin cobertura, servidor caído o tardanza: se sigue sin foto.
    return null;
  } finally {
    clearTimeout(reloj);
  }
}
