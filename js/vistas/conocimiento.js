import { nombrePantalla } from './inicio.js';
import { esc, vacio } from '../ui.js';
import { buscar, resumenCatalogo, CATALOGO } from '../motor.js';
import { sustanciasMasVistas } from '../almacen.js';

/**
 * Saber.
 *
 * Dos cosas distintas en la misma pantalla, y conviene no confundirlas:
 *
 *   · El catálogo: todo lo que la app sabe, se haya cruzado contigo o no.
 *   · Tu despensa: lo que de verdad ha aparecido en lo que tú analizas.
 *
 * La segunda es la que responde a la pregunta que importa: qué estoy comiendo
 * yo, no qué existe en el mundo.
 */

let termino = '';
let tipoActivo = '';
let soloLimitar = false;
let orden = 'alfabetico';
let recuento = null;

const TIPOS = [
  { clave: '', nombre: 'Todo' },
  { clave: 'aditivo', nombre: 'Aditivos' },
  { clave: 'alergeno', nombre: 'Alérgenos' },
  { clave: 'azucar', nombre: 'Azúcares' },
  { clave: 'grasa', nombre: 'Grasas' },
  { clave: 'ingrediente', nombre: 'Ingredientes' },
  { clave: 'nutriente', nombre: 'Nutrientes' },
];

const ORDENES = [
  { clave: 'alfabetico', nombre: 'Nombre' },
  { clave: 'peor_primero', nombre: 'Lo peor primero' },
  { clave: 'mejor_primero', nombre: 'Lo mejor primero' },
  { clave: 'relevancia', nombre: 'Lo más parecido' },
];

const SELLO = { 3: 'Muy favorable', 2: 'Favorable', 1: 'Suma poco', 0: 'Neutro' };

function selloDe(v) {
  if (v > 0) return SELLO[Math.min(3, v)] ?? 'Favorable';
  if (v === 0) return 'Neutro';
  if (v <= -3) return 'Evitar';
  if (v === -2) return 'Vigilar';
  return 'Leve';
}

function claseDe(v) {
  if (v > 0) return 'favorable';
  if (v < 0) return 'limitar';
  return 'neutro';
}

function fichaHTML(f) {
  return `
    <details class="ficha ficha--${claseDe(f.valoracion)}">
      <summary>
        <span class="ficha__titulo">${esc(f.nombre)}</span>
        <span class="ficha__sello">${selloDe(f.valoracion)}</span>
      </summary>
      <div class="ficha__cuerpo">
        <p class="ficha__linea"><b>Qué es.</b> ${esc(f.categoria)}.</p>
        <p class="ficha__linea">${esc(f.explicacion)}</p>
        ${f.fuentes.length ? `
          <p class="ficha__fuente">
            ${f.fuentes.map((s) => `${esc(s.organismo)} · ${esc(s.documento)} (${s.anio})`).join('<br>')}
          </p>` : ''}
      </div>
    </details>`;
}

/**
 * Las seis puertas de entrada al catálogo.
 *
 * Antes la pantalla soltaba de golpe doce sustancias de la despensa, dos
 * párrafos, un buscador, seis filtros, un interruptor, cuatro órdenes y
 * sesenta fichas. Todo a la vez y sin que nadie lo hubiera pedido.
 *
 * Un catálogo es un buscador, no una lista. Ahora arranca sin resultados: o
 * buscas algo, o entras por una familia.
 */
const FAMILIAS = [
  { clave: 'aditivo', nombre: 'Aditivos',
    icono: '<circle cx="12" cy="12" r="8"/><path d="M9 12h6M12 9v6"/>' },
  { clave: 'ingrediente', nombre: 'Ingredientes',
    icono: '<path d="M12 20c4.4 0 8-3.6 8-8 0-4-3-8-8-8s-8 4-8 8c0 4.4 3.6 8 8 8Z"/><path d="M12 20V9"/>' },
  { clave: 'azucar', nombre: 'Azúcares',
    icono: '<rect x="4" y="8" width="7" height="7" rx="1"/><rect x="13" y="11" width="7" height="7" rx="1"/>' },
  { clave: 'grasa', nombre: 'Grasas',
    icono: '<path d="M12 3s5 5.5 5 9a5 5 0 0 1-10 0c0-3.5 5-9 5-9Z"/>' },
  { clave: 'alergeno', nombre: 'Alérgenos',
    icono: '<path d="M12 3l9 16H3l9-16Z"/><path d="M12 10v4M12 17h.01"/>' },
  { clave: 'nutriente', nombre: 'Nutrientes',
    icono: '<path d="M4 17l5-6 4 3 6-8"/><path d="M15 6h4v4"/>' },
];

