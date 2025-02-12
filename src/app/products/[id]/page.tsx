import { getProduct } from '@/lib/api'
import { formatPrice } from '@/utils/format'
import Image from 'next/image'
import AddToCartButton from './AddToCartButton'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 md:h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brown-900 mb-4">{product.name}</h1>
          <p className="text-xl font-semibold text-brown-600 mb-4">
            {formatPrice(product.price)}
          </p>
          <p className="text-gray-600 mb-8">{product.description}</p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  )
} 