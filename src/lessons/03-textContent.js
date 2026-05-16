export default {
  id: '03-textContent',
  title: 'Leyendo y modificando texto con textContent',
  module: 'DOM Manipulation',
  theory: `## textContent

La propiedad \`textContent\` te permite **leer o modificar** el contenido de texto de un elemento.

### Leer texto

~~~js
const texto = elemento.textContent;
~~~

### Modificar texto

~~~js
elemento.textContent = "Nuevo texto";
~~~

### textContent vs innerText

- \`textContent\`: devuelve **todo** el texto, incluyendo texto oculto. Es más rápido.
- \`innerText\`: solo texto visible, respeta estilos CSS. Es más lento.

### Ejemplo práctico

~~~js
const titulo = document.querySelector("#title");
titulo.textContent = "Bienvenido, usuario!";

console.log(titulo.textContent); // "Bienvenido, usuario!"
~~~
`,
  snippet: `const titulo = document.querySelector("h1");
// Cambia el texto del título a "Hola Mundo"
████████████████████████████████████;`,
  answer: `titulo.textContent = "Hola Mundo"`,
  hint: 'Asigna "Hola Mundo" a titulo.textContent',
  preview: '<h1>Hola Mundo</h1>',
  difficulty: 'easy',
}
