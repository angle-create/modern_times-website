import { Metadata } from 'next'
import { StoreInfo } from '@/components/store/store-info'
import { StoreMap } from '@/components/store/store-map'

export const metadata: Metadata = {
  title: '店舗情報 | Modern Times',
  description: 'Modern Timesの店舗情報です。営業時間、アクセス、駐車場情報などをご確認いただけます。',
}

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brown-900 mb-8">店舗情報</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StoreInfo />
        <StoreMap />
      </div>
    </div>
  )
}
 