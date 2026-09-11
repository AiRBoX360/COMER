import { NIVELES, esc, vacio } from '../ui.js';
import { listar, borrar, urlDeFoto, soltarFotos, estadisticas,
         descargarCopia, restaurarCopia, almacenDuradero,
         simularRecalculoTodo, aplicarRecalculo, anadirFoto } from '../almacen.js';
import { enCurso } from '../estado.js';
import { pedirFichero, pedirFoto, capturar, aBytes } from '../camara.js';
import { reiniciarCombinar } from './combinar.js';
import { nombrePantalla } from './inicio.js';

/**
 * La Despensa.
 *
 * Todo lo analizado, repartido en los cinco bloques de color. El orden es de
 * arriba abajo empezando por lo peor: lo que conviene mirar con lupa se ve
 * primero, no hay que bajar a buscarlo.
 */

let cache = [];
let filtro = '';
let buscarDentro = false;
let pendientes = null;

/**
 * Aviso de productos analizados con una versión anterior.
 *
 * No se recalcula solo. Cambiar el historial a espaldas de nadie es peor que
 * tenerlo desactualizado: al menos lo viejo lleva escrita su versión.
 */
function bloqueRecalculo() {
  if (!pendientes || pendientes.length === 0) return '';
  const cambian = pendientes.filter((c) => c.recalculable && c.diferencia !== 0);
  const filas = cambian.slice(0, 6).map((c) => `
    <li>
      <span>${esc(c.nombre)}</span>
      <b class="cifra">${c.notaAntes ?? '—'} → ${c.notaDespues ?? '—'}</b>
    </li>`).join('');
  const noSePuede = pendientes.filter((c) => !c.recalculable).length;

  return `
    <div class="pendiente" style="border-left-color:var(--amarillo); margin-bottom:16px">
      <div>
        <b>${pendientes.length} producto(s) se analizaron con una versión anterior del criterio.</b>
        Sus notas no son comparables con las de ahora.
        ${cambian.length ? `<ul class="diagnostico" style="margin-top:12px">${filas}</ul>` : ''}
        ${noSePuede ? `<p style="margin-top:8px">${noSePuede} no se puede(n) recalcular: se guardaron sin los datos de la etiqueta.</p>` : ''}
        <button class="boton" id="btnRecalcular" style="margin-top:12px; width:100%">
          Recalcular con el criterio de ahora
        </button>
      </div>
    </div>`;
}

/**
 * ¿Encaja este producto con lo buscado?
 *
 * Buscando "dentro" se mira lo que dice la ETIQUETA: ingredientes, aditivos
 * detectados y alérgenos. NO la prosa del motor, porque uno de sus textos es
 * "Sin azúcares añadidos" y buscar "azúcar" devolvía unas lentejas.
 */
function coincide(p, termino) {
  const t = termino.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const limpiar = (x) => String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (!buscarDentro) return limpiar(`${p.nombre} ${p.marca ?? ''}`).includes(t);

  const ingredientes = (p.entrada?.ingredientes ?? []).map((i) => i.texto);
  const aditivos = (p.veredicto?.sustancias ?? [])
    .filter((s) => typeof s.riesgo === 'number')
    .map((s) => `${s.codigo} ${s.nombre}`);
  const alergenos = (p.veredicto?.alergenos ?? []).map((a) => a.nombre);
  return limpiar([...ingredientes, ...aditivos, ...alergenos].join(' | ')).includes(t);
}

