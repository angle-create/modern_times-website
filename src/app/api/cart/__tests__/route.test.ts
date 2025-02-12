import { NextRequest } from 'next/server'
import { GET, POST, PUT, DELETE } from '../route'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// Prismaのモック
jest.mock('@/lib/prisma', () => ({
  cartItem: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
  },
}))

// next-authのモック
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('Cart API', () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks()
    
    // デフォルトのセッション情報を設定
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user1' },
    })
  })

  describe('GET /api/cart', () => {
    it('カート内の商品一覧を取得できること', async () => {
      const mockCartItems = [
        {
          id: '1',
          userId: 'user1',
          productId: '1',
          quantity: 2,
          product: {
            id: '1',
            name: 'テスト商品1',
            price: 1000,
            imageUrl: '/images/test1.jpg',
          },
        },
      ]

      ;(prisma.cartItem.findMany as jest.Mock).mockResolvedValue(mockCartItems)

      const request = new NextRequest('http://localhost:3000/api/cart')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockCartItems)
      expect(prisma.cartItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user1' },
        })
      )
    })
  })

  describe('POST /api/cart', () => {
    it('商品をカートに追加できること', async () => {
      const mockProduct = {
        id: '1',
        name: 'テスト商品1',
        price: 1000,
        stock: 5,
      }

      const mockCartItem = {
        id: '1',
        userId: 'user1',
        productId: '1',
        quantity: 2,
        product: mockProduct,
      }

      ;(prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct)
      ;(prisma.cartItem.create as jest.Mock).mockResolvedValue(mockCartItem)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: '1',
          quantity: 2,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockCartItem)
    })

    it('在庫以上の数量を追加しようとするとエラーになること', async () => {
      const mockProduct = {
        id: '1',
        name: 'テスト商品1',
        price: 1000,
        stock: 1,
      }

      ;(prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: '1',
          quantity: 2,
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })

  describe('PUT /api/cart/:id', () => {
    it('カート内の商品の数量を更新できること', async () => {
      const mockCartItem = {
        id: '1',
        userId: 'user1',
        productId: '1',
        quantity: 3,
        product: {
          id: '1',
          name: 'テスト商品1',
          price: 1000,
          stock: 5,
        },
      }

      ;(prisma.cartItem.update as jest.Mock).mockResolvedValue(mockCartItem)

      const request = new NextRequest('http://localhost:3000/api/cart/1', {
        method: 'PUT',
        body: JSON.stringify({
          quantity: 3,
        }),
      })

      const response = await PUT(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockCartItem)
    })

    it('在庫以上の数量に更新しようとするとエラーになること', async () => {
      const mockCartItem = {
        id: '1',
        userId: 'user1',
        productId: '1',
        quantity: 1,
        product: {
          id: '1',
          name: 'テスト商品1',
          price: 1000,
          stock: 1,
        },
      }

      ;(prisma.cartItem.update as jest.Mock).mockRejectedValue(new Error('在庫不足'))

      const request = new NextRequest('http://localhost:3000/api/cart/1', {
        method: 'PUT',
        body: JSON.stringify({
          quantity: 2,
        }),
      })

      const response = await PUT(request, { params: { id: '1' } })
      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/cart/:id', () => {
    it('カート内の商品を削除できること', async () => {
      ;(prisma.cartItem.delete as jest.Mock).mockResolvedValue({})

      const request = new NextRequest('http://localhost:3000/api/cart/1', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: { id: '1' } })
      expect(response.status).toBe(204)
    })

    it('存在しない商品を削除しようとするとエラーになること', async () => {
      ;(prisma.cartItem.delete as jest.Mock).mockRejectedValue(new Error('商品が見つかりません'))

      const request = new NextRequest('http://localhost:3000/api/cart/999', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: { id: '999' } })
      expect(response.status).toBe(404)
    })
  })
}) 