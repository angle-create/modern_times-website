import Link from 'next/link'
import { ProductImage } from '@/components/ui/product-image'

export function HeroSection() {
  return (
    <div className="relative">
      <div className="relative h-[70vh] min-h-[600px]">
        <ProductImage
          src="/images/placeholder.png"
          alt="Modern Times店内"
          className="h-[70vh] min-h-[600px]"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Modern Times
            </h1>
            <p className="text-lg md:text-xl mb-8">
              手作りにこだわった、温かみのあるケーキをお届けします
            </p>
            <Link
              href="/menu"
              className="btn-primary text-lg py-3 px-8"
            >
              メニューを見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 