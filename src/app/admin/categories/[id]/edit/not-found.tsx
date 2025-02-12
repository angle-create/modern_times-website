import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        カテゴリが見つかりません
      </h2>
      <p className="text-gray-600 mb-8">
        指定されたカテゴリは存在しないか、削除された可能性があります。
      </p>
      <Link
        href="/admin/categories"
        className="text-brown-600 hover:text-brown-900 font-medium"
      >
        カテゴリ一覧に戻る
      </Link>
    </div>
  )
} 