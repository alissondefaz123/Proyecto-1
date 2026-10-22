
import {
    listarIncidentes,
    buscarIncidente,
    registrarIncidente,
    modificarIncidente,
    borrarIncidente,
    obtenerToken,
    obtenerRol,
    puedeEditar,
    puedeEliminar,
    cerrarSesion
} from "./model.js";

import {
    mostrarMensaje,
    dibujarTabla,
    dibujarDashboard,
    obtenerFiltros,
    limpiarFormulario,
    cambiarTextoBoton
} from "./view.js";

let incidentes = [];
let idEnEdicion = null;

function validar(datos) {
    if (datos.tipo.length < 3 || datos.tipo.length > 100) {
        return "El tipo debe tener entre 3 y 100 caracteres.";
    }

    if (!["Baja", "Media", "Alta", "Crítica"].includes(datos.severidad)) {
        return "Seleccione una severidad válida.";
    }

    if (!["Abierto", "En análisis", "Resuelto"].includes(datos.estado)) {
        return "Seleccione un estado válido.";
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) {
        return "Seleccione una fecha válida.";
    }

    const fecha = new Date(`${datos.fecha}T00:00:00`);

    if (
        Number.isNaN(fecha.getTime()) ||
        fecha.toISOString().slice(0, 10) !== datos.fecha
    ) {
        return "La fecha no es válida.";
    }

    if (datos.responsable.length < 3 || datos.responsable.length > 100) {
        return "El responsable debe tener entre 3 y 100 caracteres.";
    }

    if (datos.descripcion.length < 20 || datos.descripcion.length > 1000) {
        return "La descripción debe tener entre 20 y 1000 caracteres.";
    }

    return null;
}

function leerFormulario() {
    return {
        tipo: document.getElementById("tipo").value.trim(),
        severidad: document.getElementById("severidad").value,
        estado: document.getElementById("estado").value,
        fecha: document.getElementById("fecha").value,
        responsable: document.getElementById("responsable").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim()
    };
}

function actualizarVista() {
    const filtros = obtenerFiltros();

    const filtrados = incidentes.filter(i =>
        (!filtros.tipo || i.tipo === filtros.tipo) &&
        (!filtros.severidad || i.severidad === filtros.severidad) &&
        (!filtros.estado || i.estado === filtros.estado)
    );

    dibujarTabla(filtrados, {
        editar: puedeEditar(),
        eliminar: puedeEliminar()
    });

    dibujarDashboard(filtrados);
}

async function cargarIncidentes() {
    try {
        incidentes = await listarIncidentes();
        actualizarVista();
    } catch (error) {
        console.error(error);
        mostrarMensaje(error.message, "error");
    }
}

async function guardarIncidente(evento) {
    evento.preventDefault();

    if (!puedeEditar()) {
        mostrarMensaje("Su rol no permite esta operación.", "error");
        return;
    }

    const datos = leerFormulario();
    const error = validar(datos);

    if (error) {
        mostrarMensaje(error, "error");
        return;
    }

    try {
        if (idEnEdicion !== null) {
            await modificarIncidente(idEnEdicion, datos);
            mostrarMensaje("Incidente actualizado correctamente.", "success");
        } else {
            await registrarIncidente(datos);
            mostrarMensaje("Incidente registrado correctamente.", "success");
        }

        idEnEdicion = null;
        limpiarFormulario();
        cambiarTextoBoton("Registrar incidente");
        await cargarIncidentes();
    } catch (errorPeticion) {
        mostrarMensaje(errorPeticion.message, "error");
    }
}

async function editarIncidente(id) {
    if (!puedeEditar()) {
        mostrarMensaje("No tiene permiso para editar.", "error");
        return;
    }

    try {
        const respuesta = await buscarIncidente(id);
        const incidente =
            respuesta?.incidente ?? respuesta?.data ?? respuesta;

        if (!incidente || !incidente.id) {
            throw new Error("No se encontró el incidente solicitado.");
        }

        const formulario = {
            tipo: incidente.tipo ?? "",
            severidad: incidente.severidad ?? "",
            estado: incidente.estado ?? "",
            fecha: String(incidente.fecha ?? "").slice(0, 10),
            responsable: incidente.responsable ?? "",
            descripcion: incidente.descripcion ?? ""
        };

        const tipo = prompt("Tipo de incidente:", formulario.tipo);
        if (tipo === null) return;

        const severidad = prompt(
            "Severidad (Baja, Media, Alta, Crítica):",
            formulario.severidad
        );
        if (severidad === null) return;

        const estado = prompt(
            "Estado (Abierto, En análisis, Resuelto):",
            formulario.estado
        );
        if (estado === null) return;

        const fecha = prompt("Fecha (AAAA-MM-DD):", formulario.fecha);
        if (fecha === null) return;

        const responsable = prompt("Responsable:", formulario.responsable);
        if (responsable === null) return;

        const descripcion = prompt("Descripción:", formulario.descripcion);
        if (descripcion === null) return;

        const cambios = {
            tipo: tipo.trim(),
            severidad: severidad.trim(),
            estado: estado.trim(),
            fecha: fecha.trim(),
            responsable: responsable.trim(),
            descripcion: descripcion.trim()
        };

        const error = validar(cambios);

        if (error) {
            mostrarMensaje(error, "error");
            return;
        }

        await modificarIncidente(id, cambios);
        mostrarMensaje("Incidente actualizado correctamente.", "success");
        await cargarIncidentes();
    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

async function eliminarIncidente(id) {
    if (!puedeEliminar()) {
        mostrarMensaje("Solo el administrador puede eliminar.", "error");
        return;
    }

    if (!confirm(`¿Seguro que desea eliminar el incidente ${id}?`)) {
        return;
    }

    try {
        await borrarIncidente(id);
        mostrarMensaje("Incidente eliminado correctamente.", "success");
        await cargarIncidentes();
    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

function configurarEventos() {
    document
        .getElementById("formularioIncidente")
        ?.addEventListener("submit", guardarIncidente);

    ["filtroTipo", "filtroSeveridad", "filtroEstado"].forEach(id => {
        document.getElementById(id)?.addEventListener("change", actualizarVista);
    });

    document.getElementById("btnCerrarSesion")
        ?.addEventListener("click", cerrarSesion);

    document.getElementById("tablaIncidentes")
        ?.addEventListener("click", evento => {
            const boton = evento.target.closest("button[data-id]");

            if (!boton) return;

            const id = boton.dataset.id;

            if (boton.classList.contains("btn-editar")) {
                void editarIncidente(id);
            }

            if (boton.classList.contains("btn-eliminar")) {
                void eliminarIncidente(id);
            }
        });
}

function iniciarAplicacion() {
    if (!obtenerToken()) {
        cerrarSesion();
        return;
    }

    const rol = obtenerRol();

    if (!["ADMIN", "ANALISTA", "USUARIO"].includes(rol)) {
        mostrarMensaje(
            "No se reconoce el rol del usuario. Verifique los datos de sesión.",
            "error"
        );
    }

    if (!puedeEditar()) {
        document.querySelectorAll(
            "#formularioIncidente input, " +
            "#formularioIncidente select, " +
            "#formularioIncidente textarea, " +
            "#formularioIncidente button"
        ).forEach(control => {
            control.disabled = true;
        });
    }

    configurarEventos();
    void cargarIncidentes();
}

document.addEventListener("DOMContentLoaded", iniciarAplicacion);
