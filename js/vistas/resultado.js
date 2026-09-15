import { nivelSolo, marcador, esc, vacio, nivelDeNota } from '../ui.js';
import { enCurso, reiniciar } from '../estado.js';
import { analizarProducto, revisarVigilancia, queBuscarEnLugarDe, buscarAlternativas } from '../motor.js';
import { vigilanciaActiva } from './tendencia.js';
import { listaExplicada } from './revisar.js';
import { guardarAnalisis, listar } from '../almacen.js';
import { descargarFotoProducto } from '../fotoproducto.js';
import { contarGuardado, tocaRecordar, textoRecordatorio } from '../recordatorio.js';
import { alternativasDeFuera, porQueNoHayAlternativas,
         diagnosticoAlternativas } from '../alternativasfuera.js';
import { dondeComprarlo, textoDondeComprarlo,
         deDondeViene, textoDeDondeViene,
         porQueNoConstaOrigen } from '../donde.js';
import { capturasActuales } from './analizar.js';
import { aBytes } from '../camara.js';
import { refrescarDespensa } from './despensa.js';
import { refrescarConocimiento } from './conocimiento.js';
import { refrescarComparador } from './comparar.js';
import { nombrePantalla } from './inicio.js';

/**
 * El veredicto.
 *
 * Se calcula aquí, cada vez que se entra, a partir de lo que hay revisado.
 * Así lo que ves siempre corresponde a lo que acabas de corregir, sin copias
 * intermedias que puedan quedarse viejas.
 */

function filaFactor(f, signo) {
  return `
    <div class="factor factor--${signo}">
      <div class="factor__cab">
        <span class="factor__nombre">${esc(f.nombre)}</span>
        <span class="factor__peso cifra">${f.peso}</span>
      </div>
      <div class="factor__medida"><i style="width:${f.peso}%"></i></div>
      <p class="factor__dato cifra">${esc(f.dato)} · ${esc(f.origen === 'tabla' ? 'de la tabla' : f.origen === 'ingredientes' ? 'de los ingredientes' : 'de ambos')}</p>
      <p class="factor__motivo">${esc(f.motivo)}</p>
    </div>`;
}

function bloque(titulo, pista, lista, signo) {
  if (lista.length === 0) {
    return `<h2 class="subtitulo">${titulo}</h2><p class="texto">Nada reseñable.</p>`;
  }
  const primeros = lista.slice(0, 3);
  const resto = lista.slice(3);
  return `
    <h2 class="subtitulo">${titulo}</h2>
    <p class="texto" style="font-size:0.92rem">${pista}</p>
    ${primeros.map((f) => filaFactor(f, signo)).join('')}
    ${resto.length ? `<details class="mas"><summary>Ver los ${resto.length} restantes</summary>
      ${resto.map((f) => filaFactor(f, signo)).join('')}</details>` : ''}`;
}

/**
 * Tu lista de vigilancia, arriba del todo.
 *
 * Va antes que la nota a propósito: si has pedido que te avisen de los
 * nitritos, eso lo quieres ver antes que un número. Y no toca la puntuación:
 * es un aviso, no una opinión.
 */
/**
 * Qué buscar en una alternativa mejor.
 *
 * Solo aparece cuando merece la pena buscarla. Decirle a alguien que compre
 * otra cosa cuando lo que tiene en la mano está bien es ruido, y el ruido hace
 * que se deje de leer lo que sí importa.
 */
function bloqueAlternativa(v) {
  if (v.puntuacion === null || v.puntuacion >= 60) return '';
  const consejos = queBuscarEnLugarDe(v);
  if (consejos.length === 0 || consejos[0].includes('ningún factor')) return '';
  return `
    <h2 class="subtitulo">Qué buscar en una alternativa</h2>
    <p class="texto" style="font-size:0.92rem">Deducido de lo que más resta en este producto, no de una lista general.</p>
    <ul class="incidencias">
      ${consejos.map((c) => `<li class="incidencia">${esc(c)}</li>`).join('')}
    </ul>`;
}

