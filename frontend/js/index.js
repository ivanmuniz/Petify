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
            }
        });
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

async function init() {
    await isUserLoggedIn();
    await fetchUserInformation();
    initNavBar()
}

init();