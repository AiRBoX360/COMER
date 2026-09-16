/**
 * Cuánto de este producto es mucho, y cuánto cunde.
 *
 * Dos preguntas, dos clases de referencia, y no significan lo mismo:
 *
 *   · LÍMITE   cuánto conviene NO pasar. Sal, azúcares libres, grasa saturada,
 *              y las ingestas diarias admisibles de los aditivos.
 *   · OBJETIVO cuánto conviene ALCANZAR. Proteína, fibra, y los nutrientes
 *              que la etiqueta declare.
 *
 * Con un límite, la app dice cuántas raciones harían falta para llegar a él.
 * Con un objetivo, cuántas para cubrirlo.
 *
 * LO QUE NO ESTÁ AQUÍ, Y POR QUÉ: cuánto tiempo hace falta para que algo cause
 * daño. Ese dato no existe en la literatura. Para el azúcar, la sal o la grasa
 * el riesgo es continuo y acumulativo, sin umbral. Para los cancerígenos, la
 * posición oficial es que no se ha establecido ninguno. Poner una cifra sería
 * inventarla.
 *
 * Y UN MATIZ QUE VA SIEMPRE, y que la pantalla escribe con estas palabras: la
 * ingesta admisible de un aditivo NO es donde empieza el daño. Se calcula cogiendo la dosis más alta sin ningún efecto
 * observado y dividiéndola entre cien. Es un margen de seguridad para toda la
 * vida, no una línea que al cruzarla pase algo.
 */

/** El adulto de referencia con el que se calcula. */
export const PESO_REFERENCIA = 70;

/**
 * Límites diarios de nutrientes.
 *
 * `fuente` es quién lo dice, y va escrito en la pantalla: sin fuente, un
 * número es una opinión.
 */
export const LIMITES = [
  { clave: 'sal_g', nombre: 'Sal', unidad: 'g', limite: 5,
    fuente: 'OMS', nota: 'menos de 5 g al día' },
  { clave: 'azucares_g', nombre: 'Azúcares', unidad: 'g', limite: 25,
    fuente: 'OMS', nota: 'menos de 25 g de azúcares libres, el objetivo estricto de la OMS' },
  { clave: 'saturadas_g', nombre: 'Grasas saturadas', unidad: 'g', limite: 22,
    fuente: 'EFSA', nota: 'menos del 10 % de 2.000 kcal' },
  { clave: 'trans_g', nombre: 'Grasas trans', unidad: 'g', limite: 2.2,
    fuente: 'OMS', nota: 'menos del 1 % de la energía. La OMS pide eliminarlas' },
  { clave: 'colesterol_mg', nombre: 'Colesterol', unidad: 'mg', limite: 300,
    fuente: 'Consenso clínico', nota: 'orientativo: hoy pesa más el tipo de grasa' },
];

/**
 * Valores de referencia de etiquetado, ni límite ni objetivo.
 *
 * Son los del reglamento 1169/2011, los que la industria usa para el "% de la
 * ingesta de referencia" de los envases. Sirven para situar una cifra, no para
 * decir si conviene pasarse o llegar: comer 2.000 kcal no es un objetivo ni un
 * tope, depende de cada persona.
 */
export const REFERENCIAS = [
  { clave: 'energia_kcal', nombre: 'Energía', unidad: 'kcal', referencia: 2000,
    fuente: 'Reglamento UE 1169/2011', nota: 'adulto medio; depende de cada persona' },
  { clave: 'grasas_g', nombre: 'Grasas totales', unidad: 'g', referencia: 70,
    fuente: 'Reglamento UE 1169/2011', nota: 'lo que importa es de qué tipo' },
  { clave: 'hidratos_g', nombre: 'Hidratos', unidad: 'g', referencia: 260,
    fuente: 'Reglamento UE 1169/2011', nota: 'lo que importa es cuánto es azúcar' },
];

/**
 * Objetivos diarios.
 *
 * De los valores de referencia de EFSA para un adulto. La proteína va por peso
 * corporal: 0,83 g por kilo y día.
 */
