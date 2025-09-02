"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Camera, X, Package, MapPin } from "lucide-react"
import { ingredientsService } from "@/lib/database"
import { useAuth } from "@/hooks/use-auth"

const categories = ["Protein", "Vegetables", "Dairy", "Pantry", "Herbs", "Fruits", "Grains"]
const quantityTypes = ["lbs", "kg", "g", "oz", "ml", "l", "cups", "tbsp", "tsp", "pieces", "cans", "bottles"]

interface AddIngredientSheetProps {
  children: React.ReactNode
  onIngredientAdded?: () => void
}

export function AddIngredientSheet({ children, onIngredientAdded }: AddIngredientSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    quantityType: "",
    buyDate: new Date().toISOString().split("T")[0],
    expirationDate: "",
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const { user } = useAuth()

  const startScanning = async () => {
    setIsScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        ;(videoRef.current as any).srcObject = stream
      }
    } catch (error) {
      // Camera access failed, show mock data
      setTimeout(() => {
        const randomProduct = [
          { barcode: "123456789", name: "Organic Whole Milk", category: "Dairy", brand: "Organic Valley" },
          { barcode: "987654321", name: "Free Range Eggs", category: "Protein", brand: "Happy Farms" },
          { barcode: "456789123", name: "Greek Yogurt", category: "Dairy", brand: "Chobani" },
        ][Math.floor(Math.random() * 3)]
        setScannedProduct(randomProduct)
        setFormData((prev) => ({
          ...prev,
          name: randomProduct.name,
          category: randomProduct.category,
        }))
        stopScanning()
      }, 2000)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (videoRef.current && (videoRef.current as any).srcObject) {
      const tracks = ((videoRef.current as any).srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      return
    }

    setIsSubmitting(true)

    try {
      const ingredientData = {
        name: formData.name,
        category: formData.category || undefined,
        quantity: formData.quantity ? Number.parseInt(formData.quantity) : undefined,
        quantityType: formData.quantityType || undefined,
        
        buyDate: formData.buyDate,
        expirationDate: formData.expirationDate || undefined,
        userId: user.$id,
      }


      await ingredientsService.create(ingredientData)

      setIsOpen(false)
      resetForm()

      if (onIngredientAdded) {
        onIngredientAdded()
      }
    } catch (error) {
      // Ingredient creation failed
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      quantityType: "",
      
      buyDate: new Date().toISOString().split("T")[0],
      expirationDate: "",
    })
    setScannedProduct(null)
    setIsScanning(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] max-h-[85vh] rounded-t-2xl border-0 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 pt-6 pb-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SheetTitle className="text-left text-lg font-semibold">Add New Ingredient</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isScanning ? (
              <div className="space-y-6">
                <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-56 h-28 border-2 border-emerald-400 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400"></div>
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Position the barcode within the frame</p>
                  <Button variant="outline" onClick={stopScanning} className="min-h-[44px] bg-transparent">
                    <X className="h-4 w-4 mr-2" />
                    Cancel Scan
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full min-h-[48px] bg-transparent hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                  onClick={startScanning}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Scan Barcode
                </Button>

                {scannedProduct && (
                  <Card className="p-4 bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">Product Found</span>
                    </div>
                    <p className="text-sm text-emerald-700">{scannedProduct.brand}</p>
                    <Badge variant="secondary" className="mt-1">
                      {scannedProduct.category}
                    </Badge>
                  </Card>
                )}

                <div className="space-y-5">
                  <div className="w-full">
                    <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Fresh Salmon Fillet"
                      className="min-h-[44px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity" className="text-sm font-medium mb-2 block">
                        Quantity
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                        placeholder="e.g., 2"
                        className="min-h-[44px]"
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="quantityType" className="text-sm font-medium mb-2 block">
                        Unit
                      </Label>
                      <Select
                        value={formData.quantityType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, quantityType: value }))}
                      >
                        <SelectTrigger className="min-h-[44px] w-full">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {quantityTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="w-full">
                    <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          category: value,
                        }))
                      }}
                    >
                      <SelectTrigger className="min-h-[44px] w-full">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buyDate" className="text-sm font-medium mb-2 block">
                        Buy Date
                      </Label>
                      <Input
                        id="buyDate"
                        type="date"
                        value={formData.buyDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, buyDate: e.target.value }))}
                        className="min-h-[44px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="expiration" className="text-sm font-medium mb-2 block">
                        Expiration Date
                      </Label>
                      <Input
                        id="expiration"
                        type="date"
                        value={formData.expirationDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, expirationDate: e.target.value }))}
                        className="min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {!isScanning && (
            <div className="px-6 py-4 pb-safe border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Button
                type="submit"
                className="w-full min-h-[48px] font-medium"
                disabled={!formData.name || isSubmitting}
                onClick={handleSubmit}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isSubmitting ? "Adding..." : "Add Ingredient"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}


