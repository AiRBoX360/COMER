/**
 * Estado del análisis en curso.
 *
 * Vive fuera de las vistas para que la pantalla de revisión y la del resultado
 * miren lo mismo. No se guarda en el teléfono a propósito: un análisis a medias
 * no debe ensuciar la Despensa. Solo se guarda cuando se termina.
 */

export const enCurso = {
  /** El código de barras, si vino de ahí. Sirve para detectar reformulaciones. */
  codigoBarras: null,
  /** La foto del envase que trae Open Food Facts, si la hay. */
  fotoUrl: null,
  /** Las categorías de Open Food Facts, para buscar alternativas parecidas. */
  categoriasTags: null,
  marca: null,
  tiendas: null,
  /** De dónde viene: origen, envasado y código sanitario. */
  procedencia: null,
  nombre: '',
  categoria: 'general',
  racionGramos: null,
  /** Cada campo es un Dato: valor, estado y confianza. */
  nutrientes: {},
  ingredientes: [],
  trazas: [],
  veredicto: null,
  /** Lo que dijo el analizador al leer, para poder enseñar sus avisos. */
  avisosLectura: [],
};

/**
 * ¿Hay algo cargado ahora mismo?
 * Sirve para poder enseñarlo en pantalla: un análisis a medias invisible es
 * justo lo que hace que los datos de un producto se cuelen en el siguiente.
 */
export function hayAlgoEnCurso() {
  return Object.keys(enCurso.nutrientes).length > 0 || enCurso.ingredientes.length > 0;
}

export function resumenEnCurso() {
  return {
    nombre: enCurso.nombre,
    campos: Object.keys(enCurso.nutrientes).length,
    ingredientes: enCurso.ingredientes.length,
  };
}

export function reiniciar() {
  // Se limpia TODO lo del análisis anterior.
  //
  // Faltaban cinco campos: el código de barras, la foto, la marca, las tiendas
  // y la procedencia. Al analizar otro producto se arrastraban los del
  // anterior, así que un pan tostado podía salir "procedente de Argentina"
  // porque ese era el origen del pistacho de antes.
  //
  // Si se añade un campo a `enCurso`, hay que añadirlo también aquí. Hay una
  // comprobación que lo vigila.
  for (const campo of Object.keys(enCurso)) {
    if (campo === 'categoria') { enCurso[campo] = 'general'; continue; }
    if (campo === 'nombre') { enCurso[campo] = ''; continue; }
    if (campo === 'nutrientes') { enCurso[campo] = {}; continue; }
    if (campo === 'ingredientes' || campo === 'trazas' || campo === 'avisosLectura') {
      enCurso[campo] = []; continue;
    }
    enCurso[campo] = null;
  }
}

/** Marca un valor como corregido a mano. Pasa a valer confianza plena. */
export function corregir(campo, valor) {
  if (valor === null || valor === '' || Number.isNaN(valor)) {
    delete enCurso.nutrientes[campo];
    return;
  }
  enCurso.nutrientes[campo] = { valor, estado: 'corregido' };
}

export const CAMPOS = [
  { clave: 'energia_kcal', nombre: 'Energía', unidad: 'kcal', obligatorio: true },
  { clave: 'grasas_g', nombre: 'Grasas', unidad: 'g', obligatorio: true },
  { clave: 'saturadas_g', nombre: 'de las cuales saturadas', unidad: 'g', obligatorio: true, sangrado: true },
  { clave: 'hidratos_g', nombre: 'Hidratos de carbono', unidad: 'g', obligatorio: true },
  { clave: 'azucares_g', nombre: 'de los cuales azúcares', unidad: 'g', obligatorio: true, sangrado: true },
  { clave: 'fibra_g', nombre: 'Fibra', unidad: 'g', obligatorio: false },
  { clave: 'proteinas_g', nombre: 'Proteínas', unidad: 'g', obligatorio: true },
  { clave: 'sal_g', nombre: 'Sal', unidad: 'g', obligatorio: true },
  { clave: 'energia_kj', nombre: 'Energía en kilojulios', unidad: 'kJ', obligatorio: false, secundario: true },
  { clave: 'sodio_mg', nombre: 'Sodio', unidad: 'mg', obligatorio: false, secundario: true },
  { clave: 'monoinsaturadas_g', nombre: 'Monoinsaturadas', unidad: 'g', obligatorio: false, secundario: true },
  { clave: 'poliinsaturadas_g', nombre: 'Poliinsaturadas', unidad: 'g', obligatorio: false, secundario: true },
  { clave: 'trans_g', nombre: 'Grasas trans', unidad: 'g', obligatorio: false, secundario: true },
  { clave: 'polialcoholes_g', nombre: 'Polialcoholes', unidad: 'g', obligatorio: false, secundario: true },
  { clave: 'fvl_porcentaje', nombre: '% de fruta, verdura o legumbre', unidad: '%', obligatorio: false, secundario: true },
];

export const CATEGORIAS = [
  { clave: 'general', nombre: 'Alimento general' },
  { clave: 'bebida', nombre: 'Bebida' },
  { clave: 'queso', nombre: 'Queso' },
  { clave: 'carne_roja', nombre: 'Carne roja' },
  { clave: 'grasa_anadida', nombre: 'Aceite, grasa o frutos secos' },
];


/**
 * Carga en el análisis en curso lo que trae Open Food Facts de un producto:
 * la foto, el código, las categorías, la marca, las tiendas y la procedencia.
 *
 * Una sola función para todas las vías. El escáner del súper tenía su propia
 * copia de esto y se le olvidaban la foto, el código y la procedencia: si
 * guardabas desde ahí, el producto llegaba a la Despensa sin foto.
 */
export function cargarDatosDeFuera(p, codigo = null) {
  const cod = p.codigo ?? codigo ?? null;
  enCurso.codigoBarras = cod;
  enCurso.fotoUrl = p.imagenUrl ?? null;
  enCurso.categoriasTags = p.categoriasTags ?? null;
  enCurso.marca = p.marca ?? null;
  enCurso.tiendas = p.tiendas ?? null;
  enCurso.procedencia = {
    origenes: p.origenes ?? null,
    envasado: p.envasado ?? null,
    codigosSanitarios: p.codigosSanitarios ?? null,
    codigoBarras: cod,
  };
}
