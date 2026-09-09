/**
 * VERDICTO · Arranque y navegación.
 *
 * Módulo 0: esqueleto instalable. Aquí no hay lógica de negocio, solo el
 * armazón sobre el que se irán colgando los módulos siguientes.
 */

import { inicio, inicioActivo } from './vistas/inicio.js';
import { bienvenida, bienvenidaActivo, bienvenidaVista, reiniciarBienvenida } from './vistas/bienvenida.js';
import { analizar, analizarActivo } from './vistas/analizar.js';
import { resultado, resultadoActivo } from './vistas/resultado.js';
import { revisar, revisarActivo } from './vistas/revisar.js';
import { escucharGestos, deslizarActivado, ponerDeslizar } from './gestos.js';
import { vistaComparar, compararActivo } from './vistas/comparar.js';
import { acerca, acercaActivo } from './vistas/acerca.js';
import { tendencia, tendenciaActiva } from './vistas/tendencia.js';
import { supermercado, supermercadoActivo } from './vistas/supermercado.js';
import { conocimiento, conocimientoActivo } from './vistas/conocimiento.js';
import { despensa, despensaActivo } from './vistas/despensa.js';
import { combinar, combinarActivo, reiniciarCombinar } from './vistas/combinar.js';
import {
  almacenamientoDuradero,
  espacioDisponible,
  servicioRegistrado,
  hayIndexedDB,
  estadoInstalacion,
} from './diagnostico.js';

export const VERSION = '3.3.0';

const CLAVE_ESCALA = 'comer.escala';

/** Lee la escala guardada. Si no hay nada o está corrupta, vuelve a 1. */
function escala() {
  try {
    const v = Number(localStorage.getItem(CLAVE_ESCALA));
    return v >= 1 && v <= 1.5 ? v : 1;
  } catch {
    return 1;
  }
}

function ponerEscala(valor) {
  document.documentElement.style.setProperty('--escala', String(valor));
  try {
    localStorage.setItem(CLAVE_ESCALA, String(valor));
  } catch {
    // Si el navegador no deja guardar, el tamaño se aplica igual en esta sesión.
  }
}

const VISTAS = {
  inicio: { pinta: inicio, activa: inicioActivo, titulo: 'Inicio' },
  // La bienvenida cuelga de Inicio: se ve una vez y no merece pestaña propia.
  bienvenida: { pinta: bienvenida, activa: bienvenidaActivo, titulo: 'Bienvenida', pestana: 'inicio' },
  analizar: { pinta: analizar, activa: analizarActivo, titulo: 'Analizar' },
  // Revisar no tiene pestaña propia: es el segundo paso de Analizar.
  revisar: { pinta: revisar, activa: revisarActivo, titulo: 'Revisar', pestana: 'analizar' },
  resultado: { pinta: resultado, activa: resultadoActivo, titulo: 'Resultado' },
  conocimiento: { pinta: conocimiento, activa: conocimientoActivo, titulo: 'Saber' },
  despensa: { pinta: despensa, activa: despensaActivo, titulo: 'Despensa' },
  // Comparar cuelga de la Despensa: es lo que se hace con lo guardado.
  comparar: { pinta: vistaComparar, activa: compararActivo, titulo: 'Comparar', pestana: 'despensa' },
  // Cuelgan de Inicio: son sobre ti, no sobre un producto concreto.
  tendencia: { pinta: tendencia, activa: tendenciaActiva, titulo: 'Tu tendencia', pestana: 'inicio' },
  acerca: { pinta: acerca, activa: acercaActivo, titulo: 'Qué es y qué no es', pestana: 'inicio' },
  // Qué juntar cuelga de la Despensa: se parte de lo que ya tienes guardado.
  combinar: { pinta: combinar, activa: combinarActivo, titulo: 'Qué juntar', pestana: 'despensa' },
  supermercado: { pinta: supermercado, activa: supermercadoActivo, titulo: 'En el supermercado', pestana: 'analizar' },
};

const contenedor = document.getElementById('contenedorVista');
const pestanas = Array.from(document.querySelectorAll('.barra__pestana'));

let vistaActual = null;

