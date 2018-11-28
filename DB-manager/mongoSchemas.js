const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: String,
    trelloId: String,
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
    sprintDay: {type:Number, default:0}, 
    startDate: {type:Date, default: Date.now},
    idealBurn:[Number],
    actualBurn: [Number]
});

const bugSchema = new Schema({
    projectName: String,
    build: String,
	bugId: {type:String, unique:true, required:true},
	title: String,
    cardTrelloId: String,
	details: String 
    
})

module.exports = {cardSchema, sprintTrackerSchema, bugSchema}