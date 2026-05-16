export default {
  id: '01-querySelector',
  title: 'Seleccionando elementos con querySelector',
  module: 'DOM Manipulation',
  theory: `## querySelector

El método \`document.querySelector()\` devuelve el **primer elemento** del DOM que coincida con el selector CSS especificado.

### Sintaxis básica

~~~js
document.querySelector(selector)
~~~

### Selectores comunes

- \`#header\` → elemento con id "header"
- \`.nav-item\` → primer elemento con clase "nav-item"
- \`div\` → primer elemento <div>

### Tips

- Siempre devuelve **un solo elemento** (el primero)
- Si no encuentra nada, devuelve \`null\`
- Es más lento que \`getElementById\` para IDs, pero más legible
`,
  code: `const header = document.querySelector("header");
const title = document.querySelector("#title");
const firstLink = document.querySelector("nav a");
const sidebar = document.querySelector(".sidebar");

title.textContent = "Hola DOM!";
sidebar.classList.add("activo");`,
  hint: 'querySelector acepta cualquier selector CSS',
  difficulty: 'easy',
  intro: 'En este nivel escribirás tu primer código DOM: seleccionar elementos con **querySelector** y manipularlos.',
}
