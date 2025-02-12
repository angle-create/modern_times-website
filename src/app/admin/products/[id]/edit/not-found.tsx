import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        商品が見つかりません
      </h2>
      <p className="text-gray-600 mb-8">
        指定された商品は存在しないか、削除された可能性があります。
      </p>
      <Link
        href="/admin/products"
        className="text-brown-600 hover:text-brown-900 font-medium"
      >
        商品一覧に戻る
      </Link>
    </div>
  )
} 