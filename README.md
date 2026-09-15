# Sistema de Registro de Asistencias y Actividades

Este proyecto es una aplicación web SPA (Single Page Application) desarrollada con **Vue.js 3** y **Tailwind CSS**. Está diseñada para gestionar el registro de actividades y la asistencia de participantes, almacenando la información en una base de datos alojada en **Google Sheets** a través de **Google Apps Script (GAS)**.

## Características Principales
- **Dashboard de Resumen**: Visualización métrica de las actividades y total de personas (asistentes únicos) registradas.
- **Gestión de Usuarios**: Creación y edición de cuentas de usuario con acceso al sistema (contraseñas encriptadas mediante SHA-256 en el Frontend).
- **Gestión de Actividades**: Registro y listado de las actividades realizadas.
- **Registro de Asistencias**: Formulario optimizado para registrar la asistencia de personas (cédula, nombres, teléfono, correo) a una actividad específica, previniendo duplicidad de envíos.
- **Diseño Adaptativo y Tema Oscuro**: Interfaz moderna y responsive impulsada por Tailwind CSS con soporte para Dark Mode.

---

## 🛠 Requisitos Previos

1. **Node.js**: Versión 16.x o superior.
2. **NPM o Yarn**: Para gestionar las dependencias del frontend.
3. **Cuenta de Google**: Para alojar la base de datos (Google Sheets) y el backend (Google Apps Script).
4. **Git**: Para el control de versiones y el despliegue en Github Pages.

---

## 🚀 Configuración del Backend (Google Apps Script)

El sistema utiliza Google Sheets como base de datos gratuita. Para configurarlo, sigue estos pasos:

1. **Crear la Hoja de Cálculo**:
   - Crea un nuevo archivo en Google Sheets.
   - Crea las siguientes pestañas (hojas): `Usuarios`, `Actividades`, y `Asistencias`.
   - En la primera fila de cada hoja, coloca los encabezados correspondientes (ej: id, email, password, nombre).

2. **Configurar Google Apps Script**:
   - En tu hoja de cálculo, ve a **Extensiones > Apps Script**.
   - Pega allí el código de backend (que debe recibir peticiones POST y GET, y devolver JSON).
   - Haz clic en **Implementar > Nueva implementación**.
   - En "Seleccionar tipo", elige **Aplicación Web**.
   - En "Ejecutar como", selecciona **Tú (tu correo)**.
   - En "Quién tiene acceso", selecciona **Cualquier persona**.
   - Haz clic en **Implementar**.

3. **Copiar la URL del Script**:
   - Una vez desplegado, Google te proporcionará una **URL de la aplicación web**. Cópiala, la necesitarás para el entorno del frontend.

---

## 💻 Configuración del Frontend (Desarrollo Local)

1. **Clonar el repositorio y acceder a la carpeta**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd app
   ```

2. **Instalar las dependencias**:
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**:
   - En la raíz del directorio `app`, crea un archivo llamado `.env`.
   - Agrega la URL de Google Apps Script que copiaste en el paso anterior de la siguiente manera:
     ```env
     VITE_GAS_URL=https://script.google.com/macros/s/TU_ID_DE_SCRIPT/exec
     ```

4. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   - Abre tu navegador y dirígete a la URL indicada en la terminal (usualmente `http://localhost:5173/`).

---

## 🌐 Despliegue en Producción (GitHub Pages)

Para publicar la aplicación de forma gratuita en GitHub Pages, los scripts del proyecto ya están configurados con `gh-pages`.

### Paso a paso para el despliegue:

1. **Asegurar la Variable de Entorno**:
   El despliegue en GitHub Pages requiere que la variable `VITE_GAS_URL` se incruste en los archivos estáticos. Como este despliegue se hace desde tu máquina local, **Vite leerá automáticamente tu archivo `.env` local** durante la compilación. ¡Asegúrate de que el archivo `.env` exista y tenga la URL correcta en tu equipo antes de compilar!

2. **Compilar y Desplegar**:
   En tu terminal (dentro de la carpeta `app`), ejecuta:
   ```bash
   npm run deploy
   ```
   *Nota: Este comando ejecuta internamente `vue-tailwind-admin-dashboard@2.4.0 deploy` y utiliza la herramienta `gh-pages` para compilar (`dist/`) y subir directamente esa carpeta compilada a la rama `gh-pages` de tu repositorio.*

3. **Configurar GitHub Pages en GitHub**:
   - Ve a tu repositorio en GitHub.com.
   - Ve a **Settings > Pages**.
   - En **Source**, selecciona `Deploy from a branch`.
   - En **Branch**, selecciona la rama `gh-pages` y la carpeta `/ (root)`.
   - Haz clic en **Save**. En unos minutos, tu aplicación web estará en vivo.

---

## 🔒 Consideraciones de Seguridad
- **Encriptación de Contraseñas**: El sistema frontend ya está configurado para hashear las contraseñas con **SHA-256** utilizando la Web Crypto API antes de enviarlas al servidor. Nunca almacenes las contraseñas en texto plano en la hoja de Google Sheets.
- **Privacidad**: El archivo `.env` contiene tu endpoint directo, por lo cual **ya se encuentra incluido en el `.gitignore`** para evitar que se suba accidentalmente al código fuente de tu rama `main`.
