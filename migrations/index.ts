import { Client, TablesDB, Permission, Role } from 'node-appwrite'
import { createInterface } from 'readline/promises'
import process from 'node:process'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { migrateIngredients, INGREDIENTS_TABLE_ID } from './ingredients'
import { migrateRecipes, RECIPES_TABLE_ID } from './recipes'
import { config } from 'dotenv'

// Load environment variables from project root
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (existsSync(envLocalPath)) {
  config({ path: envLocalPath })
} else {
  // Fallback to .env if .env.local is not present
  config()
}

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ''
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || ''

async function ensureTable(tablesDB: TablesDB, databaseId: string, tableId: string, name: string, migrate: () => Promise<void>) {
  const rl = process.stdin.isTTY ? createInterface({ input: process.stdin, output: process.stdout }) : null

  const exists = await tablesDB.getTable({ databaseId, tableId }).then(() => true).catch(() => false)
  if (exists) {
    let recreate = false
    if (rl) {
      const answer = (await rl.question(`Table "${tableId}" exists. Recreate it? (y/N): `)).trim().toLowerCase()
      recreate = answer === 'y' || answer === 'yes'
    }
    if (!recreate) {
      console.log(`⏭️  Skipping ${tableId} (already exists).`)
      rl?.close()
      return
    }
    console.log(`🗑️  Deleting ${tableId}...`)
    await tablesDB.deleteTable({ databaseId, tableId })
  }

  console.log(`📝 Creating ${name}...`)
  await tablesDB.createTable({
    databaseId,
    tableId,
    name,
    permissions: [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    rowSecurity: true,
  })
  await migrate()
  rl?.close()
}

async function main() {
  if (!APPWRITE_PROJECT_ID || !APPWRITE_DATABASE_ID || !APPWRITE_API_KEY) {
    console.error('Missing env. Please set NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_DATABASE_ID and APPWRITE_API_KEY')
    process.exit(1)
  }

  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID).setKey(APPWRITE_API_KEY)
  const tablesDB = new TablesDB(client)
  const databaseId = APPWRITE_DATABASE_ID

  await ensureTable(tablesDB, databaseId, INGREDIENTS_TABLE_ID, 'Ingredients', async () => {
    await migrateIngredients(tablesDB, databaseId)
  })

  await ensureTable(tablesDB, databaseId, RECIPES_TABLE_ID, 'Recipes', async () => {
    await migrateRecipes(tablesDB, databaseId)
  })

  console.log('✅ Migrations completed')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


