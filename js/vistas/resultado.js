import { banda, marcador, esc, pendiente } from '../ui.js';

/**
 * Muestra de diseño.
 *
 * Las cifras de abajo NO están inventadas: salen de ejecutar el motor real
 * sobre la etiqueta de una crema de cacao con avellanas. Lo que falta es
 * conectar el motor a esta pantalla, que es el módulo 1.
 */
const MUESTRA = {
  nombre: 'Crema de cacao con avellanas',
  nota: 24,
  nutriScore: 'E',
  nova: 4,
  confianza: 92,
  porQue: 'Más de la mitad del producto es azúcar añadido y el segundo ingrediente es aceite de palma. Ni el cacao ni las avellanas compensan eso.',
  limitar: [
    { n: 'Azúcares añadidos', s: 97, d: '56,3 g / 100 g', m: 'Es el primer ingrediente de la lista, así que es lo que más pesa del bote. La OMS recomienda no pasar de 25 g al día.' },
    { n: 'Grasas saturadas', s: 93, d: '10,6 g / 100 g', m: 'Elevan el colesterol LDL. Las guías recomiendan quedarse por debajo de 22 g al día.' },
    { n: 'Aceite de palma', s: 68, d: 'posición 2 de la lista', m: 'Cerca del 50 % de grasa saturada. Su refinado genera contaminantes de proceso vigilados por la EFSA.' },
    { n: 'Ultraprocesado (NOVA 4)', s: 64, d: '4 marcadores industriales', m: 'Formulación con sustancias que no existen en una cocina. Se asocia a peores resultados de salud incluso ajustando por composición.' },
  ],
  mejor: [
    { n: 'Bajo en sal', s: 56, d: '0,1 g / 100 g', m: 'Por debajo de 0,3 g/100 g la UE permite declararlo bajo en sal.' },
    { n: 'Proteínas', s: 35, d: '6,3 g / 100 g', m: 'Aporta algo de proteína, procedente sobre todo de la leche en polvo y las avellanas.' },
    { n: 'Cacao', s: 35, d: '7,4 %, posición 5', m: 'Flavanoles con efecto vascular, siempre que no vengan sepultados en azúcar. Aquí vienen sepultados.' },
  ],
};

function filaFactor(f, signo) {
  return `
    <div class="factor factor--${signo}">
      <div class="factor__cab">
        <span class="factor__nombre">${esc(f.n)}</span>
        <span class="factor__peso cifra">${f.s}</span>
      </div>
      <div class="factor__medida"><i style="width:${f.s}%"></i></div>
      <p class="factor__dato cifra">${esc(f.d)}</p>
      <p class="factor__motivo">${esc(f.m)}</p>
    </div>`;
}

export function resultado() {
  const p = MUESTRA;
  return `
    <div style="margin-bottom:24px">
      ${pendiente('<b>Muestra de diseño.</b> Las cifras salen de ejecutar el motor real sobre una etiqueta de verdad, pero esta pantalla todavía no está conectada a él. Sirve para que veas cómo se leerá un veredicto.')}
    </div>

    <h2 class="rotulo">Producto analizado</h2>
    <h1 class="titulo">${esc(p.nombre)}</h1>

    ${marcador(p.nota)}
    ${banda(p.nota)}

    <div class="resumen">
      <div><b class="cifra">${p.nutriScore}</b><span>Nutri-Score</span></div>
      <div><b class="cifra">${p.nova}</b><span>Grado NOVA</span></div>
      <div><b class="cifra">${p.confianza}%</b><span>Confianza</span></div>
    </div>

    <h2 class="subtitulo">¿Por qué esta nota?</h2>
    <p class="texto">${esc(p.porQue)}</p>

    <h2 class="subtitulo">Lo que conviene limitar</h2>
    <p class="texto" style="font-size:13px">Ordenado de más a menos relevante.</p>
    ${p.limitar.map((f) => filaFactor(f, 'malo')).join('')}

    <h2 class="subtitulo">Lo mejor del producto</h2>
    <p class="texto" style="font-size:13px">Ordenado de más a menos relevante.</p>
    ${p.mejor.map((f) => filaFactor(f, 'bueno')).join('')}
  `;
}