function irA(clave, conservarScroll = false) {
  const vista = VISTAS[clave];
  if (!vista || (clave === vistaActual && !conservarScroll)) return;
  vistaActual = clave;

  const zona = document.querySelector('.principal');
  const y = conservarScroll ? (zona?.scrollTop ?? 0) : 0;

  /**
   * Cada vista se pinta dentro de un envoltorio NUEVO.
   *
   * Cambiar solo el innerHTML del contenedor lo deja vivo, y con él todos los
   * oyentes que las vistas le hayan colgado. En cada repintado se acumulaba
   * uno más, así que un botón que alterna acababa alternándose dos veces
   * seguidas en el mismo toque: encendía y apagaba a la vez.
   *
   * Lo destapó el filtro "solo lo que conviene limitar" de la pestaña Saber,
   * pero el riesgo lo tenían las nueve pantallas que enganchan oyentes.
   *
   * La solución es un envoltorio interno que se tira y se rehace en cada
   * pintado: los oyentes se van con él. El contenedor de fuera no se toca, así
   * que cualquier código que guarde una referencia a él sigue valiendo.
   */
  const envoltorio = document.createElement('div');
  envoltorio.className = 'vista__cuerpo';
  envoltorio.innerHTML = vista.pinta({ irA });
  contenedor.replaceChildren(envoltorio);

  if (vista.activa) {
    vista.activa(envoltorio, {
      irA, pintarDiagnostico, escala, ponerEscala, deslizarActivado, ponerDeslizar,
      tema, ponerTema,
      // Repintar sin perder el sitio: al volver de la cámara, saltar arriba
      // sería desconcertante.
      repintar: () => irA(clave, true),
    });
  }

  const marcada = vista.pestana ?? clave;
  for (const p of pestanas) {
    p.setAttribute('aria-selected', String(p.dataset.vista === marcada));
  }

  document.title = `${vista.titulo} · Catario`;
  // Se desplaza el contenedor, no la ventana: la página entera ya no se mueve.
  if (zona) zona.scrollTop = y;
  // Sin animación: en móvil molesta más de lo que aporta.
}

for (const p of pestanas) {
  p.addEventListener('click', () => irA(p.dataset.vista));
}

/** Orden de las pestañas, que es el que sigue el gesto. */
const ORDEN = pestanas.map((p) => p.dataset.vista);

escucharGestos(document.body, (direccion) => {
  // Si se está revisando, el gesto se refiere a la pestaña de la que cuelga.
  const actual = VISTAS[vistaActual]?.pestana ?? vistaActual;
  const i = ORDEN.indexOf(actual);
  if (i === -1) return;
  const destino = ORDEN[direccion === 'anterior' ? i - 1 : i + 1];
  if (destino) irA(destino);
});

