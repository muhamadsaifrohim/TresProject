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

// Daftar kategori dummy untuk Quick Filter
const quickFilters = ['Dompet', 'Elektronik', 'Kunci', 'Tas', 'Dokumen']

export default function ItemListPage({ status, title, description }: ItemListPageProps) {
  const { items, isLoading, error, removeItem, markResolved } = useItems()
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('')

  const itemsByStatus = items.filter((item) => item.status === status)

  // Filter berdasarkan teks ATAU chip filter yang aktif
  const visibleItems = itemsByStatus.filter((item) => {
    const keyword = query.trim().toLowerCase()
    const matchesQuery =
      item.name.toLowerCase().includes(keyword) ||
      item.location.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    
    const matchesFilter = activeFilter ? item.name.toLowerCase().includes(activeFilter.toLowerCase()) || item.description.toLowerCase().includes(activeFilter.toLowerCase()) : true

    return matchesQuery && matchesFilter
  })

  function handleFilterClick(filter: string) {
    if (activeFilter === filter) {
      setActiveFilter('') // Matikan filter jika diklik lagi
    } else {
      setActiveFilter(filter)
      setQuery('') // Kosongkan search bar jika pakai chip filter
    }
  }

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
      {/* Dekorasi Background */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-brand/10 blur-[100px]" />

      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-white/90">{title}</h1>
        <p className="mt-3 text-lg text-muted max-w-2xl">{description}</p>
      </div>

      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        
        {/* Area Pencarian & Filter */}
        <div className="w-full sm:max-w-xl space-y-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-5 w-5 text-muted" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveFilter('') // Matikan chip jika user mulai mengetik
              }}
              placeholder="Cari nama barang atau lokasi..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-white/30 backdrop-blur-sm transition-colors focus:border-accent focus:bg-white/10 focus:outline-none"
            />
          </div>

          {/* Quick Filters (Chips) */}
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`rounded-full border px-4 py-1 text-xs font-semibold transition-all ${
                  activeFilter === filter
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-white/10 bg-white/5 text-muted hover:border-white/30 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        {!isLoading && (
          <div className="shrink-0 text-sm font-medium text-muted bg-white/5 px-4 py-2 rounded-lg border border-white/10">
            Total: <span className="text-accent font-bold">{visibleItems.length}</span> barang
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="mt-20 flex flex-col items-center justify-center space-y-4">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-accent" />
           <p className="text-muted">Memuat data...</p>
        </div>
      ) : error ? (
        <p className="mt-10 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400 backdrop-blur-sm">
          {error}
        </p>
      ) : visibleItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleItems.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={removeItem} onMarkResolved={markResolved} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-24 text-center backdrop-blur-sm">
           <div className="mb-4 rounded-full bg-white/5 p-4 text-white/20">
             <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
             </svg>
           </div>
          {itemsByStatus.length === 0 ? (
            <>
              <h3 className="text-lg font-bold text-white/80">Belum ada data</h3>
              <p className="mt-1 text-sm text-muted max-w-sm">Jadilah yang pertama melaporkan barang di kategori ini.</p>
              <Link to="/report" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 font-bold text-ink transition-transform hover:scale-105 hover:bg-[#d3c078]">
                Buat Laporan Baru
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-white/80">Tidak ditemukan</h3>
              <p className="mt-1 text-sm text-muted max-w-sm">Tidak ada barang yang cocok dengan kata kunci "{query}" atau filter yang dipilih.</p>
              <button onClick={() => { setQuery(''); setActiveFilter(''); }} className="mt-4 text-sm font-semibold text-accent hover:underline">Reset Pencarian</button>
            </>
          )}
        </div>
      )}
    </section>
  )
}