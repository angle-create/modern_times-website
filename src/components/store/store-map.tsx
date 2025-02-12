'use client'

export function StoreMap() {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {/* TODO: Google Maps等の地図を埋め込む */}
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          地図は準備中です
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-brown-900">アクセス</h2>
        <ul className="text-gray-600 space-y-2">
          <li>• 渋谷駅から徒歩10分</li>
          <li>• 表参道駅から徒歩8分</li>
          <li>• 明治神宮前駅から徒歩5分</li>
        </ul>
      </div>
    </div>
  )
} 