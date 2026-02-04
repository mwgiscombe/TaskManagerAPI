const express= require('express')
const router = express.Router()

const {
    getTasks,
    createTask,
    updateTask,
    updateSubTask,
    deleteTask
} = require('../controllers/tasks')

const dateChecker = require('../middleware/dateChecker')

router.get('/', getTasks)
router.post('/', dateChecker, createTask)
router.patch('/:id', updateTask)
router .patch('/:id/subtasks/:subId', updateSubTask)
router.delete('/:id', deleteTask)

module.exports = router