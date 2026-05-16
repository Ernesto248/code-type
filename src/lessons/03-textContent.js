export default {
  id: '03-textContent',
  title: 'Leyendo y escribiendo texto',
  module: 'DOM Manipulation',
  theory: `## textContent

\`textContent\` te permite **leer o modificar** el texto de un elemento.

### Leer texto

~~~js
const texto = elemento.textContent;
~~~

### Escribir texto

~~~js
elemento.textContent = "Nuevo contenido";
~~~

### textContent vs innerText

- **textContent**: devuelve **todo** el texto (incluye oculto). Más rápido.
- **innerText**: solo texto visible. Más lento.

### Template strings

Puedes interpolar valores con template literals:

~~~js
elemento.textContent = \`Total: \${count} elementos\`;
~~~
`,
  snippet: `// Cuenta los items y muestra el resultado
const lista = document.querySelector("#lista");
const items = lista.querySelectorAll("li");
const total = items.length;

// Tu turno: actualiza el texto del contador
████████████████████████████████████████████████████████████████████████`,
  answer: `document.querySelector("#contador").textContent = \`Total: \${total} elementos\``,
  hint: 'Usa template string con textContent',
  preview: '<span id="contador">Total: 5 elementos</span>',
  difficulty: 'medium',
  intro: 'Aprenderás a **leer y modificar texto** en el DOM con textContent. También verás cómo usar **template strings** para interpolar valores dinámicamente.',
}
