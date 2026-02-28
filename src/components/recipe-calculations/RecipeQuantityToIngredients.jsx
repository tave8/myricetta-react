import { useState } from "react"
import { QuantityIsNotValidError } from "../../assets/js/Recipe/errors"

const RecipeQuantityToIngredients = () => {
  // feature: from recipe total quantity, calculate ingredients
  const [knownRecipeQuantity, setKnownRecipeQuantity] = useState("")
  const [ingredientsCalculationsFromRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity] = useState(null)

  return (
    <>
      {/* FROM TOTAL RECIPE, CALCULATE INGREDIENTS */}
      <Col>
        <Row className="flex-column g-3">
          {/* title */}
          <Col>
            <h4>Ho il totale impasto, calcola gli ingredienti</h4>
          </Col>
          {/* known recipe (quantity) */}
          <Col>
            <Row className="g-3">
              {/* known recipe quantity */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Control
                    type="number"
                    id="known-recipe-quantity-input"
                    placeholder="Quantità (g)"
                    value={knownRecipeQuantity}
                    onChange={(event) => {
                      const val = event.target.value
                      setKnownRecipeQuantity(val)
                      const context = { _recipeInstance, knownRecipeQuantity: val, setKnownRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity }
                      calcIngredientsFromRecipeQuantityHelper(context)()
                      setTimeout(() => {
                        scrollIntoViewOfKnownRecipeQuantityInput()
                      }, 100)
                    }}
                  />
                </Form.Group>
              </Col>
              {/* frase */}
              <Col xs={12}>
                {knownRecipeQuantity && ingredientsCalculationsFromRecipeQuantity?.ingredients.length > 0 && (
                  <div className="fw-bold">Per {knownRecipeQuantity} g di impasto mi servono:</div>
                )}
              </Col>
            </Row>
          </Col>
          {/* ingredients list */}
          <Col>
            <Row className="justify-content-center">
              <Col xs={12}>
                {ingredientsCalculationsFromRecipeQuantity?.ingredients.length > 0 && (
                  <Table striped bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
                    <colgroup>
                      <col style={{ width: "70%" }} />
                      <col style={{ width: "30%" }} />
                    </colgroup>

                    <thead>
                      <tr>
                        <th>Ingr.</th>
                        <th className="text-end">Q.tà</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* exist ingredients */}
                      {ingredientsCalculationsFromRecipeQuantity?.ingredients.map((ingredient) => {
                        // console.log(ingredient)
                        return (
                          <tr key={ingredient.id}>
                            <td>{ingredient.name}</td>
                            <td className="text-end">{ingredient.quantityRounded} g</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      {ingredientsCalculationsFromRecipeQuantity?.ingredients.length > 0 && (
                        <tr className="table-primary fw-bold">
                          <td className="text-end">TOTALE:</td>
                          <td className="text-end">{ingredientsCalculationsFromRecipeQuantity.totIngredientsRounded} g</td>
                        </tr>
                      )}
                    </tfoot>
                  </Table>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </>
  )
}

const calcIngredientsFromRecipeQuantityHelper = ({ _recipeInstance, knownRecipeQuantity, setIngredientsCalculationsFromRecipeQuantity }) => {
  return () => {
    try {
      const ingredientsData = _recipeInstance.calcFromTot(knownRecipeQuantity)
      setIngredientsCalculationsFromRecipeQuantity(ingredientsData)
    } catch (err) {
      // why ignore this error? because the user might
      // me in the process of typing, or a new refresh of the calculations
      // is requested, so we don't have enough information
      // to lock ourselves onto a decision, so for now ignore the error
      if (err instanceof QuantityIsNotValidError) {
        setIngredientsCalculationsFromRecipeQuantity({
          ingredients: [],
          totIngredientsRounded: 0,
        })
        console.info(`ignored invalid quantity in "calcIngredientsFromRecipeQuantityHelper"`)
      }
    }
  }
}

const scrollIntoViewOfKnownRecipeQuantityInput = () => {
  // document.getElementById("known-recipe-quantity-input").scrollIntoView()
}


export default RecipeQuantityToIngredients
