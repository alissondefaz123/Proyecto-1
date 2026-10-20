const { performance } = require("node:perf_hooks");
const url = process.argv[2] || "http://localhost:3000";
const token = process.env.CYBERMONITOR_TOKEN;

async function medir(nombre, endpoint) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const inicio = performance.now();
  try {
    const respuesta = await fetch(`${url}${endpoint}`, { headers });
    const texto = await respuesta.text();
    const ms = performance.now() - inicio;
    console.log(JSON.stringify({ prueba: nombre, endpoint, estadoHTTP: respuesta.status, tiempoMs: Number(ms.toFixed(2)), bytesRespuesta: Buffer.byteLength(texto), nota: respuesta.status === 401 ? "Define CYBERMONITOR_TOKEN para medir un endpoint protegido con autorización." : "Medición de una solicitud completa desde Node.js." }, null, 2));
  } catch (error) {
    console.error(`No se pudo medir ${endpoint}: ${error.message}`);
    process.exitCode = 1;
  }
}

(async () => {
  console.log("Medición de red: el tiempo incluye solicitud, servidor y transferencia; no equivale únicamente al tiempo SQL.");
  await medir("salud del servidor", "/");
  await medir("consulta de incidentes", "/api/incidentes");
})();
