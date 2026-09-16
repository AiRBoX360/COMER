import { NIVELES, esc, vacio } from '../ui.js';
import { listar, borrar, urlDeFoto, soltarFotos, estadisticas,
         descargarCopia, restaurarCopia, almacenDuradero,
         simularRecalculoTodo, aplicarRecalculo, anadirFoto } from '../almacen.js';
import { enCurso } from '../estado.js';
import { pedirFichero, pedirFoto, capturar, aBytes } from '../camara.js';
import { reiniciarCombinar } from './combinar.js';
import { copiaHecha, sinCopia, textoRecordatorio } from '../recordatorio.js';
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

/**
 * La parte que cambia al escribir en el buscador.
 *
 * Va aparte para poder refrescarla sola. Antes se repintaba la pantalla entera
 * con cada letra, y eso destruye el campo donde estás escribiendo: el teclado
 * se cerraba al segundo carácter.
 */
/**
 * Carga las fotos de los productos que se acaban de pintar.
 *
 * Se extrajo para poder llamarla también al refrescar solo la lista: si no,
 * al escribir en el buscador los productos salían sin foto.
 */
function pintarFotos(zona) {
  for (const hueco of zona.querySelectorAll('[data-foto]')) {
    urlDeFoto(hueco.dataset.foto).then((url) => {
      if (url) hueco.style.backgroundImage = `url(${url})`;
    });
  }
}

