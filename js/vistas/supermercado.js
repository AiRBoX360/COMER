import { nivelSolo, marcador, esc, nivelDeNota } from '../ui.js';
import { deDondeViene } from '../donde.js';
import { escanear, hayEscaner } from '../escaner.js';
import { buscarPorCodigo } from '../codigobarras.js';
import { analizarProducto, analizarIngredientesTexto, revisarVigilancia } from '../motor.js';
import { enCurso, reiniciar } from '../estado.js';
import { vigilanciaActiva } from './tendencia.js';
import { nombrePantalla } from './inicio.js';

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

/**
 * La tarjeta del veredicto rápido, con la procedencia dentro.
 *
 * Es la misma pieza que en Resultado: nota en el anillo, nombre al lado y de
 * dónde viene debajo. En el pasillo esa información vale tanto como la nota:
 * saber que un tomate viene de Marruecos cambia la decisión.
 */
function tarjetaRapida(p, v) {
  const n = Math.max(0, Math.min(100, v.puntuacion ?? 0));
  const nivel = nivelDeNota(n);
  const VUELTA = 2 * Math.PI * 52;
  const lleno = (n / 100) * VUELTA;

  // Aquí el producto trae los tres campos sueltos, tal como llegan de Open
  // Food Facts, en vez de agrupados. Se le pasan como están.
  const d = p ? deDondeViene({ ...p, codigoBarras: p.codigo }) : null;
  const lineas = [];
  if (d) {
    if (d.origen.length) lineas.push(...d.origen);
    if (d.provincia) lineas.push(d.provincia);
    else if (d.envasado.length) lineas.push(...d.envasado);
    else if (d.registrado && d.registrado !== 'BALANZA') lineas.push(d.registrado);
  }

  return `
    <div class="veredicto" data-nivel="${nivel.clave}">
      <div class="veredicto__anillo">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="veredicto__pista" cx="60" cy="60" r="52"/>
          <circle class="veredicto__arco" cx="60" cy="60" r="52"
                  stroke-dasharray="${lleno.toFixed(1)} ${(VUELTA - lleno).toFixed(1)}"/>
        </svg>
        <div class="veredicto__cifra">
          <b class="cifra">${n}</b><small>de 100</small>
        </div>
      </div>
      <div class="veredicto__texto">
        <h1>${esc(p?.nombre ?? v.nombre ?? '')}</h1>
        ${p?.marca ? `<p class="veredicto__marca">${esc(p.marca)}</p>` : ''}
        ${lineas.length ? `
          <div class="procedencia">
            <span class="procedencia__rotulo">Procedencia</span>
            ${lineas.slice(0, 3).map((l) => `<span class="procedencia__linea">${esc(l)}</span>`).join('')}
          </div>` : ''}
      </div>
    </div>`;
}

export function supermercado() {
  const { fase, mensaje, veredicto: v, producto: p, avisos } = estado;

  if (fase === 'resultado' && v) {
    return `
      ${nombrePantalla('Escaneo rápido')}

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
        : `${tarjetaRapida(p, v)}${nivelSolo(v.puntuacion)}`}

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

  // La misma cara que la vía del código en Analizar: hacen lo mismo, así que
  // no tiene sentido que se vean distintas. Aquí solo cambia que no se revisa
  // nada antes de dar la nota, porque es para decidir en el pasillo.
  return `
    <div class="vias">
      <div class="via via--abierta">
        <span class="via__icono" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 5v14M7.2 5v14M10 5v10M12.8 5v14M16 5v10M18.6 5v14M21 5v14"
                  stroke-linecap="butt"/>
          </svg>
        </span>
        <span class="via__nombre">Escaneo rápido</span>
      </div>

      <div class="via__cuerpo">
        <div class="escaner" id="zonaSuper" ${fase === 'escaneando' ? '' : 'hidden'}>
          <video id="videoSuper" muted playsinline></video>
          <div class="escaner__mira"></div>
        </div>

        <button class="caja-accion" id="btnEscanearSuper">
          ${fase === 'escaneando' ? 'Buscando…' : 'Escanea con la cámara'}
        </button>

        <div class="campo">
          <div class="campo__entrada">
            <input id="codigoSuper" type="text" inputmode="numeric"
                   placeholder="Pega o escribe el número" autocomplete="off">
          </div>
        </div>

        <div class="buscar">
          <button class="buscar__boton" id="btnBuscarSuper" aria-label="Buscar alimento">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L20 20"/>
            </svg>
          </button>
          <span class="buscar__rotulo">Buscar alimento</span>
        </div>

        <p class="texto" id="estadoSuper" role="status" aria-live="polite">${esc(mensaje)}</p>
        <p class="apunte-via">Apunta al código y sale la nota, sin revisar nada. Para decidir en el pasillo.</p>
      </div>
    </div>
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

    // El vídeo se busca en el DOCUMENTO, no en `raiz`.
    //
    // Al repintar, la pantalla se dibuja en un envoltorio nuevo y `raiz` pasa
    // a ser el de antes, que ya no está puesto. Buscar ahí devolvía un vídeo
    // huérfano: el escáner arrancaba contra un elemento invisible y la cámara
    // no se veía nunca.
    //
    // Se espera un instante porque el repintado acaba de ocurrir.
    await new Promise((r) => setTimeout(r, 30));
    const video = document.getElementById('videoSuper');
    if (!video) {
      estado.fase = 'inicio';
      decir('No se ha podido abrir la cámara. Teclea el número.');
      repintar();
      return;
    }
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
