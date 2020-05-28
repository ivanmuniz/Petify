const express = require( 'express' );
const multer = require( 'multer' );
const path = require( 'path' );
const fs = require( 'fs' );

const validateUser = require( './../middleware/validateUser' );
const pet = express.Router();
const upload = multer( {
    dest: './frontend/images/pet-images-uploads',
    fileFilter: (req, file, cb) => {
        let { id, name, age, type, breed } = req.body;
        if( !id || !name || !type || !breed || age === null ) {
            return cb(null, false);
        }
        return cb(null, true);
    }
} );

const { Pets } = require( './../models/Pet' );
const { Users } =require( './../models/User' );

pet.use( express.json() );
// pet.use( validateUser );

pet.get('/', (req, res) => {
    return res.status(200).json( { response: "Get all pets" } );
});

pet.post('/', validateUser, upload.single('picture'), (req, res) => {

    let { id, name, age, type, breed, description } = req.body;

    let imageRoute;
    if( req.file ) {
        imageRoute = `/pet-images-uploads/${req.file.filename}`;
    }
    
    if( !id ) {
        res.statusMessage = 'Falta el id del usuario que registra a la nueva mascota';
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
                createdBy: user._id,
                ...( imageRoute ? { imageFileName: imageRoute } : {} )
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
            res.statusMessage = 'Pet GET /index: Error en base de datos al buscar las ultimas mascotas publicadas.';
            return res.status( 500 ).end(); 
        });
});

pet.delete('/:id', validateUser, (req, res) => {
    let id = req.params.id;
    let { imageFileName } = req.body;

    if( !imageFileName ) {
        res.statusMessage = "Image file name to delete missing.";
        return res.status(406).end();
    }

    Pets.deletePetByID(id)
        .then( result => {
            if(result.deletedCount === 0) {
                res.statusMessage = `There is no pet with id=${id}`;
                return res.status(404).end();
            }
            if( imageFileName !== "/no-pet-image.png") {
                fs.unlink( path.join(__dirname, `../../frontend/images/${imageFileName}`), err => {
                    if (err) {
                        throw err ;
                    }
                    console.log('Pet image deleted');
                });
            }
            return res.status(200).end();
        })
        .catch( err => {
            console.log(err);
            res.statusMessage = 'Pet DELETE /:id: Error en base de datos al eliminar mascota.';
            return res.status( 500 ).end(); 
        });
    return res.status(200).end();
})

module.exports = pet;