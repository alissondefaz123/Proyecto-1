const SEVERIDADES = Object.freeze(["Baja", "Media", "Alta", "Crítica"]);
const ESTADOS = Object.freeze(["Abierto", "En análisis", "Resuelto"]);

function textoValido(valor, minimo = 3, maximo = 100) {
  return typeof valor === "string" && valor.trim().length >= minimo && valor.trim().length <= maximo;
}

function severidadValida(valor) {
  return SEVERIDADES.includes(valor);
}

function estadoValido(valor) {
  return ESTADOS.includes(valor);
}

function fechaISOValida(valor) {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {return false;}
  const fecha = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
}

function tieneCamposActualizables(cuerpo) {
  const campos = ["tipo", "severidad", "estado", "fecha", "responsable", "descripcion"];
  return Boolean(cuerpo && typeof cuerpo === "object" && campos.some((campo) => Object.prototype.hasOwnProperty.call(cuerpo, campo)));
}

function validarIncidente(incidente) {
  const errores = [];
  if (!incidente || typeof incidente !== "object" || Array.isArray(incidente)) {
    return ["El incidente debe ser un objeto."];
  }
  if (!textoValido(incidente.tipo, 3, 100)) {errores.push("El tipo debe tener entre 3 y 100 caracteres.");}
  if (!severidadValida(incidente.severidad)) {errores.push("La severidad no es válida.");}
  if (incidente.estado !== undefined && !estadoValido(incidente.estado)) {errores.push("El estado no es válido.");}
  if (!fechaISOValida(incidente.fecha)) {errores.push("La fecha no es válida.");}
  if (!textoValido(incidente.responsable, 3, 100)) {errores.push("El responsable debe tener entre 3 y 100 caracteres.");}
  if (incidente.descripcion !== undefined && (typeof incidente.descripcion !== "string" || incidente.descripcion.length > 1000)) {errores.push("La descripción no puede superar los 1000 caracteres.");}
  return errores;
}

module.exports = { SEVERIDADES, ESTADOS, textoValido, severidadValida, estadoValido, fechaISOValida, tieneCamposActualizables, validarIncidente };
