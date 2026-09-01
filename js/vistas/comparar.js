import { esc, vacio } from '../ui.js';
import { listar } from '../almacen.js';
import { comparar, queBuscarEnLugarDe, normalizarNutrientes } from '../motor.js';

/**
 * Comparar dos productos de la despensa.
 *
 * Es la pregunta del lineal: no si un yogur es bueno, sino cuál me llevo.
 */

let disponibles = [];
let idA = '';
let idB = '';

const NOTA = (p) => `<span class="producto__nota cifra" data-nivel="${p?.semaforo ?? 'rojo'}">${p?.puntuacion ?? '—'}</span>`;

function selector(lado, seleccionado) {
  return `
    <div class="campo">
      <label class="campo__nombre" for="cmp_${lado}">${lado === 'a' ? 'Primer' : 'Segundo'} producto</label>
      <div class="campo__entrada">
        <select id="cmp_${lado}" data-lado="${lado}">
          <option value="">Elige uno…</option>
          ${disponibles.map((p) => `
            <option value="${p.id}" ${p.id === seleccionado ? 'selected' : ''}>
              ${esc(p.nombre)} · ${p.puntuacion ?? '—'}
            </option>`).join('')}
        </select>
      </div>
    </div>`;
}

function filaDif(d, nombreA, nombreB) {
  const gana = d.direccion === 'a_favor_de_a' ? nombreA : nombreB;
  const lado = d.direccion === 'a_favor_de_a' ? 'a' : 'b';
  return `
    <div class="dif dif--${lado}">
      <div class="dif__cab">
        <span class="dif__titulo">${esc(d.titulo)}</span>
        <span class="dif__peso cifra">${d.peso}</span>
      </div>
      <div class="dif__valores">
        <span class="${lado === 'a' ? 'es-mejor' : ''}">${esc(d.valorA)}</span>
        <span class="dif__flecha">frente a</span>
        <span class="${lado === 'b' ? 'es-mejor' : ''}">${esc(d.valorB)}</span>
      </div>
      <p class="dif__gana">Mejor <b>${esc(gana)}</b></p>
      <p class="dif__motivo">${esc(d.explicacion)}</p>
    </div>`;
}

export function vistaComparar() {
  if (disponibles.length < 2) {
    return `
      <h1 class="titulo">Comparar</h1>
      ${vacio('Hacen falta al menos dos productos',
        'Analiza y guarda dos productos parecidos, dos yogures o dos panes, y aquí te diré cuál conviene y por qué.')}`;
  }

  const pa = disponibles.find((p) => p.id === idA);
  const pb = disponibles.find((p) => p.id === idB);

  let resultado = '';
  if (pa && pb && pa.id !== pb.id) {
    const c = comparar(
      { veredicto: pa.veredicto, nutrientes: normalizarNutrientes(pa.entrada?.nutrientes ?? {}) },
      { veredicto: pb.veredicto, nutrientes: normalizarNutrientes(pb.entrada?.nutrientes ?? {}) },
    );

    const consejos = c.mejor
      ? queBuscarEnLugarDe(c.mejor === 'a' ? pb.veredicto : pa.veredicto)
      : [];

    resultado = `
      <div class="duelo">
        <div class="duelo__lado ${c.mejor === 'a' ? 'es-ganador' : ''}">
          ${NOTA(pa)}<span>${esc(pa.nombre)}</span>
        </div>
        <div class="duelo__lado ${c.mejor === 'b' ? 'es-ganador' : ''}">
          ${NOTA(pb)}<span>${esc(pb.nombre)}</span>
        </div>
      </div>

      <p class="texto" style="font-size:1.08rem"><strong>${esc(c.resumen)}</strong></p>

      ${c.avisos.map((a) => `<div class="pendiente" style="margin-bottom:12px"><div>${esc(a)}</div></div>`).join('')}

      ${c.diferencias.length ? `
        <h2 class="subtitulo">En qué se diferencian</h2>
        <p class="texto" style="font-size:0.92rem">Ordenado por lo que más pesa en la decisión, no por el tamaño del número.</p>
        ${c.diferencias.map((d) => filaDif(d, pa.nombre, pb.nombre)).join('')}`
        : '<p class="texto">No hay diferencias de peso entre los dos.</p>'}

      ${consejos.length ? `
        <h2 class="subtitulo">Qué buscar la próxima vez</h2>
        <p class="texto" style="font-size:0.92rem">Para mejorar sobre el peor de los dos.</p>
        <ul class="incidencias">
          ${consejos.map((x) => `<li class="incidencia">${esc(x)}</li>`).join('')}
        </ul>` : ''}`;
  } else if (pa && pb && pa.id === pb.id) {
    resultado = '<p class="texto">Has elegido el mismo producto dos veces.</p>';
  }

  return `
    <h1 class="titulo">Comparar</h1>
    <p class="texto">Elige dos productos de tu despensa y te digo cuál conviene y por qué.</p>
    ${selector('a', idA)}
    ${selector('b', idB)}
    ${resultado}`;
}

export async function compararActivo(raiz, { repintar }) {
  if (disponibles.length === 0) {
    const lista = await listar({ orden: 'fecha_desc' });
    if (lista.length > 0) { disponibles = lista; repintar(); return; }
  }
  raiz.addEventListener('change', (e) => {
    const lado = e.target.dataset.lado;
    if (!lado) return;
    if (lado === 'a') idA = e.target.value; else idB = e.target.value;
    repintar();
  });
}

export function refrescarComparador() {
  disponibles = [];
}
