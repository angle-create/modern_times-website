import Image from 'next/image'
import Link from 'next/link'

type Product = {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
}

export function FeaturedProducts() {
  // 仮のデータ。後でAPIから取得するように変更
  const products: Product[] = [
    {
      id: 1,
      name: 'ストロベリーショートケーキ',
      description: '新鮮な苺をたっぷり使用した定番の一品',
      price: 480,
      imageUrl: '/images/products/strawberry-cake.jpg',
    },
    {
      id: 2,
      name: 'チョコレートケーキ',
      description: 'ベルギー産チョコレートを使用した濃厚な味わい',
      price: 450,
      imageUrl: '/images/products/chocolate-cake.jpg',
    },
    {
      id: 3,
      name: 'モンブラン',
      description: '国産の栗を使用した季節限定の人気商品',
      price: 500,
      imageUrl: '/images/products/mont-blanc.jpg',
    },
  ]

  return (
    <section className="py-16 bg-brown-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center">おすすめ商品</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative h-48">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-brown-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-brown-600 font-bold">
                    ¥{product.price}
                  </span>
                  <Link
                    href={`/menu#${product.id}`}
                    className="btn-secondary text-sm"
                  >
                    詳しく見る
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/menu" className="btn-primary">
            メニューをすべて見る
          </Link>
        </div>
      </div>
    </section>
  )
} 