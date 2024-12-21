# Proyecto Final Backend

## Descripción del Proyecto

Este proyecto es una API para gestionar adopciones de mascotas. Permite a los usuarios adoptar mascotas y gestionar sus adopciones.

## Instalación

Para instalar las dependencias del proyecto, ejecuta:

```bash
npm install
```

## Uso

Para iniciar el servidor, ejecuta:

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`.

## Documentación de la API

La documentación de la API está disponible en `http://localhost:3000/api-docs` una vez que el servidor esté en funcionamiento. Esta documentación está generada con Swagger.

## Endpoints Principales

### Crear una Adopción

```http
POST /api/adoptions/:userId/:petId
```

#### Respuestas

- `200`: Adopción creada exitosamente.
- `404`: Usuario o mascota no encontrados.
- `400`: Error en la solicitud.

### Ejemplo de Uso

```javascript
import axios from 'axios';

const response = await axios.post('http://localhost:3000/api/adoptions/validUserId/validPetId');
console.log(response.data);
```

## Pruebas

Para ejecutar las pruebas, usa el siguiente comando:

```bash
npm run superTest
```

Las pruebas están definidas en el archivo `superTest.test.mjs` y utilizan `chai` y `axios` para realizar las solicitudes y validar las respuestas.

## Estructura del Proyecto

```
/final-backend-70090
├── /node_modules
├── /routes
│   └── example.js
├── /tests
│   └── superTest.test.mjs
├── app.js
├── package.json
├── requester.mjs
├── swaggerConfig.js
└── readme.md
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que te gustaría realizar.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
