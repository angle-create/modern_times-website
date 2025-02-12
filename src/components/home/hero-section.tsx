import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
  return (
    <div className="relative">
      {/* 仮の画像を使用。後で実際の店舗画像に置き換え */}
      <div className="relative h-[70vh] min-h-[600px]">
        <Image
          src="/images/hero.jpg"
          alt="Modern Times店内"
          fill
          className="object-cover"
          priority
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