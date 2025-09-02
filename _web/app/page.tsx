"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChefHat, BookOpen, Package, MessageCircle } from "lucide-react"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock recipe data
const mockRecipes = {
  breakfast: [
    {
      id: 1,
      name: "Avocado Toast with Poached Egg",
      image: "/avocado-toast-poached-egg.png",
      cookTime: "15 min",
      servings: 2,
      category: "Healthy",
    },
    {
      id: 2,
      name: "Blueberry Pancakes",
      image: "/fluffy-blueberry-pancakes.png",
      cookTime: "20 min",
      servings: 4,
      category: "Sweet",
    },
  ],
  lunch: [
    {
      id: 3,
      name: "Mediterranean Quinoa Bowl",
      image: "/mediterranean-quinoa-bowl.png",
      cookTime: "25 min",
      servings: 2,
      category: "Healthy",
    },
    {
      id: 4,
      name: "Grilled Chicken Caesar Salad",
      image: "/grilled-chicken-caesar.png",
      cookTime: "30 min",
      servings: 2,
      category: "Protein",
    },
  ],
  dinner: [
    {
      id: 5,
      name: "Herb-Crusted Salmon",
      image: "/herb-crusted-salmon-with-vegetables.png",
      cookTime: "35 min",
      servings: 4,
      category: "Seafood",
    },
    {
      id: 6,
      name: "Beef Stir Fry",
      image: "/colorful-beef-stir-fry-with-vegetables.png",
      cookTime: "20 min",
      servings: 3,
      category: "Asian",
    },
  ],
}

function getCurrentMealType() {
  const hour = new Date().getHours()

  if (hour < 10) {
    return "breakfast"
  } else if (hour < 14) {
    return "lunch"
  } else {
    return "dinner"
  }
}

function getRandomRecipe(mealType: keyof typeof mockRecipes) {
  const recipes = mockRecipes[mealType]
  return recipes[Math.floor(Math.random() * recipes.length)]
}

export default function HomePage() {
  const [currentRecipe, setCurrentRecipe] = useState<any>(null)
  const [mealType, setMealType] = useState("")
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const meal = getCurrentMealType()
    setMealType(meal)
    setCurrentRecipe(getRandomRecipe(meal))
  }, [])

  const refreshRecipe = () => {
    setCurrentRecipe(getRandomRecipe(mealType as keyof typeof mockRecipes))
  }

  if (!currentRecipe) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            Private Chef
          </h1>
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.prefs?.avatar || "/placeholder.svg"} />
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

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Current Meal Suggestion */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground capitalize">Suggested for {mealType}</h2>
            <Button variant="outline" size="sm" onClick={refreshRecipe}>
              Refresh
            </Button>
          </div>

          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={currentRecipe.image || "/placeholder.svg"}
                alt={currentRecipe.name}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                {currentRecipe.category}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{currentRecipe.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {currentRecipe.cookTime}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {currentRecipe.servings} servings
                </div>
              </div>
              <Link href={`/recipes/${currentRecipe.id}`}>
                <Button className="w-full">Start Cooking</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/recipes">
              <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Browse Recipes</span>
                </div>
              </Card>
            </Link>
            <Link href="/ingredients">
              <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Package className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">My Ingredients</span>
                </div>
              </Card>
            </Link>
          </div>

          <Link href="/chef">
            <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Ask AI Chef</span>
                <span className="text-xs text-muted-foreground">Get cooking help and recipe suggestions</span>
              </div>
            </Card>
          </Link>
        </div>
      </main>

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
