const express= require('express')
const cors=require('cors')

const app = express()
app.use(cors())
const taskRoutes = require('./src/routes/tasks')
app.use(express.urlencoded({extended:true}))
app.use('/tasks', taskRoutes)



app.get('/', (req, res)=>{
    res.json({
        staus: 'OK',
        now: new Date()
    })
})

app.listen(3002, ()=>{
    console.log('I am Godzilla!')
})