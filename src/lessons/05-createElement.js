export default {
  id: '05-createElement',
  title: 'Creando elementos con createElement',
  module: 'DOM Manipulation',
  theory: `## createElement

\`document.createElement()\` crea un nuevo elemento HTML en memoria. No aparece en la página hasta que lo agregas al DOM con \`appendChild\` o \`append\`.

### Sintaxis

~~~js
const elemento = document.createElement("etiqueta");
~~~

### Ejemplo completo

~~~js
// Crear un párrafo
const parrafo = document.createElement("p");
parrafo.textContent = "Hola desde JS!";

// Agregarlo al body
document.body.appendChild(parrafo);
~~~

### appendChild vs append

- \`appendChild\`: agrega un solo nodo, devuelve el nodo
- \`append\`: permite múltiples nodos y texto, no devuelve nada

### Crear estructura completa

~~~js
const card = document.createElement("div");
card.className = "card";

const title = document.createElement("h2");
title.textContent = "Mi Card";
card.appendChild(title);
~~~
`,
  snippet: `// Crea un elemento <li>
const item = ███;

item.textContent = "Nuevo elemento";
document.querySelector("ul").appendChild(item);`,
  answer: `document.createElement("li")`,
  hint: 'Usa document.createElement con la etiqueta "li"',
  preview: '<li>Nuevo elemento</li>',
  difficulty: 'medium',
}
