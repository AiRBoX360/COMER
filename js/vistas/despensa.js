import { NIVELES, esc, vacio } from '../ui.js';
import { listar, borrar, urlDeFoto, soltarFotos, estadisticas,
         descargarCopia, restaurarCopia, almacenDuradero } from '../almacen.js';
import { enCurso } from '../estado.js';

/**
 * La Despensa.
 *
 * Todo lo analizado, repartido en los cinco bloques de color. El orden es de
 * arriba abajo empezando por lo peor: lo que conviene mirar con lupa se ve
 * primero, no hay que bajar a buscarlo.
 */

let cache = [];
let filtro = '';

function ficha(p) {
  const fecha = new Date(p.fechaAnalisis).toLocaleDateString('es-ES',
    { day: 'numeric', month: 'short', year: 'numeric' });
  const frontal = p.fotos.find((f) => f.tipo === 'frontal') ?? p.fotos[0];
  return `
    <article class="producto" data-id="${p.id}">
      <div class="producto__foto" ${frontal ? `data-foto="${frontal.idFoto}"` : ''}>
        ${frontal ? '' : '<span>sin foto</span>'}
      </div>
      <div class="producto__texto">
        <h3>${esc(p.nombre)}</h3>
        <p class="producto__fecha cifra">${esc(fecha)}</p>
      </div>
      <span class="producto__nota cifra" data-nivel="${p.semaforo ?? 'rojo'}">
        ${p.puntuacion ?? '—'}
      </span>
      <button class="producto__borrar" data-borrar="${p.id}" aria-label="Borrar ${esc(p.nombre)}">×</button>
    </article>`;
}

export function despensa() {
  const total = cache.length;
  const visibles = filtro
    ? cache.filter((p) => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
    : cache;

  const bloques = NIVELES.slice().reverse().map((n) => {
    const suyos = visibles.filter((p) => p.semaforo === n.clave);
    if (total > 0 && suyos.length === 0) return '';
    return `
      <section class="bloque">
        <div class="banda" style="margin-bottom:12px">
          <div class="banda__tramo es-actual" data-nivel="${n.clave}">
            ${esc(n.texto)} · ${suyos.length}
          </div>
        </div>
        ${suyos.map(ficha).join('') || '<p class="texto" style="font-size:0.9rem">Ninguno todavía.</p>'}
      </section>`;
  }).join('');

  const sinNota = visibles.filter((p) => p.semaforo === null);

  return `
    <h1 class="titulo">Despensa</h1>
    <p class="texto">Todo lo que has analizado, de lo que menos conviene a lo que más.</p>

    ${!almacenDuradero() ? `
      <div class="pendiente" style="border-left-color:var(--naranja); margin-bottom:16px">
        <div><b>Este navegador no deja guardar nada.</b> Puedes analizar productos, pero se perderán al cerrar. Suele pasar en navegación privada.</div>
      </div>` : ''}

    ${total === 0 ? vacio('Todavía no has guardado nada',
      'Analiza un producto y pulsa "Guardar en la despensa". Aparecerá aquí.') : `
      <div class="campo">
        <div class="campo__entrada">
          <input type="search" id="buscarDespensa" value="${esc(filtro)}"
                 placeholder="Buscar por nombre" autocomplete="off">
        </div>
      </div>
      ${bloques}
      ${sinNota.length ? `
        <section class="bloque">
          <h2 class="rotulo">Sin nota, por datos incompletos</h2>
          ${sinNota.map(ficha).join('')}
        </section>` : ''}`}

    <h2 class="subtitulo">Copia de seguridad</h2>
    <p class="texto">Tus datos viven solo en este teléfono. Si el navegador se queda sin espacio puede borrarlos, así que conviene guardar una copia de vez en cuando.</p>
    <div class="toma__botones">
      <button class="boton" id="btnExportar">Guardar copia</button>
      <button class="boton" id="btnImportar">Restaurar copia</button>
    </div>
    <p class="texto" id="estadoCopia" style="margin-top:12px; font-size:0.92rem"></p>
  `;
}

export async function despensaActivo(raiz, { repintar }) {
  soltarFotos();

  // Se cargan los productos y se repinta una sola vez, para no dejar la
  // pantalla parpadeando mientras llegan.
  if (cache.length === 0) {
    const lista = await listar({ orden: 'fecha_desc' });
    if (lista.length > 0) { cache = lista; repintar(); return; }
  }

  // Las fotos se piden después de pintar: así la lista aparece enseguida y las
  // imágenes van entrando, en vez de esperar a que estén todas.
  for (const hueco of raiz.querySelectorAll('[data-foto]')) {
    urlDeFoto(hueco.dataset.foto).then((url) => {
      if (url) hueco.style.backgroundImage = `url(${url})`;
    });
  }

  const buscador = raiz.querySelector('#buscarDespensa');
  if (buscador) {
    buscador.addEventListener('input', () => {
      filtro = buscador.value;
      const pos = buscador.selectionStart;
      repintar();
      const nuevo = raiz.querySelector('#buscarDespensa');
      if (nuevo) { nuevo.focus(); nuevo.setSelectionRange(pos, pos); }
    });
  }

  raiz.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-borrar]');
    if (b) {
      const p = cache.find((x) => x.id === b.dataset.borrar);
      if (!confirm(`¿Borrar "${p?.nombre ?? 'este producto'}" de la despensa?`)) return;
      await borrar(b.dataset.borrar);
      cache = await listar({ orden: 'fecha_desc' });
      repintar();
      return;
    }

    const art = e.target.closest('.producto');
    if (art) {
      const p = cache.find((x) => x.id === art.dataset.id);
      if (p) volverAVer(p);
      return;
    }
  });

  const estado = raiz.querySelector('#estadoCopia');

  raiz.querySelector('#btnExportar')?.addEventListener('click', async () => {
    if (cache.length === 0) { estado.textContent = 'No hay nada que guardar todavía.'; return; }
    estado.textContent = 'Preparando la copia…';
    try {
      const r = await descargarCopia();
      estado.textContent = `Copia guardada: ${r.productos} producto(s), ${r.kb} KB.`;
    } catch (err) {
      estado.textContent = `No se ha podido guardar la copia. ${err.message}`;
    }
  });

  raiz.querySelector('#btnImportar')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', async () => {
      const f = input.files?.[0];
      if (!f) return;
      estado.textContent = 'Restaurando…';
      const r = await restaurarCopia(f);
      if (!r.ok) { estado.textContent = r.errores.join(' '); return; }
      cache = await listar({ orden: 'fecha_desc' });
      estado.textContent = `Restaurados ${r.productosImportados} producto(s)` +
        (r.productosOmitidos ? `, ${r.productosOmitidos} ya estaban` : '') + '.' +
        (r.avisos.length ? ' ' + r.avisos.join(' ') : '');
      repintar();
    });
    input.click();
  });
}

/** Recupera un producto guardado al estado en curso para volver a verlo. */
function volverAVer(p) {
  enCurso.nombre = p.nombre;
  enCurso.categoria = p.categoria;
  enCurso.nutrientes = p.entrada?.nutrientes ?? {};
  enCurso.ingredientes = p.entrada?.ingredientes ?? [];
  enCurso.racionGramos = p.entrada?.racion_declarada_g ?? null;
  enCurso.veredicto = p.veredicto;
  window.dispatchEvent(new CustomEvent('comer:ver-resultado'));
}

/** Fuerza a releer de la base la próxima vez. */
export function refrescarDespensa() {
  cache = [];
}

export async function ultimos(n = 4) {
  return listar({ orden: 'fecha_desc', limite: n });
}
