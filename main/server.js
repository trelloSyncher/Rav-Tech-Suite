var express = require('express');
const mongoose = require('mongoose')
const axios = require("axios")
const bodyParser = require('body-parser');
var DBManager = require("../DB-manager/manager-db.js")
const bugsTracker = require('../bugs/bugs-tracking.js')
const trelloTools = require('./trello-tools.js')
const information = require("./hardcoded.js")
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
 * getting event about new project
 * creating new Trello board with chossen template
 * @param {object} projectObject thet contains 
 * @property {string} projectName to be the board name
 * @property {string} 
 */ 

/**
 *  posting a new bug-card in trello board in a bugs-backlog list
 * @param {string} projectName thru url 
 * sending as response an object contains the url of the card thet was created
 * @param {Object} bugObject in the request body thru url 
 * @property {string} web_url
 */

app.post('/api/v1/:projectName/bugs', async function (req, res) {
    let data = req.params
    const bugObject = req.body
  const webUrl = await bugsTracker.addNewBugCard(data.projectName, bugObject)
    res.send(webUrl);
});


/**
 *  posting a new comment in an axist bug-card in trello board 
 * and return status code back to client
 * 
 * @param {string} projectName thru url 
 * @param {string} bug_id thru url 
 */
app.post('/api/v1/:projectName/bugs/:bug_id/notes', async function (req, res) {
    const comment = req.body
    const data = req.params
    const bugId = data.bug_id

    await bugsTracker.addNoteToBug(bugId, comment.body)
    
    const status = await res.statusCode;
    res.sendStatus(status);
});

/**
 *  sending status iformation on spesific bug
 * return object contain bug-id, bug-status 
 * @param {string} bug_id thru url 
 */
app.get('/api/v1/bugs/:bug_id', async function (req, res) {

    const data = req.params
    const bugId = data.bug_id

    const status = await bugsTracker.sendBugStatus(bugId)
    
    res.send(status)

});


/**
 *  sending bugs status iformation on all project
 * return list of objects contain bug-id, bug-status 
 * @param {string} projectName thru url 
 */
app.get('/api/v1/:projectName/bugs', async function (req, res) {
    let data = req.params

    const result = await bugsTracker.sendAllProjectBugsStatus(data.projectName)



    res.send(result)

});

/**
 * sending the project board Url
 * @param {string} projectName thru url
 */

app.get('/api/:projectName', async function (req, res) {
    let data = req.params
    const projectName = await trelloTools.getBoardUrlByProjectName( data.projectName)



    res.send(projectName)

});
app.use(express.static('public'))
app.listen(5555);