/**
 * De qué se compone la nota.
 *
 * El motor ya calculaba estas cuatro notas por separado y la pantalla no las
 * enseñaba. Sin el desglose, un 36 no dice dónde está el problema: puede ser
 * la composición, el procesamiento o los aditivos, y son cosas muy distintas.
 * Con él, se ve que unas galletas suspenden por azúcar y no por aditivos.
 *
 * Se muestra también el peso aplicado, que no siempre es el nominal: cuando un
 * componente no se puede calcular, su peso se reparte entre los demás en vez
 * de contar como cero. Esconder ese reparto sería esconder por qué la nota
 * puede moverse sin que cambien los datos que se ven.
 */
/**
 * La procedencia, en pequeño y al lado del nombre.
 *
 * Va dentro de la tarjeta del veredicto porque es parte de qué es el producto,
 * no un dato más de los de abajo: saber que un tomate viene de Marruecos
 * cambia la decisión tanto como saber su nota.
 */
function procedenciaCompacta() {
  if (!enCurso.procedencia) return '';
  const d = deDondeViene(enCurso.procedencia);
  const lineas = [];
  if (d.origen.length) lineas.push(...d.origen);
  if (d.provincia) lineas.push(d.provincia);
  else if (d.envasado.length) lineas.push(...d.envasado);

  // Sin origen rellenado queda el país del código de barras. Va con su matiz
  // porque no dice lo mismo: es dónde se registró la empresa, no dónde se hizo
  // la comida.
  //
  // Esta rama faltaba. Como el país SÍ estaba, "por qué no consta" devolvía
  // vacío y no se pintaba nada: ni la procedencia ni el aviso de que falta.
  // El dato se calculaba bien y no llegaba a la pantalla.
  if (lineas.length === 0 && d.registrado && d.registrado !== 'BALANZA') {
    return `
      <div class="procedencia">
        <span class="procedencia__rotulo">Procedencia</span>
        <span class="procedencia__linea">${esc(d.registrado)}</span>
        <span class="procedencia__matiz">registro de la empresa</span>
      </div>`;
  }

  // Cuando no consta nada, se dice. Callarse hace que un fallo del código y un
  // dato que nadie ha rellenado se vean exactamente igual.
  if (lineas.length === 0) {
    const motivo = porQueNoConstaOrigen(d);
    return motivo
      ? `<div class="procedencia procedencia--sin">
           <span class="procedencia__rotulo">Procedencia</span>
           <span class="procedencia__nada">No consta</span>
         </div>`
      : '';
  }
  return `
    <div class="procedencia">
      <span class="procedencia__rotulo">Procedencia</span>
      ${lineas.slice(0, 3).map((l) => `<span class="procedencia__linea">${esc(l)}</span>`).join('')}
    </div>`;
}

/**
 * De dónde viene el producto, con todo el detalle.
 *
 * Tres cosas distintas que la gente confunde: el origen de la materia prima,
 * dónde se envasó, y el código sanitario del establecimiento. Un tomate de
 * origen Marruecos envasado en Murcia no es un tomate murciano.
 *
 * Solo aparece si consta algo: inventarlo sería peor que no tenerlo.
 */
function bloqueProcedencia() {
  if (!enCurso.procedencia) return '';
  const d = deDondeViene(enCurso.procedencia);
  const texto = textoDeDondeViene(d);
  if (!texto) return '';
  const donde = dondeComprarlo({ marca: enCurso.marca, tiendas: enCurso.tiendas });
  return `
    <h2 class="subtitulo">De dónde viene</h2>
    <div class="procede">
      <p class="procede__linea">${esc(texto)}</p>
      ${donde.tiendas.length
        ? `<p class="procede__donde">${esc(textoDondeComprarlo(donde))}</p>` : ''}
      <p class="apunte-via">${d.provincia
        ? 'La provincia sale del código sanitario impreso en el envase, que es obligatorio. El origen lo rellena quien sube el producto a Open Food Facts.'
        : 'Lo rellena quien sube el producto a Open Food Facts, así que puede faltar o estar desactualizado.'}</p>
    </div>`;
}

