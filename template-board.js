const trelloTemplateBboardId = '5bc4afc9bfdbd95f57fe35b4'
const promiseRequest = require('request-promise');
const information = require("./hardcoded.js")
const request = require("request");

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

                listId = currentListId
            }
        }
    })

    getTemplate(listId, projectName)
}

async function getTemplate(templateId, projectName) {

    var listNamesArr = []
    var options = {
        method: 'GET',
        url: 'https://api.trello.com/1/lists/' + templateId + '/cards',
        qs: {

            key: key,
            token: token
        }
    };

    await request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var data = JSON.parse(body)
        for (let index = 0; index < data.length; index++) {
            const listName = data[index].name;

            listNamesArr.push(listName)
        }
        createBoard(projectName, listNamesArr)
    })
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

        })
        createLists(idBoard, index + 1, listNamesArr)
    }

}





module.exports = {getListId}