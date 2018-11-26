const promiseRequest = require('request-promise');
const request = require("request");
const information = require("./main/hardcoded.js")

const trelloTemplateBboardId = information.trelloTemplateBboardId
const key = information.key;
const token = information.token;
const idOrganization = information.idOrganization



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
// TO
                listId = currentListId
            }
        }
    })
return listId
}
// name()
async function name() {
    
    var listiddddddd = await getListId('Template C')
   
   var TemplateToCreate = await getTemplate(listiddddddd)
    
    createBoard(TemplateToCreate)
   
    console.log(listiddddddd);
    console.log(TemplateToCreate);
}

async function getTemplate(templateId) {

    let listNamesArr = [];
    var options = {
        method: 'GET',
        url: 'https://api.trello.com/1/lists/' + templateId + '/cards',
        qs: {

            key: key,
            token: token
        }
    };

    await promiseRequest(options, function (error, response, body) {
        if (error) throw new Error(error);

        var data = JSON.parse(body)
        for (let index = 0; index < data.length; index++) {
            const listName = data[index].name;

            listNamesArr.push(listName)
        }
    })
    return listNamesArr
}


async function createBoard(boardName, listNamesArr) {

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

    await request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var data = JSON.parse(body)
        var boardId = data.id

        createLists(boardId, 0, listNamesArr)
    });
}

async function createLists(idBoard, index, listNamesArr) {
    if (index < listNamesArr.length) {
        const listName = listNamesArr[index];


        var options = {
            method: 'POST',
            url: 'https://api.trello.com/1/lists',
            qs: {
                name: listName,
                idBoard: idBoard,
                pos: index,
                key: key,
                token: token
            }
        };

       await request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(response);
        })
        
        createLists(idBoard, index + 1, listNamesArr)
    }

}





module.exports = {getListId}