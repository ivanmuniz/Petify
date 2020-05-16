function loadNavBar() {
    let navbar = 
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
    let navElement = document.getElementById("navbar");
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

loadNavBar();
watchHamburguerMenu();