import { vacio, pendiente, esc } from '../ui.js';
import { estadoInstalacion } from '../diagnostico.js';
import { ultimos } from './despensa.js';
import { reiniciarCombinar } from './combinar.js';

/**
 * Lo último que se pulsó, para dejarlo marcado en verde.
 *
 * No es decoración: si vienes de escanear en el súper y vuelves a abrir la
 * app, el botón que usaste queda señalado. Es una pista de por dónde ibas.
 */
const CLAVE_ULTIMA = 'catario.ultimaAccion';
let ultima = (() => {
  try { return localStorage.getItem(CLAVE_ULTIMA) ?? ''; } catch { return ''; }
})();

function recordar(accion) {
  ultima = accion;
  try { localStorage.setItem(CLAVE_ULTIMA, accion); } catch { /* se pierde y ya */ }
}

/** El monograma seguido del nombre de la pantalla. */
export function nombrePantalla(nombre) {
  return `
    <div class="pantalla">
      <span class="pantalla__signo" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <path d="M50 8a42 42 0 1 0 0 84 42 42 0 0 0 36.4-21H50a21 21 0 1 1 0-42h36.4A42 42 0 0 0 50 8Z"/>
          <rect x="31" y="41" width="64" height="18" rx="9"/>
        </svg>
      </span>
      <h1 class="pantalla__nombre">${nombre}</h1>
    </div>`;
}

export function inicio({ irA }) {
  const est = estadoInstalacion();

  const instrucciones = (est.esIOS && !est.instalada) ? `
    <section class="instalar">
      <h3>Ponla en tu pantalla de inicio</h3>
      <p class="texto">Ahora mismo esto es una página. En tres toques se convierte en una app con su icono, a pantalla completa y sin la barra de Safari.</p>
      <ol>
        <li>Toca el botón <b>Compartir</b>, el cuadrado con la flecha hacia arriba.</li>
        <li>Baja y elige <b>Añadir a pantalla de inicio</b>.</li>
        <li>Toca <b>Añadir</b>.</li>
      </ol>
      <p class="texto" style="margin-top:16px">Importante: instalada así, iOS ya no borra tus datos por no usarla durante unos días.</p>
    </section>` : '';

  return `
    ${instrucciones}

    ${nombrePantalla('Inicio')}

    <button class="accion${ultima === 'supermercado' ? ' accion--reciente' : ''}"
            id="btnSupermercado" data-accion="supermercado">
      <span class="accion__icono" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M3.5 4h2l2.2 10.4a1.8 1.8 0 0 0 1.8 1.4h7.6a1.8 1.8 0 0 0 1.8-1.4L20.5 8H6.2"/>
          <circle cx="10" cy="19.4" r="1.2"/><circle cx="17" cy="19.4" r="1.2"/>
        </svg>
      </span>
      <span class="accion__texto">
        <b>Escaneo rápido</b>
        <small>Estoy en el súper</small>
      </span>
    </button>

    <button class="accion${ultima === 'analizar' ? ' accion--reciente' : ''}"
            id="btnAnalizar" data-accion="analizar">
      <span class="accion__icono" aria-hidden="true">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L20 20"/></svg>
      </span>
      <span class="accion__texto">
        <b>Escaneo</b>
        <small>Análisis completo</small>
      </span>
    </button>

    <section class="grupo">
      <h2 class="grupo__titulo">Tus alimentos</h2>
      <div class="grupo__pastillas">
        <button class="pastilla${ultima === 'tendencia' ? ' pastilla--reciente' : ''}"
                id="btnTendencia" data-accion="tendencia">
          <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 17l5-6 4 3 6-8"/><path d="M15 6h4v4"/></svg></span>
          Tendencia
        </button>
        <button class="pastilla${ultima === 'combinar' ? ' pastilla--reciente' : ''}"
                id="btnCombinarInicio" data-accion="combinar">
          <span aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg></span>
          Qué juntar
        </button>
        <button class="pastilla${ultima === 'recetas' ? ' pastilla--reciente' : ''}"
                id="btnRecetas" data-accion="recetas">
          <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 3c0 2-1.5 2.5-1.5 4.5S8 10 8 12"/><path d="M12 3c0 2-1.5 2.5-1.5 4.5S12 10 12 12"/><path d="M16 3c0 2-1.5 2.5-1.5 4.5S16 10 16 12"/><path d="M4 15h16a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6Z"/></svg></span>
          Recetas
        </button>
      </div>
    </section>

    <div id="ultimosAnalisis" class="recientes"></div>

    <details class="ajustes" id="panelAjustes">
      <summary>
        <span class="ajustes__icono" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M10.3 2.8h3.4l.4 2.3a7.3 7.3 0 0 1 1.7 1l2.2-.8 1.7 2.9-1.8 1.5a7.3 7.3 0 0 1 0 2l1.8 1.5-1.7 2.9-2.2-.8a7.3 7.3 0 0 1-1.7 1l-.4 2.3h-3.4l-.4-2.3a7.3 7.3 0 0 1-1.7-1l-2.2.8-1.7-2.9 1.8-1.5a7.3 7.3 0 0 1 0-2L4.3 8.2 6 5.3l2.2.8a7.3 7.3 0 0 1 1.7-1Z"/><circle cx="12" cy="12" r="2.7"/></svg>
        </span>
        <span class="ajustes__nombre">Preferencias</span>
        <span class="ajustes__mas" aria-hidden="true">+</span>
      </summary>

      <h2 class="rotulo">Aspecto</h2>
      <div class="escala">
        <div class="escala__opciones" id="controlTema" role="group" aria-label="Aspecto">
          <button class="escala__boton" data-tema="claro" aria-pressed="false">Claro</button>
          <button class="escala__boton" data-tema="oscuro" aria-pressed="false">Oscuro</button>
        </div>
      </div>

      <h2 class="rotulo">Tamaño del texto</h2>
      <div class="escala">
        <div class="escala__opciones" id="controlEscala" role="group" aria-label="Tamaño del texto">
          <button class="escala__boton" data-escala="1" aria-pressed="false">Normal</button>
          <button class="escala__boton" data-escala="1.15" aria-pressed="false">Grande</button>
          <button class="escala__boton" data-escala="1.32" aria-pressed="false">Mayor</button>
        </div>
      </div>

      <h2 class="rotulo">Cambiar de pestaña deslizando</h2>
      <div class="interruptor">
        <label for="swDeslizar">Desliza el dedo a izquierda o derecha para pasar de una pestaña a otra.</label>
        <button class="interruptor__boton" id="swDeslizar" role="switch" aria-checked="false">
          <span></span>
        </button>
      </div>

      <h2 class="rotulo">Qué es y qué no es</h2>
      <button class="boton" id="btnAcerca" style="width:100%">Leer de dónde salen las valoraciones</button>


    </details>
  `;
}

