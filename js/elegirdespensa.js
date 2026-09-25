import { esc } from './ui.js';
import { listar } from './almacen.js';
import { FRESCOS } from './motor.js';
import { TIPOS, tipoDe, nombreDeTipo } from './tipos.js';

/**
 * Elegir alimentos de tu despensa.
 *
 * Lo comparten "Qué juntar" y "Recetas", que son dos pantallas distintas con
 * el mismo primer paso: marcar qué tienes a mano y poder añadir un par de
 * cosas que no tienes guardadas.
 *
 * Aquí vive SOLO esa mecánica. Lo que cada pantalla hace después con la lista
 * —contar interacciones o buscar recetas— es cosa suya, y por eso cada una
 * guarda su propio estado: se pueden cambiar por separado sin tocar la otra.
 *
 * Antes las dos eran el mismo fichero con una variable que cambiaba la cara.
 * Por eso cada una acababa ofreciendo la otra y no se distinguían.
 */

/** El estado de una pantalla: qué ha marcado, qué ha añadido y cómo lo ordena. */
export function nuevaSeleccion() {
  return { elegidos: new Set(), extras: [], guardados: [], cargado: false,
           orden: 'tipo' };
}

/** Las formas de ordenar la lista. */
export const ORDENES = [
  { clave: 'tipo', nombre: 'Por tipo de alimento' },
  { clave: 'nombre', nombre: 'Por nombre' },
  { clave: 'reciente', nombre: 'Más reciente primero' },
];

/** Carga la despensa la primera vez. Devuelve si ha hecho falta cargar. */
export async function cargarDespensa(sel) {
  if (sel.cargado) return false;
  try {
    sel.guardados = await listar({ orden: 'fecha_desc' });
  } catch {
    sel.guardados = [];
  }
  sel.cargado = true;
  return true;
}

/** Los nombres de lo que hay marcado ahora mismo, guardado y añadido. */
export function nombresElegidos(sel) {
  return [
    ...[...sel.elegidos].map((id) => sel.guardados.find((p) => p.id === id)?.nombre ?? ''),
    ...sel.extras,
  ].filter(Boolean);
}

/**
 * Las pastillas de la despensa.
 *
 * `adorno` deja que cada pantalla pinte algo detrás del nombre —los puntos de
 * color en "Qué juntar"— sin que esta función sepa qué es.
 */
export function listaElegibles(sel, adorno = () => '') {
  if (sel.guardados.length === 0) {
    return '<p class="texto">Todavía no has guardado nada. Analiza algún producto primero.</p>';
  }

  const pastilla = (p) => `
    <button class="elegible${sel.elegidos.has(p.id) ? ' es-elegido' : ''}"
            data-elegir="${p.id}" aria-pressed="${sel.elegidos.has(p.id)}">
      ${esc(p.nombre)}${adorno(p)}
    </button>`;

  // Por tipo: agrupado, con el nombre del grupo delante. Es lo que hace útil
  // una despensa larga, porque buscas "algo de pescado", no un nombre.
  if (sel.orden === 'tipo') {
    const porTipo = new Map();
    for (const p of sel.guardados) {
      const t = tipoDe(p);
      if (!porTipo.has(t)) porTipo.set(t, []);
      porTipo.get(t).push(p);
    }
    // En el orden de la lista de tipos, que va de lo fresco a lo demás.
    return TIPOS.filter((t) => porTipo.has(t.clave)).map((t) => `
      <div class="grupo-tipo">
        <h3 class="grupo-tipo__nombre">${esc(t.nombre)} · ${porTipo.get(t.clave).length}</h3>
        <div class="elegibles">
          ${porTipo.get(t.clave)
            .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
            .map(pastilla).join('')}
        </div>
      </div>`).join('');
  }

  const lista = [...sel.guardados];
  if (sel.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return `<div class="elegibles">${lista.map(pastilla).join('')}</div>`;
}

/** El desplegable de ordenar. */
export function selectorOrden(sel) {
  if (sel.guardados.length < 2) return '';
  return `
    <div class="campo campo--orden">
      <label class="campo__nombre" for="ordenDespensa">Ordenar</label>
      <div class="campo__entrada">
        <select id="ordenDespensa">
          ${ORDENES.map((o) => `
            <option value="${o.clave}" ${o.clave === sel.orden ? 'selected' : ''}>${esc(o.nombre)}</option>`).join('')}
        </select>
      </div>
    </div>`;
}

/** El campo para añadir hasta tres cosas que no tienes guardadas. */
export function campoExtras(sel, explicacion = 'Cosas que no tienes guardadas pero podrías comprar.') {
  return `
    <h2 class="rotulo" style="margin-top:20px">Añadir hasta tres más</h2>
    <p class="texto" style="font-size:var(--t2)">${esc(explicacion)}</p>
    <div class="campo">
      <div class="campo__entrada">
        <span class="campo__lupa" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L20 20"/></svg>
        </span>
        <input id="extraElegido" type="search" list="listaFrescos"
               placeholder="pimiento, limón, aceite de oliva…" autocomplete="off"
               ${sel.extras.length >= 3 ? 'disabled' : ''}>
      </div>
    </div>
    <datalist id="listaFrescos">
      ${FRESCOS.map((f) => `<option value="${esc(f.nombre)}"></option>`).join('')}
    </datalist>
    ${sel.extras.length ? `
      <div class="elegibles">
        ${sel.extras.map((x, i) => `
          <button class="elegible es-elegido" data-quitar-extra="${i}">
            ${esc(x)} ×
          </button>`).join('')}
      </div>` : ''}`;
}

/** Engancha marcar, desmarcar y añadir. Cada pantalla se repinta a su modo. */
export function engancharSeleccion(raiz, sel, repintar) {
  raiz.addEventListener('click', (e) => {
    const el = e.target.closest('[data-elegir]');
    if (el) {
      const id = el.dataset.elegir;
      if (sel.elegidos.has(id)) sel.elegidos.delete(id);
      else sel.elegidos.add(id);
      repintar();
      return;
    }
    const q = e.target.closest('[data-quitar-extra]');
    if (q) {
      sel.extras.splice(Number(q.dataset.quitarExtra), 1);
      repintar();
    }
  });

  raiz.querySelector('#ordenDespensa')?.addEventListener('change', (e) => {
    sel.orden = e.target.value;
    repintar();
  });

  const caja = raiz.querySelector('#extraElegido');
  caja?.addEventListener('change', () => {
    const v = caja.value.trim();
    if (!v || sel.extras.length >= 3 || sel.extras.includes(v)) return;
    sel.extras.push(v);
    caja.value = '';
    repintar();
  });
}
