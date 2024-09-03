# Frontend Prueba Practica

## Tecnologias usadas

- React, libreria de javascript para la creacion de interfaces de usuario.
- Next.js, framework de React para la creacion de aplicaciones web.
- Material-UI, libreria de React para la creacion de componentes de interfaz de usuario.
- Axios, libreria de javascript para realizar peticiones HTTP.
- React-Hook-Form, libreria de React para la creacion de formularios.

## Instalacion

### Requisitos

- Node.js
- npm

### Pasos

1. Configurar las variables de entorno en el archivo `.env` en la raiz del proyecto. Puede usar el archivo `.env.example` como referencia.

```
 cp .env.example .env
```

El archivo `.env` debe tener las siguientes variables:

| Variable              | Descripcion                |
| --------------------- | -------------------------- |
| `NEXT_PUBLIC_API_URL` | URL del backend a consumir |

2. Instalar las dependencias del proyecto.

```
npm install
```

3. Iniciar el servidor de desarrollo.

```
npm run dev
```

4. Acceder a la aplicacion en el navegador.

```
http://localhost:3000
```

## Estructura de archivos

| Carpeta      | Descripcion                                                                   |
| ------------ | ----------------------------------------------------------------------------- |
| `src`        | Contiene el codigo fuente de la aplicacion.                                   |
| `app`        | Contiene las paginas de la aplicacion (Router de Next.js).                    |
| `components` | Contiene los componentes de la aplicacion.                                    |
| `config`     | Contiene la configuracion de la aplicacion.                                   |
| `hooks`      | Contiene los hooks personalizados de la aplicacion.                           |
| `context`    | Contiene los contextos de la aplicacion.                                      |
| `services`   | Contiene los servicios de la aplicacion(Para realizar peticiones al backend). |
| `theme`      | Contiene el tema de la aplicacion.                                            |
| `utils`      | Contiene utilidades de la aplicacion.                                         |


## Autor
- Brayan Dennis Aguilar Aparicio