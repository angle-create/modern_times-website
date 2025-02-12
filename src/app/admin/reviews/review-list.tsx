'use client'

import { useState, useEffect } from 'react'
import { ReviewItem } from './review-item'
import { Pagination } from '@/components/ui/pagination'

type Review = {
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

type PaginatedResponse = {
  reviews: Review[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  useEffect(() => {
    fetchReviews()
  }, [currentPage, filter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const endpoint = filter === 'pending' 
        ? `/api/reviews/pending?page=${currentPage}`
        : `/api/products/reviews?page=${currentPage}&status=${filter}`
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('レビューの取得に失敗しました')
      }

      const data: PaginatedResponse = await response.json()
      setReviews(data.reviews)
      setTotalPages(data.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: true }),
      })

      if (!response.ok) {
        throw new Error('レビューの承認に失敗しました')
      }

      // 一覧を更新
      fetchReviews()
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました')
    }
  }

  const handleReject = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: false }),
      })

      if (!response.ok) {
        throw new Error('レビューの非承認に失敗しました')
      }

      // 一覧を更新
      fetchReviews()
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました')
    }
  }

  const handleDelete = async (reviewId: number) => {
    if (!confirm('このレビューを削除してもよろしいですか？')) {
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('レビューの削除に失敗しました')
      }

      // 一覧を更新
      fetchReviews()
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました')
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        読み込み中...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${
              filter === 'pending'
                ? 'bg-brown-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            未承認
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md ${
              filter === 'approved'
                ? 'bg-brown-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            承認済み
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-brown-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            すべて
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {reviews.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            レビューがありません
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onApprove={() => handleApprove(review.id)}
              onReject={() => handleReject(review.id)}
              onDelete={() => handleDelete(review.id)}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
} 