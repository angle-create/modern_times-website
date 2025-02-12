'use client'

import { addToCart } from '@/lib/api'
import { useState } from 'react'

export default function AddToCartButton({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    try {
      setIsLoading(true)
      await addToCart(productId, quantity)
      alert('カートに追加しました')
    } catch (error) {
      alert('カートへの追加に失敗しました')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-gray-300 rounded">
        <button
          className="px-3 py-2 text-gray-600 hover:text-brown-600 disabled:opacity-50"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || isLoading}
        >
          -
        </button>
        <span className="px-3 py-2 text-gray-900">{quantity}</span>
        <button
          className="px-3 py-2 text-gray-600 hover:text-brown-600 disabled:opacity-50"
          onClick={() => setQuantity(quantity + 1)}
          disabled={isLoading}
        >
          +
        </button>
      </div>
      <button
        className="btn-primary flex-1"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? '追加中...' : 'カートに追加'}
      </button>
    </div>
  )
} 