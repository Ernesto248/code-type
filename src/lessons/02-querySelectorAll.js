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

### Iterar resultados

~~~js
const items = document.querySelectorAll(".item");
items.forEach(item => {
  item.classList.add("activo");
});
~~~

### Diferencia clave

| Método | Devuelve | Si no encuentra |
|--------|----------|----------------|
| querySelector | Un elemento (Node) | null |
| querySelectorAll | NodeList | NodeList vacía |
`,
  code: `const cards = document.querySelectorAll(".card");
const items = document.querySelectorAll(".nav-item");
const buttons = document.querySelectorAll("button");

cards.forEach((card, i) => {
  card.dataset.index = i;
  card.classList.add("card--loaded");
});

console.log("Total:", cards.length);`,
  hint: 'querySelectorAll devuelve una NodeList, itera con forEach',
  difficulty: 'easy',
  intro: 'Ahora aprenderás a seleccionar **múltiples elementos** con querySelectorAll y trabajar con colecciones.',
}
