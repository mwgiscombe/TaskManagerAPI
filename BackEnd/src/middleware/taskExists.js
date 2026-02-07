const{MongoClient, ObjectId}=require('mongodb')


const taskExistsChecker= async (req, res, next) =>{
    const {id, subId} = req.params

    if(!ObjectId.isValid(id)){
        return res.status(500).json({
            status: 'failed',
            message: 'no such task'
        })
    }

    next()
}
 module.exports = taskExistsChecker

