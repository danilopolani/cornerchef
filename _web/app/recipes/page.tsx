"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen } from "lucide-react"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { recipesService } from "@/lib/database"
import type { Recipe } from "@/lib/types"
import { RecipeCard } from "@/components/recipes/card"

// Categories for filtering

const categories = ["All", "Healthy", "Sweet", "Protein", "Seafood", "Asian", "Italian", "Mexican"]

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Fetch recipes when user changes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) {
        setRecipes([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const userRecipes = await recipesService.getByUserId(user.$id)
        setRecipes(userRecipes)
      } catch (error) {
        setRecipes([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipes()
  }, [user])

  // Filter recipes based on search and category
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    const recipeCategories = recipe.categories || []
    const matchesCategory = selectedCategory === "All" || recipeCategories.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Recipes</h1>
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

      {/* Search and Filter */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recipes Grid */}
      <main className="max-w-md mx-auto px-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading recipes...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recipes found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filters"
                : "Create your first recipe to get started"}
            </p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => <RecipeCard key={recipe.$id} recipe={recipe} />)
        )}
      </main>

      <div className="fixed bottom-22 right-4 z-10">
        {user ? (
          <Link href="/recipes/create">
            <Button size="lg" className="rounded-full h-12 w-12 shadow-lg">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        ) : (
          <Button size="lg" className="rounded-full h-12 w-12 shadow-lg" onClick={() => setShowAuthModal(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </div>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => {
          // Modal will close automatically
        }}
      />

      <BottomNavigation />
    </div>
  )
}
