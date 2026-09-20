import { useCallback, useState } from 'react'
import { seedItems } from '../data/seedItems'
import type { Item, NewItem } from '../Types'

const STORAGE_KEY = 'lostnfound:items'

// Baca data dari localStorage. Kalau belum ada / rusak, pakai data contoh.
function readItems(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return seedItems

    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Item[]) : seedItems
  } catch {
    return seedItems
  }
}

// Simpan data ke localStorage (bentuknya harus string, jadi diubah pakai JSON.stringify)
function writeItems(items: Item[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // penyimpanan penuh atau diblokir browser: abaikan
  }
}

export function useItems() {
  const [items, setItems] = useState<Item[]>(readItems)

  const addItem = useCallback((data: NewItem): Item => {
    const item: Item = {
      ...data,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    }
    const next = [item, ...readItems()]
    writeItems(next)
    setItems(next)
    return item
  }, [])

  const removeItem = useCallback((id: string) => {
    const next = readItems().filter((item) => item.id !== id)
    writeItems(next)
    setItems(next)
  }, [])

  return { items, addItem, removeItem }
}