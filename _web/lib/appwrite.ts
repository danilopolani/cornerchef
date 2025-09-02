import { Client, Account, TablesDB, ID, Storage } from "appwrite"

const client = new Client()


client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

export const account = new Account(client)
export const tablesDB = new TablesDB(client)
export const storage = new Storage(client)

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ""
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || ""

export { ID }
