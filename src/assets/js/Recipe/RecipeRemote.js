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
    this.apiUrl = args.apiUrl
  }

  async add() {
    const recipeToSave = this.getRecipeToSave()
    
    return recipeToSave
  }

  async getById(recipeId) {
    if (!recipeId) {
      throw new Error("must provide recipeId param")
    }
    return {
      recipeId,
    }
  }
}
