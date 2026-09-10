import { esc, pendiente } from '../ui.js';
import { capturar, pedirFoto, aURL } from '../camara.js';
import { hayRecorte, RECORTE_COMPLETO, analizarProducto } from '../motor.js';
import { leerTexto, lectorDisponible, porQueNoHayLector, diagnosticarLector, probarArranque } from '../lector.js';
import { enCurso, reiniciar, hayAlgoEnCurso, resumenEnCurso } from '../estado.js';
import { nombrePantalla } from './inicio.js';
import { buscarPorCodigo } from '../codigobarras.js';
import { descargarFotoProducto } from '../fotoproducto.js';
import { buscarFresco, frescoAEntrada, compararConAnterior,
         buscarPorCodigoGuardado } from '../motor.js';
import { listar } from '../almacen.js';
import { escanear, hayEscaner } from '../escaner.js';
import { analizarTabla, analizarIngredientesTexto, validar, validarContraIngredientes, normalizarNutrientes } from '../motor.js';

/**
 * Las tres tomas.
 *
 * El frontal es opcional a propósito: sirve para reconocer el producto de un
 * vistazo en la Despensa, pero no aporta nada al análisis. Exigirlo alargaría
 * el proceso a cambio de nada.
 */
const TOMAS = [
  { clave: 'tabla', titulo: 'Tabla nutricional', pista: 'La rejilla de valores por 100 g', obligatoria: true },
  { clave: 'ingredientes', titulo: 'Lista de ingredientes', pista: 'Donde pone "Ingredientes:"', obligatoria: true },
  { clave: 'frontal', titulo: 'Frente del envase', pista: 'Para reconocerlo en la Despensa', obligatoria: false },
];

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

/**
 * Recorte con cuatro deslizadores.
 *
 * No se arrastran esquinas con el dedo a propósito. Un deslizador es un
 * control que el navegador ya sabe manejar al tacto, funciona con una sola
 * mano y, sobre todo, su lógica se puede probar fuera del navegador. Los
 * gestos táctiles habría habido que entregarlos sin probar.
 */
function marcoRecorte(clave, c) {
  if (!c.recortando) {
    return `<button class="boton" data-recortar="${clave}" style="width:100%; margin-top:12px">
      ${hayRecorte(c.recorte) ? 'Cambiar el recorte' : 'Recortar la zona que interesa'}
    </button>`;
  }
  const r = c.recorte;
  const desl = (eje, etiqueta, valor) => `
    <label class="desliza">
      <span>${etiqueta}</span>
      <input type="range" min="0" max="100" step="1" value="${valor}"
             data-desliza="${eje}" data-toma="${clave}">
    </label>`;

  return `
    <div class="recorte" data-marco="${clave}">
      <p class="texto" style="font-size:0.92rem; margin-top:12px">Deja dentro solo la tabla o los ingredientes. Todo lo que quede fuera se descarta antes de leer.</p>
      <div class="recorte__lienzo">
        <img src="${c.urlCompleta}" alt="Foto completa">
        <div class="recorte__marco" id="marco_${clave}"
             style="left:${r.x0}%; top:${r.y0}%; width:${r.x1 - r.x0}%; height:${r.y1 - r.y0}%"></div>
      </div>
      ${desl('x0', 'Izquierda', r.x0)}
      ${desl('x1', 'Derecha', r.x1)}
      ${desl('y0', 'Arriba', r.y0)}
      ${desl('y1', 'Abajo', r.y1)}
      <div class="toma__botones">
        <button class="boton" data-aplicar-recorte="${clave}">Aplicar</button>
        <button class="boton" data-quitar-recorte="${clave}">Sin recorte</button>
      </div>
    </div>`;
}

