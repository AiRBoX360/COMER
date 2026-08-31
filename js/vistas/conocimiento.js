import { vacio, pendiente } from '../ui.js';

export function conocimiento() {
  return `
    <h1 class="titulo">Saber</h1>
    <p class="texto">Un buscador de aditivos, nutrientes e ingredientes. Cada ficha con su explicación y su fuente, para que puedas comprobar de dónde sale cada afirmación.</p>

    <div style="margin-top:24px">
      ${vacio('Base de conocimiento vacía', 'Se llena en el módulo 2 con los aditivos del reglamento europeo, los alérgenos y los nutrientes.')}
    </div>

    <div style="margin-top:16px">
      ${pendiente('El motor de análisis ya distingue <b>150 aditivos</b> en cuatro niveles de riesgo. Lo que falta es la pantalla para consultarlos y ampliar la lista hasta los 330 del reglamento.')}
    </div>
  `;
}
