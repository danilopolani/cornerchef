import { BUCKET_ID, storage } from "./appwrite"
import { ID } from "appwrite"

export async function uploadPublicImage(file: File, userId: string): Promise<string> {
  if (!BUCKET_ID) throw new Error("Missing NEXT_PUBLIC_APPWRITE_BUCKET_ID")
  const created = await storage.createFile({
    bucketId: BUCKET_ID,
    fileId: ID.unique(),
    file,
    permissions: [
      'read("any")',
      `update("user:${userId}")`,
      `delete("user:${userId}")`,
    ],
  })
  return created.$id
}

export type ImagePreset = "thumbnail" | "hero"

export function getImagePreview(fileId: string, _preset: ImagePreset): string {
  if (!BUCKET_ID || !fileId) return "/placeholder.svg"
  // For now, avoid paid preview transformations; return raw view URL.
  // Keep the preset param for future extension.
  return storage.getFileView({
    bucketId: BUCKET_ID,
    fileId,
  })
}

export async function deleteImage(fileId: string): Promise<void> {
  if (!BUCKET_ID || !fileId) return
  try {
    await storage.deleteFile({
      bucketId: BUCKET_ID,
      fileId,
    })
  } catch {
    // Don't throw - recipe deletion should proceed even if image deletion fails
  }
}