function ficha(p) {
  const fecha = new Date(p.fechaAnalisis).toLocaleDateString('es-ES',
    { day: 'numeric', month: 'short', year: 'numeric' });
  const frontal = p.fotos.find((f) => f.tipo === 'frontal') ?? p.fotos[0];
  return `
    <article class="producto" data-id="${p.id}">
      ${frontal
        ? `<div class="producto__foto" data-foto="${frontal.idFoto}"></div>`
        : `<button class="producto__foto producto__foto--vacia" data-poner-foto="${p.id}"
                   aria-label="Añadir una foto de ${esc(p.nombre)}">
             <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>
           </button>`}
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
  // Dos formas de buscar: por el nombre del producto, o DENTRO de él. La
  // segunda es la que convierte la despensa en algo consultable: poder
  // preguntar "¿qué tengo con aceite de palma?".
  const visibles = filtro ? cache.filter((p) => coincide(p, filtro)) : cache;

  const bloques = NIVELES.slice().reverse().map((n) => {
    const suyos = visibles.filter((p) => p.semaforo === n.clave);
    if (total > 0 && suyos.length === 0) return '';
    return `
      <section class="bloque" data-nivel="${n.clave}">
        <h3 class="bloque__titulo">${esc(n.texto)} · ${suyos.length}</h3>
        ${suyos.map(ficha).join('') || '<p class="texto" style="font-size:0.9rem">Ninguno todavía.</p>'}
      </section>`;
  }).join('');

  const sinNota = visibles.filter((p) => p.semaforo === null);

  return `
    ${nombrePantalla('Despensa')}
    <p class="texto">Todo lo que has analizado, de lo que menos conviene a lo que más.</p>

    ${bloqueRecalculo()}

    ${!almacenDuradero() ? `
      <div class="pendiente" style="border-left-color:var(--naranja); margin-bottom:16px">
        <div><b>Este navegador no deja guardar nada.</b> Puedes analizar productos, pero se perderán al cerrar. Suele pasar en navegación privada.</div>
      </div>` : ''}

    ${total === 0 ? vacio('Todavía no has guardado nada',
      'Analiza un producto y pulsa "Guardar en la despensa". Aparecerá aquí.') : `
      <div class="campo">
        <div class="campo__entrada">
          <input type="search" id="buscarDespensa" value="${esc(filtro)}"
                 placeholder="${buscarDentro ? 'aceite de palma, E250, gluten…' : 'Buscar por nombre'}"
                 autocomplete="off">
        </div>
      </div>
      <div class="filtros">
        <button class="filtro${buscarDentro ? '' : ' es-activo'}" data-donde="nombre">Por nombre</button>
        <button class="filtro${buscarDentro ? ' es-activo' : ''}" data-donde="dentro">Por lo que lleva dentro</button>
      </div>
      ${filtro ? `<p class="texto" style="font-size:0.9rem; margin-top:10px">
        ${visibles.length} de ${total} producto(s)${buscarDentro ? ` llevan "${esc(filtro)}"` : ''}.
      </p>` : ''}
      ${bloques}
      ${sinNota.length ? `
        <section class="bloque">
          <h2 class="rotulo">Sin nota, por datos incompletos</h2>
          ${sinNota.map(ficha).join('')}
        </section>` : ''}`}

    ${total >= 2 ? `
      <button class="boton-grande" id="btnComparar" style="margin:24px 0 12px">
        COMPARAR DOS PRODUCTOS
        <small>Cuál conviene, y por qué</small>
      </button>` : ''}
    ${total >= 2 ? `
      <button class="boton-grande boton-grande--suave" id="btnCombinar" style="margin-bottom:24px">
        QUÉ JUNTAR
        <small>Qué alimentos tuyos se potencian entre sí, y cuáles se estorban</small>
      </button>` : ''}

    <h2 class="subtitulo">Copia de seguridad</h2>
    <p class="texto">Tus datos viven solo en este teléfono. Si el navegador se queda sin espacio puede borrarlos, así que conviene guardar una copia de vez en cuando.</p>
    <div class="toma__botones">
      <button class="boton" id="btnExportar">Guardar copia</button>
      <button class="boton" id="btnImportar">Restaurar copia</button>
    </div>
    <p class="texto" id="estadoCopia" role="status" aria-live="polite" style="margin-top:12px; font-size:0.92rem"></p>
  `;
}

export async function despensaActivo(raiz, { repintar }) {
  soltarFotos();

  // Se cargan los productos y se repinta una sola vez, para no dejar la
  // pantalla parpadeando mientras llegan.
  if (cache.length === 0) {
    const lista = await listar({ orden: 'fecha_desc' });
    if (lista.length > 0) {
      cache = lista;
      pendientes = await simularRecalculoTodo();
      repintar();
      return;
    }
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

  // --- Poner foto a un producto que no la tiene ---------------------------
  raiz.addEventListener('click', (e) => {
    const d = e.target.closest('[data-donde]');
    if (!d) return;
    buscarDentro = d.dataset.donde === 'dentro';
    repintar();
    raiz.querySelector('#buscarDespensa')?.focus();
  });

  raiz.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-poner-foto]');
    if (!b) return;
    e.stopPropagation();          // no abrir el producto al tocar el hueco

    const fichero = await pedirFoto();
    if (!fichero) return;

    b.classList.add('producto__foto--trabajando');
    try {
      const { original } = await capturar(fichero);
      await anadirFoto(b.dataset.ponerFoto, await aBytes(original, 0.7), 'frontal');
      cache = await listar({ orden: 'fecha_desc' });
      repintar();
    } catch (err) {
      b.classList.remove('producto__foto--trabajando');
      alert(`No se ha podido guardar la foto. ${err.message}`);
    }
  });

  raiz.querySelector('#btnRecalcular')?.addEventListener('click', async (e) => {
    const b = e.target;
    b.disabled = true;
    b.textContent = 'Recalculando…';
    const r = await aplicarRecalculo();
    cache = await listar({ orden: 'fecha_desc' });
    pendientes = await simularRecalculoTodo();
    repintar();
    const est2 = raiz.querySelector('#estadoCopia');
    if (est2) {
      est2.textContent = `Recalculados ${r.recalculados} producto(s)` +
        (r.cambiosDeColor ? `, ${r.cambiosDeColor} cambió de color` : '') +
        (r.omitidos ? `. ${r.omitidos} no se pudo por falta de datos` : '') + '.';
    }
  });

  raiz.querySelector('#btnComparar')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('comer:comparar'));
  });

  raiz.querySelector('#btnCombinar')?.addEventListener('click', () => {
    reiniciarCombinar();
    window.dispatchEvent(new CustomEvent('comer:combinar'));
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

  raiz.querySelector('#btnImportar')?.addEventListener('click', async () => {
    // Sin filtro de tipo: la app Archivos del iPhone puede negarse a mostrar
    // el fichero de copia si se le pide solo ".json", y entonces parece que no
    // está cuando sí está.
    estado.textContent = 'Elige el fichero de copia…';
    const f = await pedirFichero();
    if (!f) { estado.textContent = 'No se ha elegido ningún fichero.'; return; }

    estado.textContent = `Leyendo "${f.name}"…`;
    try {
      const r = await restaurarCopia(f);
      if (!r.ok) { estado.textContent = r.errores.join(' '); return; }
      cache = await listar({ orden: 'fecha_desc' });
      pendientes = await simularRecalculoTodo();
      estado.textContent = `Restaurados ${r.productosImportados} producto(s)` +
        (r.productosOmitidos ? `, ${r.productosOmitidos} ya estaban` : '') + '.' +
        (r.avisos.length ? ' ' + r.avisos.join(' ') : '');
      repintar();
    } catch (err) {
      // Nada de quedarse esperando: si algo revienta, se dice.
      estado.textContent = `No se ha podido restaurar. ${err.message}`;
    }
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
  pendientes = null;
}

export async function ultimos(n = 4) {
  return listar({ orden: 'fecha_desc', limite: n });
}
