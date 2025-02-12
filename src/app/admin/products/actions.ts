'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(id: number) {
  try {
    // 商品の存在確認
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      throw new Error('商品が見つかりません')
    }

    // 商品の削除
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    console.error('商品の削除中にエラーが発生しました:', error)
    throw new Error('商品の削除に失敗しました')
  }
} 