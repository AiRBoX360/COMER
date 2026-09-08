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
    <p class="texto">Catario lee la etiqueta y te dice qué conviene limitar y qué merece la pena.</p>

    <button class="accion accion--principal" id="btnSupermercado">
      <span class="accion__icono" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>
      </span>
      <span class="accion__texto">
        <b>Estoy en el supermercado</b>
        <small>Escanea y sabe en tres segundos si lo echas al carro</small>
      </span>
    </button>

    <button class="accion" id="btnAnalizar">
      <span class="accion__icono" aria-hidden="true">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/></svg>
      </span>
      <span class="accion__texto">
        <b>Analizar con calma</b>
        <small>Código, alimento fresco, texto pegado o fotos</small>
      </span>
    </button>

    <div id="ultimosAnalisis" class="recientes">
      ${vacio('Todavía no hay nada aquí', 'Los productos que analices aparecerán aquí y en la Despensa.')}
    </div>

    <div class="atajos">
      <button class="atajo" id="btnTendencia">
        <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 17l5-6 4 3 6-8"/><path d="M15 6h4v4"/></svg></span>
        Tu tendencia
      </button>
      <button class="atajo" id="btnCombinarInicio">
        <span aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/></svg></span>
        Qué juntar
      </button>
      <button class="atajo" id="btnAcerca">
        <span aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></span>
        Qué es y qué no es
      </button>
    </div>

    <details class="ajustes" id="panelAjustes">
      <summary>Ajustes</summary>

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

      <h2 class="rotulo">Estado de la instalación</h2>
      <div class="tarjeta">
        <ul class="diagnostico" id="listaDiagnostico"></ul>
      </div>
    </details>
  `;
}

export function inicioActivo(raiz, { irA, pintarDiagnostico, escala, ponerEscala, deslizarActivado, ponerDeslizar }) {
  const btn = raiz.querySelector('#btnAnalizar');
  if (btn) btn.addEventListener('click', () => irA('analizar'));
  raiz.querySelector('#btnSupermercado')?.addEventListener('click', () => irA('supermercado'));
  raiz.querySelector('#btnTendencia')?.addEventListener('click', () => irA('tendencia'));
  raiz.querySelector('#btnAcerca')?.addEventListener('click', () => irA('acerca'));
  // Había dos botones de Ajustes: el atajo y el desplegable de abajo. Sobraba
  // el atajo, así que su sitio lo ocupa "Qué juntar", que no tenía ninguno.
  raiz.querySelector('#btnCombinarInicio')?.addEventListener('click',
    () => irA('combinar'));

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
