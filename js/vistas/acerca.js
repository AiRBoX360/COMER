import { esc } from '../ui.js';
import { CATALOGO, FUENTES, VERSION_ALGORITMO } from '../motor.js';

/**
 * Qué es y qué no es esta app.
 *
 * No es papeleo. La app dice "consumo ocasional" sobre comida y lista
 * alérgenos: quien la use tiene derecho a saber de dónde sale cada afirmación
 * y dónde acaba lo que puede sostener.
 *
 * La distinción de los tres niveles es la parte importante. Mezclar una cifra
 * de un reglamento europeo con una valoración escrita por mí, y presentar las
 * dos con la misma cara de certeza, sería la peor forma de mentir: sin decir
 * ninguna falsedad concreta.
 */
export function acerca() {
  const fuentes = [...FUENTES.values()].sort((a, b) => a.organismo.localeCompare(b.organismo, 'es'));

  return `
    <h1 class="titulo">Qué es y qué no es</h1>

    <div class="aviso-fuerte">
      <h2>Lo que esta app NO es</h2>
      <ul>
        <li><b>No sustituye a leer el envase.</b> Si tienes una alergia diagnosticada, lee siempre la etiqueta original. La detección de alérgenos de aquí es una ayuda de lectura y puede fallar: por una foto mal leída, por una traza no declarada o por un nombre poco habitual.</li>
        <li><b>No es consejo médico.</b> Si tienes diabetes, hipertensión, enfermedad renal, celiaquía o estás embarazada, lo que necesitas es a tu médico o a un dietista-nutricionista, no una nota del 0 al 100.</li>
        <li><b>No dice si un alimento es bueno o malo.</b> Dice cómo encaja en un patrón alimentario general. Un producto de nota baja no te hace daño por comerlo un día, y uno de nota alta no arregla una dieta mala.</li>
        <li><b>No conoce tu caso.</b> La nota es la misma para un deportista de veinte años y para alguien con el colesterol alto, y esas dos personas no necesitan lo mismo.</li>
      </ul>
    </div>

    <h2 class="subtitulo">De dónde sale cada cosa</h2>
    <p class="texto">Hay tres niveles distintos y conviene no confundirlos. Presentarlos todos con la misma cara de certeza sería la peor forma de engañarte: sin decir ninguna falsedad concreta.</p>

    <div class="nivel nivel--1">
      <h3>1 · Comprobado contra su fuente</h3>
      <p>El algoritmo Nutri-Score está validado contra los 15 casos de prueba oficiales de Santé publique France. O da los mismos números que ellos, o la app no se publica.</p>
    </div>

    <div class="nivel nivel--2">
      <h3>2 · Normativa que puedes comprobar</h3>
      <p>Qué campos son obligatorios en una etiqueta, los valores de referencia de nutrientes, los 14 alérgenos de declaración obligatoria, los umbrales de "fuente de" y "alto contenido en", y la numeración E de los aditivos. Todo sale de reglamentos europeos, y cada ficha lleva el enlace.</p>
    </div>

    <div class="nivel nivel--3">
      <h3>3 · Criterio de esta app</h3>
      <p>El nivel de riesgo de cada aditivo, cuánto pesa cada factor en la nota, y las fichas que explican los ingredientes. Se apoyan en nutrición establecida y en dictámenes de la EFSA y la OMS, pero <b>son una síntesis, no una cita</b>: no hay una fuente concreta detrás de cada número que leas en una ficha de ingrediente.</p>
      <p>Si algo de aquí te parece discutible, probablemente lo sea. Los pesos y los umbrales están todos en un único fichero del código, precisamente para poder cambiarlos.</p>
    </div>

    <h2 class="subtitulo">Cuando no se sabe algo, se dice</h2>
    <p class="texto">Es la regla que gobierna toda la app. Un dato que no aparece en la etiqueta no vale cero: vale desconocido, y no puntúa ni a favor ni en contra. Un ingrediente sin ficha se declara sin ficha. Si falta media tabla nutricional, no se da nota ninguna en vez de dar una inventada.</p>

    <h2 class="subtitulo">Tus datos</h2>
    <p class="texto">Todo lo que analizas vive en este teléfono y no sale de aquí. No hay servidor, ni cuentas, ni analítica. La única excepción es la búsqueda por código de barras: ahí viaja el número del producto a Open Food Facts, nada más. Ninguna foto sale nunca del teléfono.</p>
    <p class="texto">Como los datos viven solo aquí, el navegador puede borrarlos si al móvil le falta espacio. Hazte una copia de seguridad de vez en cuando desde la Despensa.</p>

    <h2 class="subtitulo">Las ${fuentes.length} fuentes que se citan</h2>
    <div class="fichas">
      ${fuentes.map((f) => `
        <details class="ficha ficha--neutro">
          <summary>
            <span class="ficha__titulo">${esc(f.organismo)}</span>
            <span class="ficha__sello">${f.anio}</span>
          </summary>
          <div class="ficha__cuerpo">
            <p class="ficha__linea">${esc(f.documento)}</p>
            <p class="ficha__linea"><b>Aporta.</b> ${esc(f.aporta)}</p>
            <p class="ficha__fuente"><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.url)}</a></p>
          </div>
        </details>`).join('')}
    </div>

    <p class="texto" style="margin-top:24px; font-size:0.85rem">
      Versión del criterio: ${esc(VERSION_ALGORITMO)} · ${CATALOGO.length} fichas en el catálogo.
      Cada veredicto guardado lleva grabada la versión con la que se calculó.
    </p>
  `;
}
