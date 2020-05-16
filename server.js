const express = require( 'express' );
const morgan = require( 'morgan' );
const mongoose = require( 'mongoose' );

const api = require( './backend/api' );
const { DATABASE_URL, PORT } = require( './config' );

const app = express();


app.use( morgan('dev'));

// Route: localhost/api
// This will handle all the REST API calls from the frontend
app.use('/api', api);

// This will serve all static files from the frontend
// HTML, CSS, JS
// app.use( express.static( path.join( __dirname, 'frontend/html' ), {extensions: ['html']} ) );
app.use( express.static('frontend/html', {extensions: ['html']}) );
app.use( express.static('frontend/css') );
app.use( express.static('frontend/js') );
app.use( express.static('node_modules/bootstrap/dist') );
app.use( express.static('node_modules/@fortawesome/fontawesome-free') );

app.listen( PORT, () => {
    console.log( "Server running in port 80" );

    const settings = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    };

    new Promise( ( resolve, reject) => {
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ) { 
                return reject( err );
            }
            else {
                console.log( "Database connected succesfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});