const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likedme: {
        type: Array,
        required: true
    },
    iliked: {
        type: Array,
        required: true
    },
    idisliked: {
        type: Array,
        required: true
    },
    matches: {
        type: Array,
        required: true
    }
});

const user = mongoose.model('users', userSchema);

module.exports = user;