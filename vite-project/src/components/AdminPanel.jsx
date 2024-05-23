import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import NotificationJS from 'notification-npm';
import '/node_modules/notification-npm/index.css';
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';

export const AdminPanel = () =>{
    document.title = "Admin Panel - IITK"
    const [students,setStudents] = useState([])
    const myfunc = async()=>{
      const response = await fetch('http://localhost:5000/getstudentsattendance',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'token':localStorage.getItem('token')
            }
        })
        const content = await response.json()
        if(content.success){
            setStudents(content.students)
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
    useEffect(()=>{
        myfunc()
    },[])
    return (
      <Container>
        <h1 style={{ 'textAlign': 'center', 'color': 'white' }}>Admin Panel</h1>
        <Button variant="primary m-2" href='/addstudent'>Add Student</Button>
        <Button variant="primary m-2" href='/mark'>Mark Attendance</Button>
        <div>
          {students.length>0 && students.map((student,index)=>{
            return (
              <div key={index} style={{'border':'1px solid white','padding':'10px','margin':'10px','color':'white','borderRadius':'10px'}}>
                <h4>{student.name}</h4>
                <h6>Roll Number: {student.roll}</h6>
                <h6>Attendance: {student.attendance}</h6>
              </div>
            )
          })}
          {students.length===0 && <h3 style={{'color':'white','marginTop':'20px'}}>No Students Found. Add Students to see their attendance</h3>}
        </div>
      </Container>
    );
}

export default AdminPanel;