/**
 * Una sección plegable.
 *
 * Resultado era un rollo de scroll interminable: todo desplegado a la vez, y
 * la mayoría de las veces solo vas a mirar una cosa. Ahora cada bloque se abre
 * si lo pides. Las que no tienen nada que contar no se pintan: una pestaña
 * vacía es una promesa incumplida.
 */
function seccion(titulo, cuerpo) {
  if (!cuerpo || !String(cuerpo).trim()) return '';
  return `
    <details class="seccion">
      <summary>
        <span class="seccion__nombre">${esc(titulo)}</span>
        <span class="seccion__flecha" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </span>
      </summary>
      <div class="seccion__cuerpo">${cuerpo}</div>
    </details>`;
}

function bloqueAlergenos(v) {
  if (!v.alergenos.length) return '';
  return `
    <h3 class="rotulo">Alérgenos detectados</h3>
    <p class="texto">${v.alergenos.map((a) => esc(a.nombre) + (a.esTraza ? ' (trazas)' : '')).join(', ')}.</p>
    <p class="apunte-via">${esc(v.avisoAlergenos)}</p>`;
}

/**
 * El botón para corregir lo que esté mal.
 *
 * Lleva a Revisar, que es la pantalla que ya existía para esto: comprueba
 * unidades, detecta comas perdidas y deja añadir o quitar lo que sea. Lo que
 * faltaba no era un editor, era poder volver a él desde aquí.
 *
 * Los datos siguen cargados, así que se abre con lo que ya hay y se corrige
 * encima. Al volver, la nota se recalcula con lo que hayas cambiado.
 */
function corregir(que) {
  return `
    <button class="corregir" data-corregir="${que}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="M13.5 6.5l4 4"/>
      </svg>
      ${que === 'tabla' ? 'Corregir la tabla' : 'Corregir los ingredientes'}
    </button>`;
}

/** Lo que hay en la etiqueta, por 100 g, en casillas. */
const FILAS_TABLA = [
  { clave: 'energia_kcal', nombre: 'Energía', unidad: 'kcal' },
  { clave: 'grasas_g', nombre: 'Grasas', unidad: 'g' },
  { clave: 'saturadas_g', nombre: 'De ellas saturadas', unidad: 'g' },
  { clave: 'hidratos_g', nombre: 'Hidratos', unidad: 'g' },
  { clave: 'azucares_g', nombre: 'De ellos azúcares', unidad: 'g' },
  { clave: 'fibra_g', nombre: 'Fibra', unidad: 'g' },
  { clave: 'proteinas_g', nombre: 'Proteínas', unidad: 'g' },
  { clave: 'sal_g', nombre: 'Sal', unidad: 'g' },
];

/**
 * La tabla nutricional, entera.
 *
 * Antes salían tres casillas —kilocalorías y dos porcentajes— bajo un título
 * que prometía "tabla nutricional". Faltaba justo lo que hay en la etiqueta:
 * grasas, saturadas, hidratos, azúcares, fibra, proteínas y sal.
 *
 * Cada valor dice de dónde sale: leído de la etiqueta, calculado a partir de
 * otros, o ausente. Eso ya estaba en Revisar y aquí faltaba.
 */
function bloqueTabla(v) {
  const n = enCurso.nutrientes ?? {};
  const hay = FILAS_TABLA.filter((f) => typeof n[f.clave]?.valor === 'number');
  if (hay.length === 0) return '';

  return `
    <h3 class="rotulo">Por 100 g</h3>
    <div class="tabla-nut">
      ${hay.map((f) => {
        const d = n[f.clave];
        const calculado = d.estado === 'calculado';
        return `
          <div class="casilla${calculado ? ' casilla--calc' : ''}">
            <b class="cifra">${Number(d.valor.toFixed(1))}<small>${esc(f.unidad)}</small></b>
            <span>${esc(f.nombre)}</span>
            ${calculado ? '<i>calculado</i>' : ''}
          </div>`;
      }).join('')}
    </div>

    ${v.porRacion ? `
      <h3 class="rotulo" style="margin-top:var(--e5)">Por ración de ${v.porRacion.gramos} g</h3>
      <div class="tabla-nut">
        <div class="casilla"><b class="cifra">${v.porRacion.kcal ?? '—'}</b><span>kcal</span></div>
        <div class="casilla"><b class="cifra">${v.porRacion.pctAzucarOMS ?? '—'}<small>%</small></b><span>del azúcar diario</span></div>
        <div class="casilla"><b class="cifra">${v.porRacion.pctSalOMS ?? '—'}<small>%</small></b><span>de la sal diaria</span></div>
      </div>` : ''}

    ${hay.some((f) => n[f.clave].estado === 'calculado')
      ? '<p class="apunte-via">Lo marcado como calculado no estaba en la etiqueta: sale de los demás valores.</p>'
      : ''}`;
}

