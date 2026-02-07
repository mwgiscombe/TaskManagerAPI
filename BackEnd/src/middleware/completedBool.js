const completedBool= (req, res, next) => {
    const{completed} = req.body

    if(completed && ![true, false].includes(completed.toLowerCase())){
        return res.status(500).json({
            status: 'failed',
            message: 'Completed must be True or False only!'
        })
    }
    next()
}

module.exports = completedBool