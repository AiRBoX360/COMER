import { esc, pendiente } from '../ui.js';
import { capturar, pedirFoto, aURL } from '../camara.js';
import { analizarProducto } from '../motor.js';
import { enCurso, reiniciar, hayAlgoEnCurso, resumenEnCurso, cargarDatosDeFuera } from '../estado.js';
import { nombrePantalla } from './inicio.js';
import { buscarPorCodigo } from '../codigobarras.js';
import { descargarFotoProducto } from '../fotoproducto.js';
import { buscarFrescoExtra, buscarMediterraneo } from '../frescos-extra.js';
import { buscarFresco, frescoAEntrada, compararConAnterior,
         buscarPorCodigoGuardado } from '../motor.js';
import { listar } from '../almacen.js';
import { escanear, hayEscaner } from '../escaner.js';
import { analizarTabla, analizarIngredientesTexto, validar, validarContraIngredientes, normalizarNutrientes } from '../motor.js';


/** Lo capturado en esta sesión. Se pierde al salir, y es lo correcto: guardar
 *  a medias un análisis sin terminar solo ensuciaría la Despensa. */
const capturas = new Map();

/**
 * El último código consultado.
 *
 * Se guarda fuera de la pantalla porque al cargar un producto la pantalla se
 * repinta, la casilla se vaciaba y volvía a verse el texto de ejemplo. Parecía
 * que el escáner había leído mal cuando en realidad había acertado.
 */
let ultimoCodigo = '';

const ICONO_CAMARA = `<svg viewBox="0 0 24 24" aria-hidden="true" class="toma__icono">
  <path d="M3 8h3l1.5-2.5h9L18 8h3v11H3z"/><circle cx="12" cy="13" r="3.5"/></svg>`;

// La barra de "lo que tienes a medias" salió de aquí.
//
// Estaba para no perder un análisis empezado si te ibas de la pantalla y
// volvías. Pero lo que se guarda casi siempre viene de escanear un código, y
// eso se rehace en dos segundos: avisaba de algo que no costaba nada perder, y
// ocupaba lo primero que ves al entrar.
//
// Lo que sí se guarda sigue guardado: si estabas a medias y vuelves, tus datos
// están ahí. Simplemente ya no se anuncia.

/**
 * Qué vía está abierta. Solo una a la vez.
 *
 * Antes se veían las cuatro desplegadas con su párrafo explicando para qué
 * servía cada una: un muro de texto que se lee una vez y estorba las otras
 * cien. Ahora son cuatro tarjetas y se abre la que se toca.
 */
let abierta = '';

