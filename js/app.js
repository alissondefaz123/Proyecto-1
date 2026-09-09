// ==========================================
// DATOS DE LOS INCIDENTES
// ==========================================

let incidentes = [
    {
        id: "INC-001",
        tipo: "Phishing",
        severidad: "Alta",
        estado: "Abierto",
        fecha: "07/09/2026",
        responsable: "Laura M.",
        descripcion: "Se detectó un correo electrónico sospechoso enviado a varios usuarios de la organización."
    },

    {
        id: "INC-002",
        tipo: "Malware",
        severidad: "Crítica",
        estado: "En análisis",
        fecha: "07/09/2026",
        responsable: "Carlos R.",
        descripcion: "Se identificó software malicioso en uno de los equipos de la organización."
    },

    {
        id: "INC-003",
        tipo: "Acceso no autorizado",
        severidad: "Media",
        estado: "Abierto",
        fecha: "06/09/2026",
        responsable: "Andrea P.",
        descripcion: "Se detectó un intento de acceso no autorizado a una cuenta institucional."
    },

    {
        id: "INC-004",
        tipo: "DDoS",
        severidad: "Alta",
        estado: "Resuelto",
        fecha: "05/09/2026",
        responsable: "Diego S.",
        descripcion: "Se detectó un ataque de denegación de servicio dirigido al servidor web."
    },

    {
        id: "INC-005",
        tipo: "Ransomware",
        severidad: "Crítica",
        estado: "En análisis",
        fecha: "04/09/2026",
        responsable: "María T.",
        descripcion: "Se identificó actividad asociada a ransomware en un equipo de la organización."
    }
];


// ==========================================
// CARGAR INCIDENTES EN LA TABLA
// ==========================================

function cargarIncidentes() {

    const tabla = document.getElementById("tablaIncidentes");

    if (!tabla) {
        console.error("No se encontró la tabla de incidentes.");
        return;
    }

    tabla.innerHTML = "";

    incidentes.forEach(function (incidente) {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${incidente.id}</td>

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

        // Permite seleccionar un incidente
        fila.addEventListener("click", function () {

    // Quitar selección de todas las filas
    const filas = tabla.querySelectorAll("tr");

    filas.forEach(function (f) {
        f.classList.remove("selected");
    });

    // Marcar la fila seleccionada
    fila.classList.add("selected");

    // Mostrar información en el panel de detalle
    mostrarDetalle(incidente);
});

        tabla.appendChild(fila);
    });

    actualizarResumen();
}


// ==========================================
// CLASE PARA LA SEVERIDAD
// ==========================================

function obtenerClaseSeveridad(severidad) {

    switch (severidad) {

        case "Crítica":
            return "severity-critical";

        case "Alta":
            return "severity-high";

        case "Media":
            return "severity-medium";

        case "Baja":
            return "severity-low";

        default:
            return "";
    }
}


// ==========================================
// CLASE PARA EL ESTADO
// ==========================================

function obtenerClaseEstado(estado) {

    switch (estado) {

        case "Abierto":
            return "status-open";

        case "En análisis":
            return "status-analysis";

        case "Resuelto":
            return "status-resolved";

        default:
            return "";
    }
}


// ==========================================
// ACTUALIZAR TARJETAS DEL DASHBOARD
// ==========================================

function actualizarResumen() {

    const totalActivos = incidentes.filter(function (incidente) {
        return incidente.estado !== "Resuelto";
    }).length;


    const totalAlta = incidentes.filter(function (incidente) {
        return incidente.severidad === "Alta" ||
               incidente.severidad === "Crítica";
    }).length;


    const totalResueltos = incidentes.filter(function (incidente) {
        return incidente.estado === "Resuelto";
    }).length;


    const totalRegistrados = incidentes.length;


    document.getElementById("totalActivos").textContent = totalActivos;

    document.getElementById("totalAlta").textContent = totalAlta;

    document.getElementById("totalResueltos").textContent = totalResueltos;

    document.getElementById("totalRegistrados").textContent = totalRegistrados;

    document.getElementById("contadorActivos").textContent =
        `${totalActivos} activos`;
}


