import { esc } from '../ui.js';

/**
 * La primera vez que se abre la app.
 *
 * Cuatro pantallas que se pasan con el dedo. Poco texto: quien abre una app
 * por primera vez no viene a leer, viene a ver si le interesa.
 *
 * Cada una lleva un movimiento pequeño que explica lo que dice el texto, no un
 * adorno: el círculo que recorre los cinco colores enseña la escala, el
 * escáner enseña la lectura, la barra que se detiene enseña el techo. Si el
 * teléfono pide menos animación, se quedan quietas y se entienden igual.
 *
 * Se ve una sola vez. Después queda accesible desde "Qué es y qué no es", por
 * si alguien quiere volver a verla o enseñársela a otra persona.
 */

const CLAVE = 'catario.bienvenida.vista';

export function bienvenidaVista() {
  try { return localStorage.getItem(CLAVE) === '1'; } catch { return false; }
}

export function marcarBienvenidaVista() {
  try { localStorage.setItem(CLAVE, '1'); } catch { /* sin memoria, se verá otra vez */ }
}

let pagina = 0;

/** Reinicia al principio. Se llama al entrar, para que no quede a medias. */
export function reiniciarBienvenida() {
  pagina = 0;
}

const PAGINAS = [
  {
    titulo: 'Lee la etiqueta por ti',
    frase: 'Escanea el código, pega el texto o haz una foto.',
    escena: escenaEscaneo,
  },
  {
    titulo: 'Una nota de 0 a 100',
    frase: 'Cinco niveles, del rojo al verde.',
    escena: escenaEscala,
  },
  {
    titulo: 'Y te dice por qué',
    frase: 'Qué pesa en contra, qué a favor, y de dónde sale cada cosa.',
    escena: escenaPorQue,
  },
  {
    titulo: 'Todo se queda aquí',
    frase: 'En tu teléfono. Nada viaja a ninguna parte.',
    escena: escenaPrivacidad,
  },
];

/* --- Las escenas ---------------------------------------------------------
   SVG con animación declarativa. No hay bucle de JavaScript detrás: el
   navegador la lleva, así que no consume batería ni se atasca. */

function escenaEscaneo() {
  return `
    <svg viewBox="0 0 200 140" class="bien__svg" aria-hidden="true">
      <rect x="46" y="24" width="108" height="92" rx="10"
            fill="none" stroke="var(--linea)" stroke-width="2"/>
      ${[62, 72, 78, 90, 100, 110, 122, 132].map((x, i) => `
        <rect x="${x}" y="44" width="${i % 3 === 0 ? 5 : 3}" height="52" rx="1.5"
              fill="var(--ceniza-tenue)"/>`).join('')}
      <rect x="46" y="42" width="108" height="3" rx="1.5" fill="var(--verde-claro)">
        <animate attributeName="y" values="42;104;42" dur="2.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="2.6s" repeatCount="indefinite"/>
      </rect>
    </svg>`;
}

function escenaEscala() {
  // Un círculo que recorre los cinco colores del semáforo, de peor a mejor.
  const colores = ['var(--rojo)', 'var(--naranja)', 'var(--amarillo)',
                   'var(--verde-claro)', 'var(--verde-parchis)'];
  const VUELTA = 2 * Math.PI * 44;
  return `
    <svg viewBox="0 0 200 140" class="bien__svg" aria-hidden="true">
      <circle cx="100" cy="70" r="44" fill="none" stroke="var(--carbon-alto)" stroke-width="10"/>
      <circle cx="100" cy="70" r="44" fill="none" stroke-width="10" stroke-linecap="round"
              transform="rotate(-90 100 70)">
        <animate attributeName="stroke"
                 values="${colores.join(';')};${colores[0]}"
                 dur="5s" repeatCount="indefinite"/>
        <animate attributeName="stroke-dasharray"
                 values="${[0.2, 0.4, 0.6, 0.8, 0.97, 0.2].map((f) =>
                   `${(VUELTA * f).toFixed(0)} ${(VUELTA * (1 - f)).toFixed(0)}`).join(';')}"
                 dur="5s" repeatCount="indefinite"/>
      </circle>
      <text x="100" y="78" text-anchor="middle" class="bien__cifra">
        <animate attributeName="opacity" values=".55;1;.55" dur="5s" repeatCount="indefinite"/>
        0-100
      </text>
    </svg>`;
}