function bloqueAvisos(v) {
  if (!v.avisos.length) return '';
  return `
    <h3 class="rotulo">Avisos</h3>
    <ul class="incidencias">
      ${v.avisos.map((a) => `<li class="incidencia">${esc(a)}</li>`).join('')}
    </ul>`;
}

/**
 * De qué se compone la nota.
 *
 * Aquí había un problema de redacción serio: ponía "Aditivos · 96" y eso se
 * lee como "lleva 96 aditivos", cuando significa lo contrario: que en aditivos
 * sale muy bien. El número era una VALORACIÓN y parecía una CANTIDAD.
 *
 * Se arregla diciéndolo con palabras además del número. Un 96 en aditivos pasa
 * a ser "casi ninguno que preocupe", y un 30 a "lleva varios de los que
 * conviene limitar". El número se queda para quien lo quiera, pero ya no tiene
 * que interpretarlo nadie.
 */
const LECTURA = {
  nutriScore: [
    [85, 'muy buena para lo que es'],
    [70, 'buena'],
    [50, 'regular'],
    [30, 'floja'],
    [0, 'mala'],
  ],
  nova: [
    [85, 'sin procesar o casi'],
    [70, 'poco procesado'],
    [50, 'procesado'],
    [30, 'muy procesado'],
    [0, 'ultraprocesado'],
  ],
  aditivos: [
    [95, 'no lleva ninguno'],
    [80, 'lleva alguno, y ninguno preocupante'],
    [55, 'lleva varios que conviene limitar'],
    [30, 'lleva alguno de los peores'],
    [0, 'lleva de los que más conviene evitar'],
  ],
  ingredientes: [
    [85, 'lista corta y reconocible'],
    [70, 'lista razonable'],
    [50, 'lista larga o poco clara'],
    [0, 'lista larga y difícil de reconocer'],
  ],
};

function leerNota(clave, nota) {
  const tabla = LECTURA[clave];
  if (!tabla || nota === null) return '';
  for (const [desde, texto] of tabla) if (nota >= desde) return texto;
  return '';
}

function desglose(v) {
  if (!v.componentes?.length) return '';
  return `
    <p class="texto" style="font-size:var(--t2)">
      La nota sale de cuatro cosas. Cada una se puntúa de 0 a 100, donde
      <b>100 es lo mejor</b>, y pesa lo que dice debajo.
    </p>
    ${v.componentes.map((c) => {
      const pct = Math.round(c.pesoAplicado * 100);
      const nominal = Math.round((c.pesoOriginal ?? c.pesoAplicado) * 100);
      const sinCalcular = c.nota === null;
      // El motor devuelve decimales. Una nota con coma no dice nada más y
      // ensucia: "50,6 sobre 100" se lee peor que "51".
      const nota = sinCalcular ? null : Math.round(c.nota);
      const lectura = leerNota(c.clave, nota);
      return `
        <div class="parte${sinCalcular ? ' parte--sin' : ''}">
          <div class="parte__cab">
            <span class="parte__nombre">${esc(c.nombre)}</span>
            <span class="parte__nota cifra" data-nivel="${nivelDeNota(nota ?? 0).clave}">
              ${sinCalcular ? '—' : nota}<small>/100</small>
            </span>
          </div>
          <div class="parte__barra">
            <i style="width:${sinCalcular ? 0 : nota}%" data-nivel="${nivelDeNota(nota ?? 0).clave}"></i>
          </div>
          ${lectura ? `<p class="parte__lectura">${esc(lectura)}</p>` : ''}
          <p class="parte__peso">
            ${sinCalcular
              ? 'No se ha podido calcular, así que su peso se reparte entre las demás.'
              : `pesa el ${pct} % de la nota${pct !== nominal ? ` (de ${nominal} % habitual)` : ''}`}
          </p>
        </div>`;
    }).join('')}`;
}

