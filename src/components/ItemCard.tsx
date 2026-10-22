import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { Item } from '../Types'

type ItemCardProps = {
  item: Item
  onDelete: (id: number) => void
  onMarkResolved: (id: number) => void
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function PhotoPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-brand/20 text-white/20">
      <svg viewBox="0 0 24 24" className="h-12 w-12 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

const statusConfig: Record<Item['status'], { label: string; bg: string; text: string; shadow: string }> = {
  lost: { label: 'Hilang', bg: 'bg-accent', text: 'text-ink', shadow: 'shadow-[0_0_10px_rgba(199,177,98,0.5)]' },
  found: { label: 'Ditemukan', bg: 'bg-brand', text: 'text-white', shadow: 'shadow-[0_0_10px_rgba(6,69,91,0.5)]' },
  selesai: { label: 'Selesai', bg: 'bg-white/20', text: 'text-white', shadow: '' },
}

export default function ItemCard({ item, onDelete, onMarkResolved }: ItemCardProps) {
  const { isAdmin } = useAuth()
  const [busy, setBusy] = useState<'delete' | 'resolve' | null>(null)
  const isDone = item.status === 'selesai'
  const config = statusConfig[item.status]

  async function handleDelete() {
    if (!window.confirm(`Hapus laporan "${item.name}"?`)) return
    setBusy('delete')
    try {
      await onDelete(item.id)
    } finally {
      setBusy(null)
    }
  }

  async function handleResolve() {
    setBusy('resolve')
    try {
      await onMarkResolved(item.id)
    } finally {
      setBusy(null)
    }
  }

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/[0.05] ${isDone ? 'opacity-70 grayscale-[30%]' : ''}`}>
      {/* Area Gambar */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/5">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <PhotoPlaceholder />
        )}
        
        {/* Badge Status (Pojok Kiri Atas Foto) */}
        <div className="absolute left-3 top-3 z-10">
           <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} ${config.shadow}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Area Konten */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-white/90 line-clamp-1">{item.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{item.description}</p>

        {/* Info Cepat (Ikon) */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-2 text-xs font-medium text-muted">
          <div className="flex items-start gap-2">
            <span className="text-lg leading-none shrink-0">📍</span> 
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none shrink-0">🕒</span> 
            <span>{formatDate(item.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none shrink-0">📞</span> 
            <span className="truncate">{item.contact}</span>
          </div>
        </div>

        {/* Tombol Aksi Admin */}
        {isAdmin && (
          <div className="mt-auto flex justify-end gap-3 pt-5">
            {!isDone && (
              <button
                type="button"
                disabled={busy !== null}
                onClick={handleResolve}
                className="rounded-md bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-ink disabled:opacity-50"
              >
                {busy === 'resolve' ? 'Menyimpan...' : 'Tandai Selesai'}
              </button>
            )}
            <button
              type="button"
              disabled={busy !== null}
              onClick={handleDelete}
              className="rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
            >
              {busy === 'delete' ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}