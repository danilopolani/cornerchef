import { tablesDB, DATABASE_ID } from "./appwrite"
import { ID, Query, Permission, Role } from "appwrite"
import type { Ingredient, Recipe } from "./types"

const INGREDIENTS_TABLE_ID = "ingredients"
const RECIPES_TABLE_ID = "recipes"

export const ingredientsService = {
  // Create a new ingredient
  async create(ingredient: Omit<Ingredient, "$id" | "$createdAt" | "$updatedAt">): Promise<Ingredient> {

    try {
      const response = await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: INGREDIENTS_TABLE_ID,
        rowId: ID.unique(),
        data: ingredient,
        permissions: [
          Permission.read(Role.user(ingredient.userId)),
          Permission.update(Role.user(ingredient.userId)),
          Permission.delete(Role.user(ingredient.userId)),
        ],
      })

      return response as unknown as Ingredient
    } catch (error) {

      throw error
    }
  },

  // Get all ingredients for a user
  async getByUserId(userId: string): Promise<Ingredient[]> {

    try {
      const response = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: INGREDIENTS_TABLE_ID,
        queries: [
          Query.equal("userId", userId),
          Query.orderDesc("$createdAt"),
        ],
      })

      return response.rows as unknown as Ingredient[]
    } catch (error) {

      throw error
    }
  },

  // Update an ingredient
  async update(id: string, ingredient: Partial<Ingredient>): Promise<Ingredient> {

    try {
      const response = await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: INGREDIENTS_TABLE_ID,
        rowId: id,
        data: ingredient,
      })

      return response as unknown as Ingredient
    } catch (error) {

      throw error
    }
  },

  // Delete an ingredient
  async delete(id: string): Promise<void> {

    try {
      await tablesDB.deleteRow({ databaseId: DATABASE_ID, tableId: INGREDIENTS_TABLE_ID, rowId: id })

    } catch (error) {

      throw error
    }
  },
}

export const recipesService = {
  // Create a new recipe
  async create(recipe: Omit<Recipe, "$id" | "$createdAt" | "$updatedAt">): Promise<Recipe> {

    try {
      const response = await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: RECIPES_TABLE_ID,
        rowId: ID.unique(),
        data: recipe,
        permissions: [
          Permission.read(Role.user(recipe.userId)),
          Permission.update(Role.user(recipe.userId)),
          Permission.delete(Role.user(recipe.userId)),
        ],
      })

      return response as unknown as Recipe
    } catch (error) {

      throw error
    }
  },

  // Get all recipes for a user
  async getByUserId(userId: string): Promise<Recipe[]> {

    try {
      const response = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: RECIPES_TABLE_ID,
        queries: [
          Query.equal("userId", userId),
          Query.orderDesc("$createdAt"),
        ],
      })

      return response.rows as unknown as Recipe[]
    } catch (error) {

      throw error
    }
  },

  // Get a recipe by ID
  async getById(id: string): Promise<Recipe> {

    try {
      const response = await tablesDB.getRow({ databaseId: DATABASE_ID, tableId: RECIPES_TABLE_ID, rowId: id })

      return response as unknown as Recipe
    } catch (error) {

      throw error
    }
  },

  // Update a recipe
  async update(id: string, recipe: Partial<Recipe>): Promise<Recipe> {

    try {
      const response = await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: RECIPES_TABLE_ID,
        rowId: id,
        data: recipe,
      })

      return response as unknown as Recipe
    } catch (error) {

      throw error
    }
  },

  // Delete a recipe
  async delete(id: string): Promise<void> {

    try {
      await tablesDB.deleteRow({ databaseId: DATABASE_ID, tableId: RECIPES_TABLE_ID, rowId: id })

    } catch (error) {

      throw error
    }
  },

  // Search recipes by name or category
  async search(userId: string, query: string, category?: string): Promise<Recipe[]> {

    try {
      const queries = [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
      ]

      if (query) {
        queries.push(Query.search("name", query))
      }

      if (category && category !== "All") {
        queries.push(Query.contains("categories", category))
      }

      const response = await tablesDB.listRows({ databaseId: DATABASE_ID, tableId: RECIPES_TABLE_ID, queries })

      return response.rows as unknown as Recipe[]
    } catch (error) {

      throw error
    }
  },
}