/**
 * Los topes que se le han aplicado.
 *
 * Es la explicación más directa que existe de por qué una nota no sube: hay
 * cosas que descalifican por sí solas, y compensarlas con lo bueno sería
 * justamente el error que los topes existen para evitar.
 */
function topes(v) {
  if (!v.vetos?.length) return '';
  return `
    <h2 class="subtitulo">Por qué no sube más</h2>
    <p class="texto" style="font-size:0.92rem">Hay cosas que ponen un techo a la nota por buenas que sean las demás. Es a propósito: no queremos que la fibra compense las grasas trans.</p>
    <ul class="incidencias">
      ${v.vetos.map((t) => `<li class="incidencia incidencia--error">${esc(t)}</li>`).join('')}
    </ul>`;
}

/**
 * La tarjeta del veredicto.
 *
 * Lo primero que se ve: el nombre, la nota en grande dentro de un anillo que
 * se llena, y la banda de los cinco niveles. Antes era un rótulo, un título y
 * un marcador sueltos; ahora es una sola pieza.
 *
 * El anillo se dibuja con un círculo SVG al que se le recorta el trazo. No hay
 * animación por defecto porque en móvil distrae más de lo que aporta.
 */
function tarjetaVeredicto(v) {
  const n = Math.max(0, Math.min(100, v.puntuacion ?? 0));
  const nivel = nivelDeNota(n);
  const RADIO = 52;
  const VUELTA = 2 * Math.PI * RADIO;
  const lleno = (n / 100) * VUELTA;

  return `
    <div class="veredicto" data-nivel="${nivel.clave}">
      <div class="veredicto__anillo">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="veredicto__pista" cx="60" cy="60" r="${RADIO}"/>
          <circle class="veredicto__arco" cx="60" cy="60" r="${RADIO}"
                  stroke-dasharray="${lleno.toFixed(1)} ${(VUELTA - lleno).toFixed(1)}"/>
        </svg>
        <div class="veredicto__cifra">
          <b class="cifra">${n}</b>
          <small>de 100</small>
        </div>
      </div>
      <div class="veredicto__texto">
        <h1>${esc(v.nombre)}</h1>
        ${v.marca ? `<p class="veredicto__marca">${esc(v.marca)}</p>` : ''}
        ${procedenciaCompacta()}
      </div>
    </div>
    ${nivelSolo(v.puntuacion)}`;
}

function bloqueVigilancia(v) {
  const avisos = revisarVigilancia(v, enCurso.ingredientes, vigilanciaActiva())
    .filter((a) => a.salta);
  if (avisos.length === 0) return '';
  return `
    <div class="vigila">
      <h3>${avisos.length === 1 ? 'Ojo con esto' : `Ojo con estas ${avisos.length} cosas`}</h3>
      <ul>
        ${avisos.map((a) => `
          <li>
            <b>${esc(a.etiqueta)}</b>
            <span>${a.sentido === 'buscar' ? 'no lo lleva' : a.donde ? `detectado en "${esc(a.donde)}"` : 'detectado'}</span>
          </li>`).join('')}
      </ul>
    </div>`;
}

