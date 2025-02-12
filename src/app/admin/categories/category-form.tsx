'use client'

import { Category } from '@prisma/client'
import { useRef, useState, useEffect } from 'react'
import { categorySchema, type CategoryFormData } from './schemas'
import { ZodError } from 'zod'

interface CategoryFormProps {
  category?: Category
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

type ValidationErrors = {
  [K in keyof CategoryFormData]?: string
}

export function CategoryForm({
  category,
  action,
  submitLabel,
}: CategoryFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
  const [isAutoSlug, setIsAutoSlug] = useState(!category)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // カテゴリ名からスラッグを自動生成
  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9ぁ-んァ-ン一-龯]/g, '-') // 英数字とひらがな・カタカナ・漢字以外をハイフンに変換
      .replace(/ー+/g, '-') // 連続するハイフンを1つに
      .replace(/^-|-$/g, '') // 先頭と末尾のハイフンを削除
  }

  // フォームデータのバリデーション
  function validateForm(data: CategoryFormData) {
    try {
      categorySchema.parse(data)
      setValidationErrors({})
      return true
    } catch (e) {
      if (e instanceof ZodError) {
        const errors: ValidationErrors = {}
        e.errors.forEach((error) => {
          if (error.path[0]) {
            errors[error.path[0] as keyof CategoryFormData] = error.message
          }
        })
        setValidationErrors(errors)
      }
      return false
    }
  }

  // 入力値が変更されるたびにバリデーションを実行
  useEffect(() => {
    validateForm({ name, slug })
  }, [name, slug])

  // カテゴリ名が変更されたときの処理
  function handleNameChange(value: string) {
    setName(value)
    setError(null)
    if (isAutoSlug) {
      const newSlug = generateSlug(value)
      setSlug(newSlug)
    }
  }

  // スラッグが変更されたときの処理
  function handleSlugChange(value: string) {
    setSlug(value)
    setError(null)
  }

  // フォームが有効かどうかを判定
  const isValid = Object.keys(validationErrors).length === 0 && name.length > 0 && slug.length > 0

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        try {
          setError(null)
          setIsSubmitting(true)

          // 送信前に最終バリデーション
          const data = {
            name: formData.get('name') as string,
            slug: formData.get('slug') as string,
          }
          if (!validateForm(data)) {
            throw new Error('入力内容に誤りがあります')
          }

          await action(formData)
          if (!category) {
            formRef.current?.reset()
            setName('')
            setSlug('')
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました')
        } finally {
          setIsSubmitting(false)
        }
      }}
      className="space-y-6 p-6"
    >
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            カテゴリ名
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            maxLength={100}
            disabled={isSubmitting}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm disabled:opacity-50 disabled:bg-gray-100 ${
              validationErrors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-brown-500 focus:ring-brown-500'
            }`}
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            スラッグ
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              type="text"
              name="slug"
              id="slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
              maxLength={100}
              pattern="^[a-z0-9-]+$"
              disabled={isSubmitting}
              className={`block w-full rounded-md shadow-sm sm:text-sm disabled:opacity-50 disabled:bg-gray-100 ${
                validationErrors.slug
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-brown-500 focus:ring-brown-500'
              }`}
            />
            {!category && (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAutoSlug}
                  onChange={(e) => setIsAutoSlug(e.target.checked)}
                  disabled={isSubmitting}
                  className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 rounded disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">自動生成</span>
              </label>
            )}
          </div>
          {validationErrors.slug && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.slug}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            URLの一部として使用されます。半角英数字とハイフンのみ使用可能です。
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 disabled:opacity-50 disabled:hover:bg-brown-600"
        >
          {isSubmitting ? '保存中...' : submitLabel}
        </button>
      </div>
    </form>
  )
} 