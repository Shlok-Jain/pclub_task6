import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import { useState } from 'react'
import NotificationJS from 'notification-npm'
import '/node_modules/notification-npm/index.css'

export const Student = () => {
    document.title = "Student Login - IITK"
    const [roll,setRoll] = useState('')
    const [password,setPassword] = useState('')
    const [attendance,setAttendance] = useState(null)

    const submit = async(e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:5000/student',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({roll,password})
        })
        const content = await response.json()
        if(content.success){
            setAttendance(content.attendance)
        }
        else{
          const notification = new NotificationJS({
            message: content.message,
            type: 'error',
            duration: 5000,
            theme: 'dark',
            sound: false,
            disable_timer:false,
          })
          notification.show()
        }
    }
  return (
    <Container className='studform'>
    <h3 style={{"textAlign":"center"}}>Student Login</h3>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Roll Number</Form.Label>
        <Form.Control type="number" onChange={(e)=>setRoll(e.target.value)} placeholder="Enter Roll No." />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={(e)=>submit(e)}>
        Submit
      </Button>
    </Form>
    <div>
      {attendance!==null && <h4>Your Attendance is {attendance}</h4>}
    </div>
    </Container>
  )
}
