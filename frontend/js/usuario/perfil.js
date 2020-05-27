// Verifies if user session is up, if not clear the localStorage and redirects to home.
async function isUserLoggedIn() {
    let url = "/api/validate-user";
    let settings = {
        method : 'GET',
        headers : {
            sessiontoken : localStorage.getItem( 'token' )
        }
    };

    await fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw { code: response.status, statusText: response.statusText };
        })
        .then( responseJSON => {
            localStorage.setItem("id", responseJSON.id);
            localStorage.setItem("email", responseJSON.email);
        })
        .catch( err => {
            // Sesion expired
            if( err.code === 400 ) {
                localStorage.clear();
                window.location.href = "/";
            }
        });
}

function displayUserInfo(userInfo) {
    let name = document.querySelector('.user-name');
    let state = document.querySelector('.user-state');
    let city = document.querySelector('.user-city');
    let cellPhone = document.querySelector('.user-cell-phone');
    let email = document.querySelector('.user-email');

    name.innerHTML = `${userInfo.firstName} ${userInfo.lastName}`;
    state.innerHTML = userInfo.state;
    city.innerHTML = userInfo.city;
    cellPhone.innerHTML = userInfo.cellPhone;
    email.innerHTML = userInfo.email;

    let form = document.getElementById("form-update-user");
    form.name.value = userInfo.firstName;
    form.lastName.value = userInfo.lastName;
    let options = form.state.options;
    for( let i = 0 ; i < options.length ; i++) {
        if( options[i].innerHTML === userInfo.state ) {
            options[i].selected = true;
            break;
        }
    }
    form.city.value = userInfo.city;
    form.cellPhone.value = userInfo.cellPhone;
}

async function fetchUserInformation() {
    let url = `/api/user/${localStorage.getItem("id")}`;
    let settings = {
        method : 'GET',
        headers : {
            sessiontoken : localStorage.getItem( 'token' )
        } 
    };
    await fetch(url, settings)
        .then( response => {
            if( response.ok ) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( responseJSON => {
            userData = responseJSON;
        })
        .catch( err => {
            console.log(err);
        })
}

function updateUserInfo() {
    // Obtener información modificada
    let id = localStorage.getItem('id');
    let form = document.getElementById("form-update-user");
    let name = form.name.value,
        lastName = form.lastName.value,
        state = form.state.options[this.state.selectedIndex].innerHTML,
        city = form.city.value,
        cellPhone = form.cellPhone.value;
    
    let updatedInfo = {
        id,
        user: {
            ...( name ? { name } : {} ),
            ...( lastName ? { lastName } : {} ),
            ...( state ? { state } : {} ),
            ...( city ? { city } : {} ),
            ...( cellPhone ? { cellPhone } : {} )
        }
    };

    // Llamada fetch
    let url = `/api/user/${id}`;
    let settings = {
        method: "PATCH",
        headers: {
            sessiontoken: localStorage.getItem( "token" ),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedInfo)
    }

    fetch(url, settings)
        .then( response => {
            if( response.ok ) {
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            userData = responseJSON;
            displayUserInfo( responseJSON );
            initNavBar();
        })
        .catch( err => {

        });

}

function watchUpdateForm() {
    let btnActualizar = document.getElementById('btn-actualizar');
    btnActualizar.addEventListener("click", ev => {
        updateUserInfo();
    });
}

async function init() {
    // Verifica que la sesión del usuario siga activa
    await isUserLoggedIn();

    // Obtener la información del usuario
    await fetchUserInformation();
    console.log("UD: ", userData)
    initNavBar();
    // Desplegar la información del usuario 
    displayUserInfo(userData)

    // Actualizar la información del usuario
    watchUpdateForm();
}

init();