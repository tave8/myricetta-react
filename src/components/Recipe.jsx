import { useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav, Table } from "react-bootstrap"
import { Helmet } from "react-helmet"

import Recipe from "../assets/js/Recipe"

const RecipeComponent = (props) => {
  // the Recipe instance. must not me touched.
  const [_recipeInstance, _setRecipeInstance] = useState(new Recipe())
  // recipe info
  const [recipeName, setRecipeName] = useState("")
  // ingredients
  const [ingredientsCalculations, setIngredientsCalculations] = useState(null)
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
              {/* new ingredient name */}
              <Col xs={6}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Ingrediente"
                    id="new-ingredient-name"
                    value={newIngredientName}
                    onChange={(event) => {
                      const val = event.target.value
                      setNewIngredientName(val)
                    }}
                    onKeyDown={(event) => {
                      // if user has typed Enter, trigger add ingredient
                      if (event.key == "Enter") {
                        const context = {
                          setNewIngredientName,
                          setNewIngredientQuantity,
                          newIngredientName,
                          newIngredientQuantity,
                          setIngredientsCalculations,
                          _recipeInstance,
                        }
                        addIngredientHelper(context)()
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              {/* new ingredient quantity  */}
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
                    onKeyDown={(event) => {
                      // if user has typed Enter, trigger add ingredient
                      if (event.key == "Enter") {
                        const context = {
                          setNewIngredientName,
                          setNewIngredientQuantity,
                          newIngredientName,
                          newIngredientQuantity,
                          setIngredientsCalculations,
                          _recipeInstance,
                        }
                        addIngredientHelper(context)()
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={3} className="text-end">
                <Button
                  variant="primary"
                  onClick={() => {
                    const context = {
                      setNewIngredientName,
                      setNewIngredientQuantity,
                      newIngredientName,
                      newIngredientQuantity,
                      setIngredientsCalculations,
                      _recipeInstance,
                    }
                    addIngredientHelper(context)()
                  }}
                >
                  +
                </Button>
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
                {/*  */}
                {ingredientsCalculations?.ingredients.map((ingredient) => {
                  return (
                    <tr key={ingredient.id}>
                      <td>{ingredient.name}</td>
                      <td>{ingredient.quantityRounded}</td>
                      <td>{ingredient.percentageRounded}</td>
                      <td className="text-end">
                        <Button variant="danger">-</Button>
                      </td>
                    </tr>
                  )
                })}
                {/* no calculation yet */}
                {!ingredientsCalculations && (
                  <tr>
                    <td colSpan="4">Aggiungi il primo ingrediente</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                {ingredientsCalculations && (
                  <tr>
                    <td>TOTALE:</td>
                    <td>{ingredientsCalculations.totIngredientsRounded}</td>
                  </tr>
                )}
              </tfoot>
            </Table>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

const addIngredientHelper = ({
  _recipeInstance,
  setNewIngredientName,
  setNewIngredientQuantity,
  newIngredientName,
  newIngredientQuantity,
  setIngredientsCalculations,
}) => {
  return () => {
    // empty the new ingredient inputs
    setNewIngredientName("")
    setNewIngredientQuantity(1)
    // input focus on ingredient name
    focusNewIngredientName()
    // add ingredient

    _recipeInstance.addIngredient({
      name: newIngredientName,
      quantity: newIngredientQuantity,
    })

    setIngredientsCalculations(_recipeInstance.getIngredients())
    // console.log(_recipeInstance.getIngredients())
    // console.log(_recipeInstance)
  }
}

const focusNewIngredientName = () => {
  const element = document.getElementById("new-ingredient-name")
  element.focus()
}

export default RecipeComponent
