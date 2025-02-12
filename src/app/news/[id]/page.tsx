import { Metadata } from 'next'
import Link from 'next/link'

type Props = {
  params: {
    id: string
  }
}

// TODO: APIから実際のデータを取得するように変更
async function getNewsById(id: string) {
  return {
    id: parseInt(id),
    title: `お知らせ${id}`,
    content: `これはお知らせ${id}の詳細な内容です。\n\n商品やサービスに関する重要なお知らせをご確認いただけます。\n\nご不明な点がございましたら、お問い合わせフォームよりお気軽にご連絡ください。`,
    publishedAt: new Date(2024, 1, 1).toISOString(),
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await getNewsById(params.id)
  return {
    title: `${news.title} - Modern Times`,
    description: news.content.slice(0, 100),
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const news = await getNewsById(params.id)
  const formattedDate = new Date(news.publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/news"
            className="text-brown-600 hover:text-brown-700 flex items-center gap-1"
          >
            ← お知らせ一覧に戻る
          </Link>
        </div>
        <header className="mb-8">
          <time dateTime={news.publishedAt} className="text-gray-500">
            {formattedDate}
          </time>
          <h1 className="text-3xl font-bold text-brown-900 mt-2">
            {news.title}
          </h1>
        </header>
        <div className="prose prose-brown max-w-none">
          {news.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  )
} 