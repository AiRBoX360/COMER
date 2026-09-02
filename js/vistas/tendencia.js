import { esc, vacio } from '../ui.js';
import { listar } from '../almacen.js';
import { calcularTendencia, VIGILABLES, sugerirVigilancia } from '../motor.js';

/**
 * Tu tendencia y tu lista de vigilancia.
 *
 * Un veredicto suelto dice si un producto conviene. La tendencia dice si tu
 * forma de comprar está cambiando, que es lo que de verdad importa.
 */

const CLAVE = 'comer.vigilancia';
let datos = null;
let sugerencias = [];

export function vigilanciaActiva() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
  } catch {
    return [];
  }
}

function guardarVigilancia(lista) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    // Sin poder guardar, vale para esta sesión y ya está.
  }
}

function alternar(id) {
  const actual = vigilanciaActiva();
  guardarVigilancia(actual.includes(id) ? actual.filter((x) => x !== id) : [...actual, id]);
}

function barras(t) {
  const NOMBRE = {
    rojo: 'Consumo ocasional', naranja: 'Con moderación', amarillo: 'Aceptable',
    verde_claro: 'Buena elección', verde_parchis: 'Especialmente favorable',
  };
  const orden = ['verde_parchis', 'verde_claro', 'amarillo', 'naranja', 'rojo'];
  const max = Math.max(1, ...Object.values(t.porSemaforo));
  return orden.map((k) => `
    <div class="reparto">
      <span class="reparto__nombre">${NOMBRE[k]}</span>
      <span class="reparto__barra"><i data-nivel="${k}" style="width:${(t.porSemaforo[k] / max) * 100}%"></i></span>
      <span class="reparto__n cifra">${t.porSemaforo[k]}</span>
    </div>`).join('');
}

export function tendencia() {
  const activas = vigilanciaActiva();

  const bloqueTendencia = !datos ? '<p class="texto">Cargando…</p>'
    : datos.total === 0
      ? vacio('Todavía no hay nada que medir', 'Guarda unos cuantos productos en la Despensa y aquí verás si tu forma de comprar cambia.')
      : `
        <p class="texto" style="font-size:1.08rem"><strong>${esc(datos.resumen)}</strong></p>

        <div class="resumen">
          <div><b class="cifra">${datos.media ?? '—'}</b><span>media</span></div>
          <div><b class="cifra">${datos.pctVerdes ?? '—'}%</b><span>en verde</span></div>
          <div><b class="cifra">${datos.total}</b><span>productos</span></div>
        </div>

        ${datos.fiable && datos.evolucion !== null ? `
          <div class="evolucion" data-signo="${datos.evolucion > 0 ? 'sube' : datos.evolucion < 0 ? 'baja' : 'igual'}">
            <span class="cifra">${datos.mediaAntes}</span>
            <span class="evolucion__flecha">${datos.evolucion > 0 ? '↗' : datos.evolucion < 0 ? '↘' : '→'}</span>
            <span class="cifra">${datos.mediaDespues}</span>
            <small>Media de tus primeros análisis frente a los últimos</small>
          </div>` : ''}

        <h2 class="subtitulo">Cómo se reparte tu despensa</h2>
        ${barras(datos)}

        ${datos.repetidos.length ? `
          <h2 class="subtitulo">Lo que más se repite en contra</h2>
          <p class="texto" style="font-size:0.92rem">De lo que pesa de verdad, no de lo leve.</p>
          ${datos.repetidos.map((r) => `
            <div class="repetida">
              <span class="repetida__veces cifra">${r.pctProductos}%</span>
              <span class="repetida__nombre">${esc(r.nombre)}</span>
              <span class="repetida__donde">${r.veces} de ${datos.total}</span>
            </div>`).join('')}` : ''}

        ${datos.mejor && datos.peor ? `
          <h2 class="subtitulo">Los extremos</h2>
          <div class="duelo">
            <div class="duelo__lado es-ganador">
              <span class="producto__nota cifra" data-nivel="verde_parchis">${datos.mejor.puntuacion}</span>
              <span>${esc(datos.mejor.nombre)}</span>
            </div>
            <div class="duelo__lado">
              <span class="producto__nota cifra" data-nivel="rojo">${datos.peor.puntuacion}</span>
              <span>${esc(datos.peor.nombre)}</span>
            </div>
          </div>` : ''}`;

  return `
    <h1 class="titulo">Tu tendencia</h1>
    ${bloqueTendencia}

    <h2 class="subtitulo">Qué quieres que te avise</h2>
    <p class="texto">Esto no toca la nota. La puntuación sigue siendo el criterio general, igual para todos. Lo que marques aquí sale aparte, arriba del veredicto, como aviso.</p>

    ${sugerencias.length ? `
      <div class="pendiente" style="margin:16px 0">
        <div>
          <b>Por lo que hay en tu despensa, esto te interesaría vigilar:</b>
          <ul style="margin:12px 0 0; padding-left:1.1em">
            ${sugerencias.map((s) => `<li>${esc(s.etiqueta)} — ${esc(s.motivo)}</li>`).join('')}
          </ul>
          <button class="boton" id="btnAceptarSugerencias" style="margin-top:12px; width:100%">
            Vigilar estas ${sugerencias.length}
          </button>
        </div>
      </div>` : ''}

    <div class="filtros">
      ${VIGILABLES.map((r) => `
        <button class="filtro${activas.includes(r.id) ? ' es-activo' : ''}" data-vigilar="${r.id}">
          ${r.sentido === 'buscar' ? '＋ ' : ''}${esc(r.etiqueta)}
        </button>`).join('')}
    </div>
    <p class="texto" style="font-size:0.9rem; margin-top:12px">
      Las marcadas con <b>＋</b> avisan cuando el producto <b>no</b> las lleva.
      ${activas.length ? `Vigilando ${activas.length} cosa(s).` : 'No estás vigilando nada todavía.'}
    </p>
  `;
}

export async function tendenciaActiva(raiz, { repintar }) {
  if (datos === null) {
    const productos = await listar({ orden: 'fecha_asc' });
    datos = calcularTendencia(productos);
    sugerencias = sugerirVigilancia(productos)
      .filter((s) => !vigilanciaActiva().includes(s.id));
    repintar();
    return;
  }

  raiz.addEventListener('click', (e) => {
    const v = e.target.closest('[data-vigilar]');
    if (v) { alternar(v.dataset.vigilar); repintar(); return; }

    if (e.target.closest('#btnAceptarSugerencias')) {
      const nuevas = [...new Set([...vigilanciaActiva(), ...sugerencias.map((s) => s.id)])];
      guardarVigilancia(nuevas);
      sugerencias = [];
      repintar();
    }
  });
}

export function refrescarTendencia() {
  datos = null;
}
