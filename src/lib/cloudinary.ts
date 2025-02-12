import { v2 as cloudinary } from 'cloudinary'

// Cloudinaryの設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

type UploadOptions = {
  folder: string
  allowedFormats?: string[]
  maxFileSize?: number // バイト単位
}

export async function uploadImage(
  file: Buffer,
  options: UploadOptions
): Promise<{ url: string; publicId: string }> {
  try {
    // Base64エンコード
    const base64Data = file.toString('base64')
    const dataURI = `data:image/jpeg;base64,${base64Data}`

    // Cloudinaryにアップロード
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: options.folder,
      allowed_formats: options.allowedFormats || ['jpg', 'jpeg', 'png', 'webp'],
      max_bytes: options.maxFileSize || 5 * 1024 * 1024, // デフォルト5MB
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error('Image upload error:', error)
    throw new Error('画像のアップロードに失敗しました')
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Image deletion error:', error)
    throw new Error('画像の削除に失敗しました')
  }
} 