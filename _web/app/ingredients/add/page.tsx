"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const categories = ["Protein", "Vegetables", "Dairy", "Pantry", "Herbs", "Fruits", "Grains", "Spices", "Condiments"]

export default function AddIngredientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    buyDate: new Date().toISOString().split("T")[0],
    expirationDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the ingredient to your database

    router.push("/ingredients")
  }

  const suggestExpirationDate = (category: string) => {
    const today = new Date()
    let daysToAdd = 7 // default

    switch (category) {
      case "Protein":
        daysToAdd = 3
        break
      case "Vegetables":
        daysToAdd = 7
        break
      case "Dairy":
        daysToAdd = 10
        break
      case "Herbs":
        daysToAdd = 5
        break
      case "Fruits":
        daysToAdd = 5
        break
      case "Pantry":
      case "Grains":
      case "Spices":
      case "Condiments":
        daysToAdd = 365
        break
    }

    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + daysToAdd)
    return expirationDate.toISOString().split("T")[0]
  }

  const handleCategoryChange = (category: string) => {
    setFormData({
      ...formData,
      category,
      expirationDate: suggestExpirationDate(category),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/ingredients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Add Ingredient</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Form */}
      <main className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ingredient Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Ingredient Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Fresh Salmon Fillet"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 2 lbs, 1 bag, 500ml"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="buyDate">Date Added</Label>
                <Input
                  id="buyDate"
                  type="date"
                  value={formData.buyDate}
                  onChange={(e) => setFormData({ ...formData, buyDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Link href="/ingredients" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="flex-1">
              Add Ingredient
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
