'use client'

import Slider from 'react-slick'
import Image from 'next/image'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const slides = [
  {
    id: 1,
    image: '/images/slides/birthday.jpg',
    title: 'バースデーケーキ',
    description: '誕生日を特別な思い出に'
  },
  {
    id: 2,
    image: '/images/slides/squarebook.jpg',
    title: 'ウェディングケーキ',
    description: '幸せな瞬間をより美しく'
  },
  {
    id: 3,
    image: '/images/slides/anniversary.jpg',
    title: '記念日ケーキ',
    description: '大切な記念日を彩る'
  },
  {
    id: 4,
    image: '/images/slides/cake4.jpg',
    title: 'パーティーケーキ',
    description: 'みんなで楽しむ特別なケーキ'
  }
]

export function HeroSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    fade: true,
    cssEase: 'linear',
    arrows: false
  }

  return (
    <div className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Slider {...settings}>
          {slides.map((slide) => (
            <div key={slide.id} className="relative h-[600px]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover rounded-lg"
                priority={slide.id === 1}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg">
                <div className="h-full flex items-center">
                  <div className="text-white pl-12">
                    <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-xl">{slide.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
} 