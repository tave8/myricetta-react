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
// pages components
import RecipeComponent from "./components/Recipe"
import MyRecipesComponent from "./components/MyRecipes"
import NotFoundComponent from "./components/NotFound"
// layout components
import NavbarComponent from "./components/Navbar"
import FooterComponent from "./components/Footer"

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Container fluid style={{ minHeight: "100vh" }}>
          <Row className="flex-column" style={{ minHeight: "100vh" }}>
            {/* NAVBAR */}
            <NavbarComponent />

            {/* PAGES/ROUTES */}
            <Col xs={12} className="py-3" style={{ flexGrow: 1 }} id="pages-container">
              <Routes>
                <Route path="/my-recipes" element={<MyRecipesComponent />} />
                <Route path="/add-recipe" element={<RecipeComponent />} />
                <Route path="/edit-recipe/:recipeId" element={<RecipeComponent isEditMode={true} />} />
                <Route path="*" element={<NotFoundComponent />} />
              </Routes>
            </Col>

            {/* FOOTER */}
            <FooterComponent />
          </Row>
        </Container>
      </BrowserRouter>
    </Provider>
  )
}

export default App
