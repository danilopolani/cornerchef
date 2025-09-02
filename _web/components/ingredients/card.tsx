"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle } from "lucide-react"
import type { Ingredient } from "@/lib/types"

function getExpirationStatus(expirationDate: string) {
  const today = new Date()
  const expDate = new Date(expirationDate)
  const diffTime = expDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { status: "expired", label: "Expired", color: "destructive" }
  } else if (diffDays <= 2) {
    return { status: "expiring", label: "Expires Soon", color: "secondary" }
  } else {
    return { status: "fresh", label: "Fresh", color: "default" }
  }
}

type IngredientCardProps = {
  ingredient: Ingredient
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  const expirationStatus = ingredient.expirationDate
    ? getExpirationStatus(ingredient.expirationDate)
    : { status: "fresh", label: "No expiration", color: "default" as const }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{ingredient.name}</h3>
          <p className="text-sm text-muted-foreground">
            {ingredient.quantity && ingredient.quantityType
              ? `${ingredient.quantity} ${ingredient.quantityType}`
              : ingredient.quantity
                ? `${ingredient.quantity}`
                : "No quantity specified"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={expirationStatus.color as any} className="text-xs">
            {expirationStatus.status === "expired" && <AlertTriangle className="h-3 w-3 mr-1" />}
            {expirationStatus.label}
          </Badge>
          {ingredient.category && (
            <Badge variant="outline" className="text-xs">
              {ingredient.category}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Added: {new Date(ingredient.buyDate).toLocaleDateString()}
          </div>
          {ingredient.expirationDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Expires: {new Date(ingredient.expirationDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}