const VIAS = [
  { clave: 'codigo', titulo: 'Escanear código',
    icono: '<path d="M4 5v14M7.2 5v14M10 5v10M12.8 5v14M16 5v10M18.6 5v14M21 5v14" stroke-linecap="butt"/>' },
  { clave: 'fresco', titulo: 'Alimentos frescos',
    icono: '<path d="M12 20c4.5 0 8-3.6 8-8 0-4-3-8-8-8s-8 4-8 8c0 4.4 3.5 8 8 8Z"/><path d="M12 20V9"/>' },
  { clave: 'texto', titulo: 'Pegar texto',
    icono: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>' },
];

/** La tarjeta de una vía: círculo verde, nombre, y nada más. */
function tarjetaVia(via, abiertaAhora) {
  return `
    <button class="via${abiertaAhora ? ' via--abierta' : ''}"
            data-via="${via.clave}" aria-expanded="${abiertaAhora}">
      <span class="via__icono" aria-hidden="true">
        <svg viewBox="0 0 24 24">${via.icono}</svg>
      </span>
      <span class="via__nombre">${esc(via.titulo)}</span>
    </button>`;
}

/**
 * El botón de acción, igual en las cuatro vías.
 *
 * Antes cada una tenía el suyo con su rótulo: "Buscar el producto",
 * "Interpretar el texto pegado", "Leer las fotos". Tres nombres para la misma
 * intención. Ahora es un solo botón redondo y siempre dice lo mismo, así que
 * no hay que leerlo: se reconoce por la forma.
 *
 * El identificador sí cambia según la vía, porque cada una hace algo distinto
 * por dentro. Eso no se ve y no tiene por qué unificarse.
 */
function botonBuscar(id, desactivado = false) {
  return `
    <div class="buscar">
      <div class="buscar__uno">
        <button class="buscar__boton" id="${id}" ${desactivado ? 'disabled' : ''}
                aria-label="Buscar alimento">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L20 20"/>
          </svg>
        </button>
        <span class="buscar__rotulo">Buscar alimento</span>
      </div>
      ${botonFoto()}
    </div>`;
}

/**
 * Hacerle una foto al producto, para que se vea en la Despensa.
 *
 * Va al lado del de buscar en las tres vías. La foto se guarda aparte y
 * aguanta hasta que guardas el análisis, así que da igual si la haces antes o
 * después de buscar: no se pierde por el camino.
 *
 * Esto NO lee la etiqueta. Antes había una vía entera para leer las fotos y
 * daba más problemas que resultados; para los datos están el código, los
 * alimentos frescos y el texto pegado, que aciertan mucho más.
 */
export function botonFoto() {
  const hecha = capturas.has('frontal');
  return `
    <div class="buscar__uno">
      <button class="buscar__boton${hecha ? ' buscar__boton--hecha' : ''}"
              id="btnFotoProducto" aria-label="Fotografiar el producto">
        ${hecha
          ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
          : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h3l1.5-2.5h9L18 8h3v11H3z"/><circle cx="12" cy="13" r="3.5"/></svg>'}
      </button>
      <span class="buscar__rotulo">${hecha ? 'Foto hecha · cambiar' : 'Fotografiar producto'}</span>
    </div>`;
}

/**
 * ¿Ha cambiado la receta desde la última vez?
 *
 * Las marcas reformulan en silencio: suben la sal, cambian el aceite, meten un
 * aroma, y el envase sigue igual. Nadie avisa.
 *
 * Esto no vigila nada por detrás. Solo compara cuando vuelves a pasar el mismo
 * código, que es cuando de verdad se puede saber. Y lo viejo no se machaca: se
 * guarda como versión nueva y la anterior queda en el historial, porque lo que
 * importa es precisamente el cambio.
 */
let cambioDetectado = null;

async function avisarSiCambio(codigo) {
  cambioDetectado = null;
  try {
    const anterior = buscarPorCodigoGuardado(await listar({ orden: 'fecha_desc' }), codigo);
    if (!anterior) return;
    const v = analizarProducto({
      nombre: enCurso.nombre, categoria: enCurso.categoria,
      nutrientes: enCurso.nutrientes, ingredientes: enCurso.ingredientes,
    });
    const r = compararConAnterior(anterior, {
      nutrientes: enCurso.nutrientes, ingredientes: enCurso.ingredientes, veredicto: v,
    });
    if (r.hayCambios) cambioDetectado = r;
  } catch { /* sin base de datos, sin comparación */ }
}

function bloqueCambio() {
  const r = cambioDetectado;
  if (!r) return '';
  const fecha = new Date(r.fechaAnterior).toLocaleDateString('es-ES',
    { day: 'numeric', month: 'long', year: 'numeric' });
  const baja = typeof r.notaAntes === 'number' && typeof r.notaAhora === 'number' &&
               r.notaAhora < r.notaAntes;
  return `
    <div class="cambio${baja ? ' cambio--peor' : ''}">
      <h3>Ha cambiado desde la última vez</h3>
      <p class="cambio__cuando">Lo analizaste el ${esc(fecha)}.</p>
      <ul class="cambio__lista">
        ${r.nutrientes.slice(0, 4).map((n) => `
          <li><b>${esc(n.nombre)}</b>
            <span class="cifra">${n.antes} → ${n.ahora} ${esc(n.unidad)}</span></li>`).join('')}
        ${r.ingredientesNuevos.length ? `
          <li><b>Ahora lleva</b> <span>${esc(r.ingredientesNuevos.join(', '))}</span></li>` : ''}
        ${r.ingredientesQuitados.length ? `
          <li><b>Ya no lleva</b> <span>${esc(r.ingredientesQuitados.join(', '))}</span></li>` : ''}
      </ul>
      ${typeof r.notaAntes === 'number' && typeof r.notaAhora === 'number' && r.notaAntes !== r.notaAhora
        ? `<p class="cambio__nota cifra">Su nota ${baja ? 'baja' : 'sube'} de ${r.notaAntes} a ${r.notaAhora}</p>`
        : ''}
      <p class="apunte-via">El análisis anterior no se borra: los dos quedan en la Despensa.</p>
    </div>`;
}

export function analizar() {

  // Con una vía abierta, las otras tres desaparecen: la pantalla se dedica a
  // lo que estás haciendo. Cerrada, se ven las cuatro para elegir.
  const cuerpo = {
    codigo: `
      <div class="escaner" id="zonaEscaner" hidden>
        <video id="videoEscaner" muted playsinline></video>
        <div class="escaner__mira"></div>
        <button class="boton" id="btnCancelarEscaner">Cancelar</button>
      </div>
      <button class="caja-accion" id="btnEscanear">Escanea con la cámara</button>
      <div class="campo">
        <div class="campo__entrada">
          <input id="codigoBarras" type="text" inputmode="numeric"
                 value="${esc(ultimoCodigo)}"
                 placeholder="Pega o escribe el número" autocomplete="off">
        </div>
      </div>
      ${botonBuscar('btnBuscarCodigo')}
      <p class="texto" id="estadoCodigo" role="status" aria-live="polite"></p>
      <p class="apunte-via">Consulta Open Food Facts. Es la única parte de la app que sale a internet, y solo viaja el número.</p>`,

    fresco: `
      <div class="campo">
        <div class="campo__entrada">
          <span class="campo__lupa" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L20 20"/></svg>
        </span>
        <input id="buscaFresco" type="search"
                 placeholder="Pega o escribe el alimento" autocomplete="off">
        </div>
      </div>
      <div id="resultadosFresco"></div>
      ${botonBuscar('btnBuscarFresco')}
      <p class="apunte-via">Valores por 100 g de tablas de composición, no de un envase. Sirven para situar el alimento, no para contar gramos.</p>`,

    texto: `
      <h3 class="rotulo">Tabla nutricional</h3>
      <textarea id="pegaTabla" class="pegar" rows="7"
                placeholder="Valor energético 467 kcal&#10;Grasas 20 g&#10;..."></textarea>
      <h3 class="rotulo">Lista de ingredientes</h3>
      <textarea id="pegaIng" class="pegar" rows="6"
                placeholder="Ingredientes: harina de trigo, azúcar, ..."></textarea>
      ${botonBuscar('btnPegado')}
      <p class="texto" id="estadoLectura" role="status" aria-live="polite"></p>
      <p class="apunte-via">Copia el texto con el reconocimiento del iPhone: lee mejor que ningún programa.</p>`,

  };

  const abiertaVia = VIAS.find((v) => v.clave === abierta);

  return `
    ${nombrePantalla('Analizar')}

    <div class="vias">
      ${abiertaVia
        ? tarjetaVia(abiertaVia, true) + `<div class="via__cuerpo">${cuerpo[abierta]}</div>`
        : VIAS.map((v) => tarjetaVia(v, false)).join('')}
    </div>

    ${bloqueCambio()}
    <div id="resumenLectura"></div>
    <button class="boton-grande" id="btnRevisar" style="margin-top:16px; display:none">
      REVISAR Y CORREGIR
      <small>Comprueba las cifras antes de analizar</small>
    </button>
  `;
}

export function analizarActivo(raiz, { repintar, irA }) {

  // Solo existe en la vía de pegar texto; en las demás no pasa nada.
  const estado = raiz.querySelector('#estadoLectura') ?? { textContent: '' };
  const resumen = raiz.querySelector('#resumenLectura');

/**
   * Deja a la vista el botón de Revisar y baja hasta él.
   *
   * Se llama en cuanto hay algo cargado, venga de donde venga: un código, un
   * alimento fresco, texto pegado o unas fotos. Sin esto el botón se queda
   * oculto y el análisis no puede seguir.
   *
   * Se perdió al rehacer la pantalla, y se llamaba desde cuatro sitios: buscar
   * por código reventaba en el momento de encontrar el producto.
   */
  function irAlResumen() {
    const boton = raiz.querySelector('#btnRevisar');
    if (boton) {
      boton.style.display = '';
      boton.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  /** Cifra con coma decimal, que es como se escribe en español. */
  function conComa(v) {
    return String(v).replace('.', ',');
  }

  function pintarResumen() {
    const t = leido.tabla;
    const i = leido.ingredientes;
    if (!t && !i) { resumen.innerHTML = ''; return; }

    // El validador se ejecuta AQUÍ, sobre lo que se acaba de leer. Enseñar los
    // números sin comprobarlos antes fue un error: la app llegó a mostrar 8 g
    // de sal en un aperitivo sin decir una palabra.
    let incidencias = [];
    if (t) {
      const primero = (i?.ingredientes?.[0]?.texto ?? '').toLowerCase();
      const esSalado = /^sal\b/.test(primero) ||
        (i?.ingredientes ?? []).some((x) => /caldo|cubito|concentrado|sazonador/i.test(x.texto));
      const n = normalizarNutrientes(t.nutrientes);
      incidencias = validar(n, esSalado).incidencias;
      if (i?.ingredientes?.length) {
        const texto = i.ingredientes.map((x) => x.texto.toLowerCase()).join(' | ');
        incidencias = incidencias.concat(validarContraIngredientes(n, {
          total: i.ingredientes.length,
          hayFuenteAzucar: /azucar|azúcar|jarabe|dextrosa|glucosa|fructosa|maltodextrina|miel|melaza|sacarosa|panela|sirope/.test(texto),
          hayLacteo: /leche|lacteo|lácteo|yogur|nata|suero|queso|lactosa/.test(texto),
          hayFruta: /fruta|zumo|pure|puré|manzana|platano|plátano|naranja|fresa|melocoton|melocotón|pera|uva|datil|dátil/.test(texto),
          hayGrasaAnadida: /aceite|grasa|mantequilla|manteca|margarina/.test(texto),
          haySal: /\bsal\b|salmuera/.test(texto),
        }));
      }
    }
    const porCampo = new Map();
    for (const inc of incidencias) for (const c of inc.campos) porCampo.set(c, inc.gravedad);

    const campos = t ? Object.entries(t.nutrientes) : [];
    const filas = campos.map(([k, d]) => {
      const marca = porCampo.get(k);
      // Un campo leído con poca confianza se marca aunque no haya incidencia:
      // el aviso puede llegar tarde y la cifra ya está en pantalla.
      const flojo = typeof d.confianzaOCR === 'number' && d.confianzaOCR <= 0.5;
      const clase = marca === 'error' ? 'dudoso dudoso--error'
        : (marca === 'aviso' || flojo) ? 'dudoso' : '';
      const nota = flojo && !marca ? ' <em class="apunte">lectura dudosa</em>' : '';
      return `<li class="${clase}"><span>${esc(NOMBRES[k] ?? k)}${nota}</span>` +
             `<b class="valor cifra">${conComa(d.valor)} ${UNIDAD[k] ?? ''}</b></li>`;
    }).join('');

    const problemas = incidencias.map((inc) => `
      <li class="incidencia incidencia--${inc.gravedad}">
        <b>${inc.gravedad === 'error' ? 'No cuadra' : 'Revisa esto'}</b><br>${esc(inc.mensaje)}
        ${inc.correccion ? `<br><span class="cifra">${conComa(inc.correccion.valorActual)} → ${conComa(inc.correccion.valorPropuesto)}</span>` : ''}
      </li>`).join('');

    const avisos = [...(t?.avisos ?? []), ...(i?.avisos ?? [])]
      .map((a) => `<li>${esc(a)}</li>`).join('');

    const botonRevisar = raiz.querySelector('#btnRevisar');
    if (botonRevisar) botonRevisar.style.display = '';

    resumen.innerHTML = `
      <h2 class="subtitulo">Lo que se ha entendido</h2>
      ${t ? `<div class="tarjeta"><ul class="diagnostico">${filas || '<li>Nada reconocible en la tabla</li>'}</ul></div>` : ''}
      ${problemas ? `<h3 class="rotulo" style="margin-top:20px">Cifras que no encajan</h3><ul class="incidencias">${problemas}</ul>` : ''}
      ${i ? `<p class="texto" style="margin-top:12px"><strong>${i.ingredientes.length} ingrediente(s):</strong> ${esc(i.ingredientes.map((x) => x.texto).join(', ')) || 'ninguno'}</p>` : ''}
      ${i && i.trazas.length ? `<p class="texto">Trazas declaradas: ${esc(i.trazas.join(', '))}</p>` : ''}
      ${avisos ? `<div class="pendiente" style="margin-top:12px"><ul style="margin:0;padding-left:1.1em">${avisos}</ul></div>` : ''}`;
  }

  raiz.querySelector('#btnPegado')?.addEventListener('click', () => {
    const t = raiz.querySelector('#pegaTabla').value.trim();
    const i = raiz.querySelector('#pegaIng').value.trim();
    if (!t && !i) { estado.textContent = 'No has pegado nada todavía.'; return; }
    if (t) interpretar('tabla', t);
    if (i) interpretar('ingredientes', i);
    estado.textContent = 'Texto interpretado.';
    pintarResumen();
    irAlResumen();
  });

  raiz.querySelector('#btnEmpezarDeNuevo')?.addEventListener('click', () => {
    if (!confirm('¿Descartar lo que hay cargado y empezar con otro producto?')) return;
    reiniciar();
    capturas.clear();
    leido.tabla = null;
    leido.ingredientes = null;
    ultimoCodigo = '';
    repintar();
  });

  raiz.addEventListener('click', (e) => {
    const cab = e.target.closest('[data-via]');
    if (!cab) return;
    // Tocar la abierta la cierra; tocar otra la abre y cierra la anterior.
    abierta = abierta === cab.dataset.via ? '' : cab.dataset.via;
    repintar();
  });

  const estadoCodigo = raiz.querySelector('#estadoCodigo');

  /** Busca y carga un producto por su código, venga de la cámara o tecleado. */
  async function buscarYCargar(codigo) {
    ultimoCodigo = String(codigo ?? '').replace(/\D/g, '');
    estadoCodigo.textContent = 'Consultando…';
    const r = await buscarPorCodigo(codigo);

    if (!r.ok) { estadoCodigo.textContent = r.mensaje; return; }

    const p = r.producto;
    // Un código de barras identifica un producto entero, así que sustituye lo
    // que hubiera cargado en vez de sumarse. Si la ficha viene sin ingredientes
    // y se conservaran los del producto anterior, el veredicto saldría mal sin
    // que nada lo delatara.
    reiniciar();
    capturas.clear();
    leido.ingredientes = null;

    // Lo que llega de la base se trata igual que lo leído de una foto: entra
    // como dato leído, no como dato confirmado, y va a la pantalla de revisión.
    enCurso.nombre = p.nombre;
    // Foto, código, categorías, marca, tiendas y procedencia: la misma función
    // que usa el escáner del súper, para que ninguna vía se deje nada.
    cargarDatosDeFuera(p, ultimoCodigo);
    enCurso.categoria = p.categoria;
    if (p.racionGramos) enCurso.racionGramos = p.racionGramos;
    for (const [k, d] of Object.entries(p.nutrientes)) {
      if (enCurso.nutrientes[k]?.estado === 'corregido') continue;
      enCurso.nutrientes[k] = d;
    }
    if (p.ingredientesTexto) interpretar('ingredientes', p.ingredientesTexto);
    leido.tabla = { nutrientes: p.nutrientes, avisos: p.avisos, base: 'por_100' };

    estadoCodigo.textContent =
      `Código ${p.codigo} · Encontrado: ${p.nombre}${p.marca ? ` · ${p.marca}` : ''}. ` +
      (p.faltan.length ? `Faltan ${p.faltan.length} dato(s), complétalos abajo.` : 'Revísalo contra el envase.');
    await avisarSiCambio(codigo);
    repintar();
    // El desplazamiento va AQUÍ dentro, no en quien llama.
    //
    // Estaba solo en la rama del escáner con cámara, así que al teclear el
    // código o al pulsar "Buscar el producto" la pantalla se quedaba arriba y
    // el resultado aparecía abajo, fuera de la vista. Parecía que no había
    // encontrado nada. Poniéndolo dentro, todos los caminos lo hacen.
    irAlResumen();
  }

  // La foto del producto. No lee nada: solo se guarda para la Despensa.
  engancharFotoProducto(raiz, repintar);

  raiz.querySelector('#btnBuscarCodigo')?.addEventListener('click', () => {
    buscarYCargar(raiz.querySelector('#codigoBarras')?.value ?? '');
  });

  const zonaCamara = raiz.querySelector('#zonaEscaner');
  const video = raiz.querySelector('#videoEscaner');
  let escaneando = false;

  raiz.querySelector('#btnEscanear')?.addEventListener('click', async () => {
    if (escaneando) return;
    if (!(await hayEscaner())) {
      estadoCodigo.textContent = 'El lector de códigos no está instalado en esta copia de la app. Teclea el número a mano, que funciona igual.';
      return;
    }
    escaneando = true;
    zonaCamara.hidden = false;
    const r = await escanear({ video, alEstado: (t) => { estadoCodigo.textContent = t; } });
    zonaCamara.hidden = true;
    video.srcObject = null;
    escaneando = false;
    if (!r.ok) { estadoCodigo.textContent = r.mensaje; return; }
    const caja = raiz.querySelector('#codigoBarras');
    if (caja) caja.value = r.codigo;
    estadoCodigo.textContent = `Código leído: ${r.codigo}. Consultando…`;
    await buscarYCargar(r.codigo);
    // El código leído se queda a la vista: así se puede comprobar contra el
    // envase, que es lo primero que hace cualquiera cuando algo no cuadra.
    const cajaDespues = raiz.querySelector('#codigoBarras');
    if (cajaDespues) cajaDespues.value = r.codigo;
  });

  raiz.querySelector('#btnCancelarEscaner')?.addEventListener('click', () => {
    video.srcObject?.getTracks().forEach((t) => t.stop());
    zonaCamara.hidden = true;
    escaneando = false;
    estadoCodigo.textContent = '';
  });

  // --- Alimentos frescos ---------------------------------------------------
  const cajaFresco = raiz.querySelector('#buscaFresco');
  const listaFresco = raiz.querySelector('#resultadosFresco');
  cajaFresco?.addEventListener('input', () => {
    // Se busca en las dos listas: la del motor y la que se añadió después.
    const encontrados = [...buscarFresco(cajaFresco.value),
                         ...buscarFrescoExtra(cajaFresco.value),
                         ...buscarMediterraneo(cajaFresco.value)];
    if (!encontrados.length) { listaFresco.innerHTML = ''; return; }
    listaFresco.innerHTML = encontrados.map((f, i) => `
      <button class="fresco" data-fresco="${i}">
        <span class="fresco__nombre">${esc(f.nombre)}</span>
        <span class="fresco__nota">${esc(f.nota)}</span>
      </button>`).join('');
    listaFresco.dataset.encontrados = JSON.stringify(encontrados.map((f) => f.nombre));
  });

  listaFresco?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fresco]');
    if (!b) return;
    // Se busca en las dos listas: la del motor y la que se añadió después.
    const encontrados = [...buscarFresco(cajaFresco.value),
                         ...buscarFrescoExtra(cajaFresco.value),
                         ...buscarMediterraneo(cajaFresco.value)];
    const f = encontrados[Number(b.dataset.fresco)];
    if (!f) return;

    // Un alimento fresco sustituye lo que hubiera: es un producto entero.
    reiniciar();
    capturas.clear();
    ultimoCodigo = '';
    const e2 = frescoAEntrada(f);
    enCurso.nombre = e2.nombre;
    enCurso.categoria = e2.categoria;
    enCurso.nutrientes = e2.nutrientes;
    enCurso.ingredientes = e2.ingredientes;
    leido.tabla = { nutrientes: e2.nutrientes, base: 'por_100',
      avisos: ['Valores por 100 g de porción comestible, tomados de tablas de composición de alimentos y no de un envase. Un alimento fresco varía con la madurez, la variedad y la procedencia.'] };
    repintar();
    irAlResumen();
  });

  raiz.querySelector('#btnBuscarFresco')?.addEventListener('click', () => {
    // La búsqueda ya ocurre al escribir. El botón está para quien prefiere
    // pulsar algo, que es mucha gente, y para que las cuatro vías acaben
    // igual: escribir, pulsar, resultado.
    raiz.querySelector('#buscaFresco')?.dispatchEvent(new Event('input', { bubbles: true }));
  });

  raiz.querySelector('#btnRevisar')?.addEventListener('click', () => irA('revisar'));

  pintarResumen();
}

