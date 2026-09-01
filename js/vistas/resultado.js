import { banda, marcador, esc, vacio } from '../ui.js';
import { enCurso } from '../estado.js';
import { analizarProducto } from '../motor.js';
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
      estado.textContent = 'Guardado. Ya está en tu Despensa.';
      boton.textContent = 'GUARDADO';
    } catch (err) {
      boton.disabled = false;
      estado.textContent = `No se ha podido guardar. ${err.message}`;
    }
  });
}
