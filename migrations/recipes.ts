import { TablesDB } from 'node-appwrite'
// Importing enum via path can fail in CJS/ESM; use literal strings for type

export const RECIPES_TABLE_ID = 'recipes'

export async function migrateRecipes(tablesDB: TablesDB, databaseId: string) {
  // Columns
  await tablesDB.createStringColumn({ databaseId, tableId: RECIPES_TABLE_ID, key: 'name', size: 255, required: true })
  await tablesDB.createStringColumn({ databaseId, tableId: RECIPES_TABLE_ID, key: 'description', size: 1000, required: false })
  await tablesDB.createStringColumn({ databaseId, tableId: RECIPES_TABLE_ID, key: 'cookTime', size: 50, required: false })
  await tablesDB.createStringColumn({ databaseId, tableId: RECIPES_TABLE_ID, key: 'image', size: 500, required: false })
  await tablesDB.createStringColumn({ databaseId, tableId: RECIPES_TABLE_ID, key: 'userId', size: 50, required: true })
  await tablesDB.createIntegerColumn({ databaseId, tableId: RECIPES_TABLE_ID, key: 'servings', required: false, min: 1, max: 100 })
  await tablesDB.createStringColumn({ databaseId, tableId: RECIPES_TABLE_ID, key: 'ingredients', size: 500, required: true, array: true })
  await tablesDB.createStringColumn({ databaseId, tableId: RECIPES_TABLE_ID, key: 'steps', size: 1000, required: true, array: true })
  await tablesDB.createStringColumn({ databaseId, tableId: RECIPES_TABLE_ID, key: 'categories', size: 100, required: false, array: true })

  // Wait for columns to be processed
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Indexes
  await tablesDB.createIndex({ databaseId, tableId: RECIPES_TABLE_ID, key: 'userId_index', type: 'key' as any, columns: ['userId'], orders: [] })
  await tablesDB.createIndex({ databaseId, tableId: RECIPES_TABLE_ID, key: 'name_search', type: 'fulltext' as any, columns: ['name'], orders: [] })
  await tablesDB.createIndex({ databaseId, tableId: RECIPES_TABLE_ID, key: 'categories_index', type: 'key' as any, columns: ['categories'], orders: [] })
}


