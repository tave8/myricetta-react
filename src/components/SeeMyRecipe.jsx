import { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  Placeholder,
  Spinner,
  Alert,
  Button,
  Image,
  Form,
  ListGroup,
  Navbar,
  NavDropdown,
  Nav,
  Table,
} from "react-bootstrap"
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

  const [isLoadingPhoto, setIsLoadingPhoto] = useState(true)

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
        setIsLoadingRecipe(false)
        setIsErrorRecipe(false)
        setRecipe(remoteRecipe)
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
            {isLoadingPhoto && (
              <Placeholder as="div" animation="wave" style={{ height: "50px", width: "100%" }}>
                <Placeholder xs={12} style={{ height: "100%" }} />
              </Placeholder>
            )}
            {!isLoadingRecipe && <h2 className="text-center">{recipe.name}</h2>}
          </Col>
          {/* RECIPE PHOTO */}
          <Col className="text-center">
            {/* image placeholder */}
            {isLoadingPhoto && (
              <Placeholder as="div" animation="wave" style={{ height: "200px", width: "100%" }}>
                <Placeholder xs={12} style={{ height: "200px" }} />
              </Placeholder>
            )}
            <Image
              src={recipe.photoUrl}
              alt={recipe.name}
              fluid
              style={{ height: "200px" }}
              onLoad={() => {
                setIsLoadingPhoto(false)
              }}
              onError={() => {
                setIsLoadingPhoto(false)
              }}
            />
          </Col>
          
        </Row>
      </Col>
    </Row>
  )
}

export default SeeMyRecipe
