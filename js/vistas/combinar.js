import { esc } from '../ui.js';
import { nombrePantalla } from './inicio.js';
import { listar } from '../almacen.js';
import { ganadoras } from '../ganadoras.js';

/**
 * Qué juntar: las combinaciones ganadoras, no las parejas.
 *
 * NO propone recetas ni lleva a buscarlas. Para eso está la pantalla de
 * Recetas, que es otra cosa.
 *
 * La versión anterior pedía elegir alimentos y luego contaba qué pasaba. Con
 * la despensa llena era inmanejable: cien alimentos pintaban hasta
 * seiscientos puntos de color, y los colores solo alcanzaban a seis de las
 * veinte combinaciones — las otras catorce ni se veían.
 *
 * Esta parte de las combinaciones, que son veinte y no crecen nunca, y para
 * cada una dice qué tienes tú. Tres bloques, porque son tres preguntas
 * distintas: qué puedo hacer ya, qué me falta para desbloquear algo más, y
 * qué conviene no juntar.
 */

let guardados = [];
let cargado = false;
let filtro = '';
let abierta = null;

export function reiniciarCombinar() {
  cargado = false;
  filtro = '';
  abierta = null;
}

/** Las pastillas de alimentos de un lado. */
function pastillas(lista) {
  return `<div class="lado__alimentos">${lista
    .map((n) => `<span class="lado__uno">${esc(n)}</span>`).join('')}</div>`;
}

/**
 * Una combinación, plegada.
 *
 * Dentro van los dos lados en vez de las parejas. "Hierro vegetal con
 * vitamina C" con cien alimentos son 121 parejas, pero solo 22 alimentos en
 * dos columnas: pon uno de estos con uno de estos.
 */
function fila(c) {
  const abierto = abierta === c.clave;
  return `
    <details class="gana gana--${c.clase === 'sinergia' ? 'suma' : 'resta'}"
             data-comb="${c.clave}"${abierto ? ' open' : ''}>
      <summary>
        <span class="gana__signo" aria-hidden="true">${c.clase === 'sinergia' ? '+' : '−'}</span>
        <span class="gana__cabeza">
          <b>${esc(c.titulo)}</b>
          <small>${c.cuantos} de tus alimentos${c.fuerza === 'alta' ? ' · de las que más pesan' : ''}</small>
        </span>
        <span class="gana__mas" aria-hidden="true">+</span>
      </summary>
      <div class="gana__cuerpo">
        <p class="gana__que">${esc(c.queOcurre)}</p>

        ${c.ambos.length ? `
          <div class="lado lado--ambos">
            <h4>Estos ya traen las dos cosas</h4>
            ${pastillas(c.ambos)}
            <p class="lado__apunte">Solos ya se aprovechan mejor. Aun así suman con los de abajo.</p>
          </div>` : ''}

        ${c.soloA.length && c.soloB.length ? `
          <div class="lado">
            <h4>${c.clase === 'sinergia' ? 'Pon uno de estos' : 'Tienes esto'}</h4>
            ${pastillas(c.soloA)}
          </div>
          <div class="lado lado--con">
            <h4>${c.clase === 'sinergia' ? 'Con uno de estos' : 'Y esto'}</h4>
            ${pastillas(c.soloB)}
          </div>` : ''}

        <p class="gana__linea"><b>Por qué.</b> ${esc(c.porQue)}</p>
        <p class="gana__linea"><b>Qué hacer.</b> ${esc(c.queHacer)}</p>
      </div>
    </details>`;
}

/** Una que te falta a medias: se dice exactamente qué comprar. */
function filaFalta(c) {
  return `
    <details class="gana gana--falta" data-comb="${c.clave}"${abierta === c.clave ? ' open' : ''}>
      <summary>
        <span class="gana__signo" aria-hidden="true">?</span>
        <span class="gana__cabeza">
          <b>${esc(c.titulo)}</b>
          <small>te falta ${c.falta === 'a' ? 'el primer' : 'el segundo'} ingrediente</small>
        </span>
        <span class="gana__mas" aria-hidden="true">+</span>
      </summary>
      <div class="gana__cuerpo">
        <p class="gana__que">${esc(c.queOcurre)}</p>
        <div class="lado">
          <h4>Ya tienes</h4>
          ${pastillas([...c.ambos, ...(c.falta === 'a' ? c.soloB : c.soloA)])}
        </div>
        <div class="lado lado--con">
          <h4>Te falta algo así</h4>
          ${pastillas(c.ejemplos)}
        </div>
      </div>
    </details>`;
}

