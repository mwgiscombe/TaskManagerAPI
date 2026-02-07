const express= require('express')
const cors=require('cors')
const {MongoClient, ObjectId}=require('mongodb')

const app = express()
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

let db= null
async function connectToDB(){
    if(db) return db
  const password = process.env.PASSWORD
  console.log(process.env.PASSWORD)
const client = new MongoClient(`mongodb+srv://mwgiscombe:Louva313@madscluster.asbwf76.mongodb.net/?appName=MadsCluster`)
await client.connect()
console.log('connected')

db=client.db('tasksDB')
return db
}

//routes
const taskRoutes = require('./src/routes/tasks')

// app.use('/tasks', taskRoutes)



app.get('/', (req, res)=>{
    res.json({
        staus: 'OK',
        now: new Date()
    })
})
connectToDB().then((database)=>{
    app.use('/tasks', taskRoutes(database))
app.listen(3002, ()=>{
    console.log('I am Godzilla!')
})
})

module.exports =connectToDB