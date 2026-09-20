// Upload foto ke ImgBB (https://api.imgbb.com) memakai API key.
// API key disimpan di file .env.local dengan nama VITE_IMGBB_API_KEY
const API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string | undefined

export const canUploadImage = Boolean(API_KEY)

export async function uploadImage(file: File): Promise<string> {
  if (!API_KEY) {
    throw new Error('API key belum diisi. Cek file .env.local kamu.')
  }

  const body = new FormData()
  body.append('image', file)

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
    method: 'POST',
    body,
  })

  if (!response.ok) {
    throw new Error('Upload foto gagal. Cek API key atau coba lagi.')
  }

  const result = await response.json()
  return result.data.url as string
}