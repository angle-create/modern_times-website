import { FeaturedProducts } from '@/components/home/featured-products'
import { NewsSection } from '@/components/home/news-section'
import { HeroSlider } from '@/components/hero-slider'

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          特別な日を彩るケーキをお届けします
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          モダンタイムスは、お客様の大切な記念日をより特別なものにするために、
          心を込めて作られたケーキをお届けします。
        </p>
      </div>
      <FeaturedProducts />
      <NewsSection />
    </div>
  )
} 