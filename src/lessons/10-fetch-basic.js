export default {
  id: '10-fetch-basic',
  title: 'Peticiones con fetch',
  module: 'Fetch y APIs',
  theory: `## Fetch API

\`fetch()\` te permite hacer **peticiones HTTP** desde el navegador.

### Sintaxis básica

~~~js
fetch("https://api.ejemplo.com/data")
  .then(response => response.json())
  .then(data => console.log(data));
~~~

### async/await (moderno)

~~~js
async function getData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
~~~

### Métodos HTTP

| Método | Uso |
|--------|-----|
| GET | Obtener datos |
| POST | Crear datos |
| PUT | Actualizar |
| DELETE | Eliminar |
`,
  code: `const API_URL = "https://jsonplaceholder.typicode.com";
const userId = 1;

async function getUser() {
  const response = await fetch(API_URL + "/users/" + userId);

  if (!response.ok) {
    console.log("Error:", response.status);
    return null;
  }

  const user = await response.json();
  console.log("Usuario:", user.name);
  console.log("Email:", user.email);
  return user;
}

getUser();`,
  hint: 'fetch devuelve una Promise. Usa await o .then() para obtener los datos.',
  difficulty: 'hard',
  intro: 'Vas a aprender a hacer **peticiones HTTP** con fetch(), la API nativa del navegador para comunicarse con servidores.',
}
