const create = require("../template-board.js")
const sprinter = require("../sprint-tracker/sprint-first-step.js")
// const server = require('../bugs/bugs-tracking.js')


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

let sprintRecivedTasks = ['task 1','task 2','task 3','task 4'] // TO DO this is a temp var. real one comes from plenner in a pupsub 
let projectName =  'running-board';  // TO DO this is a temp var. real one comes from plenner in a pupsub 

sprinter.startSprint(projectName, sprintRecivedTasks)
// create.getListId(getProjectLaunchedPupsub().templateName, getProjectLaunchedPupsub().projectName)