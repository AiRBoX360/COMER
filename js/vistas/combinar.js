import { esc } from '../ui.js';
import { listar } from '../almacen.js';
import { combinacionesEntre, queAnadir, FRESCOS } from '../motor.js';

/**
 * Qué merece la pena juntar de lo que tienes en casa.
 *
 * NO propone recetas. La app no sabe cocinar y no lo va a fingir: una receta
 * generada a partir de plantillas sería la parte más floja de todo el
 * proyecto, y justo la que contradice que aquí nada se inventa.
 *
 * Lo que sí puede decir, y casi nadie dice, es qué alimentos se potencian
 * entre sí y cuáles se estorban, con el mecanismo detrás. Para lo demás está
 * el botón de buscar recetas de verdad, escritas por personas.
 */

let elegidos = new Set();
let extras = [];
let guardados = [];
let cargado = false;

export function reiniciarCombinar() {
  elegidos = new Set();
  extras = [];
  cargado = false;
}

export function combinar() {
  if (!cargado) {
    return `
      <h1 class="titulo">Qué juntar</h1>
      <p class="texto">Cargando tu despensa…</p>`;
  }

  const nombres = [...[...elegidos].map((id) =>
    guardados.find((p) => p.id === id)?.nombre ?? ''), ...extras].filter(Boolean);
  const halladas = nombres.length >= 2 ? combinacionesEntre(nombres) : [];
  const sugerencias = nombres.length >= 1 ? queAnadir(nombres) : [];

  return `
    <h1 class="titulo">Qué juntar</h1>
    <p class="texto">Elige lo que tienes a mano. Te digo qué se potencia entre sí y qué conviene separar, y por qué.</p>

    <h2 class="rotulo">De tu despensa</h2>
    ${guardados.length === 0
      ? '<p class="texto">Todavía no has guardado nada. Analiza algún producto primero.</p>'
      : `<div class="elegibles">
          ${guardados.map((p) => `
            <button class="elegible${elegidos.has(p.id) ? ' es-elegido' : ''}"
                    data-elegir="${p.id}" aria-pressed="${elegidos.has(p.id)}">
              ${esc(p.nombre)}
            </button>`).join('')}
        </div>`}

    <h2 class="rotulo" style="margin-top:20px">Añadir hasta tres más</h2>
    <p class="texto" style="font-size:0.9rem">Cosas que no tienes guardadas pero podrías comprar.</p>
    <div class="campo">
      <div class="campo__entrada">
        <input id="extraCombinar" type="search" list="listaFrescos"
               placeholder="pimiento, limón, aceite de oliva…" autocomplete="off"
               ${extras.length >= 3 ? 'disabled' : ''}>
      </div>
    </div>
    <datalist id="listaFrescos">
      ${FRESCOS.map((f) => `<option value="${esc(f.nombre)}"></option>`).join('')}
    </datalist>
    ${extras.length ? `<div class="elegibles">
      ${extras.map((x, i) => `
        <button class="elegible es-elegido" data-quitar-extra="${i}">
          ${esc(x)} ×
        </button>`).join('')}
    </div>` : ''}

    ${nombres.length < 2
      ? `<p class="texto" style="margin-top:24px">Elige al menos dos cosas.</p>`
      : `
        ${halladas.length === 0
          ? `<div class="tarjeta" style="margin-top:24px">
               <p class="texto">No conozco ninguna interacción entre lo que has elegido. Eso no significa que no combinen: significa que no tengo nada demostrado que contarte.</p>
             </div>`
          : halladas.map(tarjetaCombinacion).join('')}

        <button class="boton-grande" id="btnRecetas" style="margin-top:20px">
          BUSCAR RECETAS CON ESTO
          <small>Abre el buscador con tus ingredientes. Sale de la app.</small>
        </button>`}

    ${sugerencias.length ? `
      <h2 class="subtitulo">Si añadieras una cosa</h2>
      ${sugerencias.map((s) => `
        <div class="sugerencia">
          <b>${esc(s.alimento)}</b>
          <span>${esc(s.desbloquea)} · ${esc(s.porQue)}</span>
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
  if (!cargado) {
    try {
      guardados = await listar({ orden: 'fecha_desc' });
    } catch { guardados = []; }
    cargado = true;
    repintar();
    return;
  }

  raiz.addEventListener('click', (e) => {
    const el = e.target.closest('[data-elegir]');
    if (el) {
      const id = el.dataset.elegir;
      if (elegidos.has(id)) elegidos.delete(id); else elegidos.add(id);
      repintar();
      return;
    }
    const q = e.target.closest('[data-quitar-extra]');
    if (q) {
      extras.splice(Number(q.dataset.quitarExtra), 1);
      repintar();
    }
  });

  const caja = raiz.querySelector('#extraCombinar');
  caja?.addEventListener('change', () => {
    const v = caja.value.trim();
    if (!v || extras.length >= 3 || extras.includes(v)) return;
    extras.push(v);
    caja.value = '';
    repintar();
  });

  raiz.querySelector('#btnRecetas')?.addEventListener('click', () => {
    const nombres = [...[...elegidos].map((id) =>
      guardados.find((p) => p.id === id)?.nombre ?? ''), ...extras].filter(Boolean);
    // Se abre el buscador con los ingredientes escritos. La app no finge saber
    // cocinar: te lleva a quien sí sabe, con recetas escritas por personas.
    const consulta = encodeURIComponent(`receta con ${nombres.join(' y ')}`);
    window.open(`https://duckduckgo.com/?q=${consulta}`, '_blank', 'noopener');
  });
}
