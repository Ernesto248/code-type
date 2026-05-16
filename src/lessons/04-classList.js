export default {
  id: '04-classList',
  title: 'Manipulando clases CSS',
  module: 'DOM Manipulation',
  theory: `## classList

\`classList\` te permite **añadir, quitar y verificar clases CSS**.

### Métodos principales

| Método | Descripción |
|--------|-------------|
| \`add("clase")\` | Añade una clase |
| \`remove("clase")\` | Quita una clase |
| \`toggle("clase")\` | Si existe la quita, si no la añade |
| \`contains("clase")\` | Devuelve true/false |

### Ejemplo

~~~js
elemento.classList.add("visible", "animado");
elemento.classList.remove("oculto");
if (elemento.classList.contains("activo")) {
  console.log("Activo!");
}
~~~
`,
  code: `const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".close-btn");

function openModal() {
  modal.classList.add("visible");
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

closeBtn.addEventListener("click", function () {
  modal.classList.remove("visible");
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});`,
  hint: 'classList.add, .remove y .toggle son los métodos clave',
  difficulty: 'medium',
  intro: 'Aprenderás a **controlar clases CSS dinámicamente** con classList. Esencial para mostrar/ocultar elementos y manejar estados visuales.',
}
