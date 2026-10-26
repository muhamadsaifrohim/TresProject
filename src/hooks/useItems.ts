import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Item, NewItem, Paginated } from '../Types'

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      // Respons sekarang berbentuk pagination, data barangnya ada di properti "data"
      const result = await api.get<Paginated<Item>>('/items?per_page=50')
      setItems(result.data)
    } catch {
      setError('Gagal memuat data. Coba muat ulang halaman.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const addItem = useCallback(async (data: NewItem) => {
    const item = await api.post<Item>('/items', data)
    setItems((prev) => [item, ...prev])
    return item
  }, [])

  const markResolved = useCallback(async (id: number) => {
    const updated = await api.patch<Item>(`/items/${id}`)
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
  }, [])

  const removeItem = useCallback(async (id: number) => {
    await api.delete(`/items/${id}`)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { items, isLoading, error, addItem, markResolved, removeItem, reload }
}