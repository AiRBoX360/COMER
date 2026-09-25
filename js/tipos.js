/**
 * Qué clase de alimento es: verdura, fruta, carne, pescado…
 *
 * OJO: esto NO es la `categoria` que usa el motor para puntuar. Son dos cosas
 * distintas y las dos son ciertas a la vez. El aceite de oliva es "grasa
 * añadida" para el Nutri-Score —y esa etiqueta le mueve la nota 17 puntos— y
 * es "aceites y grasas" para ordenar la despensa.
 *
 * Mezclarlas rompería el motor: un refresco puntuado como "alimento general"
 * saca 73, y como "bebida" saca 28.
 *
 * El tipo se deduce solo, del catálogo o del nombre, y se puede corregir a
 * mano en Revisar. En una tanda ciega de 44 nombres de supermercado que no se
 * usaron para ajustar las reglas: 42 aciertos. El 5 % restante es justo la
 * razón de que se pueda corregir.
 */

export const TIPOS = [
  { clave: 'verduras', nombre: 'Verduras y hortalizas' },
  { clave: 'frutas', nombre: 'Frutas' },
  { clave: 'carnes', nombre: 'Carnes' },
  { clave: 'pescados', nombre: 'Pescados y mariscos' },
  { clave: 'legumbres', nombre: 'Legumbres' },
  { clave: 'cereales', nombre: 'Pan y cereales' },
  { clave: 'lacteos', nombre: 'Lácteos' },
  { clave: 'huevos', nombre: 'Huevos' },
  { clave: 'frutos_secos', nombre: 'Frutos secos y semillas' },
  { clave: 'aceites', nombre: 'Aceites y grasas' },
  { clave: 'bebidas', nombre: 'Bebidas' },
  { clave: 'dulces', nombre: 'Dulces y aperitivos' },
  { clave: 'salsas', nombre: 'Salsas y condimentos' },
  { clave: 'preparados', nombre: 'Platos preparados' },
  { clave: 'otros', nombre: 'Otros' },
];

/** El nombre largo de un tipo, para enseñarlo. */
export function nombreDeTipo(clave) {
  return TIPOS.find((t) => t.clave === clave)?.nombre ?? 'Otros';
}

const sinTildes = (t) => String(t ?? '').toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Una raíz casa con su plural pero no con otra palabra que la contenga.
 *
 * Hace falta el sufijo explícito: sin él, "col" casaría con "colines" y los
 * picos de pan acabarían en la verdura.
 */
const raices = (...palabras) =>
  new RegExp(`\\b(${palabras.map(sinTildes).join('|')})(s|es|as|os|illa|illas|illo|illos)?\\b`, 'i');

/**
 * El ORDEN manda: un producto con dos cosas dentro cae en la primera regla que
 * encaja. Por eso los platos preparados van los primeros —nadie busca una
 * pizza de jamón en "carnes"— y las verduras van las últimas, porque casi
 * cualquier plato lleva alguna.
 */
