/**
 * VERDICTO · Comprobaciones del entorno.
 *
 * Sirve para que el usuario pueda decirme, sin saber nada de tecnología, si la
 * instalación ha ido bien. Se retirará cuando la app esté terminada.
 */

export function estadoInstalacion() {
  const ua = navigator.userAgent || '';
  const esIOS = /iPad|iPhone|iPod/.test(ua) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const instalada =
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches;
  return { esIOS, instalada };
}

/** Comprueba si el almacenamiento está marcado como duradero y lo pide si no. */
export async function almacenamientoDuradero() {
  if (!navigator.storage || !navigator.storage.persist) return null;
  try {
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return null;
  }
}

/** Espacio disponible aproximado, en megabytes. */
export async function espacioDisponible() {
  if (!navigator.storage || !navigator.storage.estimate) return null;
  try {
    const { quota } = await navigator.storage.estimate();
    return quota ? Math.round(quota / 1048576) : null;
  } catch {
    return null;
  }
}

/** ¿Está registrado el trabajador de servicio que permite el uso sin conexión? */
export async function servicioRegistrado() {
  if (!('serviceWorker' in navigator)) return false;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    return regs.length > 0;
  } catch {
    return false;
  }
}

/** ¿Se puede usar la base de datos del navegador? */
export function hayIndexedDB() {
  return typeof indexedDB !== 'undefined';
}
