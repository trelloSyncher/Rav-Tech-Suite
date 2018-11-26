var express = require('express');
const mongoose = require('mongoose')
const axios = require("axios")
var path = require('path');
var bodyParser = require('body-parser');
var schemas = require("../DB-manager/mongoSchemas.js")
var DBManager = require("../DB-manager/manager-db.js")
const trello = require('../main/trello-tools.js')
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


//   const stamObj = {
//       title: 'My title',
//       build: 'My build',
//       details: 'Details'
//   }

// stam()
// async function stam(){
//     let boardId = await trello.getBoardIdByProjectName('running board')
//     const bugsList = await trello.getBugsListId(boardId)
//     console.log(bugsList);
// }

/**
*  posting a new bug-card in trello board in a bugs-backlog list
* @param {string} projectName thru url 
*/

app.post('/api/v1/:projectName/bugs',async function (req, res) {
    let data = req.params
    const projectName = await trello.makeStr(data.projectName)
    const bugObject = await req.body
    const boardId = await trello.getBoardIdByProjectName(projectName)
    const bugsListId = await trello.getBugsListId(boardId)
    const trelloInfoObj = await addNewCardToList(bugsListId, bugObject)
    // console.log(trelloInfoObj.url);
    
    await DBManager.addBugToDB(projectName, bugObject, trelloInfoObj.trelloId)
    res.send(trelloInfoObj.url);
});

// async function addBugToDB(boardName, bugObject, trelloId){
//     await DBManager.launchDB('Bugs')
//     const bugModel = mongoose.model(boardName, schemas.bugSchema)
    
//     bugModel.create(
//         {
//             build:  bugObject.title,
//             bugId: bugObject.bugId,
//             title: bugObject.title,
//             cardTrelloId: trelloId,
//             details: bugObject.details 
            
//         }
//         , function (err, small) {
//             if (err) return handleError(err);
//             // saved!
//         });
        
//     }
    
    /**
     *  posting a new comment in an axist bug-card in trello board 
     * @param {string} projectName thru url 
* @param {string} bug_id thru url 
*/
app.post('/api/v1/:projectName/bugs/:bug_id/notes',async function (req, res) {
    const data = req.params
    const bugId = data.bug_id
    const projectName = await trello.makeStr(data.projectName)
    const boardId = await trello.getBoardIdByProjectName(projectName)
        const comment = await req.body

      console.log(res.statusCode);
    //   addCommentToCard()
    //   const bugsListId = await trello.getBugsListId(boardId)
    //   const url = await addNewCardToList(bugsListId, bugObject)
      res.send(res.statusCode);
    });
// app.get('/api/v1/:projectName/bugs',async function (req, res) {
//     let data = res
//     // console.log(data);
//     let a = {web_url:'http://demo.com/demo'}
// //    let url = await addNewCardToList('5be42dcb7549dc467801a127', data)
//     res.send(data);
//   });


  const addNewCardToList = async (listId, cardObj)=>{
      console.log('cardObj: ' , cardObj);
      
      try{
          var card = await axios.post(`https://api.trello.com/1/cards?name=${cardObj.title}&desc=${cardObj.details}&idList=${listId}&keepFromSource=all&key=${key}&token=${token}`);
        // console.log(card.data);
          
        } catch  (error) {
            throw new Error(error);
        }
        return( {url: card.data.url, trelloId: card.data.id})
    }
    
    


  const addCommentToCard = async (cardId)=>{
      console.log('cardObj: ' , cardId);
      
      try{
          var newNote = await axios.post(`https://api.trello.com/1/cards/${cardId}/actions/comments?text=${note}&key=${key}&token=${token}`);
          
        } catch  (error) {
            throw new Error(error);
        }

    }
    
    


app.get('/', function (req, res) {
    console.log("hi");
    res.send('<h1> home page</h1>')

});
app.get('/about', function (req, res) {
    console.log("hi");
    res.send('<h1> about page</h1>')

});
app.use(express.static('public'))
app.listen(5555);

