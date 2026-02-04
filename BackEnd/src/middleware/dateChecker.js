const dateChecker = (req, res, next) => {
    const { dueDate } = req.body
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/
    if(!regex.test(dueDate)){
        return res.status(400).json({
            status: 'failed',
            message: 'please enter valid date in MM/DD/YYYY format'
        })
    } 
    next()
  
    
    }
  
  module.exports = dateChecker


  