// ======================================================
// CYBERMONITOR - SCRIPT PRINCIPAL
// ======================================================

const API_URL = "/api/incidentes";


// ======================================================
// OBTENER TOKEN
// ======================================================

function obtenerToken() {

    return localStorage.getItem("token");

}


// ======================================================
// OBTENER USUARIO
// ======================================================

function obtenerUsuario() {

    try {

        return JSON.parse(
            localStorage.getItem("usuario")
        );

    } catch (error) {

        return null;

    }

}


// ======================================================
// HEADERS
// ======================================================

function obtenerHeaders() {

    const token = obtenerToken();

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;

    }

    return headers;

}


// ======================================================
// ESCAPAR HTML
// Protección XSS
// ======================================================

function escaparHTML(valor) {

    if (valor === null || valor === undefined) {

        return "";

    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// PETICIÓN GENERAL
// ======================================================

async function hacerPeticion(url, opciones = {}) {

    const respuesta = await fetch(
        url,
        {
            ...opciones,
            headers: {
                ...obtenerHeaders(),
                ...(opciones.headers || {})
            }
        }
    );

    let datos = {};

    try {

        datos = await respuesta.json();

    } catch (error) {

        datos = {};

    }


    // TOKEN INVÁLIDO O AUSENTE

    if (respuesta.status === 401) {

        alert(
            "La sesión ha expirado o el token no es válido."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.href = "/login.html";

        return null;

    }


    // SIN PERMISOS

    if (respuesta.status === 403) {

        alert(
            datos.error ||
            "No tiene permisos para realizar esta operación."
        );

        return null;

    }


    // OTROS ERRORES

    if (!respuesta.ok) {

        const mensaje =
            datos.error ||
            "Ocurrió un error en la solicitud.";

        throw new Error(mensaje);

    }

    return datos;

}


// ======================================================
// OBTENER INCIDENTES
// ======================================================

async function obtenerIncidentes() {

    try {

        console.log("Consultando incidentes...");

        const datos =
            await hacerPeticion(API_URL);

        if (!datos) {

            return;

        }

        console.log(
            "Incidentes recibidos:",
            datos
        );

        mostrarIncidentes(datos);

        actualizarDashboard(datos);

    } catch (error) {

        console.error(
            "Error al obtener incidentes:",
            error
        );

        mostrarMensaje(
            "No se pudieron cargar los incidentes.",
            "error"
        );

    }

}


// ======================================================
// MOSTRAR INCIDENTES EN TABLA
// ======================================================

function mostrarIncidentes(incidentes) {

    const tabla =
        document.getElementById("tablaIncidentes");

    if (!tabla) {

        console.error(
            "No se encontró tablaIncidentes"
        );

        return;

    }

    tabla.innerHTML = "";


    if (!Array.isArray(incidentes) ||
        incidentes.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    No existen incidentes registrados.
                </td>
            </tr>
        `;

        return;

    }


    incidentes.forEach((incidente) => {

        const fila =
            document.createElement("tr");

        fila.innerHTML = `

            <td>
                ${escaparHTML(incidente.id)}
            </td>

            <td>
                ${escaparHTML(incidente.tipo)}
            </td>

            <td>
                ${escaparHTML(incidente.severidad)}
            </td>

            <td>
                ${escaparHTML(incidente.estado)}
            </td>

            <td>
                ${escaparHTML(incidente.fecha)}
            </td>

            <td>
                ${escaparHTML(incidente.responsable)}
            </td>

            <td>
                ${escaparHTML(
                    incidente.descripcion || ""
                )}
            </td>

            <td>

                <button
                    type="button"
                    class="btn btn-warning btn-sm btn-editar"
                    data-id="${escaparHTML(incidente.id)}">

                    Editar

                </button>

                <button
                    type="button"
                    class="btn btn-danger btn-sm btn-eliminar"
                    data-id="${escaparHTML(incidente.id)}">

                    Eliminar

                </button>

            </td>

        `;


        tabla.appendChild(fila);

    });


    // ==================================================
    // BOTONES EDITAR
    // ==================================================

    document
        .querySelectorAll(".btn-editar")
        .forEach((boton) => {

            boton.addEventListener(
                "click",
                function () {

                    const id =
                        this.dataset.id;

                    editarIncidente(id);

                }
            );

        });


    // ==================================================
    // BOTONES ELIMINAR
    // ==================================================

    document
        .querySelectorAll(".btn-eliminar")
        .forEach((boton) => {

            boton.addEventListener(
                "click",
                function () {

                    const id =
                        this.dataset.id;

                    eliminarIncidente(id);

                }
            );

        });

}


// ======================================================
// DASHBOARD DINÁMICO
// ======================================================

function actualizarDashboard(incidentes) {

    if (!Array.isArray(incidentes)) {

        return;

    }


    const total =
        incidentes.length;


    const activos =
        incidentes.filter(
            incidente =>
                incidente.estado !== "Resuelto"
        ).length;


    const alta =
        incidentes.filter(
            incidente =>
                incidente.severidad === "Alta" ||
                incidente.severidad === "Crítica"
        ).length;


    const resueltos =
        incidentes.filter(
            incidente =>
                incidente.estado === "Resuelto"
        ).length;


    const totalActivos =
        document.getElementById(
            "totalActivos"
        );

    const totalAlta =
        document.getElementById(
            "totalAlta"
        );

    const totalResueltos =
        document.getElementById(
            "totalResueltos"
        );

    const totalRegistrados =
        document.getElementById(
            "totalRegistrados"
        );

    const contadorActivos =
        document.getElementById(
            "contadorActivos"
        );


    if (totalActivos) {

        totalActivos.textContent =
            activos;

    }


    if (totalAlta) {

        totalAlta.textContent =
            alta;

    }


    if (totalResueltos) {

        totalResueltos.textContent =
            resueltos;

    }


    if (totalRegistrados) {

        totalRegistrados.textContent =
            total;

    }


    if (contadorActivos) {

        contadorActivos.textContent =
            activos;

    }

}


// ======================================================
// REGISTRAR INCIDENTE
// ======================================================

async function registrarIncidente(event) {

    event.preventDefault();


    const tipo =
        document.getElementById(
            "tipo"
        ).value.trim();


    const severidad =
        document.getElementById(
            "severidad"
        ).value;


    const estado =
        document.getElementById(
            "estado"
        ).value;


    const responsable =
        document.getElementById(
            "responsable"
        ).value.trim();


    const fecha =
        document.getElementById(
            "fecha"
        ).value;


    const descripcion =
        document.getElementById(
            "descripcion"
        ).value.trim();


    // ==================================================
    // VALIDACIÓN CLIENTE
    // ==================================================

    if (tipo.length < 3) {

        mostrarMensaje(
            "El tipo debe tener al menos 3 caracteres.",
            "error"
        );

        return;

    }


    if (
        !["Baja", "Media", "Alta", "Crítica"]
            .includes(severidad)
    ) {

        mostrarMensaje(
            "Seleccione una severidad válida.",
            "error"
        );

        return;

    }


    if (
        !["Abierto", "En análisis", "Resuelto"]
            .includes(estado)
    ) {

        mostrarMensaje(
            "Seleccione un estado válido.",
            "error"
        );

        return;

    }


    if (!fecha) {

        mostrarMensaje(
            "Debe seleccionar una fecha.",
            "error"
        );

        return;

    }


    if (responsable.length < 3) {

        mostrarMensaje(
            "El responsable debe tener al menos 3 caracteres.",
            "error"
        );

        return;

    }


    if (descripcion.length < 20) {

        mostrarMensaje(
            "La descripción debe tener al menos 20 caracteres.",
            "error"
        );

        return;

    }


    const incidente = {

        tipo,

        severidad,

        estado,

        fecha,

        responsable,

        descripcion

    };


    try {

        const datos =
            await hacerPeticion(
                API_URL,
                {
                    method: "POST",
                    body: JSON.stringify(
                        incidente
                    )
                }
            );


        if (!datos) {

            return;

        }


        console.log(
            "Incidente creado:",
            datos
        );


        mostrarMensaje(
            "Incidente registrado correctamente.",
            "success"
        );


        document
            .getElementById(
                "formularioIncidente"
            )
            .reset();


        await obtenerIncidentes();


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            error.message,
            "error"
        );

    }

}


// ======================================================
// EDITAR INCIDENTE
// ======================================================

async function editarIncidente(id) {

    console.log(
        "Editando incidente:",
        id
    );


    if (!id) {

        alert(
            "No se recibió el ID del incidente."
        );

        return;

    }


    try {

        // Obtener datos actuales

        const incidente =
            await hacerPeticion(
                `${API_URL}/${encodeURIComponent(id)}`
            );


        if (!incidente) {

            return;

        }


        console.log(
            "Incidente seleccionado:",
            incidente
        );


        const nuevoTipo =
            prompt(
                "Tipo de incidente:",
                incidente.tipo || ""
            );


        if (nuevoTipo === null) {

            return;

        }


        const nuevaSeveridad =
            prompt(
                "Severidad (Baja, Media, Alta, Crítica):",
                incidente.severidad || ""
            );


        if (nuevaSeveridad === null) {

            return;

        }


        const nuevoEstado =
            prompt(
                "Estado (Abierto, En análisis, Resuelto):",
                incidente.estado || ""
            );


        if (nuevoEstado === null) {

            return;

        }


        const nuevaFecha =
            prompt(
                "Fecha (AAAA-MM-DD):",
                incidente.fecha || ""
            );


        if (nuevaFecha === null) {

            return;

        }


        const nuevoResponsable =
            prompt(
                "Responsable:",
                incidente.responsable || ""
            );


        if (nuevoResponsable === null) {

            return;

        }


        const nuevaDescripcion =
            prompt(
                "Descripción:",
                incidente.descripcion || ""
            );


        if (nuevaDescripcion === null) {

            return;

        }


        // ==================================================
        // VALIDACIÓN
        // ==================================================

        if (nuevoTipo.trim().length < 3) {

            alert(
                "El tipo debe tener al menos 3 caracteres."
            );

            return;

        }


        if (
            ![
                "Baja",
                "Media",
                "Alta",
                "Crítica"
            ].includes(
                nuevaSeveridad.trim()
            )
        ) {

            alert(
                "La severidad no es válida."
            );

            return;

        }


        if (
            ![
                "Abierto",
                "En análisis",
                "Resuelto"
            ].includes(
                nuevoEstado.trim()
            )
        ) {

            alert(
                "El estado no es válido."
            );

            return;

        }


        if (!nuevaFecha.trim()) {

            alert(
                "La fecha es obligatoria."
            );

            return;

        }


        if (
            nuevoResponsable.trim().length < 3
        ) {

            alert(
                "El responsable debe tener al menos 3 caracteres."
            );

            return;

        }


        if (
            nuevaDescripcion.trim().length < 20
        ) {

            alert(
                "La descripción debe tener al menos 20 caracteres."
            );

            return;

        }


        // ==================================================
        // PUT
        // ==================================================

        const actualizado = {

            tipo:
                nuevoTipo.trim(),

            severidad:
                nuevaSeveridad.trim(),

            estado:
                nuevoEstado.trim(),

            fecha:
                nuevaFecha.trim(),

            responsable:
                nuevoResponsable.trim(),

            descripcion:
                nuevaDescripcion.trim()

        };


        const resultado =
            await hacerPeticion(
                `${API_URL}/${encodeURIComponent(id)}`,
                {
                    method: "PUT",

                    body:
                        JSON.stringify(
                            actualizado
                        )
                }
            );


        if (!resultado) {

            return;

        }


        console.log(
            "Incidente actualizado:",
            resultado
        );


        alert(
            "Incidente actualizado correctamente."
        );


        await obtenerIncidentes();


    } catch (error) {

        console.error(
            "Error al editar:",
            error
        );

        alert(
            error.message ||
            "No se pudo actualizar el incidente."
        );

    }

}


// ======================================================
// ELIMINAR INCIDENTE
// ======================================================

async function eliminarIncidente(id) {

    console.log(
        "Eliminando incidente:",
        id
    );


    if (!id) {

        alert(
            "No se recibió el ID del incidente."
        );

        return;

    }


    const confirmar =
        confirm(
            `¿Está seguro de eliminar el incidente ${id}?`
        );


    if (!confirmar) {

        return;

    }


    try {

        const resultado =
            await hacerPeticion(
                `${API_URL}/${encodeURIComponent(id)}`,
                {
                    method: "DELETE"
                }
            );


        if (!resultado) {

            return;

        }


        console.log(
            "Incidente eliminado:",
            resultado
        );


        alert(
            "Incidente eliminado correctamente."
        );


        await obtenerIncidentes();


    } catch (error) {

        console.error(
            "Error al eliminar:",
            error
        );

        alert(
            error.message ||
            "No se pudo eliminar el incidente."
        );

    }

}


// ======================================================
// FILTROS
// ======================================================

async function aplicarFiltros() {

    const tipo =
        document.getElementById(
            "filtroTipo"
        ).value;


    const severidad =
        document.getElementById(
            "filtroSeveridad"
        ).value;


    const estado =
        document.getElementById(
            "filtroEstado"
        ).value;


    try {

        const parametros =
            new URLSearchParams();


        if (severidad) {

            parametros.append(
                "severidad",
                severidad
            );

        }


        if (estado) {

            parametros.append(
                "estado",
                estado
            );

        }


        let url =
            API_URL;


        if (parametros.toString()) {

            url +=
                "?" +
                parametros.toString();

        }


        const incidentes =
            await hacerPeticion(url);


        if (!incidentes) {

            return;

        }


        let filtrados =
            incidentes;


        // Filtro tipo en cliente

        if (tipo) {

            filtrados =
                incidentes.filter(
                    incidente =>
                        incidente.tipo === tipo
                );

        }


        mostrarIncidentes(
            filtrados
        );


        actualizarDashboard(
            filtrados
        );


    } catch (error) {

        console.error(
            "Error en filtros:",
            error
        );

    }

}


// ======================================================
// MENSAJE
// ======================================================

function mostrarMensaje(
    mensaje,
    tipo = "success"
) {

    const elemento =
        document.getElementById(
            "mensajeFormulario"
        );


    const aria =
        document.getElementById(
            "aria-mensaje"
        );


    if (elemento) {

        elemento.textContent =
            mensaje;

        elemento.className =
            `mensaje-formulario ${tipo}`;

    }


    if (aria) {

        aria.textContent =
            mensaje;

    }

}


// ======================================================
// CERRAR SESIÓN
// ======================================================

function cerrarSesion() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "usuario"
    );


    window.location.href =
        "/login.html";

}


// ======================================================
// PROTEGER PÁGINA
// ======================================================

function verificarSesion() {

    const token =
        obtenerToken();


    console.log(
        "Token:",
        token ? "Existe" : "No existe"
    );


    if (!token) {

        window.location.href =
            "/login.html";

        return false;

    }


    return true;

}


// ======================================================
// INICIALIZACIÓN
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "CyberMonitor iniciado"
        );


        // ----------------------------------------------
        // Verificar sesión
        // ----------------------------------------------

        if (!verificarSesion()) {

            return;

        }


        // ----------------------------------------------
        // Botón cerrar sesión
        // ----------------------------------------------

        const botonCerrarSesion =
            document.getElementById(
                "btnCerrarSesion"
            );


        if (botonCerrarSesion) {

            botonCerrarSesion.addEventListener(
                "click",
                cerrarSesion
            );

        }


        // ----------------------------------------------
        // Formulario
        // ----------------------------------------------

        const formulario =
            document.getElementById(
                "formularioIncidente"
            );


        if (formulario) {

            formulario.addEventListener(
                "submit",
                registrarIncidente
            );

        }


        // ----------------------------------------------
        // Filtro tipo
        // ----------------------------------------------

        const filtroTipo =
            document.getElementById(
                "filtroTipo"
            );


        if (filtroTipo) {

            filtroTipo.addEventListener(
                "change",
                aplicarFiltros
            );

        }


        // ----------------------------------------------
        // Filtro severidad
        // ----------------------------------------------

        const filtroSeveridad =
            document.getElementById(
                "filtroSeveridad"
            );


        if (filtroSeveridad) {

            filtroSeveridad.addEventListener(
                "change",
                aplicarFiltros
            );

        }


        // ----------------------------------------------
        // Filtro estado
        // ----------------------------------------------

        const filtroEstado =
            document.getElementById(
                "filtroEstado"
            );


        if (filtroEstado) {

            filtroEstado.addEventListener(
                "change",
                aplicarFiltros
            );

        }


        // ----------------------------------------------
        // Cargar incidentes
        // ----------------------------------------------

        obtenerIncidentes();

    }
);