export const OBJETIVOS = [
  { clave: 'proteinas_g', nombre: 'Proteínas', unidad: 'g',
    objetivo: Math.round(0.83 * PESO_REFERENCIA),
    fuente: 'EFSA', nota: '0,83 g por kilo de peso y día' },
  { clave: 'fibra_g', nombre: 'Fibra', unidad: 'g', objetivo: 25,
    fuente: 'EFSA', nota: '25 g al día en adultos' },
  // Los que siguen solo aparecen si la etiqueta los declara, que es voluntario
  // salvo que el producto presuma de ellos.
  { clave: 'calcio_mg', nombre: 'Calcio', unidad: 'mg', objetivo: 950,
    fuente: 'EFSA', nota: '950 mg al día en adultos' },
  { clave: 'hierro_mg', nombre: 'Hierro', unidad: 'mg', objetivo: 11,
    fuente: 'EFSA', nota: '11 mg en hombres, 16 en mujeres con menstruación' },
  { clave: 'potasio_mg', nombre: 'Potasio', unidad: 'mg', objetivo: 3500,
    fuente: 'EFSA', nota: '3.500 mg al día en adultos' },
  { clave: 'magnesio_mg', nombre: 'Magnesio', unidad: 'mg', objetivo: 350,
    fuente: 'EFSA', nota: '350 mg en hombres, 300 en mujeres' },
  { clave: 'vitamina_c_mg', nombre: 'Vitamina C', unidad: 'mg', objetivo: 110,
    fuente: 'EFSA', nota: '110 mg en hombres, 95 en mujeres' },
  { clave: 'vitamina_d_ug', nombre: 'Vitamina D', unidad: 'µg', objetivo: 15,
    fuente: 'EFSA', nota: 'adulto, contando poca exposición al sol' },
  { clave: 'monoinsaturadas_g', nombre: 'Grasas monoinsaturadas', unidad: 'g', objetivo: 25,
    fuente: 'Orientativo', nota: 'no hay valor oficial; se usa un 11 % de la energía' },
  { clave: 'poliinsaturadas_g', nombre: 'Grasas poliinsaturadas', unidad: 'g', objetivo: 15,
    fuente: 'Orientativo', nota: 'no hay valor oficial; se usa un 7 % de la energía' },
];

/**
 * Ingestas diarias admisibles de aditivos, en mg por kilo de peso y día.
 *
 * `maxLegal` es lo que el reglamento 1333/2008 permite como mucho en bebidas
 * aromatizadas, en mg por litro. Hace falta porque LA ETIQUETA NO DICE CUÁNTO
 * ADITIVO LLEVA: solo que lo lleva. Con el máximo legal se calcula el peor
 * caso, y la pantalla lo dice así. El producto real llevará menos.
 */
export const IDA = {
  E950: { nombre: 'Acesulfamo K', ida: 9, maxLegal: 350 },
  E951: { nombre: 'Aspartamo', ida: 40, maxLegal: 600 },
  E952: { nombre: 'Ciclamato', ida: 7, maxLegal: 250 },
  E954: { nombre: 'Sacarina', ida: 9, maxLegal: 80 },
  E955: { nombre: 'Sucralosa', ida: 15, maxLegal: 300 },
  E960: { nombre: 'Glucósidos de esteviol', ida: 4, maxLegal: 80 },
  E211: { nombre: 'Benzoato sódico', ida: 5, maxLegal: 150 },
  E202: { nombre: 'Sorbato potásico', ida: 3, maxLegal: 300 },
  E102: { nombre: 'Tartrazina', ida: 7.5, maxLegal: 100 },
  E110: { nombre: 'Amarillo ocaso', ida: 4, maxLegal: 100 },
  E129: { nombre: 'Rojo allura', ida: 7, maxLegal: 100 },
  E621: { nombre: 'Glutamato monosódico', ida: 30, maxLegal: null },
  E320: { nombre: 'BHA', ida: 1, maxLegal: null },
  E321: { nombre: 'BHT', ida: 0.25, maxLegal: null },
};

