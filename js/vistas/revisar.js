/**
 * Revisar y corregir.
 *
 * El paso que hace viable todo lo demás. El lector se equivoca, y se va a
 * seguir equivocando: confunde el símbolo «<» con un dos, pierde renglones,
 * cuelga un valor del campo que no es. Nada de eso se arregla con un lector
 * mejor. Se arregla dejando que la persona mire y corrija antes de analizar.
 *
 * Regla que gobierna la pantalla: la app propone, la persona decide. Ninguna
 * corrección se aplica sola. Una corrección automática que acierte el 95 % de
 * las veces mete un error invisible el 5 % restante, y ese es peor que el
 * original porque nadie vuelve a mirarlo.
 */

import { esc } from '../ui.js';
import { CAMPOS, CATEGORIAS, corregir, enCurso, resumenEnCurso } from '../estado.js';
import { normalizarNutrientes, validar, validarContraIngredientes, explicarLista } from '../motor.js';

/** Cifra con coma decimal, que es como se escribe en español. */
const conComa = (v) => (v === null || v === undefined ? '' : String(v).replace('.', ','));
/** Y de vuelta, aceptando lo que la gente escribe de verdad. */
const aNumero = (t) => {
  const limpio = String(t).replace(',', '.').replace(/[^\d.-]/g, '').trim();
  if (limpio === '') return null;
  const n = parseFloat(limpio);
  return Number.isFinite(n) ? n : null;
};

/** Pasa la lista de ingredientes a texto editable y al revés. */
export const ingredientesATexto = (lista) => lista.map((i) => (i.porcentaje ? `${i.texto} ${conComa(i.porcentaje)}%` : i.texto)).join(', ');

export function textoAIngredientes(texto) {
  return texto.split(',').map((t) => t.trim()).filter((t) => t.length > 1).map((t) => {
    const m = t.match(/(\d{1,3}(?:[.,]\d{1,2})?)\s*%/);
    if (!m) return { texto: t };
    return {
      texto: t.replace(/\s*\d{1,3}(?:[.,]\d{1,2})?\s*%/, '').trim(),
      porcentaje: aNumero(m[1]),
    };
  });
}

/** Contexto de ingredientes para el contraste con la tabla. */
function contexto() {
  const texto = enCurso.ingredientes.map((x) => x.texto.toLowerCase()).join(' | ');
  return {
    total: enCurso.ingredientes.length,
    hayFuenteAzucar: /azucar|azúcar|jarabe|dextrosa|glucosa|fructosa|maltodextrina|miel|melaza|sacarosa|panela|sirope/.test(texto),
    hayLacteo: /leche|lacteo|lácteo|yogur|nata|suero|queso|lactosa/.test(texto),
    hayFruta: /fruta|zumo|pure|puré|manzana|platano|plátano|naranja|fresa|melocoton|melocotón|pera|uva|datil|dátil/.test(texto),
    hayGrasaAnadida: /aceite|grasa|mantequilla|manteca|margarina/.test(texto),
    haySal: /\bsal\b|salmuera/.test(texto),
  };
}

/** Revalida con lo que hay ahora mismo en pantalla. */
export function revisarAhora() {
  const n = normalizarNutrientes(enCurso.nutrientes);
  const primero = (enCurso.ingredientes[0]?.texto ?? '').toLowerCase();
  const esSalado = /^sal\b/.test(primero) ||
    enCurso.ingredientes.some((x) => /caldo|cubito|concentrado|sazonador/i.test(x.texto));
  let incidencias = validar(n, esSalado).incidencias;
  if (enCurso.ingredientes.length) {
    incidencias = incidencias.concat(validarContraIngredientes(n, contexto()));
  }
  return incidencias;
}

function fila(campo, incidencias) {
  const d = enCurso.nutrientes[campo.clave];
  const valor = d ? conComa(d.valor) : '';
  const inc = incidencias.find((i) => i.campos.includes(campo.clave));
  const corregido = d?.estado === 'corregido';
  const flojo = typeof d?.confianzaOCR === 'number' && d.confianzaOCR <= 0.5;
  const falta = campo.obligatorio && !d;

  const clases = [
    'campo',
    campo.sangrado ? 'campo--sangrado' : '',
    inc?.gravedad === 'error' ? 'campo--error' : inc ? 'campo--aviso' : '',
    falta ? 'campo--falta' : '',
    corregido ? 'campo--corregido' : '',
  ].filter(Boolean).join(' ');

  const marca = corregido ? '<em class="apunte apunte--ok">corregido</em>'
    : falta ? '<em class="apunte">falta</em>'
    : flojo ? '<em class="apunte">lectura dudosa</em>' : '';

  const propuesta = inc?.correccion && inc.correccion.campo === campo.clave
    ? `<button class="propuesta" data-aplicar="${campo.clave}" data-valor="${inc.correccion.valorPropuesto}">
         Poner ${conComa(inc.correccion.valorPropuesto)} ${esc(campo.unidad)}
       </button>` : '';

  return `
    <div class="${clases}">
      <label class="campo__nombre" for="c_${campo.clave}">
        ${esc(campo.nombre)}${marca}
      </label>
      <div class="campo__entrada">
        <input id="c_${campo.clave}" type="text" inputmode="decimal"
               value="${esc(valor)}" data-campo="${campo.clave}"
               placeholder="—" autocomplete="off">
        <span class="campo__unidad">${esc(campo.unidad)}</span>
      </div>
      ${propuesta}
      ${inc ? `<p class="campo__aviso">${esc(inc.mensaje)}</p>` : ''}
    </div>`;
}

