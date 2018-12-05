// var express = require('express');
// const mongoose = require('mongoose')
const axios = require("axios")
// const bodyParser = require('body-parser');
var DBManager = require("../DB-manager/manager-db.js")
const trelloTools = require('../main/trello-tools.js')
const information = require("../main/hardcoded.js")
const key = information.trello.key;
const token = information.trello.token;
// const idOrganization = information.trello.idOrganization
// const bugsListStr = information.trello.bugsBacklog


// async function addNewBugCardTEST(projectName, bugObject){
//     const projectNameStr = await trelloTools.makeStr(projectName)
//     const saveInDB = await DBManager.addBugToDB(projectNameStr, bugObject)
//     console.log('-------------##  ' ,saveInDB);
    
//     // if(saveInDB.includes('error')){
//     //      console.log('-----------------------dont create a new card');
//     // }
//     const boardId = await trelloTools.getBoardIdByProjectName(projectNameStr)
//     const bugsListId = await trelloTools.getBugsListId(boardId)
//     const trelloInfoObj = await addNewBugToBacklogList(bugsListId, bugObject)

//     const webUrl = {
//         web_url: trelloInfoObj.url
//     }
//     return webUrl
// }
async function addNewBugCard(projectName, bugObject){
    const projectNameStr = await trelloTools.makeStr(projectName)
    const boardId = await trelloTools.getBoardIdByProjectName(projectNameStr)
    const bugsListId = await trelloTools.getBugsListId(boardId)
    const trelloInfoObj = await addNewBugToBacklogList(bugsListId, bugObject)

    await DBManager.addBugToDB(projectNameStr, bugObject, trelloInfoObj.trelloId)
    const webUrl = {
        web_url: trelloInfoObj.url
    }
    return webUrl
}


async function addNoteToBug(bugId, comment){
    const cardId = await DBManager.findBugTrelloId(bugId)
    await trelloTools.addCommentToCard(cardId, comment)

}

async function sendBugStatus(bugId){
    const cardId = await DBManager.findBugTrelloId(bugId)
    
    const bugState = await getBugState(cardId)
const result = {
    bugId: bugId,
    state: bugState
}
    return result
}

async function sendAllProjectBugsStatus(projectName){
    const bugsArr = await DBManager.findBugsByProjectName(projectName)
    const result = await getProjectBugsState(bugsArr)
return result
}




const addNewBugToBacklogList = async (listId, cardObj) => {
    
    try {
        var card = await axios.post(`https://api.trello.com/1/cards?name=${cardObj.title}&desc=${cardObj.details}&idList=${listId}&keepFromSource=all&key=${key}&token=${token}`);
        
    } catch (error) {
        throw new Error(error);
    }
    return ({
        url: card.data.url,
        trelloId: card.data.id
    })
}
async function getProjectBugsState(bugsArr) {
    let finalArr = []
    
    for (const bug of bugsArr) {
        
        const bugState = await getBugState(bug.trelloId)
        
        await finalArr.push({
            bugId: bug.bugId,
            state: bugState
        })
    }
    
    
    return finalArr
}

async function getBugState(cardId) {
    const listName = await trelloTools.getListNameByCardId(cardId)
    
    switch (listName) {
        case information.bugs.BugsBacklog:
            return 1
            break;
            case information.bugs.BugsToBeTested:
            return 2
            break;
            case information.bugs.BugsDone:
            return 3
            break;
            
        default:
        return 'hello'
        break;
    }
}


module.exports = {addNewBugCard, addNoteToBug, sendBugStatus, sendAllProjectBugsStatus}