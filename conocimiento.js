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
/** Cuántas fichas se enseñan de golpe. Se amplía con el botón de ver todas. */
let tope = 60;
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

  const resultados = buscando ? resultadosAhora() : [];

  return `
    ${nombrePantalla('Saber')}

    <div class="campo">
      <div class="campo__entrada">
        <span class="campo__lupa" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L20 20"/></svg>
        </span>
        <input type="search" id="buscarFicha" value="${esc(termino)}"
               placeholder="E-250, palma, gluten, maltodextrina…" autocomplete="off">
      </div>
    </div>

    <div id="zonaSaber">${buscando ? bloqueResultados(resultados) : bloquePuertas(r) + bloqueDespensa()}</div>
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

/**
 * Todo lo que casa, sin recortar.
 *
 * Hace falta saber el total, no solo la página. Con 204 aditivos que conviene
 * limitar de 300, poner el filtro dejaba el mismo número de fichas a la vista
 * —las 60 del tope— y parecía que el botón no hacía nada. Enseñando "60 de
 * 204" se ve que sí.
 */
function resultadosAhora() {
  return buscar(termino, {
    tipos: tipoActivo ? [tipoActivo] : undefined,
    soloLimitar: soloLimitar || undefined,
    orden,
    limite: 9999,
  });
}

/** Los resultados, con los filtros solo cuando hay algo que filtrar. */
function bloqueResultados(todos) {
  const familia = FAMILIAS.find((f) => f.clave === tipoActivo);
  const resultados = todos.slice(0, tope);
  const hayMas = todos.length > tope;
  return `
    <div class="resultados__cabeza">
      <button class="volver" id="btnVolverSaber" aria-label="Volver a las familias">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
        Volver
      </button>
      <label class="ordenar">
        <span class="ordenar__rotulo">Ordenar</span>
        <select class="ordenar__lista" id="ordenSaber">
          ${ORDENES.map((o) => `
            <option value="${o.clave}"${o.clave === orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('')}
        </select>
      </label>
    </div>

    <p class="resultados__cuenta">
      ${familia ? esc(familia.nombre) + ' · ' : ''}${
        hayMas ? `${resultados.length} de ${todos.length} fichas` : `${todos.length} ficha(s)`}
    </p>

    ${resultados.length === 0
      ? vacio('Nada con ese nombre', 'Prueba con menos letras, o con el código E si es un aditivo.')
      : `
        <div class="filtros" style="margin-bottom:var(--e4)">
          <button class="filtro${soloLimitar ? ' es-activo' : ''}" data-solo="limitar">
            Solo lo que conviene limitar
          </button>
        </div>
        ${resultados.map(fichaHTML).join('')}
        ${hayMas ? `
          <button class="boton" id="btnVerTodas" style="width:100%; margin-top:var(--e3)">
            Ver las ${todos.length - tope} restantes
          </button>` : ''}`}`;
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
    /**
     * Al escribir se refresca SOLO la lista, no la pantalla.
     *
     * Antes se repintaba todo con cada letra, y eso destruye el campo donde
     * estás escribiendo: el teclado se cerraba al segundo carácter. Se
     * intentaba devolver el foco después, pero el campo al que se apuntaba ya
     * no estaba puesto, así que no servía de nada.
     *
     * No hay que devolver el foco: hay que no quitarlo.
     */
    caja.addEventListener('input', () => {
      termino = caja.value;
      tope = 60;
      refrescarZona();
    });
  }

  /** Vuelve a dibujar solo la lista de abajo. */
  function refrescarZona() {
    const zona = raiz.querySelector('#zonaSaber');
    if (!zona) return;
    const r = resumenCatalogo();
    const buscando = termino.trim().length > 0 || tipoActivo !== '';
    zona.innerHTML = buscando
      ? bloqueResultados(resultadosAhora())
      : bloquePuertas(r) + bloqueDespensa();
    // El desplegable se rehace con la zona, así que hay que volver a
    // engancharlo. Con un botón bastaba el oyente general del contenedor;
    // "change" no burbujea igual de cómodo desde un select recreado.
    zona.querySelector('#ordenSaber')?.addEventListener('change', (ev) => {
      orden = ev.target.value;
      tope = 60;
      refrescarZona();
    });
  }

  raiz.addEventListener('click', (e) => {
    // Volver borra TODO lo que te tiene en modo búsqueda: la familia elegida y
    // lo escrito. Antes solo quitaba la familia, así que si habías llegado
    // escribiendo no pasaba nada y el botón parecía muerto.
    if (e.target.closest('#btnVerTodas')) {
      tope = 9999;
      refrescarZona();
      return;
    }
    if (e.target.closest('#btnVolverSaber')) {
      tipoActivo = '';
      termino = '';
      soloLimitar = false;
      tope = 60;
      const caja3 = raiz.querySelector('#buscarFicha');
      if (caja3) caja3.value = '';
      refrescarZona();
      return;
    }
    const t = e.target.closest('[data-tipo]');
    if (t) { tipoActivo = t.dataset.tipo; tope = 60; refrescarZona(); return; }
    const rep = e.target.closest('[data-buscar]');
    if (rep) {
      termino = rep.dataset.buscar;
      tipoActivo = '';
      const caja2 = raiz.querySelector('#buscarFicha');
      if (caja2) caja2.value = termino;
      refrescarZona();
      return;
    }
    const o = e.target.closest('[data-orden]');
    if (o) { orden = o.dataset.orden; refrescarZona(); return; }
    const s = e.target.closest('[data-solo]');
    if (s) { soloLimitar = !soloLimitar; tope = 60; refrescarZona(); }
  });
}

/** Fuerza a releer el recuento cuando cambie la despensa. */
export function refrescarConocimiento() {
  recuento = null;
}
