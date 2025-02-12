'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NewsCard } from './news-card'
import { Pagination } from '@/components/ui/pagination'

type News = {
  id: number
  title: string
  content: string
  publishedAt: string
}

export function NewsList() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // TODO: APIからデータを取得するように変更
        const dummyNews = Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          title: `お知らせ${i + 1}`,
          content: `これはお知らせ${i + 1}の内容です。詳細な情報はこちらをご覧ください。`,
          publishedAt: new Date(2024, 1, 1 - i).toISOString(),
        }))

        setNews(dummyNews)
        setTotalPages(Math.ceil(dummyNews.length / itemsPerPage))
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch news:', error)
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const paginatedNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedNews.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
} 