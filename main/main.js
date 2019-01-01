const create = require("../template-board.js")
const sprinter = require("../sprint-tracker/sprint-first-step.js")
const sprintTracker = require("../sprint-tracker/sprint-burn.js")
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

const sprintRecivedTasks = ['H1','H2','H3','H4'] // TO DO this is a temp var. real one comes from plenner in a pupsub 
const projectName =  'test';  // TO DO this is a temp var. real one comes from plenner in a pupsub 
const sprintLength = 14;
const sprintName = 'first';
// sprinter.startSprint(projectName, sprintRecivedTasks, sprintLength, sprintName)
sprintTracker.run('5be42dc918f706736ed1849f', 4, sprintName)

// create.getListId(getProjectLaunchedPupsub().templateName, getProjectLaunchedPupsub().projectName)