const formulario = document.getElementById("formLogin");

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const mensaje =
        document.getElementById("mensajeLogin");

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

            mensaje.textContent =
                datos.error || "No se pudo iniciar sesión.";

            mensaje.className =
                "mensaje-formulario error";

            return;
        }

        localStorage.setItem(
            "token",
            datos.token
        );

        localStorage.setItem(
            "usuario",
            JSON.stringify(datos.usuario)
        );

        mensaje.textContent =
            "Inicio de sesión correcto.";

        mensaje.className =
            "mensaje-formulario success";

        setTimeout(() => {

            window.location.href = "/index.html";

        }, 700);

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "No se pudo conectar con el servidor.";

        mensaje.className =
            "mensaje-formulario error";
    }
});
