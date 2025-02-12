import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名は必須です')
    .max(100, 'カテゴリ名は100文字以内で入力してください')
    .regex(/^[\p{L}\p{N}\p{P}\p{Z}]+$/u, 'カテゴリ名に使用できない文字が含まれています'),
  
  slug: z
    .string()
    .min(1, 'スラッグは必須です')
    .max(100, 'スラッグは100文字以内で入力してください')
    .regex(/^[a-z0-9-]+$/, 'スラッグは半角英数字とハイフンのみ使用可能です')
    .regex(/^(?!-).+(?<!-)$/, 'スラッグの先頭と末尾にハイフンは使用できません')
})

export type CategoryFormData = z.infer<typeof categorySchema> 