const express = require('express');
const bcrypt = require('bcrypt');

const api = express.Router();

const { Users } = require('./models/usersModel');

api.get('/', (req, res) => {
   let studentList = {
      nombre: 'Pedro'
   };
   return res.status(200).json(studentList);
});

api.get('/hola', (req, res) => {
   res.send('HOLA.');
});

api.post('/registrarse', express.json(), (req, res) => {
   const saltRounds = 10;
   let { name, lastName, state, city, cellPhone, email, password } = req.body;

   if(!name || !lastName || !state || !city || !cellPhone || !email || !password) {
      res.statusMessage = "Por favor complete todos los datos";
      return res.status(406).end();
   }

   bcrypt.hash(password, saltRounds, (err, hash) => {
      if(err) {
         res.statusMessage = "Algo salio mal. Por favor, intentelo de nuevo";
         return res.status(500).end();
      }

      let newUser = { name, lastName, state, city, cellPhone, email, password: hash }

      Users.createUser(newUser)
      .then( user => {
         return res.redirect('/').end();
      })
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

//export this api to use in our server.js
module.exports = api;