import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePaginatedItems } from '../hooks/usePaginatedItems'
import type { ItemStatus } from '../Types'
import ItemCard from './ItemCard'
import Pagination from './Pagination'

type ItemListPageProps = {
  status: ItemStatus
  title: string
  description: string
}

// Daftar kategori dummy untuk Quick Filter
const quickFilters = ['Dompet', 'Elektronik', 'Kunci', 'Tas', 'Dokumen']

// Jumlah barang per halaman
const PER_PAGE = 8

export default function ItemListPage({ status, title, description }: ItemListPageProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [page, setPage] = useState(1)

  // Kata kunci yang dikirim ke server: chip filter lebih diutamakan daripada teks pencarian
  const searchTerm = activeFilter || debouncedQuery

  const { items, meta, isLoading, error, removeItem, markResolved } = usePaginatedItems({
    status,
    page,
    search: searchTerm,
    perPage: PER_PAGE,
  })

  // Tunggu 0,4 detik setelah user berhenti mengetik, baru kirim pencarian ke server
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed === debouncedQuery) return

    const timer = setTimeout(() => {
      setDebouncedQuery(trimmed)
      setPage(1)
    }, 400)

    return () => clearTimeout(timer)
  }, [query, debouncedQuery])

  // Kalau halaman yang dibuka sudah tidak ada (misalnya item terakhir di halaman itu dihapus),
  // mundur ke halaman terakhir yang masih ada
  useEffect(() => {
    if (!isLoading && page > meta.lastPage) {
      setPage(meta.lastPage)
    }
  }, [isLoading, page, meta.lastPage])

  function handleFilterClick(filter: string) {
    setPage(1)
    if (activeFilter === filter) {
      setActiveFilter('') // Matikan filter jika diklik lagi
    } else {
      setActiveFilter(filter)
      setQuery('') // Kosongkan search bar jika pakai chip filter
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    if (activeFilter) {
      setActiveFilter('') // Matikan chip jika user mulai mengetik
      setPage(1)
    }
  }

  function handleResetSearch() {
    setQuery('')
    setDebouncedQuery('')
    setActiveFilter('')
    setPage(1)
  }

  function handlePageChange(newPage: number) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
              onChange={(e) => handleQueryChange(e.target.value)}
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
        {!isLoading && !error && (
          <div className="shrink-0 text-sm font-medium text-muted bg-white/5 px-4 py-2 rounded-lg border border-white/10">
            Total: <span className="text-accent font-bold">{meta.total}</span> barang
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
      ) : items.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} onDelete={removeItem} onMarkResolved={markResolved} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-sm text-muted">
              Menampilkan {meta.from}–{meta.to} dari {meta.total} barang
            </p>
            <Pagination
              currentPage={meta.currentPage}
              lastPage={meta.lastPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-24 text-center backdrop-blur-sm">
          <div className="mb-4 rounded-full bg-white/5 p-4 text-white/20">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          {!searchTerm ? (
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
              <p className="mt-1 text-sm text-muted max-w-sm">Tidak ada barang yang cocok dengan kata kunci "{searchTerm}".</p>
              <button onClick={handleResetSearch} className="mt-4 text-sm font-semibold text-accent hover:underline">
                Reset Pencarian
              </button>
            </>
          )}
        </div>
      )}
    </section>
  )
}