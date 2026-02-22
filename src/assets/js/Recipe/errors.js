export class IngredientNameNotFoundError extends Error {
  constructor(userMessage) {
    const initialMessage = "No ingredient found with this name. "
    const finalMessage = (userMessage + initialMessage).trim()
    super(finalMessage)
  }
}

export class IngredientIdNotFoundError extends Error {
  constructor(userMessage) {
    const initialMessage = "No ingredient found with this id. "
    const finalMessage = (userMessage + initialMessage).trim()
    super(finalMessage)
  }
}

export class IngredientNameAlreadyExistsError extends Error {
  constructor(userMessage) {
    const initialMessage = "Another ingredient with this name already exists. "
    const finalMessage = (userMessage + initialMessage).trim()
    super(finalMessage)
  }
}

export class IngredientNameIsEmptyError extends Error {
  constructor(userMessage) {
    const initialMessage = "Ingredient name cannot be empty. "
    const finalMessage = (userMessage + initialMessage).trim()
    super(finalMessage)
  }
}

export class QuantityIsNotNumberError extends Error {
  constructor(userMessage) {
    const initialMessage = "Quantity is not a number. "
    const finalMessage = (userMessage + initialMessage).trim()
    super(finalMessage)
  }
}

export class NumberIsNotNumberError extends Error {
  constructor(userMessage) {
    const initialMessage = "This must be a number and it is not. "
    const finalMessage = (userMessage + initialMessage).trim()
    super(finalMessage)
  }
}