const REGLAS = [
  ['preparados', raices('pizza', 'lasana', 'canelon', 'ensaladilla', 'croqueta',
    'empanada', 'empanadilla', 'paella', 'fideua', 'sandwich', 'bocadillo',
    'burrito', 'taco', 'nugget', 'san jacobo', 'flamenquin', 'cocido madrileno',
    'fabada', 'callos', 'crema', 'sopa', 'caldo', 'pure', 'salmorejo',
    'gazpacho', 'tortilla de patata', 'pisto', 'menestra', 'salteado',
    'wok', 'risotto', 'chili', 'curry', 'guiso', 'potaje')],

  ['bebidas', raices('agua', 'refresco', 'cola', 'gaseosa', 'tonica', 'zumo',
    'nectar', 'batido', 'horchata', 'cerveza', 'vino', 'sidra', 'vermut',
    'licor', 'infusion', 'te', 'cafe', 'bebida', 'smoothie', 'kombucha')],

  ['pescados', raices('atun', 'bonito', 'salmon', 'merluza', 'bacalao',
    'sardina', 'sardinilla', 'boqueron', 'anchoa', 'caballa', 'jurel', 'chicharro',
    'trucha', 'lubina', 'dorada', 'rape', 'lenguado', 'gallo', 'congrio',
    'panga', 'perca', 'tilapia', 'emperador', 'melva', 'palometa',
    'pez espada', 'gamba', 'langostino', 'cigala', 'mejillon', 'almeja',
    'berberecho', 'navaja', 'pulpo', 'calamar', 'sepia', 'chipiron',
    'chirla', 'vieira', 'zamburina', 'surimi', 'palito de mar',
    'palitos de mar', 'marisco', 'pescado', 'anillas', 'huevas')],

  ['carnes', raices('pollo', 'pavo', 'cerdo', 'ternera', 'vacuno', 'buey',
    'cordero', 'conejo', 'lomo', 'solomillo', 'chuleta', 'costilla',
    'pechuga', 'contramuslo', 'muslo', 'jamon', 'chorizo', 'salchichon',
    'salchicha', 'fuet', 'bacon', 'beicon', 'panceta', 'morcilla',
    'albondiga', 'hamburguesa', 'carne picada', 'pate', 'sobrasada',
    'cecina', 'longaniza', 'butifarra', 'mortadela', 'carne', 'embutido',
    'fiambre', 'secreto', 'presa', 'pluma', 'entrecot', 'escalope')],

  ['lacteos', raices('leche', 'yogur', 'yoghurt', 'queso', 'requeson',
    'cuajada', 'kefir', 'nata', 'mantequilla', 'mascarpone', 'mozzarella',
    'burrata', 'feta', 'parmesano', 'manchego', 'cheddar', 'gouda',
    'emmental', 'cuajo', 'petit suisse', 'natillas', 'flan')],

  ['legumbres', raices('lenteja', 'garbanzo', 'alubia', 'judia blanca',
    'judion', 'frijol', 'haba', 'soja', 'altramuz', 'chocho', 'edamame',
    'hummus', 'tofu', 'tempeh', 'seitan', 'legumbre', 'falafel')],

  ['frutos_secos', raices('almendra', 'nuez', 'nueces', 'avellana',
    'pistacho', 'cacahuete', 'anacardo', 'pinon', 'castana', 'macadamia',
    'pecana', 'sesamo', 'ajonjoli', 'tahini', 'chia', 'lino', 'linaza',
    'pipa', 'pipas', 'semilla', 'frutos secos')],

  ['aceites', raices('aceite', 'oliva virgen', 'manteca', 'margarina',
    'grasa vegetal', 'ghee')],

  ['dulces', raices('galleta', 'bizcocho', 'magdalena', 'croissant',
    'palmera', 'donut', 'rosquilla', 'chocolate', 'bombon', 'turron',
    'caramelo', 'gominola', 'chuche', 'helado', 'tarta', 'pastel',
    'mermelada', 'miel', 'azucar', 'cacao', 'crema de cacao', 'gofre',
    'patatas fritas', 'aperitivo', 'snack', 'nacho', 'palomita', 'gusanito',
    'cortezas')],

  ['salsas', raices('salsa', 'ketchup', 'mayonesa', 'mostaza', 'vinagre',
    'soja liquida', 'alioli', 'pesto', 'guacamole', 'sofrito', 'tomate frito',
    'especia', 'pimenton', 'oregano', 'albahaca', 'comino', 'curcuma',
    'azafran', 'canela', 'perejil', 'laurel', 'tomillo', 'romero',
    'sal', 'pimienta', 'caldo concentrado', 'pastilla de caldo')],

  ['cereales', raices('pan', 'picos', 'colin', 'regana', 'tostada', 'biscote',
    'harina', 'semola', 'pasta', 'espagueti', 'spaghetti', 'macarron',
    'fideo', 'helice', 'espiral', 'lazo', 'tallarin', 'noodle', 'noqui',
    'cuscus', 'bulgur', 'arroz', 'avena', 'copos', 'muesli', 'granola',
    'cereal', 'quinoa', 'espelta', 'centeno', 'trigo', 'maiz', 'wrap',
    'tortita', 'barrita', 'mijo', 'sarraceno', 'nido')],

  // Va detrás de cereales y dulces a propósito: "nidos al huevo" es pasta y
  // "bizcocho con huevo" es un dulce. Solo llega aquí lo que no es otra cosa.
  ['huevos', raices('huevo', 'clara de huevo', 'tortilla francesa')],

  ['frutas', raices('manzana', 'pera', 'platano', 'banana', 'naranja',
    'mandarina', 'clementina', 'limon', 'lima', 'pomelo', 'uva', 'fresa',
    'freson', 'frambuesa', 'mora', 'arandano', 'grosella', 'kiwi', 'pina',
    'mango', 'papaya', 'melocoton', 'nectarina', 'paraguayo', 'albaricoque',
    'ciruela', 'cereza', 'picota', 'higo', 'breva', 'granada', 'caqui',
    'nispero', 'chirimoya', 'membrillo', 'sandia', 'melon', 'aguacate',
    'coco', 'datil', 'pasa', 'orejon', 'macedonia', 'fruta', 'compota')],

  ['verduras', raices('tomate', 'lechuga', 'espinaca', 'acelga', 'brocoli',
    'coliflor', 'col', 'repollo', 'berza', 'grelo', 'nabo', 'zanahoria',
    'cebolla', 'cebolleta', 'puerro', 'ajo', 'pimiento', 'calabacin',
    'berenjena', 'calabaza', 'pepino', 'apio', 'alcachofa', 'esparrago',
    'cardo', 'borraja', 'judia verde', 'judias verdes', 'vaina', 'guisante',
    'champinon', 'seta', 'shiitake', 'portobello', 'patata', 'boniato',
    'batata', 'yuca', 'remolacha', 'rucula', 'canonigo', 'escarola',
    'endibia', 'endivia', 'berro', 'hinojo', 'ensalada', 'verdura',
    'hortaliza', 'alcaparra', 'aceituna', 'pepinillo', 'brote')],
];

