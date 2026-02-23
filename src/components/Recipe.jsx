import { useEffect, useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav, Table } from "react-bootstrap"
import { Helmet } from "react-helmet"

import RecipeRemote from "../assets/js/Recipe/RecipeRemote"
const RECIPE_API_URL = "https://"

import {
  IngredientNameAlreadyExistsError,
  IngredientNameIsNotValidError,
  QuantityIsNotValidError,
  RecipeHasNoIngredientsError,
  RecipeNameIsNotValidError,
} from "../assets/js/Recipe/errors"

const RecipeComponent = (props) => {
  // the Recipe instance. must not me touched.
  const [_recipeInstance, _setRecipeInstance] = useState(new RecipeRemote({ apiUrl: RECIPE_API_URL }))
  // recipe info
  const [recipeName, setRecipeName] = useState("")
  const [recipePhotoUrl, setRecipePhotoUrl] = useState("")
  // initial/original ingredients
  const [ingredientsCalculations, setIngredientsCalculations] = useState(null)
  // the new ingredient that is being added
  const [newIngredientName, setNewIngredientName] = useState("")
  const [newIngredientQuantity, setNewIngredientQuantity] = useState("")
  // feature: from one ingredient, calculate others
  const [knownIngredientName, setKnownIngredientName] = useState("")
  const [knownIngredientQuantity, setKnownIngredientQuantity] = useState("")
  const [ingredientsCalculationsFromIngredient, setIngredientsCalculationsFromIngredient] = useState(null)
  // feature: from recipe total quantity, calculate ingredients
  const [knownRecipeQuantity, setKnownRecipeQuantity] = useState("")
  const [ingredientsCalculationsFromRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity] = useState(null)

  useEffect(() => {
    focusNewIngredientName()
  }, [])

  return (
    // centers content in the page
    <Row className="justify-content-center">
      <Col xs={12} md={6}>
        <Row className="flex-column gap-5">
          {/* PAGE TITLE */}
          <Col>
            <h2 className="text-center">{recipeName.trim() == "" ? "Aggiungi ricetta" : "Ricetta per " + recipeName}</h2>
          </Col>
          {/* RECIPE INFO (name, photo etc.) */}
          <Col>
            <Row className="justify-content-center">
              {/* recipe name */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    id="recipe-name"
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
                              setKnownRecipeQuantity,
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
                              setKnownRecipeQuantity,
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
                          setKnownRecipeQuantity,
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
                {ingredientsCalculations?.ingredients.length > 0 && (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Ingr.</th>
                        <th className="text-end">Q.tà</th>
                        <th className="text-end">%</th>
                        <th className="text-end">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* exist ingredients */}
                      {ingredientsCalculations?.ingredients.map((ingredient) => {
                        return (
                          <tr key={ingredient.id}>
                            <td>{ingredient.name}</td>
                            <td className="text-end">{ingredient.quantityRounded} g</td>
                            <td className="text-end">{ingredient.percentageRounded} %</td>
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
                                    setKnownRecipeQuantity,
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
                    </tbody>
                    <tfoot>
                      {ingredientsCalculations?.ingredients.length > 0 && (
                        <tr className="fw-bold">
                          <td className="text-end">TOTALE:</td>
                          <td className="text-end">{ingredientsCalculations.totIngredientsRounded} g</td>
                        </tr>
                      )}
                    </tfoot>
                  </Table>
                )}
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
                <Row className="g-3">
                  {/* known ingredient name */}
                  <Col xs={8}>
                    <Form.Group>
                      <Form.Select
                        value={knownIngredientName}
                        id="known-ingredient-name-input"
                        onChange={(event) => {
                          const val = event.target.value
                          const isOptionEmpty = val.trim() == ""
                          setKnownIngredientName(val)
                          if (isOptionEmpty) {
                            setKnownIngredientQuantity("")
                          }
                          const context = {
                            _recipeInstance,
                            knownIngredientName: val,
                            knownIngredientQuantity,
                            setIngredientsCalculationsFromIngredient,
                          }
                          calcIngredientsFromOneIngredientHelper(context)()
                          // focusKnownIngredientQuantity()
                          setTimeout(() => {
                            scrollIntoViewOfKnownIngredientNameInput()
                          }, 100)
                        }}
                      >
                        <option value="">Seleziona ingrediente...</option>
                        {ingredientsCalculations?.ingredients.map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.name}>
                            {ingredient.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {/* known ingredient quantity */}
                  <Col xs={4}>
                    <Form.Group>
                      <Form.Control
                        type="number"
                        id="known-ingredient-quantity"
                        placeholder="Quantità (g)"
                        value={knownIngredientQuantity}
                        onChange={(event) => {
                          const val = event.target.value
                          setKnownIngredientQuantity(val)
                          const context = {
                            _recipeInstance,
                            knownIngredientName,
                            knownIngredientQuantity: val,
                            setIngredientsCalculationsFromIngredient,
                          }
                          calcIngredientsFromOneIngredientHelper(context)()
                          setTimeout(() => {
                            scrollIntoViewOfKnownIngredientNameInput()
                          }, 100)
                        }}
                      />
                    </Form.Group>
                  </Col>
                  {/* Frase */}
                  {knownIngredientQuantity && knownIngredientName && (
                    <Col xs={12}>
                      <div className="fw-bold">
                        Per <span className="">{knownIngredientQuantity}</span> g di <span className="">{knownIngredientName}</span> mi servono:
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>
              {/* ingredients list */}
              {knownIngredientQuantity && knownIngredientName && (
                <Col>
                  <Row className="justify-content-center">
                    <Col xs={12}>
                      {ingredientsCalculationsFromIngredient?.ingredients.length > 0 && (
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
                                  <td className="text-end">{ingredient.quantityRounded} g</td>
                                </tr>
                              )
                            })}
                          </tbody>
                          <tfoot>
                            {ingredientsCalculationsFromIngredient?.ingredients.length > 0 && (
                              <tr className="text-end fw-bold">
                                <td>TOTALE:</td>
                                <td>{ingredientsCalculationsFromIngredient.totIngredientsRounded} g</td>
                              </tr>
                            )}
                          </tfoot>
                        </Table>
                      )}
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
                <Row className="g-3">
                  {/* known recipe quantity */}
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Control
                        type="number"
                        id="known-recipe-quantity-input"
                        placeholder="Quantità (g)"
                        value={knownRecipeQuantity}
                        onChange={(event) => {
                          const val = event.target.value
                          setKnownRecipeQuantity(val)
                          const context = { _recipeInstance, knownRecipeQuantity: val, setKnownRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity }
                          calcIngredientsFromRecipeQuantityHelper(context)()
                          setTimeout(() => {
                            scrollIntoViewOfKnownRecipeQuantityInput()
                          }, 100)
                        }}
                      />
                    </Form.Group>
                  </Col>
                  {/* frase */}
                  <Col xs={12}>
                    {knownRecipeQuantity && ingredientsCalculationsFromRecipeQuantity?.ingredients.length > 0 && (
                      <div className="fw-bold">Per {knownRecipeQuantity} g di impasto mi servono:</div>
                    )}
                  </Col>
                </Row>
              </Col>
              {/* ingredients list */}
              <Col>
                <Row className="justify-content-center">
                  <Col xs={12}>
                    {ingredientsCalculationsFromRecipeQuantity?.ingredients.length > 0 && (
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
                                <td className="text-end">{ingredient.quantityRounded} g</td>
                              </tr>
                            )
                          })}
                        </tbody>
                        <tfoot>
                          {ingredientsCalculationsFromRecipeQuantity?.ingredients.length > 0 && (
                            <tr className="table-primary fw-bold">
                              <td className="text-end">TOTALE:</td>
                              <td className="text-end">{ingredientsCalculationsFromRecipeQuantity.totIngredientsRounded} g</td>
                            </tr>
                          )}
                        </tfoot>
                      </Table>
                    )}
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
  return async () => {
    try {
      _recipeInstance.setName(recipeName)
      // const recipeToSave = _recipeInstance.getRecipeToSave()

      // await _recipeInstance.addRemote()
      console.log(_recipeInstance)

      // console.log(recipeToSave)
      // console.log(_recipeInstance.getIngredients())
    } catch (err) {
      if (err instanceof RecipeNameIsNotValidError) {
        focusRecipeName()
        alert("Inserisci il nome della ricetta")
      } else if (err instanceof RecipeHasNoIngredientsError) {
        focusNewIngredientName()
        alert("Inserisci almeno un ingrediente.")
      }
    }
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
  setKnownRecipeQuantity,
}) => {
  return () => {
    try {
      _recipeInstance.addIngredient({
        name: newIngredientName,
        quantity: newIngredientQuantity,
      })
      // empty the new ingredient inputs
      setNewIngredientName("")
      setNewIngredientQuantity("")
      // input focus on ingredient name
      focusNewIngredientName()
    } catch (err) {
      if (err instanceof IngredientNameIsNotValidError) {
        alert("Nome ingrediente non può essere vuoto.")
      } else if (err instanceof QuantityIsNotValidError) {
        alert("La quantità deve essere un numero positivo.")
      } else if (err instanceof IngredientNameAlreadyExistsError) {
        alert("Non puoi avere ingredienti con lo stesso nome.")
      } else {
        console.error(err)
      }
      return
    }

    // set new ingredients in the react component state
    setIngredientsCalculations(_recipeInstance.getIngredients())

    // update "from one ingredient"
    calcIngredientsFromOneIngredientHelper({ _recipeInstance, knownIngredientName, knownIngredientQuantity, setIngredientsCalculationsFromIngredient })()
    // update "from recipe quantity"
    calcIngredientsFromRecipeQuantityHelper({ _recipeInstance, knownRecipeQuantity, setKnownRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity })()
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
  setKnownRecipeQuantity,
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
      setKnownIngredientQuantity("")
      removeIngredientAction({
        _recipeInstance,
        setIngredientsCalculations,
        setKnownIngredientName,
        knownIngredientName: "",
        knownIngredientQuantity,
        setIngredientsCalculationsFromIngredient,
        knownRecipeQuantity,
        setIngredientsCalculationsFromRecipeQuantity,
        setKnownRecipeQuantity,
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
      setKnownRecipeQuantity,
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
  setKnownRecipeQuantity,
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
    calcIngredientsFromRecipeQuantityHelper({ _recipeInstance, knownRecipeQuantity, setKnownRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity })()
  }
}

const calcIngredientsFromOneIngredientHelper = ({
  _recipeInstance,
  knownIngredientName,
  knownIngredientQuantity,
  setIngredientsCalculationsFromIngredient,
}) => {
  return () => {
    try {
      // if there's no ingredient selected
      if (knownIngredientName == "") {
        return
      }
      const ingredientsData = _recipeInstance.calcFromIngredient({
        name: knownIngredientName,
        quantity: knownIngredientQuantity,
      })
      setIngredientsCalculationsFromIngredient(ingredientsData)
    } catch (err) {
      // why ignore this error? because the user might
      // me in the process of typing, or a new refresh of the calculations
      // is requested, so we don't have enough information
      // to lock ourselves onto a decision, so for now ignore the error
      if (err instanceof QuantityIsNotValidError) {
        setIngredientsCalculationsFromIngredient({
          ingredients: [],
          totIngredientsRounded: 0,
        })
        console.info(`ignored invalid quantity in "calcIngredientsFromOneIngredientHelper"`)
      }
    }
  }
}

const calcIngredientsFromRecipeQuantityHelper = ({
  _recipeInstance,
  knownRecipeQuantity,
  setKnownRecipeQuantity,
  setIngredientsCalculationsFromRecipeQuantity,
}) => {
  return () => {
    try {
      const ingredientsData = _recipeInstance.calcFromTot(knownRecipeQuantity)
      setIngredientsCalculationsFromRecipeQuantity(ingredientsData)
    } catch (err) {
      // why ignore this error? because the user might
      // me in the process of typing, or a new refresh of the calculations
      // is requested, so we don't have enough information
      // to lock ourselves onto a decision, so for now ignore the error
      if (err instanceof QuantityIsNotValidError) {
        setIngredientsCalculationsFromRecipeQuantity({
          ingredients: [],
          totIngredientsRounded: 0,
        })
        console.info(`ignored invalid quantity in "calcIngredientsFromRecipeQuantityHelper"`)
      }
    }
  }
}

const isIngredientSelectedKnownIngredientName = ({ knownIngredientName }) => {
  return (ingredientNameToRemove) => {
    return ingredientNameToRemove == knownIngredientName
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

// MORE HELPERS

const focusNewIngredientName = () => {
  const element = document.getElementById("new-ingredient-name")
  element.focus()
}

const focusKnownIngredientQuantity = () => {
  const element = document.getElementById("known-ingredient-quantity")
  element.focus()
}

const focusRecipeName = () => {
  const element = document.getElementById("recipe-name")
  element.focus()
}

const scrollIntoViewOfKnownRecipeQuantityInput = () => {
  // document.getElementById("known-recipe-quantity-input").scrollIntoView()
}

const scrollIntoViewOfKnownIngredientNameInput = () => {
  // document.getElementById("known-ingredient-name-input").scrollIntoView()
}

export default RecipeComponent
