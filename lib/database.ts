import { Databases, ID, Query, Permission, Role } from 'react-native-appwrite';
import { client } from './appwrite';
import { APPWRITE_CONFIG } from '@/constants/Config';
import type { Ingredient, Recipe } from './types';

// Initialize Databases service
const databases = new Databases(client);

const INGREDIENTS_TABLE_ID = "ingredients";
const RECIPES_TABLE_ID = "recipes";

export const ingredientsService = {
  // Create a new ingredient
  async create(ingredient: Omit<Ingredient, "$id" | "$createdAt" | "$updatedAt">): Promise<Ingredient> {
    try {
      const response = await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        INGREDIENTS_TABLE_ID,
        ID.unique(),
        ingredient,
        [
          Permission.read(Role.user(ingredient.userId)),
          Permission.update(Role.user(ingredient.userId)),
          Permission.delete(Role.user(ingredient.userId)),
        ]
      );

      return response as unknown as Ingredient;
    } catch (error) {
      console.error('Failed to create ingredient:', error);
      throw error;
    }
  },

  // Get all ingredients for a user
  async getByUserId(userId: string): Promise<Ingredient[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        INGREDIENTS_TABLE_ID,
        [
          Query.equal("userId", userId),
          Query.orderDesc("$createdAt"),
        ]
      );

      return response.documents as unknown as Ingredient[];
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
      throw error;
    }
  },

  // Update an ingredient
  async update(id: string, ingredient: Partial<Ingredient>): Promise<Ingredient> {
    try {
      const response = await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        INGREDIENTS_TABLE_ID,
        id,
        ingredient
      );

      return response as unknown as Ingredient;
    } catch (error) {
      console.error('Failed to update ingredient:', error);
      throw error;
    }
  },

  // Delete an ingredient
  async delete(id: string): Promise<void> {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        INGREDIENTS_TABLE_ID,
        id
      );
    } catch (error) {
      console.error('Failed to delete ingredient:', error);
      throw error;
    }
  },
};

export const recipesService = {
  // Create a new recipe
  async create(recipe: Omit<Recipe, "$id" | "$createdAt" | "$updatedAt">): Promise<Recipe> {
    try {
      const response = await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        RECIPES_TABLE_ID,
        ID.unique(),
        recipe,
        [
          Permission.read(Role.user(recipe.userId)),
          Permission.update(Role.user(recipe.userId)),
          Permission.delete(Role.user(recipe.userId)),
        ]
      );

      return response as unknown as Recipe;
    } catch (error) {
      console.error('Failed to create recipe:', error);
      throw error;
    }
  },

  // Get all recipes for a user
  async getByUserId(userId: string): Promise<Recipe[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        RECIPES_TABLE_ID,
        [
          Query.equal("userId", userId),
          Query.orderDesc("$createdAt"),
        ]
      );

      return response.documents as unknown as Recipe[];
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      throw error;
    }
  },

  // Get a recipe by ID
  async getById(id: string): Promise<Recipe> {
    try {
      const response = await databases.getDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        RECIPES_TABLE_ID,
        id
      );

      return response as unknown as Recipe;
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
      throw error;
    }
  },

  // Update a recipe
  async update(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
    try {
      const response = await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        RECIPES_TABLE_ID,
        id,
        recipe
      );

      return response as unknown as Recipe;
    } catch (error) {
      console.error('Failed to update recipe:', error);
      throw error;
    }
  },

  // Delete a recipe
  async delete(id: string): Promise<void> {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        RECIPES_TABLE_ID,
        id
      );
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      throw error;
    }
  },

  // Search recipes by name or category
  async search(userId: string, query: string, category?: string): Promise<Recipe[]> {
    try {
      const queries = [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
      ];

      if (query) {
        queries.push(Query.search("name", query));
      }

      if (category && category !== "All") {
        queries.push(Query.contains("categories", category));
      }

      const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        RECIPES_TABLE_ID,
        queries
      );

      return response.documents as unknown as Recipe[];
    } catch (error) {
      console.error('Failed to search recipes:', error);
      throw error;
    }
  },
};
