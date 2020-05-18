const express = require('express');
const bcrypt = require('bcrypt');

const api = express.Router();

const { Users } = require('./models/User');
const { Errors } = require('./error');

api.get('/', (req, res) => {
   let studentList = {
      nombre: 'Pedro'
   };
   return res.status(200).json(studentList);
});



api.post('/registrarse', express.json(), (req, res) => {
   const saltRounds = 10;
   let { name, lastName, state, city, cellPhone, email, password } = req.body;

   // Verify that none of the values is empty
   if(!name || !lastName || !state || !city || !cellPhone || !email || !password) {
      res.statusMessage = "Por favor complete todos los datos";
      return res.status(406).end();
   }

   bcrypt.hash(password, saltRounds, (err, hash) => {
      // Handle error hashing the password
      if(err) {
         Errors.generalError();
      }

      let newUser = { name, lastName, state, city, cellPhone, email, password: hash }

      Users.createUser(newUser)
         .then( user => {
            // User registered
            // TODO: Create user session

            // Redirect user to homepage
            return res.redirect('/').end();
         })
         // Handle error from db
         .catch( err => {
            console.log(err);
            if(err.code === 11000) {
               res.statusMessage = `La cuenta ${err.keyValue.email} ya está registrada`;
               return res.status(409).end();
            }
            return res.status(500).end();
         });
   });
});



api.post('/iniciar-sesion', express.json(), (req, res) => {
   let { email, password } = req.body;

   // Verify that email and password are not empty
   if(!email || !password) {
      res.statusMessage = "Por favor ingrese todos los datos";
      return res.status(406).end();
   }

   Users.login(email)
      .then( user => {
         // User is registered
         if(user) {
            bcrypt.compare(password, user.password, (err, result) => {
               if(err) {
                  Errors.generalError();
               }

               // Succesful login
               if(result) {
                  // TODO: Create user session

                  
                  // Redirect user to homepage
                  return res.redirect("/");
               }
               // Wrong password 
               else {
                  res.statusMessage = "Contraseña incorrecta";
                  return res.status(401).end();
               }
            });
         }
         // User is not registered
         else {
            res.statusMessage = "Usuario no registrado";
            return res.status(401).end();
         }
      })
      // Handle error from db
      .catch( err => {
         res.statusMessage = 'Something is wrong with the Database. Try again later.';
         return res.status(500).end();
      });
});

//export this api to use in our server.js
module.exports = api;