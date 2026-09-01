/**
 * VERDICTO · Piezas de interfaz reutilizables.
 *
 * Todo lo que se repita en más de una pantalla vive aquí. Cuando lleguen los
 * módulos de resultado y despensa, ya estará construido.
 */

/** Los cinco niveles. El texto va siempre con el color, nunca el color solo. */
export const NIVELES = [
  { clave: 'rojo',          desde: 0,  hasta: 29,  texto: 'Consumo ocasional' },
  { clave: 'naranja',       desde: 30, hasta: 49,  texto: 'Con moderación' },
  { clave: 'amarillo',      desde: 50, hasta: 69,  texto: 'Aceptable, hay mejores' },
  { clave: 'verde-claro',   desde: 70, hasta: 84,  texto: 'Buena elección habitual' },
  { clave: 'verde-parchis', desde: 85, hasta: 100, texto: 'Especialmente favorable' },
];

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
