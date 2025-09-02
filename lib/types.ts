export type Ingredient = {
  $id?: string
  name: string
  category?: string
  quantity?: number
  quantityType?: string
  buyDate: string
  expirationDate?: string
  userId: string
  $createdAt?: string
  $updatedAt?: string
}

export type Recipe = {
  $id?: string
  name: string
  description?: string
  cookTime?: string
  servings?: number
  categories?: string[]
  image?: string
  ingredients: string[]
  steps: string[]
  userId: string
  $createdAt?: string
  $updatedAt?: string
}
