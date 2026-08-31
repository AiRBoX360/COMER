import { NIVELES, esc, vacio } from '../ui.js';

export function despensa() {
  const bloques = NIVELES.slice().reverse().map((n) => `
    <div style="margin-top:24px">
      <div class="banda" style="margin-bottom:12px">
        <div class="banda__tramo es-actual" data-nivel="${n.clave}">${esc(n.texto)}</div>
      </div>
      <p class="texto" style="font-size:13px">Ningún producto todavía.</p>
    </div>`).join('');

  return `
    <h1 class="titulo">Despensa</h1>
    <p class="texto">Todo lo que has analizado, repartido en cinco bloques por color. Con su foto, para reconocerlo de un vistazo.</p>
    ${bloques}
    <div style="margin-top:32px">
      ${vacio('Aún no hay nada guardado', 'En cuanto analices tu primer producto aparecerá en el bloque que le corresponda.')}
    </div>
  `;
}
