import Recipe from "./Recipe"

/**
 * STILL NEED TO WORK ON THIS
 */
export default class RecipeLocalStorage extends Recipe {
  constructor() {
    super()
  }

  getRecipeByIdFromLocalStorage(id) {
    const recipesStr = localStorage.getItem("recipes")
    if (!recipesStr) {
      console.log("attempting to get a recipe by id but there are no recipes")
      return
    }
    const recipes = JSON.parse(recipesStr)

    // search recipes by id
    const recipe = recipes.find((recipe) => recipe.id === id)

    if (!recipe) {
      throw Error(`The recipe with id '${id}' does not exist.`)
    }

    return recipe
  }

  /**
   * Removes this recipe from local storage.
   */
  removeRecipeFromLocalStorage() {
    // now remove the recipe from local storage
    const recipesStr = localStorage.getItem("recipes")
    if (!recipesStr) {
      console.log("attempting to get a recipe by id but there are no recipes")
      return
    }

    // the id of the recipe used, is the id of this recipe  (class instance)
    const recipeId = this.id

    // recipes in local storage
    const recipes = JSON.parse(recipesStr)
    // creates a new copy of recipes, initially it's the same as
    // the recipes in local storage
    const recipesWithoutThisRecipe = recipes.map((recipe) => {
      return { ...recipe }
    })

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i]
      const foundRecipe = recipe.id === recipeId
      if (foundRecipe) {
        // remove the recipe with the id given
        recipesWithoutThisRecipe.splice(i, 1)
        break
      }
    }

    // save this array of recipes as the new recipes
    localStorage.setItem("recipes", JSON.stringify(recipesWithoutThisRecipe))
  }

  getRecipesFromLocalStorage() {
    if (!localStorage) {
      console.log("Local storage not available")
      return
    }
    const existsRecipes = localStorage.getItem("recipes") !== null
    // if there are no recipes yet
    if (!existsRecipes) {
      return []
    }
    const recipesAsStr = localStorage.getItem("recipes")
    const recipesAsList = JSON.parse(recipesAsStr)
    return recipesAsList
  }

  addRecipeToLocalStorage() {
    if (!localStorage) {
      console.log("Local storage not available")
      return
    }
    const existsRecipes = localStorage.getItem("recipes") !== null
    // if there's no recipe yet
    if (!existsRecipes) {
      // set the property recipes for the first time, because
      // there's no recipe currently
      const recipesAsList = [this.getRecipeToSave()]
      // console.log(recipesAsList)
      localStorage.setItem("recipes", JSON.stringify(recipesAsList))
      return
    }
    // if recipes already exist, then you need to parse the current
    // recipes string into a real appropriate data type, then add
    // it the recipe, then re-parse this back to string, then overwrite
    // the current recipes string in local storage
    const currRecipesStr = localStorage.getItem("recipes")
    const recipesParsed = JSON.parse(currRecipesStr)

    // console.log(recipesParsed);
    recipesParsed.push(this.getRecipeToSave())

    const newRecipesStr = JSON.stringify(recipesParsed)

    localStorage.setItem("recipes", newRecipesStr)
  }

  /**
   * Edit the current recipe, which must now overwrite the current recipe
   * in local storage.
   */
  editRecipeToLocalStorage() {
    if (!localStorage) {
      console.log("Local storage not available")
      return
    }
    const existsRecipes = localStorage.getItem("recipes") !== null
    // if there's no recipe yet
    if (!existsRecipes) {
      throw Error("there are no recipes in local storage")
    }
    // if recipes already exist, then you need to parse the current
    // recipes string into a real appropriate data type, then add
    // it the recipe, then re-parse this back to string, then overwrite
    // the current recipes string in local storage
    const currRecipesStr = localStorage.getItem("recipes")
    const recipes = JSON.parse(currRecipesStr)
    const recipesUpdated = recipes.map((recipe) => {
      return { ...recipe }
    })

    // find the recipe and update it
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i]
      // if the generic recipe in the local storage matches
      // the current recipe, we found it
      if (recipe.id === this.id) {
        // replace the current recipe with the new recipe
        recipesUpdated.splice(i, 1, this.getRecipeToSave())
        break
      }
    }

    const recipesUpdatedStr = JSON.stringify(recipesUpdated)

    localStorage.setItem("recipes", recipesUpdatedStr)
  }
}
