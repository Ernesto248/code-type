export default {
  id: '05-createElement',
  title: 'Creando elementos con createElement',
  module: 'DOM Manipulation',
  theory: `## createElement

\`document.createElement()\` crea un nuevo elemento HTML en memoria. No aparece hasta que lo agregas al DOM.

### Sintaxis

~~~js
const elemento = document.createElement("etiqueta");
~~~

### Ejemplo completo

~~~js
const card = document.createElement("div");
card.className = "card";
card.textContent = "Nueva card";

const container = document.querySelector("#cards");
container.appendChild(card);
~~~

### appendChild vs append

- \`appendChild\`: agrega un solo nodo, lo devuelve
- \`append\`: permite varios nodos y texto, no devuelve nada
`,
  snippet: `// Crea una card con contenido dinámico
const container = document.querySelector("#cards");

for (let i = 0; i < 3; i++) {
  // Tu turno: crea un div, asígnale clase y texto
  █████████████████████████████████████████████████████████████████████████████████████████
  
  container.appendChild(card);
}`,
  answer: `const card = document.createElement("div");
card.className = "card";
card.textContent = "Card " + (i + 1)`,
  hint: 'Crea el div, asigna clase y texto',
  preview: '<div class="card">Card 1</div>',
  difficulty: 'medium',
  intro: 'Aprenderás a **crear elementos HTML desde cero** con createElement. Los creas en memoria, los configuras y luego los agregas al DOM.',
}
