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

  /**
   * Search my recipes
   */
  async searchMyRecipes(searchQuery) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const fakeRecipes = [
          { name: "pizza buona", id: "1" },
          { name: "pizza2", id: "2" },
          { name: "pizzaccc", id: "3" },
        ]
        // reject(new Error("failed bebi"))
        resolve(fakeRecipes)
      }, 1000)
    })
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
