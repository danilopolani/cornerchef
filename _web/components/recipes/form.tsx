"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Upload } from "lucide-react"
import { recipesService } from "@/lib/database"
import { getImagePreview } from "@/lib/storage"
import Compressor from "compressorjs"

export type RecipeFormValues = {
  name: string
  description: string
  servings: string
  cookTime: string
  image: string
  imageFile?: File | null
  ingredients: string[]
  steps: string[]
  categories: string[]
}

type RecipeFormProps = {
  initialValues?: Partial<RecipeFormValues>
  onSubmit: (values: RecipeFormValues) => Promise<void> | void
  submitLabel: string
  cancelHref: string
  isSubmitting?: boolean
  userId?: string
}

export function RecipeForm({ initialValues, onSubmit, submitLabel, cancelHref, isSubmitting, userId }: RecipeFormProps) {
  const [formData, setFormData] = useState({
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    servings: initialValues?.servings ?? "",
    cookTime: initialValues?.cookTime ?? "",
    image: initialValues?.image ?? "",
  })

  const [ingredients, setIngredients] = useState<string[]>(() => {
    const base = initialValues?.ingredients ?? [""]
    return base.length > 0 ? base : [""]
  })

  const [steps, setSteps] = useState<string[]>(() => {
    const base = initialValues?.steps ?? [""]
    return base.length > 0 ? base : [""]
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialValues?.categories ?? [])
  const [categoryInput, setCategoryInput] = useState("")
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([])

  const ingredientRefs = useRef<Array<HTMLTextAreaElement | null>>([])
  const stepRefs = useRef<Array<HTMLTextAreaElement | null>>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const previewUrl = useMemo(() => (selectedFile ? URL.createObjectURL(selectedFile) : ""), [selectedFile])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!userId) return
        const recipes = await recipesService.getByUserId(userId)
        const unique = Array.from(
          new Set(
            recipes
              .flatMap((r) => r.categories ?? [])
              .map((c) => c.trim())
              .filter((c) => c.length > 0)
          )
        ).sort()
        setCategorySuggestions(unique)
      } catch (err) {
        setCategorySuggestions([])
      }
    }
    fetchCategories()
  }, [userId])

  const filteredSuggestions = useMemo(() => {
    return categorySuggestions
      .filter((c) => c.toLowerCase().includes(categoryInput.toLowerCase()))
      .filter((c) => !selectedCategories.includes(c))
      .slice(0, 6)
  }, [categorySuggestions, categoryInput, selectedCategories])

  const addIngredient = () => setIngredients((prev) => [...prev, ""]) 
  const removeIngredient = (index: number) => setIngredients((prev) => prev.filter((_, i) => i !== index))
  const updateIngredient = (index: number, value: string) => setIngredients((prev) => prev.map((v, i) => (i === index ? value : v)))
  const addIngredientAfter = (index: number) => {
    setIngredients((prev) => {
      const next = [...prev]
      next.splice(index + 1, 0, "")
      return next
    })
    requestAnimationFrame(() => {
      ingredientRefs.current[index + 1]?.focus()
    })
  }

  const addStep = () => setSteps((prev) => [...prev, ""]) 
  const removeStep = (index: number) => setSteps((prev) => prev.filter((_, i) => i !== index))
  const updateStep = (index: number, value: string) => setSteps((prev) => prev.map((v, i) => (i === index ? value : v)))
  const addStepAfter = (index: number) => {
    setSteps((prev) => {
      const next = [...prev]
      next.splice(index + 1, 0, "")
      return next
    })
    requestAnimationFrame(() => {
      stepRefs.current[index + 1]?.focus()
    })
  }

  const commitCategoryInput = (value?: string) => {
    const raw = (value ?? categoryInput).trim()
    if (!raw) return
    if (!selectedCategories.includes(raw)) {
      setSelectedCategories((prev) => [...prev, raw])
    }
    setCategoryInput("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const values: RecipeFormValues = {
      name: formData.name,
      description: formData.description,
      servings: formData.servings,
      cookTime: formData.cookTime,
      image: formData.image,
      imageFile: selectedFile,
      ingredients,
      steps,
      categories: selectedCategories,
    }
    await onSubmit(values)
  }

  const handlePickImage = () => {
    fileInputRef.current?.click()
  }

  const handleImageSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a JPG, JPEG, or PNG image file.')
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }
    
    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Image file size must be less than 5MB.')
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }
    
    new Compressor(file, {
      quality: 0.7,
      width: 1024,
      height: 520,
      resize: "cover",
      success: (result: Blob) => {
        // result is Blob; convert to File to preserve name/type for upload
        const compressed = new File([result], file.name, { type: (result as any).type || file.type })
        setSelectedFile(compressed)
      },
      error: (err: Error) => {
        setSelectedFile(file)
      },
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Recipe Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter recipe name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the recipe"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                placeholder="4"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="cookTime">Cook Time</Label>
              <Input
                id="cookTime"
                value={formData.cookTime}
                onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
                placeholder="30 min"
              />
            </div>
          </div>

          <div>
            <Label>Image</Label>
            {(selectedFile || formData.image) && (
              <div className="mt-2">
                <img
                  src={selectedFile ? previewUrl : getImagePreview(formData.image, "thumbnail")}
                  alt="Recipe"
                  className="w-full h-40 object-cover rounded border"
                />
              </div>
            )}
            <div className="flex items-center gap-3 mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageSelected}
                className="hidden"
              />
              <Button type="button" variant="outline" size={selectedFile || formData.image ? "xs" : "sm"} onClick={handlePickImage}>
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile || formData.image ? "Change image" : "Choose image"}
              </Button>
              {(selectedFile || formData.image) && (
                <Button type="button" variant="destructive" size="xs" onClick={() => { setSelectedFile(null); setFormData({ ...formData, image: "" }) }}>
                  Remove image
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Input
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  commitCategoryInput()
                }
              }}
              placeholder="Type and press Enter to add"
            />
            {categoryInput && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
                {filteredSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => commitCategoryInput(s)}
                    className="w-full text-left px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <button
                    type="button"
                    onClick={() => setSelectedCategories((prev) => prev.filter((c) => c !== category))}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Ingredients</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <Textarea
                ref={(el) => {
                  ingredientRefs.current[index] = el
                  autoResize(el)
                  return undefined
                }}
                value={ingredient}
                onChange={(e) => {
                  updateIngredient(index, e.target.value)
                  autoResize(e.currentTarget)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if ((e as any).shiftKey || (e as any).repeat) {
                      return
                    }
                    e.preventDefault()
                    addIngredientAfter(index)
                  }
                }}
                placeholder={`Ingredient ${index + 1}`}
                rows={1}
                className="resize-none min-h-9 py-2"
                style={{ height: "auto", overflow: "hidden" }}
              />
              {ingredients.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeIngredient(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Cooking Steps</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-1">
                {index + 1}
              </div>
              <div className="flex-1 flex items-start gap-2">
                <Textarea
                  ref={(el) => {
                    stepRefs.current[index] = el
                    autoResize(el)
                    return undefined
                  }}
                  value={step}
                  onChange={(e) => {
                    updateStep(index, e.target.value)
                    autoResize(e.currentTarget)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if ((e as any).shiftKey || (e as any).repeat) {
                        return
                      }
                      e.preventDefault()
                      addStepAfter(index)
                    }
                  }}
                  placeholder={`Step ${index + 1} instructions`}
                  rows={1}
                  className="flex-1 resize-none min-h-9 py-2"
                  style={{ height: "auto", overflow: "hidden" }}
                />
                {steps.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeStep(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link href={cancelHref} className="flex-1">
          <Button type="button" variant="outline" className="w-full bg-transparent">
            Cancel
          </Button>
        </Link>
        <Button type="submit" className="flex-1" disabled={!!isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}


