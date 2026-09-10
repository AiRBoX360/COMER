/**
 * Alternativas mejores buscadas en Open Food Facts.
 *
 * Hasta ahora la app decía "hay mejores" y se quedaba ahí, o proponía algo de
 * tu propia despensa. Eso solo sirve si ya habías analizado algo parecido.
 *
 * Su buscador permite pedir productos de una categoría vendidos en España. Lo
 * importante de cómo está hecho esto:
 *
 *   · Los candidatos se puntúan CON NUESTRO MOTOR. No se copia su nota ni su
 *     Nutri-Score: se les aplica el mismo criterio, los mismos topes y el
 *     mismo tratamiento de aditivos que a lo que escaneas tú. Si no, estaríamos
 *     recomendando con una vara de medir distinta de la que usamos para juzgar.
 *
 *   · Se descartan sin piedad los que llegan incompletos. Un producto del que
 *     no sabemos la mitad de la tabla no puede proponerse como alternativa:
 *     parecería mejor solo porque falta información.
 *
 *   · Si no hay conexión o el servidor no responde, no pasa nada. Las
 *     alternativas de tu despensa siguen funcionando sin internet.
 */

import { analizarProducto, traducirProducto } from './motor.js';
import { dondeComprarlo } from './donde.js';

const BUSCADOR = 'https://world.openfoodfacts.org/api/v2/search';
const ESPERA_MS = 9000;
/** Cuántos candidatos se piden. Más que esto es tardar sin ganar nada. */
const CANDIDATOS = 24;
/** Por debajo de esta mejora no es una alternativa: es lo mismo de otra marca. */
const MEJORA_MINIMA = 8;

const CAMPOS = [
  'code', 'product_name', 'product_name_es', 'brands', 'quantity',
  'categories_tags', 'ingredients_text', 'ingredients_text_es', 'nutriments',
  'image_front_small_url', 'nutriscore_grade', 'nova_group',
  // Dónde se vende. Lo rellena quien sube el producto, así que falta a
  // menudo; cuando falta, se deduce de la marca.
  'stores', 'stores_tags',
].join(',');

/**
 * La categoría con la que buscar.
 *
 * Se coge la MÁS específica que traiga el producto, porque es la que de verdad
 * define de qué se trata. Buscar por "alimentos de origen vegetal" devolvería
 * cualquier cosa; buscar por "patés de cerdo" devuelve patés.
 */
export function categoriaParaBuscar(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return null;
  const utiles = tags
    .map((t) => String(t))
    .filter((t) => t.startsWith('en:'))
    // Las genéricas no sirven para buscar: casan con medio catálogo.
    .filter((t) => !/plant-based-foods|beverages-and|groceries|foods$/.test(t));
  if (utiles.length === 0) return null;
  // Open Food Facts las ordena de general a específica.
  return utiles[utiles.length - 1];
}

/**
 * Busca alternativas mejores para un producto ya analizado.
 *
 * `actual` es lo que devuelve el motor, más la categoría de Open Food Facts.
 * Nunca lanza: sin conexión o con el servidor caído, devuelve lista vacía.
 */
export async function alternativasDeFuera(actual, limite = 3) {
  if (typeof actual?.puntuacion !== 'number') return [];
  if (!navigator.onLine) return [];

  const categoria = categoriaParaBuscar(actual.categoriasTags);
  if (!categoria) return [];

  const url = `${BUSCADOR}?categories_tags_en=${encodeURIComponent(categoria)}`
    + `&countries_tags_en=spain&sort_by=popularity_key`
    + `&page_size=${CANDIDATOS}&fields=${CAMPOS}`;

  let datos;
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_MS);
  try {
    const resp = await fetch(url, { signal: control.signal, headers: { Accept: 'application/json' } });
    if (!resp.ok) return [];
    datos = await resp.json();
  } catch {
    return [];
  } finally {
    clearTimeout(reloj);
  }

  const productos = Array.isArray(datos?.products) ? datos.products : [];
  const salida = [];

  for (const crudo of productos) {
    if (String(crudo.code) === String(actual.codigo)) continue;

    // Se reutiliza el mismo traductor que usa el escaneo: si a él le vale, a
    // esto también, y no hay dos formas distintas de leer sus datos.
    const t = traducirProducto({ status: 1, product: crudo }, String(crudo.code ?? ''));
    if (!t.ok) continue;

    const p = t.producto;
    // Sin la mitad de la tabla no se puede proponer: parecería mejor solo
    // porque falta información.
    if (p.faltan.length > 1) continue;
    if (!p.ingredientesTexto || p.ingredientesTexto.length < 12) continue;

    const v = analizarProducto({
      nombre: p.nombre, categoria: p.categoria,
      nutrientes: p.nutrientes,
      ingredientes: p.ingredientesTexto.split(',').map((x) => ({ texto: x.trim() })),
    });
    if (typeof v.puntuacion !== 'number') continue;
    if (v.puntuacion < actual.puntuacion + MEJORA_MINIMA) continue;

    salida.push({
      codigo: p.codigo,
      nombre: p.nombre,
      marca: p.marca ?? '',
      puntuacion: v.puntuacion,
      semaforo: v.semaforo,
      etiqueta: v.etiquetaSemaforo,
      mejora: v.puntuacion - actual.puntuacion,
      imagenUrl: p.imagenUrl ?? null,
      donde: dondeComprarlo({ marca: p.marca, tiendas: crudo.stores_tags ?? crudo.stores }),
      porQue: enQueMejora(actual, v),
    });
  }

  // De mejor a peor, y sin repetir marca: tres patés de la misma casa no son
  // tres alternativas.
  const vistas = new Set();
  return salida
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .filter((x) => {
      const marca = x.marca.toLowerCase();
      if (marca && vistas.has(marca)) return false;
      vistas.add(marca);
      return true;
    })
    .slice(0, limite);
}

/** En qué mejora, en palabras. Como mucho tres razones. */
function enQueMejora(peor, mejor) {
  const razones = [];
  const pesa = (v, id) => v.limitar?.find((f) => f.id === id)?.peso ?? 0;
  const ids = new Set([...(peor.limitar ?? []), ...(mejor.limitar ?? [])].map((f) => f.id));

  for (const id of ids) {
    const antes = pesa(peor, id);
    const ahora = pesa(mejor, id);
    if (antes - ahora < 25) continue;
    const f = (peor.limitar ?? []).find((x) => x.id === id);
    if (!f) continue;
    const nombre = f.nombre.split('·').pop().trim().toLowerCase();
    razones.push(ahora === 0 ? `sin ${nombre}` : `menos ${nombre}`);
  }

  const buenosDeEste = new Set((peor.favorables ?? []).map((f) => f.id));
  for (const f of mejor.favorables ?? []) {
    if (buenosDeEste.has(f.id) || f.peso < 45) continue;
    razones.push(f.nombre.split('·').pop().trim().toLowerCase());
  }

  if (razones.length === 0 && mejor.nova?.grupo < peor.nova?.grupo) {
    razones.push('menos procesado');
  }
  return razones.slice(0, 3);
}
