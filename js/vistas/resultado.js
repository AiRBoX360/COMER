import { nivelSolo, marcador, esc, vacio, nivelDeNota } from '../ui.js';
import { enCurso, reiniciar } from '../estado.js';
import { analizarProducto, revisarVigilancia, queBuscarEnLugarDe, buscarAlternativas } from '../motor.js';
import { vigilanciaActiva } from './tendencia.js';
import { listaExplicada } from './revisar.js';
import { guardarAnalisis, listar } from '../almacen.js';
import { descargarFotoProducto } from '../fotoproducto.js';
import { alternativasDeFuera, porQueNoHayAlternativas } from '../alternativasfuera.js';
import { dondeComprarlo, textoDondeComprarlo,
         deDondeViene, textoDeDondeViene } from '../donde.js';
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
 * De dónde viene el producto.
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

function desglose(v) {
  if (!v.componentes?.length) return '';
  return `
    <h2 class="subtitulo">De qué se compone</h2>
    <p class="texto" style="font-size:0.92rem">Cada parte con su nota y con lo que pesa en el total.</p>
    ${v.componentes.map((c) => {
      const pct = Math.round(c.pesoAplicado * 100);
      const nominal = Math.round((c.pesoOriginal ?? c.pesoAplicado) * 100);
      const sinCalcular = c.nota === null;
      return `
        <div class="parte${sinCalcular ? ' parte--sin' : ''}">
          <div class="parte__cab">
            <span class="parte__nombre">${esc(c.nombre)}</span>
            <span class="parte__nota cifra">${sinCalcular ? '—' : c.nota}<small>/100</small></span>
          </div>
          <div class="parte__barra">
            <i style="width:${sinCalcular ? 0 : c.nota}%" data-nivel="${nivelDeNota(c.nota ?? 0).clave}"></i>
          </div>
          <p class="parte__peso cifra">
            ${sinCalcular
              ? 'no se ha podido calcular · su peso se ha repartido entre las demás'
              : `pesa el ${pct} % de la nota${pct !== nominal ? ` · normalmente pesa el ${nominal} %, ha subido porque otra parte no se pudo calcular` : ''}`}
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
        <p class="veredicto__nivel">${esc(nivel.texto)}</p>
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

    <h2 class="subtitulo">¿Por qué esta nota?</h2>
    <p class="texto">${esc(v.porQue)}</p>

    ${bloqueProcedencia()}
    ${desglose(v)}
    ${topes(v)}

    ${bloque('Lo que conviene limitar', 'Ordenado de más a menos relevante.', v.limitar, 'malo')}
    ${bloque('Lo mejor del producto', 'Ordenado de más a menos relevante.', v.favorables, 'bueno')}

    ${listaExplicada(enCurso.ingredientes)}

    ${v.alergenos.length ? `
      <h2 class="subtitulo">Alérgenos detectados</h2>
      <p class="texto">${v.alergenos.map((a) => esc(a.nombre) + (a.esTraza ? ' (trazas)' : '')).join(', ')}.</p>
      <p class="texto" style="font-size:0.9rem">${esc(v.avisoAlergenos)}</p>` : ''}

    ${v.porRacion ? `
      <h2 class="subtitulo">Por ración de ${v.porRacion.gramos} g</h2>
      <div class="resumen">
        <div><b class="cifra">${v.porRacion.kcal ?? '—'}</b><span>kcal</span></div>
        <div><b class="cifra">${v.porRacion.pctAzucarOMS ?? '—'}%</b><span>del azúcar diario</span></div>
        <div><b class="cifra">${v.porRacion.pctSalOMS ?? '—'}%</b><span>de la sal diaria</span></div>
      </div>` : ''}

    <div id="alternativas"></div>
    ${bloqueAlternativa(v)}

    ${v.avisos.length ? `
      <h2 class="subtitulo">Avisos</h2>
      <ul class="incidencias">
        ${v.avisos.map((a) => `<li class="incidencia">${esc(a)}</li>`).join('')}
      </ul>` : ''}

    <button class="boton-grande" id="btnGuardar" style="margin-top:24px">
      GUARDAR EN LA DESPENSA
      <small>Con sus fotos, para poder volver a verlo</small>
    </button>
    <p class="texto" id="estadoGuardar" role="status" aria-live="polite" style="margin-top:12px"></p>

    <p class="texto" style="margin-top:24px; font-size:0.85rem">
      Calculado con la versión ${esc(v.versionAlgoritmo)} del algoritmo.
    </p>
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
  hueco.innerHTML = `
    <h2 class="subtitulo">No he encontrado alternativas</h2>
    <p class="texto" style="font-size:var(--t2)">${esc(motivo.charAt(0).toUpperCase() + motivo.slice(1))}.</p>`;
}
