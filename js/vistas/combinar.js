import { esc } from '../ui.js';
import { nombrePantalla } from './inicio.js';
import { combinacionesEntre, queAnadir } from '../motor.js';
import { nuevaSeleccion, cargarDespensa, nombresElegidos,
         listaElegibles, campoExtras, engancharSeleccion } from '../elegirdespensa.js';

/**
 * Qué juntar: qué se potencia y qué se estorba entre lo que tienes.
 *
 * NO propone recetas y NO lleva a buscarlas. Para eso está la pantalla de
 * Recetas, que es otra cosa. Las dos eran el mismo fichero con una variable
 * que cambiaba la cara, así que cada una acababa ofreciendo la otra y no había
 * manera de distinguirlas.
 *
 * Lo que aquí se cuenta, y casi nadie cuenta, es el mecanismo: por qué el
 * hierro de las lentejas se absorbe mejor con vitamina C, o por qué el té con
 * la comida lo estorba.
 */

/**
 * Los puntos de color que dicen qué va con qué.
 *
 * Cada pareja posible entre tus alimentos recibe un color. Si el pistacho y la
 * naranja llevan el mismo punto azul, es que juntos hacen algo. Si el pistacho
 * lleva además uno morado, es que también va con otra cosa.
 *
 * Así no hay que ir probando a ciegas: se ve de un vistazo qué merece la pena
 * juntar antes de elegir nada.
 *
 * Los colores son flúor a propósito: ninguno se parece a los cinco del
 * semáforo, para que nadie lea un punto como si fuera una nota. Y como el
 * color solo no basta, cada punto lleva escrito qué significa.
 */
const COLORES_PAREJA = [
  { color: '#2962FF', nombre: 'azul eléctrico' },
  { color: '#E5007E', nombre: 'magenta' },
  { color: '#00C853', nombre: 'lima' },
  { color: '#FF6D00', nombre: 'naranja flúor' },
  { color: '#7C4DFF', nombre: 'violeta' },
  { color: '#00B8D4', nombre: 'cian' },
];

/**
 * Qué combinaciones hay entre todos los alimentos de la lista.
 *
 * Devuelve un mapa de nombre de alimento a los colores que le tocan, y la
 * leyenda para explicarlos.
 */
function mapaDeParejas(nombres) {
  const encontradas = [];
  for (let i = 0; i < nombres.length; i += 1) {
    for (let j = i + 1; j < nombres.length; j += 1) {
      for (const c of combinacionesEntre([nombres[i], nombres[j]])) {
        if (c.clase !== 'sinergia') continue;
        let ya = encontradas.find((x) => x.clave === c.clave);
        if (!ya) {
          ya = { clave: c.clave, titulo: c.titulo, queOcurre: c.queOcurre, con: new Set() };
          encontradas.push(ya);
        }
        ya.con.add(nombres[i]);
        ya.con.add(nombres[j]);
      }
    }
  }

  // Más colores de los que se distinguen no ayudan: se quedan los que más
  // alimentos tocan.
  encontradas.sort((a, b) => b.con.size - a.con.size);
  const usadas = encontradas.slice(0, COLORES_PAREJA.length);

  const porAlimento = new Map();
  const leyenda = [];
  usadas.forEach((c, i) => {
    const col = COLORES_PAREJA[i];
    leyenda.push({ ...col, titulo: c.titulo, queOcurre: c.queOcurre });
    for (const n of c.con) {
      if (!porAlimento.has(n)) porAlimento.set(n, []);
      porAlimento.get(n).push({ ...col, titulo: c.titulo });
    }
  });
  return { porAlimento, leyenda, sobran: encontradas.length - usadas.length };
}

/** Los puntos que van detrás del nombre. */
function puntos(lista) {
  if (!lista || lista.length === 0) return '';
  return `<span class="puntos">${lista.map((p) => `
    <i class="punto" style="background:${p.color}" title="${esc(p.titulo)}"
       aria-label="${esc(p.titulo)}"></i>`).join('')}</span>`;
}

let sel = nuevaSeleccion();

export function reiniciarCombinar() {
  sel = nuevaSeleccion();
}

