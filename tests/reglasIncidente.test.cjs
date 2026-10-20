const {
  SEVERIDADES, ESTADOS, textoValido, severidadValida, estadoValido,
  fechaISOValida, tieneCamposActualizables, validarIncidente
} = require("../utils/reglasIncidente.cjs");

describe("Reglas de negocio de incidentes", () => {
  test("acepta las severidades definidas", () => {
    expect(SEVERIDADES).toEqual(["Baja", "Media", "Alta", "Crítica"]);
    expect(severidadValida("Crítica")).toBe(true);
  });
  test("rechaza una severidad desconocida", () => {
    expect(severidadValida("Urgente")).toBe(false);
  });
  test("acepta estados permitidos y rechaza otros", () => {
    expect(estadoValido("En análisis")).toBe(true);
    expect(estadoValido("Cerrado sin revisión")).toBe(false);
    expect(ESTADOS).toContain("Resuelto");
  });
  test("valida longitud de texto y espacios", () => {
    expect(textoValido("Phishing")).toBe(true);
    expect(textoValido("  ")).toBe(false);
    expect(textoValido("x", 3, 100)).toBe(false);
  });
  test("acepta una fecha ISO real y rechaza una fecha imposible", () => {
    expect(fechaISOValida("2026-10-13")).toBe(true);
    expect(fechaISOValida("2026-02-30")).toBe(false);
    expect(fechaISOValida("13/10/2026")).toBe(false);
  });
  test("acepta un incidente completo válido", () => {
    expect(validarIncidente({tipo:"Phishing", severidad:"Alta", estado:"Abierto", fecha:"2026-10-13", responsable:"Ana López", descripcion:"Correo sospechoso reportado por un usuario."})).toEqual([]);
  });
  test("informa errores de negocio en datos inválidos", () => {
    const errores = validarIncidente({tipo:"x", severidad:"Urgente", estado:"Cerrado", fecha:"2026-02-30", responsable:"A"});
    expect(errores.length).toBeGreaterThanOrEqual(4);
  });
  test("rechaza PATCH vacío y acepta campos permitidos", () => {
    expect(tieneCamposActualizables({})).toBe(false);
    expect(tieneCamposActualizables({ estado: "Resuelto" })).toBe(true);
    expect(tieneCamposActualizables({ otro: "valor" })).toBe(false);
  });
  test("rechaza un cuerpo que no es un objeto", () => {
    expect(validarIncidente(null)).toContain("El incidente debe ser un objeto.");
  });
});
