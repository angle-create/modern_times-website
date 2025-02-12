import { getCartItems } from '@/lib/api'
import { formatPrice } from '@/utils/format'
import Image from 'next/image'
import CheckoutForm from './CheckoutForm'

export default async function CheckoutPage() {
  const cartItems = await getCartItems()
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-brown-900 mb-8">チェックアウト</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">カートに商品がありません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-brown-900 mb-8">チェックアウト</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-brown-900 mb-4">注文内容</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-brown-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-brown-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-brown-900">合計</span>
                <span className="text-lg font-bold text-brown-900">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-brown-900 mb-4">
            お届け先情報
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <CheckoutForm cartItems={cartItems} totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </div>
  )
} 