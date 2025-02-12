import { Metadata } from 'next'
import { NewsList } from '@/components/news/news-list'

export const metadata: Metadata = {
  title: 'お知らせ - Modern Times',
  description: 'Modern Timesからのお知らせ一覧です。新商品情報や営業時間の変更などをご確認いただけます。',
}

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">お知らせ</h1>
      <NewsList />
    </div>
  )
} 