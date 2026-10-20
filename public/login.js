
const formularioLogin = document.getElementById("formLogin");
const formularioRegistro = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensajeLogin");
const botonAlternar = document.getElementById("btnAlternar");
const textoAlternar = document.getElementById("textoAlternar");
const tituloAcceso = document.getElementById("tituloAcceso");
const descripcionAcceso = document.getElementById("descripcionAcceso");

let modoRegistro = false;

function mostrarMensaje(texto, tipo = "error") {
    mensaje.textContent = texto;
    mensaje.className = `mensaje-formulario ${tipo}`;
}

function alternarFormulario() {
    modoRegistro = !modoRegistro;

    formularioLogin.hidden = modoRegistro;
    formularioRegistro.hidden = !modoRegistro;

    tituloAcceso.textContent = modoRegistro
        ? "Crear cuenta"
        : "Iniciar sesión";

    descripcionAcceso.textContent = modoRegistro
        ? "Regístrate para acceder a CyberMonitor."
        : "Ingresa con tu cuenta para continuar.";

    textoAlternar.textContent = modoRegistro
        ? "¿Ya tienes una cuenta?"
        : "¿No tienes una cuenta?";

    botonAlternar.textContent = modoRegistro
        ? "Iniciar sesión"
        : "Crear cuenta";

    mensaje.textContent = "";
    mensaje.className = "mensaje-formulario";
}

botonAlternar.addEventListener("click", alternarFormulario);

// REGISTRO
formularioRegistro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreRegistro").value.trim();
    const username = document.getElementById("usernameRegistro").value.trim();
    const password = document.getElementById("passwordRegistro").value;

    if (password.length < 8 || password.length > 72) {
        mostrarMensaje(
            "La contraseña debe tener entre 8 y 72 caracteres."
        );
        return;
    }

    try {
        const respuesta = await fetch("/api/auth/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                username,
                password
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje(
                datos.mensaje || datos.error || "No se pudo crear la cuenta."
            );
            return;
        }

        formularioRegistro.reset();

        // Volver al inicio de sesión para entrar con la nueva cuenta.
        if (modoRegistro) {
            alternarFormulario();
        }

        document.getElementById("username").value = username;

        mostrarMensaje(
            datos.mensaje || "Cuenta creada. Ya puedes iniciar sesión.",
            "success"
        );
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        mostrarMensaje("No se pudo conectar con el servidor.");
    }
});

// INICIO DE SESIÓN
formularioLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
        const respuesta = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje(
                datos.mensaje || datos.error || "No se pudo iniciar sesión."
            );
            return;
        }

        localStorage.setItem("token", datos.token);
        localStorage.setItem("usuario", JSON.stringify(datos.usuario));

        mostrarMensaje("Inicio de sesión correcto.", "success");

        window.setTimeout(() => {
            window.location.href = "/index.html";
        }, 700);
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mostrarMensaje("No se pudo conectar con el servidor.");
    }
});
