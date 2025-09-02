"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users, Edit } from "lucide-react"
import Link from "next/link"
import { recipesService } from "@/lib/database"
import type { Recipe } from "@/lib/types"
import { getImagePreview } from "@/lib/storage"
import { highlightMeasurements } from "@/lib/measurement-parser"

export default function RecipeDetailPage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!params.id) return

      try {
        setIsLoading(true)
        const recipeData = await recipesService.getById(params.id as string)
        setRecipe(recipeData)
      } catch (error) {
        setRecipe(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Recipe not found</h1>
          <Link href="/recipes">
            <Button>Back to Recipes</Button>
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/recipes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Recipe Details</h1>
          <Link href={`/recipes/${params.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Recipe Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Recipe Image and Basic Info */}
        <Card className="overflow-hidden pt-0">
          <img
            src={recipe.image ? getImagePreview(recipe.image, "hero") : "/placeholder.svg"}
            alt={recipe.name}
            className="w-full h-48 object-cover"
          />
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{recipe.name}</CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">{recipe.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {recipe.cookTime}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {recipe.servings} servings
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {recipe.categories?.map((c: string) => (
                <Badge key={c} variant="secondary">
                  {c}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-muted-foreground/70 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground">
                    {highlightMeasurements(ingredient)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Cooking Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cooking Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recipe.steps.map((step: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button className="w-full" size="lg">
          Start Cooking
        </Button>
      </main>
    </div>
  )
}
