import { useState } from "react";
import { useEffect } from "react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

async function editTask(e,id){
    e.preventDefault()
   
    const editedText = new FormData(e.target)
    const text = editedText.get('text')
   
    try{
        const response = await fetch(`http://localhost:3002/tasks/${id}`, {
           method: 'PATCH',
            headers:{
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({text:text})
        })
        const data = await response.json()
        return data

    }catch(error){
        console.log('ugh')
        throw error
    }
    

}

function FetchTasks(){
    
    const [tasks, setTasks] = useState([])

useEffect(() => { fetch("http://localhost:3002/tasks") .then(res => res.json()) .then(data => setTasks(data.data)); }, []);

return(
    <div>
        {tasks.map(t=>(
            <>
            <li>{t.text}</li>
            <Form onSubmit={async (e)=>{
               const updated = await editTask(e,`${t.id}`)
               setTasks(prev=>
                prev.map(task =>
                    task.id === t.id ? updated.data : task
                )
               )}} method='POST'>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Example textarea</Form.Label>
                    <Form.Control type="text" name='text' />
                    <Button variant="primary" type="submit">
        Submit
      </Button>
                </Form.Group>
            </Form>
            </>
        ))}
    </div>
)

}
export default FetchTasks