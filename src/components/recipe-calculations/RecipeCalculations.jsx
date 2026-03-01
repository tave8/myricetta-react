import RecipeRemote from "../../assets/js/Recipe/RecipeRemote"
import OneIngredientToOthers from "./OneIngredientToOthers"
import RecipeQuantityToIngredients from "./RecipeQuantityToIngredients"

const RecipeCalculations = ({ _recipeInstance }) => {
  return (
    <>
      {/* <OneIngredientToOthers _recipeInstance={_recipeInstance} /> */}
      <RecipeQuantityToIngredients _recipeInstance={_recipeInstance} />
    </>
  )
}

export default RecipeCalculations
