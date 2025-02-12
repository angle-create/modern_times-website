import { NextRequest } from 'next/server'
import { GET, POST } from '../route'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// Prismaのモック
jest.mock('@/lib/prisma', () => ({
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}))

// next-authのモック
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('Products API', () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks()
  })

  describe('GET /api/products', () => {
    it('商品一覧を取得できること', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'テスト商品1',
          price: 1000,
          description: 'テスト商品1の説明',
          imageUrl: '/images/test1.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockProducts)
    })

    it('検索クエリで商品をフィルタリングできること', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'テスト商品1',
          price: 1000,
          description: 'テスト商品1の説明',
          imageUrl: '/images/test1.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

      const request = new NextRequest('http://localhost:3000/api/products?search=テスト')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockProducts)
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { name: expect.objectContaining({ contains: 'テスト' }) },
              { description: expect.objectContaining({ contains: 'テスト' }) },
            ],
          }),
        })
      )
    })
  })

  describe('POST /api/products', () => {
    it('管理者が商品を作成できること', async () => {
      const mockProduct = {
        id: '1',
        name: 'テスト商品1',
        price: 1000,
        description: 'テスト商品1の説明',
        imageUrl: '/images/test1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { role: 'ADMIN' },
      })
      ;(prisma.product.create as jest.Mock).mockResolvedValue(mockProduct)

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'テスト商品1',
          price: 1000,
          description: 'テスト商品1の説明',
          imageUrl: '/images/test1.jpg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockProduct)
    })

    it('一般ユーザーが商品を作成しようとするとエラーになること', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { role: 'USER' },
      })

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'テスト商品1',
          price: 1000,
          description: 'テスト商品1の説明',
          imageUrl: '/images/test1.jpg',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(403)
    })

    it('無効なデータでリクエストするとエラーになること', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { role: 'ADMIN' },
      })

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify({
          // nameが欠けている
          price: 1000,
          description: 'テスト商品1の説明',
          imageUrl: '/images/test1.jpg',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })
}) 