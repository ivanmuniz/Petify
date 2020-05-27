const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_TOKEN } = require('./../../config');

const validateUser = require( './../middleware/validateUser' );

const user = express.Router();

const { Users } = require( './../models/User' );
const { Pets } = require( './../models/Pet' );

const { Errors } = require('./../error');
 
user.get( '/validate-user', ( req, res ) => {
    const { sessiontoken } = req.headers;
 
    jwt.verify( sessiontoken, SECRET_TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
        return res.status( 200 ).json( decoded );
    });
});
 
user.post('/register', express.json(), (req, res) => {
    let { name, lastName, state, city, cellPhone, email, password } = req.body;
 
    // Verify that none of the values is empty
    if(!name || !lastName || !state || !city || !cellPhone || !email || !password) {
        res.statusMessage = "Por favor complete todos los datos";
        return res.status(406).end();
    }
 
    bcrypt.hash(password, 10)
        .then( hashedPassword => {
            let newUser = { name, lastName, state, city, cellPhone, email, password: hashedPassword };
            Users.createUser( newUser )
                .then( user => {
                    // return res.status( 201 ).json( user );
                    // TODO: Cambiar el redirect
                    return res.redirect('/iniciar-sesion').end();
                })
                .catch( err => {
                    console.log(err);
                    if(err.code === 11000) {
                        res.statusMessage = `La cuenta ${err.keyValue.email} ya está registrada`;
                        return res.status(409).end();
                    }
                return res.status(500).end();
            });
        })
        .catch( err => {
            Errors.generalError();
        });
 });
 
 
 
user.post('/login', express.json(), (req, res) => {
    let { email, password } = req.body;
 
    // Verify that email and password are not empty
    if(!email || !password) {
        res.statusMessage = "Por favor ingrese todos los datos";
        return res.status(406).end();
    }
 
    Users.searchUserByMail( email )
        .then( user => {
            if( user ) {
                bcrypt.compare(password, user.password)
                    .then( result => {
                        if( result ) {
                            let userData = {
                                firstName : user.name,
                                lastName : user.lastName,
                                id : user.id,
                                email : user.email,
                            };
                            jwt.sign( userData, SECRET_TOKEN, { expiresIn: '15m'}, ( err, token ) => {
                                if( err ) {
                                    res.statusMessage = "Something went wrong with generating the token.";
                                    return res.status( 400 ).end();
                                }
                                return res.status( 200 ).json( {token} );
                            });
                        }
                        else {
                            // Wrong password
                            res.statusMessage = "Contraseña incorrecta";
                            return res.status(401).end();
                        }
                    })
                    .catch( err => {
                        Errors.generalError();
                    });
            }
            else {
                res.statusMessage = "Usuario no registrado";
                return res.status(401).end();
            }
        })
        .catch( err => {
            res.statusMessage = 'Something is wrong with the Database. Try again later.';
            return res.status(500).end();
        });
});
 
user.get('/:id', validateUser, (req, res) => {
    let id = req.params.id;
 
    Users.searchUserByID(id)
        .then( user => {
            console.log(user)
            if(user) {
                let userData = {
                    firstName : user.name,
                    lastName : user.lastName,
                    state : user.state,
                    city : user.city,
                    cellPhone : user.cellPhone,
                    email : user.email
                };
                return res.status(200).json(userData);
            }
            res.statusMessage = `Usuario con id: ${id} no encontrado`;
            return res.status(404).end();
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});
 
user.patch('/:id', [validateUser, express.json()], (req, res) => {
    let paramsID = req.params.id;
    let bodyID = req.body.id;
    let updatesInUser = req.body.user;
 
    if( !bodyID ) { 
        res.statusMessage = "The 'id' is missing in the body of the request";
        return res.status(406).end();
    }
 
    if( paramsID !== bodyID ) {
        res.statusMessage = "The 'id' send in the body doesn't match with the one in the parameters";
        return res.status(409).end();
    }
    
    // console.log(updatesInUser);
    Users.updateUser(bodyID, updatesInUser)
        .then( (result) => {
            let userData = {
                firstName : result.name,
                lastName : result.lastName,
                state : result.state,
                city : result.city,
                cellPhone : result.cellPhone,
                email : result.email
            };
            return res.status(202).json(userData);
        })
        .catch( (err) => {
            res.statusMessage = 'Something is wrong with the Database. Try again later.';
            return res.status(500).end();
        });
});

user.get('/:id/mypets', (req, res) => {
    let id = req.params.id;

    Users.searchUserByID( id )
        .then( user => {
            if( !user ) {
                res.statusMessage = 'User GET /:id/mypets: Usuario no encontrado';
                return res.status(401).end();
            }
            let _id = user._id;

            Pets.getPetsByUser( _id )
                .then( listOfPets => {
                    return res.status(200).json(listOfPets);
                })
                .catch( err => {
                    console.log(err);
                    res.statusMessage = `User GET /:id/mypets: Error Pets.getPetsByUser()`;
                    return res.status(500).end();
                })

        })
        .catch( err => {
            console.log(err);
            res.statusMessage = 'User GET /:id/mypets: Error Users.searchUserByID()';
            return res.status(500).end();
        });
});

module.exports = user;