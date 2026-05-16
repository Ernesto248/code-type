export default {
  id: '03-conditionals',
  title: 'Condicionales if/else',
  module: 'JS Basics',
  theory: `## Condicionales

Los condicionales ejecutan código **solo si se cumple una condición**.

### if / else

~~~js
const edad = 18;

if (edad >= 18) {
  console.log("Eres mayor de edad");
} else {
  console.log("Eres menor de edad");
}
~~~

### Comparadores comunes

| Operador | Significado |
|----------|-------------|
| \`===\` | Igual (estricto) |
| \`!==\` | No igual |
| \`>\` \`>=\` | Mayor (o igual) |
| \`<\` \`<=\` | Menor (o igual) |
| \`&&\` | Y (AND) |
| \`\|\|\` | O (OR) |

### else if

~~~js
if (nota >= 90) {
  console.log("Excelente");
} else if (nota >= 70) {
  console.log("Bien");
} else {
  console.log("Mejorable");
}
~~~
`,
  code: `const score = 85;
const hasPassed = score >= 60;

if (hasPassed) {
  console.log("Has aprobado con " + score);
} else {
  console.log("Necesitas estudiar más");
}

const grade = score >= 90 ? "A" : score >= 70 ? "B" : "C";
console.log("Calificación:", grade);`,
  hint: 'Usa === para comparar, no ==. El operador ternario ? : es un if en una línea.',
  difficulty: 'easy',
  intro: 'Vas a aprender a tomar decisiones en código con **if, else y operadores ternarios**.',
}