const NOMBRES = {
  energia_kcal: 'Energía', energia_kj: 'Energía (kJ)', grasas_g: 'Grasas',
  saturadas_g: 'de las cuales saturadas', monoinsaturadas_g: 'Monoinsaturadas',
  poliinsaturadas_g: 'Poliinsaturadas', trans_g: 'Grasas trans',
  hidratos_g: 'Hidratos de carbono', azucares_g: 'de los cuales azúcares',
  polialcoholes_g: 'Polialcoholes', fibra_g: 'Fibra', proteinas_g: 'Proteínas',
  sal_g: 'Sal', sodio_mg: 'Sodio',
};
const UNIDAD = {
  energia_kcal: 'kcal', energia_kj: 'kJ', sodio_mg: 'mg',
  grasas_g: 'g', saturadas_g: 'g', monoinsaturadas_g: 'g', poliinsaturadas_g: 'g',
  trans_g: 'g', hidratos_g: 'g', azucares_g: 'g', polialcoholes_g: 'g',
  fibra_g: 'g', proteinas_g: 'g', sal_g: 'g',
};

/** Lo leído hasta ahora, para que el módulo 7 lo recoja. */
export const leido = { tabla: null, ingredientes: null };

/**
 * Engancha el botón de fotografiar el producto.
 *
 * Vive aquí porque aquí están las capturas, pero lo usan las tres vías de
 * Analizar y también el Escaneo rápido: la foto tiene que poder hacerse desde
 * donde estés, no solo desde una pantalla.
 */
