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

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
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
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}