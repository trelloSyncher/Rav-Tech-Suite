const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: String,
    trelloId: {type:String, unique:true, required:true},
    listId: String,
    url: String,
    estimate: Number,
    create_date:{
        type: Date,
        default: Date.now
    }

});


  
const sprintTrackerSchema= new Schema({
    projectName: {type:String, required:true},
    sprintName:  {type:String, required:true},
    sprintDay: {type:Number, default:1}, 
    numberOfWeek: Number,
    startDate: {type:Date, default: Date.now},
    idealBurn: [Number],
    actualBurn:[]
});

const bugSchema = new Schema({
    projectName: String,
    build: String,
	bugId: {type:String, unique:true, required:true},
	title: String,
    cardTrelloId: String,
	details: String 
    
})
// module.exports = mongoose.model('sprint Tracker', sprintTrackerSchema)
// module.exports = mongoose.model('sprint Tracker', sprintTrackerSchema)
module.exports = {cardSchema, sprintTrackerSchema, bugSchema}