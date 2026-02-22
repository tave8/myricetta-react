import { NumberIsNotNumberError } from "./errors"

/**
 * Helper class for Recipe and Ingredient.
 * Here go static methods only.
 * Usage inside of Recipe and Ingredient instances:
 *  this.constructor.helperMethod()
 * example:
 *  this.constructor.isNumber(57)
 */
export default class Helper {
  static isNumber(x) {
    return Number.isFinite(x)
  }

  // static isEmptyString(x) {
  //   const isString = typeof x == "string"
  //   if (!isString) {
  //     return false
  //   }
  //   const isEmpty = x.trim() == ""
  //   return isEmpty
  // }

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
