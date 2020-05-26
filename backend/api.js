const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_TOKEN } = require('./../config');

const api = express.Router();

const { Users } = require('./models/User');
const { Errors } = require('./error');

function validateUser(req, res, next) {
   const { sessiontoken } = req.headers;
   if( !sessiontoken ) {
      res.statusMessage = "Session token missing in headers";
      return res.status(406).end();
   }
   jwt.verify( sessiontoken, SECRET_TOKEN, ( err, decoded ) => {
      if( err ){
         res.statusMessage = "Session expired!";
         return res.status( 400 ).end();
      }
      next();
   });
}

api.get( '/validate-user', ( req, res ) => {
   const { sessiontoken } = req.headers;

   jwt.verify( sessiontoken, SECRET_TOKEN, ( err, decoded ) => {
      if( err ){
         res.statusMessage = "Session expired!";
         return res.status( 400 ).end();
      }

      return res.status( 200 ).json( decoded );
   });
});

api.post('/registrarse', express.json(), (req, res) => {
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



api.post('/iniciar-sesion', express.json(), (req, res) => {
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
                     // TODO: Create user sesion
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
                     })
                  }
                  else {
                     // Wrong password
                     res.statusMessage = "Contraseña incorrecta";
                     return res.status(401).end();
                  }
               })
               .catch( err => {
                  Errors.generalError();
               })
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

api.get('/user/:id', validateUser, (req, res) => {
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

api.patch('/user/:id', [validateUser, express.json()], (req, res) => {
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

//export this api to use in our server.js
module.exports = api;