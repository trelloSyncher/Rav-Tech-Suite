const request = require("request");
const promiseRequest = require('request-promise');
const axios= require("axios");
const information = require("./hardcoded.js")
const key = information.key;
const token = information.token;
const idOrganization = information.idOrganization

let sprintRecivedTasks = ['C1','C2','C6','C7'] // TO DO this is a temp var. real one comes from plenner in a pupsub 
let projectName =  'RT-Suite';  // TO DO this is a temp var. real one comes from plenner in a pupsub 


startSprint()
/**
 * A manager function that call all functions in this file by order
 */
async function startSprint(){
    const boardInfoObj = await getBoardId(idOrganization, projectName)
   await compareCards(boardInfoObj.boardId, sprintRecivedTasks, boardInfoObj.sprintCandidate)
}

/**
 * Get's the the project  board and "sprint candiste" list ID via api
 * 
 * @param {strnig} idOrganization the ID number of trello team(organization)
 * @param {strnig} projectName the name of the current project that is also the name of the project board
 * @returns {object} contains the project board and the sprnit candidte list  id 
 */
async function getBoardId(idOrganization, projectName) {
    let currentProjectId;
    let candidateListId;
    const options = {
        method: 'GET',
        url: 'https://api.trello.com/1/organizations/' + idOrganization + '/boards',
        qs: {
            fields: ['id','name'],
            lists: 'open',
            list_fields: 'name',
            key: key ,
            token: token
        }
    }
    
    await  promiseRequest(options, function (error, response, body) {
        if (error) throw new Error(error);
        const data = JSON.parse(body)
        
        for (let i = 0; i < data.length; i++) {
            if(projectName ===  data[i].name ){
                currentProjectId = data[i].id;
                for (let index = 0; index < data[i].lists.length; index++) {
                    const element =  data[i].lists[index].name;
                    if (element === information.candidateListName) {
                        
                        candidateListId =  data[i].lists[index].id;
                        
                    }
                }
            }
        }
        
    })
    
    return {
        boardId: currentProjectId,
        sprintCandidate: candidateListId
    }
    
}

/**
 * Compare between tasks names (strnigs) and real tasks cards if there is a match the the function
 *  calls to "moveCard" functios that moves the card to is directory list(sprnit candidate list in this case)
 * 
 * @param {strnig} idBoard The id of the project board
 * @param {array} taskaArr An array that contains tasks names for the next sprint
 * @param {*} candidateListId the id of the dirctory that the tasks needs to move to(sprnit candidate list)
 */
async function compareCards(idBoard, taskaArr, candidateListId){
    
    const options = {
        method: 'GET',
        url: 'https://api.trello.com/1/boards/' + idBoard,
        qs: {
            cards: 'visible',
            list_fields: 'name',
            
            key: key,
            token: token
        }
    };
    
    await promiseRequest(options, function (error, response, body) {
        if (error) throw new Error(error);
        
        
        const data = JSON.parse(body)
        
        
        
        for (let index = 0; index < data.cards.length; index++) {
            element = data.cards[index].name;
            cardId =  data.cards[index].id;
            
            listId = data.cards[index].name
            for (let i = 0; i < taskaArr.length; i++) {
                const sprintElement = taskaArr[i];
                
                if (sprintElement === element) {
                    moveCard(cardId, candidateListId)
                }
            }
        }
        
    });
}

/**
 * move a trello card to a directory list TBD
 * 
 * @param {strnig} cardId the id of the card that needs to move to tn other list
 * @param {strnig} candidateId the id of the directory list that the card should be in after the movment
 */
function moveCard(cardId,  candidateId){
    
    axios.put(`https://api.trello.com/1/cards/${cardId}?idList=${candidateId}&key=${key}&token=${token}`)
    
    
}
module.exports = {startSprint};