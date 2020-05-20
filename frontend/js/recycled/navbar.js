function loadNavBar( userData ) {
    let navElement = document.getElementById("navbar");
    let navbar;
    if( userData.isLogin ) {
        navbar = 
        `
            <div class="container">
                <div class="logo">
                    <a href="/">
                        <i class="fas fa-paw"></i>
                        Petyfi
                    </a>
                </div>

                <div class="hamburguer">
                    <a class="hamburguer-button">
                        <i class="fas fa-bars"></i>
                    </a>
                </div>

                <div class="hamburguer-hide">
                    <div>
                        <a href="./sobre-nosotros">Sobre nosotros</a>
                    </div>
                    <div>
                        <a href="./adoptar">Adoptar</a>
                    </div>
                    <div class="right">
                        <a href="#">${userData.firstName} ${userData.lastName}</a>
                    </div>
                    <div>
                        <a href="/" id="logout-btn">Cerrar sesion</a>
                    </div>
                </div>
            </div>
        `;
    }
    else {
        navbar = 
        `
            <div class="container">
                <div class="logo">
                    <a href="/">
                        <i class="fas fa-paw"></i>
                        Petyfi
                    </a>
                </div>

                <div class="hamburguer">
                    <a class="hamburguer-button">
                        <i class="fas fa-bars"></i>
                    </a>
                </div>

                <div class="hamburguer-hide">
                    <div>
                        <a href="./sobre-nosotros">Sobre nosotros</a>
                    </div>
                    <div>
                        <a href="./adoptar">Adoptar</a>
                    </div>
                    <div class="right">
                        <a href="./iniciar-sesion">Iniciar sesión</a>
                    </div>
                    <div>
                        <a href="./registrarse">Registrarse</a>
                    </div>
                </div>
            </div>
        `;
    }
    navElement.innerHTML = navbar;
}

function watchHamburguerMenu() {
    let hamburguerBtn = document.querySelector(".hamburguer-button");
    hamburguerBtn.addEventListener("click", (ev) => {

        let menu = document.querySelector(".hamburguer-hide");
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
            menu.style.flexDirection = "column";
        }
    });
}

function logout() {
    localStorage.removeItem("token");
}

function verifyUser() {
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
            loadNavBar( responseJSON );
            watchLogout();
            watchHamburguerMenu();
        })
        .catch( err => {
            loadNavBar( {isLogin: false} );
            watchHamburguerMenu();
        });
}

function watchLogout() {
    let logoutBtn = document.querySelector('#logout-btn');
    logoutBtn.addEventListener("click", ev =>{
        logout();
    });
}

function initNavBar() {
    verifyUser();
}