export function inicioActivo(raiz, { irA, pintarDiagnostico, escala, ponerEscala, deslizarActivado, ponerDeslizar, tema, ponerTema }) {
  const btn = raiz.querySelector('#btnAnalizar');
  if (btn) btn.addEventListener('click', () => irA('analizar'));
  raiz.querySelector('#btnSupermercado')?.addEventListener('click', () => irA('supermercado'));
  raiz.querySelector('#btnTendencia')?.addEventListener('click', () => irA('tendencia'));
  raiz.querySelector('#btnAcerca')?.addEventListener('click', () => irA('acerca'));
  // Había dos botones de Ajustes: el atajo y el desplegable de abajo. Sobraba
  // el atajo, así que su sitio lo ocupa "Qué juntar", que no tenía ninguno.
  // Cada acción se recuerda antes de navegar, para marcarla al volver.
  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-accion]');
    if (b) recordar(b.dataset.accion);
  });

  raiz.querySelector('#btnCombinarInicio')?.addEventListener('click', () => {
    reiniciarCombinar('juntar');
    irA('combinar');
  });
  raiz.querySelector('#btnRecetas')?.addEventListener('click', () => {
    reiniciarCombinar('recetas');
    irA('combinar');
  });

  // --- Aspecto: claro u oscuro -------------------------------------------
  const grupoTema = raiz.querySelector('#controlTema');
  if (grupoTema && tema && ponerTema) {
    const marcarTema = () => {
      // Ya no hay botón para "el del móvil". Si esa es la preferencia
      // guardada de antes, se marca el que corresponde a lo que se está
      // viendo: sin esto no se marcaría ninguno y parecería que no hay nada
      // elegido.
      const puesto = document.documentElement.getAttribute('data-tema') ?? 'oscuro';
      const actual = tema() === 'sistema' ? puesto : tema();
      for (const b of grupoTema.querySelectorAll('[data-tema]')) {
        b.setAttribute('aria-pressed', String(b.dataset.tema === actual));
      }
    };
    marcarTema();
    grupoTema.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tema]');
      if (!b) return;
      ponerTema(b.dataset.tema);
      marcarTema();
    });
  }

  const control = raiz.querySelector('#controlEscala');
  if (control) {
    const marcar = (valor) => {
      for (const b of control.querySelectorAll('button')) {
        b.setAttribute('aria-pressed', String(Number(b.dataset.escala) === valor));
      }
    };
    marcar(escala());
    control.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const valor = Number(b.dataset.escala);
      ponerEscala(valor);
      marcar(valor);
    });
  }
  const sw = raiz.querySelector('#swDeslizar');
  if (sw && deslizarActivado) {
    sw.setAttribute('aria-checked', String(deslizarActivado()));
    sw.addEventListener('click', () => {
      const nuevo = sw.getAttribute('aria-checked') !== 'true';
      ponerDeslizar(nuevo);
      sw.setAttribute('aria-checked', String(nuevo));
    });
  }

  const lista = raiz.querySelector('#listaDiagnostico');
  if (lista) pintarDiagnostico(lista);

  // Los últimos análisis se piden después de pintar: la pantalla aparece
  // enseguida y la lista entra cuando la base responde.
  const hueco = raiz.querySelector('#ultimosAnalisis');
  if (hueco) {
    ultimos(4).then((productos) => {
      if (!productos.length) return;
      hueco.innerHTML = productos.map((p) => `
        <button class="ultimo" data-ver="${p.id}">
          <span class="ultimo__nota cifra" data-nivel="${p.semaforo ?? 'rojo'}">${p.puntuacion ?? '—'}</span>
          <span class="ultimo__nombre">${esc(p.nombre)}</span>
        </button>`).join('');
      hueco.addEventListener('click', (e) => {
        if (e.target.closest('[data-ver]')) irA('despensa');
      });
    }).catch(() => { /* sin base de datos, se queda el estado vacío */ });
  }
}
