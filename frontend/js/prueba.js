const URL = "http://localhost/api";

const setting = {
    method: 'GET',
}

const init = () => {
    fetch(URL, setting)
        .then( (response) => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( (responseJSON) => {
            console.log(responseJSON)
            let res = document.getElementById("nombre");
            res.innerHTML = `${responseJSON.nombre}` 
        })
        .catch( err => {
            console.log(err);
        });
}

init();