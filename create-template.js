var request = require("request");

var key = '7966cb05456905ba53518729fd9f6ce0';
var token = '3bdb7a7b48867f5792772323500993f25ed8f1ce85b6805a4e37316be58616c0';
var idOrganization = '5b7aa60c58c0653c14fd503e'
var listNamesArr = []

var boardId = '';


// getTemplate(templateC)
function createBoard(boardName,callback) {

 

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
            prefs_background: 'green',
            prefs_cardAging: 'regular',
            key: key,
            token: token
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);



        var data = JSON.parse(body)
        boardId = data.id
        
        // createLists(boardId, 0)
        callback(boardId,0)


    });
}



function createLists(idBoard, index) {
    if (index < listNamesArr.length) {
        const listName = listNamesArr[index];


        var options = {
            method: 'POST',
            url: 'https://api.trello.com/1/lists',
            qs: {
                name: listName,
                idBoard: idBoard,
                pos: "bottom",
                key: key,
                token: token
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        })
        setTimeout(function() {
            createLists(boardId, index + 1)
        }, 500)
        
    }
   
}


function deleteBoard(id) {


    var options = {
        method: 'DELETE',
        url: 'https://api.trello.com/1/boards/' + id,
        qs: {
            key: '717b6b6cc100dccdd2578fe668294f2f',
            token: 'adeb17e0661d58453ab8e137871280fd036f1b3539686507bba30380337be178'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);


    });
}


function getTemplate(template) {

    var options = {
        method: 'GET',
        url: 'https://api.trello.com/1/lists/' + template.id + '/cards',
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


        console.log('-------------' + listNamesArr);


        createBoard(template.name,createLists)
    })
}


// createBoard()
// deleteBoard()
// createLists()
module.exports={getTemplate}