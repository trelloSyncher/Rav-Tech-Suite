const schemas = require("./mongoSchemas.js")
const mongoose = require('mongoose')
const information = require("../main/hardcoded.js")
const trelloTools = require('../main/trello-tools.js')


async function launchDB(dbName) {
    var mongoDB = `mongodb://127.0.0.1/${dbName}`;
    mongoose.connect(mongoDB, { useNewUrlParser: true });
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    
}

async function addBugToDB(boardName, bugObject, trelloId){
    await launchDB(information.bugs.DBName)
    const bugModel = mongoose.model(information.bugs.DBName, schemas.bugSchema)
    
    bugModel.create(
        {
            projectName: boardName,
            build:  bugObject.title,
            bugId: bugObject.bugId,
            title: bugObject.title,
            cardTrelloId: trelloId,
            details: bugObject.details 
            
        }
        , function (err, small) {
            if (err) return handleError(err);
            // saved!
        });
        
    }
    
    async  function findBugTrelloId(bugId){
        await launchDB(information.bugs.DBName)
        const bugModel = mongoose.model(information.bugs.DBName, schemas.bugSchema)
        
        
        var cardId;
        await bugModel.findOne({
            bugId: bugId
        },  function (err, data) {
            // console.log(data.cardTrelloId);
            cardId = data.cardTrelloId
            if (err) console.log(err);
        }); 
        return cardId 
        
    }

    
    async function findBugsByProjectName(projectNameS){
        let bugsArr = [];
        const projectName = await trelloTools.makeStr(projectNameS)
        
         await launchDB(information.bugs.DBName)
         const bugModel = await mongoose.model(information.bugs.DBName, schemas.bugSchema)
         
         await bugModel.find({projectName:projectName}, async function(err, bugs){

        }).then((bugs)=>{
            bugs.forEach(element => {
                // console.log( element);
                
                bugsArr.push({trelloId: element.cardTrelloId, bugId: element.bugId})
            });
        })
        return bugsArr
    }
   

    module.exports = {launchDB, addBugToDB, findBugsByProjectName, findBugTrelloId};