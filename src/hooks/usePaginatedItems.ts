import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Item, ItemStatus, Paginated } from '../Types'

type Params = {
  status: ItemStatus
  page: number
  search: string
  perPage?: number
}

type PageMeta = {
  currentPage: number
  lastPage: number
  total: number
  from: number | null
  to: number | null
}

export function usePaginatedItems({ status, page, search, perPage = 8 }: Params) {
  const [items, setItems] = useState<Item[]>([])
  const [meta, setMeta] = useState<PageMeta>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: null,
    to: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  // Dinaikkan setiap kali data perlu dimuat ulang (setelah hapus / tandai selesai)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    // Penanda supaya respons request lama tidak menimpa request yang lebih baru
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError('')
      try {
        const params = new URLSearchParams({
          status,
          page: String(page),
          per_page: String(perPage),
        })
        if (search.trim()) params.set('search', search.trim())

        const result = await api.get<Paginated<Item>>(`/items?${params.toString()}`)
        if (cancelled) return

        setItems(result.data)
        setMeta({
          currentPage: result.current_page,
          lastPage: result.last_page,
          total: result.total,
          from: result.from,
          to: result.to,
        })
      } catch {
        if (!cancelled) setError('Gagal memuat data. Coba muat ulang halaman.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [status, page, search, perPage, reloadKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  const markResolved = useCallback(async (id: number) => {
    await api.patch<Item>(`/items/${id}`)
    setReloadKey((key) => key + 1)
  }, [])

  const removeItem = useCallback(async (id: number) => {
    await api.delete(`/items/${id}`)
    setReloadKey((key) => key + 1)
  }, [])

  return { items, meta, isLoading, error, reload, markResolved, removeItem }
}