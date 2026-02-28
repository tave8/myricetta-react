import { useEffect, useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav, Table } from "react-bootstrap"
import { useParams } from "react-router-dom"
import RecipeRemote from "../assets/js/Recipe/RecipeRemote"

const SeeMyRecipe = () => {
  const [_recipeInstance, _setRecipeInstance] = useState(new RecipeRemote())

  // recipe info
  const [recipe, setRecipe] = useState({
    name: "",
    photoUrl: null,
  })

  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false)
  const [isErrorRecipe, setIsErrorRecipe] = useState(false)

  const urlParams = useParams()

  /**
   * On component mount, load the recipe
   */
  useEffect(() => {
    const recipeId = urlParams.recipeId
    if (!recipeId) {
      throw new Error(`Recipe id was not provided in route.`)
    }
    console.log(_recipeInstance)
    _recipeInstance
      .getRecipeById("pizza")
      .then((remoteRecipe) => {
        // console.log(recipe)
        setRecipe(remoteRecipe)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return (
    // centers content in the page
    <Row className="justify-content-center">
      <Col xs={12} md={6}>
        <Row className="flex-column gap-5">
          {/* PAGE TITLE */}
          <Col>
            <h2 className="text-center">{recipe.name}</h2>
          </Col>
          <Col className="text-center">
            <Image src={recipe.photoUrl} alt={recipe.name} fluid style={{ height: "200px" }} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default SeeMyRecipe
