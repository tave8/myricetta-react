import { useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav } from "react-bootstrap"
import { Helmet } from "react-helmet"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import Recipe from "../assets/js/Recipe/Recipe"

const NavbarComponent = (props) => {
  const [expanded, setExpanded] = useState(false)

  const closeNavbar = () => setExpanded(false)

  return (
    <Col xs={12} className="p-0" style={{}}>
      <Navbar expand="lg" expanded={expanded} onToggle={setExpanded} className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand as={Link} to="/my-recipes" onClick={closeNavbar}>
            myricetta
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/my-recipes" onClick={closeNavbar}>
                Le mie ricette
              </Nav.Link>

              <Nav.Link as={Link} to="/add-recipe" onClick={closeNavbar}>
                Aggiungi ricetta
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Col>
  )
}

export default NavbarComponent
