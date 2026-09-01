import { vacio, pendiente, esc } from '../ui.js';
import { estadoInstalacion } from '../diagnostico.js';
import { ultimos } from './despensa.js';

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

    <h1 class="titulo">Qué llevas en la mano</h1>
    <p class="texto">Fotografía la tabla nutricional y los ingredientes. Verdicto lee la etiqueta, la analiza y te dice qué conviene limitar y qué merece la pena.</p>

    <button class="boton-grande" id="btnAnalizar" style="margin:24px 0">
      ANALIZAR PRODUCTO
      <small>Tabla nutricional e ingredientes</small>
    </button>

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

    <h2 class="rotulo">Últimos análisis</h2>
    <div id="ultimosAnalisis">
      ${vacio('Todavía no hay nada aquí', 'Los productos que analices aparecerán en esta lista y en la Despensa.')}
    </div>

    <h2 class="subtitulo">Estado de la instalación</h2>
    <p class="texto">Esta sección existe para que puedas comprobar que todo está en su sitio. Desaparecerá cuando la app esté terminada.</p>
    <div class="tarjeta" style="margin-top:16px">
      <ul class="diagnostico" id="listaDiagnostico"></ul>
    </div>
  `;
}

export function inicioActivo(raiz, { irA, pintarDiagnostico, escala, ponerEscala, deslizarActivado, ponerDeslizar }) {
  const btn = raiz.querySelector('#btnAnalizar');
  if (btn) btn.addEventListener('click', () => irA('analizar'));

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