function escenaPorQue() {
  // Tres barras que crecen a distinto ritmo: el desglose de la nota.
  const barras = [
    { y: 40, ancho: 58, color: 'var(--rojo)', retraso: '0s' },
    { y: 64, ancho: 96, color: 'var(--amarillo)', retraso: '.25s' },
    { y: 88, ancho: 128, color: 'var(--verde-claro)', retraso: '.5s' },
  ];
  return `
    <svg viewBox="0 0 200 140" class="bien__svg" aria-hidden="true">
      ${barras.map((b) => `
        <rect x="36" y="${b.y}" width="132" height="12" rx="6" fill="var(--carbon-alto)"/>
        <rect x="36" y="${b.y}" width="0" height="12" rx="6" fill="${b.color}">
          <animate attributeName="width" values="0;${b.ancho};${b.ancho};0"
                   keyTimes="0;.35;.85;1" dur="3.4s" begin="${b.retraso}"
                   repeatCount="indefinite"/>
        </rect>`).join('')}
    </svg>`;
}

function escenaPrivacidad() {
  return `
    <svg viewBox="0 0 200 140" class="bien__svg" aria-hidden="true">
      <rect x="72" y="26" width="56" height="92" rx="9"
            fill="none" stroke="var(--linea)" stroke-width="2"/>
      <rect x="80" y="38" width="40" height="60" rx="4" fill="var(--carbon-alto)"/>
      <path d="M90 66v-8a10 10 0 0 1 20 0v8" fill="none"
            stroke="var(--verde-claro)" stroke-width="3" stroke-linecap="round"/>
      <rect x="86" y="66" width="28" height="22" rx="4" fill="var(--verde-claro)">
        <animate attributeName="opacity" values=".55;1;.55" dur="3s" repeatCount="indefinite"/>
      </rect>
    </svg>`;
}

export function bienvenida() {
  const p = PAGINAS[pagina];
  return `
    <div class="bien">
      <div class="bien__cabeza">
        <button class="bien__saltar" id="btnSaltar">Saltar</button>
      </div>

      <div class="bien__escena">${p.escena()}</div>

      <div class="bien__texto">
        <h1>${esc(p.titulo)}</h1>
        <p>${esc(p.frase)}</p>
      </div>

      <div class="bien__puntos" role="tablist" aria-label="Páginas">
        ${PAGINAS.map((_, i) => `
          <button class="bien__punto${i === pagina ? ' es-actual' : ''}"
                  data-ir="${i}" aria-label="Página ${i + 1} de ${PAGINAS.length}"
                  aria-selected="${i === pagina}" role="tab"></button>`).join('')}
      </div>

      <button class="boton-grande" id="btnSiguiente">
        ${pagina === PAGINAS.length - 1 ? 'EMPEZAR' : 'SIGUIENTE'}
      </button>
    </div>`;
}

export function bienvenidaActivo(raiz, { irA, repintar }) {
  const terminar = () => { marcarBienvenidaVista(); irA('inicio'); };

  raiz.querySelector('#btnSaltar')?.addEventListener('click', terminar);
  raiz.querySelector('#btnSiguiente')?.addEventListener('click', () => {
    if (pagina >= PAGINAS.length - 1) { terminar(); return; }
    pagina += 1;
    repintar();
  });

  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ir]');
    if (!b) return;
    pagina = Number(b.dataset.ir);
    repintar();
  });

  // Pasar con el dedo, que es como se espera que funcione algo así.
  let x0 = null;
  const zona = raiz.querySelector('.bien');
  zona?.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  zona?.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) < 50) return;
    const destino = pagina + (dx < 0 ? 1 : -1);
    if (destino < 0 || destino >= PAGINAS.length) return;
    pagina = destino;
    repintar();
  }, { passive: true });
}
