let myPublishedPetsList;

// Verifies if user session is up, if not clear the localStorage and redirects to home.
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

function saveNewPet( data, form ) {
    let url = `/api/pets/`

    let formData = new FormData();
    formData.append( 'id', localStorage.getItem('id') );
    formData.append( 'name', form.name.value);
    formData.append( 'age', form.age.value);
    formData.append( 'type', form.type.value);
    formData.append( 'breed', form.breed.value);
    formData.append( 'description', form.description.value);
    formData.append( 'picture', form.fotoMascota.files[0]);

    console.log(formData);

    let settings = {
        method: "POST",
        headers: {
            sessiontoken: localStorage.getItem( 'token' ),
            // "Content-Type": "application/json"
            // "Content-Type": "multipart/form-data"
        },
        body: formData
    }

    fetch( url, settings )
        .then( response => {
            if( response.ok ) {
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON);
            myPublishedPetsList.push( responseJSON );
            displayPublishedPets( [responseJSON] );
            form.reset();
        })
        .catch( err => {
            console.log(err);
            if( err.code === 400 ) {
                localStorage.clear();
                window.location.href = "/";
            }
        });
}

function watchNewPetForm() {
    let form = document.getElementById( 'form-publicar-mascota' );
    form.addEventListener( 'submit', (ev) => {
        ev.preventDefault();
        let name = form.name.value,
            age = Number(form.age.value),
            type = form.type.options[this.type.selectedIndex].innerText;
            breed = form.breed.value,
            description = form.description.value,
            fotoMascota = form.fotoMascota.files[0];

        // console.log(fotoMascota);
        let id = localStorage.getItem('id');

        // console.log( { id, name, age, type, breed, description, fotoMascota } );
        saveNewPet( { id, name, age, type, breed, description, fotoMascota }, form );
    });
}

function fetchMyPublishedPets() {
    let id = localStorage.getItem( 'id' );
    let url = `/api/user/${id}/mypets`;

    let settings = {
        method: "GET",
        headers: {
            sessiontoken: localStorage.getItem( 'token' ),
        }
    };

    fetch( url, settings )
        .then( response => {
            if( response.ok ) {
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            // console.log( responseJSON );
            myPublishedPetsList = responseJSON;
            displayPublishedPets( responseJSON );
        })
        .catch( err => {
            console.log( err );
        });


}

function displayPublishedPets( myPublishedPets ) {
    let results = document.getElementById( 'published-pets-container' );

    myPublishedPets.forEach( pet => {
        results.innerHTML += 
        `
            <div class="col-sm-6 col-md-3 mb-5">
                <div class="card">
                    <div class="">
                        <button type="button" class="close mr-3 mt-1">
                            <span id="delete" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="text-center">
                            <img src="${pet.imageFileName}" width="50%"/>
                        </div>
                        <div>
                            <strong>Nombre:</strong> <span class="name">${pet.name}</span>
                        </div>
                        <div>
                            <strong>Edad: </strong>${pet.age}
                        </div>
                        <div>
                            <strong>Raza: </strong>${pet.breed}
                        </div>
                    </div>
                <div>
            </div>
        `;
    });
}

function deletePublishedPet( id, imageFileName, el ) {
    let url = `/api/pets/${id}`;
    let settings = {
        method: 'DELETE',
        headers: {
            sessiontoken: localStorage.getItem( 'token' ),
            "Content-Type": "application/json"
        },
        body: JSON.stringify( { imageFileName } )
    }

    fetch( url, settings )
        .then( response => {
            if( response.ok ) {
                el.parentNode.removeChild(el);
                myPublishedPetsList = myPublishedPetsList.filter( (pet) => {
                    return pet.id !== id;
                });
                return;
            }
            throw new Error( response.statusText );
        })
        .catch( err => {
            console.log(err);
        });
}


function watchResults() {

    let results = document.getElementById("published-pets-container");

    results.addEventListener("click", ev => {
        
        if(ev.target.matches('#delete')) {

            let response = confirm("Seguro que desea eliminar esta mascota?");

            if( response ) {
                // Delete pet
                let el = ev.target.parentNode.parentNode.parentNode.parentNode;
                let petName = el.querySelector('.name').innerText;
                let pet = myPublishedPetsList.find( (aux) => {
                    if( petName === aux.name) {
                        return true;
                    }
                });

                deletePublishedPet( pet.id, pet.imageFileName, el );
            }
        }
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

    // Form nueva mascota
    watchNewPetForm();

    // Obtener mis mascotas publicadas
    fetchMyPublishedPets();
    watchResults();
}

init();