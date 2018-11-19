const request = require("request");
const promiseRequest = require('request-promise');
const axios = require("axios");
const information = require("./hardcoded.js")
const key = information.key;
const token = information.token;
const idOrganization = information.idOrganization
var trelloTolls = require("./sprint-first-step.js")
var schemasAndModels = require("./mongoSchemasAndModels.js")
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


function launchDB(dbName) {
    var mongoDB = `mongodb://127.0.0.1/${dbName}`;
    mongoose.connect(mongoDB, { useNewUrlParser: true });
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}


async function saveCardsToDb(cardObj, boardName, ) {
    launchDB("Projects")

    console.log("saveCardsToDb invoked!!!!!!!!!!!!!!!!!!! ", boardName);

    const cardModel = mongoose.model(boardName, schemasAndModels.cardSchema)

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
        if (pluginDataValue.estimate) {
            estimate = pluginDataValue.estimate

        } else {
            estimate = 0;
        }
    }
    console.log('-----------  ', estimate);
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


let projectName = 'running board';  // TO DO this is a temp var. real one comes from plenner in a pupsub 
async function getLists(boardId) {
    try {
        var lists = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists?cards=none&filter=open&fields=name%2Cid&key=${key}&token=${token}`)

        return lists.data
    } catch (error) {
        throw new Error(error);
    }
}

async function getCards(listId) {

    var cards = await axios.get(`https://api.trello.com/1/lists/${listId}/cards?pluginData=true&fields=name%2Cid%2Curl%2CidList&key=${key}&token=${token}`)
    var listCardsArr = cards.data

    return listCardsArr


}

async function runs(projectName) {
    var boardobj = await trelloTolls.getBoardId(idOrganization, projectName)
    var boardId = boardobj.boardId
    var boardName = await getProjectName(boardId)
    var myLists = await getLists(boardId)
    for (let index = 0; index < myLists.length; index++) {
        const currrentList = myLists[index];
        var listName = currrentList.name
        if (listName.includes('%')) {
            let listId = currrentList.id
            var templist = await getCards(listId)
            // console.log(templist);
            for (let i = 0; i < templist.length; i++) {
                const tempCard = templist[i];
                let dbReadyCard = convertCardToDbReady(tempCard)
                await saveCardsToDb(dbReadyCard, boardName)



            }



        }


    }





}

runs(projectName)










