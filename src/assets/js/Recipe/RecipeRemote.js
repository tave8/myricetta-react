import Recipe from "./Recipe"

/**
 * USAGE (example)
 *  new RecipeRemote({
 *         apiUrl: RECIPE_API_URL,
 *         // this property is for the super class
 *         config: {normalizeStrings: true}
 *  })
 */
export default class RecipeRemote extends Recipe {
  static API_URL = "..."

  constructor(args = {}) {
    super(args)
    if (!args.apiUrl) {
      throw new Error("must provide apiUrl param")
    }
    this.apiUrl = args.apiUrl
  }

  async addRemote() {
    const recipeToSave = this.getRecipeToSave()
    console.log(recipeToSave)
  }

  async getByIdRemote(recipeId) {
    if (!recipeId) {
      throw new Error("must provide recipeId param")
    }
    return {
      recipeId,
    }
  }
}
