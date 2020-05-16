const express = require('express');
const api = express.Router();

api.get('/', function(req, res){
   let studentList = {
      nombre: 'Pedro'
   };
   return res.status(200).json(studentList);
});

api.get('/hola', function(req, res){
   res.send('HOLA.');
});

api.post('/registrarse', (req, res) => {
   res.status(200).redirect('/about-us');
});
//export this api to use in our server.js
module.exports = api;