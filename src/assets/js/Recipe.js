import Ingredient from "./Ingredient"

/**
 * ### Recipe
 */

class Recipe {
  constructor() {
    this.id = Recipe.genId()
    this.ingredients = []
    this.overridden = false
    this.useCases = {
      haveOneIngredient: {
        isUseCaseActive: false,
        ingredientName: null,
        ingredientQuantity: null,
      },
      haveRecipeTotal: {
        isUseCaseActive: false,
        recipeQuantity: null,
      },
    }
  }

  /**
   * ### 1 INGREDIENT -> ALL INGREDIENTS
   *
   * I have one ingredient and its quantity, I want the quantity of all other ingredients
   */
  calcFromIngredient({ name: ingredientName, quantity: ingredientQuantity }) {
    const ingredientsList = []
    let totIngredients = 0

    // console.log(ingredientName, ingredientQuantity)

    ingredientQuantity = parseFloat(ingredientQuantity)

    const recipeQuantityTotal = this.getRecipeQuantityFromIngredientInfo({
      name: ingredientName,
      quantity: ingredientQuantity,
    })

    // update the current use case
    this.useCases.haveOneIngredient.isUseCaseActive = true
    this.useCases.haveOneIngredient.ingredientName = ingredientName
    this.useCases.haveOneIngredient.ingredientQuantity = ingredientQuantity

    // create the result
    this.ingredients.forEach((ingredient, i) => {
      // moltiplicando la quantitÃ  totale con la proporzione del singolo ingrediente,
      // ricavo finalmente la quantitÃ  di ogni altro ingrediente, oltre all'ingrediente dato
      const ingredientProportion = ingredient.getProportion()
      const newIngredientQuantity = recipeQuantityTotal * ingredientProportion
      const newIngredientQuantityRounded = Ingredient.roundQuantity(newIngredientQuantity)

      ingredientsList.push({
        id: ingredient.getId(),
        name: ingredient.getName(),
        proportion: ingredientProportion,
        quantity: newIngredientQuantity,
        quantityRounded: newIngredientQuantityRounded,
        percentageRounded: ingredient.getPercentageRounded(),
      })

      totIngredients += newIngredientQuantity
    })

    const totIngredientsRounded = Ingredient.roundQuantity(totIngredients)

    return {
      ingredients: ingredientsList,
      totIngredientsRounded,
    }
  }

  /**
   *
   * ### TOTAL RECIPE -> ALL INGREDIENTS
   *
   * I have the total quantity of the recipe, I want the quantity of all ingredients
   */
  calcFromTot(recipeQuantity) {
    const ingredientsList = []
    let totIngredients = 0

    recipeQuantity = parseFloat(recipeQuantity)

    // update the current use case
    this.useCases.haveRecipeTotal.isUseCaseActive = true
    this.useCases.haveRecipeTotal.recipeQuantity = recipeQuantity

    this.ingredients.forEach((ingredient, i) => {
      const ingredientProportion = ingredient.getProportion()
      const newIngredientQuantity = recipeQuantity * ingredientProportion
      const newIngredientQuantityRounded = Ingredient.roundQuantity(newIngredientQuantity)

      ingredientsList.push({
        id: ingredient.getId(),
        name: ingredient.getName(),
        proportion: ingredientProportion,
        quantity: newIngredientQuantity,
        quantityRounded: newIngredientQuantityRounded,
        percentageRounded: ingredient.getPercentageRounded(),
      })

      totIngredients += newIngredientQuantity
    })

    const totIngredientsRounded = Ingredient.roundQuantity(totIngredients)

    return {
      ingredients: ingredientsList,
      totIngredientsRounded,
    }
  }

