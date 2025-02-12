export type Category = {
  id: number
  name: string
  slug: string
}

export type Product = {
  id: number
  categoryId: number
  name: string
  description: string
  price: number
  imageUrl?: string
  isAvailable: boolean
  category: Category
} 