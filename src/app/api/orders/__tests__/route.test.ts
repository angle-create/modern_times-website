import { NextRequest } from 'next/server'
import { GET, POST } from '../route'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// Prismaのモック
jest.mock('@/lib/prisma', () => ({
  order: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  orderItem: {
    createMany: jest.fn(),
  },
  product: {
    update: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(prisma)),
}))

// next-authのモック
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('Orders API', () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks()
  })

  describe('GET /api/orders', () => {
    it('ユーザーが自分の注文一覧を取得できること', async () => {
      const mockOrders = [
        {
          id: '1',
          userId: 'user1',
          totalAmount: 2000,
          status: '注文受付',
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [
            {
              id: '1',
              orderId: '1',
              productId: '1',
              name: 'テスト商品1',
              price: 1000,
              quantity: 2,
            },
          ],
        },
      ]

      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user1', role: 'USER' },
      })
      ;(prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders)

      const request = new NextRequest('http://localhost:3000/api/orders')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockOrders)
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user1' },
        })
      )
    })

    it('管理者が全ての注文を取得できること', async () => {
      const mockOrders = [
        {
          id: '1',
          userId: 'user1',
          totalAmount: 2000,
          status: '注文受付',
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [
            {
              id: '1',
              orderId: '1',
              productId: '1',
              name: 'テスト商品1',
              price: 1000,
              quantity: 2,
            },
          ],
        },
      ]

      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'admin1', role: 'ADMIN' },
      })
      ;(prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders)

      const request = new NextRequest('http://localhost:3000/api/orders')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockOrders)
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.not.objectContaining({
          where: { userId: expect.any(String) },
        })
      )
    })
  })

  describe('POST /api/orders', () => {
    it('ユーザーが注文を作成できること', async () => {
      const mockOrder = {
        id: '1',
        userId: 'user1',
        totalAmount: 2000,
        status: '注文受付',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: '1',
            orderId: '1',
            productId: '1',
            name: 'テスト商品1',
            price: 1000,
            quantity: 2,
          },
        ],
      }

      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user1', role: 'USER' },
      })
      ;(prisma.order.create as jest.Mock).mockResolvedValue(mockOrder)
      ;(prisma.orderItem.createMany as jest.Mock).mockResolvedValue({ count: 1 })
      ;(prisma.product.update as jest.Mock).mockResolvedValue({})

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [
            {
              productId: '1',
              quantity: 2,
            },
          ],
          shippingAddress: {
            name: 'テストユーザー',
            postalCode: '123-4567',
            prefecture: '東京都',
            city: '渋谷区',
            street: '1-2-3',
          },
          paymentMethod: 'クレジットカード',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockOrder)
    })

    it('在庫不足の場合エラーになること', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user1', role: 'USER' },
      })
      ;(prisma.product.update as jest.Mock).mockRejectedValue(new Error('在庫不足'))

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [
            {
              productId: '1',
              quantity: 999,
            },
          ],
          shippingAddress: {
            name: 'テストユーザー',
            postalCode: '123-4567',
            prefecture: '東京都',
            city: '渋谷区',
            street: '1-2-3',
          },
          paymentMethod: 'クレジットカード',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('無効なデータでリクエストするとエラーになること', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user1', role: 'USER' },
      })

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          // itemsが欠けている
          shippingAddress: {
            name: 'テストユーザー',
            postalCode: '123-4567',
            prefecture: '東京都',
            city: '渋谷区',
            street: '1-2-3',
          },
          paymentMethod: 'クレジットカード',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })
}) 