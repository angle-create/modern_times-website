'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type News = {
  id: number
  title: string
  content: string
  publishedAt: string
}

export function NewsSection() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 仮のデータを使用（後でAPIから取得するように変更）
    const dummyNews = [
      {
        id: 1,
        title: '新商品「季節のタルト」発売開始',
        content: '旬の果物をふんだんに使用した季節限定タルトの販売を開始しました。',
        publishedAt: '2024-02-01',
      },
      {
        id: 2,
        title: '営業時間変更のお知らせ',
        content: '3月より営業時間を1時間延長いたします。',
        publishedAt: '2024-01-25',
      },
      {
        id: 3,
        title: 'バレンタイン特別メニュー',
        content: 'バレンタイン期間限定の特別メニューをご用意しました。',
        publishedAt: '2024-01-20',
      },
    ]
    setNews(dummyNews)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">お知らせ</h2>
          <div className="text-center">読み込み中...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center">お知らせ</h2>
        <div className="mt-12 grid gap-8">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-sm text-gray-500 mb-2">
                {new Date(item.publishedAt).toLocaleDateString('ja-JP')}
              </div>
              <h3 className="text-lg font-semibold text-brown-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-4">{item.content}</p>
              <Link
                href={`/news/${item.id}`}
                className="text-brown-600 hover:text-brown-700 font-medium text-sm"
              >
                詳しく見る →
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/news" className="btn-secondary">
            お知らせ一覧を見る
          </Link>
        </div>
      </div>
    </section>
  )
} 