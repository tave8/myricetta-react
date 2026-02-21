import { useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav, Table } from "react-bootstrap"
import { Helmet } from "react-helmet"

import Recipe from "../assets/js/Recipe"

const RecipeComponent = (props) => {
  const [recipeName, setRecipeName] = useState("")
  const [ingredients, setIngredients] = useState([])
  // the new ingredient that is being added
  const [newIngredientName, setNewIngredientName] = useState("")
  const [newIngredientQuantity, setNewIngredientQuantity] = useState(1)

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
                  const val = event.target.value
                  setRecipeName(val)
                }}
              />
            </Form.Group>
          </Col>
          {/* ADD INGREDIENT */}
          <Col className="">
            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Ingrediente"
                    value={newIngredientName}
                    onChange={(event) => {
                      const val = event.target.value
                      setNewIngredientName(val)
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group>
                  <Form.Control
                    type="number"
                    placeholder="Quantità (g)"
                    value={newIngredientQuantity}
                    onChange={(event) => {
                      const val = event.target.value
                      setNewIngredientQuantity(val)
                    }}
                  />
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
