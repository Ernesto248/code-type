export default {
  id: '01-variables',
  title: 'Variables con let y const',
  module: 'JS Basics',
  theory: `## Variables en JavaScript

Las variables guardan datos para usarlos después.

### let — variable que puede cambiar

~~~js
let nombre = "Ana";
nombre = "Luis"; // ✅ se puede reasignar
~~~

### const — constante, no puede cambiar

~~~js
const PI = 3.1416;
PI = 3; // ❌ error, no se puede reasignar
~~~

### Tipos de datos comunes

| Tipo | Ejemplo |
|------|---------|
| Número | \`let edad = 25;\` |
| String | \`let name = "Ana";\` |
| Booleano | \`let activo = true;\` |
| null | \`let vacio = null;\` |

### Buenas prácticas

- Usa \`const\` por defecto, \`let\` solo cuando necesites reasignar
- Nombres descriptivos en camelCase: \`miVariable\`
- No uses \`var\` (estilo antiguo)
`,
  code: `const nombre = "Ana";
const edad = 25;
let ciudad = "Madrid";
let activo = true;

ciudad = "Barcelona";
console.log("Nombre:", nombre);
console.log("Edad:", edad);
console.log("Ciudad:", ciudad);
console.log("Activo:", activo);`,
  hint: 'Usa const para valores fijos, let para variables que cambian',
  difficulty: 'easy',
  intro: 'Vas a escribir tu primer código JavaScript: **variables**. Aprenderás la diferencia entre let y const, y los tipos de datos básicos.',
}