export function revisar() {
  const incidencias = revisarAhora();
  const hayDatos = Object.keys(enCurso.nutrientes).length > 0 || enCurso.ingredientes.length > 0;

  if (!hayDatos) {
    return `
      <h1 class="titulo">Revisar</h1>
      <div class="vacio">
        <h3>No hay nada que revisar todavía</h3>
        <p>Ve a Analizar, haz las fotos o pega el texto de la etiqueta, y vuelve aquí.</p>
      </div>`;
  }

  const principales = CAMPOS.filter((c) => !c.secundario);
  const secundarios = CAMPOS.filter((c) => c.secundario);
  const faltan = principales.filter((c) => c.obligatorio && !enCurso.nutrientes[c.clave]);
  const errores = incidencias.filter((i) => i.gravedad === 'error').length;

  return `
    <h1 class="titulo">Revisar antes de analizar</h1>
    <div class="en-curso">
      <div class="en-curso__texto">
        <b>${esc(enCurso.nombre || 'Producto sin nombre')}</b>
        <span>${resumenEnCurso().campos} dato(s) · ${resumenEnCurso().ingredientes} ingrediente(s)</span>
      </div>
    </div>
    <p class="texto">Comprueba las cifras contra el envase. Toca cualquiera para cambiarla. Lo que corrijas queda marcado y pasa a valer más que lo leído.</p>

    ${errores > 0 || faltan.length > 0 ? `
      <div class="pendiente" style="margin:16px 0; border-left-color:var(--naranja)">
        <div>
          ${errores > 0 ? `<b>${errores} cifra(s) no cuadran</b> con el resto de la tabla.` : ''}
          ${faltan.length > 0 ? `<br><b>Faltan ${faltan.length} campo(s) obligatorio(s):</b> ${faltan.map((c) => esc(c.nombre)).join(', ')}.` : ''}
        </div>
      </div>` : ''}

    <h2 class="rotulo">El producto</h2>
    <div class="campo">
      <label class="campo__nombre" for="c_nombre">Nombre</label>
      <div class="campo__entrada">
        <input id="c_nombre" type="text" value="${esc(enCurso.nombre)}" data-texto="nombre"
               placeholder="Tortitas de maíz" autocomplete="off">
      </div>
    </div>
    <div class="campo">
      <label class="campo__nombre" for="c_categoria">Categoría</label>
      <div class="campo__entrada">
        <select id="c_categoria" data-texto="categoria">
          ${CATEGORIAS.map((c) => `<option value="${c.clave}" ${c.clave === enCurso.categoria ? 'selected' : ''}>${esc(c.nombre)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="campo">
      <label class="campo__nombre" for="c_racion">Ración declarada <em class="apunte">opcional</em></label>
      <div class="campo__entrada">
        <input id="c_racion" type="text" inputmode="decimal" value="${enCurso.racionGramos ?? ''}"
               data-texto="racion" placeholder="—" autocomplete="off">
        <span class="campo__unidad">g</span>
      </div>
    </div>

    <h2 class="rotulo" style="margin-top:24px">Por 100 g o 100 ml</h2>
    ${principales.map((c) => fila(c, incidencias)).join('')}

    <details class="mas">
      <summary>Otros campos</summary>
      ${secundarios.map((c) => fila(c, incidencias)).join('')}
    </details>

    <h2 class="rotulo" style="margin-top:24px">Ingredientes</h2>
    <p class="texto" style="font-size:0.92rem">Separados por comas, en el orden del envase. El orden importa: la ley obliga a listarlos de mayor a menor peso.</p>
    <textarea id="c_ingredientes" class="pegar pegar--alta" rows="9"
      placeholder="harina de trigo, azúcar, aceite de girasol">${esc(enCurso.ingredientes.map((i) => (i.porcentaje ? `${i.texto} ${conComa(i.porcentaje)}%` : i.texto)).join(', '))}</textarea>

    ${listaExplicada(enCurso.ingredientes)}

    <button class="boton-grande" id="btnAnalizarYa" style="margin-top:24px">
      ANALIZAR ESTE PRODUCTO
      <small>${faltan.length ? `Faltan ${faltan.length} campo(s), el análisis saldrá incompleto` : 'Con los datos que ves arriba'}</small>
    </button>
  `;
}

/**
 * Qué es cada ingrediente y por qué suma o resta.
 *
 * Va aquí, junto al cuadro editable, y no solo en el resultado: si al leer la
 * explicación ves que un ingrediente está mal escrito, lo corriges en el acto.
 */
export function listaExplicada(ingredientes) {
  if (!ingredientes.length) return '';
  const ETIQUETA = {
    favorable: 'Suma', limitar: 'Conviene limitar',
    neutro: 'Neutro', sin_ficha: 'Sin ficha',
  };
  const fichas = explicarLista(ingredientes).map((e, i) => `
    <details class="ficha ficha--${e.veredicto}">
      <summary>
        <span class="ficha__orden cifra">${i + 1}</span>
        <span class="ficha__titulo">${esc(e.titulo)}${e.porcentaje ? ` <span class="cifra">${String(e.porcentaje).replace('.', ',')}%</span>` : ''}</span>
        <span class="ficha__sello">${ETIQUETA[e.veredicto]}</span>
      </summary>
      <div class="ficha__cuerpo">
        <p class="ficha__linea"><b>Qué es.</b> ${esc(e.queEs)}</p>
        <p class="ficha__linea"><b>${e.veredicto === 'favorable' ? 'Por qué suma' : e.veredicto === 'limitar' ? 'Por qué conviene limitarlo' : 'Qué papel juega'}.</b> ${esc(e.porQue)}</p>
        ${e.alergenos.length ? `<p class="ficha__linea"><b>Alérgenos.</b> ${esc(e.alergenos.join(', '))}.</p>` : ''}
        ${e.fuentes.length ? `<p class="ficha__fuente">${esc(e.fuentes[0].organismo)} · ${esc(e.fuentes[0].documento)}</p>` : ''}
      </div>
    </details>`).join('');

  // Los que no conocemos se recogen aparte, para poder mandarlos y que se
  // conviertan en fichas de verdad. Es la alternativa a traerse un párrafo de
  // internet: más lenta, pero cada ficha que se añade queda respaldada.
  const desconocidos = explicarLista(ingredientes)
    .filter((e) => e.veredicto === 'sin_ficha')
    .map((e) => e.texto);

  const bloqueDesconocidos = desconocidos.length ? `
    <div class="pendiente" style="margin-top:12px">
      <div>
        <b>${desconocidos.length} ingrediente(s) sin ficha.</b>
        No sabemos qué son, así que no cuentan ni a favor ni en contra de la nota.
        <button class="boton" id="btnCopiarDesconocidos" style="margin-top:12px; width:100%"
                data-lista="${esc(desconocidos.join(', '))}">
          Copiar la lista
        </button>
      </div>
    </div>` : '';

  return `
    <h2 class="subtitulo">Qué lleva, uno por uno</h2>
    <p class="texto" style="font-size:0.92rem">En el orden del envase, que por ley va de mayor a menor peso. Toca cualquiera para ver qué es.</p>
    <div class="fichas">${fichas}</div>
    ${bloqueDesconocidos}`;
}

export function revisarActivo(raiz, { repintar, irA }) {
  // Los cambios se aplican al salir del campo, no en cada tecla: repintar
  // mientras se escribe robaría el foco a media cifra.
  raiz.addEventListener('change', (e) => {
    const campo = e.target.dataset.campo;
    if (campo) { corregir(campo, aNumero(e.target.value)); repintar(); return; }

    const texto = e.target.dataset.texto;
    if (texto === 'nombre') enCurso.nombre = e.target.value.trim();
    if (texto === 'categoria') enCurso.categoria = e.target.value;
    if (texto === 'racion') enCurso.racionGramos = aNumero(e.target.value);
    if (e.target.id === 'c_ingredientes') {
      enCurso.ingredientes = textoAIngredientes(e.target.value);
      repintar();
    }
  });

  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-aplicar]');
    if (!b) return;
    corregir(b.dataset.aplicar, parseFloat(b.dataset.valor));
    repintar();
  });

  raiz.querySelector('#btnAnalizarYa')?.addEventListener('click', () => irA('resultado'));

  raiz.addEventListener('click', async (e) => {
    const b = e.target.closest('#btnCopiarDesconocidos');
    if (!b) return;
    const texto = b.dataset.lista;
    try {
      await navigator.clipboard.writeText(texto);
      b.textContent = 'Copiado. Pégamelo y les escribo ficha.';
    } catch {
      // Safari niega el portapapeles en algunos contextos. Se enseña el texto
      // para que se pueda seleccionar a mano, en vez de dejar un botón muerto.
      b.outerHTML = `<textarea class="pegar" rows="3" readonly>${texto}</textarea>`;
    }
  });
}
