export default {
  id: '06-events',
  title: 'Escuchando eventos del DOM',
  module: 'DOM Manipulation',
  theory: `## addEventListener

Te permite **escuchar eventos** en elementos del DOM.

### Sintaxis

~~~js
elemento.addEventListener("evento", callback);
~~~

### Eventos comunes

| Evento | Descripción |
|--------|-------------|
| \`"click"\` | Clic del mouse |
| \`"submit"\` | Envío de formulario |
| \`"keydown"\` | Tecla presionada |
| \`"mouseover"\` | Mouse entra al elemento |
| \`"input"\` | Cambio en input |

### Ejemplo completo

~~~js
const form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  console.log(Object.fromEntries(data));
});
~~~
`,
  snippet: `// Valida un formulario antes de enviarlo
const form = document.querySelector("#login-form");
const email = document.querySelector("#email");
const pass = document.querySelector("#password");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Tu turno: valida que los campos no estén vacíos
  ███████████████████████████████████████████████████████████████████████████████████████
  
  if (!email.value || !pass.value) {
    alert("Completa todos los campos");
  } else {
    alert("Formulario válido!");
  }
});`,
  answer: `const emailVal = email.value.trim();
const passVal = pass.value.trim()`,
  hint: 'Obtén los valores con .value y .trim()',
  preview: 'Valida que email y password tengan contenido',
  difficulty: 'medium',
  intro: 'Aprenderás a **escuchar eventos del DOM** con addEventListener. Desde clics hasta formularios, los eventos son el corazón de la interactividad en la web.',
}
