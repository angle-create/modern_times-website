'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { categorySchema } from './schemas'
import { redirect } from 'next/navigation'

export async function deleteCategory(id: number) {
  try {
    // カテゴリの存在確認
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (!category) {
      throw new Error('カテゴリが見つかりません')
    }

    // 商品が関連付けられているカテゴリは削除できない
    if (category._count.products > 0) {
      throw new Error('商品が関連付けられているカテゴリは削除できません')
    }

    // カテゴリの削除
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error('カテゴリの削除中にエラーが発生しました:', error)
    throw error
  }
}

export async function createCategory(formData: FormData) {
  try {
    const validatedData = categorySchema.parse({
      name: formData.get('name'),
      slug: formData.get('slug'),
    })

    // スラッグの重複チェック
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingCategory) {
      throw new Error('このスラッグは既に使用されています')
    }

    // カテゴリの作成
    await prisma.category.create({
      data: validatedData,
    })

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
  } catch (error) {
    console.error('カテゴリの作成中にエラーが発生しました:', error)
    throw error
  }
}

export async function updateCategory(id: number, formData: FormData) {
  try {
    const validatedData = categorySchema.parse({
      name: formData.get('name'),
      slug: formData.get('slug'),
    })

    // スラッグの重複チェック（自分自身は除外）
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug: validatedData.slug,
        NOT: {
          id,
        },
      },
    })

    if (existingCategory) {
      throw new Error('このスラッグは既に使用されています')
    }

    // カテゴリの更新
    await prisma.category.update({
      where: { id },
      data: validatedData,
    })

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
  } catch (error) {
    console.error('カテゴリの更新中にエラーが発生しました:', error)
    throw error
  }
} 