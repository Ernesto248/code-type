export default {
  id: '06-events',
  title: 'Escuchando eventos con addEventListener',
  module: 'DOM Manipulation',
  theory: `## addEventListener

El método \`addEventListener\` te permite **escuchar eventos** en elementos del DOM y ejecutar código cuando ocurren.

### Sintaxis

~~~js
elemento.addEventListener("evento", callback);
~~~

### Eventos comunes

| Evento | Descripción |
|--------|-------------|
| \`"click"\` | Cuando se hace clic |
| \`"mouseover"\` | Mouse entra al elemento |
| \`"keydown"\` | Tecla presionada |
| \`"submit"\` | Formulario enviado |
| \`"load"\` | Página cargada |

### Ejemplo

~~~js
const boton = document.querySelector("button");

boton.addEventListener("click", function() {
  alert("Me hiciste clic!");
});
~~~

### Arrow functions

Puedes usar arrow functions para más claridad:

~~~js
boton.addEventListener("click", () => {
  console.log("Clickeado!");
});
~~~
`,
  snippet: `const boton = document.querySelector("#btn");

// Agrega un evento click que muestre "Clickeado!" en consola
███████████████████████████████████████████████;`,
  answer: `boton.addEventListener("click", () => { console.log("Clickeado!"); })`,
  hint: 'Usa addEventListener("click", callback)',
  preview: 'click → "Clickeado!" en console',
  difficulty: 'medium',
}