export function resultado() {
  const hayDatos = Object.keys(enCurso.nutrientes).length > 0 || enCurso.ingredientes.length > 0;
  if (!hayDatos) {
    return `${nombrePantalla('Resultado')}
      ${vacio('Todavía no has analizado nada', 'Ve a Analizar, lee una etiqueta, revísala y vuelve aquí.')}`;
  }

  const v = analizarProducto({
    nombre: enCurso.nombre || 'Producto sin nombre',
    categoria: enCurso.categoria,
    nutrientes: enCurso.nutrientes,
    ingredientes: enCurso.ingredientes,
    racion_declarada_g: enCurso.racionGramos ?? undefined,
  });
  enCurso.veredicto = v;

  const sinNota = v.puntuacion === null;

  return `
    ${bloqueVigilancia(v)}

    ${sinNota ? `
      <div class="pendiente" style="border-left-color:var(--naranja); margin-bottom:16px">
        <div><b>Análisis incompleto.</b> No hay datos suficientes para dar una nota.
        Faltan: ${esc(v.datosFaltantes.join(', '))}.</div>
      </div>
      <h1 class="titulo">${esc(v.nombre)}</h1>`
      : tarjetaVeredicto(v)}

    <div class="resumen">
      <div><b class="cifra">${v.nutriScore.letra ?? '—'}</b><span>Nutri-Score</span></div>
      <div><b class="cifra">${v.nova.grupo ?? '—'}</b><span>Grado NOVA</span></div>
      <div><b class="cifra">${v.confianza.valor}%</b><span>Confianza</span></div>
    </div>

    ${v.confianza.nivel !== 'alta' ? `
      <div class="pendiente" style="margin-top:16px">
        <div><b>${esc(v.confianza.etiqueta)}.</b>
        ${v.confianza.comoMejorarla.map((c) => esc(c)).join(' ')}</div>
      </div>` : ''}

    <div class="secciones">
      ${seccion('Ingredientes',
        listaExplicada(enCurso.ingredientes) + bloqueAlergenos(v) + corregir('ingredientes'))}
      ${seccion('Tabla nutricional', bloqueTabla(v) + corregir('tabla'))}
      ${seccion('De qué se compone', desglose(v) + topes(v))}
      ${seccion('Conviene limitar',
        bloque('', 'Ordenado de más a menos relevante.', v.limitar, 'malo'))}
      ${seccion('Lo mejor', bloque('', 'Ordenado de más a menos relevante.', v.favorables, 'bueno'))}
      ${seccion('Alternativas',
        '<div id="alternativas"></div>' + bloqueAlternativa(v))}
      ${seccion('Por qué esta nota',
        `<p class="texto">${esc(v.porQue)}</p>` + bloqueAvisos(v))}
    </div>

    <button class="accion" id="btnGuardar" style="margin-top:var(--e5)">
      <span class="accion__icono" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>
        </svg>
      </span>
      <span class="accion__texto">
        <b>Guardar en despensa</b>
        <small>Con sus fotos, para volver a verlo</small>
      </span>
    </button>
    <p class="texto" id="estadoGuardar" role="status" aria-live="polite" style="margin-top:12px"></p>
  `;
}

/**
 * Alternativas de tu propia despensa.
 *
 * Se piden después de pintar porque hay que leer la base entera. Si no hay
 * ninguna comparable, no aparece nada: proponer un yogur como alternativa a un
 * fiambre sería peor que no proponer nada.
 */
async function pintarAlternativas(raiz, v) {
  const hueco = raiz.querySelector('#alternativas');
  if (!hueco || v.puntuacion === null) return;

  let guardados = [];
  try { guardados = await listar({ orden: 'fecha_desc' }); } catch { return; }

  const alt = buscarAlternativas({
    nombre: v.nombre, puntuacion: v.puntuacion, categoria: v.categoria,
    veredicto: v, ingredientes: enCurso.ingredientes,
  }, guardados);
  if (alt.length > 0) pintarDeLaDespensa(hueco, alt);

  // Y las de fuera, que tardan más porque salen a internet. Se piden después
  // para que lo que ya se sabe aparezca enseguida.
  const fuera = await alternativasDeFuera({
    puntuacion: v.puntuacion, codigo: enCurso.codigoBarras,
    categoriasTags: enCurso.categoriasTags,
    limitar: v.limitar, favorables: v.favorables, nova: v.nova,
  }).catch(() => []);
  if (fuera.length > 0) pintarDeFuera(raiz, fuera);
  else if (v.puntuacion < 70) pintarSinAlternativas(raiz);
  return;
}

