export default {
  id: '09-arrays-reduce',
  title: 'Reduciendo arrays con reduce',
  module: 'Arrays en JavaScript',
  theory: `## Array.reduce()

\`.reduce()\` **reduce** un array a un solo valor (número, objeto, string, etc.).

### Sintaxis

~~~js
const resultado = array.reduce((acumulador, elemento) => {
  return nuevoAcumulador;
}, valorInicial);
~~~

### Ejemplo: suma total

~~~js
const nums = [10, 20, 30];
const total = nums.reduce((sum, n) => sum + n, 0);
// total: 60
~~~

### Ejemplo: objeto acumulador

~~~js
const items = ["a", "b", "a"];
const count = items.reduce((acc, i) => {
  acc[i] = (acc[i] || 0) + 1;
  return acc;
}, {});
// count: { a: 2, b: 1 }
~~~
`,
  code: `const sales = [
  { product: "Laptop", amount: 1500 },
  { product: "Mouse", amount: 25 },
  { product: "Keyboard", amount: 80 },
  { product: "Laptop", amount: 1500 },
  { product: "Mouse", amount: 25 }
];

const total = sales.reduce(function (sum, sale) {
  return sum + sale.amount;
}, 0);

console.log("Total ventas: $" + total);`,
  hint: 'reduce acumula valores usando un acumulador que se actualiza en cada iteración',
  difficulty: 'hard',
  intro: 'Aprenderás **reduce()**, el método más poderoso y versátil para transformar arrays en cualquier tipo de dato.',
}