  /**
   * The pre-requisite to calculating the ingredient quantities from one ingredient,
   * is knowing the recipe total quantity.
   */
  getRecipeQuantityFromIngredientInfo({ name: ingredientName, quantity: ingredientQuantity }) {
    //   trova proporzione dell'ingrediente noto, dalle proporzioni personalizzate
    const proportionKnown = this.getIngredientProportionByName(ingredientName)
    // visto che il totale delle proporzioni sarÃ  sempre 1, allora
    // la proporzione rimanente si ottiene sottraendo  1 - proporzioneNota
    const proportionRemainingKnown = 1 - proportionKnown
    // la quantita rimanente del totale
    // si basa sulla seguente proporzione
    // quantitaNota : quantitaRimanente = proporzioneNota : proporzioneNotaRimanente
    // esempio:
    // 10 g di sale stanno alla quantitÃ  di impasto che rimane, come la proporzione del sale (nel totale impasto)
    // sta al totale delle proporzioni degli altri ingredienti
    const recipeQuantityRemaining = (ingredientQuantity * proportionRemainingKnown) / proportionKnown
    // alla fine, dalla quantita nota di un ingrediente, e dalle proporzioni della ricetta,
    // si ricava la quantitÃ  totale di questo (nuovo?) impasto, non di quello dato
    // prima dall'utente come input
    const recipeQuantityTotal = ingredientQuantity + recipeQuantityRemaining

    return recipeQuantityTotal
  }

  getIngredientProportionByName(ingredientName) {
    const ingredient = this.getIngredientByName(ingredientName)
    if (!ingredient) {
      throw Error(`The ingredient ${ingredientName} has not been found`)
    }
    return ingredient.getProportion()
  }

  getIngredientByName(ingredientName) {
    return this.ingredients.find((ingredient) => ingredientName === ingredient.name)
  }

  getIngredientById(ingredientId) {
    return this.ingredients.find((ingredient) => ingredientId === ingredient.id)
  }

  multiplyIngredients(multiplier) {
    this.ingredients.forEach((ingredient) => {
      ingredient.setQuantityMultiplied(multiplier)
      ingredient.setQuantityMultipliedRounded(multiplier)
    })
  }

  resetMultiplier() {
    this.multiplyIngredients(1)
  }

  /**
   * Get a list of ingredients
   */
  getIngredients() {
    const ingredients = []
    let totIngredients = 0

    this.ingredients.forEach((ingredient) => {
      const quantityMultiplied = ingredient.getQuantityMultiplied()

      const ingredientInfo = {
        id: ingredient.getId(),

        name: ingredient.getName(),

        quantity: ingredient.getQuantity(),
        quantityRounded: ingredient.getQuantityRounded(),

        quantityMultiplied: quantityMultiplied,
        quantityMultipliedRounded: ingredient.getQuantityMultipliedRounded(),

        proportion: ingredient.getProportion(),
        percentage: ingredient.getPercentage(),

        proportionRounded: ingredient.getProportionRounded(),
        percentageRounded: ingredient.getPercentageRounded(),
      }

      totIngredients += quantityMultiplied
      ingredients.push(ingredientInfo)
    })

    // choosing the first ingredient because the method is on ingredients
    // not on recipe. should fix
    const totIngredientsRounded = Ingredient.roundQuantity(totIngredients)

    return {
      ingredients,
      totIngredients,
      totIngredientsRounded,
    }
  }

  // getIngredientsInOrderAlphabetIngredient() {
  //   const ingredientsList = this.getIngredients()

  // }

  getTotIngredients() {
    return this.ingredients.reduce((acc, ingredient) => acc + ingredient.quantity, 0)
  }

  addIngredients(ingredientsAsList) {
    ingredientsAsList.forEach((ingredientInfo) => this.addIngredient(ingredientInfo))
  }

  addIngredient(ingredientInfo) {
    if (this.existsIngredientByName(ingredientInfo.name)) {
      throw Error(`The ingredient '${ingredientInfo.name}' you are trying to add is already present.`)
    }
    // console.log(this.existsIngredientByName(ingredientInfo.name))

    // add ingredient to recipe
    const ingredient = new Ingredient({
      name: ingredientInfo.name,
      quantity: parseFloat(ingredientInfo.quantity),
      recipe: this,
    })

    this.ingredients.push(ingredient)

    return ingredient
  }