function pintarDeLaDespensa(hueco, alt) {

  hueco.innerHTML = `
    <h2 class="subtitulo">Mejor esto, de tu despensa</h2>
    <p class="texto" style="font-size:0.92rem">Productos parecidos que ya has analizado y puntúan mejor.</p>
    ${alt.map((a) => `
      <button class="alterna" data-ver-alt="${a.id}">
        <span class="alterna__nota cifra" data-nivel="${a.semaforo ?? 'rojo'}">${a.puntuacion}</span>
        <span class="alterna__texto">
          <b>${esc(a.nombre)}</b>
          <span class="alterna__por">${esc(a.porQue.join(' · ')) || esc(a.comparablePor)}</span>
        </span>
        <span class="alterna__mejora cifra">+${a.mejora}</span>
      </button>`).join('')}`;
}

export function resultadoActivo(raiz, { irA }) {
  pintarAlternativas(raiz, enCurso.veredicto ?? {}).catch(() => { /* sin base, sin alternativas */ });

  // Corregir lleva a Revisar, que es la pantalla que ya hacía esto. Los datos
  // siguen cargados, así que se abre con lo que hay y se corrige encima.
  raiz.addEventListener('click', (e) => {
    if (e.target.closest('[data-corregir]')) irA('revisar');
  });

  raiz.querySelector('#alternativas')?.addEventListener('click', () => irA('despensa'));

  const estado = raiz.querySelector('#estadoGuardar');
  const boton = raiz.querySelector('#btnGuardar');
  if (!boton) return;

  boton.addEventListener('click', async () => {
    if (!enCurso.veredicto) return;
    boton.disabled = true;
    estado.textContent = 'Guardando…';
    try {
      // Las fotos se comprimen a JPEG aquí: en bruto ocuparían veinte veces más.
      const fotos = [];
      for (const [tipo, c] of capturasActuales()) {
        if (!c?.preparada) continue;
        fotos.push({ tipo, bytes: await aBytes(c.original ?? c.preparada, 0.7) });
      }

      // Si el producto vino de un código de barras y no hiciste foto del
      // frontal, se guarda la del envase que trae Open Food Facts. La tuya
      // manda siempre: esta solo entra donde no hay ninguna.
      if (enCurso.fotoUrl && !fotos.some((f) => f.tipo === 'frontal')) {
        const bytes = await descargarFotoProducto(enCurso.fotoUrl);
        if (bytes) fotos.push({ tipo: 'frontal', bytes });
      }
      await guardarAnalisis({
        veredicto: enCurso.veredicto,
        entrada: {
          nombre: enCurso.nombre, categoria: enCurso.categoria,
          nutrientes: enCurso.nutrientes, ingredientes: enCurso.ingredientes,
          racion_declarada_g: enCurso.racionGramos ?? undefined,
          // El código se guarda para poder detectar, dentro de meses, que la
          // marca ha cambiado la receta sin decírselo a nadie.
          codigoBarras: enCurso.codigoBarras ?? undefined,
        },
        fotos,
      });
      refrescarDespensa();
      refrescarConocimiento();
      refrescarComparador();
      // Guardado y cerrado: el siguiente producto empieza limpio. Dejar los
      // datos cargados era la puerta por la que se colaban de un producto al
      // siguiente.
      reiniciar();
      capturasActuales().clear();
      estado.textContent = 'Guardado. Ya está en tu Despensa, y el análisis queda cerrado para empezar otro.';

      // Los datos viven solo en este teléfono. Avisar en la Despensa no sirve
      // de mucho: nadie mira ahí. Se dice justo después de guardar, que es
      // cuando acabas de añadir algo que perderías.
      contarGuardado();
      if (tocaRecordar()) {
        const aviso = document.createElement('div');
        aviso.className = 'recordatorio';
        aviso.innerHTML = `
          <p><b>Conviene guardar una copia.</b> ${esc(textoRecordatorio())}</p>
          <button class="boton" id="btnIrACopia">Hacer copia ahora</button>`;
        estado.after(aviso);
        aviso.querySelector('#btnIrACopia')?.addEventListener('click', () => {
          irA('despensa');
          // Se abre la sección de la copia, para no dejarte buscándola.
          setTimeout(() => {
            const sec = document.querySelector('[data-seccion="copia"]');
            if (sec) { sec.open = true; sec.scrollIntoView({ block: 'center' }); }
          }, 120);
        });
      }
      boton.textContent = 'GUARDADO';
    } catch (err) {
      boton.disabled = false;
      estado.textContent = `No se ha podido guardar. ${err.message}`;
    }
  });
}


