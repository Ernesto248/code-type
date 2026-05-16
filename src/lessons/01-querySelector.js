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
- \`[data-type="card"]\` → primer elemento con ese atributo

### Tips

- Siempre devuelve **un solo elemento** (el primero)
- Si no encuentra nada, devuelve \`null\`
- Es más lento que \`getElementById\` para IDs, pero más legible
`,
  snippet: `// Selecciona el header y cambia su texto
const header = document.querySelector("header h1");
header.textContent = "Bienvenido!";

// Tu turno: selecciona #app
███████████████████████

const title = document.querySelector("#app h1");
console.log(title.textContent);`,
  answer: `const app = document.querySelector("#app")`,
  hint: 'Usa querySelector("#app")',
  preview: 'Selecciona el elemento con id "app"',
  difficulty: 'easy',
  intro: 'Vas a aprender a seleccionar elementos del DOM usando **querySelector**. Es el método más versátil para encontrar elementos en la página usando selectores CSS.',
}
