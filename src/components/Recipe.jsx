import { useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav, Table } from "react-bootstrap"
import { Helmet } from "react-helmet"

import Recipe from "../assets/js/Recipe"

const RecipeComponent = (props) => {
  // the Recipe instance. must not me touched.
  const [_recipeInstance, _setRecipeInstance] = useState(new Recipe())
  // recipe info
  const [recipeName, setRecipeName] = useState("")
  const [recipePhotoUrl, setRecipePhotoUrl] = useState("")
  // initial/original ingredients
  const [ingredientsCalculations, setIngredientsCalculations] = useState(null)
  // the new ingredient that is being added
  const [newIngredientName, setNewIngredientName] = useState("")
  const [newIngredientQuantity, setNewIngredientQuantity] = useState(1)
  // feature: from one ingredient, calculate others
  const [knownIngredientName, setKnownIngredientName] = useState("")
  const [knownIngredientQuantity, setKnownIngredientQuantity] = useState(1)
  const [ingredientsCalculationsFromIngredient, setIngredientsCalculationsFromIngredient] = useState(null)
  // feature: from recipe total quantity, calculate ingredients
  const [knownRecipeQuantity, setKnownRecipeQuantity] = useState(1)
  const [ingredientsCalculationsFromRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity] = useState(null)

  return (
    // centers content in the page
    <Row className="justify-content-center">
      <Col xs={12} md={6}>
        <Row className="flex-column gap-5">
          {/* PAGE TITLE */}
          <Col>
            <h2 className="text-center">Aggiungi ricetta</h2>
          </Col>
          {/* RECIPE INFO (name, photo etc.) */}
          <Col>
            <Row className="justify-content-center">
              {/* recipe name */}
              <Col xs={12} md={6}>
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
            </Row>
            <Row className="mt-3">
              {/*  */}
              <Col>
                <Row className="flex-column align-items-center g-3">
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Carica foto</Form.Label>
                      <Form.Control type="file" accept="image/*" onChange={handleRecipePhotoChange({ setRecipePhotoUrl })} />
                    </Form.Group>
                  </Col>
                  {recipePhotoUrl && (
                    <Col>
                      <Image src={recipePhotoUrl} alt={recipeName} fluid style={{ height: "200px" }} />
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
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
                              knownIngredientName,
                              knownIngredientQuantity,
                              setIngredientsCalculationsFromIngredient,
                              knownRecipeQuantity,
                              setIngredientsCalculationsFromRecipeQuantity,
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
                              knownIngredientName,
                              knownIngredientQuantity,
                              setIngredientsCalculationsFromIngredient,
                              knownRecipeQuantity,
                              setIngredientsCalculationsFromRecipeQuantity,
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
                          knownIngredientName,
                          knownIngredientQuantity,
                          setIngredientsCalculationsFromIngredient,
                          knownRecipeQuantity,
                          setIngredientsCalculationsFromRecipeQuantity,
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
                      <th className="text-end">Azioni</th>
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
                                  knownRecipeQuantity,
                                  setIngredientsCalculationsFromRecipeQuantity,
                                  setKnownIngredientName,
                                  setKnownIngredientQuantity,
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
                      <tr className="fw-bold">
                        <td className="text-end">TOTALE:</td>
                        <td>{ingredientsCalculations.totIngredientsRounded}</td>
                      </tr>
                    )}
                  </tfoot>
                </Table>
              </Col>
            </Row>
          </Col>
          {/* RECIPE ACTIONS (save recipe, etc.) */}
          <Col>
            <Button
              variant="success"
              onClick={() => {
                const context = {
                  _recipeInstance,
                  recipeName,
                  ingredientsCalculations,
                  knownIngredientName,
                  knownIngredientQuantity,
                  setIngredientsCalculationsFromIngredient,
                }
                addRecipeHelper(context)()
              }}
            >
              Aggiungi ricetta
            </Button>
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
              {knownIngredientName != "" && (
                <Col>
                  <Row className="justify-content-center">
                    <Col xs={12}>
                      <Table striped bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
                        <colgroup>
                          <col style={{ width: "70%" }} />
                          <col style={{ width: "30%" }} />
                        </colgroup>

                        <thead>
                          <tr>
                            <th>Ingr.</th>
                            <th className="text-end">Q.tà</th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* exist ingredients */}
                          {ingredientsCalculationsFromIngredient?.ingredients.map((ingredient) => {
                            const isIngredientInListSameAsKnownIngredient = ingredient.name == knownIngredientName
                            return (
                              <tr key={ingredient.id} className={isIngredientInListSameAsKnownIngredient ? "table-primary" : ""}>
                                <td>{ingredient.name}</td>
                                <td className="text-end">{ingredient.quantityRounded}</td>
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
                            <tr className="text-end fw-bold">
                              <td>TOTALE:</td>
                              <td>{ingredientsCalculationsFromIngredient.totIngredientsRounded}</td>
                            </tr>
                          )}
                        </tfoot>
                      </Table>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
          {/* FROM TOTAL RECIPE, CALCULATE INGREDIENTS */}
          <Col>
            <Row className="flex-column g-3">
              {/* title */}
              <Col>
                <h4>Ho il totale impasto, calcola gli ingredienti</h4>
              </Col>
              {/* known recipe (quantity) */}
              <Col>
                <Row className="">
                  {/* known recipe quantity */}
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Control
                        type="number"
                        placeholder="Quantità (g)"
                        value={knownRecipeQuantity}
                        onChange={(event) => {
                          const val = event.target.value
                          setKnownRecipeQuantity(val)
                          const context = { _recipeInstance, knownRecipeQuantity: val, setIngredientsCalculationsFromRecipeQuantity }
                          calcIngredientsFromRecipeQuantityHelper(context)()
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              {/* ingredients list */}
              <Col>
                <Row className="justify-content-center">
                  <Col xs={12}>
                    <Table striped bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
                      <colgroup>
                        <col style={{ width: "70%" }} />
                        <col style={{ width: "30%" }} />
                      </colgroup>

                      <thead>
                        <tr>
                          <th>Ingr.</th>
                          <th className="text-end">Q.tà</th>
                        </tr>
                      </thead>

                      <tbody>
                        {/* exist ingredients */}
                        {ingredientsCalculationsFromRecipeQuantity?.ingredients.map((ingredient) => {
                          // console.log(ingredient)
                          return (
                            <tr key={ingredient.id}>
                              <td>{ingredient.name}</td>
                              <td className="text-end">{ingredient.quantityRounded}</td>
                            </tr>
                          )
                        })}

                        {/* no ingredients */}
                        {(!ingredientsCalculationsFromRecipeQuantity || ingredientsCalculationsFromRecipeQuantity.ingredients.length == 0) && (
                          <tr>
                            <td colSpan="3">Aggiungi il primo ingrediente</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        {ingredientsCalculationsFromRecipeQuantity?.ingredients.length > 0 && (
                          <tr className="table-primary fw-bold">
                            <td className="text-end">TOTALE:</td>
                            <td className="text-end">{ingredientsCalculationsFromRecipeQuantity.totIngredientsRounded}</td>
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
      </Col>
    </Row>
  )
}

const addRecipeHelper = ({
  _recipeInstance,
  recipeName,
  ingredientsCalculations,
  knownIngredientName,
  knownIngredientQuantity,
  setIngredientsCalculationsFromIngredient,
}) => {
  return () => {
    // validation
    const isRecipeNameEmpty = recipeName.trim() == ""
    // const existsRecipeNameInDB

    const hasNoIngredients = !ingredientsCalculations || ingredientsCalculations.ingredients.length == 0

    if (isRecipeNameEmpty) {
      alert("Inserisci il nome della ricetta")
      return
    }

    if (hasNoIngredients) {
      alert("Inserisci almeno un ingrediente.")
      return
    }

    const sanitizedRecipeName = sanitizeRecipeName(recipeName)

    console.log(sanitizedRecipeName, ingredientsCalculations)
  }
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
  knownRecipeQuantity,
  setIngredientsCalculationsFromRecipeQuantity,
}) => {
  return () => {
    // validation
    const isIngredientNameEmpty = newIngredientName.trim() == ""
    if (isIngredientNameEmpty) {
      alert("Nome ingrediente non può essere vuoto.")
      return 
    }

    // empty the new ingredient inputs
    setNewIngredientName("")
    setNewIngredientQuantity(1)
    // input focus on ingredient name
    focusNewIngredientName()

    // add ingredient
    try {
      _recipeInstance.addIngredient({
        name: sanitizeIngredientName(newIngredientName),
        quantity: newIngredientQuantity,
      })
    } catch (err) {
      console.error(err)
      alert("Non puoi avere ingredienti con lo stesso nome.")
      return
    }

    // set new ingredients in the react component state
    setIngredientsCalculations(_recipeInstance.getIngredients())

    // update "from one ingredient"
    calcIngredientsFromOneIngredientHelper({ _recipeInstance, knownIngredientName, knownIngredientQuantity, setIngredientsCalculationsFromIngredient })()
    // update "from recipe quantity"
    calcIngredientsFromRecipeQuantityHelper({ _recipeInstance, knownRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity })()
  }
}

const removeIngredientHelper = ({
  _recipeInstance,
  setIngredientsCalculations,
  setKnownIngredientName,
  knownIngredientName,
  knownIngredientQuantity,
  setIngredientsCalculationsFromIngredient,
  knownRecipeQuantity,
  setKnownIngredientQuantity,
  setIngredientsCalculationsFromRecipeQuantity,
}) => {
  return (ingredientNameToRemove) => {
    const isIngredientSelected = isIngredientSelectedKnownIngredientName({ knownIngredientName })(ingredientNameToRemove)
    // you cannot remove an ingredient that has been selected elsewhere
    // for example: this ingredient the user wants to remove,
    // is the same known ingredient that the user wanted to
    // calculate the others from
    if (isIngredientSelected) {
      // if the ingredient is selected elsewhere, deselect it
      setKnownIngredientName("")
      setKnownIngredientQuantity(1)
      removeIngredientAction({
        _recipeInstance,
        setIngredientsCalculations,
        setKnownIngredientName,
        knownIngredientName: "",
        knownIngredientQuantity,
        setIngredientsCalculationsFromIngredient,
        knownRecipeQuantity,
        setIngredientsCalculationsFromRecipeQuantity,
      })(ingredientNameToRemove)
      return
    }
    // if the ingredient was not selected elsewhere, remove it immediately
    removeIngredientAction({
      _recipeInstance,
      setIngredientsCalculations,
      setKnownIngredientName,
      knownIngredientName,
      knownIngredientQuantity,
      setIngredientsCalculationsFromIngredient,
      knownRecipeQuantity,
      setIngredientsCalculationsFromRecipeQuantity,
    })(ingredientNameToRemove)
  }
}

const removeIngredientAction = ({
  _recipeInstance,
  setIngredientsCalculations,
  knownIngredientName,
  knownIngredientQuantity,
  setIngredientsCalculationsFromIngredient,
  knownRecipeQuantity,
  setIngredientsCalculationsFromRecipeQuantity,
}) => {
  return (ingredientNameToRemove) => {
    // console.log(ingredientNameToRemove, _recipeInstance.ingredients)
    // remove ingredient from recipe library instance
    _recipeInstance.removeIngredientByName(ingredientNameToRemove)
    // set new ingredients in the react component state
    setIngredientsCalculations(_recipeInstance.getIngredients())
    // update "from one ingredient"
    calcIngredientsFromOneIngredientHelper({ _recipeInstance, knownIngredientName, knownIngredientQuantity, setIngredientsCalculationsFromIngredient })()
    // update "from recipe quantity"
    calcIngredientsFromRecipeQuantityHelper({ _recipeInstance, knownRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity })()
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

const calcIngredientsFromRecipeQuantityHelper = ({ _recipeInstance, knownRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity }) => {
  return () => {
    const ingredientsData = _recipeInstance.calcFromTot(knownRecipeQuantity)
    setIngredientsCalculationsFromRecipeQuantity(ingredientsData)
  }
}

const handleRecipePhotoChange = ({ setRecipePhotoUrl }) => {
  return (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setRecipePhotoUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }
}

const isIngredientSelectedKnownIngredientName = ({ knownIngredientName }) => {
  return (ingredientNameToRemove) => {
    return ingredientNameToRemove == knownIngredientName
  }
}

// MORE HELPERS

const sanitizeIngredientName = (val) => {
  return val.trim().toLowerCase()
}

const sanitizeRecipeName = (val) => {
  return val.trim().toLowerCase()
}

const focusNewIngredientName = () => {
  const element = document.getElementById("new-ingredient-name")
  element.focus()
}

export default RecipeComponent
