const priorityChecker = (req, res, next) => {
    const { priority } = req.body
    if(priority && !['high', 'medium', 'low'].includes(priority.toLowerCase())){
        return res.status(400).json({
            status: 'failed',
            message: 'priority must be either high medium or low'
        })
    } 
    next()
  
    
    }
  
  module.exports = priorityChecker