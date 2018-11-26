// var schemasAndModels = require("./mongoSchemas.js")
const mongoose = require('mongoose')




function launchDB(dbName) {
    var mongoDB = `mongodb://127.0.0.1/${dbName}`;
    mongoose.connect(mongoDB, { useNewUrlParser: true });
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

}

module.exports = {launchDB};