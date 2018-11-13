const trelloTemplateBboardId = '5bc4afc9bfdbd95f57fe35b4'
var promiseRequest = require('request-promise');

var request = require("request");

var key = key;
var token = token;
var idOrganization = '5b7aa60c58c0653c14fd503e'



/**
 * Get's the id of a specified list and then calls the "getTemplate function" 
 * 
 * @param {string} listName The name of the list whose ID is needed

 * @param {string} projectName The current project name that is also the project board name
 */
async function getListId(listName, projectName) {

    let listId;
    var options = {
        method: 'GET',
        url: 'https://api.trello.com/1/boards/' + trelloTemplateBboardId + '/lists',
        qs: {
            key: key,
            token: token
        }
    };


    await promiseRequest(options, function (error, response, body) {
        if (error) throw new Error(error);

        var data = JSON.parse(body);
        for (let index = 0; index < data.length; index++) {

            currentListId = data[index].id;
            const currentListName = data[index].name;

            if (listName === currentListName) {

                listId = currentListId
            }
        }
    })

    getTemplate(listId, projectName)
}
/**
 * Get's the cards in a specific trello list by id of the list and then calls "createBoard" function
 * 
 * @param {strnig} templateId The id of the list that conatains the chosen template
 * @param {string} projectName The name of the current project
 */
function getTemplate(templateId, projectName) {

    var listNamesArr = []
    var options = {
        method: 'GET',
        url: 'https://api.trello.com/1/lists/' + templateId + '/cards',
        qs: {

            key: key,
            token: token
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var data = JSON.parse(body)
        for (let index = 0; index < data.length; index++) {
            const listName = data[index].name;

            listNamesArr.push(listName)
        }
        createBoard(projectName, listNamesArr)
    })
}

/**
 * Creats a new trello board and then calls the "createLists" function
 * 
 * @param {string} boardName The name of the created board should be
 * @param {array} listNamesArr  An array of strnigs that should be the created lists names
 */
function createBoard(boardName, listNamesArr) {

    var options = {
        method: 'POST',
        url: 'https://api.trello.com/1/boards/',
        qs: {
            name: boardName,
            defaultLabels: 'true',
            defaultLists: 'false',
            idOrganization: idOrganization,
            keepFromSource: 'none',
            powerUps: 'all',
            prefs_permissionLevel: 'private',
            prefs_voting: 'disabled',
            prefs_comments: 'members',
            prefs_invitations: 'members',
            prefs_selfJoin: 'true',
            prefs_cardCovers: 'true',
            prefs_background: 'blue',
            prefs_cardAging: 'regular',
            key: key,
            token: token
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var data = JSON.parse(body)
        var boardId = data.id

        createLists(boardId, 0, listNamesArr)
    });
}

/**
 * Create lists in a trello board
 * 
 * @param {string} idBoard The id of the board that the created lists should be in
 * @param {int} index  A number thatpronounce the current functions Iteration (the function is recursive)
 * @param {*} listNamesArr  An array of strnigs that should be the created lists names
 */
function createLists(idBoard, index, listNamesArr) {
    if (index < listNamesArr.length) {
        const listName = listNamesArr[index];


        var options = {
            method: 'POST',
            url: 'https://api.trello.com/1/lists',
            qs: {
                name: listName,
                idBoard: idBoard,
                pos: index,
                key: '717b6b6cc100dccdd2578fe668294f2f',
                token: 'adeb17e0661d58453ab8e137871280fd036f1b3539686507bba30380337be178'
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

        })
        createLists(idBoard, index + 1, listNamesArr)
    }

}





module.exports = {
    getListId
}