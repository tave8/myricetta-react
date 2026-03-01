import { useEffect, useState } from "react"
import { Row, Col, Placeholder, Spinner, Alert, Button, Image, Form, Table } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import RecipeRemote from "../assets/js/Recipe/RecipeRemote"
import RecipeCalculations from "./recipe-calculations/RecipeCalculations"

const SeeMyRecipe = () => {
  const navigate = useNavigate()
  const [_recipeInstance, _setRecipeInstance] = useState(new RecipeRemote())

  // recipe info
  const [recipeName, setRecipeName] = useState("")
  // const [recipePhotoUrl, setRecipePhotoUrl] = useState(null)
  const [ingredientsData, setIngredientsData] = useState(null)

  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true)
  const [isErrorRecipe, setIsErrorRecipe] = useState(false)

  // const [isLoadingPhoto, setIsLoadingPhoto] = useState(true)

  const urlParams = useParams()

  /**
   * On component mount, load the recipe
   */
  useEffect(() => {
    const recipeId = urlParams.recipeId
    if (!recipeId) {
      throw new Error(`Recipe id was not provided in route.`)
    }

    _recipeInstance
      .getRecipeByIdAndOverrideSelf(recipeId)
      .then(() => {
        setIsLoadingRecipe(false)
        setIsErrorRecipe(false)
        // console.log(_recipeInstance.getIngredients())
        setRecipeName(_recipeInstance.getName())
        setIngredientsData(_recipeInstance.getIngredients())
      })
      .catch((err) => {
        console.error(err)
        setIsLoadingRecipe(false)
        setIsErrorRecipe(true)
      })
  }, [])

  return (
    // centers content in the page
    <Row className="justify-content-center">
      <Col xs={12} md={6}>
        <Row className="flex-column gap-5">
          {/* PAGE TITLE */}
          <Col>
            {/* recipe name placeholder */}
            {isLoadingRecipe && (
              <Placeholder as="div" animation="wave" style={{ height: "50px", width: "100%" }}>
                <Placeholder xs={12} style={{ height: "100%" }} />
              </Placeholder>
            )}
            {!isLoadingRecipe && (
              <>
                <h2 className="text-center">{recipeName}</h2>
              </>
            )}
          </Col>
          {/* ACTIONS */}
          <Col>
            <Row className="justify-content-center">
              <Col className="text-center">
                {!isLoadingRecipe && (
                  <>
                    <Button
                      onClick={() => {
                        navigate(`/edit-recipe/${"xx"}`)
                      }}
                    >
                      Modifica
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </Col>
          {/* RECIPE PHOTO */}
          <Col className="text-center">
            {/* image placeholder */}
            {/* {isLoadingPhoto && (
              <Placeholder as="div" animation="wave" style={{ height: "200px", width: "100%" }}>
                <Placeholder xs={12} style={{ height: "200px" }} />
              </Placeholder>
            )} */}
            {/* <Image
              src={recipePhotoUrl}
              alt={recipeName}
              fluid
              style={{ height: "200px" }}
              onLoad={() => {
                setIsLoadingPhoto(false)
              }}
              onError={() => {
                setIsLoadingPhoto(false)
              }}
            /> */}
          </Col>
          {/* INGREDIENTS */}
          {ingredientsData && (
            <Col>
              <Row className="flex-column g-3">
                {/* title */}
                <Col>
                  <h4>Ingredienti</h4>
                </Col>

                {/* ingredients list */}
                {!isLoadingRecipe && !isErrorRecipe && (
                  <Col>
                    <Row className="justify-content-center">
                      <Col xs={12}>
                        {ingredientsData.ingredients.length > 0 && (
                          <Table striped bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
                            <colgroup>
                              <col style={{ width: "50%" }} />
                              <col style={{ width: "25%" }} />
                              <col style={{ width: "25%" }} />
                            </colgroup>

                            <thead>
                              <tr>
                                <th>Ingr.</th>
                                <th className="text-end">Q.tà</th>
                                <th className="text-end">%</th>
                              </tr>
                            </thead>

                            <tbody>
                              {/* exist ingredients */}
                              {ingredientsData.ingredients.map((ingredient) => {
                                return (
                                  <tr key={ingredient.id}>
                                    <td>{ingredient.name}</td>
                                    <td className="text-end">{ingredient.quantityRounded} g</td>
                                    <td className="text-end">{ingredient.percentageRounded} %</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                            <tfoot>
                              {ingredientsData.ingredients.length > 0 && (
                                <tr className="text-end fw-bold">
                                  <td>TOTALE:</td>
                                  <td>{ingredientsData.totIngredientsRounded} g</td>
                                  <td></td>
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
          )}

          {/* RECIPE CALCULATIONS (from one ingredient to others, 
              from recipe quantity to ingredients) */}
          {ingredientsData && <RecipeCalculations _recipeInstance={_recipeInstance} />}

          {/* ACTIONS */}
          <Col style={{ marginTop: "10rem" }}>
            <Row className="justify-content-center">
              <Col className="text-center">
                {!isLoadingRecipe && (
                  <>
                    <Button
                      variant="danger"
                      onClick={() => {
                        //
                      }}
                    >
                      Elimina
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default SeeMyRecipe
