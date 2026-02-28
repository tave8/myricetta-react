import { useState } from "react"
import { Row, Col, Placeholder, Spinner, Alert, Button, Image, Form, Table } from "react-bootstrap"

import { QuantityIsNotValidError } from "../../assets/js/Recipe/errors"

const OneIngredientToOthers = ({ _recipeInstance }) => {
  // feature: from one ingredient, calculate others
  const [knownIngredientName, setKnownIngredientName] = useState("")
  const [knownIngredientQuantity, setKnownIngredientQuantity] = useState("")
  // const [ingredientsCalculationsFromIngredient, setIngredientsCalculationsFromIngredient] = useState(null)

  console.log(_recipeInstance)

  return (
    <>
      {/* FROM 1 INGREDIENT, CALCULATE THE OTHERS */}
      <Col>
        <Row className="flex-column g-3">
          {/* title */}
          <Col>
            <h4>Ho un ingrediente, calcola gli altri</h4>
          </Col>
          {/* known ingredient (name, quantity) */}
          <Col>
            <Row className="g-3">
              {/* known ingredient name */}
              <Col xs={8}>
                <Form.Group>
                  <Form.Select
                    value={knownIngredientName}
                    id="known-ingredient-name-input"
                    onChange={(event) => {
                      const val = event.target.value
                      const isOptionEmpty = val.trim() == ""
                      setKnownIngredientName(val)
                      if (isOptionEmpty) {
                        setKnownIngredientQuantity("")
                      }
                      // const context = {
                      //   _recipeInstance,
                      //   knownIngredientName: val,
                      //   knownIngredientQuantity,
                      //   setIngredientsCalculationsFromIngredient,
                      // }
                      // calcIngredientsFromOneIngredientHelper(context)()
                      // // focusKnownIngredientQuantity()
                      // setTimeout(() => {
                      //   scrollIntoViewOfKnownIngredientNameInput()
                      // }, 100)
                    }}
                  >
                    <option value="">Seleziona ingrediente...</option>
                    {/* {ingredientsCalculations?.ingredients.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.name}>
                        {ingredient.name}
                      </option>
                    ))} */}
                  </Form.Select>
                </Form.Group>
              </Col>
              {/* known ingredient quantity */}
              <Col xs={4}>
                <Form.Group>
                  <Form.Control
                    type="number"
                    id="known-ingredient-quantity"
                    placeholder="Quantità (g)"
                    value={knownIngredientQuantity}
                    onChange={(event) => {
                      const val = event.target.value
                      setKnownIngredientQuantity(val)
                      const context = {
                        _recipeInstance,
                        knownIngredientName,
                        knownIngredientQuantity: val,
                        setIngredientsCalculationsFromIngredient,
                      }
                      calcIngredientsFromOneIngredientHelper(context)()
                      setTimeout(() => {
                        scrollIntoViewOfKnownIngredientNameInput()
                      }, 100)
                    }}
                  />
                </Form.Group>
              </Col>
              {/* Frase */}
              {knownIngredientQuantity && knownIngredientName && (
                <Col xs={12}>
                  <div className="fw-bold">
                    Per <span className="">{knownIngredientQuantity}</span> g di <span className="">{knownIngredientName}</span> mi servono:
                  </div>
                </Col>
              )}
            </Row>
          </Col>
          {/* ingredients list */}

          {
            knownIngredientQuantity &&
              knownIngredientName &&
              // <Col>
              //   <Row className="justify-content-center">
              //     <Col xs={12}>
              //       {ingredientsCalculationsFromIngredient?.ingredients.length > 0 && (
              //         <Table striped bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
              //           <colgroup>
              //             <col style={{ width: "70%" }} />
              //             <col style={{ width: "30%" }} />
              //           </colgroup>

              //           <thead>
              //             <tr>
              //               <th>Ingr.</th>
              //               <th className="text-end">Q.tà</th>
              //             </tr>
              //           </thead>

              //           <tbody>
              {
                /* exist ingredients */
              }
            // {ingredientsCalculationsFromIngredient?.ingredients.map((ingredient) => {
            //   const isIngredientInListSameAsKnownIngredient = ingredient.name == knownIngredientName
            //   return (
            //     <tr key={ingredient.id} className={isIngredientInListSameAsKnownIngredient ? "table-primary" : ""}>
            //       <td>{ingredient.name}</td>
            //       <td className="text-end">{ingredient.quantityRounded} g</td>
            //     </tr>
            //   )
            // })}
            //   </tbody>
            //   <tfoot>
            //     {ingredientsCalculationsFromIngredient?.ingredients.length > 0 && (
            //       <tr className="text-end fw-bold">
            //         <td>TOTALE:</td>
            //         <td>{ingredientsCalculationsFromIngredient.totIngredientsRounded} g</td>
            //       </tr>
            //     )}
            //   </tfoot>
            // </Table>
          }
          {/* </Col> */}
          {/* </Row> */}
          {/* </Col> */}
          {/* )} */}
        </Row>
      </Col>
    </>
  )
}

const calcIngredientsFromOneIngredientHelper = ({
  _recipeInstance,
  knownIngredientName,
  knownIngredientQuantity,
  setIngredientsCalculationsFromIngredient,
}) => {
  return () => {
    try {
      // if there's no ingredient selected
      if (knownIngredientName == "") {
        return
      }
      const ingredientsData = _recipeInstance.calcFromIngredient({
        name: knownIngredientName,
        quantity: knownIngredientQuantity,
      })
      setIngredientsCalculationsFromIngredient(ingredientsData)
    } catch (err) {
      // why ignore this error? because the user might
      // me in the process of typing, or a new refresh of the calculations
      // is requested, so we don't have enough information
      // to lock ourselves onto a decision, so for now ignore the error
      if (err instanceof QuantityIsNotValidError) {
        setIngredientsCalculationsFromIngredient({
          ingredients: [],
          totIngredientsRounded: 0,
        })
        console.info(`ignored invalid quantity in "calcIngredientsFromOneIngredientHelper"`)
      }
    }
  }
}

const scrollIntoViewOfKnownIngredientNameInput = () => {
  // document.getElementById("known-ingredient-name-input").scrollIntoView()
}

export default OneIngredientToOthers
