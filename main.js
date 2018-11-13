let create = require("./template-board.js")
let sprinter = require("./sprint-first-step")

/**
 * Gets a pupsub with "project name"," choosen template name","user stories" and all project tasks
 * @returns {object} object with all the above
 */
function getProjectLaunchedPupsub() {
    let tempOutput = {
        projectName: "RT Suite",
        templateName: "Template C"
    }

    return tempOutput

}


// sprinter.startSprint()
// create.getListId(getProjectLaunchedPupsub().templateName, getProjectLaunchedPupsub().projectName)