"use client"

import { Home, BookOpen, Package, ChefHat } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-around">
          <Link
            href="/"
            className={`flex flex-col items-center space-y-1 transition-colors ${
              isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className={`text-xs ${isActive("/") ? "font-medium" : ""}`}>Home</span>
          </Link>
          <Link
            href="/recipes"
            className={`flex flex-col items-center space-y-1 transition-colors ${
              isActive("/recipes") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span className={`text-xs ${isActive("/recipes") ? "font-medium" : ""}`}>Recipes</span>
          </Link>
          <Link
            href="/ingredients"
            className={`flex flex-col items-center space-y-1 transition-colors ${
              isActive("/ingredients") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-5 w-5" />
            <span className={`text-xs ${isActive("/ingredients") ? "font-medium" : ""}`}>Ingredients</span>
          </Link>
          <Link
            href="/chef"
            className="flex flex-col items-center space-y-1 transition-colors text-secondary"
          >
            <ChefHat className="h-5 w-5 text-secondary" />
            <span className="text-xs text-secondary">Chef</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
