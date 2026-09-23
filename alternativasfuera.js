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
const CANDIDATOS = 50;
/** Por debajo de esta mejora no es una alternativa: es lo mismo de otra marca. */
const MEJORA_MINIMA = 6;

/**
 * Por qué no hubo alternativas la última vez.
 *
 * Cuando algo no aparece hay que poder decir por qué. Sin esto, una consulta
 * mal formada se comportaba igual que "no hay nada mejor": la pantalla se
 * quedaba en blanco y nadie sabía si el fallo era del código o del catálogo.
 */
let ultimoMotivo = '';
export function porQueNoHayAlternativas() { return ultimoMotivo; }

/**
 * Qué se ha preguntado y qué ha contestado el catálogo.
 *
 * Sin esto, "no hay alternativas" puede significar cinco cosas distintas: que
 * el producto no trae categoría, que la categoría está vacía, que los
 * candidatos no mejoran, que les faltan datos o que la consulta está mal
 * formada. Ya pasó una vez: el parámetro estaba al revés y devolvía cero
 * siempre, y desde fuera se veía igual que "no hay nada mejor".
 */
const intentos = [];
const embudo = { candidatos: 0, sinDatos: 0, sinIngredientes: 0, noMejoran: 0, salen: 0 };
export function diagnosticoAlternativas() {
  return { intentos: [...intentos], ...embudo };
}

const CAMPOS = [
  'code', 'product_name', 'product_name_es', 'brands', 'quantity',
  'categories_tags', 'ingredients_text', 'ingredients_text_es', 'nutriments',
  'image_front_small_url', 'nutriscore_grade', 'nova_group',
  // Dónde se vende. Lo rellena quien sube el producto, así que falta a
  // menudo; cuando falta, se deduce de la marca.
  'stores', 'stores_tags',
].join(',');

/**
 * Las categorías con las que buscar, de la más concreta a la más general.
 *
 * Se devuelven VARIAS a propósito. La más concreta es la que mejor define el
 * producto, pero puede tener cuatro entradas en España y devolver nada. Si eso
 * pasa se prueba con la siguiente, que es más amplia. Antes se probaba solo
 * con una y, si fallaba, no había alternativas y nadie sabía por qué.
 */
export function categoriasParaBuscar(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return [];
  return tags
    .map((t) => String(t))
    .filter((t) => t.startsWith('en:'))
    // Las genéricas no sirven: casan con medio catálogo.
    .filter((t) => !/plant-based-foods|beverages-and|groceries|foods$/.test(t))
    // Open Food Facts las ordena de general a concreta: se invierte.
    .reverse()
    .slice(0, 3);
}

/** Compatibilidad con quien pedía una sola. */
export function categoriaParaBuscar(tags) {
  return categoriasParaBuscar(tags)[0] ?? null;
}

/**
 * Busca alternativas mejores para un producto ya analizado.
 *
 * `actual` es lo que devuelve el motor, más la categoría de Open Food Facts.
 * Nunca lanza: sin conexión o con el servidor caído, devuelve lista vacía.
 */
