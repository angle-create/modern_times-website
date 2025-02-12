import Link from 'next/link'

type NewsCardProps = {
  news: {
    id: number
    title: string
    content: string
    publishedAt: string
  }
}

export function NewsCard({ news }: NewsCardProps) {
  const formattedDate = new Date(news.publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/news/${news.id}`}>
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          <time dateTime={news.publishedAt} className="text-sm text-gray-500">
            {formattedDate}
          </time>
          <h2 className="text-xl font-semibold text-brown-900 mt-2 mb-3">
            {news.title}
          </h2>
          <p className="text-gray-600 line-clamp-3">{news.content}</p>
          <div className="mt-4 text-brown-600 text-sm font-medium">
            続きを読む →
          </div>
        </div>
      </article>
    </Link>
  )
} 