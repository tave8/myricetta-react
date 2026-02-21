import { useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav } from "react-bootstrap"
import { Helmet } from "react-helmet"

import Recipe from "../assets/js/Recipe"

const RecipeComponent = (props) => {
  // const [ingredients, setIngredients]

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={6}>
        <Row className="flex-column g-3">
          {/* RECIPE INFO (name, photo etc.) */}
          <Col>
            <Form.Group>
              <Form.Control type="text" placeholder="Nome ricetta" />
            </Form.Group>
          </Col>
          {/* INGREDIENTS */}
          <Col>
            
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default RecipeComponent
