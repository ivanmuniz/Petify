const express = require( 'express' );

const validateUser = require( './../middleware/validateUser' );
const pet = express.Router();

const { Pets } = require( './../models/Pet' );
const { Users } =require( './../models/User' );

pet.use( express.json() );
// pet.use( validateUser );

pet.get('/', (req, res) => {
    return res.status(200).json( { response: "Get all pets" } );
});

pet.post('/', validateUser, (req, res) => {
    let { id, name, age, type, breed, description } = req.body;
    
    if( !id ) {
        res.statusMessage = 'Falta el id del usuari que registra a la nueva mascota';
        return res.status( 406 ).end();
    }

    if( !name || !type || !breed || age === null ) {
        res.statusMessage = "Falto un dato";
        return res.status(406).end();
    }

    Users.searchUserByID( id )
        .then( user => {
            // Usuario no encontrado
            if( !user ) {
                res.statusMessage = 'Usuario no encontrado';
                return res.status(401).end();
            }

            let newPet = {
                name,
                age,
                type,
                breed,
                description,
                createdBy: user._id
            };
            console.log(newPet);

            Pets.newPet( newPet )
                .then( newPet => {
                    return res.status( 201 ).json( newPet );
                })
                .catch( err => {
                    // Err en base de datos al guardar mascota nueva
                    console.log(err);
                    res.statusMessage = 'Pet POST /: Error en base de datos al guardar mascota nueva.';
                    return res.status( 500 ).end(); 
                });
        })
        .catch( err => {
            // Error en base de datos al buscar usuario
            console.log(err);
            res.statusMessage = 'Pet POST /: Error en base de datos al buscar usuario que publica mascota.';
            return res.status( 500 ).end(); 
        });
});

pet.get('/index', (req, res) => {
    Pets.getLatestPublishedPets()
        .then( petsList => {
            return res.status( 200 ).json( petsList );
        })
        .catch( err => {
            console.log(err);
            res.statusMessage = 'Pet get /index: Error en base de datos al buscar las ultimas mascotas publicadas.';
            return res.status( 500 ).end(); 
        });
});

module.exports = pet;