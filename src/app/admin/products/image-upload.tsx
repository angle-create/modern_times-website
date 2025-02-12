'use client'

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <div>
      <div className="mb-4">
        {value ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="商品画像"
              fill
              className="object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-md">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
        onUpload={(result: any) => {
          if (result.event !== 'success') return
          onChange(result.info.secure_url)
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
          >
            画像をアップロード
          </button>
        )}
      </CldUploadWidget>
    </div>
  )
} 