import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import type { ItemStatus } from '../Types'
import ItemCard from './ItemCard'

type ItemListPageProps = {
  status: ItemStatus
  title: string
  description: string
}

export default function ItemListPage({ status, title, description }: ItemListPageProps) {
  const { items, removeItem } = useItems()
  const [query, setQuery] = useState('')

  const itemsByStatus = items.filter((item) => item.status === status)

  const keyword = query.trim().toLowerCase()
  const visibleItems = itemsByStatus.filter(
    (item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.location.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword),
  )

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 md:px-12">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-2 text-muted">{description}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama barang atau lokasi..."
          aria-label="Cari barang"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-accent sm:max-w-sm"
        />
        <p className="text-sm text-muted">{visibleItems.length} barang</p>
      </div>

      {visibleItems.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={removeItem} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
          {itemsByStatus.length === 0 ? (
            <>
              <p className="text-muted">Belum ada laporan di sini.</p>
              <Link
                to="/report"
                className="mt-4 inline-block rounded-xl bg-accent px-6 py-2.5 font-semibold text-ink transition-colors hover:bg-[#d3c078]"
              >
                Buat laporan
              </Link>
            </>
          ) : (
            <p className="text-muted">Tidak ada barang yang cocok dengan “{query}”.</p>
          )}
        </div>
      )}
    </section>
  )
}