/**
 * Alternativas encontradas en Open Food Facts.
 *
 * Van con foto, marca, nuestra nota y dónde comprarlo. Y con un aviso de por
 * qué merecen menos confianza que las de tu despensa: esas las analizaste tú
 * con la etiqueta delante; estas vienen de datos que subió otra persona.
 */
function pintarDeFuera(raiz, fuera) {
  const hueco = raiz.querySelector('#alternativasFuera')
    ?? (() => {
      const d = document.createElement('div');
      d.id = 'alternativasFuera';
      raiz.querySelector('#alternativas')?.after(d);
      return d;
    })();

  hueco.innerHTML = `
    <h2 class="subtitulo">Y estas, buscadas fuera</h2>
    <p class="texto" style="font-size:var(--t2)">
      Productos parecidos de Open Food Facts, puntuados con el mismo criterio
      que el tuyo. Compruébalos contra el envase antes de fiarte: sus datos los
      subió otra persona.
    </p>
    ${fuera.map((a) => `
      <div class="fuera" data-nivel="${a.semaforo ?? 'rojo'}">
        ${a.imagenUrl
          ? `<img class="fuera__foto" src="${esc(a.imagenUrl)}" alt="" loading="lazy">`
          : '<div class="fuera__foto fuera__foto--sin" aria-hidden="true"></div>'}
        <div class="fuera__texto">
          <b class="fuera__nombre">${esc(a.nombre)}</b>
          ${a.marca ? `<span class="fuera__marca">${esc(a.marca)}</span>` : ''}
          <span class="fuera__veredicto">
            <i class="fuera__punto"></i>${esc(a.etiqueta)}
            <em class="cifra">${a.puntuacion}</em>
          </span>
          ${a.porQue.length
            ? `<span class="fuera__por">${esc(a.porQue.join(' · '))}</span>` : ''}
          <span class="fuera__donde">${esc(textoDondeComprarlo(a.donde))}</span>
        </div>
      </div>`).join('')}`;
}


/**
 * Cuando no hay alternativas, se dice por qué.
 *
 * Solo aparece si el producto es mejorable: para uno bueno, que no salgan
 * alternativas no es información, es lo esperable.
 */
function pintarSinAlternativas(raiz) {
  const motivo = porQueNoHayAlternativas();
  if (!motivo) return;
  const hueco = raiz.querySelector('#alternativasFuera')
    ?? (() => {
      const d = document.createElement('div');
      d.id = 'alternativasFuera';
      raiz.querySelector('#alternativas')?.after(d);
      return d;
    })();
  const d = diagnosticoAlternativas();
  hueco.innerHTML = `
    <h2 class="subtitulo">No he encontrado alternativas</h2>
    <p class="texto" style="font-size:var(--t2)">${esc(motivo.charAt(0).toUpperCase() + motivo.slice(1))}.</p>
    <details class="seccion" style="margin-top:var(--e3)">
      <summary>
        <span class="seccion__nombre">Qué se ha preguntado</span>
        <span class="seccion__flecha" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </span>
      </summary>
      <div class="seccion__cuerpo">
        <p class="apunte-via">Esto está aquí para poder contar qué ha pasado cuando no salen alternativas. Si te parece que debería haberlas, cópialo y mándalo.</p>
        <ul class="incidencias">
          ${d.intentos.map((i) => `
            <li class="incidencia">${esc(i.categoria)}${i.soloEspana ? ' · solo España' : ''} → ${i.devueltos} producto(s)</li>`).join('')
            || '<li class="incidencia">No se ha llegado a preguntar: el producto no trae categoría.</li>'}
          ${d.candidatos ? `
            <li class="incidencia">De ${d.candidatos} candidatos: ${d.sinDatos} con datos incompletos, ${d.sinIngredientes} sin ingredientes, ${d.noMejoran} que no mejoran</li>` : ''}
        </ul>
      </div>
    </details>`;
}
