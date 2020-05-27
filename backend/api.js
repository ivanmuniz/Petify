const express = require('express');
const api = express.Router();

const userRoute = require( './routes/user' );
const petRoute = require( './routes/pet' )

api.use('/user', userRoute);
api.use('/pets', petRoute);

//export this api to use in our server.js
module.exports = api;