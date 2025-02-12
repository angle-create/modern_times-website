import { Metadata } from 'next'
import { StoreInfo } from '@/components/store/store-info'
import { StoreMap } from '@/components/store/store-map'

export const metadata: Metadata = {
  title: '店舗情報 - Modern Times',
  description: 'Modern Timesの店舗情報です。アクセス方法、営業時間、駐車場情報などをご確認いただけます。',
}

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12">店舗情報</h1>
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-12 md:grid-cols-2">
          <StoreInfo />
          <StoreMap />
        </div>
 