/** Riesgos medidos en estudios de población, no calculados. */
export const RIESGOS = [
  {
    busca: /carne procesada|embutido|salchich|bacon|beicon|jam[oó]n cocido|chorizo|nitrito|E249|E250/i,
    titulo: 'Carne procesada',
    texto: '50 g al día se asocian a un 18 % más de riesgo de cáncer colorrectal. '
      + 'Sobre un riesgo base de 5 de cada 100 personas, eso lo lleva a 5,9.',
    fuente: 'OMS / Agencia Internacional para la Investigación del Cáncer, 2015',
  },
  {
    busca: /bebida azucarada|refresco|cola/i,
    titulo: 'Bebidas azucaradas',
    texto: 'Una ración diaria se asocia a más riesgo de diabetes tipo 2. El efecto '
      + 'se mide sobre años de consumo, no sobre días sueltos.',
    fuente: 'Revisiones de estudios de cohortes',
  },
];

const numero = (n) => (n === null || n === undefined ? null : Number(n.valor ?? n));

/**
 * Cuántas raciones de este producto para llegar a cada límite y objetivo.
 *
 * `racionGramos` es la ración declarada; si no la hay, se usan 100 g y se dice.
 */
export function cuantoHaceFalta(nutrientes, racionGramos = null) {
  const racion = racionGramos ?? 100;
  const factor = racion / 100;
  const filas = [];

  for (const l of LIMITES) {
    const por100 = numero(nutrientes?.[l.clave]);
    if (por100 === null || !(por100 > 0)) continue;
    const porRacion = por100 * factor;
    filas.push({
      clase: 'limite', nombre: l.nombre, unidad: l.unidad,
      porRacion: Math.round(porRacion * 10) / 10,
      referencia: l.limite, fuente: l.fuente, nota: l.nota,
      raciones: l.limite / porRacion,
      pct: Math.round((porRacion / l.limite) * 100),
    });
  }

  for (const r of REFERENCIAS) {
    const por100 = numero(nutrientes?.[r.clave]);
    if (por100 === null || !(por100 > 0)) continue;
    const porRacion = por100 * factor;
    filas.push({
      clase: 'referencia', nombre: r.nombre, unidad: r.unidad,
      porRacion: Math.round(porRacion * 10) / 10,
      referencia: r.referencia, fuente: r.fuente, nota: r.nota,
      raciones: r.referencia / porRacion,
      pct: Math.round((porRacion / r.referencia) * 100),
    });
  }

  for (const o of OBJETIVOS) {
    const por100 = numero(nutrientes?.[o.clave]);
    if (por100 === null || !(por100 > 0)) continue;
    const porRacion = por100 * factor;
    filas.push({
      clase: 'objetivo', nombre: o.nombre, unidad: o.unidad,
      porRacion: Math.round(porRacion * 10) / 10,
      referencia: o.objetivo, fuente: o.fuente, nota: o.nota,
      raciones: o.objetivo / porRacion,
      pct: Math.round((porRacion / o.objetivo) * 100),
    });
  }

  return { racion, esRacionDeclarada: racionGramos !== null, filas };
}

/**
 * Cuántas raciones para llegar a la ingesta admisible de cada aditivo.
 *
 * Solo para los que tienen máximo legal conocido en bebidas. Para lo demás no
 * se puede calcular sin saber la cantidad, y no se inventa.
 */
export function cuantoDeAditivos(codigosE, mililitrosRacion = 330, peso = PESO_REFERENCIA) {
  const salida = [];
  for (const codigo of codigosE ?? []) {
    const d = IDA[String(codigo).toUpperCase()];
    if (!d || !d.maxLegal) continue;
    const porRacion = d.maxLegal * (mililitrosRacion / 1000);
    const admisible = d.ida * peso;
    salida.push({
      codigo, nombre: d.nombre,
      admisible: Math.round(admisible),
      porRacion: Math.round(porRacion),
      raciones: admisible / porRacion,
    });
  }
  return salida.sort((a, b) => a.raciones - b.raciones);
}

/** El riesgo medido que aplique, si alguno. */
export function riesgoMedido(texto) {
  return RIESGOS.find((r) => r.busca.test(String(texto ?? ''))) ?? null;
}
