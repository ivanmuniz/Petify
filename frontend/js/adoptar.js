let petsList;

async function isUserLoggedIn() {
    let url = "/api/user/validate-user";
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

function fetchPets() {
    let url = `/api/pets/`
    let settings = {
        method: "GET",
    }

    fetch( url, settings )
        .then( response => {
            if( response.ok ) {
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log( responseJSON );
            petsList = responseJSON;
            // Desplegar mascotas
            displayPets( petsList );
        })
        .catch( err => {
            console.log( err );
        })
}

function displayPets( petsList ) {
    let results = document.querySelector( '.results' );

    if( userData ) {
        // Registered user
        if( petsList.length < 1 ) {
            results.innerHTML +=
            `
                <div class="alert alert-info" role="alert">
                    No hay mascotas guardadas en la base de datos.
                </div>
            `;
        } else {
            petsList.forEach( pet => {
                results.innerHTML +=
                `
                    <div class="col-md-4 mb-5">
                        <div class="card">
                            <div class="card-body">
                                <div class="text-center">
                                    <img src="${pet.imageFileName}" width="50%"/>
                                </div>
                                <div>
                                    <strong>Nombre: </strong>${pet.name}
                                </div>
                                <div>
                                    <strong>Edad: </strong>${pet.age}
                                </div>
                                <div>
                                    <strong>Raza: </strong>${pet.breed}
                                </div>
                                <a href="/mascota?petid=${pet._id}" class="btn btn-primary btn-block">Más información</a>
                            </div>
                        <div>
                    </div> 
                `;
            });
        }
        
    } else {
        // Unregistered user
        if( petsList.length < 1 ) {
            results.innerHTML +=
            `
                <div class="alert alert-info" role="alert">
                    No hay mascotas guardadas en la base de datos.
                </div>
            `;
        } else {
            petsList.forEach( pet => {
                results.innerHTML +=
                `
                    <div class="col-md-4 mb-5">
                        <div class="card">
                            <div class="card-body">
                                <div class="text-center">
                                    <img src="${pet.imageFileName}" width="50%"/>
                                </div>
                                <div>
                                    <strong>Nombre: </strong>${pet.name}
                                </div>
                                <div>
                                    <strong>Edad: </strong>${pet.age}
                                </div>
                                <div>
                                    <strong>Raza: </strong>${pet.breed}
                                </div>
                                <a href="/mascota?petid=${pet._id}" class="btn btn-primary btn-block">Más información</a>
                            </div>
                        <div>
                    </div> 
                `;
            });
        }
    }
}

async function init() {
    if( localStorage.getItem('token') ) {
        await isUserLoggedIn();
        await fetchUserInformation();
    }
    initNavBar()

    // Obtener lista de mascotas y desplegarlas
    fetchPets();
}

init();