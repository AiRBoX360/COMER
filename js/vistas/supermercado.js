import { banda, marcador, esc } from '../ui.js';
import { escanear, hayEscaner } from '../escaner.js';
import { buscarPorCodigo } from '../codigobarras.js';
import { analizarProducto, analizarIngredientesTexto, revisarVigilancia } from '../motor.js';
import { enCurso, reiniciar } from '../estado.js';
import { vigilanciaActiva } from './tendencia.js';

/**
 * Modo supermercado.
 *
 * En el pasillo, con el carro y con prisa, el recorrido de escanear, revisar y
 * analizar son demasiados pasos. Aquí se escanea y sale la nota.
 *
 * Con una condición que no se negocia: el veredicto sale marcado como SIN
 * REVISAR, en grande y arriba. Los datos vienen de una base colaborativa que
 * puede tener la receta de hace dos años, y presentar eso con la misma cara
 * que un análisis comprobado contra el envase sería engañar por comodidad.
 */

let estado = { fase: 'inicio', mensaje: '', veredicto: null, producto: null, avisos: [] };

export function supermercado() {
  const { fase, mensaje, veredicto: v, producto: p, avisos } = estado;

  if (fase === 'resultado' && v) {
    return `
      <h1 class="titulo">${esc(v.nombre)}</h1>
      ${p?.marca ? `<p class="texto">${esc(p.marca)}</p>` : ''}

      <div class="sin-revisar">
        <b>Sin revisar.</b> Estos datos vienen de Open Food Facts y pueden ser
        de una versión anterior del producto. Sirve para decidir en el pasillo,
        no para fiarse del todo.
      </div>

      ${avisos.length ? `
        <div class="vigila">
          <h3>${avisos.length === 1 ? 'Ojo con esto' : `Ojo con estas ${avisos.length} cosas`}</h3>
          <ul>${avisos.map((a) => `<li><b>${esc(a.etiqueta)}</b><span>${a.sentido === 'buscar' ? 'no lo lleva' : 'lo lleva'}</span></li>`).join('')}</ul>
        </div>` : ''}

      ${v.puntuacion === null
        ? `<div class="pendiente" style="border-left-color:var(--naranja)"><div><b>Sin datos suficientes para dar nota.</b> Faltan: ${esc(v.datosFaltantes.join(', '))}.</div></div>`
        : `${marcador(v.puntuacion)}${banda(v.puntuacion)}`}

      <h2 class="subtitulo">Lo que más pesa</h2>
      ${v.limitar.slice(0, 3).map((f) => `
        <div class="rapido rapido--malo">
          <span class="rapido__peso cifra">${f.peso}</span>
          <div><b>${esc(f.nombre)}</b><span>${esc(f.dato)}</span></div>
        </div>`).join('') || '<p class="texto">Nada de peso en contra.</p>'}
      ${v.favorables.slice(0, 2).map((f) => `
        <div class="rapido rapido--bueno">
          <span class="rapido__peso cifra">${f.peso}</span>
          <div><b>${esc(f.nombre)}</b><span>${esc(f.dato)}</span></div>
        </div>`).join('')}

      <div class="toma__botones" style="margin-top:24px">
        <button class="boton" id="btnOtro">Escanear otro</button>
        <button class="boton" id="btnRevisarlo">Revisarlo bien</button>
      </div>
      <p class="texto" id="estadoSuper" role="status" aria-live="polite" style="margin-top:12px"></p>
    `;
  }

  return `
    <h1 class="titulo">En el supermercado</h1>
    <p class="texto">Apunta al código de barras y sale la nota. Sin revisar nada, para decidir en el pasillo.</p>

    <div class="escaner" id="zonaSuper" ${fase === 'escaneando' ? '' : 'hidden'}>
      <video id="videoSuper" muted playsinline></video>
      <div class="escaner__mira"></div>
    </div>

    <button class="boton-grande" id="btnEscanearSuper" style="margin:16px 0">
      ${fase === 'escaneando' ? 'BUSCANDO…' : 'ESCANEAR'}
      <small>${fase === 'escaneando' ? 'Apunta al código' : 'Un código de barras, un veredicto'}</small>
    </button>

    <div class="campo">
      <label class="campo__nombre" for="codigoSuper">O tecléalo</label>
      <div class="campo__entrada">
        <input id="codigoSuper" type="text" inputmode="numeric" placeholder="8480000123456" autocomplete="off">
      </div>
    </div>
    <button class="boton" id="btnBuscarSuper" style="width:100%">Buscar</button>
    <p class="texto" id="estadoSuper" role="status" aria-live="polite" style="margin-top:12px">${esc(mensaje)}</p>
  `;
}

export function supermercadoActivo(raiz, { repintar, irA }) {
  const decir = (t) => {
    estado.mensaje = t;
    const e = raiz.querySelector('#estadoSuper');
    if (e) e.textContent = t;
  };

  async function resolver(codigo) {
    decir('Consultando…');
    const r = await buscarPorCodigo(codigo);
    if (!r.ok) { estado.fase = 'inicio'; decir(r.mensaje); repintar(); return; }

    const p = r.producto;
    const ing = p.ingredientesTexto
      ? analizarIngredientesTexto(p.ingredientesTexto).ingredientes.map(
          (i) => ({ texto: i.texto, porcentaje: i.porcentaje }))
      : [];
    const v = analizarProducto({
      nombre: p.nombre, marca: p.marca, categoria: p.categoria,
      nutrientes: p.nutrientes, ingredientes: ing,
      racion_declarada_g: p.racionGramos,
    });

    estado = {
      fase: 'resultado', mensaje: '', veredicto: v, producto: p,
      avisos: revisarVigilancia(v, ing, vigilanciaActiva()).filter((a) => a.salta),
    };
    // Se deja cargado por si se quiere revisar bien sin volver a escanear.
    reiniciar();
    enCurso.nombre = p.nombre;
    enCurso.categoria = p.categoria;
    enCurso.nutrientes = { ...p.nutrientes };
    enCurso.ingredientes = ing;
    if (p.racionGramos) enCurso.racionGramos = p.racionGramos;
    repintar();
  }

  raiz.querySelector('#btnBuscarSuper')?.addEventListener('click', () => {
    resolver(raiz.querySelector('#codigoSuper')?.value ?? '');
  });

  raiz.querySelector('#btnEscanearSuper')?.addEventListener('click', async () => {
    if (estado.fase === 'escaneando') return;
    if (!(await hayEscaner())) {
      decir('El lector de códigos no está instalado en esta copia. Teclea el número.');
      return;
    }
    estado.fase = 'escaneando';
    repintar();
    const video = raiz.querySelector('#videoSuper') ?? document.getElementById('videoSuper');
    const r = await escanear({ video, alEstado: decir });
    if (!r.ok) { estado.fase = 'inicio'; decir(r.mensaje); repintar(); return; }
    await resolver(r.codigo);
  });

  raiz.querySelector('#btnOtro')?.addEventListener('click', () => {
    estado = { fase: 'inicio', mensaje: '', veredicto: null, producto: null, avisos: [] };
    repintar();
  });

  raiz.querySelector('#btnRevisarlo')?.addEventListener('click', () => irA('revisar'));
}
