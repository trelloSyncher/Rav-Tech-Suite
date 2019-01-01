// const mongoose = require('mongoose')
// const schemas = require("../DB-manager/mongoSchemas.js")
// const information = require("./hardcoded.js")
// const trelloTools = require('./trello-tools.js')
// const mongoDB = "mongodb://127.0.0.1/TEST";
    
// mongoose.set('useCreateIndex', true)
// mongoose.connect(mongoDB, {
//         useNewUrlParser: true
//     });
// const db = mongoose.connection
//     db.on('error', console.error.bind(console, 'MongoDB connection error:'));



//     // saveCardsToDb(cardObj)     
//     async function saveCardsToDb(cardObj) {
    
//         console.log("saveCardsToDb invoked!!!!!!!!!!!!!!!!!!! ", cardObj);
    
//         const cardModel = mongoose.model(information.collectionName.cards, schemas.cardSchema)
    
//         cardModel.create({
//             name: cardObj.name,
//             trelloId: cardObj.id,
//             listId: cardObj.idList,
//             url: cardObj.url,
//             estimate: cardObj.estimate,
//         }, function (err, small) {
//             if (err) return handleError(err);
//             // saved!
//         });
    
//     }
    
    
//     async function updateEstimate(trelloId, newValue){
//         const cardModel = mongoose.model(information.collectionName.cards, schemas.cardSchema)
//         cardModel.updateOne({trelloId: trelloId},{'estimate':newValue},function(err,log){
            
//             console.log("Number of Records Effected",log);
            
//             });
            
//     }
    
//     async function createSprintTrackerDB( projectName, sprintLength, sprintName) {
//         console.log(sprintLength);
        
//         var sprintTrackerModel = mongoose.model(information.collectionName.sprintTracker, schemas.sprintTrackerSchema);
//         var numberOfWeek = (sprintLength / 7)
        
//         sprintTrackerModel.create({
//             projectName: projectName,
//             sprintName: sprintName,
//             numberOfWeek: numberOfWeek,
//             idealBurn:  new Array(sprintLength).fill(0),
//             actualBurn: []
//         }, function (err) {
//             if (err) {
//                 console.log(err);
//             } else {
                
//                 console.log("Document Save Done");
//             }
            
//         });
        
//     }
    
    
//     async function updateSprintTracker(sprintName, sprintDay, currentSum){
//         const  sprintTrackerModel = mongoose.model(information.collectionName.sprintTracker, schemas.sprintTrackerSchema);
//         sprintTrackerModel.findOne({
//             sprintName: sprintName
//         }, function (err, data) {
//             if (!err) console.log(err);
            
//             let finalIdealBurn = data.idealBurn
//             finalIdealBurn[sprintDay-1] = currentSum
//             // console.log(finalIdealBurn);
            
//             sprintTrackerModel.update({
//                 sprintName: sprintName
//             }, {
//                 idealBurn: finalIdealBurn
//             }, function (err, log) {
                
//             });
//         });
            
    
        
//     }
  
//     async function handleError(err) {
//         console.log(err.errmsg);
        
//         return err.errmsg;
    
//     }
//     function sprintTrackerUpdate(projectName, sprintName, sprintDay, currentSum) {
        
        
        
//         var sprintTrackerModel = mongoose.model(projectName, schemas.sprintTrackerSchema);
        
//         sprintTrackerModel.findOne({
//             sprintName: sprintName
//         }, function (err, data) {
//             if (!err) console.log(err);
            
//             let finalIdealBurn = data.actualBurn
//             finalIdealBurn[sprintDay] = currentSum
//             // console.log(finalIdealBurn);
            
//             sprintTrackerModel.update({
//                 sprintName: sprintName
//             }, {
//                 idealBurn: finalIdealBurn
//             }, function (err, log) {
                
//             });
//         });
        
        
//     }
    
    
//     async function addBugToDB(boardName, bugObject, trelloId) {

        
    
//     const bugModel = mongoose.model(information.collectionName.bugs, schemas.bugSchema)

//     await bugModel.create({
//         projectName: boardName,
//         build: bugObject.build,
//         bugId: bugObject.bugId,
//         title: bugObject.title,
//         cardTrelloId: trelloId,
//         details: bugObject.details
        
//     }, async function (err) {
        

//         if (err) {
//             console.log(err.errmsg);

//         }
//     })


// }

// async function findBugsByProjectName(projectNameS) {
//     let bugsArr = [];
//     const projectName = await trelloTools.makeStr(projectNameS)

//     const bugModel = await mongoose.model(information.collectionName.bugs, schemas.bugSchema)

//     await bugModel.find({
//         projectName: projectName
//     }, async function (err, bugs) {

//     }).then((bugs) => {
//         bugs.forEach(element => {
//             // console.log( element);

//             bugsArr.push({
//                 trelloId: element.cardTrelloId,
//                 bugId: element.bugId
//             })
//         });
//     })
//     return bugsArr
// }

// async function findBugTrelloId(bugId) {
//     const bugModel = mongoose.model(information.collectionName.bugs, schemas.bugSchema)


//     var cardId;
//     await bugModel.findOne({
//         bugId: bugId
//     }, function (err, data) {
//         // console.log(data.cardTrelloId);
//         cardId = data.cardTrelloId
//         if (err) console.log(err);
//     });
//     console.log('from DATA BASE cardId: ', cardId);

//     return cardId

// }
// // const cardObj = {
// //     name: "H10",
// //     trelloId: "5bf199122165ce5fdbb9fc612",
// //     listId: "5be42dca7f604e35bd269d162",
// //     url: "https://trello.com/c/COm3ZYFg/14-h12",
// //     estimate: 555
// // }

// // findCardInDBByTrelloId(cardObj, 'test')

// async function findCardInDBByTrelloId(cardObj) {
//     let cardFromDB;
   
//     const cardModel = mongoose.model(information.collectionName.cards, schemas.cardSchema)
//     // console.log(cardObj.name);
  
//     const currentCardsName = cardObj.name
//     const cardTrelloId = cardObj.id
//     const currentList = cardObj.listId
//     const currentCardEstimate = cardObj.estimate




//   await  cardModel.findOne({trelloId: cardTrelloId},async function (err, data) {
//         if (err) return handleError(err);
//         // console.log('data: ',data);
        
//         cardFromDB = await data
//         // console.log(cardFromDB);
//         if ( cardFromDB != null) {
//             if (cardFromDB.name === currentCardsName) {
//                 // console.log('----------- ------------------:');
//                 // console.log('NOW: ', currentCardsName);
//             }
            
//         }
        
//     })
// return cardFromDB
// }


// // async function createSprintTrackerDB(projectName, sprintLength, sprintName) {

// //     var sprintTrackerModel = mongoose.model(projectName, schemas.sprintTrackerSchema);
// //     var numberOfWeek = (sprintLength / 7)
// //     var firstSprinter = new sprintTrackerModel({
// //         projectName: projectName,
// //         sprintName: sprintName,
// //         numberOfWeek: numberOfWeek,
// //         idealBurn:  new Array(sprintLength).fill(0),
// //         actualBurn: []
// //     });
// //     firstSprinter.save(function (err) {
// //         if (err) {
// //             console.log(err);
// //         } else {

// //             console.log("Document Save Done");
// //         }

// //     });

// // }




// // module.exports.createSprintTrackerDB = createSprintTrackerDB
// module.exports = {
//     saveCardsToDb,
//     addBugToDB,
//     findBugsByProjectName,
//     findBugTrelloId,
//     findCardInDBByTrelloId,
//     updateEstimate,
//     updateSprintTracker,
//     createSprintTrackerDB
// };