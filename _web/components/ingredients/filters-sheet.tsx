"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const categories = ["All", "Protein", "Vegetables", "Dairy", "Pantry", "Herbs", "Fruits", "Grains"]
const locations: never[] = []

interface IngredientsFiltersSheetProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedExpirationStatus: string[]
  setSelectedExpirationStatus: (status: string[]) => void
  expiringSoonCount: number
  expiredCount: number
  children: React.ReactNode
}

export function IngredientsFiltersSheet({
  selectedCategory,
  setSelectedCategory,
  selectedExpirationStatus,
  setSelectedExpirationStatus,
  expiringSoonCount,
  expiredCount,
  children,
}: IngredientsFiltersSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleExpirationStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedExpirationStatus([...selectedExpirationStatus, status])
    } else {
      setSelectedExpirationStatus(selectedExpirationStatus.filter((s) => s !== status))
    }
  }

  const clearAllFilters = () => {
    setSelectedCategory("All")
    setSelectedExpirationStatus([])
    setIsOpen(false)
  }

  const activeFiltersCount = (selectedCategory !== "All" ? 1 : 0) + selectedExpirationStatus.length

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-center">Filters</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-4">
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Category</h3>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by category" />
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

          {/* Detailed Expiration Status */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Expiration Status</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="fresh"
                  checked={selectedExpirationStatus.includes("fresh")}
                  onCheckedChange={(checked) => handleExpirationStatusChange("fresh", checked as boolean)}
                />
                <label htmlFor="fresh" className="text-sm text-foreground font-medium">
                  Fresh
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="expiring"
                  checked={selectedExpirationStatus.includes("expiring")}
                  onCheckedChange={(checked) => handleExpirationStatusChange("expiring", checked as boolean)}
                />
                <label htmlFor="expiring" className="text-sm text-orange-600 font-medium">
                  Expiring Soon
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="expired"
                  checked={selectedExpirationStatus.includes("expired")}
                  onCheckedChange={(checked) => handleExpirationStatusChange("expired", checked as boolean)}
                />
                <label htmlFor="expired" className="text-sm text-red-600 font-medium">
                  Expired
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="flex-1 bg-transparent"
              disabled={activeFiltersCount === 0}
            >
              Clear All
            </Button>
            <Button onClick={() => setIsOpen(false)} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


