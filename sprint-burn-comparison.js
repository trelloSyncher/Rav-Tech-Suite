const request = require("request");
// const promiseRequest = require('request-promise');
const axios = require("axios");
const information = require("./main/hardcoded.js")
const key = information.key;
const token = information.token;
const idOrganization = information.idOrganization
var trelloTolls = require("./sprint-first-step.js")
var schemas = require("./DB-manager/mongoSchemas.js")
// var mongoose = schemas.mongoose
const mongoose = require('mongoose')
// const Schema = mongoose.Schema;

// var mongoDB = 'mongodb://127.0.0.1/Projects';
// mongoose.connect(mongoDB, { useNewUrlParser: true });
// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var sprintTrackerModel;

function launchDB(dbName, projectName) {
    var mongoDB = `mongodb://127.0.0.1/${dbName}`;
    mongoose.connect(mongoDB, { useNewUrlParser: true });
    var db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    sprintTrackerModel = mongoose.model(projectName, schemas.sprintTrackerSchema);
}



async function saveCardsToDb(cardObj, boardName ) {
    launchDB("Projects")

    console.log("saveCardsToDb invoked!!!!!!!!!!!!!!!!!!! ", boardName);

    const cardModel = mongoose.model(boardName, schemas.cardSchema)

    cardModel.create(
        {
            name: cardObj.name,
            trelloId: cardObj.id,
            listId: cardObj.idList,
            url: cardObj.url,
            estimate: cardObj.estimate,
        }
        , function (err, small) {
            if (err) return handleError(err);
            // saved!
        });




}




function convertCardToDbReady(rawCardObj) {
    let estimate;
    if (rawCardObj.pluginData[0]) {
        var pluginDataValue = JSON.parse(rawCardObj.pluginData[0].value)
        estimate = parseInt(pluginDataValue.estimate)
    } else {
        estimate = 0;
    }
    console.log('-----------  ', rawCardObj.idList);
    const finalCard = {
        name: rawCardObj.name,
        id: rawCardObj.id,
        idList: rawCardObj.idList,
        url: rawCardObj.url,
        estimate: estimate

    }

    return finalCard

}

async function getProjectName(boardId) {
    var response = await axios.get(`https://api.trello.com/1/boards/${boardId}/name?key=${key}&token=${token}`)

    var boardObj = response.data
    var boardName = boardObj._value


    return boardName
}



// let projectName = 'running board';  // TO DO this is a temp var. real one comes from plenner in a pupsub 
async function getLists(boardId) {
    try {
        var lists = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists?cards=none&filter=open&fields=name%2Cid&key=${key}&token=${token}`)

        return lists.data
    } catch  (error) {
        throw new Error(error);
    }
}

async function getCards(listId) {

    var cards = await axios.get(`https://api.trello.com/1/lists/${listId}/cards?pluginData=true&fields=name%2Cid%2Curl%2CidList&key=${key}&token=${token}`)
    var listCardsArr = cards.data
    // console.log(cards.data)
    //

    return listCardsArr


}


async function runs(boardId) {
    // var boardobj = await trelloTolls.getBoardId(idOrganization, projectName)
    // var boardId = boardobj.boardId
    var boardName = await getProjectName(boardId)
    var allLists = await getLists(boardId)
    var sprintDay = await  sprintDayUpdate(boardName, 123)
    
     console.log('sprintDay from runs :',sprintDay);
    
    for (let index = 0; index < allLists.length; index++) {
        const currrentList = allLists[index];
        var listName = currrentList.name
        if (listName.includes('%') ) {
            let listId = currrentList.id
            var templist = await getCards(listId)
            // console.log(templist);
            for (let i = 0; i < templist.length; i++) {
                const tempCard = templist[i];
                let dbReadyCard = await convertCardToDbReady(tempCard)
                // await saveCardsToDb(dbReadyCard, boardName)
                // console.log(tempCard);
                
            }
            
           // console.log(listName);
           }
        // console.log(list.name);
     }
    // createSprintTrackerDB(boardName ,15, 123)
    
    //  console.log(mylists);
}



// createSprintTrackerDB('rt-suitee',7, 1234)
async function createSprintTrackerDB(projectName, sprintLength, sprintNum) {
    await launchDB('Sprint-Tracker', projectName)


    var firstSprinter = new sprintTrackerModel({
        projectName: projectName,
        sprintNum: sprintNum,
        idealBurn: [],
        actualBurn: new Array(sprintLength).fill(0)
    });
    sprintTrackerModel.save(function (err, firstSprinter) {
        if (err) {
            console.log(err);
        } else {

            console.log("Document Save Done");
        }

    });

}

// sprintTrackerUpdate('rt-suitee', 11, 7, 0)

function sprintTrackerUpdate(projectName, sprintNum, sprintDay, currentSum) {

    launchDB('Sprint-Tracker')
    // console.log('-------- ',schemas.sprintTrackerSchema);

    var sprintTrackerModel = mongoose.model(projectName, schemas.sprintTrackerSchema);

    sprintTrackerModel.findOne({
        sprintNum: sprintNum
    }, function (err, data) {
        if (!err) console.log(err);

        let finalIdealBurn = data.actualBurn
        finalIdealBurn[sprintDay] = currentSum
        console.log(finalIdealBurn);

        sprintTrackerModel.update({
            sprintNum: sprintNum
        }, {
            idealBurn: finalIdealBurn
        }, function (err, log) {

        });
    });


}

// sprintDayUpdate('rt-suite', 123)
async function sprintDayUpdate(projectName, sprintNum) {

    launchDB('Sprint-Tracker')
    // console.log('-------- ',schemas.sprintTrackerSchema);

    var sprintTrackerModel = mongoose.model(projectName, schemas.sprintTrackerSchema);
    let lastSprintDay; 
    sprintTrackerModel.findOne({
        sprintNum: sprintNum 
    }, await function (err, data) {
        if (!err) ;

         lastSprintDay = data.sprintDay
       
        // console.log('lastSprintDay :',lastSprintDay);

        sprintTrackerModel.update({
            sprintNum: sprintNum
        }, {
            sprintDay: lastSprintDay+1
        }, function (err, log) {

            });
       
        });
        
      return lastSprintDay
    }
    
    
    
    

runs('5be42dc918f706736ed1849f')
// getProjectName("5be18d88079e360d223546ac")



