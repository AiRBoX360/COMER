/**
 * Consulta por código de barras.
 *
 * Es la única parte de la app que sale a internet, y conviene tenerlo presente:
 * el código de lo que estás comiendo viaja a un servidor de Open Food Facts,
 * una asociación sin ánimo de lucro francesa. No va ninguna foto ni ningún dato
 * tuyo, solo el número. Todo lo demás de la app sigue sin salir del teléfono.
 *
 * Su documentación pide que cada llamada corresponda a un escaneo real, que es
 * exactamente lo que hace esto: una consulta por producto, cuando tú la pides.
 */

import { traducirProducto, codigoValido, limpiarCodigo } from './motor.js';

const BASE = 'https://world.openfoodfacts.org/api/v2/product/';

/** Solo los campos que se usan: menos datos por el cable y respuesta más rápida. */
const CAMPOS = [
  'code', 'product_name', 'product_name_es', 'generic_name', 'generic_name_es',
  'brands', 'quantity', 'serving_quantity', 'categories_tags',
  'ingredients_text', 'ingredients_text_es', 'nutriments',
  'image_front_small_url', 'image_front_url', 'nutriscore_grade', 'nova_group',
].join(',');

const ESPERA_MAXIMA = 12000;

/**
 * Busca un producto. Nunca lanza: devuelve siempre un resultado explicado,
 * porque un fallo de red no debe romper la pantalla.
 */
export async function buscarPorCodigo(codigoCrudo) {
  const codigo = limpiarCodigo(codigoCrudo ?? '');

  if (!codigo) {
    return { ok: false, motivo: 'vacio', mensaje: 'Escribe el código de barras del producto.' };
  }
  if (!codigoValido(codigo)) {
    return {
      ok: false, motivo: 'invalido',
      mensaje: `"${codigo}" no parece un código de barras. Los de los productos europeos tienen 13 dígitos, o 8 en los envases pequeños.`,
    };
  }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      ok: false, motivo: 'sin_conexion',
      mensaje: 'No hay conexión. La búsqueda por código necesita internet; las otras dos vías, no.',
    };
  }

  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_MAXIMA);

  try {
    const resp = await fetch(`${BASE}${encodeURIComponent(codigo)}.json?fields=${CAMPOS}`, {
      signal: control.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(reloj);

    if (resp.status === 404) {
      return {
        ok: false, motivo: 'no_encontrado',
        mensaje: `El código ${codigo} no está en Open Food Facts. Es una base hecha por voluntarios y no lo tiene todo. Puedes analizarlo con una foto o escribiendo los datos.`,
      };
    }
    if (!resp.ok) {
      return {
        ok: false, motivo: 'servidor',
        mensaje: `La base ha respondido con un error (${resp.status}). Inténtalo más tarde o usa la foto.`,
      };
    }
    return traducirProducto(await resp.json(), codigo);
  } catch (err) {
    clearTimeout(reloj);
    if (err.name === 'AbortError') {
      return {
        ok: false, motivo: 'lento',
        mensaje: 'La base tarda demasiado en responder. Inténtalo de nuevo o usa la foto.',
      };
    }
    return {
      ok: false, motivo: 'red',
      mensaje: `No se ha podido consultar la base. ${err.message}. Las otras dos vías funcionan sin internet.`,
    };
  }
}
