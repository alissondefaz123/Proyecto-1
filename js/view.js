export function renderizarIncidentes(incidentes) {

    const tabla = document.querySelector("#tablaIncidentes");

    if (!tabla) {
        console.error("No se encontró la tabla de incidentes.");
        return;
    }

    tabla.innerHTML = "";

    incidentes.forEach((incidente) => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>#${incidente.id}</td>

            <td>${incidente.tipo}</td>

            <td>
                <span class="badge ${obtenerClaseSeveridad(incidente.severidad)}">
                    ${incidente.severidad}
                </span>
            </td>

            <td>
                <span class="badge ${obtenerClaseEstado(incidente.estado)}">
                    ${incidente.estado}
                </span>
            </td>

            <td>${incidente.fecha}</td>

            <td>${incidente.responsable}</td>
        `;

        tabla.appendChild(fila);
    });
}


function obtenerClaseSeveridad(severidad) {

    const clases = {
        "Baja": "severity-low",
        "Media": "severity-medium",
        "Alta": "severity-high",
        "Crítica": "severity-critical"
    };

    return clases[severidad] || "";
}


function obtenerClaseEstado(estado) {

    const clases = {
        "Abierto": "status-open",
        "En análisis": "status-progress",
        "Resuelto": "status-resolved"
    };

    return clases[estado] || "";
}


export function mostrarMensaje(mensaje, tipo = "success") {

    const elemento = document.querySelector("#mensajeFormulario");

    if (!elemento) {
        return;
    }

    elemento.textContent = mensaje;

    elemento.className = `mensaje-formulario ${tipo}`;
}


export function limpiarFormulario() {

    const formulario = document.querySelector("#formularioIncidente");

    if (formulario) {
        formulario.reset();
    }
}
