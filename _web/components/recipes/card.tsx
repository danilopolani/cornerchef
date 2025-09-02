"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import type { Recipe } from "@/lib/types"
import { getImagePreview } from "@/lib/storage"

type RecipeCardProps = {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.$id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer p-0">
        <div className="flex">
          <div className="w-2/6">
            <img
              src={recipe.image ? getImagePreview(recipe.image, "thumbnail") : "/placeholder.svg"}
              alt={recipe.name}
              className="w-full h-full object-cover bg-muted"
            />
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground line-clamp-1">{recipe.name}</h3>
              {recipe.categories?.length ? (
                <div className="ml-2 flex gap-1 flex-wrap">
                  {recipe.categories.slice(0, 2).map((c: string) => (
                    <Badge key={c} variant="secondary" className="text-xs">
                      {c}
                    </Badge>
                  ))}
                  {recipe.categories.length > 2 && (
                    <Badge variant="outline" className="text-xs">+{recipe.categories.length - 2}</Badge>
                  )}
                </div>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{recipe.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {recipe.cookTime}
              </div>
              <div className="flex items-center gap-1 ">
                <Users className="h-3 w-3" />
                {recipe.servings} servings
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}


