import { useState } from 'react'
import './App.css'
import { Navbar1 } from './components/Navbar1'
import { Route,Routes } from 'react-router-dom'
import { Home } from './components/Home'
import { Admin } from './components/Admin'
import { Student } from './components/Student'
import { AddStudent } from './components/AddStudent'
import { AdminPanel } from './components/AdminPanel'
import { Mark } from './components/Mark'

function App() {
  return (
    <>
      <Navbar1/>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/admin" element={<Admin/>}/>
        <Route exact path="/student" element={<Student/>}/>
        <Route exact path="/addstudent" element={<AddStudent/>}/>
        <Route exact path="/adminpanel" element={<AdminPanel/>}/>
        <Route exact path="/mark" element={<Mark/>}/>
        
    
      </Routes>
    </>
  )
}

export default App
