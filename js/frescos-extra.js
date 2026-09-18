/**
 * Más alimentos frescos.
 *
 * La lista de dentro del motor se quedó en 64 y faltaban cosas tan corrientes
 * como el limón, el mango o el albaricoque. Esta se suma a aquella sin tocarla.
 *
 * Valores por 100 g de porción comestible y en crudo, de tablas de composición
 * de alimentos. Sirven para situar el alimento, no para contar gramos: un
 * melocotón varía con la variedad y la madurez mucho más que un producto
 * envasado.
 */
export const FRESCOS_EXTRA = [
  // --- Fruta ---
  { nombre: 'Limón', busca: ['limon', 'limones', 'lima'], categoria: 'general',
    n: { kcal: 29, grasas: 0.3, saturadas: 0, hidratos: 9, azucares: 2.5, fibra: 2.8, proteinas: 1.1, sal: 0 },
    nota: 'Mucha vitamina C. Un chorro sobre las legumbres multiplica el hierro que absorbes.' },
  { nombre: 'Albaricoque', busca: ['albaricoque', 'albaricoques', 'damasco'], categoria: 'general',
    n: { kcal: 48, grasas: 0.4, saturadas: 0, hidratos: 9, azucares: 9, fibra: 2, proteinas: 1.4, sal: 0 },
    nota: 'Betacaroteno. Se aprovecha mucho mejor con algo de grasa al lado.' },
  { nombre: 'Mango', busca: ['mango', 'mangos'], categoria: 'general',
    n: { kcal: 60, grasas: 0.4, saturadas: 0.1, hidratos: 15, azucares: 14, fibra: 1.6, proteinas: 0.8, sal: 0 },
    nota: 'Vitamina C y betacaroteno. Bastante azúcar, pero con su fibra.' },
  { nombre: 'Cereza', busca: ['cereza', 'cerezas', 'picota'], categoria: 'general',
    n: { kcal: 63, grasas: 0.2, saturadas: 0.1, hidratos: 16, azucares: 13, fibra: 2.1, proteinas: 1.1, sal: 0 },
    nota: 'Antocianinas, lo que le da el color oscuro.' },
  { nombre: 'Higo', busca: ['higo', 'higos', 'breva'], categoria: 'general',
    n: { kcal: 74, grasas: 0.3, saturadas: 0.1, hidratos: 19, azucares: 16, fibra: 2.9, proteinas: 0.8, sal: 0 },
    nota: 'Calcio y fibra, y bastante azúcar.' },
  { nombre: 'Granada', busca: ['granada', 'granadas'], categoria: 'general',
    n: { kcal: 83, grasas: 1.2, saturadas: 0.1, hidratos: 19, azucares: 14, fibra: 4, proteinas: 1.7, sal: 0 },
    nota: 'Punicalaginas, de las frutas con más capacidad antioxidante medida.' },
  { nombre: 'Frambuesa', busca: ['frambuesa', 'frambuesas'], categoria: 'general',
    n: { kcal: 52, grasas: 0.7, saturadas: 0, hidratos: 12, azucares: 4.4, fibra: 6.5, proteinas: 1.2, sal: 0 },
    nota: 'Mucha fibra para lo poco que pesa.' },
  { nombre: 'Mora', busca: ['mora', 'moras'], categoria: 'general',
    n: { kcal: 43, grasas: 0.5, saturadas: 0, hidratos: 10, azucares: 4.9, fibra: 5.3, proteinas: 1.4, sal: 0 },
    nota: 'Fibra y antocianinas.' },
  { nombre: 'Caqui', busca: ['caqui', 'caquis', 'persimon'], categoria: 'general',
    n: { kcal: 70, grasas: 0.2, saturadas: 0, hidratos: 18, azucares: 13, fibra: 3.6, proteinas: 0.6, sal: 0 },
    nota: 'Betacaroteno y fibra.' },
  { nombre: 'Papaya', busca: ['papaya', 'papayas'], categoria: 'general',
    n: { kcal: 43, grasas: 0.3, saturadas: 0.1, hidratos: 11, azucares: 8, fibra: 1.7, proteinas: 0.5, sal: 0 },
    nota: 'Vitamina C y betacaroteno.' },
  { nombre: 'Pomelo', busca: ['pomelo', 'pomelos', 'toronja'], categoria: 'general',
    n: { kcal: 42, grasas: 0.1, saturadas: 0, hidratos: 11, azucares: 7, fibra: 1.6, proteinas: 0.8, sal: 0 },
    nota: 'Vitamina C. Puede interferir con algunos medicamentos: conviene preguntarlo.' },
  { nombre: 'Dátil', busca: ['datil', 'datiles'], categoria: 'general',
    n: { kcal: 282, grasas: 0.4, saturadas: 0, hidratos: 75, azucares: 63, fibra: 8, proteinas: 2.5, sal: 0 },
    nota: 'Muchísimo azúcar, aunque venga con fibra y potasio.' },

  // --- Verdura y hortaliza ---
  { nombre: 'Calabaza', busca: ['calabaza', 'calabazas'], categoria: 'general',
    n: { kcal: 26, grasas: 0.1, saturadas: 0.1, hidratos: 5, azucares: 2.8, fibra: 1.1, proteinas: 1, sal: 0 },
    nota: 'Betacaroteno. Con un chorro de aceite se aprovecha mucho más.' },
  { nombre: 'Puerro', busca: ['puerro', 'puerros'], categoria: 'general',
    n: { kcal: 61, grasas: 0.3, saturadas: 0, hidratos: 12, azucares: 3.9, fibra: 1.8, proteinas: 1.5, sal: 0 },
    nota: 'Fructanos, que alimentan a la microbiota.' },
  { nombre: 'Alcachofa', busca: ['alcachofa', 'alcachofas'], categoria: 'general',
    n: { kcal: 47, grasas: 0.2, saturadas: 0, hidratos: 6, azucares: 1, fibra: 5.4, proteinas: 3.3, sal: 0.1 },
    nota: 'De las verduras con más fibra fermentable.' },
  { nombre: 'Espárrago', busca: ['esparrago', 'esparragos', 'trigueros'], categoria: 'general',
    n: { kcal: 20, grasas: 0.1, saturadas: 0, hidratos: 2, azucares: 1.9, fibra: 2.1, proteinas: 2.2, sal: 0 },
    nota: 'Folato y fructanos.' },
  { nombre: 'Acelga', busca: ['acelga', 'acelgas'], categoria: 'general',
    n: { kcal: 19, grasas: 0.2, saturadas: 0, hidratos: 2.1, azucares: 1.1, fibra: 1.6, proteinas: 1.8, sal: 0.2 },
    nota: 'Vitamina K y magnesio. Su hierro se absorbe mucho mejor con vitamina C.' },
  { nombre: 'Col', busca: ['col', 'repollo', 'coles'], categoria: 'general',
    n: { kcal: 25, grasas: 0.1, saturadas: 0, hidratos: 4.1, azucares: 3.2, fibra: 2.5, proteinas: 1.3, sal: 0 },
    nota: 'Crucífera: al vapor y poco tiempo conserva mucho más sulforafano.' },
  { nombre: 'Coles de Bruselas', busca: ['coles de bruselas', 'bruselas'], categoria: 'general',
    n: { kcal: 43, grasas: 0.3, saturadas: 0.1, hidratos: 5, azucares: 2.2, fibra: 3.8, proteinas: 3.4, sal: 0 },
    nota: 'Crucífera con mucha vitamina C y K.' },
  { nombre: 'Rúcula', busca: ['rucula', 'rucola'], categoria: 'general',
    n: { kcal: 25, grasas: 0.7, saturadas: 0.1, hidratos: 2, azucares: 2, fibra: 1.6, proteinas: 2.6, sal: 0.1 },
    nota: 'Nitratos que ayudan a la circulación, y vitamina K.' },
  { nombre: 'Canónigos', busca: ['canonigos', 'canonigo'], categoria: 'general',
    n: { kcal: 21, grasas: 0.4, saturadas: 0, hidratos: 2, azucares: 0.7, fibra: 1.5, proteinas: 2, sal: 0 },
    nota: 'Folato y vitamina C.' },
  { nombre: 'Apio', busca: ['apio'], categoria: 'general',
    n: { kcal: 16, grasas: 0.2, saturadas: 0.1, hidratos: 3, azucares: 1.3, fibra: 1.6, proteinas: 0.7, sal: 0.2 },
    nota: 'Casi todo agua y fibra.' },
  { nombre: 'Pepino', busca: ['pepino', 'pepinos'], categoria: 'general',
    n: { kcal: 15, grasas: 0.1, saturadas: 0, hidratos: 3.6, azucares: 1.7, fibra: 0.5, proteinas: 0.7, sal: 0 },
    nota: 'Prácticamente agua.' },
  { nombre: 'Remolacha', busca: ['remolacha', 'remolachas'], categoria: 'general',
    n: { kcal: 43, grasas: 0.2, saturadas: 0, hidratos: 10, azucares: 7, fibra: 2.8, proteinas: 1.6, sal: 0.1 },
    nota: 'Nitratos que ayudan a la circulación, y folato.' },
  { nombre: 'Nabo', busca: ['nabo', 'nabos'], categoria: 'general',
    n: { kcal: 28, grasas: 0.1, saturadas: 0, hidratos: 6, azucares: 3.8, fibra: 1.8, proteinas: 0.9, sal: 0.1 },
    nota: 'Crucífera con poca energía.' },
  { nombre: 'Maíz dulce', busca: ['maiz', 'maiz dulce'], categoria: 'general',
    n: { kcal: 86, grasas: 1.2, saturadas: 0.2, hidratos: 19, azucares: 3.2, fibra: 2, proteinas: 3.3, sal: 0 },
    nota: 'Más almidón que el resto de verduras.' },
  { nombre: 'Setas', busca: ['seta', 'setas', 'shiitake', 'portobello'], categoria: 'general',
    n: { kcal: 34, grasas: 0.5, saturadas: 0.1, hidratos: 3.3, azucares: 2.4, fibra: 2.3, proteinas: 2.2, sal: 0 },
    nota: 'De lo poco vegetal con algo de vitamina D, sobre todo si les ha dado el sol.' },

  // --- Legumbre, cereal, fruto seco ---
  { nombre: 'Haba', busca: ['haba', 'habas'], categoria: 'general',
    n: { kcal: 88, grasas: 0.7, saturadas: 0.1, hidratos: 12, azucares: 2, fibra: 5.4, proteinas: 8, sal: 0 },
    nota: 'Proteína y folato.' },
  { nombre: 'Trigo sarraceno cocido', busca: ['trigo sarraceno', 'sarraceno', 'alforfon'], categoria: 'general',
    n: { kcal: 92, grasas: 0.6, saturadas: 0.1, hidratos: 20, azucares: 0.9, fibra: 2.7, proteinas: 3.4, sal: 0 },
    nota: 'Sin gluten y con un perfil de aminoácidos mejor que el de la mayoría de cereales.' },
  { nombre: 'Mijo cocido', busca: ['mijo'], categoria: 'general',
    n: { kcal: 119, grasas: 1, saturadas: 0.2, hidratos: 23, azucares: 0.1, fibra: 1.3, proteinas: 3.5, sal: 0 },
    nota: 'Sin gluten, con magnesio.' },
  { nombre: 'Anacardo', busca: ['anacardo', 'anacardos'], categoria: 'general',
    n: { kcal: 553, grasas: 44, saturadas: 8, monoinsaturadas: 24, hidratos: 30, azucares: 6, fibra: 3.3, proteinas: 18, sal: 0 },
    nota: 'Magnesio y zinc. Más hidratos que el resto de frutos secos.' },
  { nombre: 'Semilla de chía', busca: ['chia', 'semillas de chia'], categoria: 'general',
    n: { kcal: 486, grasas: 31, saturadas: 3.3, poliinsaturadas: 24, hidratos: 42, azucares: 0, fibra: 34, proteinas: 17, sal: 0 },
    nota: 'Muchísima fibra y omega-3 vegetal. Necesita agua para sentar bien.' },
  { nombre: 'Semilla de lino', busca: ['lino', 'linaza'], categoria: 'general',
    n: { kcal: 534, grasas: 42, saturadas: 3.7, poliinsaturadas: 29, hidratos: 29, azucares: 1.6, fibra: 27, proteinas: 18, sal: 0 },
    nota: 'Omega-3 vegetal. Molido se aprovecha; entero pasa de largo.' },
  { nombre: 'Pipa de calabaza', busca: ['pipa de calabaza', 'pipas de calabaza'], categoria: 'general',
    n: { kcal: 559, grasas: 49, saturadas: 8.7, hidratos: 11, azucares: 1.4, fibra: 6, proteinas: 30, sal: 0 },
    nota: 'De lo que más zinc y magnesio tiene.' },
  { nombre: 'Pipa de girasol', busca: ['pipa de girasol', 'pipas', 'girasol'], categoria: 'general',
    n: { kcal: 584, grasas: 51, saturadas: 4.5, hidratos: 20, azucares: 2.6, fibra: 8.6, proteinas: 21, sal: 0 },
    nota: 'Vitamina E. Ojo con las que vienen saladas.' },

  // --- Pescado y carne ---
  { nombre: 'Caballa', busca: ['caballa', 'verdel'], categoria: 'general',
    n: { kcal: 205, grasas: 14, saturadas: 3.3, poliinsaturadas: 3.4, hidratos: 0, azucares: 0, proteinas: 19, sal: 0.2 },
    nota: 'De los pescados con más omega-3 de cadena larga.' },
  { nombre: 'Trucha', busca: ['trucha', 'truchas'], categoria: 'general',
    n: { kcal: 148, grasas: 6.6, saturadas: 1.6, hidratos: 0, azucares: 0, proteinas: 21, sal: 0.1 },
    nota: 'Proteína y omega-3.' },
  { nombre: 'Lubina', busca: ['lubina', 'robalo'], categoria: 'general',
    n: { kcal: 97, grasas: 2, saturadas: 0.5, hidratos: 0, azucares: 0, proteinas: 19, sal: 0.2 },
    nota: 'Pescado blanco, proteína magra.' },
  { nombre: 'Dorada', busca: ['dorada', 'doradas'], categoria: 'general',
    n: { kcal: 109, grasas: 3.5, saturadas: 0.9, hidratos: 0, azucares: 0, proteinas: 19, sal: 0.2 },
    nota: 'Pescado blanco: proteína con muy poca grasa.' },
  { nombre: 'Pulpo', busca: ['pulpo'], categoria: 'general',
    n: { kcal: 82, grasas: 1, saturadas: 0.2, hidratos: 2.2, azucares: 0, proteinas: 15, sal: 0.6 },
    nota: 'Hierro y proteína, muy poca grasa.' },
  { nombre: 'Calamar', busca: ['calamar', 'calamares', 'chipiron'], categoria: 'general',
    n: { kcal: 92, grasas: 1.4, saturadas: 0.4, hidratos: 3.1, azucares: 0, proteinas: 16, sal: 0.1 },
    nota: 'Proteína con muy poca grasa, y algo de zinc.' },
  { nombre: 'Almeja', busca: ['almeja', 'almejas', 'berberecho'], categoria: 'general',
    n: { kcal: 74, grasas: 1, saturadas: 0.1, hidratos: 2.6, azucares: 0, proteinas: 13, sal: 1.4 },
    nota: 'De lo que más hierro y vitamina B12 tiene.' },
  { nombre: 'Conejo', busca: ['conejo'], categoria: 'general',
    n: { kcal: 136, grasas: 5.5, saturadas: 1.6, hidratos: 0, azucares: 0, proteinas: 20, sal: 0.1 },
    nota: 'De las carnes con menos grasa, y con buen aporte de proteína.' },
  { nombre: 'Muslo de pollo', busca: ['muslo de pollo', 'contramuslo', 'jamoncito'], categoria: 'general',
    n: { kcal: 172, grasas: 10, saturadas: 2.7, hidratos: 0, azucares: 0, proteinas: 19, sal: 0.1 },
    nota: 'Más grasa que la pechuga, y más hierro.' },
  { nombre: 'Cordero', busca: ['cordero', 'lechal'], categoria: 'general',
    n: { kcal: 258, grasas: 19, saturadas: 8.8, hidratos: 0, azucares: 0, proteinas: 21, sal: 0.1 },
    nota: 'Bastante grasa saturada.' },

  // --- Lácteo y otros ---
  { nombre: 'Queso fresco', busca: ['queso fresco', 'burgos', 'requeson'], categoria: 'general',
    n: { kcal: 98, grasas: 4.3, saturadas: 2.7, hidratos: 3.4, azucares: 3.4, proteinas: 11, sal: 0.4 },
    nota: 'Proteína y calcio con poca grasa para ser queso.' },
  { nombre: 'Kéfir', busca: ['kefir'], categoria: 'general',
    n: { kcal: 65, grasas: 3.5, saturadas: 2.3, hidratos: 4.5, azucares: 4.5, proteinas: 3.8, sal: 0.1 },
    nota: 'Fermentado. Con algo de fibra al lado, las bacterias llegan con qué comer.' },
  { nombre: 'Tofu', busca: ['tofu'], categoria: 'general',
    n: { kcal: 144, grasas: 9, saturadas: 1.3, hidratos: 2.8, azucares: 0.6, fibra: 2.3, proteinas: 15, sal: 0 },
    nota: 'Proteína vegetal. Con un cereal al lado completa los aminoácidos.' },
  { nombre: 'Miel', busca: ['miel'], categoria: 'general',
    n: { kcal: 304, grasas: 0, saturadas: 0, hidratos: 82, azucares: 82, proteinas: 0.3, sal: 0 },
    nota: 'Azúcar libre casi puro: para el cuerpo cuenta como azúcar añadido.' },
];

