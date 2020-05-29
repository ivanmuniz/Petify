let results = document.querySelector(".results");

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

function loadPet() {
    const urlParams = new URLSearchParams(window.location.search);
    const petID = urlParams.get('petid');
    console.log(petID);

    if( !petID ) {
        location.href = "/";
    }

    let url = `/api/pets/${petID}`;
    let settings = {
        method: "GET",
        headers: {
            sessiontoken: localStorage.getItem( 'token' )
        }
    }

    fetch( url, settings )
        .then( response => {
            if( response.ok ) {
                return response.json();
            }
            throw response
        })
        .then( pet => {
            console.log(pet);
            displayPet(pet);
        })
        .catch( err => {
            console.log( err );
            if( err.status === 404 ) {
                results.innerHTML =
                `
                    <div class="alert alert-danger" role="alert">
                        Mascota no encontrada.
                    </div> 
                `;
            }
            else if( err.status === 500 ) {
                results.innerHTML =
                `
                    <div class="alert alert-danger" role="alert">
                        ${err.statusText}
                    </div> 
                `;
            }

        });
}

function displayPet( pet ) {
    if( userData ) {
        // Registered user
        document.querySelector( '.pageTitle' ).innerText = `${pet.name}`
        results.querySelector( '.petName' ).innerText = pet.name;
        results.querySelector( '.petImg' ).innerHTML = 
        `
            <div>
                <img src="${pet.imageFileName}" width="100%" height="500">
            </div>
        `;
        results.querySelector( '.petAge' ).innerText = pet.age;
        results.querySelector( '.petType' ).innerText = pet.type;
        results.querySelector( '.petBreed' ).innerText = pet.breed;
        if( pet.description ) {
            results.querySelector('.petDescriptionContainer').innerHTML = `<h4>Descripción: <span class="petDescription">${pet.description}</span> </h4>`;
        }
        results.querySelector( '.btnContainer' ).innerHTML = `<button class="btn btn-primary btn-block">Contactar dueño</button>`;
        results.querySelector( '.btn.btn-primary.btn-block' ).addEventListener("click", (ev) => {
            results.querySelector( '.ownerInfoContainer' ).innerHTML = 
            `   
                <h3 class="mt-3 mb-4 font-weight-bold">Datos de contacto</h3>
                <h4>${pet.createdBy.name} ${pet.createdBy.lastName}</h4>
                <h4><a href="mailto:${pet.createdBy.email}">${pet.createdBy.email}</a></h4>
                <h4>${pet.createdBy.cellPhone}</h4>
            `;
        })
    } else {
        // Unregistered user
        document.querySelector( '.pageTitle' ).innerText = `${pet.name}`
        results.querySelector( '.petName' ).innerText = pet.name;
        results.querySelector( '.petImg' ).innerHTML = `<img src="${pet.imageFileName}" width="500" height="500">`;
        results.querySelector( '.petAge' ).innerText = pet.age;
        results.querySelector( '.petType' ).innerText = pet.type;
        results.querySelector( '.petBreed' ).innerText = pet.breed;
        if( pet.description ) {
            results.querySelector('.petDescriptionContainer').innerHTML = `<h4>Descripción: <span class="petDescription">${pet.description}</span> </h4>`;
        }
        results.querySelector( '.btnContainer' ).innerHTML = `<a href="/iniciar-sesion" class="btn btn-primary btn-block">Contactar dueño</a>`;
    }
}

async function init() {
    if( localStorage.getItem('token') ) {
        await isUserLoggedIn();
        await fetchUserInformation();
    }
    initNavBar();

    loadPet();
}

init();