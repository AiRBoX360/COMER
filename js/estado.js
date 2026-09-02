/**
 * Estado del análisis en curso.
 *
 * Vive fuera de las vistas para que la pantalla de revisión y la del resultado
 * miren lo mismo. No se guarda en el teléfono a propósito: un análisis a medias
 * no debe ensuciar la Despensa. Solo se guarda cuando se termina.
 */

export const enCurso = {
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
  enCurso.nombre = '';
  enCurso.categoria = 'general';
  enCurso.racionGramos = null;
  enCurso.nutrientes = {};
  enCurso.ingredientes = [];
  enCurso.trazas = [];
  enCurso.veredicto = null;
  enCurso.avisosLectura = [];
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