/** Busca en la lista de arriba, con y sin tildes y admitiendo plurales. */
export function buscarFrescoExtra(texto) {
  const limpio = String(texto ?? '').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').trim();
  if (limpio.length < 2) return [];
  return FRESCOS_EXTRA.filter((f) =>
    f.busca.some((b) => {
      const p = b.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return p.includes(limpio) || limpio.includes(p);
    }));
}

/**
 * Lo mediterráneo que faltaba.
 *
 * Mismo criterio que arriba: valores por 100 g de porción comestible, en
 * crudo salvo que se diga, de tablas de composición.
 *
 * Las especias van con su nota pero pesan poco en un plato: media cucharadita
 * de orégano no cambia una comida. Están para poder consultarlas, no para
 * analizarlas como si fueran un producto.
 */
export const FRESCOS_MEDITERRANEOS = [
  // --- Pescado y marisco ---
  { nombre: 'Anchoa en salazón', busca: ['anchoa', 'anchoas'], categoria: 'general',
    n: { kcal: 210, grasas: 10, saturadas: 2.2, hidratos: 0, azucares: 0, proteinas: 29, sal: 9.2 },
    nota: 'Omega-3 y calcio, pero muchísima sal: cuenta como ración pequeña.' },
  { nombre: 'Atún en aceite de oliva', busca: ['atun en aceite', 'atun en conserva', 'bonito'], categoria: 'general',
    n: { kcal: 186, grasas: 9, saturadas: 1.5, hidratos: 0, azucares: 0, proteinas: 25, sal: 0.9 },
    nota: 'Proteína y omega-3. Escurrido pierde parte del aceite añadido.' },
  { nombre: 'Bacalao en salazón', busca: ['bacalao salado', 'bacalao en salazon'], categoria: 'general',
    n: { kcal: 136, grasas: 1, saturadas: 0.2, hidratos: 0, azucares: 0, proteinas: 32, sal: 15 },
    nota: 'Sin desalar, la sal se dispara. Desalado baja a niveles normales.' },
  { nombre: 'Jurel', busca: ['jurel', 'chicharro'], categoria: 'general',
    n: { kcal: 144, grasas: 7, saturadas: 1.9, hidratos: 0, azucares: 0, proteinas: 20, sal: 0.2 },
    nota: 'Pescado azul barato, con omega-3 de cadena larga.' },
  { nombre: 'Rape', busca: ['rape'], categoria: 'general',
    n: { kcal: 76, grasas: 1.5, saturadas: 0.3, hidratos: 0, azucares: 0, proteinas: 15, sal: 0.2 },
    nota: 'Pescado blanco con muy poca grasa.' },
  { nombre: 'Lenguado', busca: ['lenguado', 'gallo'], categoria: 'general',
    n: { kcal: 91, grasas: 1.2, saturadas: 0.3, hidratos: 0, azucares: 0, proteinas: 19, sal: 0.3 },
    nota: 'Proteína magra, fácil de digerir.' },
  { nombre: 'Sepia', busca: ['sepia', 'choco', 'jibia'], categoria: 'general',
    n: { kcal: 79, grasas: 0.7, saturadas: 0.1, hidratos: 0.8, azucares: 0, proteinas: 16, sal: 0.4 },
    nota: 'Proteína con casi nada de grasa.' },
  { nombre: 'Langostino', busca: ['langostino', 'langostinos', 'cigala'], categoria: 'general',
    n: { kcal: 96, grasas: 1.5, saturadas: 0.3, hidratos: 0.2, azucares: 0, proteinas: 20, sal: 0.6 },
    nota: 'Proteína magra. El colesterol que tiene apenas afecta al de la sangre.' },

  // --- Encurtidos y conservas vegetales ---
  { nombre: 'Aceituna', busca: ['aceituna', 'aceitunas', 'oliva', 'olivas'], categoria: 'general',
    n: { kcal: 145, grasas: 15, saturadas: 2, monoinsaturadas: 11, hidratos: 3.8, azucares: 0.5, fibra: 3.3, proteinas: 1, sal: 3.3 },
    nota: 'Grasa buena y polifenoles, pero bastante sal por el encurtido.' },
  { nombre: 'Alcaparra', busca: ['alcaparra', 'alcaparras'], categoria: 'general',
    n: { kcal: 23, grasas: 0.9, saturadas: 0.2, hidratos: 4.9, azucares: 0.4, fibra: 3.2, proteinas: 2.4, sal: 7 },
    nota: 'Muchísima sal por el encurtido, aunque se use en poca cantidad.' },

  // --- Verdura y hoja ---
  { nombre: 'Escarola', busca: ['escarola', 'endibia', 'endivia'], categoria: 'general',
    n: { kcal: 17, grasas: 0.2, saturadas: 0, hidratos: 3.4, azucares: 0.3, fibra: 3.1, proteinas: 1.3, sal: 0 },
    nota: 'Amarga por los compuestos que ayudan a la digestión. Folato.' },
  { nombre: 'Berro', busca: ['berro', 'berros'], categoria: 'general',
    n: { kcal: 11, grasas: 0.1, saturadas: 0, hidratos: 1.3, azucares: 0.2, fibra: 0.5, proteinas: 2.3, sal: 0.1 },
    nota: 'Crucífera de hoja: vitamina K y sulforafano.' },
  { nombre: 'Hinojo', busca: ['hinojo'], categoria: 'general',
    n: { kcal: 31, grasas: 0.2, saturadas: 0, hidratos: 7, azucares: 3.9, fibra: 3.1, proteinas: 1.2, sal: 0.1 },
    nota: 'Fibra y potasio.' },
  { nombre: 'Cardo', busca: ['cardo', 'borraja'], categoria: 'general',
    n: { kcal: 20, grasas: 0.1, saturadas: 0, hidratos: 4.1, azucares: 0.8, fibra: 1.6, proteinas: 0.7, sal: 0.2 },
    nota: 'Verdura de invierno, casi todo agua y fibra.' },
  { nombre: 'Grelo', busca: ['grelo', 'grelos', 'nabiza'], categoria: 'general',
    n: { kcal: 32, grasas: 0.3, saturadas: 0.1, hidratos: 7, azucares: 0.8, fibra: 3.2, proteinas: 1.1, sal: 0 },
    nota: 'Crucífera con calcio y vitamina K.' },
  { nombre: 'Cebolleta', busca: ['cebolleta', 'cebollino', 'chalota'], categoria: 'general',
    n: { kcal: 32, grasas: 0.2, saturadas: 0, hidratos: 7, azucares: 2.3, fibra: 2.6, proteinas: 1.8, sal: 0 },
    nota: 'Compuestos azufrados que ayudan a absorber el hierro del plato.' },

  // --- Fruta ---
  { nombre: 'Níspero', busca: ['nispero', 'nisperos'], categoria: 'general',
    n: { kcal: 47, grasas: 0.2, saturadas: 0, hidratos: 12, azucares: 11, fibra: 1.7, proteinas: 0.4, sal: 0 },
    nota: 'Betacaroteno y potasio.' },
  { nombre: 'Chirimoya', busca: ['chirimoya', 'chirimoyas'], categoria: 'general',
    n: { kcal: 75, grasas: 0.7, saturadas: 0.2, hidratos: 18, azucares: 13, fibra: 3, proteinas: 1.6, sal: 0 },
    nota: 'Vitamina C y fibra, con bastante azúcar.' },
  { nombre: 'Membrillo', busca: ['membrillo'], categoria: 'general',
    n: { kcal: 57, grasas: 0.1, saturadas: 0, hidratos: 15, azucares: 9, fibra: 1.9, proteinas: 0.4, sal: 0 },
    nota: 'Crudo. El dulce de membrillo es otra cosa: azúcar casi puro.' },
  { nombre: 'Nectarina', busca: ['nectarina', 'nectarinas', 'paraguayo'], categoria: 'general',
    n: { kcal: 44, grasas: 0.3, saturadas: 0, hidratos: 11, azucares: 8, fibra: 1.7, proteinas: 1.1, sal: 0 },
    nota: 'Vitamina C y betacaroteno.' },
  { nombre: 'Uva pasa', busca: ['pasa', 'pasas', 'uva pasa'], categoria: 'general',
    n: { kcal: 299, grasas: 0.5, saturadas: 0.1, hidratos: 79, azucares: 59, fibra: 3.7, proteinas: 3.1, sal: 0 },
    nota: 'Al secarse el azúcar se concentra: una ración pequeña ya es mucho.' },
  { nombre: 'Orejón', busca: ['orejon', 'orejones', 'ciruela pasa'], categoria: 'general',
    n: { kcal: 241, grasas: 0.5, saturadas: 0, hidratos: 63, azucares: 53, fibra: 7.3, proteinas: 3.4, sal: 0 },
    nota: 'Mucha fibra y mucho azúcar concentrado.' },
  { nombre: 'Castaña', busca: ['castana', 'castanas'], categoria: 'general',
    n: { kcal: 196, grasas: 1.9, saturadas: 0.4, hidratos: 41, azucares: 8, fibra: 8, proteinas: 1.6, sal: 0 },
    nota: 'El fruto seco con menos grasa y más almidón: se parece más a un cereal.' },
  { nombre: 'Piñón', busca: ['pinon', 'pinones'], categoria: 'general',
    n: { kcal: 673, grasas: 68, saturadas: 4.9, monoinsaturadas: 19, hidratos: 13, azucares: 3.6, fibra: 3.7, proteinas: 14, sal: 0 },
    nota: 'Grasa buena, magnesio y zinc.' },
  { nombre: 'Sésamo', busca: ['sesamo', 'ajonjoli', 'tahini'], categoria: 'general',
    n: { kcal: 573, grasas: 50, saturadas: 7, hidratos: 23, azucares: 0.3, fibra: 12, proteinas: 18, sal: 0 },
    nota: 'De lo que más calcio tiene. Molido se aprovecha; entero pasa de largo.' },

  // --- Cereal y legumbre ---
  { nombre: 'Cuscús cocido', busca: ['cuscus', 'couscous'], categoria: 'general',
    n: { kcal: 112, grasas: 0.2, saturadas: 0, hidratos: 23, azucares: 0.1, fibra: 1.4, proteinas: 3.8, sal: 0 },
    nota: 'Sémola de trigo. Con legumbre al lado completa los aminoácidos.' },
  { nombre: 'Bulgur cocido', busca: ['bulgur', 'burghul'], categoria: 'general',
    n: { kcal: 83, grasas: 0.2, saturadas: 0, hidratos: 19, azucares: 0.1, fibra: 4.5, proteinas: 3.1, sal: 0 },
    nota: 'Trigo partido, con más fibra que el cuscús.' },
  { nombre: 'Espelta cocida', busca: ['espelta'], categoria: 'general',
    n: { kcal: 127, grasas: 0.9, saturadas: 0.1, hidratos: 26, azucares: 0.5, fibra: 3.9, proteinas: 5.5, sal: 0 },
    nota: 'Trigo antiguo. Tiene gluten, aunque se diga lo contrario.' },
  { nombre: 'Pan de centeno', busca: ['centeno', 'pan de centeno'], categoria: 'general',
    n: { kcal: 259, grasas: 3.3, saturadas: 0.6, hidratos: 48, azucares: 3.9, fibra: 5.8, proteinas: 9, sal: 1.1 },
    nota: 'Más fibra que el pan de trigo y sube menos el azúcar en sangre.' },
  { nombre: 'Altramuz', busca: ['altramuz', 'altramuces', 'chocho'], categoria: 'general',
    n: { kcal: 119, grasas: 2.9, saturadas: 0.3, hidratos: 10, azucares: 0.9, fibra: 2.8, proteinas: 16, sal: 2.4 },
    nota: 'Muchísima proteína vegetal, pero los de bote llevan mucha sal.' },
  { nombre: 'Tempeh', busca: ['tempeh'], categoria: 'general',
    n: { kcal: 192, grasas: 11, saturadas: 2.2, hidratos: 8, azucares: 2.7, fibra: 5, proteinas: 19, sal: 0 },
    nota: 'Soja fermentada: proteína completa y bacterias vivas.' },

  // --- Lácteo ---
  { nombre: 'Queso curado', busca: ['queso curado', 'manchego', 'parmesano'], categoria: 'general',
    n: { kcal: 398, grasas: 33, saturadas: 21, hidratos: 1.4, azucares: 0.5, proteinas: 25, sal: 1.8 },
    nota: 'Calcio y proteína, con mucha grasa saturada y sal. Ración pequeña.' },
  { nombre: 'Queso de cabra', busca: ['queso de cabra', 'rulo de cabra'], categoria: 'general',
    n: { kcal: 364, grasas: 30, saturadas: 21, hidratos: 2.5, azucares: 2.5, proteinas: 22, sal: 1.6 },
    nota: 'Parecido al curado de vaca en grasa y sal.' },
  { nombre: 'Mozzarella', busca: ['mozzarella', 'burrata'], categoria: 'general',
    n: { kcal: 280, grasas: 22, saturadas: 13, hidratos: 2.2, azucares: 1, proteinas: 18, sal: 1.2 },
    nota: 'Menos curado, algo menos de sal que un queso viejo.' },
  { nombre: 'Feta', busca: ['feta', 'queso feta'], categoria: 'general',
    n: { kcal: 264, grasas: 21, saturadas: 15, hidratos: 4.1, azucares: 4.1, proteinas: 14, sal: 3.5 },
    nota: 'Se conserva en salmuera: de los quesos con más sal.' },
  { nombre: 'Cuajada', busca: ['cuajada'], categoria: 'general',
    n: { kcal: 88, grasas: 4.8, saturadas: 3, hidratos: 5.8, azucares: 5.8, proteinas: 5.2, sal: 0.1 },
    nota: 'Calcio y proteína, poca sal.' },

  // --- Especias y hierbas ---
  { nombre: 'Perejil', busca: ['perejil'], categoria: 'general',
    n: { kcal: 36, grasas: 0.8, saturadas: 0.1, hidratos: 6.3, azucares: 0.9, fibra: 3.3, proteinas: 3, sal: 0.1 },
    nota: 'Mucha vitamina C y K, aunque se use en poca cantidad.' },
  { nombre: 'Albahaca', busca: ['albahaca'], categoria: 'general',
    n: { kcal: 23, grasas: 0.6, saturadas: 0, hidratos: 2.7, azucares: 0.3, fibra: 1.6, proteinas: 3.2, sal: 0 },
    nota: 'Aceites esenciales antioxidantes. Se usa en cantidades pequeñas.' },
  { nombre: 'Orégano seco', busca: ['oregano'], categoria: 'general',
    n: { kcal: 265, grasas: 4.3, saturadas: 1.6, hidratos: 69, azucares: 4.1, fibra: 43, proteinas: 9, sal: 0.1 },
    nota: 'Cifras por 100 g, pero se usa por pizcas: no mueve una comida.' },
  { nombre: 'Pimentón', busca: ['pimenton', 'paprika'], categoria: 'general',
    n: { kcal: 282, grasas: 13, saturadas: 2.1, hidratos: 54, azucares: 10, fibra: 35, proteinas: 14, sal: 0.1 },
    nota: 'Carotenoides, que se aprovechan con la grasa del sofrito.' },
  { nombre: 'Azafrán', busca: ['azafran'], categoria: 'general',
    n: { kcal: 310, grasas: 5.9, saturadas: 1.6, hidratos: 65, azucares: 0, fibra: 3.9, proteinas: 11, sal: 0.1 },
    nota: 'Se usa en hebras: su aporte al plato es prácticamente cero.' },
  { nombre: 'Cúrcuma', busca: ['curcuma'], categoria: 'general',
    n: { kcal: 312, grasas: 3.3, saturadas: 1.8, hidratos: 67, azucares: 3.2, fibra: 22, proteinas: 9.7, sal: 0 },
    nota: 'Su curcumina apenas se absorbe sola: con pimienta negra se multiplica.' },
  { nombre: 'Jengibre', busca: ['jengibre'], categoria: 'general',
    n: { kcal: 80, grasas: 0.8, saturadas: 0.2, hidratos: 18, azucares: 1.7, fibra: 2, proteinas: 1.8, sal: 0 },
    nota: 'Gingerol, que ayuda con las náuseas.' },
  { nombre: 'Canela', busca: ['canela'], categoria: 'general',
    n: { kcal: 247, grasas: 1.2, saturadas: 0.3, hidratos: 81, azucares: 2.2, fibra: 53, proteinas: 4, sal: 0 },
    nota: 'Se usa por pizcas. La de Ceilán es preferible a la cassia en cantidades altas.' },

  // --- Platos de la cocina de aquí ---
  { nombre: 'Gazpacho', busca: ['gazpacho'], categoria: 'general',
    n: { kcal: 45, grasas: 3, saturadas: 0.4, monoinsaturadas: 2.2, hidratos: 3.5, azucares: 2.8, fibra: 0.9, proteinas: 0.8, sal: 0.5 },
    nota: 'Licopeno del tomate con el aceite que lo transporta. El de bote suele llevar más sal.' },
  { nombre: 'Salmorejo', busca: ['salmorejo'], categoria: 'general',
    n: { kcal: 96, grasas: 7, saturadas: 1, monoinsaturadas: 5, hidratos: 6.5, azucares: 2.5, fibra: 1, proteinas: 1.5, sal: 0.6 },
    nota: 'Más denso que el gazpacho por el pan y el aceite.' },
  { nombre: 'Hummus', busca: ['hummus', 'humus'], categoria: 'general',
    n: { kcal: 166, grasas: 9.6, saturadas: 1.4, hidratos: 14, azucares: 0.3, fibra: 6, proteinas: 7.9, sal: 1.1 },
    nota: 'Garbanzo y sésamo: proteína vegetal, fibra y calcio.' },
  { nombre: 'Guacamole', busca: ['guacamole'], categoria: 'general',
    n: { kcal: 155, grasas: 14, saturadas: 2.1, monoinsaturadas: 10, hidratos: 4, azucares: 0.7, fibra: 5.5, proteinas: 2, sal: 0.4 },
    nota: 'Grasa buena del aguacate. El de bote puede llevar aditivos.' },
];

/** Busca en esta lista, sin tildes y admitiendo plurales. */
export function buscarMediterraneo(texto) {
  const limpio = String(texto ?? '').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').trim();
  if (limpio.length < 2) return [];
  return FRESCOS_MEDITERRANEOS.filter((f) =>
    f.busca.some((b) => {
      const p = b.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return p.includes(limpio) || limpio.includes(p);
    }));
}
