var express = require('express');
const mongoose = require('mongoose')
const axios = require("axios")
const path = require('path');
const bodyParser = require('body-parser');
// var schemas = require("../DB-manager/mongoSchemas.js")
var DBManager = require("../DB-manager/manager-db.js")
const trelloTools = require('../main/trello-tools.js')
const information = require("../main/hardcoded.js")
const key = information.trello.key;
const token = information.trello.token;
const idOrganization = information.trello.idOrganization
const bugsListStr = information.trello.bugsBacklog

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


/**
 *  posting a new bug-card in trello board in a bugs-backlog list
 * @param {string} projectName thru url 
 */

app.post('/api/v1/:projectName/bugs', async function (req, res) {
    let data = req.params
    const bugObject = await req.body
    const projectName = await trelloTools.makeStr(data.projectName)
    const boardId = await trelloTools.getBoardIdByProjectName(projectName)
    const bugsListId = await trelloTools.getBugsListId(boardId)
    const trelloInfoObj = await addNewBugToBacklogList(bugsListId, bugObject)
    // console.log(trelloInfoObj.url);

    await DBManager.addBugToDB(projectName, bugObject, trelloInfoObj.trelloId)
    res.send(trelloInfoObj.url);
});


/**
 *  posting a new comment in an axist bug-card in trello board 
 * @param {string} projectName thru url 
 * @param {string} bug_id thru url 
 */
app.post('/api/v1/:projectName/bugs/:bug_id/notes', async function (req, res) {
    const comment = req.body

    const data = req.params
    const bugId = data.bug_id

    const cardId = await DBManager.findBugTrelloId(bugId)
    await trelloTools.addCommentToCard(cardId, comment.body)

    const status = await res.statusCode;
    res.sendStatus(status);
});

app.get('/api/v1/bugs/:bug_id',async function (req, res) {
    
    const data = req.params
    const bugId = data.bug_id

    const cardId = await DBManager.findBugTrelloId(bugId)
    const bugState = await getBugState(cardId)
    
    res.send({
        bugId: bugId,
        state: bugState
    })

});
app.get('/api/v1/:projectName/bugs', async function (req, res) {
    let data = req.params
    
    const bugsArr = await DBManager.findBugsByProjectName(data.projectName)
  const result = await getProjectBugsState(bugsArr)
    


    res.send(result)

});


const addNewBugToBacklogList = async (listId, cardObj) => {
    console.log('cardObj: ', cardObj);

    try {
        var card = await axios.post(`https://api.trello.com/1/cards?name=${cardObj.title}&desc=${cardObj.details}&idList=${listId}&keepFromSource=all&key=${key}&token=${token}`);
        // console.log(card.data);

    } catch (error) {
        throw new Error(error);
    }
    return ({
        url: card.data.url,
        trelloId: card.data.id
    })
}
async function getProjectBugsState(bugsArr){
    let finalArr = []

for(const bug of bugsArr)  {

   const bugState = await getBugState( bug.trelloId)

   await finalArr.push( {bugId: bug.bugId, state: bugState})
}
//  console.log(finalArr);


return finalArr
}

async function getBugState(cardId){
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


app.use(express.static('public'))
app.listen(5555);