import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import NotificationJS from 'notification-npm'
import '/node_modules/notification-npm/index.css'
import { useNavigate } from 'react-router-dom'


export const Admin = () => {
    document.title = "Admin Login - IITK"
    const [password, setPassword] = useState('')
    const history = useNavigate()

    const submit = async(e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:5000/adminlogin',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({password})
        })
        const content = await response.json()
        if(content.success){
            localStorage.setItem('token',content.token)
            history('/adminpanel')
        }
        else{
          const notification = new NotificationJS({
            message: 'Invalid Credentials',
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
    <h3 style={{"textAlign":"center"}}>Admin Login</h3>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={(e)=>submit(e)}>
        Submit
      </Button>
    </Form>
    </Container>
  )
}
