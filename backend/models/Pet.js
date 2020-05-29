const mongoose = require( 'mongoose' );
const uuid = require( 'uuid' );

const petSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        default: uuid.v4
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    },
    imageFileName: {
        type: String,
        default: '/no-pet-image.png'
    }
});

const petModel = mongoose.model("Pet", petSchema);

const Pets = {
    newPet: ( pet ) => {
        return petModel.create( pet )
            .then( newPet => {
                return newPet;
            })
            .catch( err => {
                throw err;
            });
    },

    getPetsByUser: ( userID ) => {
        return petModel.find( { createdBy: userID })
            .then( result => {
                return result;
            })
            .catch( err => {
                throw err;
            });
    },
    
    getLatestPublishedPets: () => {
        return petModel.find().sort( { dateCreated: -1 } ).limit( 9 )
            .then( result => {
                return result;
            })
            .catch( err => {
                throw err;
            });
    },

    deletePetByID: ( id ) => {
        return petModel.deleteOne( { id })
            .then( result => {
                return result;
            })
            .catch( err => {
                throw err;
            });
    },
    
    getAllPets: () => {
        return petModel.find()
            .populate( 'createdBy', ['name', 'lastName', 'cellPhone', 'email'])
            .then( result => {
                console.log("SERVER: ", result);
                return result;
            })
            .catch( err => {
                throw err;
            })
    },

    getPetByID: ( _id ) => {
        return petModel.findById( _id )
            .populate( 'createdBy', ['name', 'lastName', 'cellPhone', 'email'])
            .then( result => {
                return result;
            })
            .catch( err => {
                throw err;
            })
    }
}

module.exports = {
    Pets
};