const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        require: true,
        uppercase: true
    },

    gameBoard: {
        type: String,
        default: ".".repeat(81)
    },

    userBoard: {
        type: String,
        default: ".".repeat(81)
    },

    history: {
        type: [[Number, String]],
        default: []
    },

    expires: {
        type: Date,
        default: +new Date() + 24*60*6000
    }
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;