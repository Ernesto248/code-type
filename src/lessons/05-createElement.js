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
container.appendChild(card);
~~~

### appendChild vs append

- \`appendChild\`: agrega un solo nodo, lo devuelve
- \`append\`: permite varios nodos y texto
`,
  code: `const list = document.querySelector("#todo-list");
const items = ["Estudiar", "Codear", "Repasar"];

items.forEach(function (task) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.textContent = task;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✕";
  li.appendChild(deleteBtn);

  list.appendChild(li);
});`,
  hint: 'createElement + className + textContent + appendChild',
  difficulty: 'medium',
  intro: 'En este nivel vas a **crear elementos HTML desde cero** con createElement y agregarlos al DOM.',
}
