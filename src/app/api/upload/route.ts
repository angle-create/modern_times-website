import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // multipart/form-dataの解析
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      )
    }

    if (!type || !['products', 'news'].includes(type)) {
      return NextResponse.json(
        { error: '無効なアップロード先が指定されています' },
        { status: 400 }
      )
    }

    // ファイルサイズの確認
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズは5MB以下にしてください' },
        { status: 400 }
      )
    }

    // ファイル形式の確認
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'JPG、PNG、WebP形式のみアップロード可能です' },
        { status: 400 }
      )
    }

    // ファイルをBufferに変換
    const buffer = Buffer.from(await file.arrayBuffer())

    // Cloudinaryにアップロード
    const result = await uploadImage(buffer, {
      folder: type,
      allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      maxFileSize: 5 * 1024 * 1024,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { error: '画像IDが指定されていません' },
        { status: 400 }
      )
    }

    await deleteImage(publicId)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Image deletion error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 