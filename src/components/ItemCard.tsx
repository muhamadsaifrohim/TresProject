import type { Item } from '../Types'

type ItemCardProps = {
  item: Item
  onDelete: (id: string) => void
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function PhotoPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center text-white/25">
      <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M21 8 12 3 3 8m18 0-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function ItemCard({ item, onDelete }: ItemCardProps) {
  const isLost = item.status === 'lost'

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <PhotoPlaceholder />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span
          className={`w-fit rounded-md px-2.5 py-1 text-xs font-semibold ${
            isLost ? 'bg-accent text-ink' : 'bg-brand text-white'
          }`}
        >
          {isLost ? 'Hilang' : 'Ditemukan'}
        </span>

        <h3 className="mt-3 text-lg font-bold">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>

        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex gap-3">
            <dt className="w-14 shrink-0 text-muted">Lokasi</dt>
            <dd>{item.location}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-14 shrink-0 text-muted">Tanggal</dt>
            <dd>{formatDate(item.date)}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-14 shrink-0 text-muted">Kontak</dt>
            <dd className="break-words">{item.contact}</dd>
          </div>
        </dl>

        <div className="mt-auto flex justify-end pt-5">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Hapus laporan "${item.name}"?`)) onDelete(item.id)
            }}
            className="rounded-md text-sm text-muted underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Hapus
          </button>
        </div>
      </div>
    </article>
  )
}