  existsIngredientByName(ingredientName) {
    const item = this.getIngredientByName(ingredientName)
    const exists = item !== undefined
    return exists
  }

  existsIngredientById(ingredientId) {
    const item = this.getIngredientById(ingredientId)
    const exists = item !== undefined && item.constructor.name === "Ingredient"
    return exists
  }

  editIngredient(currIngredientName, { name: newIngredientName, quantity: newIngredientQuantity }) {
    // check
    if (!this.existsIngredientByName(currIngredientName)) {
      throw Error(`The ingredient '${currIngredientName}' has not been found.`)
    }
    // check that the new name of the ingredient is not already taken
    if (this.existsIngredientByName(newIngredientName)) {
      throw Error(`Cannot rename current ingredient '${currIngredientName}' ` + `to '${newIngredientName}' because the latter exists already`)
    }

    const ingredient = this.getIngredientByName(currIngredientName)
    // console.log(ingredient)

    if (newIngredientName !== undefined) {
      ingredient.setName(newIngredientName)
    }
    if (newIngredientQuantity !== undefined) {
      ingredient.setQuantity(newIngredientQuantity)
    }

    // console.log(ingredient)
  }

  removeIngredientByName(ingredientName) {
    if (!this.existsIngredientByName(ingredientName)) {
      throw Error(`No ingredient '${ingredientName}' was found.`)
    }

    // remove ingredient from the ingredients
    this.ingredients.forEach((ingredient, i) => {
      if (ingredientName === ingredient.name) {
        this.ingredients.splice(i, 1)
      }
    })
  }

  removeIngredientById(ingredientId) {
    if (!this.existsIngredientById(ingredientId)) {
      throw Error(`No ingredient with id '${ingredientId}' was found.`)
    }
    // remove ingredient from the ingredients
    this.ingredients.forEach((ingredient, i) => {
      if (ingredientId === ingredient.id) {
        this.ingredients.splice(i, 1)
      }
    })
  }

  getName() {
    return this.name
  }

  setName(recipeName) {
    this.name = recipeName
  }

  /**
   *
   */
  getRecipeToSave() {
    const ingredientsList = []
    const recipeData = {
      id: this.id,
      name: this.getName(),
      ingredients: ingredientsList,
    }

    this.ingredients.forEach((ingredient) => {
      const ingredientInfo = {
        name: ingredient.getName(),
        proportion: ingredient.getProportion(),
        quantity: ingredient.getQuantity(),
      }
      ingredientsList.push(ingredientInfo)
    })

    return recipeData
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

  getRecipesRemote() {}

  saveRecipeRemote() {}

  /**
   * Use this when you want to COMPLETELY override/overwrite
   * the values of an already created recipe class instance,
   * with those of an already available recipe info.
   * For example when you are retrieving the recipe info
   * from local storage, and the recipe class instance was
   * already instanciated.
   */
  overrideRecipe(recipeInfo) {
    this.name = recipeInfo.name
    this.id = recipeInfo.id
    // empty current ingredients, if any
    this.ingredients = []
    this.overridden = true
    this.addIngredients(recipeInfo.ingredients)
  }

  static genId() {
    const randNum = Math.floor(Math.random() * 100000000)
    return `recipe-${randNum}`
  }
}

export default Recipe

// USAGE

// const myRecipe = new Recipe();

// myRecipe.setName("My recipe")

// myRecipe.addIngredient({
//   name: "water",
//   quantity: 100,
// });

// myRecipe.editIngredient("salt", {
//   quantity: 40,
// });

// // myRecipe.removeIngredient("salt");
// // console.log(myRecipe);

// console.log(
// myRecipe.calcFromIngredient({
//   name: "water",
//   quantity: 45,
// });
// );

// console.log(myRecipe.calcFromTot(150));

// console.log(myRecipe);
