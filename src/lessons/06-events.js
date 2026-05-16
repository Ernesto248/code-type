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
| \`"input"\` | Cambio en input |

### Ejemplo

~~~js
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  console.log(Object.fromEntries(data));
});
~~~
`,
  code: `const form = document.querySelector("#login");
const email = document.querySelector("#email");
const pass = document.querySelector("#password");
const submitBtn = document.querySelector("#submit");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!email.value || !pass.value) {
    alert("Completa todos los campos");
    return;
  }

  console.log("Email:", email.value);
  submitBtn.textContent = "Enviando...";
});`,
  hint: 'addEventListener + preventDefault + validación básica',
  difficulty: 'hard',
  intro: 'Nivel final del módulo: vas a **manejar eventos del DOM** con addEventListener, prevenir comportamientos por defecto y validar formularios.',
}
