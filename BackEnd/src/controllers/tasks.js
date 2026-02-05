let TASKS = [
    {
        id: 1,
        text: 'daw',
        user: 'eee',
        class1: 'we',
        dueDate: 'gw',
        priority: 'www',
        subTasks: [{
            id: 1,
            subText: 'ee',
            subDueDate: 'eee',
            subCompleted: false
        }],
        progress:0,
        completed: false
    },
    {
        id: 2,
        text: 'Meow',
        user: 'eee',
        class1: 'we',
        dueDate: 'gw',
        priority: 'www',
        subTasks: [{
            id: 1,
            subText: 'ee',
            subDueDate: 'eee',
            subCompleted: false
        }],
        progress:0,
        completed: false
    }
]

let taskCounter = 3

const updateProgress = (task) =>{
   if(!task.subTasks || task.subTasks.length === 0){
    return 0
   }
   let completed = task.subTasks.filter(st=> st.subCompleted == true).length
   let total = task.subTasks.length
   console.log(completed)

   return completed / total

}

const getTasks = (req, res) => {
    let tasks = [...TASKS]
    res.json({
        status: 'success',
        data: tasks
    })
}

const createTask =  (req, res) => {
    const {id, text, user, class1, dueDate, priority, subTasks = [], progress, completed}  = req.body
    let subTaskCounter = 1
    const newTask = {
        id: taskCounter++,
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
    }
    TASKS.push(newTask)
    res.json({
        status: 'ok',
        message: 'New Task Created'
    })
}

const updateTask = (req, res) => {
    const {id}= req.params
    const updates = req.body
    const Taskid=Number(id)
    let existingTask = TASKS.find(t=>t.id == Taskid)

    if(!existingTask){
        return res.status(400).json({
            status: 'failed',
            message: 'No such taks, hoss.'
        })
    }

    for (const key in updates){
        if(updates[key] != undefined){
            existingTask[key] = updates[key]
        }
    }
    existingTask.progress = updateProgress(existingTask)
    
    res.json({
        status: 'ok',
        message: 'Task Updated!',
        data: existingTask
    })

}

const updateSubTask = (req, res) => {
    const {id}= req.params
    const {subId} = req.params
    const subUpdates = req.body
    const Taskid=Number(id)
    const subTaskId = Number(subId)
    let existingTask = TASKS.find(t=>t.id == Taskid)
    let existingSubTask = existingTask.subTasks.find(t=> t.id == subTaskId)

    if(!existingTask){
        return res.status(400).json({
            status: 'failed',
            message: 'No such taks, hoss.'
        })
    }

    if(!existingSubTask){
        return res.status(400).json({
            status: 'failed',
            message: "no such subtask"
        })
    }

    for (const key in subUpdates){
        if(subUpdates[key] != undefined){
            existingSubTask[key] = subUpdates[key]
        }
    }
    existingTask.progress = updateProgress(existingTask)
    console.log(existingSubTask)

    res.json({
        status: 'ok',
        message: 'subTask Updated!',
        data: existingSubTask
    })

}
const deleteTask = (req, res) => {
    const {id} =  req.params
    let existingTask = TASKS.find(t=> t.id == id)

    if(!existingTask){
        return res.status(400).json({
            status: 'failed',
            message: 'No such task, dude.'
        })
    }

    TASKS = TASKS.filter(t=> t.id !== id)
    res.json({
        status: 'ok',
        message: 'Task Deleted'
    })
}


module.exports={
    getTasks,
    createTask,
    updateTask,
    updateSubTask,
    deleteTask
}