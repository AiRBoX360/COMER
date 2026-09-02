/**
 * VERDICTO · Piezas de interfaz reutilizables.
 *
 * Todo lo que se repita en más de una pantalla vive aquí. Cuando lleguen los
 * módulos de resultado y despensa, ya estará construido.
 */
import { NIVELES as NIVELES_MOTOR } from './motor.js';

/** Los cinco niveles. El texto va siempre con el color, nunca el color solo. */
/**
 * Los cinco niveles, tomados del motor.
 *
 * Antes estaban escritos a mano aquí, y se desviaron: la interfaz decía
 * "verde-claro" con guion y el motor "verde_claro" con guion bajo. Los
 * productos verdes no encajaban en ningún bloque de la Despensa, así que se
 * guardaban bien y desaparecían de la vista. Los rojos y naranjas sí se veían,
 * porque ahí los dos nombres coincidían por casualidad, y eso hizo el fallo
 * mucho más difícil de ver.
 *
 * Ahora hay una sola fuente. Duplicar una lista es duplicar un error futuro.
 */
export const NIVELES = NIVELES_MOTOR.map((n, i) => ({
  clave: n.clave,
  desde: n.desde,
  hasta: i + 1 < NIVELES_MOTOR.length ? NIVELES_MOTOR[i + 1].desde - 1 : 100,
  texto: n.etiqueta,
}));

/** Devuelve el nivel que corresponde a una nota de 0 a 100. */
export function nivelDeNota(nota) {
  const n = Math.max(0, Math.min(100, Number(nota) || 0));
  return NIVELES.find((x) => n >= x.desde && n <= x.hasta) ?? NIVELES[0];
}

/** Escapa texto antes de meterlo en el HTML. */
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/**
 * La banda de veredicto: los cinco tramos, con el del producto expandido.
 * Es el elemento con el que se reconoce la aplicación.
 */
export function banda(nota) {
  const actual = nivelDeNota(nota);
  const tramos = NIVELES
    .slice()
    .reverse()
    .map((n, i) => {
      const esActual = n.clave === actual.clave ? ' es-actual' : '';
      // El número de nivel es una señal que no depende del color. Quien no
      // distinga el rojo del verde ve igualmente que el 1 está abajo del todo.
      const posicion = NIVELES.length - i;
      return `<div class="banda__tramo${esActual}" data-nivel="${n.clave}">` +
             `<b class="banda__pos">${posicion}</b>${esc(n.texto)}</div>`;
    })
    .join('');
  const posActual = NIVELES.findIndex((n) => n.clave === actual.clave) + 1;
  return `<div class="banda" role="img" aria-label="Clasificación nivel ${posActual} de 5: ${esc(actual.texto)}, ${Math.round(nota)} sobre 100">${tramos}</div>`;
}

/** La nota grande, con el color de su nivel. */
export function marcador(nota) {
  const n = nivelDeNota(nota);
  return `
    <div class="veredicto" data-nivel="${n.clave}">
      <span class="veredicto__nota">${Math.round(nota)}</span>
      <span class="veredicto__total">/ 100</span>
    </div>`;
}

/** Estado vacío. Invita a hacer algo, no se disculpa. */
export function vacio(titulo, texto) {
  return `<div class="vacio"><h3>${esc(titulo)}</h3><p>${esc(texto)}</p></div>`;
}

/** Aviso de que una parte todavía no existe. Sin adornos. */
export function pendiente(texto) {
  return `<div class="pendiente"><div>${texto}</div></div>`;
}
