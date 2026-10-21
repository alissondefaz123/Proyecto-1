# CyberMonitor — Plataforma de Gestión de Incidentes de Ciberseguridad

**Proyecto integrador de Desarrollo de Plataformas**
**Estudiante:** Alisson Valeria Defaz Montero
**Carrera:** Ingeniería en Ciberseguridad
**Institución:** Pontificia Universidad Católica del Ecuador (PUCE)
**Fecha:** Octubre de 2026

## 1. Introducción

CyberMonitor es una plataforma web que desarrollé con el propósito de facilitar el registro, la consulta y el seguimiento de incidentes de ciberseguridad, la idea principal del proyecto es organizar la información de los incidentes en un solo lugar y permitir que las operaciones se realicen de forma controlada.

Durante el desarrollo trabajé con una arquitectura cliente-servidor, una API REST y una base de datos persistente, también incorporé autenticación, autorización por roles, validaciones y herramientas para comprobar la calidad del código.

Este proyecto integra los conocimientos adquiridos durante las unidades de Desarrollo de Plataformas y me permite demostrar cómo una aplicación pasa de una interfaz básica a una solución con persistencia, controles de seguridad y pruebas.

## 2. Objetivos

### Objetivo general

Desarrollar una plataforma web para gestionar incidentes de ciberseguridad mediante operaciones CRUD, almacenamiento persistente, autenticación, autorización y validación de datos.

### Objetivos específicos

- Implementar una API REST para administrar incidentes.
- Guardar la información utilizando SQLite y Sequelize.
- Proteger las operaciones mediante tokens JWT y permisos por rol.
- Validar los datos recibidos y manejar los errores de manera consistente.
- Ejecutar pruebas automatizadas y análisis estático del código.
- Documentar la instalación, el funcionamiento, las pruebas y las limitaciones del sistema.

## 3. Arquitectura del sistema

La plataforma sigue una arquitectura cliente-servidor, el usuario interactúa con la interfaz web, que envía solicitudes HTTP a la API de Express, las rutas aplican los controles de acceso y las validaciones correspondientes antes de delegar las operaciones a los controladores.

Los controladores coordinan la lógica de las solicitudes y los modelos de Sequelize permiten consultar y modificar la base de datos SQLite.

Los principales componentes son:

- **Interfaz web:** HTML, CSS y JavaScript.
- **Servidor:** Node.js y Express.
- **Rutas:** definen los endpoints de autenticación e incidentes.
- **Middleware:** procesa autenticación, autorización, validaciones, registros y errores.
- **Controladores:** coordinan las operaciones de la API.
- **Modelos:** representan los datos persistentes.
- **Base de datos:** SQLite.
- **Pruebas y calidad:** Jest y ESLint.

La separación entre componentes facilita el mantenimiento y permite identificar dónde corregir un problema, la refactorización MVC del cliente debe quedar integrada con la API para que el modelo, la vista y el controlador trabajen sobre la misma fuente de información.

## 4. Funcionalidades

La plataforma contempla las siguientes funciones:

- Inicio de sesión y gestión de cuentas según las rutas implementadas.
- Consulta de incidentes.
- Registro de nuevos incidentes.
- Actualización de la información y del estado.
- Eliminación de incidentes según los permisos.
- Clasificación por tipo, severidad y estado.
- Validación de los datos recibidos.
- Respuestas HTTP y mensajes de error.
- Persistencia de la información en la base de datos.

Las funcionalidades se verifican mediante pruebas de la interfaz y de la API, no se considera suficiente que un botón aparezca en pantalla: la operación debe completarse en el servidor y reflejarse en la base de datos.

## 5. Tecnologías utilizadas

- Node.js y npm.
- Express para el servidor y la API REST.
- Sequelize como ORM.
- SQLite como base de datos.
- JSON Web Token (JWT) para autenticación.
- bcryptjs para el tratamiento seguro de contraseñas mediante hash.
- Helmet y CORS para controles de seguridad HTTP.
- express-validator y validaciones propias para los datos de entrada.
- Jest para pruebas automatizadas.
- ESLint para revisar el código.
- HTML, CSS y JavaScript para la interfaz.

