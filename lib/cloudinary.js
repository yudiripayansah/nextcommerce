const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(file, folder = 'media') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  if (!res.ok) throw new Error('Upload gagal')
  const data = await res.json()

  return {
    url: data.secure_url,
    publicId: data.public_id,
    name: data.original_filename || file.name,
    size: data.bytes,
    format: data.format,
    width: data.width || 0,
    height: data.height || 0,
  }
}