/**
 * Las etiquetas de Open Food Facts, que son mucho más fiables que el nombre
 * cuando existen. Solo llegan si el producto vino por código de barras.
 */
const POR_TAG = [
  ['bebidas', /en:(beverages|waters|sodas|juices|non-alcoholic|alcoholic)/],
  ['preparados', /en:(meals|prepared|pizzas|soups|sandwiches)/],
  ['pescados', /en:(fishes|seafood|canned-fish|shellfish|molluscs|crustaceans)/],
  ['carnes', /en:(meats|poultry|chicken|pork|beef|charcuterie|sausages|hams|prepared-meats)/],
  ['huevos', /en:(eggs)/],
  ['lacteos', /en:(dairies|milks|yogurts|cheeses|creams|butters)/],
  ['legumbres', /en:(legumes|pulses|beans|lentils|chickpeas|soy|tofu)/],
  ['frutos_secos', /en:(nuts|seeds|nut-butters|dried-seeds)/],
  ['aceites', /en:(vegetable-oils|olive-oils|fats|margarine)/],
  ['dulces', /en:(sweet-snacks|chocolates|biscuits|confectioneries|ice-creams|jams|salty-snacks|crisps|appetizers)/],
  ['salsas', /en:(sauces|condiments|dressings|spices|seasonings|vinegars)/],
  ['cereales', /en:(cereals|breads|pastas|pasta|rice|flours|breakfast-cereals|viennoiserie|crackers|toasts)/],
  ['frutas', /en:(fruits|dried-fruits|fresh-fruits|canned-fruits|fruit-purees)/],
  ['verduras', /en:(vegetables|fresh-vegetables|canned-vegetables|frozen-vegetables|salads|legume-based-vegetables|olives|pickles)/],
];

/**
 * Deduce el tipo de un producto.
 *
 * Primero el catálogo, que sabe más; después el nombre. Si nada encaja, dice
 * "otros" en vez de adivinar: un tipo inventado es peor que ninguno, porque
 * manda el producto a un sitio donde nadie lo va a buscar.
 */
export function deducirTipo({ nombre, categoriasTags } = {}) {
  const tags = (categoriasTags ?? []).join(' ').toLowerCase();
  if (tags) {
    for (const [tipo, re] of POR_TAG) if (re.test(tags)) return tipo;
  }
  const texto = sinTildes(nombre);
  if (texto) {
    for (const [tipo, re] of REGLAS) if (re.test(texto)) return tipo;
  }
  return 'otros';
}

/**
 * El tipo de un producto ya guardado.
 *
 * Si se corrigió a mano, manda esa corrección. Si no, se deduce al vuelo: así
 * todo lo guardado antes de que esto existiera queda clasificado sin tener que
 * tocarlo uno a uno.
 */
export function tipoDe(p) {
  return p?.tipo ?? p?.entrada?.tipo ?? deducirTipo({
    nombre: p?.nombre,
    categoriasTags: p?.entrada?.categoriasTags,
  });
}
