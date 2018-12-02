const axios= require("axios");
const DBManager = require('../DB-manager/manager-db')
const trelloTools = require('../main/trello-tools.js')
const information = require("../main/hardcoded.js")
const boardId = '5be42dc918f706736ed1849f'
run()
async function run(){
 
const projectName = await trelloTools.getProjectName(boardId)
const allListsArr = await trelloTools.getLists(boardId)
const finalCards = await getCardsFromSprintLists(allListsArr)
const sprintCards = await finleCardsToTrack(finalCards)
for (const cardObj of sprintCards) {
    // console.log(cardObj);

    DBManager.saveCardsToDb(cardObj, projectName)
    
}

}

async function getCardsFromSprintLists(allListsArr){
    var cardsArr = []
    for(const list of allListsArr){
        var listName = list.name 
        if (listName.includes('%')) {
                let listId = list.id
                var templist = await trelloTools.getCards(listId)
                if(templist.length>0)
                cardsArr.push(templist)
            }
            
        }
return cardsArr
}

async function finleCardsToTrack(cardsArr){

    let finalArr = []
    for (const iterator of cardsArr) {
        for (const rawCardObj of iterator) {
            let estimate;
            if (rawCardObj.pluginData[0]) {
                var pluginDataValue = JSON.parse(rawCardObj.pluginData[0].value)
                estimate = parseInt(pluginDataValue.estimate)
            } else {
                estimate = 0;
            }
            const finalCard = {
                name: rawCardObj.name,
                id: rawCardObj.id,
                idList: rawCardObj.idList,
                url: rawCardObj.url,
                estimate: estimate
                
            }
            
            finalArr.push(finalCard)
           
        }
        
    }
    return finalArr;

}