/** Rellena la lista de comprobaciones de la pantalla de inicio. */
async function pintarDiagnostico(lista) {
  const { instalada } = estadoInstalacion();

  const fila = (nombre, valor, bueno) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${nombre}</span><b class="${bueno ? 'si' : 'no'}">${valor}</b>`;
    return li;
  };

  lista.replaceChildren(
    fila('Versión de la app', VERSION, true),
    fila('Instalada en la pantalla de inicio', instalada ? 'Sí' : 'Todavía no', instalada),
    fila('Base de datos del navegador', hayIndexedDB() ? 'Disponible' : 'No disponible', hayIndexedDB()),
    fila('Funciona sin conexión', 'Comprobando…', true),
    fila('Datos protegidos del borrado', 'Comprobando…', true),
    fila('Espacio disponible', 'Comprobando…', true),
  );

  const sinConexion = await esperarServicio();
  const duradero = await almacenamientoDuradero();
  const espacio = await espacioDisponible();

  lista.replaceChildren(
    fila('Versión de la app', VERSION, true),
    fila('Instalada en la pantalla de inicio', instalada ? 'Sí' : 'Todavía no', instalada),
    fila('Base de datos del navegador', hayIndexedDB() ? 'Disponible' : 'No disponible', hayIndexedDB()),
    fila('Funciona sin conexión', sinConexion ? 'Sí' : 'No', sinConexion),
    fila(
      'Datos protegidos del borrado',
      duradero === true ? 'Sí' : duradero === false ? 'No concedido' : 'No se puede saber',
      duradero === true,
    ),
    fila('Espacio disponible', formatearEspacio(espacio), Boolean(espacio)),
  );
}

/** Registra el trabajador que permite abrir la app sin cobertura. */
async function activarSinConexion() {
  if (!('serviceWorker' in navigator)) return false;
  try {
    await navigator.serviceWorker.register('./sw.js');
    return true;
  } catch (err) {
    // Sin modo offline la app sigue funcionando. No hay motivo para molestar.
    console.warn('No se pudo registrar el modo sin conexión:', err.message);
    return false;
  }
}

/**
 * Espera a que el trabajador esté realmente activo.
 *
 * Registrar es instantáneo; activarse no. Preguntar por el registro nada más
 * pedirlo devuelve "no" aunque todo vaya bien. Con tope de tiempo, porque una
 * comprobación que se queda colgada es peor que una que responde "no".
 */
async function esperarServicio(msMax = 6000) {
  if (!('serviceWorker' in navigator)) return false;
  await registroSW;  // definido más abajo; para cuando esto corre, ya existe
  try {
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((r) => setTimeout(r, msMax)),
    ]);
  } catch {
    // Da igual por qué falló: lo que cuenta es el estado, y lo mira la línea siguiente.
  }
  return servicioRegistrado();
}

/** 39322 MB no se lee. 38,4 GB sí. */
function formatearEspacio(mb) {
  if (!mb) return 'No se puede saber';
  if (mb >= 1024) return `${(mb / 1024).toFixed(1).replace('.', ',')} GB`;
  return `${mb} MB`;
}

// Se registra ANTES de pintar la pantalla. Al revés, el diagnóstico preguntaba
// por el trabajador antes de que existiera y siempre respondía que no.
const registroSW = activarSinConexion();

/**
 * El tema: claro, oscuro o el que diga el teléfono.
 *
 * Se aplica ANTES de pintar nada. Al revés se vería un destello del color
 * contrario mientras arranca.
 */
const CLAVE_TEMA = 'catario.tema';

export function tema() {
  try { return localStorage.getItem(CLAVE_TEMA) ?? 'sistema'; } catch { return 'sistema'; }
}

export function ponerTema(cual) {
  try { localStorage.setItem(CLAVE_TEMA, cual); } catch { /* se aplica igual */ }
  aplicarTema();
}

function aplicarTema() {
  const elegido = tema();
  const claro = elegido === 'claro' ||
    (elegido === 'sistema' && window.matchMedia?.('(prefers-color-scheme: light)').matches);
  document.documentElement.setAttribute('data-tema', claro ? 'claro' : 'oscuro');
}

aplicarTema();
// Si está en "el del sistema", seguir al teléfono cuando cambie solo.
window.matchMedia?.('(prefers-color-scheme: light)')
  .addEventListener?.('change', () => { if (tema() === 'sistema') aplicarTema(); });

ponerEscala(escala());

// Volver a ver un producto guardado, desde la Despensa.
window.addEventListener('comer:ver-resultado', () => irA('resultado'));
window.addEventListener('comer:comparar', () => irA('comparar'));
window.addEventListener('comer:tendencia', () => irA('tendencia'));
window.addEventListener('comer:acerca', () => irA('acerca'));
window.addEventListener('comer:combinar', () => irA('combinar'));

export { irA };

/**
 * Mide la cabecera y se lo dice al CSS.
 *
 * Su alto depende del tamaño de letra que se haya elegido y de la muesca del
 * teléfono, así que no se puede escribir un número fijo en la hoja de estilos.
 */
function medirCabecera() {
  const cab = document.querySelector('.cabecera');
  if (!cab) return;
  document.documentElement.style.setProperty('--alto-cabecera', `${cab.offsetHeight}px`);
}
medirCabecera();
window.addEventListener('resize', medirCabecera);
window.addEventListener('orientationchange', () => setTimeout(medirCabecera, 250));

// La bienvenida solo la primera vez. Después queda accesible desde "Qué es y
// qué no es", por si alguien quiere volver a verla o enseñársela a otro.
if (bienvenidaVista()) {
  irA('inicio');
} else {
  reiniciarBienvenida();
  irA('bienvenida');
}
