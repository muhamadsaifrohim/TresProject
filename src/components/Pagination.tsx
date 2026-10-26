type PaginationProps = {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

// Menghasilkan daftar nomor halaman, contoh: [1, '...', 4, 5, 6, '...', 12]
function getPageNumbers(current: number, last: number): (number | '...')[] {
  if (last <= 7) {
    return Array.from({ length: last }, (_, index) => index + 1)
  }

  const pages: (number | '...')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)

  if (start > 2) pages.push('...')
  for (let page = start; page <= end; page++) pages.push(page)
  if (end < last - 1) pages.push('...')

  pages.push(last)
  return pages
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  // Kalau hanya ada satu halaman, tidak perlu menampilkan pagination
  if (lastPage <= 1) return null

  const pages = getPageNumbers(currentPage, lastPage)
  const baseButton = 'min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors'
  const idleButton = 'border-white/10 bg-white/5 text-muted hover:border-white/30 hover:text-white'
  const disabledButton = 'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-muted'

  return (
    <nav aria-label="Navigasi halaman" className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButton} ${idleButton} ${disabledButton}`}
      >
        Sebelumnya
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`dots-${index}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`${baseButton} ${
              page === currentPage ? 'border-accent bg-accent/20 text-accent' : idleButton
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className={`${baseButton} ${idleButton} ${disabledButton}`}
      >
        Berikutnya
      </button>
    </nav>
  )
}