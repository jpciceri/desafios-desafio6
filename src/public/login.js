const loginUser = async () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/sessions/login/", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });


        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
            return;
        }

        const data = await response.json();
        console.log(data);

        if (data.status === "OK") {
            console.log("inicio de sesión exitosa");
            window.location.href = "/products";
        } else {
            console.log('Fallo al iniciar sesión');
        }
    } catch (error) {
        console.log('Error en la petición', error);
    }
};

document.getElementById("btnLogIn").onclick = loginUser;