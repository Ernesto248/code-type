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
  console.log("Está activo!");
}
~~~
`,
  snippet: `// Maneja la apertura de un modal
const modal = document.querySelector(".modal");
const btn = document.querySelector("#abrir-modal");
const closeBtn = document.querySelector("#cerrar-modal");

btn.addEventListener("click", () => {
  // Tu turno: agrega "visible" y quita "oculto"
  ███████████████████████████████████████████████████████
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("visible");
  modal.classList.add("oculto");
});`,
  answer: `modal.classList.add("visible");
modal.classList.remove("oculto")`,
  hint: 'Usa classList.add() y classList.remove()',
  preview: '<div class="modal visible">...</div>',
  difficulty: 'medium',
  intro: 'Vas a aprender a **controlar clases CSS** desde JavaScript usando classList. Es la forma moderna de mostrar/ocultar elementos y manejar estilos dinámicamente.',
}
