import Ingredient from "./Ingredient"
import Helper from "./Helper"
import {
  IngredientNameNotFoundError,
  IngredientIdNotFoundError,
  IngredientNameAlreadyExistsError,
  IngredientNameIsNotValidError,
  RecipeNameIsNotValidError,
  RecipeHasNoIngredientsError,
  StringIsNotStringError,
  NumberIsNotNumberError,
  QuantityIsNotValidError,
} from "./errors"

const defaultConfig = {
  normalizeStrings: true,
  normalizeNumbers: true,
}

const defaultParams = {
  config: defaultConfig,
}

/**
 * ### Recipe
 *
 * USAGE
 *  new Recipe()
 */
export default class Recipe extends Helper {
  constructor(params = defaultParams) {
    super()
    const finalParams = { ...structuredClone(defaultParams), ...structuredClone(params) }
    this.id = this.constructor.generateId()
    this.ingredients = []
    this.config = finalParams.config
    // this.overridden = false
  }

  /**
   * Override every property
   */
  overrideSelfFromObj(recipeObj) {
    // must be object
    if (typeof recipeObj != "object") {
      throw new Error(`must be object`)
    }
    // must have recipe name
    if (!this.constructor.isValidRecipeName(recipeObj.name)) {
      throw new Error(`recipe name must exist and must be valid`)
    }
    // must have recipe id
    if (!Object.hasOwn(recipeObj, "id")) {
      throw new Error(`recipe id must exist`)
    }
    // must have ingredients array
    if (!Array.isArray(recipeObj.ingredients)) {
      throw new Error(`recipe ingredients must be an array`)
    }
    this.setName(recipeObj.name)
    this.setId(recipeObj.id)
    this.addIngredients(recipeObj.ingredients)
  }

  /**
   * Throws StringIsNotStringError
   *
   */
  normalizeString(x) {
    return this.config.normalizeStrings ? this.constructor.normalizeString(x) : x
  }

  /**
   * Throws NumberIsNotNumberError
   *
   */
  normalizeNumber(x) {
    return this.config.normalizeNumbers ? this.constructor.normalizeNumber(x) : x
  }

