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

  async getRecipeByIdAndOverrideSelf(recipeId) {
    if (!recipeId) {
      throw new Error(`Must provide recipeId. "${recipeId}" was given.`)
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const recipe = {
          id: "3234234",
          name: "Pizza Bella",
          ingredients: [
            {
              id: "1",
              name: "malto",
              quantity: 10.342,
              quantityRounded: 10.34,
            },
            {
              id: "2",
              name: "lievito",
              quantity: 10.342,
              quantityRounded: 10.34,
            },
            {
              id: "3",
              name: "acqua",
              quantity: 45,
              quantityRounded: 45,
            },
          ],
          photoUrl: "https://placehold.co/600x400",
        }
        this.overrideSelfFromObj(recipe)
        // console.log(this)
        resolve()
      }, 1000)
    })
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
