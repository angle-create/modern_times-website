import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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