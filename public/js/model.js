
const API_URL = "/api/incidentes";

export function obtenerToken() {
    return localStorage.getItem("token");
}

export function obtenerUsuario() {
    try {
        return JSON.parse(localStorage.getItem("usuario")) || {};
    } catch {
        return {};
    }
}

export function obtenerRol() {
    const usuario = obtenerUsuario();
    return String(usuario.rol || usuario.role || "").toUpperCase();
}

export function puedeEditar() {
    return ["ADMIN", "ANALISTA"].includes(obtenerRol());
}

export function puedeEliminar() {
    return obtenerRol() === "ADMIN";
}

export function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login.html";
}

async function solicitar(ruta = "", opciones = {}) {
    const token = obtenerToken();

    if (!token) {
        cerrarSesion();
        throw new Error("Debe iniciar sesión para continuar.");
    }

    const headers = {
        Accept: "application/json",
        ...(opciones.body ? { "Content-Type": "application/json" } : {}),
        ...opciones.headers,
        Authorization: `Bearer ${token}`
    };

    let respuesta;

    try {
        respuesta = await fetch(`${API_URL}${ruta}`, {
            ...opciones,
            headers
        });
    } catch {
        throw new Error("No se pudo conectar con el servidor.");
    }

    let datos = null;

    if (respuesta.status !== 204) {
        try {
            datos = await respuesta.json();
        } catch {
            datos = null;
        }
    }

    if (respuesta.status === 401) {
        cerrarSesion();
        throw new Error("Su sesión expiró. Inicie sesión nuevamente.");
    }

    if (respuesta.status === 403) {
        throw new Error(
            datos?.mensaje ||
            datos?.error ||
            "No tiene permisos para esta operación."
        );
    }

    if (!respuesta.ok) {
        throw new Error(
            datos?.mensaje ||
            datos?.error ||
            `Error HTTP ${respuesta.status}.`
        );
    }

    return datos;
}

export async function listarIncidentes() {
    const respuesta = await solicitar();

    if (Array.isArray(respuesta)) return respuesta;
    if (Array.isArray(respuesta?.incidentes)) return respuesta.incidentes;
    if (Array.isArray(respuesta?.data)) return respuesta.data;

    throw new Error("La API no devolvió una lista válida de incidentes.");
}

export async function buscarIncidente(id) {
    return solicitar(`/${encodeURIComponent(id)}`);
}

export async function registrarIncidente(incidente) {
    if (!puedeEditar()) {
        throw new Error("Su rol no permite registrar incidentes.");
    }

    return solicitar("", {
        method: "POST",
        body: JSON.stringify(incidente)
    });
}

export async function modificarIncidente(id, incidente) {
    if (!puedeEditar()) {
        throw new Error("Su rol no permite editar incidentes.");
    }

    return solicitar(`/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(incidente)
    });
}

export async function borrarIncidente(id) {
    if (!puedeEliminar()) {
        throw new Error("Solo el administrador puede eliminar incidentes.");
    }

    return solicitar(`/${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
}
