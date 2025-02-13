import { prisma } from '@/lib/prisma'
import { GoogleMap } from '@/components/google-map'

export default async function AboutPage() {
  const storeInfo = await prisma.storeInfo.findFirst()

  if (!storeInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-600">店舗情報が見つかりません</p>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">店舗案内</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">基本情報</h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-medium text-gray-900">店舗名</dt>
                <dd className="mt-1 text-gray-600">{storeInfo.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">住所</dt>
                <dd className="mt-1 text-gray-600">{storeInfo.address}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">電話番号</dt>
                <dd className="mt-1 text-gray-600">{storeInfo.phone}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">メールアドレス</dt>
                <dd className="mt-1 text-gray-600">{storeInfo.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">営業時間</dt>
                <dd className="mt-1 text-gray-600 whitespace-pre-line">
                  {storeInfo.businessHours}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">駐車場</dt>
                <dd className="mt-1 text-gray-600">{storeInfo.parkingInfo}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">アクセス</h2>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <GoogleMap address={storeInfo.address} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 