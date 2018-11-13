let create = require("./template-board.js")

/**
 * Gets a pupsub with "project name"," choosen template name","user stories" and all project tasks
 * @returns {object} object with all the above
 */
function getProjectLaunchedPupsub() { // TODO at this momment this function is hardcoded
    let tempOutput = {
        projectName: "RT-Suite3",
        templateName: "Template C"
    }

    return tempOutput

}
console.log(getProjectLaunchedPupsub().projectName);


// create.getListId(getProjectLaunchedPupsub().templateName, getProjectLaunchedPupsub().projectName)


