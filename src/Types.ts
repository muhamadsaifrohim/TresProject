export type ItemStatus = 'lost' | 'found'

export type Item = {
  id: string
  status: ItemStatus // 'lost' = barang hilang, 'found' = barang ditemukan
  name: string
  description: string
  location: string
  date: string // format YYYY-MM-DD
  contact: string
  imageUrl?: string
  createdAt: number
}

// Data dari form (id dan createdAt dibuat otomatis)
export type NewItem = Omit<Item, 'id' | 'createdAt'>