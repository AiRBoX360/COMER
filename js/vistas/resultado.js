import { banda, marcador, esc, vacio, nivelDeNota } from '../ui.js';
import { enCurso, reiniciar } from '../estado.js';
import { analizarProducto, revisarVigilancia, queBuscarEnLugarDe } from '../motor.js';
import { vigilanciaActiva } from './tendencia.js';
import { listaExplicada } from './revisar.js';
import { guardarAnalisis } from '../almacen.js';
import { capturasActuales } from './analizar.js';
import { aBytes } from '../camara.js';
import { refrescarDespensa } from './despensa.js';
import { refrescarConocimiento } from './conocimiento.js';
import { refrescarComparador } from './comparar.js';

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
    return `<h1 class="titulo">Resultado</h1>
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
    <h2 class="rotulo">Producto analizado</h2>
    <h1 class="titulo">${esc(v.nombre)}</h1>

    ${bloqueVigilancia(v)}

    ${sinNota ? `
      <div class="pendiente" style="border-left-color:var(--naranja); margin-bottom:16px">
        <div><b>Análisis incompleto.</b> No hay datos suficientes para dar una nota.
        Faltan: ${esc(v.datosFaltantes.join(', '))}.</div>
      </div>` : `
      ${marcador(v.puntuacion)}
      ${banda(v.puntuacion)}`}

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

export function resultadoActivo(raiz, { irA }) {
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
      await guardarAnalisis({
        veredicto: enCurso.veredicto,
        entrada: {
          nombre: enCurso.nombre, categoria: enCurso.categoria,
          nutrientes: enCurso.nutrientes, ingredientes: enCurso.ingredientes,
          racion_declarada_g: enCurso.racionGramos ?? undefined,
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
