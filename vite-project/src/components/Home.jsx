import React from 'react'
import Container from 'react-bootstrap/esm/Container'

export const Home = () => {
    document.title = "Face Recognition Attendance System - IITK"
  return (
    <Container style={{"textAlign":"center","paddingTop":"100px","color":"white"}}>
        <h1>Welcome campus junta</h1>
        <p>This is the Face Recognition Attendance System for IITK</p>
    </Container>
  )
}
