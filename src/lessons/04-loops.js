export default {
  id: '04-loops',
  title: 'Bucles con for',
  module: 'JS Basics',
  theory: `## Bucles en JavaScript

Los bucles repiten código varias veces.

### for clásico

~~~js
for (let i = 0; i < 5; i++) {
  console.log("Vuelta:", i);
}
~~~

### for...of (para arrays)

~~~js
const frutas = ["manzana", "pera"];
for (const fruta of frutas) {
  console.log(fruta);
}
~~~

### while

~~~js
let i = 0;
while (i < 3) {
  console.log(i);
  i++;
}
~~~

### Estructura del for

| Parte | Qué hace |
|-------|----------|
| \`let i = 0\` | Inicializa el contador |
| \`i < 5\` | Condición para seguir |
| \`i++\` | Incremento al final de cada vuelta |
`,
  code: `const students = ["Ana", "Luis", "Eva", "Juan", "Sofia"];

console.log("Lista de estudiantes:");
for (let i = 0; i < students.length; i++) {
  const num = i + 1;
  console.log(num + ". " + students[i]);
}

console.log("---");

for (const student of students) {
  console.log("Hola, " + student + "!");
}`,
  hint: 'Un bucle for tiene 3 partes: inicialización, condición, incremento',
  difficulty: 'medium',
  intro: 'Aprenderás a **repetir código con bucles for**. Esencial para recorrer arrays y ejecutar acciones múltiples veces.',
}
