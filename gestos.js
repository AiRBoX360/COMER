/**
 * Cambiar de pestaña deslizando el dedo.
 *
 * Escrito con desconfianza, por una razón concreta: el recorte de fotos se
 * maneja con deslizadores horizontales, y un gesto global de "dedo hacia la
 * derecha" podría cambiar de pestaña mientras ajustas uno.
 *
 * De ahí las tres defensas:
 *
 *   1. El gesto se descarta si empieza sobre algo con lo que ya se interactúa:
 *      un deslizador, un cuadro de texto, un desplegable o la zona de recorte.
 *   2. Tiene que ser claramente horizontal (el doble que en vertical) y
 *      bastante largo, para no confundirlo con un desplazamiento normal.
 *   3. Se puede apagar desde Inicio. Si estorba, se apaga y nada más cambia.
 *
 * ADVERTENCIA HONESTA: los gestos táctiles no se han podido probar de forma
 * automática. Aquí no hay pantalla táctil. Lo único verificado es la decisión
 * de si un gesto cuenta o no, que sí es una función pura y tiene sus pruebas.
 */

const CLAVE = 'comer.deslizar';

/** Elementos sobre los que un arrastre horizontal significa otra cosa. */
const INTOCABLES = 'input, textarea, select, .recorte, .desliza, .pegar, [contenteditable]';

export const REGLAS = {
  distanciaMinima: 70,   // píxeles
  proporcionMinima: 2,   // el desplazamiento horizontal debe doblar al vertical
  tiempoMaximo: 700,     // ms; más lento que esto es un desplazamiento, no un gesto
};

/**
 * ¿Este gesto cuenta como cambio de pestaña? Función pura, con pruebas.
 * Devuelve 'anterior', 'siguiente' o null.
 */
export function decidirGesto({ dx, dy, ms, sobreIntocable }) {
  if (sobreIntocable) return null;
  if (ms > REGLAS.tiempoMaximo) return null;
  if (Math.abs(dx) < REGLAS.distanciaMinima) return null;
  if (Math.abs(dx) < Math.abs(dy) * REGLAS.proporcionMinima) return null;
  // Dedo hacia la derecha: se va a la pestaña de la izquierda.
  return dx > 0 ? 'anterior' : 'siguiente';
}

export function deslizarActivado() {
  try {
    return localStorage.getItem(CLAVE) !== 'no';
  } catch {
    return true;
  }
}

export function ponerDeslizar(activo) {
  try {
    localStorage.setItem(CLAVE, activo ? 'si' : 'no');
  } catch {
    // Si el navegador no deja guardar, vale para esta sesión y ya está.
  }
}

/** Engancha el gesto. `alCambiar` recibe 'anterior' o 'siguiente'. */
export function escucharGestos(elemento, alCambiar) {
  let x0 = 0, y0 = 0, t0 = 0, intocable = false, valido = false;

  elemento.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) { valido = false; return; }
    const t = e.touches[0];
    x0 = t.clientX; y0 = t.clientY; t0 = Date.now();
    intocable = Boolean(e.target.closest?.(INTOCABLES));
    valido = true;
  }, { passive: true });

  elemento.addEventListener('touchend', (e) => {
    if (!valido || !deslizarActivado()) return;
    valido = false;
    const t = e.changedTouches[0];
    const decision = decidirGesto({
      dx: t.clientX - x0,
      dy: t.clientY - y0,
      ms: Date.now() - t0,
      sobreIntocable: intocable,
    });
    if (decision) alCambiar(decision);
  }, { passive: true });
}
