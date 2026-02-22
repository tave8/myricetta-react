import { useState } from "react"
import { Container, Row, Col, CardGroup, Card, Spinner, Alert, Button, Image, Form, ListGroup, Navbar, NavDropdown, Nav } from "react-bootstrap"
import { Helmet } from "react-helmet"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import Recipe from "../assets/js/Recipe/Recipe"

const FooterComponent = (props) => {
  return (
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
  )
}

export default FooterComponent
