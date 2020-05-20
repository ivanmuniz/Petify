
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

const init = () => {
    verifyUser();
}

init();