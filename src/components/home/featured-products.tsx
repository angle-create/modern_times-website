import Link from 'next/link'
import { ProductImage } from '@/components/ui/product-image'
import Image from 'next/image'

type Product = {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
}

export function FeaturedProducts() {
  // 仮のデータ（後でAPIから取得するように変更）
  const products: Product[] = [
    {
      id: 1,
      name: 'ストロベリーショートケーキ',
      description: '新鮮な苺をたっぷり使用した定番の一品',
      price: 480,
      imageUrl: '/images/placeholder.png',
    },
    {
      id: 2,
      name: 'チョコレートケーキ',
      description: 'ベルギー産チョコレートを使用した濃厚な味わい',
      price: 450,
      imageUrl: '/images/placeholder.png',
    },
    {
      id: 3,
      name: 'モンブラン',
      description: '国産の栗を使用した季節限定の人気商品',
      price: 500,
      imageUrl: '/images/placeholder.png',
    },
  ]

  return (
    <section className="py-8 bg-brown-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative w-full aspect-[3/2]">
            <Image
              src="/images/topbn1.png"
              alt="おすすめアイコン1"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative w-full aspect-[3/2]">
            <Image
              src="/images/topbn2.png"
              alt="おすすめアイコン2"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-block bg-brown-600 text-white px-8 py-3 rounded-md hover:bg-brown-700 transition-colors"
          >
            商品一覧を見る
          </Link>
        </div>
      </div>
    </section>
  )
} 