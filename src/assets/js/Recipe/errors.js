export class StringIsNotStringError extends Error {
  constructor(userMessage = "") {
    let newUserMessage = userMessage
    if (userMessage == null || userMessage == undefined) {
      newUserMessage = "<user message was nully>"
    }
    const initialMessage = "A generic element must be a string and it is not. "
    const finalMessage = (newUserMessage.toString() + initialMessage).trim()
    super(finalMessage)
  }
}

export class IngredientNameNotFoundError extends Error {
  constructor(userMessage = "") {
    let newUserMessage = userMessage
    if (userMessage == null || userMessage == undefined) {
      newUserMessage = "<user message was nully>"
    }
    const initialMessage = "No ingredient found with this name. "
    const finalMessage = (newUserMessage.toString() + initialMessage).trim()
    super(finalMessage)
  }
}

export class IngredientIdNotFoundError extends Error {
  constructor(userMessage = "") {
    let newUserMessage = userMessage
    if (userMessage == null || userMessage == undefined) {
      newUserMessage = "<user message was nully>"
    }
    const initialMessage = "No ingredient found with this id. "
    const finalMessage = (newUserMessage.toString() + initialMessage).trim()
    super(finalMessage)
  }
}

export class IngredientNameAlreadyExistsError extends Error {
  constructor(userMessage = "") {
    let newUserMessage = userMessage
    if (userMessage == null || userMessage == undefined) {
      newUserMessage = "<user message was nully>"
    }
    const initialMessage = "Another ingredient with this name already exists. "
    const finalMessage = (newUserMessage.toString() + initialMessage).trim()
    super(finalMessage)
  }
}

export class IngredientNameIsNotValidError extends Error {
  constructor(userMessage = "") {
    let newUserMessage = userMessage
    if (userMessage == null || userMessage == undefined) {
      newUserMessage = "<user message was nully>"
    }
    const initialMessage = "Ingredient name is not valid. "
    const finalMessage = (newUserMessage.toString() + initialMessage).trim()
    super(finalMessage)
  }
}

export class QuantityIsNotValidError extends Error {
  constructor(userMessage = "") {
    let newUserMessage = userMessage
    if (userMessage == null || userMessage == undefined) {
      newUserMessage = "<user message was nully>"
    }
    const initialMessage = "Quantity is not valid. "
    const finalMessage = (newUserMessage.toString() + initialMessage).trim()
    super(finalMessage)
  }
}

export class NumberIsNotNumberError extends Error {
  constructor(userMessage = "") {
    let newUserMessage = userMessage
    if (userMessage == null || userMessage == undefined) {
      newUserMessage = "<user message was nully>"
    }
    const initialMessage = "This must be a number and it is not. "
    const finalMessage = (newUserMessage.toString() + initialMessage).trim()
    super(finalMessage)
  }
}

export class RecipeNameIsNotValidError extends Error {
  constructor(userMessage = "") {
    let newUserMessage = userMessage
    if (userMessage == null || userMessage == undefined) {
      newUserMessage = "<user message was nully>"
    }
    const initialMessage = "Recipe name is not valid. "
    const finalMessage = (newUserMessage.toString() + initialMessage).trim()
    super(finalMessage)
  }
}

export class RecipeHasNoIngredientsError extends Error {
  constructor(userMessage = "") {
    let newUserMessage = userMessage
    if (userMessage == null || userMessage == undefined) {
      newUserMessage = "<user message was nully>"
    }
    const initialMessage = "Recipe must have at least 1 ingredient. "
    const finalMessage = (newUserMessage.toString() + initialMessage).trim()
    super(finalMessage)
  }
}
