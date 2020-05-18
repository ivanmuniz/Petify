const mongoose = require('mongoose');
const uuid = require('uuid');

const usersSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        default: uuid.v4
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    cellPhone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const usersModel = mongoose.model("User", usersSchema);

const Users = {
    createUser : (user) => {
        return usersModel.create(user)
            .then( user => {
                return user;
            })
            .catch( err => {
                console.log(err);
                throw {code: err.code, keyValue: err.keyValue};
            });
    }
};

module.exports = { Users };