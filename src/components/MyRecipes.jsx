import { useEffect, useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav } from "react-bootstrap"
import RecipeRemote from "../assets/js/Recipe/RecipeRemote"



const GLOBAL = {
  lastTimeout: null,
}

const MyRecipes = () => {
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
                  }}
                >
                  <Form.Group>
                    <Form.Control
                      type="search"
                      autoFocus
                      placeholder="Cerca..."
                      value={formValues.search}
                      onChange={(event) => {
                        const userSearch = event.target.value
                        setFormValues({ search: userSearch })

                        // setIsLoading(true)
                        // delay fetching remote cities
                        // clearTimeout(GLOBAL.lastTimeout)
                        // GLOBAL.lastTimeout = setTimeout(() => {
                        handleSearchChange({ setFormValues, setMyRecipes, setIsLoading, setIsError })(userSearch)
                        // }, 600)
                      }}
                    />
                  </Form.Group>
                </Form>
              </Col>

              {/* user feedback (no results, is loading, is error etc.) */}
              <Col xs={12} md={6}>
                {/* my recipes list */}
                {myRecipes.length > 0 && !isLoading && !isError && (
                  <ListGroup className="mt-5 position-absolute">
                    {myRecipes.map((myRecipe, idx) => (
                      <ListGroup.Item
                        key={idx}
                        action
                        onClick={() => {
                          console.log(myRecipe)
                          // set the selected city
                          // props.setSelectedCity({
                          //   lat: city.lat,
                          //   lon: city.lon,
                          //   name: city.name,
                          //   state: city.state,
                          //   country: city.country,
                          // })
                          // navigate("/city-details")
                          // console.log(props)
                        }}
                      >
                        <span className="text-left">{myRecipe.name}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {/* no my recipes found */}
                {myRecipes.length == 0 && formValues.search.length > 0 && !isLoading && !isError && (
                  <Alert variant="info" className="mt-2 position-absolute">
                    <Alert.Heading>Nessuna ricetta trovata</Alert.Heading>
                  </Alert>
                )}

                {/* is loading */}
                {isLoading && (
                  <div className="text-center mt-3 position-absolute">
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
  const { setFormValues, setMyRecipes, setIsLoading, setIsError } = componentInfo
  return async (userSearch) => {
    // if (userSearch.length == 0) {
    //   // empty
    //   setIsLoadingCities(false)
    //   setCitiesList([])
    //   return
    // }

    try {
      setIsLoading(true)
      setIsError(false)
      // const weatherApi = new OpenWeatherMap({ prettify: true })
      // const citiesList = await weatherApi.getCitySuggestions({ searchQuery: userSearch })
      setIsLoading(false)
      setIsError(false)
      // setMyRecipes(citiesList)
    } catch (err) {
      setIsLoading(false)
      setIsError(true)
      console.error(err)
    }
  }
}

export default MyRecipes
