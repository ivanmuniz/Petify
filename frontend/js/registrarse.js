
function postData(data) { 
    console.log(data);
    let url = "/api/registrarse"
    let settings = {
        method: "POST",
        redirect: "follow",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    fetch(url, settings)
        .then( response => {
            // console.log(response)
            if(response.ok) {
                if(response.redirected) {
                    window.location.href = response.url;
                    return;
                }
            }
            throw new Error(response.statusText);
        })
        .catch( err => {
            alert(err.message);
        });
}

function watchRegisterForm() {
    let registerForm = document.getElementById("form-register");
    registerForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        let name = registerForm.name.value;
        let lastName = registerForm['last-name'].value;
        let estado = registerForm.state.options[state.selectedIndex].value;
        let city = registerForm.city.value;
        let cellPhone = registerForm['cell-phone'].value;
        let email = registerForm.email.value;
        let password = registerForm.password.value;
        // console.log({name, lastName, state: estado, city, cellPhone, email, password});
        postData({name, lastName, state: estado, city, cellPhone, email, password});
    });
}

function init() {
    watchRegisterForm();
}

init();