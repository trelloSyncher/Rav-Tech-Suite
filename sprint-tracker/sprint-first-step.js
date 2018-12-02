const axios= require("axios");
const DBManager = require('../DB-manager/manager-db')

const trelloTools = require('../main/trello-tools.js')
const information = require("../main/hardcoded.js")
const key = information.trello.key;
const token = information.trello.token;
const idOrganization = information.trello.idOrganization
const candidateListName =  information.trello.candidateListName




async function startSprint(projectName, sprintRecivedTasks){
    const boardId = await trelloTools.getBoardIdByProjectName(projectName)
   const candidateListId = await getCandidateListId(boardId)
   const cardArr = await trelloTools.getCardsByBoardId(boardId)
   
   const cardToMoveArr = await compareCards(cardArr, sprintRecivedTasks)
   await trelloTools.moveCard(cardToMoveArr, candidateListId)
    await DBManager.createSprintTrackerDB(projectName, 14, 88)
}


async function getCandidateListId(boardId){
    try {
        
        const allLists = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists?cards=none&fields=id%2Cname&key=${key}&token=${token}`)
    
        for (let i = 0; i < allLists.data.length; i++) {
            const currentListtName = allLists.data[i].name;
            if(currentListtName === candidateListName){
                const candidateListId =  allLists.data[i].id;
                return candidateListId
    }}
    } catch (error) {
        console.log('throw new Error(getCandidateListId)')
    }
}


async function compareCards(allCardsArr, taskaArr){
    let cardsToMove = [];
    for (let index = 0; index < allCardsArr.length; index++) {
        element = allCardsArr[index].name;
        cardId =  allCardsArr[index].id;
        
        for (let i = 0; i < taskaArr.length; i++) {
            const sprintElement = taskaArr[i];
            
            if (sprintElement === element) {
               await cardsToMove.push(cardId)
                
            }
        }
        
    }
    return cardsToMove
}

module.exports = {startSprint};