export function combinar() {
  if (!cargado) {
    return `
      ${nombrePantalla('qué juntar')}
      <p class="texto">Cargando tu despensa…</p>`;
  }

  if (guardados.length === 0) {
    return `
      ${nombrePantalla('qué juntar')}
      <p class="texto">Todavía no has guardado nada. Analiza algún producto y vuelve: aquí te diré qué merece la pena juntar.</p>`;
  }

  const nombres = guardados.map((p) => p.nombre);
  const { puedes, faltaUno, separar } = ganadoras(nombres);

  // El buscador filtra por alimento: escribes "lentejas" y ves solo lo suyo.
  const busca = filtro.trim().toLowerCase();
  const tocaA = (c) => !busca
    || [...c.soloA, ...c.soloB, ...c.ambos, ...(c.ejemplos ?? [])]
      .some((n) => n.toLowerCase().includes(busca))
    || c.titulo.toLowerCase().includes(busca);

  const vPuedes = puedes.filter(tocaA);
  const vFalta = faltaUno.filter(tocaA);
  const vSeparar = separar.filter(tocaA);

  return `
    ${nombrePantalla('qué juntar')}
    <p class="texto">Lo que se potencia entre sí de lo que tienes, y por qué. Abre cualquiera para ver qué alimentos tuyos lo cumplen.</p>

    <div class="campo">
      <div class="campo__entrada">
        <span class="campo__lupa" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L20 20"/></svg>
        </span>
        <input id="buscaCombinar" type="search" value="${esc(filtro)}"
               placeholder="Filtrar por un alimento tuyo" autocomplete="off">
      </div>
    </div>

    ${busca && vPuedes.length + vFalta.length + vSeparar.length === 0 ? `
      <p class="texto">Nada de lo que tienes casa con eso.</p>` : ''}

    ${vPuedes.length ? `
      <h2 class="rotulo">Puedes hacerlo ya · ${vPuedes.length}</h2>
      ${vPuedes.map(fila).join('')}` : ''}

    ${!busca && vPuedes.length === 0 ? `
      <div class="tarjeta">
        <p class="texto">No conozco ninguna combinación entre lo que tienes guardado. Eso no significa que no combinen: significa que no tengo nada demostrado que contarte, y prefiero decirlo a inventármelo.</p>
      </div>` : ''}

    ${vFalta.length ? `
      <h2 class="rotulo" style="margin-top:var(--e6)">Te falta una cosa · ${vFalta.length}</h2>
      <p class="texto" style="font-size:var(--t2)">Tienes medio camino hecho. Con una compra más se desbloquean.</p>
      ${vFalta.map(filaFalta).join('')}` : ''}

    ${vSeparar.length ? `
      <h2 class="rotulo" style="margin-top:var(--e6)">Conviene separar · ${vSeparar.length}</h2>
      <p class="texto" style="font-size:var(--t2)">No es que sean malos: es que juntos se estorban.</p>
      ${vSeparar.map(fila).join('')}` : ''}
  `;
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

  // Se recuerda cuál estaba abierta: al filtrar se rehace la lista, y sin
  // esto la que acabas de abrir se cerraría sola.
  raiz.addEventListener('toggle', (e) => {
    const d = e.target.closest?.('.gana');
    if (!d) return;
    abierta = d.open ? d.dataset.comb : (abierta === d.dataset.comb ? null : abierta);
  }, true);

  const caja = raiz.querySelector('#buscaCombinar');
  caja?.addEventListener('input', () => {
    filtro = caja.value;
    repintar(true);
    // Se devuelve el foco: sin esto el teclado se cierra a cada letra.
    const nueva = document.querySelector('#buscaCombinar');
    if (nueva && nueva !== document.activeElement) {
      nueva.focus();
      // Y el cursor al final. No todos los navegadores lo ofrecen en un campo
      // de búsqueda, y quedarse sin cursor es mejor que reventar.
      try { nueva.setSelectionRange(nueva.value.length, nueva.value.length); }
      catch { /* sin cursor, pero con foco */ }
    }
  });
}
