export default {
  id: '07-arrays-map',
  title: 'Transformando arrays con map',
  module: 'Arrays en JavaScript',
  theory: `## Array.map()

\`.map()\` crea un **nuevo array** aplicando una función a cada elemento del original.

### Sintaxis

~~~js
const nuevo = array.map((elemento, indice) => {
  return elemento.transformado;
});
~~~

### Características

- No modifica el array original
- Devuelve un array de la misma longitud
- Es ideal para transformar datos

### Ejemplo

~~~js
const numeros = [1, 2, 3];
const dobles = numeros.map(n => n * 2);
// dobles: [2, 4, 6]
~~~
`,
  code: `const numbers = [2, 4, 6, 8, 10];

const doubled = numbers.map(function (n) {
  return n * 2;
});

const halved = numbers.map(function (n) {
  return n / 2;
});

console.log("Original:", numbers);
console.log("Doble:", doubled);
console.log("Mitad:", halved);`,
  hint: 'map recibe un callback que se ejecuta por cada elemento',
  difficulty: 'medium',
  intro: 'Aprenderás a **transformar arrays** con el método map(), una de las herramientas más usadas en JavaScript moderno.',
}
