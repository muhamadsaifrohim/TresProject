export type ItemStatus = 'lost' | 'found' | 'selesai'

export type Item = {
  id: number
  status: ItemStatus
  name: string
  description: string
  location: string
  date: string
  contact: string
  image_url: string | null
  user_id: number | null
  created_at: string
  updated_at: string
}

// Data dari form (field yang dikirim ke server saat bikin laporan baru)
export type NewItem = {
  status: 'lost' | 'found'
  name: string
  description: string
  location: string
  date: string
  contact: string
  image_url?: string
}

// Bentuk respons dari Laravel paginate()
export type Paginated<T> = {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}