export async function alternativasDeFuera(actual, limite = 3) {
  if (typeof actual?.puntuacion !== 'number') return [];
  if (!navigator.onLine) { ultimoMotivo = 'sin conexión'; return []; }

  const categorias = categoriasParaBuscar(actual.categoriasTags);
  if (categorias.length === 0) {
    ultimoMotivo = 'este producto no trae categoría en Open Food Facts, así que no hay con qué comparar';
    return [];
  }

  // Se prueba de la categoría más concreta a la más amplia, y cada una primero
  // limitando a España y luego sin limitar.
  //
  // Lo de España descartaba productos que se venden aquí pero que nadie ha
  // etiquetado con el país. Como segunda pasada vale la pena: mejor una
  // alternativa de un catálogo más amplio que ninguna.
  let productos = [];
  intentos.length = 0;
  for (const categoria of categorias) {
    for (const soloEspana of [true, false]) {
      productos = await pedirCandidatos(categoria, soloEspana);
      intentos.push({ categoria, soloEspana, devueltos: productos.length });
      if (productos.length > 0) break;
    }
    if (productos.length > 0) break;
  }
  if (productos.length === 0) {
    ultimoMotivo = 'Open Food Facts no devuelve productos parecidos: '
      + intentos.map((i) => `${i.categoria}${i.soloEspana ? ' (España)' : ''} → 0`).join(', ');
    return [];
  }
  const salida = [];
  ultimoMotivo = '';
  Object.assign(embudo, { candidatos: productos.length, sinDatos: 0,
    sinIngredientes: 0, noMejoran: 0, salen: 0 });

  for (const crudo of productos) {
    if (String(crudo.code) === String(actual.codigo)) continue;

    // Se reutiliza el mismo traductor que usa el escaneo: si a él le vale, a
    // esto también, y no hay dos formas distintas de leer sus datos.
    const t = traducirProducto({ status: 1, product: crudo }, String(crudo.code ?? ''));
    if (!t.ok) continue;

    const p = t.producto;
    // Sin la mitad de la tabla no se puede proponer: parecería mejor solo
    // porque falta información.
    // Se admite que falten hasta dos campos. El motor ya pone un techo a la
    // nota cuando faltan datos, así que un producto incompleto no puede salir
    // artificialmente bien: no hace falta ser más estricto aquí, y siéndolo se
    // descartaban candidatos buenos.
    if (p.faltan.length > 2) { embudo.sinDatos += 1; continue; }
    if (!p.ingredientesTexto || p.ingredientesTexto.length < 12) { embudo.sinIngredientes += 1; continue; }

    const v = analizarProducto({
      nombre: p.nombre, categoria: p.categoria,
      nutrientes: p.nutrientes,
      ingredientes: p.ingredientesTexto.split(',').map((x) => ({ texto: x.trim() })),
    });
    if (typeof v.puntuacion !== 'number') continue;
    if (v.puntuacion < actual.puntuacion + MEJORA_MINIMA) { embudo.noMejoran += 1; continue; }

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

  embudo.salen = salida.length;
  if (salida.length === 0) {
    ultimoMotivo = `se han mirado ${productos.length} productos parecidos: `
      + `${embudo.sinDatos} con datos incompletos, ${embudo.sinIngredientes} sin lista de `
      + `ingredientes y ${embudo.noMejoran} que no mejoran lo bastante`;
  }

  // De mejor a peor, y sin repetir marca: tres patés de la misma casa no son
  // tres alternativas.
  // Hasta dos por marca. Antes era una, y con un catálogo donde media
  // categoría es de la misma casa eso dejaba fuera alternativas buenas.
  const porMarca = new Map();
  return salida
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .filter((x) => {
      const marca = x.marca.toLowerCase();
      if (!marca) return true;
      const n = (porMarca.get(marca) ?? 0) + 1;
      porMarca.set(marca, n);
      return n <= 2;
    })
    .slice(0, limite);
}

/**
 * Pide candidatos de una categoría.
 *
 * Los parámetros van con el prefijo de idioma DENTRO del valor
 * ("categories_tags=en:pates"), no en el nombre del parámetro. Estaba escrito
 * al revés ("categories_tags_en=en:pates"), que hace buscar una categoría
 * llamada literalmente "en:pates": no existe, así que devolvía cero productos
 * siempre y el bloque de alternativas no aparecía nunca.
 */
async function pedirCandidatos(categoria, soloEspana = true) {
  const url = `${BUSCADOR}?categories_tags=${encodeURIComponent(categoria)}`
    + (soloEspana ? `&countries_tags=${encodeURIComponent('en:spain')}` : '')
    + `&sort_by=popularity_key&page_size=${CANDIDATOS}&fields=${CAMPOS}`;

  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_MS);
  try {
    const resp = await fetch(url, { signal: control.signal, headers: { Accept: 'application/json' } });
    if (!resp.ok) return [];
    const datos = await resp.json();
    return Array.isArray(datos?.products) ? datos.products : [];
  } catch {
    return [];
  } finally {
    clearTimeout(reloj);
  }
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
