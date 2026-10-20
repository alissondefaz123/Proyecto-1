# Documentación de HTTPS

## CyberMonitor - Gestión de Incidentes

La plataforma CyberMonitor utiliza HTTP durante el desarrollo local debido a que las pruebas se realizan mediante localhost.

Para un ambiente de producción se recomienda utilizar HTTPS para proteger la comunicación entre el cliente y el servidor.

HTTPS utiliza el protocolo TLS para cifrar la información transmitida. Esto permite proteger datos como credenciales, tokens JWT y la información relacionada con los incidentes de ciberseguridad.

La arquitectura recomendada para producción sería:

Cliente
↓
HTTPS / TLS
↓
Servidor web o proxy inverso
↓
Node.js + Express
↓
Base de datos

El servidor puede utilizar un certificado digital emitido por una autoridad certificadora confiable. También se recomienda utilizar un proxy inverso como Nginx para gestionar las conexiones HTTPS y redirigir las solicitudes hacia la aplicación Node.js.

Además del uso de HTTPS, se recomienda:

- Utilizar variables de entorno para almacenar secretos.
- No publicar el secreto utilizado para firmar los tokens JWT.
- Mantener actualizadas las dependencias de Node.js.
- Utilizar contraseñas almacenadas mediante funciones de hash como bcrypt.
- Configurar correctamente CORS.
- Validar y sanitizar las entradas recibidas.
- Utilizar Helmet para agregar medidas de seguridad HTTP.
- Evitar almacenar información sensible directamente en el código fuente.

Durante el desarrollo académico se utiliza HTTP sobre localhost para facilitar las pruebas. Para un despliegue real de CyberMonitor se deberá utilizar HTTPS.
```
