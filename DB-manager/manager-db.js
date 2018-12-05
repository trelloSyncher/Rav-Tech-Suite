const mongoose = require('mongoose')
const schemas = require("./mongoSchemas.js")
const information = require("../main/hardcoded.js")
const trelloTools = require('../main/trello-tools.js')


async function launchDB(dbName) {
    var mongoDB = `mongodb://127.0.0.1/${dbName}`;
    mongoose.set('useCreateIndex', true)
    mongoose.connect(mongoDB, {
        useNewUrlParser: true
    });
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    
}


async function addBugToDB(boardName, bugObject, trelloId) {

    await launchDB(information.bugs.DBName)
    const bugModel = mongoose.model(information.bugs.DBName, schemas.bugSchema)

    await bugModel.create({
        projectName: boardName,
        build: bugObject.build,
        bugId: bugObject.bugId,
        title: bugObject.title,
        cardTrelloId: trelloId,
        details: bugObject.details
        
    }, async function (err) {
        

        if (err) {
            console.log(err.errmsg);

        }
    })


}

async function findBugsByProjectName(projectNameS) {
    let bugsArr = [];
    const projectName = await trelloTools.makeStr(projectNameS)

    await launchDB(information.bugs.DBName)
    const bugModel = await mongoose.model(information.bugs.DBName, schemas.bugSchema)

    await bugModel.find({
        projectName: projectName
    }, async function (err, bugs) {

    }).then((bugs) => {
        bugs.forEach(element => {
            // console.log( element);

            bugsArr.push({
                trelloId: element.cardTrelloId,
                bugId: element.bugId
            })
        });
    })
    return bugsArr
}

async function findBugTrelloId(bugId) {
    await launchDB(information.bugs.DBName)
    const bugModel = mongoose.model(information.bugs.DBName, schemas.bugSchema)


    var cardId;
    await bugModel.findOne({
        bugId: bugId
    }, function (err, data) {
        // console.log(data.cardTrelloId);
        cardId = data.cardTrelloId
        if (err) console.log(err);
    });
    console.log('from DATA BASE cardId: ', cardId);

    return cardId

}
// const cardObj = {
//     name: "H10",
//     trelloId: "5bf199122165ce5fdbb9fc612",
//     listId: "5be42dca7f604e35bd269d162",
//     url: "https://trello.com/c/COm3ZYFg/14-h12",
//     estimate: 555
// }

// findCardInDBByTrelloId(cardObj, 'test')

async function findCardInDBByTrelloId(cardObj, boardName) {
    let cardFromDB;
    await launchDB(information.projects.DBName)
    const cardModel = mongoose.model(boardName, schemas.cardSchema)
    // console.log(cardObj.name);
  
    const currentCardsName = cardObj.name
    const cardTrelloId = cardObj.id
    const currentList = cardObj.listId
    const currentCardEstimate = cardObj.estimate




  await  cardModel.findOne({
        trelloId: cardTrelloId
    },async function (err, data) {
        if (err) return handleError(err);
        // console.log('data: ',data);
        
        cardFromDB = await data
        // console.log(cardFromDB);
        if ( cardFromDB != null) {
            if (cardFromDB.name === currentCardsName) {
                // console.log('----------- ------------------:');
                // console.log('NOW: ', currentCardsName);
            }
            
        }
        
    })
return cardFromDB
}


async function saveCardsToDb(cardObj, boardName) {
    launchDB(information.projects.DBName)

    // console.log("saveCardsToDb invoked!!!!!!!!!!!!!!!!!!! ", boardName);

    const cardModel = mongoose.model(boardName, schemas.cardSchema)

    cardModel.create({
        name: cardObj.name,
        trelloId: cardObj.id,
        listId: cardObj.idList,
        url: cardObj.url,
        estimate: cardObj.estimate,
    }, function (err, small) {
        if (err) return handleError(err);
        // saved!
    });

}


async function updateEstimate(trelloId,key,newValue, boardName){
    await launchDB(information.projects.DBName)
    const cardModel = mongoose.model(boardName, schemas.cardSchema)
    cardModel.updateOne({trelloId: trelloId},{[key]:newValue},function(err,log){
        
        console.log("Number of Records Effected",log);
        
        });
        
}
async function handleError(err) {
    console.log(err.errmsg);
    
    return err.errmsg;

}

async function createSprintTrackerDBTEST(projectName, sprintLength, sprintName) {
    await launchDB(information.sprint.DBName)

    var sprintTrackerModel = mongoose.model(projectName, schemas.sprintTrackerSchema);
    var numberOfWeek = (sprintLength / 7)
    
    sprintTrackerModel.create({
        projectName: projectName,
        sprintName: sprintName,
        numberOfWeek: numberOfWeek,
        idealBurn:  new Array(sprintLength).fill(0),
        actualBurn: []
    }, function (err) {
        if (err) {
            console.log(err);
        } else {

            console.log("Document Save Done");
        }

    });

}


async function updateSprintTracker(projectName, sprintName, sprintDay, currentSum){
    await  launchDB(information.sprint.DBName)
    const  sprintTrackerModel = mongoose.model(projectName, schemas.sprintTrackerSchema);
    sprintTrackerModel.updateOne({ sprintName: sprintName},{sprintDay:currentSum},function(err,log){
        
        console.log("Number of updateSprintTracker Effected",log);
        
    });
    
}
        function sprintTrackerUpdate(projectName, sprintName, sprintDay, currentSum) {
        
            launchDB(information.sprint.DBName)
          
        
            var sprintTrackerModel = mongoose.model(projectName, schemas.sprintTrackerSchema);
        
            sprintTrackerModel.findOne({
                sprintName: sprintName
            }, function (err, data) {
                if (!err) console.log(err);
        
                let finalIdealBurn = data.actualBurn
                finalIdealBurn[sprintDay] = currentSum
                // console.log(finalIdealBurn);
        
                sprintTrackerModel.update({
                    sprintName: sprintName
                }, {
                    idealBurn: finalIdealBurn
                }, function (err, log) {
        
                });
            });
        
        
        }
// async function createSprintTrackerDB(projectName, sprintLength, sprintName) {
//     await launchDB(information.sprint.DBName)

//     var sprintTrackerModel = mongoose.model(projectName, schemas.sprintTrackerSchema);
//     var numberOfWeek = (sprintLength / 7)
//     var firstSprinter = new sprintTrackerModel({
//         projectName: projectName,
//         sprintName: sprintName,
//         numberOfWeek: numberOfWeek,
//         idealBurn:  new Array(sprintLength).fill(0),
//         actualBurn: []
//     });
//     firstSprinter.save(function (err) {
//         if (err) {
//             console.log(err);
//         } else {

//             console.log("Document Save Done");
//         }

//     });

// }




// module.exports.createSprintTrackerDB = createSprintTrackerDB
module.exports = {
    // createSprintTrackerDB,
    saveCardsToDb,
    launchDB,
    addBugToDB,
    findBugsByProjectName,
    findBugTrelloId,
    findCardInDBByTrelloId,
    updateEstimate,
    updateSprintTracker,
    createSprintTrackerDBTEST
};