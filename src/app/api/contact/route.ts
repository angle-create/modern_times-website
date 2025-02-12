import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  subject: z.string().min(1, '件名は必須です'),
  message: z.string().min(1, 'メッセージは必須です'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const validatedData = contactSchema.parse(body)

    const inquiry = await prisma.inquiry.create({
      data: {
        ...validatedData,
        status: 'pending',
      },
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Contact submission error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 