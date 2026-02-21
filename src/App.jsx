import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav } from "react-bootstrap"
import { Helmet } from "react-helmet"

// redux
import { Provider } from "react-redux"
// redux persist
import { store, persistedStore } from "./redux/store/index"
import { PersistGate } from "redux-persist/integration/react"

// routes/pages
import AddRecipe from "./components/Recipe"
// import NotFound from "./components/NotFound"

// components

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Container fluid style={{ minHeight: "100vh" }}>
          <Row className="flex-column" style={{ minHeight: "100vh" }}>
            {/* NAVBAR */}
            <Col xs={12} className="p-0" style={{}}>
              <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                  <Navbar.Brand as={Link} to="/add-recipe">
                    myricetta
                  </Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                      <Nav.Link as={Link} to="/add-recipe">
                        Aggiungi ricetta
                      </Nav.Link>
                      {/* <Nav.Link as={Link} to="/see-recipes">
                        Le mie ricette
                      </Nav.Link> */}

                      {/* <Nav.Link href="#home">Home</Nav.Link>
                      <Nav.Link href="#link">Link</Nav.Link> */}

                      {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                      </NavDropdown> */}
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </Col>

            {/* PAGES/ROUTES */}
            <Col xs={12} className="py-3" style={{ flexGrow: 1 }}>
              <Row>
                <Routes>
                  <Route path="/add-recipe" element={<AddRecipe />} />
                  {/* <Route path="/see-recipes" /> */}
                </Routes>
              </Row>
            </Col>

            {/* FOOTER */}
            <Col xs={12} className="bg-body-tertiary" style={{}}>
              <Row className="flex-column">
                <Col>
                  <Row>
                    <Col className="text-center">
                      <p className="m-2">myricetta - 2026</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </BrowserRouter>
    </Provider>
  )
}

export default App
