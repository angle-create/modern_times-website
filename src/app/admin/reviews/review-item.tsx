'use client'

import { useState } from 'react'
import Image from 'next/image'

type ReviewItemProps = {
  review: {
    id: number
    rating: number
    comment: string
    authorName: string
    authorEmail: string
    imageUrl?: string
    isApproved: boolean
    createdAt: string
    product: {
      id: number
      name: string
    }
  }
  onApprove: () => void
  onReject: () => void
  onDelete: () => void
}

export function ReviewItem({
  review,
  onApprove,
  onReject,
  onDelete,
}: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formattedDate = new Date(review.createdAt).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {review.authorName}
            </span>
            <span className="text-sm text-gray-500">
              {formattedDate}
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                review.isApproved
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {review.isApproved ? '承認済み' : '未承認'}
            </span>
          </div>

          <div className="mt-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-900">
              {isExpanded ? review.comment : review.comment.slice(0, 100)}
              {review.comment.length > 100 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-1 text-brown-600 hover:text-brown-700"
                >
                  {isExpanded ? '閉じる' : '...続きを読む'}
                </button>
              )}
            </p>
          </div>

          {review.imageUrl && (
            <div className="mt-2">
              <div className="relative w-24 h-24">
                <Image
                  src={review.imageUrl}
                  alt="レビュー画像"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          )}

          <div className="mt-2 text-sm text-gray-500">
            商品: {review.product.name}
          </div>
        </div>

        <div className="flex gap-2">
          {!review.isApproved && (
            <button
              onClick={onApprove}
              className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
            >
              承認
            </button>
          )}
          {review.isApproved && (
            <button
              onClick={onReject}
              className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
            >
              非承認
            </button>
          )}
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
} 