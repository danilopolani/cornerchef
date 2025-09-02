import { TablesDB } from 'node-appwrite'
// Importing enum via path can fail in CJS/ESM; use literal strings for type

export const INGREDIENTS_TABLE_ID = 'ingredients'

export async function migrateIngredients(tablesDB: TablesDB, databaseId: string) {
  // Columns
  await tablesDB.createStringColumn({ databaseId, tableId: INGREDIENTS_TABLE_ID, key: 'name', size: 255, required: true })
  await tablesDB.createStringColumn({ databaseId, tableId: INGREDIENTS_TABLE_ID, key: 'buyDate', size: 50, required: true })
  await tablesDB.createStringColumn({ databaseId, tableId: INGREDIENTS_TABLE_ID, key: 'userId', size: 50, required: true })
  await tablesDB.createStringColumn({ databaseId, tableId: INGREDIENTS_TABLE_ID, key: 'category', size: 100, required: false })
  await tablesDB.createStringColumn({ databaseId, tableId: INGREDIENTS_TABLE_ID, key: 'quantityType', size: 50, required: false })
  await tablesDB.createStringColumn({ databaseId, tableId: INGREDIENTS_TABLE_ID, key: 'expirationDate', size: 50, required: false })
  await tablesDB.createIntegerColumn({ databaseId, tableId: INGREDIENTS_TABLE_ID, key: 'quantity', required: false, min: 0, max: 10000 })

  // Give Appwrite time to process columns before indexing
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Indexes
  await tablesDB.createIndex({ databaseId, tableId: INGREDIENTS_TABLE_ID, key: 'ingredients_userId_index', type: 'key' as any, columns: ['userId'], orders: [] })
  await tablesDB.createIndex({ databaseId, tableId: INGREDIENTS_TABLE_ID, key: 'ingredients_category_index', type: 'key' as any, columns: ['category'], orders: [] })
  await tablesDB.createIndex({ databaseId, tableId: INGREDIENTS_TABLE_ID, key: 'ingredients_name_search', type: 'fulltext' as any, columns: ['name'], orders: [] })
}


