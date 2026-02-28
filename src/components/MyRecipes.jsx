import { Col, Row } from "react-bootstrap"

const MyRecipes = () => {
  return (
    <Row className="justify-content-center">
      <Col xs={12} md={9}>
        <Row className="flex-column gap-5">
          {/* PAGE TITLE */}
          <Col>
            <h2 className="text-center">Le mie ricette</h2>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default MyRecipes
