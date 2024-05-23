import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

export const Navbar1 = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">IITK OAS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/student" className="nav-link">Student Login</Link>
            <Link to="/admin" className="nav-link">Admin Login</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
