'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCartItem, removeCartItem } from '@/lib/api'

type Props = {
  productId: string
  initialQuantity: number
}

export default function CartItemControl({ productId, initialQuantity }: Props) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return

    try {
      setIsUpdating(true)
      await updateCartItem(productId, newQuantity)
      setQuantity(newQuantity)
      router.refresh()
    } catch (error) {
      console.error('数量の更新に失敗しました:', error)
      alert('数量の更新に失敗しました。もう一度お試しください。')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    if (isUpdating) return

    if (!confirm('この商品をカートから削除してもよろしいですか？')) {
      return
    }

    try {
      setIsUpdating(true)
      await removeCartItem(productId)
      router.refresh()
    } catch (error) {
      console.error('商品の削除に失敗しました:', error)
      alert('商品の削除に失敗しました。もう一度お試しください。')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-gray-300 rounded">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || isUpdating}
          className="px-3 py-2 text-gray-600 hover:text-brown-600 disabled:opacity-50"
        >
          -
        </button>
        <span className="px-3 py-2 text-gray-900">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={isUpdating}
          className="px-3 py-2 text-gray-600 hover:text-brown-600 disabled:opacity-50"
        >
          +
        </button>
      </div>
      <button
        onClick={handleRemove}
        disabled={isUpdating}
        className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        削除
      </button>
    </div>
  )
} 