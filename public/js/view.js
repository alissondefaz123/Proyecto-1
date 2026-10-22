
function crearCelda(valor) {
    const celda = document.createElement("td");
    celda.textContent = valor ?? "";
    return celda;
}

function crearEtiqueta(valor, clase) {
    const etiqueta = document.createElement("span");
    etiqueta.className = `badge ${clase}`;
    etiqueta.textContent = valor ?? "";
    return etiqueta;
}

function claseSeveridad(severidad) {
    const clases = {
        "Baja": "bg-success",
        "Media": "bg-info text-dark",
        "Alta": "bg-warning text-dark",
        "Crítica": "bg-danger"
    };

    return clases[severidad] || "bg-secondary";
}

function claseEstado(estado) {
    const clases = {
        "Abierto": "bg-danger",
        "En análisis": "bg-warning text-dark",
        "Resuelto": "bg-success"
    };

    return clases[estado] || "bg-secondary";
}

export function mostrarMensaje(mensaje, tipo = "success") {
    const elemento = document.getElementById("mensajeFormulario");
    const aria = document.getElementById("aria-mensaje");

    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = `mensaje-formulario ${tipo}`;
        elemento.setAttribute("role", tipo === "error" ? "alert" : "status");
    }

    if (aria) {
        aria.textContent = mensaje;
    }
}

export function dibujarTabla(incidentes, permisos) {
    const tabla = document.getElementById("tablaIncidentes");

    if (!tabla) {
        console.error("No se encontró #tablaIncidentes.");
        return;
    }

    tabla.replaceChildren();

    if (incidentes.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 8;
        celda.className = "text-center";
        celda.textContent = "No hay incidentes para mostrar.";

        fila.appendChild(celda);
        tabla.appendChild(fila);
        return;
    }

    incidentes.forEach(incidente => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(incidente.id));
        fila.appendChild(crearCelda(incidente.tipo));

        const celdaSeveridad = document.createElement("td");
        celdaSeveridad.appendChild(
            crearEtiqueta(
                incidente.severidad,
                claseSeveridad(incidente.severidad)
            )
        );
        fila.appendChild(celdaSeveridad);

        const celdaEstado = document.createElement("td");
        celdaEstado.appendChild(
            crearEtiqueta(
                incidente.estado,
                claseEstado(incidente.estado)
            )
        );
        fila.appendChild(celdaEstado);

        fila.appendChild(crearCelda(incidente.fecha));
        fila.appendChild(crearCelda(incidente.responsable));
        fila.appendChild(crearCelda(incidente.descripcion || ""));

        const celdaAcciones = document.createElement("td");

        if (permisos.editar) {
            const editar = document.createElement("button");
            editar.type = "button";
            editar.className = "btn btn-warning btn-sm me-2 mb-1 btn-editar";
            editar.dataset.id = incidente.id;
            editar.textContent = "Editar";
            celdaAcciones.appendChild(editar);
        }

        if (permisos.eliminar) {
            const eliminar = document.createElement("button");
            eliminar.type = "button";
            eliminar.className = "btn btn-danger btn-sm mb-1 btn-eliminar";
            eliminar.dataset.id = incidente.id;
            eliminar.textContent = "Eliminar";
            celdaAcciones.appendChild(eliminar);
        }

        if (!permisos.editar && !permisos.eliminar) {
            celdaAcciones.textContent = "Solo lectura";
        }

        fila.appendChild(celdaAcciones);
        tabla.appendChild(fila);
    });
}

export function dibujarDashboard(incidentes) {
    const activos = incidentes.filter(
        i => i.estado !== "Resuelto"
    ).length;

    const alta = incidentes.filter(
        i => i.severidad === "Alta" || i.severidad === "Crítica"
    ).length;

    const resueltos = incidentes.filter(
        i => i.estado === "Resuelto"
    ).length;

    const valores = {
        totalActivos: activos,
        totalAlta: alta,
        totalResueltos: resueltos,
        totalRegistrados: incidentes.length,
        contadorActivos: activos
    };

    Object.entries(valores).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = String(valor);
        }
    });
}

export function obtenerFiltros() {
    return {
        tipo: document.getElementById("filtroTipo")?.value || "",
        severidad: document.getElementById("filtroSeveridad")?.value || "",
        estado: document.getElementById("filtroEstado")?.value || ""
    };
}

export function limpiarFormulario() {
    document.getElementById("formularioIncidente")?.reset();
}

export function cambiarTextoBoton(texto) {
    const boton = document.querySelector(
        '#formularioIncidente button[type="submit"]'
    );

    if (boton) {
        boton.textContent = texto;
    }
}
