import { useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav, Table } from "react-bootstrap"
import { Helmet } from "react-helmet"

import Recipe from "../assets/js/Recipe"

const RecipeComponent = (props) => {
  const [recipeName, setRecipeName] = useState("")
  const [ingredients, setIngredients] = useState([])

  return (
    // centers content in the page
    <Row className="justify-content-center">
      <Col xs={12} md={6}>
        <Row className="flex-column g-3">
          {/* TITLE */}
          <Col className="">
            <h2 className="text-center">Aggiungi ricetta</h2>
          </Col>
          {/* RECIPE INFO (name, photo etc.) */}
          <Col className="">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Nome ricetta"
                value={recipeName}
                onChange={(event) => {
                  const newRecipeName = event.target.value
                  setRecipeName(newRecipeName)
                }}
              />
            </Form.Group>
          </Col>
          {/* ADD INGREDIENT */}
          <Col className="">
            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Control type="text" placeholder="Ingrediente" />
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group>
                  <Form.Control type="number" placeholder="Quantità (g)" />
                </Form.Group>
              </Col>
              <Col xs={3} className="text-end">
                <Button variant="primary">+</Button>
              </Col>
            </Row>
          </Col>
          {/* INGREDIENTS LIST (proportions etc.) */}
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Ingr.</th>
                  <th>Q.tà</th>
                  <th>%</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient) => {
                  return (
                    <tr key={ingredient.id}>
                      {/*  */}
                      <p></p>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default RecipeComponent
