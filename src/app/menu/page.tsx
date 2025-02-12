'use client'

import { useState } from 'react'
import { CategoryTabs } from '@/components/menu/category-tabs'
import { ProductGrid } from '@/components/menu/product-grid'
import { Category, Product } from '@/types/product'

// 仮のデータ（後でAPIから取得するように変更）
const categories: Category[] = [
  { id: 1, name: 'コーヒー', slug: 'coffee' },
  { id: 2, name: 'ケーキ', slug: 'cake' },
  { id: 3, name: 'サンドイッチ', slug: 'sandwich' },
]

const products: Product[] = [
  {
    id: 1,
    categoryId: 1,
    name: 'ブレンドコーヒー',
    description: '厳選された豆をブレンドした、バランスの取れた味わい',
    price: 500,
    imageUrl: '/images/placeholder.png',
    isAvailable: true,
    category: categories[0],
  },
  {
    id: 2,
    categoryId: 2,
    name: 'チョコレートケーキ',
    description: '濃厚なチョコレートの味わいが楽しめる定番ケーキ',
    price: 600,
    imageUrl: '/images/placeholder.png',
    isAvailable: true,
    category: categories[1],
  },
  // 他の商品も同様に追加
]

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category.slug === activeCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">メニュー</h1>
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="mt-8">
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  )
} 