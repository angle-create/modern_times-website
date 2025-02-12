'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  productName: string
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  productName,
}: DeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const router = useRouter()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [isOpen])

  async function handleConfirm() {
    try {
      await onConfirm()
      onClose()
      router.refresh()
    } catch (error) {
      console.error('削除に失敗しました:', error)
      // TODO: エラー表示の実装
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg shadow-xl p-0 backdrop:bg-gray-500/50"
      onClose={onClose}
    >
      <div className="w-[400px]">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">商品の削除</h3>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-gray-600">
            「{productName}」を削除してもよろしいですか？
            <br />
            この操作は取り消せません。
          </p>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            削除する
          </button>
        </div>
      </div>
    </dialog>
  )
} 