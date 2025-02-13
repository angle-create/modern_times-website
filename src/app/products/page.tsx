'use client'

import { useState, useEffect } from 'react'
import { CategoryTabs } from '@/components/menu/category-tabs'
import { ProductGrid } from '@/components/menu/product-grid'
import { Category, Product } from '@/types/product'
import { SearchBar } from '@/components/menu/search-bar'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">商品一覧</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:opacity-75"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {product.category.name}
                </p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  ¥{product.price.toLocaleString()}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-block bg-brown-600 text-white px-6 py-2 rounded-md hover:bg-brown-700 transition-colors"
                  >
                    詳しく見る
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 