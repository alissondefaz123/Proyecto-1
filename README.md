# CyberMonitor – Plataforma de Gestión de Incidentes

## Requisitos
- Node.js 20 o superior y npm.
- Base SQLite incluida en `database/` para el entorno de práctica.

## Instalación y ejecución
1. Abre esta carpeta en Visual Studio Code.
2. Abre `http://localhost:3000/login.html`.

## Calidad de código
- `npm test`: ejecuta las pruebas unitarias Jest de las reglas de negocio.
- `npm run lint`: ejecuta ESLint sobre las reglas, pruebas, scripts de medición y validación HTTP.
- `npm run perf:api`: mide el tiempo y tamaño de la respuesta del servidor y del endpoint de incidentes. El endpoint de incidentes está protegido; define `CYBERMONITOR_TOKEN` con un JWT válido para medir una respuesta autorizada.

## Reglas de negocio y arquitectura
- `middleware/validacion.js` reutiliza estas listas para validar entradas HTTP.
- `controllers/` coordina las operaciones, `models/` define la persistencia Sequelize y `routes/` declara los endpoints.


## Seguridad y evidencias
- La autenticación usa JWT; los roles se verifican en middleware.