  /**
   * ### 1 INGREDIENT -> ALL INGREDIENTS
   *
   * I have one ingredient and its quantity, I want the quantity of all other ingredients
   */
  calcFromIngredient({ name: _knownIngredientName, quantity: _knownIngredientQuantity }) {
    const ingredientsList = []
    let totIngredients = 0

    let knownIngredientName
    let knownIngredientQuantity

    // INGREDIENT NAME VALIDATION
    try {
      knownIngredientName = this.normalizeString(_knownIngredientName)
      // ingredient name is not valid
      if (!this.constructor.isValidIngredientName(knownIngredientName)) {
        throw new IngredientNameIsNotValidError(_knownIngredientName)
      }
    } catch (_) {
      throw new IngredientNameIsNotValidError(_knownIngredientName)
    }

    // INGREDIENT QUANTITY VALIDATION
    try {
      knownIngredientQuantity = this.normalizeNumber(_knownIngredientQuantity)
      if (!this.constructor.isValidQuantity(knownIngredientQuantity)) {
        throw new QuantityIsNotValidError(_knownIngredientQuantity)
      }
    } catch (_) {
      throw new QuantityIsNotValidError(_knownIngredientQuantity)
    }

    // ingredient does not exist
    if (!this.existsIngredientByName(knownIngredientName)) {
      throw new IngredientNameNotFoundError(knownIngredientName)
    }

    const recipeQuantityTotal = this.getRecipeQuantityFromIngredientInfo({
      name: knownIngredientName,
      quantity: knownIngredientQuantity,
    })

    // create the result
    this.ingredients.forEach((ingredient) => {
      // moltiplicando la quantitÃ  totale con la proporzione del singolo ingrediente,
      // ricavo finalmente la quantitÃ  di ogni altro ingrediente, oltre all'ingrediente dato
      const ingredientProportion = ingredient.getProportion()
      const newIngredientQuantity = recipeQuantityTotal * ingredientProportion
      const newIngredientQuantityRounded = this.constructor.roundQuantity(newIngredientQuantity)

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

    const totIngredientsRounded = this.constructor.roundQuantity(totIngredients)

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
  calcFromTot(_knownRecipeQuantity) {
    const ingredientsList = []
    let totIngredients = 0

    let knownRecipeQuantity

    // RECIPE QUANTITY VALIDATION
    try {
      knownRecipeQuantity = this.normalizeNumber(_knownRecipeQuantity)
      if (!this.constructor.isValidQuantity(knownRecipeQuantity)) {
        throw new QuantityIsNotValidError(_knownRecipeQuantity)
      }
    } catch (_) {
      throw new QuantityIsNotValidError(_knownRecipeQuantity)
    }

    this.ingredients.forEach((ingredient) => {
      const ingredientProportion = ingredient.getProportion()
      const newIngredientQuantity = knownRecipeQuantity * ingredientProportion
      const newIngredientQuantityRounded = this.constructor.roundQuantity(newIngredientQuantity)

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

    const totIngredientsRounded = this.constructor.roundQuantity(totIngredients)

    return {
      ingredients: ingredientsList,
      totIngredientsRounded,
    }
  }

  /**
   * The pre-requisite to calculating the ingredient quantities from one ingredient,
   * is knowing the recipe total quantity.
   */
  getRecipeQuantityFromIngredientInfo({ name: _knownIngredientName, quantity: _knownIngredientQuantity }) {
    let knownIngredientName
    let knownIngredientQuantity

    // INGREDIENT NAME VALIDATION
    try {
      knownIngredientName = this.normalizeString(_knownIngredientName)
    } catch (_) {
      throw new IngredientNameIsNotValidError(_knownIngredientName)
    }

    // INGREDIENT QUANTITY VALIDATION
    try {
      knownIngredientQuantity = this.normalizeNumber(_knownIngredientQuantity)
      if (!this.constructor.isValidQuantity(knownIngredientQuantity)) {
        throw new QuantityIsNotValidError(_knownIngredientQuantity)
      }
    } catch (_) {
      throw new QuantityIsNotValidError(_knownIngredientQuantity)
    }

    // ingredient does not exist
    if (!this.existsIngredientByName(knownIngredientName)) {
      throw new IngredientNameNotFoundError(knownIngredientName)
    }

    // trova proporzione dell'ingrediente noto, dalle proporzioni personalizzate
    const proportionKnown = this.getIngredientProportionByName(knownIngredientName)
    // visto che il totale delle proporzioni sarÃ  sempre 1, allora
    // la proporzione rimanente si ottiene sottraendo  1 - proporzioneNota
    const proportionRemainingKnown = 1 - proportionKnown
    // la quantita rimanente del totale
    // si basa sulla seguente proporzione
    // quantitaNota : quantitaRimanente = proporzioneNota : proporzioneNotaRimanente
    // esempio:
    // 10 g di sale stanno alla quantitÃ  di impasto che rimane, come la proporzione del sale (nel totale impasto)
    // sta al totale delle proporzioni degli altri ingredienti
    const recipeQuantityRemaining = (knownIngredientQuantity * proportionRemainingKnown) / proportionKnown
    // alla fine, dalla quantita nota di un ingrediente, e dalle proporzioni della ricetta,
    // si ricava la quantitÃ  totale di questo (nuovo?) impasto, non di quello dato
    // prima dall'utente come input
    const recipeQuantityTotal = knownIngredientQuantity + recipeQuantityRemaining

    return recipeQuantityTotal
  }

  getIngredientProportionByName(_ingredientName, throwsIfIngredientNameNotFound = true) {
    let ingredientName

    // INGREDIENT NAME VALIDATION
    try {
      ingredientName = this.normalizeString(_ingredientName)
    } catch (_) {
      throw new IngredientNameIsNotValidError(_ingredientName)
    }

    const ingredient = this.getIngredientByName(ingredientName)
    const existsIngredient = ingredient !== undefined

    if (!existsIngredient && throwsIfIngredientNameNotFound) {
      throw new IngredientNameNotFoundError(ingredientName)
    }

    return ingredient.getProportion()
  }

  /**
   * Returns undefined if ingredient is not found
   */
  getIngredientByName(_ingredientName) {
    let ingredientName

    // INGREDIENT NAME VALIDATION
    try {
      ingredientName = this.normalizeString(_ingredientName)
    } catch (_) {
      throw new IngredientNameIsNotValidError(_ingredientName)
    }

    return this.ingredients.find((ingredient) => ingredientName === ingredient.name)
  }

  /**
   * Returns undefined if ingredient is not found
   */
  getIngredientById(ingredientId) {
    return this.ingredients.find((ingredient) => ingredientId === ingredient.id)
  }

  /**
   * Get the up to date ingredients (ingredients list, recipe total quantity etc.)
   */
  getIngredients() {
    const ingredients = []
    let totIngredients = 0

    this.ingredients.forEach((ingredient) => {
      // const quantityMultiplied = ingredient.getQuantityMultiplied()
      const ingredientQuantity = ingredient.getQuantity()

      const ingredientInfo = {
        id: ingredient.getId(),
        name: ingredient.getName(),
        quantity: ingredient.getQuantity(),
        quantityRounded: ingredient.getQuantityRounded(),
        // quantityMultiplied: quantityMultiplied,
        // quantityMultipliedRounded: ingredient.getQuantityMultipliedRounded(),
        proportion: ingredient.getProportion(),
        percentage: ingredient.getPercentage(),
        proportionRounded: ingredient.getProportionRounded(),
        percentageRounded: ingredient.getPercentageRounded(),
      }

      totIngredients += ingredientQuantity
      ingredients.push(ingredientInfo)
    })

    // choosing the first ingredient because the method is on ingredients
    // not on recipe. should fix
    const totIngredientsRounded = this.constructor.roundQuantity(totIngredients)

    return {
      ingredients,
      totIngredients,
      totIngredientsRounded,
    }
  }

  getTotIngredients() {
    return this.ingredients.reduce((acc, ingredient) => acc + ingredient.quantity, 0)
  }

  addIngredients(ingredientsAsList) {
    if (!Array.isArray(ingredientsAsList)) {
      throw new Error(`Ingredient list must be an array. It is of type "${typeof ingredientsAsList}" instead.`)
    }
    ingredientsAsList.forEach((ingredientInfo) => this.addIngredient(ingredientInfo))
  }

  /**
   * Add an ingredient.
   * Throws an error if ingredient with the input name already exists.
   */
  addIngredient({ name: _ingredientName, quantity: _ingredientQuantity }) {
    let ingredientName
    let ingredientQuantity

    // INGREDIENT NAME VALIDATION
    try {
      ingredientName = this.normalizeString(_ingredientName)
      // ingredient name is not valid
      if (!this.constructor.isValidIngredientName(ingredientName)) {
        throw new IngredientNameIsNotValidError(_ingredientName)
      }
    } catch (_) {
      throw new IngredientNameIsNotValidError(_ingredientName)
    }

    // INGREDIENT QUANTITY VALIDATION
    try {
      ingredientQuantity = this.normalizeNumber(_ingredientQuantity)

      if (!this.constructor.isValidQuantity(ingredientQuantity)) {
        throw new QuantityIsNotValidError(_ingredientQuantity)
      }
    } catch (_) {
      throw new QuantityIsNotValidError(_ingredientQuantity)
    }

    // ingredient name already exists?
    if (this.existsIngredientByName(ingredientName)) {
      throw new IngredientNameAlreadyExistsError(ingredientName)
    }

    // add ingredient to recipe
    const ingredient = new Ingredient({
      name: ingredientName,
      quantity: ingredientQuantity,
      recipe: this,
    })

    this.ingredients.push(ingredient)

    return ingredient
  }

  existsIngredientByName(_ingredientName) {
    let ingredientName

    // INGREDIENT NAME VALIDATION
    try {
      ingredientName = this.normalizeString(_ingredientName)
    } catch (_) {
      throw new IngredientNameIsNotValidError(_ingredientName)
    }

    const item = this.getIngredientByName(ingredientName)
    const exists = item !== undefined
    return exists
  }

  existsIngredientById(ingredientId) {
    const item = this.getIngredientById(ingredientId)
    const exists = item !== undefined
    return exists
  }

  // editIngredient(currIngredientName, { name: newIngredientName, quantity: newIngredientQuantity }) {
  //   // check
  //   if (!this.existsIngredientByName(currIngredientName)) {
  //     throw Error(`The ingredient '${currIngredientName}' has not been found.`)
  //   }
  //   // check that the new name of the ingredient is not already taken
  //   if (this.existsIngredientByName(newIngredientName)) {
  //     throw Error(`Cannot rename current ingredient '${currIngredientName}' ` + `to '${newIngredientName}' because the latter exists already`)
  //   }

  //   const ingredient = this.getIngredientByName(currIngredientName)
  //   // console.log(ingredient)

  //   if (newIngredientName !== undefined) {
  //     ingredient.setName(newIngredientName)
  //   }
  //   if (newIngredientQuantity !== undefined) {
  //     ingredient.setQuantity(newIngredientQuantity)
  //   }

  //   // console.log(ingredient)
  // }

  removeIngredientByName(_ingredientName) {
    let ingredientName

    // INGREDIENT NAME VALIDATION
    try {
      ingredientName = this.normalizeString(_ingredientName)
    } catch (_) {
      throw new IngredientNameIsNotValidError(_ingredientName)
    }

    // exists ingredient
    if (!this.existsIngredientByName(ingredientName)) {
      throw new IngredientNameNotFoundError(`No ingredient "${ingredientName}" has been found, so it cannot be removed.`)
    }

    // remove ingredient from the ingredients
    this.ingredients.forEach((ingredient, i) => {
      if (ingredientName === ingredient.name) {
        this.ingredients.splice(i, 1)
      }
    })
  }

  // removeIngredientById(ingredientId) {
  //   if (!this.existsIngredientById(ingredientId)) {
  //     throw Error(`No ingredient with id '${ingredientId}' was found.`)
  //   }
  //   // remove ingredient from the ingredients
  //   this.ingredients.forEach((ingredient, i) => {
  //     if (ingredientId === ingredient.id) {
  //       this.ingredients.splice(i, 1)
  //     }
  //   })
  // }

  getName() {
    return this.name
  }

  getId() {
    return this.id
  }

  setName(_recipeName) {
    let recipeName

    // RECIPE NAME VALIDATION
    try {
      recipeName = this.normalizeString(_recipeName)
      if (!this.constructor.isValidRecipeName(recipeName)) {
        throw new RecipeNameIsNotValidError(recipeName)
      }
    } catch (_) {
      throw new RecipeNameIsNotValidError(_recipeName)
    }

    this.name = recipeName
  }

  setId(_recipeId) {
    this.id = _recipeId
  }

  /**
   * Get the data you need to save
   *  the recipe wherever you want (remote, local storage, etc.).
   * Checks will be done to make sure the recipe is ready to be saved.
   *
   * Throws:
   *    RecipeNameIsNotValidError
   *    RecipeHasNoIngredientsError
   */
  getRecipeToSave() {
    // recipe has invalid name
    if (!this.constructor.isValidRecipeName(this.getName())) {
      throw new RecipeNameIsNotValidError(this.getName())
    }

    // recipe has no ingredients
    if (!this.recipeHasIngredients()) {
      throw new RecipeHasNoIngredientsError()
    }

    const ingredientsList = []
    const recipeData = {
      id: this.getId(),
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

  /**
   * Use this when you want to COMPLETELY override/overwrite
   * the values of an already created recipe class instance,
   * with those of an already available recipe info.
   * For example when you are retrieving the recipe info
   * from local storage, and the recipe class instance was
   * already instanciated.
   */
  // overrideRecipe(recipeInfo) {
  //   this.name = recipeInfo.name
  //   this.id = recipeInfo.id
  //   // empty current ingredients, if any
  //   this.ingredients = []
  //   this.overridden = true
  //   this.addIngredients(recipeInfo.ingredients)
  // }

  // multiplyIngredients(multiplier) {
  //   this.ingredients.forEach((ingredient) => {
  //     ingredient.setQuantityMultiplied(multiplier)
  //     ingredient.setQuantityMultipliedRounded(multiplier)
  //   })
  // }

  // resetMultiplier() {
  //   this.multiplyIngredients(1)
  // }

  recipeHasIngredients() {
    return this.ingredients.length > 0
  }
}

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
