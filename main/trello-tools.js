const axios = require("axios")

const information = require("./hardcoded.js")

const trelloTemplateBboardId = information.trello.trelloTemplateBboardId
const key = information.trello.key;
const token = information.trello.token;
const idOrganization = information.trello.idOrganization
const bugsListStr = information.trello.bugsBacklog

// stam()
async function stam(){
    let boardId = await getBoardIdByProjectName('running board')
   const bugsList = await getBugsListId(boardId)
    console.log(bugsList);
}

async function getProjectName(boardId) {
    var response = await axios.get(`https://api.trello.com/1/boards/${boardId}/name?key=${key}&token=${token}`)

    var boardObj = response.data
    var boardName = boardObj._value


    return boardName
}
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
// getBoardUrlByProjectName('test')
async function getBoardUrlByProjectName(projectName){
    const projectNameStr = await makeStr(projectName)
    const allBoards = await axios.get(`https://api.trello.com/1/organizations/${idOrganization}/boards?fields=name%2Curl&key=${key}&token=${token}`)
    for (const board of allBoards.data) {
        const currentProjectName = await makeStr(board.name)
        if (currentProjectName === projectNameStr) {
            return board.url
            
        }
    
}
    
}

async function getBoardIdByProjectName(projectName){
    try{
    const projectNameStr = await makeStr(projectName)
    const allBoards = await axios.get(`https://api.trello.com/1/organizations/${idOrganization}/boards?fields=name%2Cid&key=${key}&token=${token}`)
    console.log(projectNameStr);
    
    for (let i = 0; i < allBoards.data.length; i++) {
        const currentProjectName = await makeStr(allBoards.data[i].name);
        if(projectNameStr === currentProjectName){
            const currentProjectId =  allBoards.data[i].id;
            return currentProjectId
            
        }
    }
   
} catch  (error) {
}
    
}


async function getListNameByCardId(cardId){
    const allData = await axios.get(`https://api.trello.com/1/cards/${cardId}/list?fields=name&key=${key}&token=${token}`)
// console.log(allData.data.name);
const listName = allData.data.name
return listName
}

async function getCandidateListId(boardId){
    const allLists = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists?cards=none&fields=id%2Cname&key=${key}&token=${token}`)

    for (let i = 0; i < allLists.data.length; i++) {
        const currentListtName = allLists.data[i].name;
        if(currentListtName === information.trello.candidateListName){
            const candidateListId =  allLists.data[i].id;
            return candidateListId
}}}

async function getBugsListId(boardId){
    
    const allLists = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists?cards=none&fields=id%2Cname&key=${key}&token=${token}`)
    


    for (let i = 0; i < allLists.data.length; i++) {
        const currentListtName = allLists.data[i].name;
        if(currentListtName === bugsListStr){
            const currentListtId =  allLists.data[i].id;
            return currentListtId

    }
}

}




const addCommentToCard = async (cardId, note)=>{
    console.log('cardObj: ' , cardId);
    
    try{
        var newNote = await axios.post(`https://api.trello.com/1/cards/${cardId}/actions/comments?text=${note}&key=${key}&token=${token}`);
        
      } catch  (error) {
          throw new Error(error);
      }

  }
  

async function makeStr(st){
    st = await st.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return st
  }
//   getCardsByBoardId(information.trello.trelloTemplateBboardId)
 
  async function getCardsByBoardId(boardId){
     
     const cards = await axios.get(`https://api.trello.com/1/boards/${boardId}/cards/?fields=name&member_fields=fullName&key=${key}&token=${token}`) 
     return cards.data
     
}

function moveCard(cardToMoveArr,  listId){
    try {
        
        for (let i = 0; i < cardToMoveArr.length; i++) {
            const cardId = cardToMoveArr[i];
            axios.put(`https://api.trello.com/1/cards/${cardId}?idList=${listId}&key=${key}&token=${token}`)
            
        }
    } catch (error) {
        console.log('throw new Error(moveCard)')
    }
    
    
}

module.exports = {getBoardUrlByProjectName, moveCard, getCardsByBoardId, getCards, getLists, getProjectName, getBoardIdByProjectName, getCandidateListId, getBugsListId, getListNameByCardId, makeStr, addCommentToCard}
