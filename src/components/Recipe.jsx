import { useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav, Table } from "react-bootstrap"
import { Helmet } from "react-helmet"

import Recipe from "../assets/js/Recipe"

const RecipeComponent = (props) => {
  // the Recipe instance. must not me touched.
  const [_recipeInstance, _setRecipeInstance] = useState(new Recipe())
  // recipe info
  const [recipeName, setRecipeName] = useState("")
  // initial/original ingredients
  const [ingredientsCalculations, setIngredientsCalculations] = useState(null)
  // ingredients from 1 ingredient
  const [ingredientsCalculationsFromIngredient, setIngredientsCalculationsFromIngredient] = useState(null)
  // the new ingredient that is being added
  const [newIngredientName, setNewIngredientName] = useState("")
  const [newIngredientQuantity, setNewIngredientQuantity] = useState(1)
  // the one ingredient to calculate the others from
  const [knownIngredientName, setKnownIngredientName] = useState("")
  const [knownIngredientQuantity, setKnownIngredientQuantity] = useState(1)

  return (
    // centers content in the page
    <Row className="justify-content-center">
      <Col xs={12} md={6}>
        <Row className="flex-column g-3">
          {/* PAGE TITLE */}
          <Col>
            <h2 className="text-center">Aggiungi ricetta</h2>
          </Col>
          {/* RECIPE INFO (name, photo etc.) */}
          <Col>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Nome ricetta"
                value={recipeName}
                onChange={(event) => {
                  const val = event.target.value
                  setRecipeNameMiddleware(setRecipeName)(val)
                }}
              />
            </Form.Group>
          </Col>
          {/* INITIAL/ORIGINAL INGREDIENTS (add ingredient, ingredients list) */}
          <Col>
            <Row className="flex-column g-3">
              {/* title */}
              <Col>
                <h4>Ingredienti</h4>
              </Col>
              {/* add ingredient */}
              <Col>
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
                          setNewIngredientNameMiddleware(setNewIngredientName)(val)
                        }}
                        onKeyDown={(event) => {
                          // if user has typed Enter, trigger add ingredient
                          if (event.key == "Enter") {
                            const context = {
                              setNewIngredientName: setNewIngredientNameMiddleware(setNewIngredientName),
                              setNewIngredientQuantity,
                              newIngredientName,
                              newIngredientQuantity,
                              setIngredientsCalculations,
                              _recipeInstance,
                              knownIngredientName,
                              knownIngredientQuantity,
                              setIngredientsCalculationsFromIngredient,
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
                              setNewIngredientName: setNewIngredientNameMiddleware(setNewIngredientName),
                              setNewIngredientQuantity,
                              newIngredientName,
                              newIngredientQuantity,
                              setIngredientsCalculations,
                              _recipeInstance,
                              knownIngredientName,
                              knownIngredientQuantity,
                              setIngredientsCalculationsFromIngredient,
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
                          setNewIngredientName: setNewIngredientNameMiddleware(setNewIngredientName),
                          setNewIngredientQuantity,
                          newIngredientName,
                          newIngredientQuantity,
                          setIngredientsCalculations,
                          _recipeInstance,
                          knownIngredientName,
                          knownIngredientQuantity,
                          setIngredientsCalculationsFromIngredient,
                        }
                        addIngredientHelper(context)()
                      }}
                    >
                      +
                    </Button>
                  </Col>
                </Row>
              </Col>
              {/* ingredients list */}
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
                    {/* exist ingredients */}
                    {ingredientsCalculations?.ingredients.map((ingredient) => {
                      return (
                        <tr key={ingredient.id}>
                          <td>{ingredient.name}</td>
                          <td>{ingredient.quantityRounded}</td>
                          <td>{ingredient.percentageRounded}</td>
                          <td className="text-end">
                            <Button
                              variant="danger"
                              onClick={() => {
                                const context = {
                                  _recipeInstance,
                                  newIngredientName,
                                  newIngredientQuantity,
                                  setIngredientsCalculations,
                                  knownIngredientName,
                                  knownIngredientQuantity,
                                  setIngredientsCalculationsFromIngredient,
                                }
                                const ingredientNameToRemove = ingredient.name
                                removeIngredientHelper(context)(ingredientNameToRemove)
                              }}
                            >
                              -
                            </Button>
                          </td>
                        </tr>
                      )
                    })}

                    {/* no ingredients */}
                    {(!ingredientsCalculations || ingredientsCalculations.ingredients.length == 0) && (
                      <tr>
                        <td colSpan="4">Aggiungi il primo ingrediente</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    {ingredientsCalculations?.ingredients.length > 0 && (
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
          {/* FROM 1 INGREDIENT, CALCULATE THE OTHERS */}
          <Col>
            <Row className="flex-column g-3">
              {/* title */}
              <Col>
                <h4>Ho un ingrediente, calcola gli altri</h4>
              </Col>
              {/* known ingredient (name, quantity) */}
              <Col>
                <Row>
                  {/* known ingredient quantity */}
                  <Col xs={4}>
                    <Form.Group>
                      <Form.Control
                        type="number"
                        placeholder="Quantità (g)"
                        value={knownIngredientQuantity}
                        onChange={(event) => {
                          const val = event.target.value
                          setKnownIngredientQuantity(val)
                          const context = { _recipeInstance, knownIngredientName, knownIngredientQuantity: val, setIngredientsCalculationsFromIngredient }
                          calcIngredientsFromOneIngredientHelper(context)()
                        }}
                      />
                    </Form.Group>
                  </Col>
                  {/* known ingredient name */}
                  <Col xs={8}>
                    <Form.Group>
                      <Form.Select
                        value={knownIngredientName}
                        onChange={(event) => {
                          const val = event.target.value
                          setKnownIngredientName(val)
                          const context = { _recipeInstance, knownIngredientName: val, knownIngredientQuantity, setIngredientsCalculationsFromIngredient }
                          calcIngredientsFromOneIngredientHelper(context)()
                        }}
                      >
                        <option value="">Seleziona ingrediente</option>
                        {ingredientsCalculations?.ingredients.map((ingredient) => {
                          return (
                            <option key={ingredient.id} value={ingredient.name}>
                              {ingredient.name}
                            </option>
                          )
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              {/* ingredients list */}
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Ingr.</th>
                      <th>Q.tà</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* exist ingredients */}
                    {ingredientsCalculationsFromIngredient?.ingredients.map((ingredient) => {
                      // console.log(ingredient)
                      return (
                        <tr key={ingredient.id}>
                          <td>{ingredient.name}</td>
                          <td>{ingredient.quantityRounded}</td>
                        </tr>
                      )
                    })}

                    {/* no ingredients */}
                    {(!ingredientsCalculationsFromIngredient || ingredientsCalculationsFromIngredient.ingredients.length == 0) && (
                      <tr>
                        <td colSpan="3">Aggiungi il primo ingrediente</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    {ingredientsCalculationsFromIngredient?.ingredients.length > 0 && (
                      <tr>
                        <td>TOTALE:</td>
                        <td>{ingredientsCalculationsFromIngredient.totIngredientsRounded}</td>
                      </tr>
                    )}
                  </tfoot>
                </Table>
              </Col>
            </Row>
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
  knownIngredientName,
  knownIngredientQuantity,
  setIngredientsCalculationsFromIngredient,
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

    console.log("in addIngredientHelper")
    console.log(newIngredientName, newIngredientQuantity)
    console.log(_recipeInstance.getIngredients())

    // set new ingredients in the react component state
    setIngredientsCalculations(_recipeInstance.getIngredients())

    // update "from one ingredient"
    calcIngredientsFromOneIngredientHelper({ _recipeInstance, knownIngredientName, knownIngredientQuantity, setIngredientsCalculationsFromIngredient })()
  }
}

const removeIngredientHelper = ({
  _recipeInstance,
  setIngredientsCalculations,
  knownIngredientName,
  knownIngredientQuantity,
  setIngredientsCalculationsFromIngredient,
}) => {
  return (ingredientNameToRemove) => {
    // you cannot remove an ingredient that has been selected elsewhere
    // for example: this ingredient the user wants to remove,
    // is the same known ingredient that the user wanted to
    // calculate the others from
    if (isIngredientSelectedElsewhere({ knownIngredientName })(ingredientNameToRemove)) {
      alert("Non puoi rimuovere questo ingrediente perché selezionato altrove.")
      return
    }
    // remove ingredient
    _recipeInstance.removeIngredientByName(ingredientNameToRemove)
    // set new ingredients in the react component state
    setIngredientsCalculations(_recipeInstance.getIngredients())
    // update "from one ingredient"
    calcIngredientsFromOneIngredientHelper({ _recipeInstance, knownIngredientName, knownIngredientQuantity, setIngredientsCalculationsFromIngredient })()
  }
}

const calcIngredientsFromOneIngredientHelper = ({
  _recipeInstance,
  knownIngredientName,
  knownIngredientQuantity,
  setIngredientsCalculationsFromIngredient,
}) => {
  return () => {
    // if there's no ingredient selected
    if (knownIngredientName == "") {
      return
    }

    // console.log(knownIngredientName, knownIngredientQuantity)
    const ingredientsData = _recipeInstance.calcFromIngredient({
      name: knownIngredientName,
      quantity: knownIngredientQuantity,
    })
    setIngredientsCalculationsFromIngredient(ingredientsData)
  }
}

const isIngredientSelectedElsewhere = ({ knownIngredientName }) => {
  return (ingredientNameToRemove) => {
    return ingredientNameToRemove == knownIngredientName
  }
}

/** REACT STATE SETTERS - MIDDLEWARE FUNCTIONS */
// Use cases: sanitize/modify user input and then save it to react comp local state.

const setRecipeNameMiddleware = (setRecipeName) => {
  return (val) => {
    const sanitizedVal = val.trim().toLowerCase()
    setRecipeName(sanitizedVal)
  }
}

const setNewIngredientNameMiddleware = (setNewIngredientName) => {
  return (val) => {
    const sanitizedVal = val.trim().toLowerCase()
    setNewIngredientName(sanitizedVal)
  }
}

// MORE HELPERS

const focusNewIngredientName = () => {
  const element = document.getElementById("new-ingredient-name")
  element.focus()
}

export default RecipeComponent
