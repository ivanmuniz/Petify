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

function fetchLatestPublishedPets() {
    let url = `/api/pets/index`;
    let settings = {
        method: "GET",
        headers: {
            sessiontoken: localStorage.getItem( 'token' )
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
            displayPets( responseJSON );
        })
        .catch( err => {
            console.log( err );
        });


}

function displayPets( latestPetsList ) {
    let results = document.getElementById( 'latest-published-pets' );

    latestPetsList.forEach( pet => {
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
                    </div>
                <div>
            </div>
        `;
    });

}

async function init() {
    if( localStorage.getItem('token') ) {
        await isUserLoggedIn();
        await fetchUserInformation();
    }
    initNavBar()
    fetchLatestPublishedPets();
}

init();