function tarjetaToma(t) {
  const c = capturas.get(t.clave);
  if (!c) {
    return `
      <div class="toma toma--vacia" data-toma="${t.clave}">
        ${ICONO_CAMARA}
        <span class="toma__titulo">${esc(t.titulo)}</span>
        <span class="toma__pista">${esc(t.pista)}${t.obligatoria ? '' : ' · opcional'}</span>
        <div class="toma__botones">
          <button class="boton" data-camara="${t.clave}">Hacer foto</button>
          <button class="boton" data-galeria="${t.clave}">Elegir una ya hecha</button>
        </div>
      </div>`;
  }

  const estado = c.calidad.repetir ? 'mala' : c.calidad.problemas.length ? 'regular' : 'lista';
  const dictamen = { mala: 'Conviene repetirla', regular: 'Servirá, pero puede mejorar', lista: 'Buena foto' }[estado];
  const problemas = c.calidad.problemas
    .map((p) => `<li><b>${esc(p.mensaje)}</b><br>${esc(p.consejo)}</li>`).join('');

  return `
    <div class="toma toma--${estado}" data-toma="${t.clave}">
      <div class="toma__cabecera">
        <span class="toma__titulo">${esc(t.titulo)}</span>
        <span class="toma__nota cifra">${c.calidad.puntuacion}/100</span>
      </div>
      <div class="toma__imagenes">
        <figure><img src="${c.urlOriginal}" alt="Tu foto de ${esc(t.titulo)}"><figcaption>${hayRecorte(c.recorte) ? 'Recortada' : 'Tu foto'}</figcaption></figure>
        <figure><img src="${c.urlPreparada}" alt="Versión preparada para leer"><figcaption>Lista para leer</figcaption></figure>
      </div>
      ${marcoRecorte(t.clave, c)}
      <p class="toma__dictamen toma__dictamen--${estado}">${dictamen}</p>
      ${problemas ? `<ul class="toma__problemas">${problemas}</ul>` : ''}
      <div class="toma__botones">
        <button class="boton" data-camara="${t.clave}">Repetir foto</button>
        <button class="boton" data-galeria="${t.clave}">Elegir otra</button>
      </div>
    </div>`;
}

/**
 * Qué producto hay cargado ahora mismo.
 *
 * Sin esto, los datos de un producto se colaban en el siguiente sin que nada
 * lo delatara: si la lectura nueva no reconocía los ingredientes, quedaban los
 * del anterior y el veredicto salía mal en silencio. Un análisis a medias
 * invisible es peor que uno vacío.
 */
