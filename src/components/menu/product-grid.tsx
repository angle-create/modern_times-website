import { Product } from '@/types/product'
import { ProductImage } from '@/components/ui/product-image'

type ProductGridProps = {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="h-64"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-brown-900 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-brown-600 text-lg font-bold">
                ¥{product.price.toLocaleString()}
              </span>
              {product.isAvailable ? (
                <span className="text-green-600 text-sm font-medium">
                  販売中
                </span>
              ) : (
                <span className="text-red-600 text-sm font-medium">
                  売り切れ
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 