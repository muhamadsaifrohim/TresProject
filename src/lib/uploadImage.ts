const API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string | undefined

const UPLOAD_ENABLED: boolean = false

export const canUploadImage = UPLOAD_ENABLED && Boolean(API_KEY)

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