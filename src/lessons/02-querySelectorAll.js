export default {
  id: '02-querySelectorAll',
  title: 'Múltiples elementos con querySelectorAll',
  module: 'DOM Manipulation',
  theory: `## querySelectorAll

\`querySelectorAll\` devuelve **todos los elementos** que coincidan con el selector, en forma de NodeList.

### Sintaxis

~~~js
document.querySelectorAll(selector)
~~~

### ¿Qué devuelve?

Una **NodeList** (similar a un array). Puedes iterarla con \`forEach\`:

~~~js
const items = document.querySelectorAll(".item");
items.forEach(item => {
  item.classList.add("activo");
});
~~~

### Diferencia clave con querySelector

| Método | Devuelve | Si no encuentra |
|--------|----------|----------------|
| querySelector | Un elemento (Node) | null |
| querySelectorAll | NodeList | NodeList vacía |
`,
  snippet: `// Selecciona todos los items del menú
// y a cada uno asígnale un data-index
const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach((item, i) => {
  item.dataset.index = i;
});

// Tu turno: selecciona todos los .card
███████████████████████████

cards.forEach(card => {
  card.style.display = "block";
});`,
  answer: `const cards = document.querySelectorAll(".card")`,
  hint: 'Usa querySelectorAll(".card")',
  preview: 'Devuelve: NodeList(3) [div.card, div.card, div.card]',
  difficulty: 'easy',
  intro: 'Ahora verás cómo seleccionar **múltiples elementos** a la vez con querySelectorAll. Perfecto para cuando necesitas trabajar con listas de elementos.',
}
