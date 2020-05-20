function isUserLoggedIn() {
    let url = "/api/validate-user";
    let settings = {
        method : 'GET',
        headers : {
            sessiontoken : localStorage.getItem( 'token' )
        }
    };

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            localStorage.setItem("firstName", responseJSON.firstName);
            localStorage.setItem("lastName", responseJSON.lastName);
            localStorage.setItem("id", responseJSON.id);
            localStorage.setItem("email", responseJSON.email);
            // TODO: Remove initNavBar() from here once the fetch is made sync
            initNavBar()
        })
        .catch( err => {
            // Sesion expired
            localStorage.clear();
            // TODO: Remove initNavBar() from here once the fetch is made sync
            initNavBar()
        });
}

function init() {
    isUserLoggedIn();
    // TODO: Wait to isUserLoggedIn() to finish to run initNavBar()
    // initNavBar()
}

init();