export function engancharFotoProducto(raiz, repintar) {
  raiz.querySelector('#btnFotoProducto')?.addEventListener('click', async () => {
    const fichero = await pedirFoto();
    if (!fichero) return;
    try {
      const { original, preparada, calidad } = await capturar(fichero);
      capturas.set('frontal', {
        calidad, preparada, original, fichero,
        urlOriginal: aURL(original, 0.72),
        urlPreparada: aURL(preparada, 0.6),
      });
      repintar();
    } catch (err) {
      alert(`No se ha podido usar la foto. ${err.message}`);
    }
  });
}

export function capturasActuales() {
  return capturas;
}

/** Convierte texto suelto en datos, venga de donde venga. */
export function interpretar(clave, texto) {
  if (clave === 'tabla') {
    leido.tabla = analizarTabla(texto);
    // Lo leído pasa al estado compartido para que Revisar trabaje sobre ello.
    // Lo ya corregido a mano no se pisa: ahí manda la persona.
    for (const [k, d] of Object.entries(leido.tabla.nutrientes)) {
      if (enCurso.nutrientes[k]?.estado === 'corregido') continue;
      enCurso.nutrientes[k] = d;
    }
    if (leido.tabla.racionGramos && !enCurso.racionGramos) {
      enCurso.racionGramos = leido.tabla.racionGramos;
    }
    enCurso.avisosLectura = leido.tabla.avisos;
    return leido.tabla;
  }
  leido.ingredientes = analizarIngredientesTexto(texto);
  enCurso.ingredientes = leido.ingredientes.ingredientes.map(
    (i) => ({ texto: i.texto, porcentaje: i.porcentaje }));
  enCurso.trazas = leido.ingredientes.trazas;
  return leido.ingredientes;
}