// ==========================================
// MOSTRAR DETALLE DEL INCIDENTE
// ==========================================

function mostrarDetalle(incidente) {

    const detalleTitulo = document.getElementById("detalle-titulo");

    if (!detalleTitulo) {
        return;
    }

    detalleTitulo.textContent = `#${incidente.id}`;


    // Buscar la insignia de severidad
    const panelDetalle = document.querySelector(".incident-detail");

    if (!panelDetalle) {
        return;
    }

    const badge = panelDetalle.querySelector(".panel-header .badge");

    if (badge) {

        badge.textContent = incidente.severidad;

        badge.className =
            `badge ${obtenerClaseSeveridad(incidente.severidad)}`;
    }


    // Obtener las filas de información
    const filas = panelDetalle.querySelectorAll(".detail-row");

    if (filas.length >= 4) {

        filas[0].querySelector("strong").textContent =
            incidente.tipo;

        filas[1].querySelector("strong").textContent =
            incidente.estado;

        filas[2].querySelector("strong").textContent =
            incidente.fecha;

        filas[3].querySelector("strong").textContent =
            incidente.responsable;
    }


    // Actualizar descripción
    const cajasDescripcion =
        panelDetalle.querySelectorAll(".description-box");

    if (cajasDescripcion.length > 0) {

        const descripcion =
            cajasDescripcion[0].querySelector("p");

        if (descripcion) {
            descripcion.textContent = incidente.descripcion;
        }
    }
}


// ==========================================
// REGISTRAR NUEVO INCIDENTE
// ==========================================

const formulario =
    document.getElementById("formularioIncidente");


if (formulario) {

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();


        const tipo =
            document.getElementById("tipo").value;

        const severidad =
            document.getElementById("severidad").value;

        const responsable =
            document.getElementById("responsable").value;

        const fechaInput =
            document.getElementById("fecha").value;

        const descripcion =
            document.getElementById("descripcion").value;


        // Convertir fecha de YYYY-MM-DD a DD/MM/YYYY
        let fecha = fechaInput;

        if (fechaInput) {

            const partes = fechaInput.split("-");

            fecha =
                `${partes[2]}/${partes[1]}/${partes[0]}`;
        }


        // Generar nuevo ID
        const nuevoNumero = incidentes.length + 1;

        const nuevoId =
            `INC-${String(nuevoNumero).padStart(3, "0")}`;


        // Crear nuevo incidente
        const nuevoIncidente = {

            id: nuevoId,

            tipo: tipo,

            severidad: severidad,

            estado: "Abierto",

            fecha: fecha,

            responsable: responsable,

            descripcion: descripcion
        };


        // Agregarlo al arreglo
        incidentes.push(nuevoIncidente);


        // Volver a cargar tabla y contadores
        cargarIncidentes();


        // Mostrar el nuevo incidente
        mostrarDetalle(nuevoIncidente);


        // Mensaje de confirmación
        const mensaje =
            document.getElementById("mensajeFormulario");

        if (mensaje) {

            mensaje.textContent =
                `Incidente ${nuevoId} registrado correctamente.`;

            mensaje.className =
                "mensaje-formulario mensaje-exito";
        }


        // Limpiar formulario
        formulario.reset();
    });
}


// ==========================================
// MOSTRAR / OCULTAR FORMULARIO
// ==========================================

const btnMostrarFormulario =
    document.getElementById("btnMostrarFormulario");


if (btnMostrarFormulario) {

    btnMostrarFormulario.addEventListener("click", function () {

        const formulario =
            document.getElementById("formularioIncidente");

        if (!formulario) {
            return;
        }

        if (formulario.style.display === "none") {

            formulario.style.display = "block";

        } else {

            formulario.style.display = "none";
        }
    });
}


// ==========================================
// INICIAR APLICACIÓN
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    cargarIncidentes();

});