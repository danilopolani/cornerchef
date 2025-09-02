"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IngredientCard } from "@/components/ingredients/card"
import { Search, Plus, Package, Calendar, AlertTriangle, Filter, CheckCircle } from "lucide-react"
import { AddIngredientSheet } from "@/components/ingredients/add-sheet"
import { IngredientsFiltersSheet } from "@/components/ingredients/filters-sheet"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ingredientsService } from "@/lib/database"
import type { Ingredient } from "@/lib/types"

const categories = ["All", "Protein", "Vegetables", "Dairy", "Pantry", "Herbs", "Fruits", "Grains"]
// location concept removed

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

export default function IngredientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  // location concept removed
  const [selectedExpirationStatus, setSelectedExpirationStatus] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const fetchIngredients = async () => {
    if (!user) {
      setIngredients([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const userIngredients = await ingredientsService.getByUserId(user.$id)
      setIngredients(userIngredients)
    } catch (error) {
      setIngredients([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIngredients()
  }, [user])

  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || ingredient.category === selectedCategory
    const matchesLocation = true

    if (!ingredient.expirationDate) return matchesSearch && matchesCategory && matchesLocation

    const expirationStatus = getExpirationStatus(ingredient.expirationDate).status
    const matchesExpirationStatus =
      selectedExpirationStatus.length === 0 || selectedExpirationStatus.includes(expirationStatus)
    return matchesSearch && matchesCategory && matchesLocation && matchesExpirationStatus
  })

  const expiringSoonCount = ingredients.filter(
    (ingredient) => ingredient.expirationDate && getExpirationStatus(ingredient.expirationDate).status === "expiring",
  ).length

  const expiredCount = ingredients.filter(
    (ingredient) => ingredient.expirationDate && getExpirationStatus(ingredient.expirationDate).status === "expired",
  ).length

  const activeFiltersCount = (selectedCategory !== "All" ? 1 : 0) + selectedExpirationStatus.length

  const handleExpiringClick = () => {
    if (selectedExpirationStatus.includes("expiring")) {
      setSelectedExpirationStatus(selectedExpirationStatus.filter((status) => status !== "expiring"))
    } else {
      setSelectedExpirationStatus([...selectedExpirationStatus, "expiring"])
    }
  }

  const handleExpiredClick = () => {
    if (selectedExpirationStatus.includes("expired")) {
      setSelectedExpirationStatus(selectedExpirationStatus.filter((status) => status !== "expired"))
    } else {
      setSelectedExpirationStatus([...selectedExpirationStatus, "expired"])
    }
  }

  const handleAddIngredientClick = () => {
    if (!user) {
      setShowAuthModal(true)
    }
    // If user is authenticated, the AddIngredientSheet will open normally
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Ingredients</h1>
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={(user.prefs as any)?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-medium">
                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <div className="max-w-md mx-auto px-4">
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <IngredientsFiltersSheet
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedExpirationStatus={selectedExpirationStatus}
            setSelectedExpirationStatus={setSelectedExpirationStatus}
            expiringSoonCount={expiringSoonCount}
            expiredCount={expiredCount}
          >
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </div>
              )}
            </Button>
          </IngredientsFiltersSheet>
        </div>

        <div className="flex items-center justify-center gap-8 mb-6">
          <button
            onClick={handleExpiringClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              selectedExpirationStatus.includes("expiring")
                ? "bg-slate-100 dark:bg-slate-800"
                : "hover:bg-slate-50 dark:hover:bg-slate-900"
            }`}
          >
            {expiringSoonCount === 0 ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            )}
            <span className={`text-sm font-medium ${expiringSoonCount === 0 ? "text-emerald-600" : "text-orange-600"}`}>
              {expiringSoonCount} expiring soon
            </span>
          </button>

          <div className="h-4 w-px bg-border"></div>

          <button
            onClick={handleExpiredClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              selectedExpirationStatus.includes("expired")
                ? "bg-slate-100 dark:bg-slate-800"
                : "hover:bg-slate-50 dark:hover:bg-slate-900"
            }`}
          >
            {expiredCount === 0 ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${expiredCount === 0 ? "text-emerald-600" : "text-red-600"}`}>
              {expiredCount} expired
            </span>
          </button>
        </div>

        {/* Ingredients List */}
        <div className="space-y-3 pb-4">
          {isLoading ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Loading ingredients...</p>
            </div>
          ) : filteredIngredients.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {ingredients.length === 0 ? "No ingredients added yet" : "No ingredients found"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {ingredients.length === 0
                  ? "Add your first ingredient to get started"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            filteredIngredients.map((ingredient) => (
              <IngredientCard key={ingredient.$id} ingredient={ingredient} />
            ))
          )}
        </div>

        <div className="fixed bottom-22 right-4 z-10">
          {user ? (
            <AddIngredientSheet onIngredientAdded={fetchIngredients}>
              <Button size="lg" className="rounded-full h-12 w-12 shadow-lg">
                <Plus className="h-5 w-5" />
              </Button>
            </AddIngredientSheet>
          ) : (
            <Button size="lg" className="rounded-full h-12 w-12 shadow-lg" onClick={handleAddIngredientClick}>
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>

        <AuthModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
          onSuccess={() => {
            // Could trigger add ingredient sheet here if needed
          }}
        />

        <BottomNavigation />
      </div>
    </div>
  )
}
