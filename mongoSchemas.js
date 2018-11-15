const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: String,
    trelloId: String,
    boardId: String,
    shortLink: String,
    listId: String,
    url: String,
    estimate: Number,
    create_date:{
        type: Date,
        default: Date.now
    }

});

  
const sprintTrackerSchema= new Schema({
    projectName: {type:String, unique:true, required:true},
    sprintNum:  {type:Number, required:true},
    startDate: {type:Date, default: Date.now},
    idealBurn:[Number],
    actualBurn: [Number]
});



module.exports = {cardSchema, sprintTrackerSchema}