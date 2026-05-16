export default {
  id: '02-querySelectorAll',
  title: 'Seleccionando múltiples elementos con querySelectorAll',
  module: 'DOM Manipulation',
  theory: `## querySelectorAll

Mientras que \`querySelector\` devuelve **un solo elemento**, \`querySelectorAll\` devuelve **todos los elementos** que coincidan con el selector.

### Sintaxis

~~~js
document.querySelectorAll(selector)
~~~

### ¿Qué devuelve?

Devuelve una **NodeList** (similar a un array). Puedes iterarla con \`forEach\` o convertirla a array.

### Ejemplos

~~~js
// Todos los elementos con clase "item"
const items = document.querySelectorAll(".item");

// Todos los <li> dentro de un <ul>
const listItems = document.querySelectorAll("ul > li");

// Todos los inputs de tipo texto
const textInputs = document.querySelectorAll('input[type="text"]');
~~~

### Diferencia clave

| Método | Devuelve | Si no encuentra |
|--------|----------|----------------|
| querySelector | Un elemento (Node) | null |
| querySelectorAll | NodeList (vacía) | NodeList vacía |
`,
  snippet: `// Selecciona todos los elementos con clase "card"
const cards = ███;`,
  answer: `document.querySelectorAll(".card")`,
  hint: 'Usa querySelectorAll con el selector ".card"',
  preview: 'Devuelve: NodeList(3) [div.card, div.card, div.card]',
  difficulty: 'easy',
}
