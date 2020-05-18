function loginCall(data) {
    console.log(data);
    let url = "/api/iniciar-sesion";
    let settings = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(url, settings)
        .then( response => {
            if(response.ok) {
                if(response.redirected) {
                    return window.location.href = response.url;
                }
            }
            throw new Error(response.statusText);
        })
        .catch( err => {
            alert(err.message);
        });
}

function watchLoginForm() {
    let loginForm = document.getElementById("form-login");
    loginForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        let email = loginForm.email.value;
        let password = loginForm.password.value;
        loginCall({email, password});
    });
}

function init() {
    watchLoginForm();
}

init();