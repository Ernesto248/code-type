export default {
  id: '04-classList',
  title: 'Manipulando clases CSS con classList',
  module: 'DOM Manipulation',
  theory: `## classList

\`classList\` es una propiedad que devuelve los métodos para **añadir, quitar y verificar clases CSS** de un elemento.

### Métodos principales

| Método | Descripción |
|--------|-------------|
| \`add("clase")\` | Añade una clase |
| \`remove("clase")\` | Quita una clase |
| \`toggle("clase")\` | Si existe la quita, si no la añade |
| \`contains("clase")\` | Devuelve true/false |

### Ejemplos

~~~js
const elemento = document.querySelector(".mi-elemento");

elemento.classList.add("activo");
elemento.classList.remove("oculto");
elemento.classList.toggle("dark-mode");

if (elemento.classList.contains("activo")) {
  console.log("Está activo!");
}
~~~
`,
  snippet: `const modal = document.querySelector(".modal");

// Añade la clase "visible" al modal
████████████████████;`,
  answer: `modal.classList.add("visible")`,
  hint: 'Usa classList.add("visible")',
  preview: '<div class="modal visible">...</div>',
  difficulty: 'easy',
}
