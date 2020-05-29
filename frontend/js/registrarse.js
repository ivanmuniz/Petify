
function postData(data) { 
    console.log(data);
    let url = "/api/user/register"
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
        let name = registerForm.name.value.trim(),
            lastName = registerForm['last-name'].value.trim(),
            estado = registerForm.state.options[state.selectedIndex].text.trim(),
            city = registerForm.city.value.trim(),
            cellPhone = registerForm['cell-phone'].value.trim(),
            email = registerForm.email.value.trim(),
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