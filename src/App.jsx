import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav } from "react-bootstrap"
import { Helmet } from "react-helmet"

// redux
import { Provider } from "react-redux"
// redux persist
import { store, persistedStore } from "./redux/store/index"
import { PersistGate } from "redux-persist/integration/react"

// routes/pages
// import Home from "./components/home/Home"
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
                  <Navbar.Brand href="#home">myricetta</Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                      <Nav.Link href="#home">Home</Nav.Link>
                      <Nav.Link href="#link">Link</Nav.Link>
                      <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </Col>

            <Col xs={12} className="" style={{ flexGrow: 1 }}>
              <Row>
                <Col>
                  <p>main content</p>
                </Col>
              </Row>
            </Col>

            {/* FOOTER */}
            <Col xs={12} className="bg-body-tertiary" style={{}}>
              <Row className="flex-column">
                <Col>
                  <Row>
                    <Col xs={"auto"}>
                      <p>italia</p>
                    </Col>
                    <Col xs={"auto"}>
                      <p>english</p>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <p>copyright</p>
                </Col>
                <Col>
                  <Row className="flex-wrap">
                    <Col xs={"auto"}>
                      <p>link 1</p>
                    </Col>
                    <Col xs={"auto"}>
                      <p>link 2</p>
                    </Col>
                    <Col xs={"auto"}>
                      <p>link 3</p>
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