function listado(visibles, total, bloques, sinNota) {
  return `
    ${filtro ? `<p class="texto" style="font-size:var(--t2); margin-top:10px">
      ${visibles.length} de ${total} producto(s)${buscarDentro ? ` llevan "${esc(filtro)}"` : ''}.
    </p>` : ''}
    ${bloques}
    ${sinNota.length ? `
      <section class="bloque">
        <h2 class="rotulo">Sin nota, por datos incompletos</h2>
        ${sinNota.map(ficha).join('')}
      </section>` : ''}`;
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

/**
 * Una sección plegable de la Despensa.
 *
 * `abierta` decide si arranca desplegada. La de los alimentos sí: si no,
 * abrirías la Despensa y no verías tu despensa. Las demás no son el contenido
 * de esta pantalla, son puertas a otras cosas.
 */
/** Los iconos de cada sección, del mismo trazo que los de Analizar. */
const ICONOS = {
  alimentos: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  comparar: '<path d="M12 4v16"/><path d="M5 8h4M5 12h4M15 10h4M15 14h4"/>',
  juntar: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
  recetas: '<path d="M8 3c0 2-1.5 2.5-1.5 4.5S8 10 8 12"/><path d="M12 3c0 2-1.5 2.5-1.5 4.5S12 10 12 12"/><path d="M16 3c0 2-1.5 2.5-1.5 4.5S16 10 16 12"/><path d="M4 15h16a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6Z"/>',
  copia: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
};

/**
 * Una sección de la Despensa, con la misma cara que las vías de Analizar.
 *
 * Tenían dos estilos distintos y se notaba: la misma app parecía cosida de dos
 * telas. Ahora comparten círculo verde, nombre en negrita y perfil.
 */
function seccion(clave, titulo, cuerpo, abierta = false) {
  if (!cuerpo || !String(cuerpo).trim()) return '';
  return `
    <details class="via-seccion" data-seccion="${clave}"${abierta ? ' open' : ''}>
      <summary class="via">
        <span class="via__icono" aria-hidden="true">
          <svg viewBox="0 0 24 24">${ICONOS[clave] ?? ''}</svg>
        </span>
        <span class="via__nombre">${esc(titulo)}</span>
        <span class="via__flecha" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </span>
      </summary>
      <div class="via__cuerpo">${cuerpo}</div>
    </details>`;
}

export function despensa() {
  const total = cache.length;
  // Dos formas de buscar: por el nombre del producto, o DENTRO de él. La
  // segunda es la que convierte la despensa en algo consultable: poder
  // preguntar "¿qué tengo con aceite de palma?".
  const visibles = filtro ? cache.filter((p) => coincide(p, filtro)) : cache;
  const bloques = bloquesDeColor(visibles, total);
  const sinNota = visibles.filter((p) => p.semaforo === null);

  const alimentos = total === 0
    ? vacio('Todavía no has guardado nada',
        'Analiza un producto y pulsa "Guardar en la despensa". Aparecerá aquí.')
    : `
      <div class="campo">
        <div class="campo__entrada">
          <span class="campo__lupa" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L20 20"/></svg>
          </span>
          <input type="search" id="buscarDespensa" value="${esc(filtro)}"
                 placeholder="${buscarDentro ? 'aceite de palma, E250, gluten…' : 'Buscar por nombre'}"
                 autocomplete="off">
        </div>
      </div>
      <div class="filtros" style="margin-bottom:var(--e4)">
        <button class="filtro${buscarDentro ? '' : ' es-activo'}" data-donde="nombre">Por nombre</button>
        <button class="filtro${buscarDentro ? ' es-activo' : ''}" data-donde="dentro">Por lo que lleva dentro</button>
      </div>
      <div id="zonaDespensa">${listado(visibles, total, bloques, sinNota)}</div>`;

  return `
    ${nombrePantalla('Despensa')}

    ${bloqueRecalculo()}

    ${!almacenDuradero() ? `
      <div class="pendiente" style="border-left-color:var(--naranja); margin-bottom:16px">
        <div><b>Este navegador no deja guardar nada.</b> Puedes analizar productos, pero se perderán al cerrar. Suele pasar en navegación privada.</div>
      </div>` : ''}

    <div class="secciones">
      ${seccion('alimentos', `Alimentos analizados${total ? ` · ${total}` : ''}`, alimentos)}

      ${total >= 2 ? seccion('comparar', 'Comparar productos', `
        <p class="texto" style="font-size:var(--t2)">Dos de los tuyos, lado a lado: cuál conviene y por qué.</p>
        <button class="boton" id="btnComparar" style="width:100%">Elegir dos productos</button>`) : ''}

      ${total >= 2 ? seccion('juntar', 'Qué juntar', `
        <p class="texto" style="font-size:var(--t2)">Qué alimentos tuyos se potencian entre sí, y cuáles se estorban.</p>
        <button class="boton" id="btnCombinar" style="width:100%">Ver combinaciones</button>`) : ''}

      ${total >= 2 ? seccion('recetas', 'Recetas', `
        <p class="texto" style="font-size:var(--t2)">Elige lo que tienes a mano y te llevo a recetas de verdad, escritas por personas.</p>
        <button class="boton" id="btnRecetasDespensa" style="width:100%">Buscar recetas</button>`) : ''}

      ${seccion('copia', 'Copia de seguridad', `
        <p class="texto" style="font-size:var(--t2)">Tus datos viven solo en este teléfono. Si el navegador se queda sin espacio puede borrarlos, así que conviene guardar una copia de vez en cuando.</p>
        ${sinCopia() > 0 ? `<p class="apunte-via">${esc(textoRecordatorio())}</p>` : ''}
        <div class="toma__botones">
          <button class="boton" id="btnExportar">Guardar copia</button>
          <button class="boton" id="btnImportar">Restaurar copia</button>
        </div>
        <p class="texto" id="estadoCopia" role="status" aria-live="polite" style="margin-top:12px; font-size:var(--t2)"></p>`)}
    </div>
  `;
}

/**
 * Cuántos productos se enseñan de cada color antes de pedir más.
 *
 * Con 200 guardados, pintarlos todos daba 25 pantallas de scroll hasta llegar
 * al final, 137 KB de HTML y 200 fotos cargándose de golpe. La sección de
 * copia de seguridad quedaba materialmente inalcanzable.
 *
 * Cerrar la sección entera lo arreglaba a medias: seguías teniendo las 25
 * pantallas en cuanto la abrías. Con un tope por color se arregla del todo y
 * además sigues viendo tu despensa al entrar.
 */
const POR_BLOQUE = 6;
const abiertos = new Set();

/** Los cinco bloques de color, cada uno plegable y con su tope. */
function bloquesDeColor(visibles, total) {
  return NIVELES.slice().reverse().map((n) => {
    const suyos = visibles.filter((p) => p.semaforo === n.clave);
    if (total > 0 && suyos.length === 0) return '';
    const todos = abiertos.has(n.clave);
    const mostrados = todos ? suyos : suyos.slice(0, POR_BLOQUE);
    const faltan = suyos.length - mostrados.length;
    return `
      <details class="bloque" data-nivel="${n.clave}">
        <summary class="bloque__barra">
          <span class="bloque__nombre">${esc(n.texto)}</span>
          <span class="bloque__cuantos cifra">${suyos.length}</span>
          <span class="bloque__flecha" aria-hidden="true">+</span>
        </summary>
        ${mostrados.map(ficha).join('') || '<p class="texto" style="font-size:var(--t2)">Ninguno todavía.</p>'}
        ${faltan > 0 ? `
          <button class="boton" data-ver-todos="${n.clave}" style="width:100%; margin-top:var(--e2)">
            Ver ${faltan} más
          </button>` : ''}
      </details>`;
  }).join('');
}

export async function despensaActivo(raiz, { repintar }) {
  soltarFotos();

  // Se recarga SIEMPRE al entrar, no solo la primera vez.
  //
  // Antes solo se pedía la lista si la copia guardada estaba vacía. Eso hacía
  // que un producto guardado desde Resultado no apareciera hasta cerrar y
  // volver a abrir la app: la Despensa seguía enseñando lo que tenía de antes.
  //
  // Se repinta solo si algo ha cambiado, para no dejar la pantalla
  // parpadeando cada vez que entras.
  {
    const lista = await listar({ orden: 'fecha_desc' });
    const cambiado = lista.length !== cache.length
      || lista.some((p, i) => p.id !== cache[i]?.id);
    if (cambiado) {
      cache = lista;
      pendientes = await simularRecalculoTodo();
      repintar();
      return;
    }
  }

  // Las fotos se piden después de pintar: así la lista aparece enseguida y las
  // imágenes van entrando, en vez de esperar a que estén todas.
  pintarFotos(raiz);

  const buscador = raiz.querySelector('#buscarDespensa');
  if (buscador) {
    // Se refresca SOLO la lista: así el campo donde escribes no se destruye y
    // el teclado se queda abierto.
    buscador.addEventListener('input', () => {
      filtro = buscador.value;
      refrescarLista();
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
  /** Vuelve a dibujar solo los bloques de productos. */
  function refrescarLista() {
    const zona = raiz.querySelector('#zonaDespensa');
    if (!zona) return;
    const visibles = filtro ? cache.filter((p) => coincide(p, filtro)) : cache;
    const total = cache.length;
    const bloques = bloquesDeColor(visibles, total);
    const sinNota = visibles.filter((p) => p.semaforo === null);
    zona.innerHTML = listado(visibles, total, bloques, sinNota);
    pintarFotos(zona);
  }

  raiz.addEventListener('click', (e) => {
    const d = e.target.closest('[data-donde]');
    if (!d) return;
    buscarDentro = d.dataset.donde === 'dentro';
    for (const b of raiz.querySelectorAll('[data-donde]')) {
      b.classList.toggle('es-activo', b.dataset.donde === d.dataset.donde);
    }
    refrescarLista();
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

  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ver-todos]');
    if (!b) return;
    abiertos.add(b.dataset.verTodos);
    refrescarLista();
  });

  raiz.querySelector('#btnRecetasDespensa')?.addEventListener('click', () => {
    reiniciarCombinar('recetas');
    window.dispatchEvent(new CustomEvent('comer:combinar'));
  });

  raiz.querySelector('#btnCombinar')?.addEventListener('click', () => {
    reiniciarCombinar('juntar');
    window.dispatchEvent(new CustomEvent('comer:combinar'));
  });

  const estado = raiz.querySelector('#estadoCopia');

  raiz.querySelector('#btnExportar')?.addEventListener('click', async () => {
    if (cache.length === 0) { estado.textContent = 'No hay nada que guardar todavía.'; return; }
    estado.textContent = 'Preparando la copia…';
    try {
      const r = await descargarCopia();
      // La cuenta de "cuántos llevas sin copia" vuelve a cero.
      copiaHecha();
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
