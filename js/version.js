/**
 * La versión de la app, en su propio módulo.
 *
 * Vivía dentro de `app.js`, que es quien carga todas las pantallas. Cuando
 * Preferencias quiso enseñarla se formaba un círculo —app carga inicio, inicio
 * carga app— que funciona por los pelos y se rompe el día que alguien mueve una
 * línea. Un dato suelto no necesita arrastrar la aplicación entera detrás.
 */
export const VERSION = '4.63.0';
