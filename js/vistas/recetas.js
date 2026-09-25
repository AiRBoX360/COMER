import { esc } from '../ui.js';
import { nombrePantalla } from './inicio.js';
import { nuevaSeleccion, cargarDespensa, nombresElegidos, selectorOrden,
         listaElegibles, campoExtras, engancharSeleccion } from '../elegirdespensa.js';

/**
 * Recetas: qué cocinar con lo que tienes.
 *
 * NO cuenta interacciones entre nutrientes. Para eso está "Qué juntar", que es
 * otra cosa. Las dos eran el mismo fichero con una variable que cambiaba la
 * cara, así que cada una acababa ofreciendo la otra.
 *
 * La app no sabe cocinar y no lo finge: una receta generada con plantillas
 * sería la parte más floja de todo el proyecto, y justo la que contradice que
 * aquí nada se inventa. Lo que hace es llevarte al buscador con tus
 * ingredientes ya escritos, a recetas de personas.
 */

let sel = nuevaSeleccion();

export function reiniciarRecetas() {
  sel = nuevaSeleccion();
}

export function recetas() {
  if (!sel.cargado) {
    return `
      ${nombrePantalla('recetas')}
      <p class="texto">Cargando tu despensa…</p>`;
  }

  const nombres = nombresElegidos(sel);

  return `
    ${nombrePantalla('recetas')}
    <p class="texto">Marca lo que tienes a mano y te llevo al buscador con tus ingredientes ya escritos. Las recetas son de personas, no mías.</p>

    <h2 class="rotulo">De tu despensa</h2>
    ${selectorOrden(sel)}
    ${listaElegibles(sel)}

    ${campoExtras(sel, 'Cosas que no tienes guardadas pero vas a comprar.')}

    ${nombres.length === 0 ? `
      <p class="texto" style="margin-top:24px">Elige algo de arriba para empezar.</p>` : `
      <div class="lo-elegido">
        <h2 class="rotulo">Vas a buscar con</h2>
        <p class="texto">${esc(nombres.join(', '))}</p>
      </div>
      <button class="boton-grande" id="btnBuscarRecetas" style="margin-top:12px">
        BUSCAR RECETAS CON ESTO
        <small>Abre el buscador con tus ingredientes. Sale de la app.</small>
      </button>`}

    <p class="apunte-via" style="margin-top:20px">Si lo que quieres saber es qué se potencia y qué se estorba entre estos alimentos, eso está en Qué juntar.</p>
  `;
}

export async function recetasActivo(raiz, { repintar }) {
  if (await cargarDespensa(sel)) { repintar(); return; }
  engancharSeleccion(raiz, sel, repintar);

  raiz.querySelector('#btnBuscarRecetas')?.addEventListener('click', () => {
    const nombres = nombresElegidos(sel);
    if (nombres.length === 0) return;
    // Se abre el buscador con los ingredientes escritos. La app no finge saber
    // cocinar: te lleva a quien sí sabe.
    const consulta = encodeURIComponent(`receta con ${nombres.join(' y ')}`);
    window.open(`https://duckduckgo.com/?q=${consulta}`, '_blank', 'noopener');
  });
}
