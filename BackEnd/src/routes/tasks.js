const express= require('express')

module.exports = function(db){
const router = express.Router()

const {
    getTasks,
    getImportantTasks,
    getCompletedTasks,
    getSoonTasks,
    getLaterTasks,
    getUnCompletedTasks,
    getImportantTasksReverse,
    createTask,
    createSubTask,
    updateTask,
    updateSubTask,
    deleteTask,
    deleteSubTask,
    deleteAll,
    deleteAllSubTasks,
    toggleCompleted,
    toggleSubCompleted
} = require('../controllers/tasks')(db)

const dateChecker = require('../middleware/dateChecker')
const priorityChecker = require('../middleware/priorityCheck')
const {textChecker, mustIncludeText} = require ('../middleware/textChecker')
const completedBool = require('../middleware/completedBool')
const taskExistsChecker = require('../middleware/taskExists')

router.get('/', getTasks) //done
router.get('/ordered', getImportantTasks) //done
router.get('/completed', getCompletedTasks)
router.get('/dateASC', getSoonTasks)//done
router.get('/dateDES', getLaterTasks)//done
router.get('/uncompleted', getUnCompletedTasks)//done
router.get('/ReverseOrdered', getImportantTasksReverse) //done

router.post('/', dateChecker, priorityChecker, mustIncludeText, completedBool, createTask) //done

router.patch('/:id/subtasks', dateChecker, priorityChecker, mustIncludeText, completedBool, taskExistsChecker, createSubTask) //done
router .patch('/:id/subtasks/:subId', completedBool, taskExistsChecker, updateSubTask)//done
router .patch('/:id/:subId/delete', taskExistsChecker, deleteSubTask)//done
router .patch('/:id/deleteAll', taskExistsChecker, deleteAllSubTasks)//done

router.patch('/:id/toggle', taskExistsChecker, toggleCompleted)//done
router.patch('/:id/subtasks/:subId/toggle', taskExistsChecker, toggleSubCompleted)//done



router.delete('/deleteAll', deleteAll) //done
router.delete('/:id',taskExistsChecker, deleteTask)//done

router.patch('/:id', dateChecker, priorityChecker, textChecker, completedBool, taskExistsChecker, updateTask)//done

return router
}