export function combinar() {
  if (!sel.cargado) {
    return `
      ${nombrePantalla('qué juntar')}
      <p class="texto">Cargando tu despensa…</p>`;
  }

  const nombres = nombresElegidos(sel);
  const halladas = nombres.length >= 2 ? combinacionesEntre(nombres) : [];

  // Los puntos se calculan sobre TODO lo guardado, no sobre lo elegido: sirven
  // justamente para decidir qué elegir.
  const parejas = mapaDeParejas(sel.guardados.map((p) => p.nombre));
  const sugerencias = nombres.length >= 1 ? queAnadir(nombres) : [];

  return `
    ${nombrePantalla('qué juntar')}
    <p class="texto">Une los colores para encontrar combinaciones ganadoras: dos alimentos con el mismo punto se potencian entre sí. Elígelos y te cuento por qué.</p>

    <h2 class="rotulo">De tu despensa</h2>
    ${listaElegibles(sel, (p) => puntos(parejas.porAlimento.get(p.nombre)))}

    ${parejas.leyenda.length ? `
      <div class="leyenda">
        <p class="apunte-via">Los alimentos con el mismo punto se potencian entre sí.</p>
        ${parejas.leyenda.map((l) => `
          <div class="leyenda__fila">
            <i class="punto" style="background:${l.color}"></i>
            <span><b>${esc(l.titulo)}.</b> ${esc(l.queOcurre)}</span>
          </div>`).join('')}
        ${parejas.sobran > 0 ? `
          <p class="apunte-via">Hay ${parejas.sobran} combinación(es) más entre lo que tienes, que no caben en colores distinguibles. Elige dos cosas y te las cuento.</p>` : ''}
      </div>` : ''}

    ${campoExtras(sel, 'Cosas que no tienes guardadas, para ver si encajan con lo demás.')}

    ${nombres.length === 0
      ? '<p class="texto" style="margin-top:24px">Elige algo de arriba para empezar.</p>'
      : ''}

    ${halladas.length > 0 ? `
      <h2 class="subtitulo">Lo que pasa al juntarlos</h2>
      ${halladas.map(tarjetaCombinacion).join('')}` : ''}

    ${nombres.length >= 1 && halladas.length === 0 ? `
      <div class="tarjeta" style="margin-top:20px">
        <p class="texto">
          ${nombres.length === 1
            ? 'Con una sola cosa no hay nada que juntar. Elige otra, o mira lo de abajo.'
            : 'No conozco ninguna interacción entre lo que has elegido. Eso no significa que no combinen: significa que no tengo nada demostrado que contarte, y prefiero decirlo a inventármelo.'}
        </p>
      </div>` : ''}

    ${sugerencias.length ? `
      <h2 class="subtitulo">Con una cosa más</h2>
      <p class="texto" style="font-size:var(--t2)">Lo que desbloquearías si lo añadieras a lo que ya tienes.</p>
      ${sugerencias.map((s) => `
        <div class="sugerencia">
          <b>+ ${esc(s.alimento)}</b>
          <span><b>${esc(s.desbloquea)}.</b> ${esc(s.porQue)}</span>
        </div>`).join('')}` : ''}
  `;
}

function tarjetaCombinacion(c) {
  const es = c.clase === 'sinergia';
  return `
    <details class="combi combi--${es ? 'suma' : 'resta'}">
      <summary>
        <span class="combi__signo" aria-hidden="true">${es ? '+' : '−'}</span>
        <span class="combi__cabeza">
          <b>${esc(c.titulo)}</b>
          <small>${esc(c.ladoA)} + ${esc(c.ladoB)}</small>
        </span>
      </summary>
      <div class="combi__cuerpo">
        <p class="combi__que">${esc(c.queOcurre)}</p>
        <p class="combi__linea"><b>Por qué.</b> ${esc(c.porQue)}</p>
        <p class="combi__linea"><b>Qué hacer.</b> ${esc(c.queHacer)}</p>
      </div>
    </details>`;
}

export async function combinarActivo(raiz, { repintar }) {
  if (await cargarDespensa(sel)) { repintar(); return; }
  engancharSeleccion(raiz, sel, repintar);
}
