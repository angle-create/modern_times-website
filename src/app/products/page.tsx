'use client'

import { useState, useEffect } from 'react'
import { CategoryTabs } from '@/components/menu/category-tabs'
import { ProductGrid } from '@/components/menu/product-grid'
import { Category, Product } from '@/types/product'
import { SearchBar } from '@/components/menu/search-bar'

export default function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ])

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error('データの取得に失敗しました')
        }

        const [categoriesData, productsData] = await Promise.all([
          categoriesRes.json(),
          productsRes.json(),
        ])

        setCategories(categoriesData)
        setProducts(productsData)
      } catch (error) {
        console.error('データの取得に失敗しました:', error)
        alert('データの取得に失敗しました。ページを更新してください。')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query) {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
      return
    }

    try {
      const res = await fetch(`/api/search/products?query=${encodeURIComponent(query)}`)
      if (!res.ok) {
        throw new Error('検索に失敗しました')
      }
      const data = await res.json()
      setProducts(data.products)
    } catch (error) {
      console.error('検索に失敗しました:', error)
      alert('検索に失敗しました。もう一度お試しください。')
    }
  }

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category.slug === activeCategory)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">メニュー</h1>
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="mt-8">
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchQuery ? '検索結果が見つかりませんでした' : '商品が見つかりませんでした'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 