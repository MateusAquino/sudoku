const mongoose = require('../database');
const { Schema } = require('mongoose');

const expireTimeout = 36 * 60 * 60 * 1000; // 36h de inatividade

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

    history: [Schema.Types.Mixed],

    expires: {
        type: Date,
        default: new Date(+new Date() + expireTimeout)
    }
});

const Session = mongoose.model('Session', SessionSchema);
Session.expireTimeout = expireTimeout;

module.exports = Session;