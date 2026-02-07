const express= require('express')
const{MongoClient, ObjectId}=require('mongodb')


const app = express()
app.use(express.urlencoded({extended: true}))
const DB_NAME = 'tasksDB'
function calcProgress(task){
    if(!task.subTasks || task.subTasks.length === 0) return "0%"
    if(task.completed == true) {
        task.subTasks.forEach(st=>st.completed = true)
        return "100%"
    }

    const completedTasks = task.subTasks.filter(st=> st.completed).length
    return (completedTasks/task.subTasks.length)*100 + '%'
}
module.exports = (db) =>({
   
getTasks: async (req, res)=>{
                const tasks = await db.collection('tasks').find().toArray()
                if(tasks.length === 0){
                   return res.json({
                        status: 'SUCCESS',
                        message: `There ain't no tasks.`
                    })
                }
                res.json({
                    status: 'SUCCESS',
                    data: tasks
                })
            
        },
getImportantTasks: async (req, res)=>{
            const tasks = await db.collection('tasks').find().toArray()
            if(tasks.length === 0){
                return res.json({
                     status: 'sucess',
                     message: 'There aint no tasks.'
                 })
             }
            const importantTasks = tasks.filter(task=> task.priority.toLowerCase()==='high')
            const mediumTasks = tasks.filter(task => task.priority.toLowerCase() === 'medium')
            const lowTasks = tasks.filter(task=> task.priority.toLowerCase() === 'low')
           
            res.json({
                status: 'SUCCESS',
                data: [...importantTasks, 
                ...mediumTasks, 
                ...lowTasks]
            })
        
    },

    getCompletedTasks: async (req, res)=>{
        const tasks = await db.collection('tasks')
        const completedTasks =await tasks.find({completed:true}).toArray()
        if(tasks.length === 0){
            return res.json({
                 status: 'sucess',
                 message: 'There aint no tasks.'
             })
         }
       
        
       
        res.json({
            status: 'SUCCESS',
            data: completedTasks
        })
    
},

getSoonTasks: async (req, res)=>{
    const tasks = await db.collection('tasks')
    const sortedTasks =await tasks.find({completed:false}).sort({dueDate: 1}).toArray()
    if(tasks.length === 0){
        return res.json({
             status: 'sucess',
             message: 'There aint no tasks.'
         })
     }
   
    
   
    res.json({
        status: 'SUCCESS',
        data: sortedTasks
    })

},
getLaterTasks: async (req, res)=>{
    const tasks = await db.collection('tasks')
    const sortedTasks =await tasks.find({completed:false}).sort({dueDate: -1}).toArray()
    if(tasks.length === 0){
        return res.json({
             status: 'sucess',
             message: 'There aint no tasks.'
         })
     }
   
    
   
    res.json({
        status: 'SUCCESS',
        data: sortedTasks
    })

},
getUnCompletedTasks: async (req, res)=>{
    const tasks = await db.collection('tasks')
    const unCompletedTasks =await tasks.find({completed:false}).toArray()
    if(tasks.length === 0){
        return res.json({
             status: 'sucess',
             message: 'There aint no tasks.'
         })
     }
   
    
   
    res.json({
        status: 'SUCCESS',
        data: unCompletedTasks
    })

},

getImportantTasksReverse: async (req, res)=>{
        const tasks = await db.collection('tasks').find().toArray()
        if(tasks.length === 0){
            return res.json({
                 status: 'SUCCESS',
                 message: 'There aint no tasks.'
             })
         }
        const importantTasks = tasks.filter(task=> task.priority.toLowerCase()==='high')
        const mediumTasks = tasks.filter(task => task.priority.toLowerCase() === 'medium')
        const lowTasks = tasks.filter(task=> task.priority.toLowerCase() === 'low')
       
        res.json({
            status: 'SUCCESS',
            data: [...lowTasks, 
            ...mediumTasks, 
            ...importantTasks]
        })
    
},

createTask: async (req, res) => {
    let taskCounter = 0
    const {id, text, user, class1, dueDate, priority, subTasks = [], progress, completed}  = req.body
    let subTaskCounter = 1
    const tasks = await db.collection('tasks')
    

    await tasks.insertOne({
        text,
        user,
        class1,
        dueDate,
        priority,
        subTasks: subTasks.map((st, subTaskCounter)=>({
            id: subTaskCounter++,
            subText: st.text,
            subDueDate: st.dueDate,
            subCompleted: false
        })),
        progress:0,
        completed: false
    })
    res.json({
        status: 'SUCCESS',
        message: 'New Task Created'
    })
},
createSubTask: async (req, res) => {
    try{
    const { id } = req.params
    const {text, user, dueDate, priority, completed}  = req.body
   
    const tasks = db.collection('tasks')
    
    
    const task = await tasks.findOne({
        _id: new ObjectId(id)
    })

   
    
    
    let counter = task.subTasks.length
    await tasks.updateOne(
        {_id: new ObjectId(id)},
        
        {$push:{
            subTasks: {
                id: counter,
                text,
                user,
                dueDate,
                priority,
                completed: false

            }
        }
    })
    const updatedTask = await tasks.findOne({_id: new ObjectId(id)})
    const newProgress = calcProgress(updatedTask)
    await tasks.updateOne({
        _id: new ObjectId(id)},
    {$set: {progress: newProgress}})
       
    res.json({
        status: 'SUCCESS',
        message: 'New SubTask Created'
    })
} catch(error){
    res.status(500).json({
        status: 'FAILED',
        message: 'Something went terribly wrong with your subtask'
    })
}
},

updateTask: async (req, res) => {
    try{
    const {id}= req.params
    const {text, user, class1, dueDate, priority, subTasks, progress, completed}  = req.body
    const updates = {}

    if(text){
        updates.text = text
    }
    if(user){
        updates.user = user
    }
    if(class1){
        updates.class1 = class1
    }
    if(dueDate){
        updates.dueDate = dueDate
    }
    if(priority){
        updates.priority = priority
    }
    if(subTasks != undefined){
        updates.subTasks = subTasks
    }
    if(completed && (completed == 'true' || completed == 'false')){
        updates.completed = completed == 'false' ? false : true
    }
    
    const tasks = await db.collection('tasks')
    

    await tasks.updateOne(
        {_id: new ObjectId(id)},
        {$set: updates}   
        )
    // existingTask.progress = updateProgress(existingTask)
    
    res.json({
        status: 'SUCCESS',
        message: 'Task Updated!',
        
    })

} catch (error){
    res.status(500).json({
        status: 'FAILED', 
        message: 'Yikes. It broke.'
    })
}
},

toggleCompleted: async (req, res) => {
    try{
        const {id}= req.params
        const tasks = await db.collection('tasks')
        const task = await tasks.findOne({_id: new ObjectId(id)})
        
        let isCompleted = task.completed == false ? true : false
        await tasks.updateOne(
            {_id: new ObjectId(id)},
           {$set: {completed: isCompleted}}
        )
        if (isCompleted === true) { await tasks.updateOne( { _id: new ObjectId(id) }, { $set: { "subTasks.$[].completed": true } } ) }
        const updatedTask = await tasks.findOne({_id: new ObjectId(id)})
        const newProgress = calcProgress(updatedTask)
        await tasks.updateOne({
            _id: new ObjectId(id)},
        {$set: {progress: newProgress}})
        res.json({
            status: 'SUCCESS!',
            message: `Task completion has been toggled to ${isCompleted}!`
        })
        

} catch(error) {
    res.status(500).json({
        status: 'FAILED', 
        message: 'Toggling has failed.'
    })
}},
toggleSubCompleted: async (req, res) => {
    try{
        const {id, subId}= req.params
        const suId = Number(subId)
        const tasks = await db.collection('tasks')
        const task = await tasks.findOne({_id: new ObjectId(id)})
        const subTask = task.subTasks.find(st=> st.id === suId)
        let isCompleted = subTask.completed == false ? true : false
        await tasks.updateOne(
            {_id: new ObjectId(id),"subTasks.id": suId},
           {$set: {"subTasks.$.completed": isCompleted}}
        )

        const updatedTask = await tasks.findOne({_id: new ObjectId(id)})
        const newProgress = calcProgress(updatedTask)
        await tasks.updateOne({
            _id: new ObjectId(id)},
        {$set: {progress: newProgress}})

        res.json({
            status: 'SUCCESS!',
            message: `SubTask has been toggled to ${isCompleted}`
        })
        

} catch(error) {
    res.status(500).json({
        status: 'FAILED', 
        message: 'Toggling did not work.'
    })
}},

updateSubTask: async (req, res) => {
    try{
    const {id, subId }= req.params
    const {text, user, dueDate, priority} = req.body
    const suId = Number(subId)
    const tasks = await db.collection('tasks')
    const task = await db.collection('tasks').findOne({
        _id: new ObjectId(id)
    })

    if(!task.subTasks.some(st=> st.id === suId)){
        return res.status(500).json({
            status: 'FAILED',
            message: 'No such subtask'
        })
    }
    const updates ={}
    if(text !== undefined){
        updates["subTasks.$.text"] = text
    }
    if(user !== undefined){
        updates["subTasks.$.user"] = user
    }
    if(dueDate !== undefined){
        updates["subTasks.$.dueDate"] = dueDate
    }
    if(priority !== undefined){
        updates["subTasks.$.priority"]= priority
    }

    await tasks.updateOne(
        {_id: new ObjectId(id), "subTasks.id": suId},
        {$set: updates}
    )
    res.json({
        status: 'SUCCESS',
        message: 'SubTask has been updated'
    })
    } catch (error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Can not update subtask'
        })
    }
    

},
deleteTask: async (req, res) => {
    try{
        const {id}= req.params
        const tasks = await db.collection('tasks')
        await tasks.deleteOne(
            {_id: new ObjectId(id)})
        res.json({
            status: 'SUCCESS',
            message: 'Task deleted! Oh yeah!'
        })
    } catch (error){
        res.status(500).json({
            status: 'FAILED', 
            message: 'That did not delete anything!'
        })
    }

},
deleteSubTask: async (req, res) => {
    try{
        const {id, subId}= req.params
        const suId = Number(subId)
        const tasks = await db.collection('tasks')
        const task = await tasks.findOne({_id: new ObjectId(id)})
        const subTask = task.subTasks.find(st=> st.id === suId)
        const newSubTasks = task.subTasks.filter(st => st.id != suId)
        await tasks.updateOne(
            {_id: new ObjectId(id)},
            {$set: {"subTasks": newSubTasks}}
        )
        res.json({
            status: 'SUCCESS',
            message: 'Subtask deleted! Oh yeah!'
        })
    } catch (error){
        res.status(500).json({
            status: 'FAILED', 
            message: 'That did not delete anything!'
        })
    }

},

deleteAllSubTasks: async (req, res) => {
    try{
        const {id}= req.params
       
        const tasks = await db.collection('tasks')
        
       
        await tasks.updateOne(
            {_id: new ObjectId(id)},
            {$set: {"subTasks": []}}
        )
        res.json({
            status: 'SUCCESS',
            message: 'Subtasks deleted! Oh yeah!'
        })
    } catch (error){
        res.status(500).json({
            status: 'FAILED', 
            message: 'That did not delete anything!'
        })
    }

},
deleteAll: async (req, res) => {
    try{
        
        const tasks = db.collection('tasks')
        await tasks.deleteMany(
            {})
        res.json({
            status: 'SUCCESS',
            message: 'You have deleted all tasks!'
        })
    } catch (error){
        res.status(500).json({
            status: 'FAILED', 
            message: 'That did not delete anything!'
        })
    }

},

})