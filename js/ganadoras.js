import { COMBINACIONES, combinacionesEntre, FRESCOS,
         analizarProducto, frescoAEntrada } from './motor.js';
import { FRESCOS_EXTRA, FRESCOS_MEDITERRANEOS } from './frescos-extra.js';

/**
 * Las combinaciones ganadoras, no las parejas.
 *
 * La pantalla antigua pedía elegir alimentos y luego contaba qué pasaba. Con
 * la despensa llena eso era inmanejable: cien alimentos pintaban hasta
 * seiscientos puntos de color, y los colores solo llegaban a seis de las
 * veinte combinaciones, así que las otras catorce quedaban invisibles.
 *
 * Esto le da la vuelta: parte de las combinaciones, que son VEINTE Y FIJAS —
 * da igual que tengas veinte alimentos o quinientos— y para cada una dice qué
 * tienes tú que la cumple.
 *
 * Y no lista parejas, lista lados. "Hierro vegetal con vitamina C" con cien
 * alimentos son 121 parejas, pero solo 22 alimentos repartidos en dos
 * columnas: pon uno de estos con uno de estos. Medido sobre una despensa de
 * cien: de 524 parejas a 191 alimentos, un 64 % menos que leer.
 */

const sinTildes = (t) => String(t ?? '').toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * ¿Este alimento entra en esa lista de palabras?
 *
 * Imita el criterio del motor, deducido a base de probarlo: palabra entera,
 * admitiendo plural. "Lentejas cocidas" entra en "lenteja"; "lentejitas" no.
 *
 * El límite de palabra NO es un detalle: sin él, la palabra "te" —de la
 * combinación del té con el limón— casaba con "toma-TE" y con "acei-TE", y la
 * pantalla decía que el tomate estorba la absorción del hierro.
 *
 * Se imita en vez de llamar al motor para no recorrer todas las parejas, que
 * con cien alimentos son casi cinco mil. `comprobarContraElMotor`, aquí
 * abajo, vigila que los dos caminos sigan dando lo mismo.
 */
