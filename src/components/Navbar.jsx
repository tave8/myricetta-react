import { useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav } from "react-bootstrap"
import { Helmet } from "react-helmet"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import Recipe from "../assets/js/Recipe"

const NavbarComponent = (props) => {
  return (
    <Col xs={12} className="p-0" style={{}}>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand as={Link} to="/add-recipe">
            myricetta
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/add-recipe">
                Aggiungi ricetta
              </Nav.Link>
              {/* <Nav.Link as={Link} to="/see-recipes">
                        Le mie ricette
                      </Nav.Link> */}

              {/* <Nav.Link href="#home">Home</Nav.Link>
                      <Nav.Link href="#link">Link</Nav.Link> */}

              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                      </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Col>
  )
}

export default NavbarComponent