## 6. Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm instalados.
- Visual Studio Code u otro editor.
- Una terminal.
- Los archivos del proyecto.
- Las variables de entorno configuradas.

Se debe utilizar una versión de Node.js compatible con las dependencias instaladas.

## 7. Instalación y configuración

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Instalar las dependencias con `npm install`.
4. Crear un archivo `.env` local
5. Configurar las variables requeridas, incluido un secreto JWT fuerte y privado.
6. Revisar la configuración de la base de datos.
7. Ejecutar las migraciones pendientes, si las hubiera, con `npx sequelize-cli db:migrate`.
8. Crear una cuenta de prueba mediante el procedimiento autorizado del proyecto.
9. Iniciar el servidor con `npm start`.
10. Abrir `http://localhost:3000/login.html`.


## 8. Seguridad

La API utiliza JWT para comprobar la identidad del usuario y middleware de autorización para restringir determinadas operaciones según su rol, las rutas de incidentes requieren autenticación, y las operaciones de modificación o eliminación aplican permisos específicos.

Las contraseñas deben almacenarse mediante hash y nunca como texto plano, las entradas se validan antes de procesarse y los errores se gestionan centralmente, Helmet permite establecer cabeceras de seguridad y CORS restringe los orígenes autorizados según la configuración.

Durante el desarrollo local se utiliza HTTP en localhost, para publicar el sistema se requiere HTTPS correctamente configurado, variables de entorno de producción, revisión de permisos y protección de los datos.

La seguridad se comprueba mediante pruebas de solicitudes sin token, tokens inválidos y roles insuficientes, la protección visual de la interfaz no reemplaza los controles de la API.

## 9. Pruebas y calidad

El proyecto dispone de pruebas automatizadas para reglas de negocio de los incidentes, estas comprueban valores permitidos de severidad y estado, validación de fechas, contenido de las solicitudes y condiciones de actualización parcial.

Los comandos principales son:

- `npm test`: ejecuta las pruebas Jest.
- `npm run lint`: ejecuta ESLint sobre las rutas configuradas en el script.
- `npm start`: inicia el servidor.
- `npm run perf:api`: ejecuta las mediciones de solicitudes definidas en el proyecto.

Los resultados se registran con capturas y tablas que identifican el caso, el resultado esperado y el resultado observado, las mediciones de rendimiento deben repetirse con el mismo procedimiento antes y después de una optimización, sin presentar estimaciones como si fueran mediciones reales.

## 10. Despliegue y operación

La ejecución local sirve para desarrollar y probar el sistema, el despliegue final requiere configurar las variables de producción, publicar el servicio en un entorno compatible con Node.js, habilitar HTTPS y comprobar la conexión con la base de datos.

La URL pública debe probarse desde un navegador y desde solicitudes a la API, también debe verificarse que la persistencia continúe después de reiniciar el servicio o que se haya configurado un almacenamiento persistente adecuado para la plataforma de alojamiento.


## 11. Limitaciones y mejoras futuras

CyberMonitor es un proyecto académico y no debe considerarse automáticamente preparado para gestionar incidentes institucionales reales, antes de utilizarlo en producción sería necesario realizar pruebas de seguridad adicionales, revisar el ciclo de vida de los tokens, establecer copias de seguridad y recuperación, configurar monitoreo y alertas, revisar la exposición de información en los logs y evaluar el rendimiento con una carga representativa.

También es importante completar la refactorización MVC del cliente, ampliar las pruebas de integración, comparar las mediciones de rendimiento y comprobar el comportamiento del despliegue ante fallos.

Estas mejoras permitirían fortalecer la mantenibilidad, la confiabilidad y la seguridad de la plataforma.

## 12. Conclusión

El desarrollo de CyberMonitor me permitió integrar conocimientos de programación web, persistencia, seguridad, validación y pruebas, también comprendí que una aplicación no está terminada solamente porque su interfaz funciona: es necesario verificar la API, la base de datos, los permisos y el comportamiento ante errores.

La etapa final consiste en comprobar cada requisito, registrar evidencias reproducibles, documentar las limitaciones y preparar una demostración coherente, de esta manera, el proyecto puede ser evaluado y mantenido por otra persona con una comprensión clara de su arquitectura y funcionamiento.