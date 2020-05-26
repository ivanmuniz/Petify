const mongoose = require('mongoose');
const uuid = require('uuid');

const userSchema = new mongoose.Schema({
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

const userModel = mongoose.model("User", userSchema);

const Users = {
    createUser : (user) => {
        return userModel.create(user)
            .then( user => {
                return user;
            })
            .catch( err => {
                console.log(err);
                throw {code: err.code, keyValue: err.keyValue};
            });
    },
    searchUserByMail : (email) => {
        return userModel.findOne({email})
            .then( user => {
                return user;
            })
            .catch( err => {
                throw new Error(err);
            });
    },
    searchUserByID : (id) => {
        return userModel.findOne({id})
            .then( user => {
                return user;
            })
            .catch( err => {
                throw new Error(err);
            });
    },
    updateUser : (id, user) => {
        return userModel.findOneAndUpdate( { id }, { $set: user }, { new: true }  )
        .then( (result) => {
            return result;
        })
        .catch( (err) => {
            return err;
        })
    }
};

module.exports = { Users };