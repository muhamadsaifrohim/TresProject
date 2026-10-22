// Alamat dasar API Laravel. Ganti kalau port/domainnya beda.
const API_URL = 'http://tres-project-api.test/api'

export type ApiUser = {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
}

type ApiErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(status: number, body: ApiErrorBody) {
    super(body.message ?? 'Terjadi kesalahan, coba lagi.')
    this.status = status
    this.errors = body.errors
  }
}

// Dipanggil tiap request supaya token yang paling baru selalu terpakai
function getToken(): string | null {
  return localStorage.getItem('lostnfound:token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  // PERUBAHAN PENTING DI SINI:
  // Kita harus mengecek apakah data (body) yang dikirim adalah FormData atau bukan.
  const isFormData = options.body instanceof FormData

  // Siapkan headers dasar
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  // Jika BUKAN FormData (berarti data biasa/JSON), baru kita tambahkan Content-Type: application/json.
  // Jika FormData, BROWSER yang akan otomatis mengatur Content-Type menjadi 'multipart/form-data' beserta 'boundary'-nya.
  // JANGAN set Content-Type secara manual jika menggunakan FormData.
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  // Gabungkan headers bawaan dengan custom headers dari options (jika ada)
  const finalHeaders = {
    ...headers,
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: finalHeaders,
  })

  // 204 No Content tidak punya body untuk di-parse
  const body = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, body ?? {})
  }

  return body as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  
  // PERUBAHAN PENTING DI SINI:
  // Cek apakah 'data' itu FormData. Kalau iya, biarkan aslinya.
  // Kalau bukan, baru di-JSON.stringify().
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { 
      method: 'POST', 
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined) 
    }),
    
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { 
      method: 'PATCH', 
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined) 
    }),
    
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}