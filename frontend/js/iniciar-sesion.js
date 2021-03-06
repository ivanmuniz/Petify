function loginCall(data) {
    console.log(data);
    let url = "/api/user/login";
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
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then (responseJSON => {
            localStorage.setItem( 'token', responseJSON.token );
            window.location.href = "/";
        })
        .catch( err => {
            alert(err.message);
        });
}

function watchLoginForm() {
    let loginForm = document.getElementById("form-login");

    loginForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        let email = loginForm.email.value.trim();
        let password = loginForm.password.value;
        loginCall({email, password});
    });
}

function init() {
    if( localStorage.getItem('token') ) {
        location.href = '/'
    }
    initNavBar();
    watchLoginForm();
}

init();