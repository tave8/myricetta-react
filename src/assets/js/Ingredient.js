class Ingredient {
  constructor({ name, recipe, quantity }) {
    this.name = name
    this.quantity = quantity
    this.quantityMultiplied = quantity
    this.quantityMultipliedRounded = Ingredient.roundQuantity(quantity)
    this.recipe = recipe
    this.id = Ingredient.genId()
  }

  getId() {
    return this.id
  }

  getName() {
    return this.name
  }

  setName(name) {
    this.name = name
  }

  getProportion() {
    return this.getQuantity() / this.recipe.getTotIngredients()
  }

  getProportionRounded() {
    return Ingredient.roundProportion(this.getProportion())
  }

  getPercentage() {
    return this.getProportion() * 100
  }

  getPercentageRounded() {
    return Ingredient.roundPercentage(this.getPercentage())
  }

  getQuantity() {
    return this.quantity
  }

  getQuantityMultiplied() {
    return this.quantityMultiplied
  }

  setQuantityMultiplied(multiplier) {
    this.quantityMultiplied = this.getQuantity() * multiplier
  }

  setQuantityMultipliedRounded(multiplier) {
    this.quantityRoundedMultiplied = Ingredient.roundQuantity(this.getQuantity() * multiplier)
  }

  getQuantityRounded() {
    return Ingredient.roundNumber(this.getQuantity(), 2)
  }

  getQuantityMultipliedRounded() {
    return Ingredient.roundNumber(this.getQuantityMultiplied(), 2)
  }

  setQuantity(quantity) {
    this.quantity = quantity
  }

  /**
   * Round x by n digits
   */
  // roundNumber(num, nDigits) {
  //   return parseFloat(num.toFixed(nDigits));
  // }

  static roundNumber(num, nDigits) {
    return parseFloat(num.toFixed(nDigits))
  }

  static roundProportion(x) {
    return this.roundNumber(x, 4)
  }

  static roundPercentage(x) {
    return this.roundNumber(x, 2)
  }

  static roundQuantity(x) {
    return this.roundNumber(x, 2)
  }

  static genId() {
    const randNum = Math.floor(Math.random() * 100000000)
    return `ingredient-${randNum}`
  }
}


export default Ingredient