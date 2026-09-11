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


/* ===========================================================================
   DE DÓNDE VIENE
   ===========================================================================
   Open Food Facts guarda tres cosas distintas que la gente confunde, y que
   conviene separar porque no dicen lo mismo:

     · origen          de dónde salió la materia prima
     · lugar de envasado  dónde se procesó o se metió en el paquete
     · código sanitario   el registro del establecimiento, impreso en el óvalo

   Un tomate de origen Marruecos envasado en Murcia no es un tomate murciano, y
   la etiqueta permite distinguirlo. Nosotros también.

   Todo esto lo rellena quien sube el producto, así que falta a menudo. Cuando
   falta, se dice: inventarlo sería peor que no tenerlo.
   =========================================================================== */

const PAISES = {
  spain: 'España', france: 'Francia', portugal: 'Portugal', italy: 'Italia',
  germany: 'Alemania', 'united-kingdom': 'Reino Unido', morocco: 'Marruecos',
  netherlands: 'Países Bajos', belgium: 'Bélgica', poland: 'Polonia',
  china: 'China', peru: 'Perú', ecuador: 'Ecuador', argentina: 'Argentina',
  brazil: 'Brasil', chile: 'Chile', mexico: 'México', turkey: 'Turquía',
  thailand: 'Tailandia', vietnam: 'Vietnam', india: 'India', norway: 'Noruega',
  ireland: 'Irlanda', denmark: 'Dinamarca', greece: 'Grecia', 'united-states': 'Estados Unidos',
  'european-union': 'Unión Europea', 'non-eu': 'Fuera de la Unión Europea',
};

/**
 * El código sanitario español dice la provincia.
 *
 * Tiene la forma "ES 12.3456/AB CE": las dos primeras cifras son la provincia
 * donde está registrado el establecimiento. Es el dato más fiable de los tres,
 * porque va impreso en el envase por obligación legal y no lo rellena nadie a
 * mano.
 */
const PROVINCIAS = {
  '01': 'Álava', '02': 'Albacete', '03': 'Alicante', '04': 'Almería',
  '05': 'Ávila', '06': 'Badajoz', '07': 'Baleares', '08': 'Barcelona',
  '09': 'Burgos', '10': 'Cáceres', '11': 'Cádiz', '12': 'Castellón',
  '13': 'Ciudad Real', '14': 'Córdoba', '15': 'A Coruña', '16': 'Cuenca',
  '17': 'Girona', '18': 'Granada', '19': 'Guadalajara', '20': 'Gipuzkoa',
  '21': 'Huelva', '22': 'Huesca', '23': 'Jaén', '24': 'León', '25': 'Lleida',
  '26': 'La Rioja', '27': 'Lugo', '28': 'Madrid', '29': 'Málaga',
  '30': 'Murcia', '31': 'Navarra', '32': 'Ourense', '33': 'Asturias',
  '34': 'Palencia', '35': 'Las Palmas', '36': 'Pontevedra', '37': 'Salamanca',
  '38': 'Santa Cruz de Tenerife', '39': 'Cantabria', '40': 'Segovia',
  '41': 'Sevilla', '42': 'Soria', '43': 'Tarragona', '44': 'Teruel',
  '45': 'Toledo', '46': 'Valencia', '47': 'Valladolid', '48': 'Bizkaia',
  '49': 'Zamora', '50': 'Zaragoza', '51': 'Ceuta', '52': 'Melilla',
};

const bonito = (t) => {
  const limpio = limpiar(String(t).replace(/^[a-z]{2}:/, ''));
  if (PAISES[limpio]) return PAISES[limpio];
  return limpio.replace(/(^|[\s-])\S/g, (x) => x.toUpperCase()).replace(/-/g, ' ');
};

/** Saca la provincia de un código sanitario español. */
export function provinciaDelCodigo(codigo) {
  const m = String(codigo ?? '').match(/es\s*[- ]?\s*(\d{2})[.\s-]?\d{3,5}/i);
  return m ? (PROVINCIAS[m[1]] ?? null) : null;
}

/**
 * De dónde viene el producto, separando las tres cosas.
 *
 * Devuelve `{ origen, envasado, provincia }`. Cualquiera puede faltar.
 */
export function deDondeViene({ origenes, envasado, codigosSanitarios } = {}) {
  const lista = (x) => (Array.isArray(x) ? x : String(x ?? '').split(','))
    .map((t) => String(t).trim()).filter(Boolean);

  const origen = [...new Set(lista(origenes).map(bonito))].slice(0, 3);
  const lugares = [...new Set(lista(envasado).map(bonito))].slice(0, 2);

  let provincia = null;
  for (const c of lista(codigosSanitarios)) {
    provincia = provinciaDelCodigo(c);
    if (provincia) break;
  }
  return { origen, envasado: lugares, provincia };
}

/** Cómo se le cuenta a alguien. Cadena vacía si no se sabe nada. */
export function textoDeDondeViene(d) {
  if (!d) return '';
  const partes = [];
  if (d.origen.length) partes.push(`Procede de ${d.origen.join(', ')}`);
  if (d.provincia) partes.push(`envasado en ${d.provincia}, según su código sanitario`);
  else if (d.envasado.length) partes.push(`envasado en ${d.envasado.join(', ')}`);
  if (partes.length === 0) return '';
  return `${partes.join(' y ')}.`;
}
