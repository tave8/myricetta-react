import { StringIsNotStringError, NumberIsNotNumberError } from "./errors"

/**
 * Helper class for Recipe and Ingredient.
 * Here go static methods only.
 * Usage inside of Recipe and Ingredient instances:
 *  this.constructor.helperMethod()
 * example:
 *  this.constructor.isNumber(57)
 */
export default class Helper {
  /**
   * Default format: lowercase with no lateral whitespace
   * Example:
   *    " Good Pizza" --> "good pizza"
   */
  static normalizeString(x) {
    if (!this.isString(x)) {
      throw new StringIsNotStringError(`During normalizing input to string, param "${x}" is expected to be string, 
                                      it is of type "${typeof x}" instead.`)
    }
    return x.trim().toLowerCase()
  }

  /**
   * Input type: string that can be converted to number type, or number type.
   *     4  -->  4  (number to number)
   *    "4" -->  4  (string to number)
   */
  static normalizeNumber(x) {
    const y = parseFloat(x)
    if (!this.isNumber(y)) {
      throw new NumberIsNotNumberError(`During normalizing input to number, param "${x}" is expected to be number, 
                                       it is of type "${typeof x}" instead.`)
    }
    return y
  }

  static isNumber(x) {
    return Number.isFinite(x)
  }

  static isValidIngredientName(x) {
    return this.isString(x) && !this.isEmptyString(x)
  }

  static isValidRecipeName(x) {
    return this.isString(x) && !this.isEmptyString(x)
  }

  static isString(x) {
    return typeof x == "string"
  }

  static isEmptyString(x) {
    if (!this.isString(x)) {
      throw new StringIsNotStringError(`String expected, but param "${x}" is of type "${typeof x}" instead.`)
    }
    return x.trim() == ""
  }

  /**
   * Round a number by n digits
   * Example: 
        1.234  -->  1.23
        1.235  -->  1.24
        1.236  -->  1.24
   */
  static roundNumber(num, nDigits, throwsIfNotNumber = true) {
    if (!this.isNumber(num) && throwsIfNotNumber) {
      throw new NumberIsNotNumberError(`Param "number" with value "${num}" must be a number and it is not. It is of type "${typeof num}" instead.`)
    }
    if (!this.isNumber(nDigits) && throwsIfNotNumber) {
      throw new NumberIsNotNumberError(
        `Param "number of digits" with value "${num}" must be a number and it is not. It is of type "${typeof nDigits}" instead.`,
      )
    }
    return parseFloat(num.toFixed(nDigits))
  }

  /**
   * Round a proportion.
   * Default number of rounded digits: 4
   * Example:
   *    1.236432  -->  1.2364
   */
  static roundProportion(x, throwsIfNotNumber = true) {
    return this.roundNumber(x, 4, throwsIfNotNumber)
  }

  /**
   * Round a percentage.
   * Default number of rounded digits: 2
   * Example:
   *    1.236432  -->  1.24
   */
  static roundPercentage(x, throwsIfNotNumber = true) {
    return this.roundNumber(x, 2, throwsIfNotNumber)
  }

  /**
   * Round a quantity.
   * Default number of rounded digits: 2
   * Example:
   *    1.236432  -->  1.24
   */
  static roundQuantity(x, throwsIfNotNumber = true) {
    return this.roundNumber(x, 2, throwsIfNotNumber)
  }

  /**
   * Returns a random id.
   * You can prefix it for easier recognition.
   */
  static generateId(prefix = "") {
    const randNum = Math.floor(Math.random() * 100000000)
    return `${prefix}${randNum}`
  }
}
