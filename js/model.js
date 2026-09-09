let incidentes = [];

export async function cargarIncidentes() {
    const respuesta = await fetch("./incidentes.json");

    if (!respuesta.ok) {
        throw new Error("No se pudo cargar el archivo incidentes.json");
    }

    incidentes = await respuesta.json();

    return incidentes;
}

export function obtenerIncidentes() {
    return [...incidentes];
}

export function agregarIncidente(incidente) {
    incidentes.push(incidente);
}
