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
   El movimiento se hace con CSS, no con animación de SVG.
   
   La primera versión usaba <animate> dentro del SVG. No funcionaba por dos
   motivos: los colores iban en variables CSS, que ese sistema no sabe
   interpolar, y además las animaciones de SVG insertadas con innerHTML no
   siempre arrancan. Con CSS las dos cosas dejan de ser un problema.

   Si el teléfono pide menos movimiento, se quedan quietas y se entienden
   igual: el dibujo ya dice lo que tiene que decir. */

function escenaEscaneo() {
  return `
    <svg viewBox="0 0 200 140" class="bien__svg" aria-hidden="true">
      <rect x="46" y="24" width="108" height="92" rx="10"
            fill="none" stroke="var(--linea)" stroke-width="2"/>
      ${[62, 72, 78, 90, 100, 110, 122, 132].map((x, i) => `
        <rect x="${x}" y="44" width="${i % 3 === 0 ? 5 : 3}" height="52" rx="1.5"
              fill="var(--ceniza-tenue)"/>`).join('')}
      <rect class="esc-linea" x="46" y="0" width="108" height="3" rx="1.5"
            fill="var(--verde-claro)"/>
    </svg>`;
}

function escenaEscala() {
  // Un círculo que recorre los cinco colores del semáforo, de peor a mejor,
  // mientras el arco se va llenando. Es la escala de la app, en movimiento.
  const VUELTA = 2 * Math.PI * 44;
  return `
    <svg viewBox="0 0 200 140" class="bien__svg" aria-hidden="true">
      <circle cx="100" cy="70" r="44" fill="none"
              stroke="var(--carbon-alto)" stroke-width="10"/>
      <circle class="esc-arco" cx="100" cy="70" r="44" fill="none"
              stroke-width="10" stroke-linecap="round"
              transform="rotate(-90 100 70)"
              style="--vuelta:${VUELTA.toFixed(1)}"/>
      <text x="100" y="77" text-anchor="middle" class="bien__cifra esc-cifra">0-100</text>
    </svg>`;
}

function escenaPorQue() {
  // Tres barras que crecen a distinto ritmo: el desglose de la nota.
  const barras = [
    { y: 40, ancho: 58, color: 'var(--rojo)' },
    { y: 64, ancho: 96, color: 'var(--amarillo)' },
    { y: 88, ancho: 128, color: 'var(--verde-claro)' },
  ];
  return `
    <svg viewBox="0 0 200 140" class="bien__svg" aria-hidden="true">
      ${barras.map((b, i) => `
        <rect x="36" y="${b.y}" width="132" height="12" rx="6" fill="var(--carbon-alto)"/>
        <rect class="esc-barra esc-barra--${i + 1}" x="36" y="${b.y}"
              width="${b.ancho}" height="12" rx="6" fill="${b.color}"
              style="--ancho:${b.ancho}"/>`).join('')}
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
      <rect class="esc-candado" x="86" y="66" width="28" height="22" rx="4"
            fill="var(--verde-claro)"/>
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
