import { useEffect, useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav, InputGroup } from "react-bootstrap"
import { Search as SearchIcon } from "react-bootstrap-icons"
import RecipeRemote from "../assets/js/Recipe/RecipeRemote"

const MyRecipes = () => {
  const [_recipeInstance, _setRecipeInstance] = useState(new RecipeRemote())

  const [formValues, setFormValues] = useState({
    search: "",
  })
  const [myRecipes, setMyRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  /**
   * On component, fetch remote recipes
   */
  useEffect(() => {}, [])

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={9}>
        <Row className="flex-column gap-5">
          {/* PAGE TITLE */}
          <Col>
            <h2 className="text-center">Le mie ricette</h2>
          </Col>
          {/* RECIPE SEARCH FILTERS */}
          <Col>
            <Row className="flex-column justify-content-center align-items-center gap-3">
              <Col xs={12} md={6} className="text-center position-relative">
                <Form
                  onSubmit={(event) => {
                    event.preventDefault()
                    handleSearchChange({ _recipeInstance, setFormValues, setMyRecipes, setIsLoading, setIsError })(formValues.search)
                  }}
                >
                  <Form.Group>
                    <InputGroup>
                      <Form.Control
                        type="search"
                        autoFocus
                        placeholder="Cerca..."
                        value={formValues.search}
                        onChange={(event) => {
                          const userSearch = event.target.value
                          setFormValues({ search: userSearch })
                        }}
                      />
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          handleSearchChange({ _recipeInstance, setFormValues, setMyRecipes, setIsLoading, setIsError })(formValues.search)
                        }}
                      >
                        <SearchIcon />
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Form>
              </Col>

              {/* search: user feedback (is loading, is error etc.) */}
              {(isLoading || isError) && (
                <Col xs={12} md={6}>
                  {/* is loading */}
                  {isLoading && (
                    <div className="text-center mt-2 position-absolute">
                      <Spinner animation="grow" variant="info" />
                    </div>
                  )}

                  {/* error */}
                  {isError && (
                    <Alert variant="danger" className="mt-2 position-absolute">
                      <Alert.Heading>Problema durante la ricerca delle ricette.</Alert.Heading>
                    </Alert>
                  )}
                </Col>
              )}

              {/* search results */}
              <Col xs={12} md={6}>
                {/* my recipes list */}
                {myRecipes.length > 0 && !isLoading && !isError && (
                  <ListGroup className="mt-2">
                    {myRecipes.map((myRecipe, idx) => (
                      <ListGroup.Item
                        className="p-3 fs-4"
                        key={idx}
                        action
                        onClick={() => {
                          console.log(myRecipe)
                        }}
                      >
                        <span className="text-left">{myRecipe.name}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Row className="flex-column align-items-center g-3">
                  <Col xs={12} md={6}></Col>
                </Row>
              </Col>
            </Row>
          </Col>
          {/* RECIPE SEARCH RESULTS */}
        </Row>
      </Col>
    </Row>
  )
}

const handleSearchChange = (componentInfo) => {
  const { _recipeInstance, setFormValues, setMyRecipes, setIsLoading, setIsError } = componentInfo
  return async (userSearch) => {
    if (userSearch.length == 0) {
      // empty
      setIsLoading(false)
      setIsError(false)
      setMyRecipes([])
      return
    }

    try {
      setIsLoading(true)
      setIsError(false)
      const myRecipes = await _recipeInstance.searchMyRecipes({ searchQuery: userSearch })
      setIsLoading(false)
      setIsError(false)
      setMyRecipes(myRecipes)
    } catch (err) {
      setIsLoading(false)
      setIsError(true)
      console.error(err)
    }
  }
}

export default MyRecipes
