/**
 * Almacén de la app.
 *
 * Envuelve el repositorio del motor para que las vistas no sepan si hay
 * IndexedDB detrás o no. Safari en navegación privada a veces lo niega, y en
 * ese caso la app tiene que seguir funcionando aunque sea sin recordar nada:
 * es mejor que dejar de arrancar.
 */

import {
  RepositorioIndexedDB, RepositorioMemoria, hayIndexedDB,
  exportar, importar, validarCopia, nombreFichero, nuevoId,
} from './motor.js';

let repo = null;
let esDuradero = true;

export function almacen() {
  if (repo) return repo;
  if (hayIndexedDB()) {
    repo = new RepositorioIndexedDB();
  } else {
    repo = new RepositorioMemoria();
    esDuradero = false;
  }
  return repo;
}

/** false cuando los datos se pierden al cerrar. La app lo dice si pasa. */
export function almacenDuradero() {
  almacen();
  return esDuradero;
}

/**
 * Guarda un análisis terminado con sus fotos.
 * Las fotos se guardan como JPEG: en bruto ocuparían veinte veces más.
 */
export async function guardarAnalisis({ veredicto, entrada, fotos = [] }) {
  const r = almacen();
  const id = nuevoId();
  const refs = [];

  for (const f of fotos) {
    if (!f?.bytes) continue;
    const idFoto = nuevoId('f');
    await r.guardarFoto({
      id: idFoto, tipo: f.tipo, mime: 'image/jpeg',
      datos: f.bytes, creada: new Date().toISOString(),
    });
    refs.push({ tipo: f.tipo, idFoto });
  }

  await r.guardarProducto({
    id,
    nombre: veredicto.nombre,
    marca: veredicto.marca,
    categoria: veredicto.categoria,
    fechaAnalisis: veredicto.fechaAnalisis,
    puntuacion: veredicto.puntuacion,
    semaforo: veredicto.semaforo,
    veredicto,
    entrada,
    fotos: refs,
  });
  return id;
}

export async function listar(filtro) {
  return almacen().listarProductos(filtro);
}

export async function producto(id) {
  return almacen().obtenerProducto(id);
}

export async function borrar(id) {
  return almacen().borrarProducto(id);
}

export async function estadisticas() {
  return almacen().estadisticas();
}

export async function sustanciasMasVistas(tipo) {
  return almacen().recuentoSustancias(tipo);
}

/** Direcciones temporales de las fotos, para poder soltarlas después. */
const urlsVivas = new Set();

export async function urlDeFoto(idFoto) {
  const f = await almacen().obtenerFoto(idFoto);
  if (!f) return null;
  const url = URL.createObjectURL(new Blob([f.datos], { type: f.mime }));
  urlsVivas.add(url);
  return url;
}

/** Suelta las fotos que ya no se ven. Sin esto, la memoria solo sube. */
export function soltarFotos() {
  for (const u of urlsVivas) URL.revokeObjectURL(u);
  urlsVivas.clear();
}

// ---------------------------------------------------------------------------
// Copia de seguridad
// ---------------------------------------------------------------------------

/**
 * Descarga la copia como fichero.
 *
 * No es un adorno: los datos viven en el navegador del teléfono y el navegador
 * puede borrarlos si al dispositivo le falta espacio. Sin copia exportable,
 * un día se podrían perder doscientos productos sin haber hecho nada mal.
 */
export async function descargarCopia({ incluirFotos = true } = {}) {
  const copia = await exportar(almacen(), { incluirFotos });
  const texto = JSON.stringify(copia);
  const blob = new Blob([texto], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreFichero();
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return { productos: copia.productos.length, kb: Math.round(texto.length / 1024) };
}

/** Lee un fichero de copia y lo restaura. Valida antes de tocar nada. */
export async function restaurarCopia(fichero, modo = 'fusionar') {
  let datos;
  try {
    datos = JSON.parse(await fichero.text());
  } catch {
    return { ok: false, errores: ['El fichero no es una copia válida: no se ha podido leer.'] };
  }
  const errores = validarCopia(datos);
  if (errores.length) return { ok: false, errores };
  return importar(almacen(), datos, { modo });
}