function barraEnCurso() {
  if (!hayAlgoEnCurso()) return '';
  const r = resumenEnCurso();
  return `
    <div class="en-curso">
      <div class="en-curso__texto">
        <b>${esc(r.nombre || 'Producto sin nombre')}</b>
        <span>${r.campos} dato(s) de la tabla · ${r.ingredientes} ingrediente(s)</span>
      </div>
      <button class="boton" id="btnEmpezarDeNuevo">Empezar de nuevo</button>
    </div>`;
}

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
  { clave: 'fotos', titulo: 'Hacer fotos',
    icono: '<path d="M3 8h3l1.5-2.5h9L18 8h3v11H3z"/><circle cx="12" cy="13" r="3.5"/>' },
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
      <button class="buscar__boton" id="${id}" ${desactivado ? 'disabled' : ''}
              aria-label="Buscar alimento">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L20 20"/>
        </svg>
      </button>
      <span class="buscar__rotulo">Buscar alimento</span>
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
  const listo = TOMAS.filter((t) => t.obligatoria).every((t) => capturas.has(t.clave));

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
      <p class="apunte-via">Copia el texto con el reconocimiento del iPhone: lee mejor que ningún programa.</p>`,

    fotos: `
      <div id="tomas">${TOMAS.map(tarjetaToma).join('')}</div>
      ${botonBuscar('btnLeer', !listo)}
      <p class="texto" id="estadoLectura" role="status" aria-live="polite"></p>
      <button class="boton" id="btnDiagLector" style="width:100%">Comprobar el lector de fotos</button>
      <div id="diagLector"></div>`,
  };

  const abiertaVia = VIAS.find((v) => v.clave === abierta);

  return `
    ${nombrePantalla('Analizar')}
    ${barraEnCurso()}

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
  // Antes esto se salía si no encontraba las tomas de foto. Con las cuatro
  // vías desplegadas siempre, la condición nunca se cumplía. Ahora las fotos
  // solo existen cuando su tarjeta está abierta, así que salirse aquí dejaba
  // TODA la pantalla sin enganchar: ni el escáner, ni el código, ni las
  // tarjetas. Cada bloque comprueba lo suyo por su cuenta.
  const zona = raiz.querySelector('#tomas');

  async function tomar(clave, deGaleria = false) {
    const fichero = await pedirFoto({ camara: !deGaleria });
    if (!fichero) return;

    const tarjeta = zona.querySelector(`[data-toma="${clave}"]`);
    if (tarjeta) tarjeta.classList.add('toma--trabajando');
    // Un respiro para que el navegador pinte el estado de espera antes de
    // ponerse con el procesado, que es pesado y en un móvil se nota.
    await new Promise((r) => setTimeout(r, 30));

    try {
      const { original, preparada, calidad } = await capturar(fichero);
      capturas.set(clave, {
        calidad, preparada, original, fichero,
        recorte: { ...RECORTE_COMPLETO },
        recortando: false,
        // Se guarda también la foto entera para poder enseñar el marco encima
        // cuando se vaya a recortar.
        urlCompleta: aURL(original, 0.6),
        urlOriginal: aURL(original, 0.6),
        urlPreparada: aURL(preparada, 0.6),
      });
    } catch (err) {
      capturas.delete(clave);
      alert(`No se ha podido usar esa imagen. ${err.message}`);
    }
    repintar();
  }

  /** Vuelve a procesar la foto con el recorte que haya marcado. */
  async function aplicarRecorte(clave, recorte) {
    const c = capturas.get(clave);
    if (!c) return;
    const tarjeta = zona.querySelector(`[data-toma="${clave}"]`);
    if (tarjeta) tarjeta.classList.add('toma--trabajando');
    await new Promise((r) => setTimeout(r, 30));
    try {
      const { original, preparada, calidad } = await capturar(c.fichero, recorte);
      capturas.set(clave, {
        ...c, calidad, preparada, original, recorte, recortando: false,
        urlOriginal: aURL(original, 0.6),
        urlPreparada: aURL(preparada, 0.6),
      });
    } catch (err) {
      alert(`No se ha podido recortar. ${err.message}`);
    }
    repintar();
  }

  // Mover un deslizador solo mueve el marco. Repintar en cada movimiento
  // robaría el foco del deslizador a media pasada.
  zona?.addEventListener('input', (e) => {
    const eje = e.target.dataset.desliza;
    if (!eje) return;
    const clave = e.target.dataset.toma;
    const c = capturas.get(clave);
    if (!c) return;
    c.recorte[eje] = Number(e.target.value);
    const r = c.recorte;
    const marco = zona.querySelector(`#marco_${clave}`);
    if (!marco) return;
    // Se pinta enderezado aunque los deslizadores estén cruzados.
    const x0 = Math.min(r.x0, r.x1), x1 = Math.max(r.x0, r.x1);
    const y0 = Math.min(r.y0, r.y1), y1 = Math.max(r.y0, r.y1);
    marco.style.left = `${x0}%`;
    marco.style.top = `${y0}%`;
    marco.style.width = `${x1 - x0}%`;
    marco.style.height = `${y1 - y0}%`;
  });

  zona?.addEventListener('click', (e) => {
    const abrir = e.target.closest('[data-recortar]');
    if (abrir) {
      const c = capturas.get(abrir.dataset.recortar);
      if (c) { c.recortando = true; repintar(); }
      return;
    }
    const aplicar = e.target.closest('[data-aplicar-recorte]');
    if (aplicar) {
      const c = capturas.get(aplicar.dataset.aplicarRecorte);
      if (c) aplicarRecorte(aplicar.dataset.aplicarRecorte, { ...c.recorte });
      return;
    }
    const quitar = e.target.closest('[data-quitar-recorte]');
    if (quitar) {
      aplicarRecorte(quitar.dataset.quitarRecorte, { ...RECORTE_COMPLETO });
      return;
    }
    const galeria = e.target.closest('[data-galeria]');
    if (galeria) { tomar(galeria.dataset.galeria, true); return; }
    const camara = e.target.closest('[data-camara]');
    if (camara) { tomar(camara.dataset.camara, false); return; }
    const repetir = e.target.closest('[data-repetir]');
    if (repetir) { tomar(repetir.dataset.repetir, false); return; }
  });

  const estado = raiz.querySelector('#estadoLectura');
  const resumen = raiz.querySelector('#resumenLectura');

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

  raiz.querySelector('#btnLeer')?.addEventListener('click', async (e) => {
    const boton = e.target.closest('button');
    if (boton) boton.disabled = true;
    estado.textContent = 'Preparando el lector… la primera vez descarga casi nueve megas y puede tardar un par de minutos.';
    try {
      for (const clave of ['tabla', 'ingredientes']) {
        const r = await leerCaptura(clave, (p, s2) => {
          const FASES = {
            'cargando el lector': 'Cargando el lector',
            'arrancando el trabajador': 'Arrancando el lector',
            'loading tesseract core': 'Descargando el núcleo',
            'initializing tesseract': 'Arrancando el núcleo',
            'loading language traineddata': 'Descargando el idioma español',
            'initializing api': 'Preparando',
            'recognizing text': 'Leyendo la foto',
            listo: 'Listo',
          };
          estado.textContent = `${FASES[s2] ?? s2} · ${clave} · ${Math.round(p * 100)} %`;
        });
        if (!r.ok) { estado.textContent = r.motivo; return; }
        interpretar(clave, r.texto);
      }
      estado.textContent = 'Listo. Revisa lo que ha entendido.';
      pintarResumen();
      irAlResumen();
    } catch (err) {
      // Nada de quedarse en silencio: si esto revienta, se dice qué reventó.
      estado.textContent = `Algo ha fallado al leer las fotos: ${err.message}. Pulsa "Comprobar el lector de fotos" para ver qué falta.`;
    } finally {
      if (boton) boton.disabled = false;
    }
  });

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
    enCurso.codigoBarras = p.codigo ?? ultimoCodigo;
    // La foto del envase viene en la ficha de Open Food Facts. Se descarga en
    // segundo plano: si tarda o falla, el análisis sigue su curso sin ella.
    enCurso.fotoUrl = p.imagenUrl ?? null;
    // Las categorías de Open Food Facts hacen falta para buscar alternativas:
    // sin ellas no hay con qué comparar.
    enCurso.categoriasTags = p.categoriasTags ?? null;
    enCurso.marca = p.marca ?? null;
    enCurso.tiendas = p.tiendas ?? null;
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
    const encontrados = buscarFresco(cajaFresco.value);
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
    const encontrados = buscarFresco(cajaFresco.value);
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

  raiz.querySelector('#btnDiagLector')?.addEventListener('click', async (e) => {
    const caja = raiz.querySelector('#diagLector');
    e.target.disabled = true;
    caja.innerHTML = '<p class="texto">Comprobando…</p>';
    const filas = await diagnosticarLector();
    const tabla = () => `
      <div class="tarjeta">
        <ul class="diagnostico">
          ${filas.map((f) => `
            <li><span>${esc(f.fichero)}</span><b class="${f.ok ? 'si' : 'no'}">${esc(f.detalle)}</b></li>`).join('')}
        </ul>
      </div>`;

    if (!filas.every((f) => f.ok)) {
      e.target.disabled = false;
      caja.innerHTML = tabla() +
        '<p class="texto" style="margin-top:12px">Lo que sale en naranja es lo que falla. Mándame esta pantalla.</p>';
      return;
    }

    // Los ficheros están. Lo que hay que saber es si arranca.
    caja.innerHTML = tabla() + '<p class="texto" id="faseArranque" role="status" aria-live="polite" style="margin-top:12px">Intentando arrancarlo…</p>';
    const linea = caja.querySelector('#faseArranque');
    const r = await probarArranque((p, fase) => {
      linea.textContent = `${fase ?? 'arrancando'} · ${Math.round(p * 100)} %`;
    });
    e.target.disabled = false;
    caja.innerHTML = tabla() + `
      <div class="pendiente" style="margin-top:12px; border-left-color:var(--${r.ok ? 'verde-claro' : 'naranja'})">
        <div>
          <b>${r.ok ? 'El lector arranca' : 'El lector NO arranca'}</b><br>
          ${esc(r.mensaje)}<br>
          <span class="cifra" style="font-size:0.85rem">fase: ${esc(r.fase)} · ${esc(r.segundos)} s</span>
        </div>
      </div>`;
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

export function capturasActuales() {
  return capturas;
}

/**
 * Lee una captura y la convierte en datos.
 * Devuelve el motivo si no se ha podido, para poder decirlo en pantalla.
 */
export async function leerCaptura(clave, alProgresar) {
  const c = capturas.get(clave);
  if (!c) return { ok: false, motivo: 'No hay foto todavía.' };

  const r = await leerTexto(c.preparada, alProgresar);
  if (!r) {
    return {
      ok: false,
      motivo: porQueNoHayLector(),
    };
  }
  return { ok: true, texto: r.texto, confianza: r.confianza };
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

export { lectorDisponible };
