const mongoose = require('mongoose')
const schemas = require("./productSchemas.js")
const information = require("./hardcoded.js")

// const mongoDB = "mongodb+srv://trelloSynch:elazar@first-6qtxx.mongodb.net/trelloSyncher?retryWrites=true";
const mongoDB ="mongodb+srv://trelloSyncPB:newtrello555@productb-dxo1d.mongodb.net/trelloSyncPB?retryWrites=true";
// const projectModel = require("./mongoSchemas.js")
const projectModel = mongoose.model(information.collectionName.Project, schemas.projectSchema)
const sprintTrackerModel = mongoose.model(information.collectionName.sprintTracker, schemas.sprintTrackerSchema);


mongoose.set('useCreateIndex', true)
mongoose.connect(mongoDB, {
    useNewUrlParser: true
});
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




async function saveProjectToDb(projectObj) {
    let project = new projectModel({
        _id: projectObj.id,
        projectName:  projectObj.projectName,
        boardId: projectObj.boardId,
        tasks:projectObj.tasks,
        sprintTracker: projectObj.sprintTracker
    })
    project.save(function (err, newProject) {
        

        if (!err) {
           console.log('new project created');
        } else {
            console.log(err);
        }
    });
   
    
}


async function createSprintTrackerDB(sprintTrackerObj) {
   console.log('sprintTrackerObj : ' , sprintTrackerObj);
   
    let newArr = new Array(sprintTrackerObj.numberOfWeek * 7).fill(0)
    // const sprintTasks = cardObjArr
    newArr[0] = sprintTrackerObj.sumOfSP
    
    // const boardDetails = await getBoardIdByProjectId(plannerObj.ProjectId)
    // var numberOfWeek = (plannerObj.sprintLength / 7)
    
    await sprintTrackerModel.create({
        _id: sprintTrackerObj.id,
        boardId: sprintTrackerObj.boardId,
        name: sprintTrackerObj.projectName,
        numberOfWeek: sprintTrackerObj.numberOfWeek,
        actualBurnLive: [sprintTrackerObj.sumOfSP],
        idealBurnLive: newArr,
        sprintTasks: sprintTrackerObj.sprintTasks
        
    }, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            
            console.log("Document Save Done : " , doc);
        }
        
    });
    
}
async function handleError(err) {
    console.log(err.errmsg);
    
    return err.errmsg;
    
}

async function updateIdealBurn(boardId, sprintDay, currentSum) {
    sprintTrackerModel.findOne({
        boardId: boardId
    }, function (err, data) {
        if (err) console.log(err);
        // console.log(data.lastTotalEstimate);
        let finalIdealBurn = data.idealBurnLive
        finalIdealBurn[sprintDay - 1] += currentSum
        
        
        sprintTrackerModel.updateOne({
            name: projectName
        }, {
            idealBurnLive: finalIdealBurn
        }, function (err, log) {
            
        });
    });
    
    
    
}

  
async function updateActualBurn(boardId, currentSum) {
    // console.log("updateActualBurn from manager-db.js",currentSum );
        
    //    console.log('currentSum: ' ,currentSum + 1000);
        // var sprintTrackerModel = mongoose.model(information.collectionName.sprintTracker, schemas.sprintTrackerSchema);
        
       
           await sprintTrackerModel.updateOne({
                boardId: boardId
            }, {
                $push: {
                    actualBurnLive: currentSum
                }
            });
        
        
        
    }



// saveProjectToDb(projectObj)
// async function saveProjectToDb(projectObj) {
    
//     projectModel.create({
//         _id: projectObj.id,
//         projectName: projectObj.projectName,
//         boardId: projectObj.boardId,
//         tasks: projectObj.tasks,
//     }, function (err, small) {
//         if (err) return handleError(err);
//         // saved!
//     });
    
// }

// async function handleError(err) {
//     console.log(err.errmsg);
    
//     return err.errmsg;
    
// }



// try {
//   sprintTrackerModel.deleteOne( { _id : "5c643f16e3903f22fce4ad33" } );
//  } catch (e) {
//     console.log(e);
//  }




async function createSprintTrackSSSSSSSSSSSSSSSSSSSSSSSSSSerDB(sprintTrackerObj) {
   console.log(sprintTrackerObj);
   
    let idealBurnLive = new Array(sprintTrackerObj.numberOfWeek * 7).fill(0)
    // const sprintTasks = cardObjArr
    idealBurnLive[0] = sprintTrackerObj.sumOfSP
    actualBurnLive = [sprintTrackerObj.sumOfSP]
    
     
    return new Promise((res, rej)=>{
        sprintTrackerModel.create({
            boardId: sprintTrackerObj.boardId,
        name: sprintTrackerObj.projectName,
        numberOfWeek: sprintTrackerObj.numberOfWeek,
        actualBurnLive: actualBurnLive,
        idealBurnLive: idealBurnLive,
        sprintTasks: sprintTrackerObj.tasksArr
            }, async function (err, data) {
                console.log(data);
            if (res.statusCode >= 400) {
                console.log(err);
                rej(res.statusMessage)
                // return
            }else{
                res(data)

            }
                
                
        });
    
        })
    
}




getSprintTrackerByBoardId('5c5ffff925c082730a56451e')
function getSprintTrackerByBoardId(boardId) {
    
    return new Promise((res, rej)=>{
        sprintTrackerModel.findOne({
            boardId: boardId
            }, async function (err, data) {
                console.log(data);
            if (res.statusCode >= 400) {
                console.log(err);
                rej(res.statusMessage)
                // return
            }else{
                res(data)

            }
                
                
        });
    
        })
  
}





async function updateSprintTracker(boardId, updatedDoc) {
        
    // let newSprintDay = 0
    // const sprintTrackerModel = mongoose.model(information.collectionName.sprintTracker, schemas.sprintTrackerSchema);
    // var stwp = 
   return new Promise((res, rej)=>{
        sprintTrackerModel.findOneAndUpdate({
            boardId: boardId
            },{ $set: updatedDoc }, async function (err, data) {
                // console.log(data);
            if (res.statusCode >= 400) {
                console.log(err);
                rej(res.statusMessage)
                // return
            }else{
                console.log('----------------------------------------', data);
                
                res(data)
       
            }
            
            
    });

    })

}

async function updateSprintDay(boardId) {
        
    // let newSprintDay = 0
    // const sprintTrackerModel = mongoose.model(information.collectionName.sprintTracker, schemas.sprintTrackerSchema);
    // var stwp = 
   return new Promise((res, rej)=>{
        sprintTrackerModel.findOneAndUpdate({
            boardId: boardId
            },{ $inc: { sprintDay: 1} }, async function (err, data) {
                // console.log(data);
            if (res.statusCode >= 400) {
                console.log(err);
                rej(res.statusMessage)
                // return
            }else{
                res(data)
       
            }
            
            
    });

    })

}


module.exports = {getSprintTrackerByBoardId, updateSprintTracker, createSprintTrackerDB, saveProjectToDb}