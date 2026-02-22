import Helper from "./Helper"

const defaultConfig = {
  normalizeStrings: true,
  normalizeNumbers: true,
}

export default class Ingredient extends Helper {
  constructor({ name, quantity, recipe }, config = defaultConfig) {
    super()
    this.id = this.constructor.generateId()
    this.name = name
    this.quantity = quantity
    this.quantityRounded = this.getQuantityRounded()
    this.quantityMultiplied = quantity
    this.quantityMultipliedRounded = this.getQuantityMultipliedRounded()
    this.recipe = recipe

    this.config = { ...defaultConfig, ...config }
  }

  // SETTERS

  setName(name) {
    this.name = name
  }

  setQuantity(quantity) {
    this.quantity = quantity
  }

  setQuantityMultiplied(multiplier) {
    this.quantityMultiplied = this.getQuantity() * multiplier
  }

  // GETTERS

  getId() {
    return this.id
  }

  getName() {
    return this.name
  }

  getQuantity() {
    return this.quantity
  }

  getQuantityRounded() {
    return this.constructor.roundQuantity(this.getQuantity())
  }

  getQuantityMultiplied() {
    return this.quantityMultiplied
  }

  getQuantityMultipliedRounded() {
    return this.constructor.roundQuantity(this.getQuantityMultiplied())
  }

  getProportion() {
    return this.getQuantity() / this.recipe.getTotIngredients()
  }

  getProportionRounded() {
    return this.constructor.roundProportion(this.getProportion())
  }

  getPercentage() {
    return this.getProportion() * 100
  }

  getPercentageRounded() {
    return this.constructor.roundPercentage(this.getPercentage())
  }
}
