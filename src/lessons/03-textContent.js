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

- **textContent**: todo el texto, incluye oculto. Más rápido.
- **innerText**: solo texto visible. Más lento.

### Template strings

~~~js
elemento.textContent = \`Total: \${count} elementos\`;
~~~
`,
  code: `const output = document.querySelector("#output");
const counter = document.querySelector("#counter");
const items = document.querySelectorAll("li");
const total = items.length;

output.textContent = "Lista cargada";
counter.textContent = "Items: " + total;

if (total > 0) {
  console.log("Hay elementos en la lista");
}`,
  hint: 'Usa textContent para leer y asignar texto',
  difficulty: 'medium',
  intro: 'Vas a practicar **leyendo y escribiendo texto** en el DOM con textContent y template strings.',
}
