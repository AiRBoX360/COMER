/**
 * VERDICTO · Arranque y navegación.
 *
 * Módulo 0: esqueleto instalable. Aquí no hay lógica de negocio, solo el
 * armazón sobre el que se irán colgando los módulos siguientes.
 */

import { inicio, inicioActivo } from './vistas/inicio.js';
import { analizar, analizarActivo } from './vistas/analizar.js';
import { resultado, resultadoActivo } from './vistas/resultado.js';
import { revisar, revisarActivo } from './vistas/revisar.js';
import { escucharGestos, deslizarActivado, ponerDeslizar } from './gestos.js';
import { vistaComparar, compararActivo } from './vistas/comparar.js';
import { acerca } from './vistas/acerca.js';
import { tendencia, tendenciaActiva } from './vistas/tendencia.js';
import { supermercado, supermercadoActivo } from './vistas/supermercado.js';
import { conocimiento, conocimientoActivo } from './vistas/conocimiento.js';
import { despensa, despensaActivo } from './vistas/despensa.js';
import {
  almacenamientoDuradero,
  espacioDisponible,
  servicioRegistrado,
  hayIndexedDB,
  estadoInstalacion,
} from './diagnostico.js';

export const VERSION = '0.28.0';

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
  acerca: { pinta: acerca, titulo: 'Qué es y qué no es', pestana: 'inicio' },
  supermercado: { pinta: supermercado, activa: supermercadoActivo, titulo: 'En el supermercado', pestana: 'analizar' },
};

const contenedor = document.getElementById('contenedorVista');
const pestanas = Array.from(document.querySelectorAll('.barra__pestana'));

let vistaActual = null;

function irA(clave, conservarScroll = false) {
  const vista = VISTAS[clave];
  if (!vista || (clave === vistaActual && !conservarScroll)) return;
  vistaActual = clave;

  const y = conservarScroll ? window.scrollY : 0;
  contenedor.innerHTML = vista.pinta({ irA });
  if (vista.activa) {
    vista.activa(contenedor, {
      irA, pintarDiagnostico, escala, ponerEscala, deslizarActivado, ponerDeslizar,
      // Repintar sin perder el sitio: al volver de la cámara, saltar arriba
      // sería desconcertante.
      repintar: () => irA(clave, true),
    });
  }

  const marcada = vista.pestana ?? clave;
  for (const p of pestanas) {
    p.setAttribute('aria-selected', String(p.dataset.vista === marcada));
  }

  document.title = `${vista.titulo} · Comer después de usar`;
  window.scrollTo({ top: y });
  // Sin animación de scroll: en móvil molesta más de lo que aporta.
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

const etiqueta = document.getElementById('etiquetaVersion');
if (etiqueta) etiqueta.textContent = `v${VERSION}`;

// Se registra ANTES de pintar la pantalla. Al revés, el diagnóstico preguntaba
// por el trabajador antes de que existiera y siempre respondía que no.
const registroSW = activarSinConexion();

ponerEscala(escala());

// Volver a ver un producto guardado, desde la Despensa.
window.addEventListener('comer:ver-resultado', () => irA('resultado'));
window.addEventListener('comer:comparar', () => irA('comparar'));
window.addEventListener('comer:tendencia', () => irA('tendencia'));
window.addEventListener('comer:acerca', () => irA('acerca'));

export { irA };

irA('inicio');
