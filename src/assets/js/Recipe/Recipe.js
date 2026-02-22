import Ingredient from "./Ingredient"
import Helper from "./Helper"
import {
  IngredientNameNotFoundError,
  IngredientIdNotFoundError,
  IngredientNameAlreadyExistsError,
  QuantityIsNotNumberError,
  IngredientNameIsNotValidError,
} from "./errors"

/**
 * ### Recipe
 */
export default class Recipe extends Helper {
  constructor() {
    super()
    this.id = this.constructor.generateId()
    this.ingredients = []
    // this.overridden = false
  }

  /**
   * ### 1 INGREDIENT -> ALL INGREDIENTS
   *
   * I have one ingredient and its quantity, I want the quantity of all other ingredients
   */
  calcFromIngredient({ name: _knownIngredientName, quantity: _knownIngredientQuantity }) {
    const ingredientsList = []
    let totIngredients = 0

    const knownIngredientName = _knownIngredientName
    const knownIngredientQuantity = parseFloat(_knownIngredientQuantity)

    // quantity is not a number
    if (!this.constructor.isNumber(knownIngredientQuantity)) {
      throw new QuantityIsNotNumberError(`In method "calcFromIngredient" with 
                                          input ingredient "${_knownIngredientName}", 
                                          input quantity "${_knownIngredientQuantity}"`)
    }

    // ingredient does not exist
    if (!this.existsIngredientByName(knownIngredientName)) {
      throw new IngredientNameNotFoundError(`The ingredient "${knownIngredientName}" has not been found.`)
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

    const knownRecipeQuantity = parseFloat(_knownRecipeQuantity)

    // quantity is not a number
    if (!this.constructor.isNumber(knownRecipeQuantity)) {
      throw new QuantityIsNotNumberError(`In method "calcFromTot" with 
                                          input recipe quantity "${_knownRecipeQuantity}"`)
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
    const knownIngredientName = _knownIngredientName
    const knownIngredientQuantity = parseFloat(_knownIngredientQuantity)

    // quantity is not a number
    if (!this.constructor.isNumber(knownIngredientQuantity)) {
      throw new QuantityIsNotNumberError(`Quantity "${knownIngredientQuantity}" must be a number, 
                                          it is of type "${typeof knownIngredientQuantity}" instead.`)
    }

    // ingredient does not exist
    if (!this.existsIngredientByName(knownIngredientName)) {
      throw new IngredientNameNotFoundError(`The ingredient "${knownIngredientName}" has not been found.`)
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

  getIngredientProportionByName(ingredientName, throwsIfIngredientNameNotFound = true) {
    const ingredient = this.getIngredientByName(ingredientName)
    const existsIngredient = ingredient !== undefined

    if (!existsIngredient && throwsIfIngredientNameNotFound) {
      throw new IngredientNameNotFoundError(`The ingredient "${ingredientName}" has not been found.`)
    }

    return ingredient.getProportion()
  }

  /**
   * Returns undefined if ingredient is not found
   */
  getIngredientByName(ingredientName) {
    return this.ingredients.find((ingredient) => ingredientName === ingredient.name)
  }

  /**
   * Returns undefined if ingredient is not found
   */
  getIngredientById(ingredientId) {
    return this.ingredients.find((ingredient) => ingredientId === ingredient.id)
  }

  setName(recipeName) {
    this.name = recipeName
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
    ingredientsAsList.forEach((ingredientInfo) => this.addIngredient(ingredientInfo))
  }

  /**
   * Add an ingredient.
   * Throws an error if ingredient with the input name already exists.
   */
  addIngredient({ name: _ingredientName, quantity: _ingredientQuantity }) {
    const ingredientName = _ingredientName
    const ingredientQuantity = parseFloat(_ingredientQuantity)

    // ingredient name is not valid
    if (!this.constructor.isValidIngredientName(ingredientName)) {
      throw new IngredientNameIsNotValidError(`Ingredient name "${ingredientName}" is not valid.`)
    }

    // quantity is not a number
    if (!this.constructor.isNumber(ingredientQuantity)) {
      throw new QuantityIsNotNumberError(`In method "addIngredient", quantity with value "${ingredientQuantity}" must be a number and it is not.`)
    }

    // ingredient name already exists
    if (this.existsIngredientByName(ingredientName)) {
      throw new IngredientNameAlreadyExistsError(`An ingredient with the same name as "${ingredientName}" already exists, so it cannot be added.`)
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

  existsIngredientByName(ingredientName) {
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

  removeIngredientByName(ingredientName) {
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

  /**
   *
   */
  // getRecipeToSave() {
  //   const ingredientsList = []
  //   const recipeData = {
  //     id: this.id,
  //     name: this.getName(),
  //     ingredients: ingredientsList,
  //   }

  //   this.ingredients.forEach((ingredient) => {
  //     const ingredientInfo = {
  //       name: ingredient.getName(),
  //       proportion: ingredient.getProportion(),
  //       quantity: ingredient.getQuantity(),
  //     }
  //     ingredientsList.push(ingredientInfo)
  //   })

  //   return recipeData
  // }

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
