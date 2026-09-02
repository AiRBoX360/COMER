/**
 * VERDICTO · Trabajador de servicio.
 * Guarda una copia de la app para que abra sin cobertura, que en un
 * supermercado con sotano pasa mas de lo que parece.
 */
const CACHE = 'comer-v0.27.0';

const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/estilo.css',
  './js/app.js',
  './js/motor.js',
  './js/camara.js',
  './js/lector.js',
  './js/ui.js',
  './js/diagnostico.js',
  './js/vistas/inicio.js',
  './js/vistas/revisar.js',
  './js/vistas/comparar.js',
  './js/vistas/acerca.js',
  './js/vistas/tendencia.js',
  './js/vistas/supermercado.js',
  './js/estado.js',
  './js/gestos.js',
  './js/almacen.js',
  './js/codigobarras.js',
  './js/escaner.js',
  './js/vistas/analizar.js',
  './js/vistas/resultado.js',
  './js/vistas/conocimiento.js',
  './js/vistas/despensa.js',
  './fuentes/archivo-600.woff2',
  './fuentes/archivo-800.woff2',
  './fuentes/plex-sans-400.woff2',
  './fuentes/plex-sans-600.woff2',
  './fuentes/plex-mono-400.woff2',
  './fuentes/plex-mono-600.woff2',
  './iconos/icono-180.png',
  './iconos/icono-192.png',
  './iconos/icono-512.png',
  './iconos/favicon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll falla entero si un solo archivo falla; guardamos uno a uno.
      .then((c) => Promise.allSettled(ARCHIVOS.map((a) => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/**
 * Dos estrategias, y la diferencia importa.
 *
 * El codigo de la app (HTML, CSS, JS) va primero a la red. Si no, el telefono
 * se queda con la copia guardada para siempre y ninguna version nueva llega
 * nunca. Con red se usa lo ultimo; sin red, lo guardado.
 *
 * Las tipografias y los iconos van primero a la copia guardada, porque no
 * cambian y pedirlos por red en cada arranque solo gasta tiempo y bateria.
 */
// Ficheros que no cambian nunca y son pequeños: se guardan en la copia local.
const INMUTABLE = /\/(fuentes|iconos)\//;

// Ficheros que no cambian nunca pero son ENORMES: el lector de texto son casi
// nueve megas y el de códigos algo más de uno. Estos pasan directos a la red
// sin clonarse ni guardarse.
//
// Clonar una respuesta de cuatro megas para meterla en la copia local puede
// bloquear la descarga a medias si el guardado se atasca o no cabe: es un
// problema conocido de clonar respuestas grandes. Y guardarlos aquí no aporta
// nada, porque el navegador ya los conserva por su cuenta.
const GRANDES = /\/(lector|escaner)\//;

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Lo de fuera (la consulta a la base de productos) va directo a la red y no
  // se guarda: una ficha vieja en la copia sería peor que no tenerla.
  if (url.origin !== self.location.origin) return;

  // Los grandes, directos a la red. Sin clonar, sin guardar, sin tocar nada.
  if (GRANDES.test(url.pathname)) return;

  if (INMUTABLE.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((guardado) =>
        guardado || fetch(e.request).then((resp) => {
          if (resp && resp.ok) {
            const copia = resp.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copia));
          }
          return resp;
        }),
      ),
    );
    return;
  }

  // Red primero, con dos segundos de paciencia antes de tirar de la copia.
  e.respondWith(
    Promise.race([
      fetch(e.request).then((resp) => {
        if (resp && resp.ok && resp.type === 'basic') {
          const copia = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copia));
        }
        return resp;
      }),
      new Promise((_, rechaza) => setTimeout(() => rechaza(new Error('lento')), 2000)),
    ]).catch(() =>
      caches.match(e.request).then((g) => g || caches.match('./index.html')),
    ),
  );
});
