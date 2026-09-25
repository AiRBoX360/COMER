import { COMBINACIONES, combinacionesEntre } from './motor.js';

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

  return { puedes: ordenar(puedes), faltaUno: ordenar(faltaUno), separar: ordenar(separar) };
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
  const porLados = new Set([...puedes, ...separar].map((c) => c.clave));

  return {
    coinciden: porParejas.size === porLados.size
      && [...porParejas].every((k) => porLados.has(k)),
    soloParejas: [...porParejas].filter((k) => !porLados.has(k)),
    soloLados: [...porLados].filter((k) => !porParejas.has(k)),
  };
}
