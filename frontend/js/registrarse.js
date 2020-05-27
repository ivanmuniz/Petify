
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
                    return window.location.href = response.url;
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
        let name = registerForm.name.value,
            lastName = registerForm['last-name'].value,
            estado = registerForm.state.options[state.selectedIndex].value,
            city = registerForm.city.value,
            cellPhone = registerForm['cell-phone'].value,
            email = registerForm.email.value,
            password = registerForm.password.value;

        postData({name, lastName, state: estado, city, cellPhone, email, password});
    });
}

function init() {
    if( localStorage.getItem('token') ) {
        location.href = '/'
    }
    initNavBar();
    watchRegisterForm();
}

init();