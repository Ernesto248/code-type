export default {
  id: '06-arrays-basics',
  title: 'Arrays básicos',
  module: 'JS Basics',
  theory: `## Arrays en JavaScript

Los arrays almacenan **listas de datos**.

### Crear un array

~~~js
const frutas = ["manzana", "pera", "uva"];
const numeros = [1, 2, 3, 4, 5];
const mixto = ["texto", 42, true];
~~~

### Acceder a elementos

Los índices empiezan en **0**:

~~~js
frutas[0]   // "manzana"
frutas[1]   // "pera"
frutas.length  // 3 (cantidad)
~~~

### Métodos básicos

| Método | Descripción |
|--------|-------------|
| \`.push(x)\` | Agrega al final |
| \`.pop()\` | Quita el último |
| \`.includes(x)\` | Verifica si existe |
| \`.indexOf(x)\` | Posición del elemento |
`,
  code: `const colors = ["rojo", "azul", "verde"];

console.log("Primero:", colors[0]);
console.log("Último:", colors[colors.length - 1]);
console.log("Total:", colors.length);

colors.push("amarillo");
console.log("Después de push:", colors);

const hasBlue = colors.includes("azul");
console.log("¿Tiene azul?", hasBlue);

for (let i = 0; i < colors.length; i++) {
  console.log((i + 1) + ". " + colors[i]);
}`,
  hint: 'Los arrays empiezan en índice 0. .push() agrega al final.',
  difficulty: 'easy',
  intro: 'Aprenderás los fundamentos de **arrays en JavaScript**: cómo crearlos, acceder a elementos y usar métodos básicos.',
}
