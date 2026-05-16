export default {
  id: '08-arrays-filter',
  title: 'Filtrando arrays con filter',
  module: 'Arrays en JavaScript',
  theory: `## Array.filter()

\`.filter()\` crea un **nuevo array** con los elementos que cumplan una condición.

### Sintaxis

~~~js
const filtrados = array.filter((elemento) => {
  return condicion; // true = se queda, false = se va
});
~~~

### Ejemplo

~~~js
const edades = [12, 18, 25, 8, 30];
const mayores = edades.filter(e => e >= 18);
// mayores: [18, 25, 30]
~~~

### Tips

- Si ningún elemento cumple, devuelve array vacío
- El callback debe devolver un booleano
- No modifica el array original
`,
  code: `const people = [
  { name: "Ana", age: 17 },
  { name: "Luis", age: 22 },
  { name: "Eva", age: 15 },
  { name: "Juan", age: 30 },
  { name: "Sofia", age: 19 }
];

const adults = people.filter(function (person) {
  return person.age >= 18;
});

console.log("Adultos:", adults);
console.log("Total adultos:", adults.length);`,
  hint: 'filter devuelve solo los elementos que pasan la condición',
  difficulty: 'medium',
  intro: 'Vas a aprender a **filtrar arrays** con filter(), ideal para buscar elementos que cumplan condiciones específicas.',
}
