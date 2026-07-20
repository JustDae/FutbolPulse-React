# Futbol Pulse

Este repositorio contiene la aplicación cliente (frontend) de Futbol Pulse, desarrollada con React, Vite y TypeScript. La plataforma permite la gestión de equipos, análisis de rendimiento e interacción con métricas de fútbol.

## Requisitos Previos

Antes de proceder con la instalación, asegúrate de tener instalado en tu sistema:

- **Node.js**: Versión 18.0.0 o superior.
- **npm**: (Incluido con Node.js) o cualquier otro gestor de paquetes como `yarn` o `pnpm`.

## Variables de Entorno

El proyecto utiliza variables de entorno para gestionar la configuración de conexión hacia el servidor (backend). 

Crea un archivo llamado `.env.development` (para desarrollo local) o simplemente `.env` en la raíz de este directorio (`futbol_pulse-react/`) y agrega la siguiente configuración:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Esta variable define la ruta base a la cual la aplicación enviará las peticiones REST.

## Instalación

1. Clona el repositorio y navega hacia la carpeta del frontend:
   ```bash
   cd futbol_pulse-react
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

## Comandos Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

- **Iniciar el servidor de desarrollo:**
  ```bash
  npm run dev
  ```
  Iniciará la aplicación en modo desarrollo. Ábrela en `http://localhost:5173`. La página se recargará si realizas ediciones.

- **Construir para producción:**
  ```bash
  npm run build
  ```
  Compila la aplicación para producción en la carpeta `dist`, empaquetando React en modo de producción y optimizando la compilación para un mejor rendimiento.

- **Previsualizar la compilación de producción:**
  ```bash
  npm run preview
  ```
  Inicia un servidor web estático local que sirve los archivos desde la carpeta `dist`.

## Cómo Conectarse a la API

Para que el frontend funcione correctamente y obtenga datos, necesita comunicarse con el backend de Futbol Pulse (Django). 

El repositorio del backend, junto con sus propias instrucciones de instalación y configuración detalladas, se encuentra en el siguiente enlace:
[https://github.com/EdisonLudena/backend_proyecto_integrador_futbol](https://github.com/EdisonLudena/backend_proyecto_integrador_futbol)

Una vez que tengas el backend ejecutándose (típicamente en el puerto `8000`):

1. Verifica que el archivo `.env.development` de tu frontend apunte a la ruta correcta mediante la variable `VITE_API_BASE_URL` (por defecto `http://127.0.0.1:8000/api`).
2. Al ejecutar `npm run dev`, todas las peticiones (login, carga de imágenes, obtención de datos) se dirigirán de manera automática a la URL configurada. La aplicación utiliza una instancia configurada de `Axios` para inyectar los tokens de autenticación en cada petición a esta ruta base.

## Credenciales de Prueba

Si el backend fue inicializado con los datos por defecto, puedes utilizar la siguiente cuenta de prueba (rol de Scout) para iniciar sesión en la interfaz y probar las funcionalidades de inmediato:

- **Correo electrónico:** `scout@futbolpulse.com`
- **Contraseña:** `ScoutPassword123!`
