export default {
  id: '05-functions',
  title: 'Creando funciones',
  module: 'JS Basics',
  theory: `## Funciones

Las funciones son bloques de código reutilizables.

### Declaración de función

~~~js
function saludar(nombre) {
  return "Hola, " + nombre + "!";
}
~~~

### Arrow functions (moderno)

~~~js
const saludar = (nombre) => {
  return "Hola, " + nombre + "!";
};

// Si es una sola línea, se puede acortar:
const sumar = (a, b) => a + b;
~~~

### Parámetros y return

- Los parámetros son los valores que recibe
- \`return\` devuelve un valor (si no se pone, devuelve \`undefined\`)

### Ejemplo

~~~js
function calcularEdad(nacimiento) {
  const añoActual = 2025;
  return añoActual - nacimiento;
}
~~~
`,
  code: `function greet(name) {
  return "Hola, " + name + "!";
}

const sum = (a, b) => {
  return a + b;
};

const double = (n) => n * 2;

console.log(greet("Ana"));
console.log("Suma:", sum(10, 5));
console.log("Doble:", double(7));

const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2);
console.log("Dobles:", doubled);`,
  hint: 'Las arrow functions (=>) son la forma moderna de escribir funciones',
  difficulty: 'medium',
  intro: 'Vas a aprender a **crear funciones** en JavaScript. Desde la sintaxis clásica hasta las modernas arrow functions.',
}