export function conocimiento() {
  const r = resumenCatalogo();
  const buscando = termino.trim().length > 0 || tipoActivo !== '';

  const resultados = buscando
    ? buscar(termino, {
        tipos: tipoActivo ? [tipoActivo] : undefined,
        soloLimitar: soloLimitar || undefined,
        orden,
        limite: 60,
      })
    : [];

  return `
    ${nombrePantalla('Saber')}

    <div class="campo">
      <div class="campo__entrada">
        <input type="search" id="buscarFicha" value="${esc(termino)}"
               placeholder="E-250, palma, gluten, maltodextrina…" autocomplete="off">
      </div>
    </div>

    ${buscando ? bloqueResultados(resultados) : bloquePuertas(r) + bloqueDespensa()}
  `;
}

/** Las seis familias, cada una con cuántas fichas tiene. */
function bloquePuertas(r) {
  return `
    <div class="puertas">
      ${FAMILIAS.map((f) => `
        <button class="puerta" data-tipo="${f.clave}">
          <span class="puerta__icono" aria-hidden="true">
            <svg viewBox="0 0 24 24">${f.icono}</svg>
          </span>
          <span class="puerta__nombre">${esc(f.nombre)}</span>
          <span class="puerta__cuenta cifra">${r[f.clave] ?? 0}</span>
        </button>`).join('')}
    </div>

    <p class="apunte-via" style="margin-top:var(--e4)">
      ${CATALOGO.length} fichas, cada una con su fuente. Este catálogo no crece
      cuando escaneas: va escrito dentro de la app. Si te encuentras algo que no
      está, cópialo y mándalo.
    </p>`;
}

/** Los resultados, con los filtros solo cuando hay algo que filtrar. */
function bloqueResultados(resultados) {
  const familia = FAMILIAS.find((f) => f.clave === tipoActivo);
  return `
    <div class="resultados__cabeza">
      <button class="volver" data-tipo="">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
        Todo
      </button>
      <span class="resultados__cuenta">
        ${familia ? esc(familia.nombre) + ' · ' : ''}${resultados.length} ficha(s)
      </span>
    </div>

    ${resultados.length === 0
      ? vacio('Nada con ese nombre', 'Prueba con menos letras, o con el código E si es un aditivo.')
      : `
        <div class="filtros" style="margin-bottom:var(--e4)">
          <button class="filtro${soloLimitar ? ' es-activo' : ''}" data-solo="limitar">
            Solo lo que conviene limitar
          </button>
          ${ORDENES.map((o) => `
            <button class="filtro${o.clave === orden ? ' es-activo' : ''}" data-orden="${o.clave}">
              ${o.nombre}
            </button>`).join('')}
        </div>
        ${resultados.map(fichaHTML).join('')}`}`;
}

/** Lo que más se repite en tu despensa: plegado y en voz baja. */
function bloqueDespensa() {
  if (recuento === null || recuento.length === 0) return '';
  return `
    <details class="repetidas-panel">
      <summary>Lo que más se repite en tu despensa</summary>
      <p class="apunte-via">De lo que tú has analizado y guardado. Un producto no cuenta dos veces la misma sustancia.</p>
      ${recuento.slice(0, 10).map((s) => `
        <button class="repetida" data-buscar="${esc(s.nombre)}">
          <span class="repetida__veces cifra">${s.veces}×</span>
          <span class="repetida__nombre">${esc(s.nombre)}</span>
        </button>`).join('')}
    </details>`;
}

export async function conocimientoActivo(raiz, { repintar }) {
  // El recuento se pide una vez y se guarda: es una lectura de la base entera.
  if (recuento === null) {
    try {
      recuento = await sustanciasMasVistas('limitar');
    } catch {
      recuento = [];
    }
    repintar();
    return;
  }

  const caja = raiz.querySelector('#buscarFicha');
  if (caja) {
    caja.addEventListener('input', () => {
      termino = caja.value;
      const pos = caja.selectionStart;
      repintar();
      const nueva = raiz.querySelector('#buscarFicha');
      if (!nueva) return;
      nueva.focus();
      // No todos los tipos de campo admiten colocar el cursor. Si no se puede,
      // se deja donde caiga: perder la posición del cursor es un incordio;
      // que reviente la pantalla, no.
      try { nueva.setSelectionRange(pos, pos); } catch { /* da igual */ }
    });
  }

  raiz.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tipo]');
    if (t) { tipoActivo = t.dataset.tipo; repintar(); return; }
    const rep = e.target.closest('[data-buscar]');
    if (rep) {
      termino = rep.dataset.buscar;
      tipoActivo = '';
      repintar();
      return;
    }
    const o = e.target.closest('[data-orden]');
    if (o) { orden = o.dataset.orden; repintar(); return; }
    const s = e.target.closest('[data-solo]');
    if (s) { soloLimitar = !soloLimitar; repintar(); }
  });
}

/** Fuerza a releer el recuento cuando cambie la despensa. */
export function refrescarConocimiento() {
  recuento = null;
}
