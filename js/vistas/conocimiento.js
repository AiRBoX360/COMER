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

export function conocimiento() {
  const r = resumenCatalogo();
  const resultados = buscar(termino, {
    tipos: tipoActivo ? [tipoActivo] : undefined,
    soloLimitar: soloLimitar || undefined,
    limite: 60,
  });

  const enTuDespensa = recuento === null ? '<p class="texto">Cargando…</p>'
    : recuento.length === 0
      ? vacio('Todavía no hay nada', 'Cuando analices y guardes productos, aquí verás qué sustancias se repiten en lo que comes.')
      : recuento.slice(0, 12).map((s) => `
          <div class="repetida">
            <span class="repetida__veces cifra">${s.veces}×</span>
            <span class="repetida__nombre">${esc(s.nombre)}</span>
            <span class="repetida__donde">${esc(s.ejemplos.slice(0, 2).join(', '))}</span>
          </div>`).join('');

  return `
    <h1 class="titulo">Saber</h1>

    <h2 class="subtitulo">Lo que más se repite en tu despensa</h2>
    <p class="texto" style="font-size:0.92rem">De lo que tú has analizado y guardado. Un producto no cuenta dos veces la misma sustancia.</p>
    <div class="repetidas">${enTuDespensa}</div>

    <h2 class="subtitulo">Buscar en el catálogo</h2>
    <p class="texto" style="font-size:0.92rem">
      ${CATALOGO.length} fichas: ${r.aditivo} aditivos, ${r.alergeno} alérgenos,
      ${r.ingrediente} ingredientes, ${r.azucar} formas de azúcar, ${r.grasa} grasas
      y ${r.nutriente} nutrientes. Cada una con su fuente.
    </p>

    <div class="campo">
      <div class="campo__entrada">
        <input type="search" id="buscarFicha" value="${esc(termino)}"
               placeholder="E-250, palma, gluten, maltodextrina…" autocomplete="off">
      </div>
    </div>

    <div class="filtros">
      ${TIPOS.map((t) => `
        <button class="filtro${t.clave === tipoActivo ? ' es-activo' : ''}" data-tipo="${t.clave}">
          ${t.nombre}
        </button>`).join('')}
    </div>
    <div class="filtros">
      <button class="filtro${soloLimitar ? ' es-activo' : ''}" data-solo="limitar">
        Solo lo que conviene limitar
      </button>
    </div>

    <p class="texto" style="font-size:0.9rem; margin-top:16px">
      ${resultados.length === 0 ? 'Nada encontrado con ese criterio.'
        : `${resultados.length} resultado(s)${resultados.length === 60 ? ', se muestran los 60 primeros' : ''}.`}
    </p>
    <div class="fichas">${resultados.map(fichaHTML).join('')}</div>
  `;
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
      if (nueva) { nueva.focus(); nueva.setSelectionRange(pos, pos); }
    });
  }

  raiz.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tipo]');
    if (t) { tipoActivo = t.dataset.tipo; repintar(); return; }
    const s = e.target.closest('[data-solo]');
    if (s) { soloLimitar = !soloLimitar; repintar(); }
  });
}

/** Fuerza a releer el recuento cuando cambie la despensa. */
export function refrescarConocimiento() {
  recuento = null;
}
