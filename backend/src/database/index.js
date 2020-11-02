const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sudoku', { useMongoClient: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;