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

async function getBoardIdByProjectName(projectName){
    const allBoards = await axios.get(`https://api.trello.com/1/organizations/${idOrganization}/boards?fields=name%2Cid&key=${key}&token=${token}`)
    
    for (let i = 0; i < allBoards.data.length; i++) {
        const currentProjectName = await makeStr(allBoards.data[i].name);
        if(projectName === currentProjectName){
            const currentProjectId =  allBoards.data[i].id;
            return currentProjectId
            
        }
    }
    
}


// getListNameByCardId('5bf19915e72b96582c5a7586')
async function getListNameByCardId(cardId){
    const allData = await axios.get(`https://api.trello.com/1/cards/${cardId}/list?fields=name&key=${key}&token=${token}`)
// console.log(allData.data.name);
return allData.data.name
}
// getListIdByLstName('5be18d88079e360d223546ac')
async function getBugsListId(boardId){
    // console.log(boardId);
    
    const allLists = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists?cards=none&fields=id%2Cname&key=${key}&token=${token}`)
    
// console.log(allLists.data);


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

module.exports = {getBoardIdByProjectName, getBugsListId, getListNameByCardId, makeStr, addCommentToCard}
