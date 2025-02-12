import { getCartItems } from '@/lib/api'
import { formatPrice } from '@/utils/format'
import Image from 'next/image'
import Link from 'next/link'
import CartItemControl from './CartItemControl'

export default async function CartPage() {
  const cartItems = await getCartItems()
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-brown-900 mb-8">カート</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">カートに商品がありません</p>
          <Link href="/products" className="btn-primary">
            商品一覧へ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-brown-900 mb-8">カート</h1>
      <div className="grid grid-cols-1 gap-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6"
          >
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-lg font-semibold text-brown-900 mb-2">
                {item.name}
              </h2>
              <p className="text-brown-600 font-bold mb-2">
                {formatPrice(item.price)}
              </p>
              <CartItemControl
                productId={item.id}
                initialQuantity={item.quantity}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-brown-900">合計</span>
          <span className="text-xl font-bold text-brown-900">
            {formatPrice(totalAmount)}
          </span>
        </div>
        <Link href="/checkout" className="btn-primary w-full text-center">
          レジに進む
        </Link>
      </div>
    </div>
  )
} 