import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'

const storeUpdateSchema = z.object({
  name: z.string().min(1, '店舗名は必須です').max(100, '店舗名は100文字以内で入力してください'),
  address: z.string().min(1, '住所は必須です'),
  phone: z.string().regex(/^[0-9-]+$/, '電話番号は数字とハイフンのみ使用できます').optional(),
  email: z.string().email('有効なメールアドレスを入力してください').optional(),
  businessHours: z.string().optional(),
  parkingInfo: z.string().optional(),
})

export async function GET() {
  try {
    const storeInfo = await prisma.storeInfo.findFirst()

    if (!storeInfo) {
      return NextResponse.json(
        { error: 'Store information not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(storeInfo)
  } catch (error) {
    console.error('Store info fetch error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = storeUpdateSchema.parse(body)

    // 既存の店舗情報を取得
    const existingStoreInfo = await prisma.storeInfo.findFirst()

    let storeInfo
    if (existingStoreInfo) {
      // 既存の店舗情報を更新
      storeInfo = await prisma.storeInfo.update({
        where: { id: existingStoreInfo.id },
        data: validatedData,
      })
    } else {
      // 店舗情報が存在しない場合は新規作成
      storeInfo = await prisma.storeInfo.create({
        data: validatedData,
      })
    }

    return NextResponse.json(storeInfo)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Store info update error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 