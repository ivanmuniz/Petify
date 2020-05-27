const jwt = require( 'jsonwebtoken' );
const { SECRET_TOKEN } = require('./../../config');

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

 module.exports = validateUser;