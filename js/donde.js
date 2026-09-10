/**
 * Dónde comprar un producto.
 *
 * Dos fuentes, y conviene no confundirlas:
 *
 *   1. Lo que declara Open Food Facts. Sus fichas tienen un campo de tiendas
 *      que rellena quien sube el producto. Cuando está, es información de
 *      primera mano. Pero está vacío muchas veces y puede quedarse viejo.
 *
 *   2. La marca. En España casi todas las cadenas tienen marca propia, y esa
 *      relación no cambia: si pone Hacendado, es Mercadona. Esto no depende de
 *      que nadie haya rellenado nada.
 *
 * La app dice de cuál de las dos viene, porque no merecen la misma confianza.
 */

/** Marcas propias de cada cadena. Si pone esto, es de ahí y punto. */
const MARCAS_PROPIAS = {
  mercadona: ['hacendado', 'deliplus', 'bosque verde', 'compy', 'steinburg'],
  carrefour: ['carrefour', 'carrefour bio', 'carrefour selección', 'carrefour classic'],
  lidl: ['lidl', 'milbona', 'freeway', 'pilos', 'cien', 'crivit', 'dulcesol lidl',
         'combino', 'baresa', 'italiamo', 'alesto', 'sondey'],
  alcampo: ['alcampo', 'auchan', 'produit blanc'],
  dia: ['dia', 'as', 'delicious', 'bonté', 'basic dia'],
  eroski: ['eroski', 'eroski basic', 'eroski sannia', 'eroski natur'],
  'el corte inglés': ['el corte inglés', 'aliada', 'hipercor'],
  aldi: ['aldi', 'milsani', 'gut bio', 'almare', 'cucina nobile'],
  consum: ['consum', 'consum basic'],
  ahorramas: ['ahorramas'],
};

const NOMBRE_BONITO = {
  mercadona: 'Mercadona', carrefour: 'Carrefour', lidl: 'Lidl',
  alcampo: 'Alcampo', dia: 'Dia', eroski: 'Eroski',
  'el corte inglés': 'El Corte Inglés', aldi: 'Aldi',
  consum: 'Consum', ahorramas: 'Ahorramás',
};

const limpiar = (t) =>
  String(t ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

/** Si la marca es de una cadena, devuelve cuál. */
export function cadenaDeLaMarca(marca) {
  const m = limpiar(marca);
  if (!m) return null;
  for (const [cadena, marcas] of Object.entries(MARCAS_PROPIAS)) {
    if (marcas.some((x) => {
      const p = limpiar(x);
      // Palabra completa: "dia" no puede casar dentro de "diamante".
      return new RegExp(`(^|[^a-z0-9])${p}([^a-z0-9]|$)`).test(m);
    })) return cadena;
  }
  return null;
}

/**
 * Dónde comprarlo, con la procedencia de cada dato.
 *
 * Devuelve `{ tiendas, origen }`. `origen` puede ser:
 *   'marca'      la marca es propia de una cadena: no falla
 *   'declarado'  alguien lo rellenó en Open Food Facts: puede estar viejo
 *   null         no se sabe, y se dice
 */
export function dondeComprarlo({ marca, tiendas } = {}) {
  const cadena = cadenaDeLaMarca(marca);
  if (cadena) {
    return { tiendas: [NOMBRE_BONITO[cadena]], origen: 'marca' };
  }

  const declaradas = (Array.isArray(tiendas) ? tiendas : String(tiendas ?? '').split(','))
    .map((t) => limpiar(String(t).replace(/^[a-z]{2}:/, '')))
    .filter(Boolean);

  if (declaradas.length === 0) return { tiendas: [], origen: null };

  // Se normaliza a los nombres que conocemos y se quitan repetidos.
  const vistas = new Set();
  const salida = [];
  for (const d of declaradas) {
    const conocida = Object.keys(NOMBRE_BONITO).find((c) => limpiar(c) === d || d.includes(limpiar(c)));
    const nombre = conocida ? NOMBRE_BONITO[conocida] : d.replace(/(^|\s)\S/g, (x) => x.toUpperCase());
    if (vistas.has(nombre)) continue;
    vistas.add(nombre);
    salida.push(nombre);
  }
  return { tiendas: salida.slice(0, 4), origen: 'declarado' };
}

/** Cómo se le cuenta a alguien, con su matiz de confianza. */
export function textoDondeComprarlo(donde) {
  if (!donde || donde.tiendas.length === 0) {
    return 'No consta dónde se vende. La marca no es de ninguna cadena conocida y nadie lo ha rellenado en Open Food Facts.';
  }
  const lista = donde.tiendas.join(', ');
  return donde.origen === 'marca'
    ? `${lista}. Es su marca propia, así que no falla.`
    : `${lista}. Lo ha rellenado alguien en Open Food Facts, así que puede estar desactualizado.`;
}
