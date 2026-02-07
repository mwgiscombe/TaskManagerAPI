const textChecker = (req, res, next) => {
    const { text } = req.body
    if(text === ''){
        return res.status(400).json({
            status: 'failed', 
            message: `Um. Text can't be empty yo.`
        })
    }
    next()
}

const mustIncludeText = (req, res, next) => {
    const {text} = req.body
    if(!text){
        return res.status(400).json({
            status: 'failed',
            message: 'Please give your task a title using the text field.'
        })
    }
    next()
}

module.exports = {textChecker, mustIncludeText}