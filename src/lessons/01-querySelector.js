export default {
  id: '01-querySelector',
  title: 'Seleccionando elementos con querySelector',
  module: 'DOM Manipulation',
  theory: `## querySelector

El método \`document.querySelector()\` devuelve el **primer elemento** del DOM que coincida con el selector CSS especificado.

Es el método más versátil para seleccionar elementos porque acepta cualquier selector CSS válido.

### Sintaxis básica

~~~js
document.querySelector(selector)
~~~

### Ejemplos de selectores

- \`#header\` → elemento con id "header"
- \`.nav-item\` → primer elemento con clase "nav-item"
- \`div\` → primer elemento <div>
- \`ul > li:first-child\` → primer li hijo directo de un ul

### Tips

- Es más lento que \`getElementById\` para IDs, pero más legible y consistente
- Siempre selecciona **un solo elemento** (el primero)
- Si no encuentra nada, devuelve \`null\`
`,
  snippet: `const header = document.querySelector("#header");
const navItem = document.querySelector(".nav-item");
const firstDiv = document.querySelector("div");

// Tu turno: selecciona el elemento con id "app"
const app = ███;`,
  answer: `document.querySelector("#app")`,
  hint: 'Usa querySelector con el selector "#app"',
  preview: 'Devuelve: <div id="app">...</div>',
  difficulty: 'easy',
}
