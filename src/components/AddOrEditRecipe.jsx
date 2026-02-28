import { useEffect, useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav, Table } from "react-bootstrap"
import { Helmet } from "react-helmet"

import RecipeRemote from "../assets/js/Recipe/RecipeRemote"

import {
  IngredientNameAlreadyExistsError,
  IngredientNameIsNotValidError,
  QuantityIsNotValidError,
  RecipeHasNoIngredientsError,
  RecipeNameIsNotValidError,
} from "../assets/js/Recipe/errors"
import { useParams } from "react-router-dom"
import RecipeCalculations from "./SeeMyRecipe"

const RecipeComponent = (props) => {
  // the Recipe instance. must not me touched.
  const [_recipeInstance, _setRecipeInstance] = useState(new RecipeRemote())
  // recipe info
  const [recipeName, setRecipeName] = useState("")
  const [recipePhotoUrl, setRecipePhotoUrl] = useState("")
  // initial/original ingredients
  const [ingredientsCalculations, setIngredientsCalculations] = useState(null)
  // the new ingredient that is being added
  const [newIngredientName, setNewIngredientName] = useState("")
  const [newIngredientQuantity, setNewIngredientQuantity] = useState("")

  const urlParams = useParams()

  useEffect(() => {
    focusNewIngredientName()
    // if this component is edit mode
    if (props.isEditMode) {
      const recipeId = urlParams.recipeId
      _recipeInstance
        .getByIdRemote(recipeId)
        .then((remoteRecipe) => {
          console.log(remoteRecipe)
        })
        .catch((err) => {
          console.error(err)
        })
    }
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
                }
                addRecipeHelper(context)()
              }}
            >
              Aggiungi ricetta
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

const addRecipeHelper = ({ _recipeInstance, recipeName }) => {
  return async () => {
    try {
      _recipeInstance.setName(recipeName)
      const recipeToSave = _recipeInstance.getRecipeToSave()

      try {
        const result = await _recipeInstance.add()
        console.log(result)
      } catch (err) {
        console.error(err)
        alert(`Error while adding recipe.`)
      }
    } catch (err) {
      if (err instanceof RecipeNameIsNotValidError) {
        focusRecipeName()
        alert("Inserisci il nome della ricetta")
      } else if (err instanceof RecipeHasNoIngredientsError) {
        focusNewIngredientName()
        alert("Inserisci almeno un ingrediente.")
      } else {
        throw new Error(`Uncaught error.`, err)
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
      // console.log(err)
      if (err instanceof IngredientNameIsNotValidError) {
        alert("Nome ingrediente non può essere vuoto.")
      } else if (err instanceof QuantityIsNotValidError) {
        // console.log(newIngredientQuantity)
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

const removeIngredientAction = ({ _recipeInstance, setIngredientsCalculations }) => {
  return (ingredientNameToRemove) => {
    // console.log(ingredientNameToRemove, _recipeInstance.ingredients)
    // remove ingredient from recipe library instance
    _recipeInstance.removeIngredientByName(ingredientNameToRemove)
    // set new ingredients in the react component state
    setIngredientsCalculations(_recipeInstance.getIngredients())
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

const focusRecipeName = () => {
  const element = document.getElementById("recipe-name")
  element.focus()
}

const focusNewIngredientName = () => {
  const element = document.getElementById("new-ingredient-name")
  element.focus()
}

export default RecipeComponent