function entraEn(nombre, palabras) {
  const n = sinTildes(nombre);
  return (palabras ?? []).some((p) => {
    const limpia = sinTildes(p).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${limpia}(s|es)?\\b`).test(n);
  });
}

/**
 * Reparte los alimentos de una combinación en tres grupos.
 *
 * El tercero importa: un alimento puede cumplir LOS DOS lados —las espinacas
 * traen hierro y vitamina C— y pasa en catorce de diecisiete combinaciones.
 * Sin separarlo, la pantalla diría "espinacas con espinacas".
 */
function repartir(comb, nombres) {
  const soloA = [];
  const soloB = [];
  const ambos = [];
  for (const n of nombres) {
    const a = entraEn(n, comb.a);
    const b = entraEn(n, comb.b);
    if (a && b) ambos.push(n);
    else if (a) soloA.push(n);
    else if (b) soloB.push(n);
  }
  return { soloA, soloB, ambos };
}

/** Las de fuerza alta primero: importan más que las que tocan más alimentos. */
const PESO_FUERZA = { alta: 0, media: 1, baja: 2 };

/* --- Lo que no tienes pero también funcionaría ---------------------------
 *
 * Saber que el limón multiplica el hierro de tus lentejas no sirve de nada si
 * no tienes limón y nadie te lo dice. Estas son las sugerencias: alimentos del
 * catálogo de frescos que entran en la combinación y que NO están en tu
 * despensa.
 *
 * Van mezcladas en el mismo lado que las tuyas, detrás de ellas, con borde
 * punteado. El punteado ya significa "esto no lo tienes" en otros cinco sitios
 * de la app, no depende del color —se ve en los dos temas y con daltonismo— y
 * no choca con el amarillo, que en esta misma pantalla significa "te falta".
 */

const CATALOGO_FRESCOS = [...FRESCOS, ...FRESCOS_EXTRA, ...FRESCOS_MEDITERRANEOS];

/** Cuántas sugerencias por combinación, y cuántas como mucho de un solo lado. */
const CUANTAS_SUGERENCIAS = 5;
const TOPE_POR_LADO = 4;
/** Los que traen las dos cosas a la vez valen mucho, pero no deben acaparar. */
const TOPE_AMBOS = 2;

/** Palabras que no dan nombre a nada: "Atún EN aceite DE oliva". */
const VACIAS_RAIZ = new Set(['de', 'del', 'en', 'al', 'a', 'la', 'el', 'los',
  'las', 'con', 'sin', 'y', 'o', 'para']);

/**
 * La palabra que da nombre al alimento: "Atún en aceite de oliva" → "atun".
 *
 * Sirve para no sugerirte un atún en aceite cuando ya tienes atún al natural:
 * sus listas de búsqueda no se tocan, pero para juntarlo con algo es el mismo
 * alimento. Y para no poner "Nuez" y "Nuez de Brasil" en la misma fila.
 */
function raizDe(nombre) {
  const palabras = sinTildes(nombre).split(/[^a-zñ0-9]+/).filter(Boolean);
  return palabras.find((p) => !VACIAS_RAIZ.has(p)) ?? '';
}

let catalogoCache = null;

/**
 * Los frescos que entran en alguna sinergia, con su nota y cuántas desbloquean.
 *
 * Se calcula una sola vez: puntuar los 161 del catálogo cuesta 105 ms, y esta
 * pantalla se repinta a cada letra del buscador. Los 82 que no entran en
 * ninguna combinación ni se puntúan.
 */
function catalogoCandidatos() {
  if (catalogoCache) return catalogoCache;
  const sinergias = COMBINACIONES.filter((c) => c.clase === 'sinergia');
  catalogoCache = [];

  for (const f of CATALOGO_FRESCOS) {
    const lados = new Map();
    for (const c of sinergias) {
      const a = entraEn(f.nombre, c.a);
      const b = entraEn(f.nombre, c.b);
      if (a || b) lados.set(c.clave, { a, b });
    }
    if (lados.size === 0) continue;

    let nota = 0;
    try { nota = analizarProducto(frescoAEntrada(f)).puntuacion ?? 0; } catch { nota = 0; }

    catalogoCache.push({
      nombre: f.nombre,
      busca: f.busca ?? [f.nombre],
      nota,
      desbloquea: lados.size,
      lados,
    });
  }

  // El que más combinaciones desbloquea primero: el brócoli entra en siete, el
  // tomate y el atún en seis, y la media es 1,3. A igualdad manda la nota.
  catalogoCache.sort((x, y) => y.desbloquea - x.desbloquea
    || y.nota - x.nota
    || x.nombre.localeCompare(y.nombre, 'es'));
  return catalogoCache;
}

/**
 * Sugerencias para una combinación concreta.
 *
 * `usados` atraviesa toda la pantalla: si el brócoli ya salió en "hierro con
 * vitamina C", no vuelve a salir en las otras seis en las que entra. Repetirlo
 * siete veces daría la impresión de que el catálogo son cuatro alimentos.
 */
function sugerirPara(comb, tuyos, usados) {
  const sugA = [];
  const sugB = [];
  // Tres en todo el catálogo entran en los dos lados a la vez: la sardina
  // trae vitamina D y calcio. Sugerirla "para poner con el yogur" sería
  // mentir —el motor no la cuenta como pareja—, así que va a su grupo: sola
  // ya cumple.
  const sugAmbos = [];

  for (const cand of catalogoCandidatos()) {
    if (sugA.length + sugB.length + sugAmbos.length >= CUANTAS_SUGERENCIAS) break;
    const lado = cand.lados.get(comb.clave);
    if (!lado) continue;
    if (usados.has(cand.nombre)) continue;

    // Lo que ya tienes no se sugiere: si guardaste "Tomate pelado entero", el
    // tomate del catálogo sobra. Se mira por las dos vías porque ninguna basta
    // sola: la lista de búsqueda pilla los sinónimos ("bonito" es atún), y la
    // raíz pilla las variantes que no comparten lista ("Atún en aceite" no
    // busca por "atun" a secas).
    const raiz = raizDe(cand.nombre);
    if (raiz && usados.has(`raíz:${raiz}`)) continue;
    if (tuyos.todos.some((n) => entraEn(n, cand.busca)
      || (raiz && entraEn(n, [raiz])))) continue;

    let destino;
    let tope = TOPE_POR_LADO;
    if (lado.a && lado.b) { destino = sugAmbos; tope = TOPE_AMBOS; }
    else if (lado.a) destino = sugA;
    else if (lado.b) destino = sugB;
    else continue;

    if (destino.length >= tope) continue;
    destino.push(cand.nombre);
    usados.add(cand.nombre);
    if (raiz) usados.add(`raíz:${raiz}`);
  }

  return { sugA, sugB, sugAmbos };
}

/**
 * Qué puedes hacer con lo que tienes.
 *
 * Devuelve tres listas:
 *   · `puedes`  las que ya cumples, con sus alimentos repartidos
 *   · `faltaUno` las que tienes a medias, y qué lado te falta
 *   · `separar` las que conviene NO juntar, aparte de las buenas
 */
export function ganadoras(nombres) {
  const puedes = [];
  const faltaUno = [];
  const separar = [];

  for (const comb of COMBINACIONES) {
    const r = repartir(comb, nombres);
    // Se cumple si hay algo en los dos lados, o si un solo alimento trae las
    // dos cosas, o si hay uno de un lado y otro que trae ambas.
    const tieneA = r.soloA.length > 0 || r.ambos.length > 0;
    const tieneB = r.soloB.length > 0 || r.ambos.length > 0;
    const cumple = (r.soloA.length > 0 && r.soloB.length > 0)
      || r.ambos.length > 0;

    const ficha = { ...comb, ...r, cuantos: r.soloA.length + r.soloB.length + r.ambos.length };

    if (comb.clase !== 'sinergia') {
      // Los estorbos solo se avisan si de verdad los tienes los dos: decir
      // "no juntes X con Y" cuando no tienes ninguno es ruido.
      if (r.soloA.length > 0 && r.soloB.length > 0) separar.push(ficha);
      continue;
    }

    if (cumple) { puedes.push(ficha); continue; }

    // Te falta un lado entero. Es lo más accionable que hay: sabes
    // exactamente qué comprar para desbloquearla.
    if (tieneA !== tieneB) {
      faltaUno.push({ ...ficha, falta: tieneA ? 'b' : 'a',
        ejemplos: (tieneA ? comb.b : comb.a).slice(0, 5) });
    }
  }

  const ordenar = (lista) => lista.sort((x, y) =>
    (PESO_FUERZA[x.fuerza] ?? 1) - (PESO_FUERZA[y.fuerza] ?? 1)
    || y.cuantos - x.cuantos
    || x.titulo.localeCompare(y.titulo, 'es'));

  const listas = { puedes: ordenar(puedes), faltaUno: ordenar(faltaUno), separar: ordenar(separar) };

  // Las sugerencias se reparten YA ORDENADO, y compartiendo un solo cajón de
  // usados: así las primeras filas —las que más pesan— se llevan los mejores
  // alimentos, y ninguno se repite dos veces en la pantalla.
  //
  // Solo en las que puedes hacer ya. En "te falta una cosa" ya se dice qué
  // comprar, y en "conviene separar" sugerir sería contradecirse.
  const usados = new Set();
  for (const c of listas.puedes) {
    const tuyos = { soloA: c.soloA, soloB: c.soloB, ambos: c.ambos,
      todos: [...c.soloA, ...c.soloB, ...c.ambos, ...nombres] };
    const { sugA, sugB, sugAmbos } = sugerirPara(c, tuyos, usados);
    c.sugA = sugA;
    c.sugB = sugB;
    c.sugAmbos = sugAmbos;
  }
  for (const c of [...listas.faltaUno, ...listas.separar]) {
    c.sugA = []; c.sugB = []; c.sugAmbos = [];
  }

  return listas;
}

/**
 * Las combinaciones en las que entra un alimento concreto.
 *
 * Para el buscador: escribes "lentejas" y ves solo lo suyo, en vez de tener
 * que recorrer diecisiete filas.
 */
export function combinacionesDe(nombre) {
  return COMBINACIONES.filter((c) => entraEn(nombre, c.a) || entraEn(nombre, c.b))
    .map((c) => c.clave);
}

/**
 * Comprueba que repartir por lados da lo mismo que recorrer las parejas.
 *
 * Existe porque el reparto NO usa `combinacionesEntre`: lo imita para no
 * recorrer cinco mil parejas. Si el motor cambia cómo casa los nombres, esto
 * lo cantaría en vez de dejar la pantalla mintiendo en silencio.
 */
export function comprobarContraElMotor(nombres) {
  const porParejas = new Set();
  for (let i = 0; i < nombres.length; i += 1) {
    for (let j = i + 1; j < nombres.length; j += 1) {
      for (const c of combinacionesEntre([nombres[i], nombres[j]])) porParejas.add(c.clave);
    }
  }
  const { puedes, separar } = ganadoras(nombres);

  // Una divergencia conocida, y a propósito: el motor solo ve una combinación
  // entre DOS alimentos, uno de cada lado. Un alimento que trae las dos cosas
  // —la sardina con espina trae vitamina D y calcio— no la cumple para él ni
  // juntándolo con nada. Aquí sí se cuenta, porque es verdad y porque está en
  // sus propias listas: la sardina aparece en los dos lados a propósito.
  // Se aparta para que la comprobación siga sirviendo para lo que existe:
  // cazar un cambio de criterio del motor, no este caso sabido.
  const soloPorAmbos = puedes
    .filter((c) => c.ambos.length > 0 && (c.soloA.length === 0 || c.soloB.length === 0))
    .map((c) => c.clave);
  const porLados = new Set([...puedes, ...separar].map((c) => c.clave)
    .filter((k) => !soloPorAmbos.includes(k)));

  return {
    coinciden: porParejas.size === porLados.size
      && [...porParejas].every((k) => porLados.has(k)),
    soloParejas: [...porParejas].filter((k) => !porLados.has(k)),
    soloLados: [...porLados].filter((k) => !porParejas.has(k)),
    soloPorAmbos,
  };
}
