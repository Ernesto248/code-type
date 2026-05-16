export default {
  id: '02-strings',
  title: 'Strings y template literals',
  module: 'JS Basics',
  theory: `## Strings en JavaScript

Los strings son texto. Se escriben entre comillas.

### Comillas simples o dobles

~~~js
let saludo = "Hola";
let nombre = 'Ana';
~~~

### Template literals (backticks)

Usando \` backticks \` puedes interpolar variables:

~~~js
let name = "Luis";
let msg = \`Hola, \${name}!\`; // "Hola, Luis!"
~~~

### Métodos útiles

| Método | Descripción |
|--------|-------------|
| \`.length\` | Cantidad de caracteres |
| \`.toUpperCase()\` | A mayúsculas |
| \`.toLowerCase()\` | A minúsculas |
| \`.trim()\` | Quita espacios al inicio/final |
`,
  code: `const name = "Carlos";
const language = "JavaScript";
const year = 2025;

const message = name + " está aprendiendo " + language;
const template = \`\${name} programa desde \${year}\`;

console.log(message);
console.log(template);
console.log("Idioma:", language.toUpperCase());
console.log("Total chars:", message.length);`,
  hint: 'Usa backticks (`) para template literals y ${} para interpolar',
  difficulty: 'easy',
  intro: 'Aprenderás a **trabajar con strings** en JavaScript: concatenación, template literals y métodos útiles.',
}
