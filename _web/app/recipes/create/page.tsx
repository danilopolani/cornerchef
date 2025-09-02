"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { recipesService } from "@/lib/database"
import { RecipeForm, type RecipeFormValues } from "@/components/recipes/form"
import { uploadPublicImage } from "@/lib/storage"

export default function CreateRecipePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async (values: RecipeFormValues) => {
    if (!user) {
      return
    }
    let imageFileId: string | undefined
    if (values.imageFile) {
      try {
        imageFileId = await uploadPublicImage(values.imageFile, user.$id)
      } catch (e) {
        // Image upload failed, continue without image
      }
    }
    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      servings: values.servings ? Number.parseInt(values.servings) : undefined,
      cookTime: values.cookTime?.trim() || undefined,
      image: imageFileId || values.image?.trim() || undefined,
      ingredients: values.ingredients.map((i) => i.trim()).filter((i) => i.length > 0),
      steps: values.steps.map((s) => s.trim()).filter((s) => s.length > 0),
      categories: values.categories.length ? values.categories : undefined,
      userId: user.$id,
    }
    setIsSubmitting(true)
    try {
      const created = await recipesService.create(payload as any)
      router.push(`/recipes/${created.$id}`)
    } catch (err) {
      // Recipe creation failed
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/recipes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Create Recipe</h1>
          <div className="w-8"></div>
        </div>
      </header>
      <main className="max-w-md mx-auto px-4 py-6">
        <RecipeForm
          onSubmit={handleCreate}
          submitLabel={isSubmitting ? "Saving..." : "Save Recipe"}
          cancelHref="/recipes"
          isSubmitting={isSubmitting}
          userId={user?.$id}
        />
      </main>
    </div>
  )
}
