let create = require("../template-board.js")
let sprinter = require("../sprint-first-step")



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

let sprintRecivedTasks = ['C1','C2','C6','C7'] // TO DO this is a temp var. real one comes from plenner in a pupsub 
let projectName =  'RT-Suite';  // TO DO this is a temp var. real one comes from plenner in a pupsub 

sprinter.startSprint(projectName, sprintRecivedTasks)
// create.getListId(getProjectLaunchedPupsub().templateName, getProjectLaunchedPupsub().projectName)