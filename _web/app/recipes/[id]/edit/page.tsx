"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { recipesService } from "@/lib/database"
import { RecipeForm, type RecipeFormValues } from "@/components/recipes/form"
import { uploadPublicImage, deleteImage } from "@/lib/storage"

export default function EditRecipePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [initialValues, setInitialValues] = useState<RecipeFormValues | null>(null)
  const [currentRecipe, setCurrentRecipe] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        if (!params.id) return
        const recipe = await recipesService.getById(params.id as string)
        setCurrentRecipe(recipe)
        setInitialValues({
          name: recipe.name || "",
          description: recipe.description || "",
          servings: recipe.servings ? String(recipe.servings) : "",
          cookTime: recipe.cookTime || "",
          image: recipe.image || "",
          ingredients: recipe.ingredients && recipe.ingredients.length ? recipe.ingredients : [""],
          steps: recipe.steps && recipe.steps.length ? recipe.steps : [""],
          categories: recipe.categories || [],
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  const handleSave = async (values: RecipeFormValues) => {
    if (!user) return
    setSaving(true)
    try {
      let imageFileId: string | undefined
      if (values.imageFile) {
        try {
          imageFileId = await uploadPublicImage(values.imageFile, user.$id)
        } catch (e) {
          // Image upload failed, continue with existing image
        }
      }
      await recipesService.update(params.id as string, {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        servings: values.servings ? Number.parseInt(values.servings) : undefined,
        cookTime: values.cookTime?.trim() || undefined,
        image: imageFileId || values.image?.trim() || undefined,
        ingredients: values.ingredients.map((i) => i.trim()).filter(Boolean),
        steps: values.steps.map((s) => s.trim()).filter(Boolean),
        categories: values.categories.length ? values.categories : undefined,
      })
      router.push(`/recipes/${params.id}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this recipe? This cannot be undone.")) return
    setDeleting(true)
    try {
      // Delete the recipe's image from storage if it exists
      if (currentRecipe?.image) {
        await deleteImage(currentRecipe.image)
      }
      
      // Delete the recipe from database
      await recipesService.delete(params.id as string)
      router.push("/recipes")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href={`/recipes/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Edit Recipe</h1>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {initialValues && (
          <RecipeForm
            initialValues={initialValues}
            onSubmit={handleSave}
            submitLabel={saving ? "Saving..." : "Save Changes"}
            cancelHref={`/recipes/${params.id}`}
            isSubmitting={saving}
            userId={user?.$id}
          />
        )}
      </main>
    </div>
  )
}


