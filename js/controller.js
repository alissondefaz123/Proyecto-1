import {
    cargarIncidentes,
    obtenerIncidentes,
    agregarIncidente
} from "./model.js";

import {
    renderizarIncidentes,
    mostrarMensaje
} from "./view.js";


export async function iniciarAplicacion() {

    try {

        const incidentes = await cargarIncidentes();

        renderizarIncidentes(incidentes);

        configurarFormulario();

        console.log("CyberMonitor iniciado correctamente.");
        console.log("Incidentes cargados:", incidentes.length);

    } catch (error) {

        console.error("Error al iniciar CyberMonitor:", error);

        mostrarMensaje(
            "No se pudieron cargar los incidentes.",
            "error"
        );
    }
}


function configurarFormulario() {

    const formulario = document.querySelector("#formularioIncidente");

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        const tipo = document.querySelector("#tipo");
        const severidad = document.querySelector("#severidad");
        const responsable = document.querySelector("#responsable");
        const fecha = document.querySelector("#fecha");
        const descripcion = document.querySelector("#descripcion");


        if (tipo.value === "") {

            mostrarMensaje(
                "Debe seleccionar el tipo de incidente.",
                "error"
            );

            tipo.focus();
            return;
        }


        if (severidad.value === "") {

            mostrarMensaje(
                "Debe seleccionar el nivel de severidad.",
                "error"
            );

            severidad.focus();
            return;
        }


        if (responsable.value.trim().length < 3) {

            mostrarMensaje(
                "El responsable debe tener al menos 3 caracteres.",
                "error"
            );

            responsable.focus();
            return;
        }


        if (fecha.value === "") {

            mostrarMensaje(
                "Debe seleccionar la fecha del incidente.",
                "error"
            );

            fecha.focus();
            return;
        }


        if (descripcion.value.trim().length < 20) {

            mostrarMensaje(
                "La descripción debe tener al menos 20 caracteres.",
                "error"
            );

            descripcion.focus();
            return;
        }


        const nuevoIncidente = {

            id: `INC-${String(obtenerIncidentes().length + 1).padStart(3, "0")}`,

            tipo: tipo.options[tipo.selectedIndex].text,

            severidad: severidad.options[severidad.selectedIndex].text,

            estado: "Abierto",

            fecha: fecha.value,

            responsable: responsable.value.trim()
        };


        agregarIncidente(nuevoIncidente);

        renderizarIncidentes(obtenerIncidentes());


        mostrarMensaje(
            `Incidente ${nuevoIncidente.id} registrado correctamente.`,
            "success"
        );


        formulario.reset();
    });
}