import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Lost', to: '/lost' },
  { label: 'Found', to: '/found' },
  { label: 'Report', to: '/report' },
]

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-current" aria-hidden="true">
      {/* Huruf L */}
      <path d="M1 3h3.5v15H12v3H1z" />
      {/* Huruf F */}
      <path d="M14 3h9v3h-5.5v4H22v3h-4.5v8H14z" />
    </svg>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()

  const wrapperRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const hasPlaced = useRef(false)

  // Menu mana yang sedang aktif berdasarkan URL
  const activeIndex = links.findIndex(({ to }) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`),
  )

  // Pindahkan pill kuning ke menu aktif
  const placePill = useCallback(() => {
    const pill = pillRef.current
    const item = itemRefs.current[activeIndex]
    if (!pill) return

    if (!item) {
      pill.style.opacity = '0'
      return
    }
    pill.style.opacity = '1'
    pill.style.width = `${item.offsetWidth}px`
    pill.style.height = `${item.offsetHeight}px`
    pill.style.transform = `translate(${item.offsetLeft}px, ${item.offsetTop}px)`
  }, [activeIndex])

  useLayoutEffect(() => {
    const pill = pillRef.current
    if (!pill) return

    if (!hasPlaced.current) {
      // Pertama kali tampil: langsung taruh di posisi, tanpa animasi geser
      pill.style.transition = 'none'
      placePill()
      pill.getBoundingClientRect()
      pill.style.transition = ''
      hasPlaced.current = true
    } else {
      placePill()
    }
  }, [placePill])

  // Hitung ulang kalau ukuran layar / font berubah
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const observer = new ResizeObserver(placePill)
    observer.observe(wrapper)
    document.fonts.ready.then(placePill)

    return () => observer.disconnect()
  }, [placePill])

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-5 py-5 sm:flex-row sm:justify-between sm:px-8 md:px-12">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md font-logo text-xl font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <LogoMark />
          LostnFound
        </Link>

        <nav aria-label="Menu utama">
          <div ref={wrapperRef} className="relative">
            <span
              ref={pillRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 rounded-lg bg-accent opacity-0 transition-[transform,width,height,opacity] duration-300 ease-out motion-reduce:transition-none"
            />

            <ul className="flex items-center gap-1 text-sm font-semibold sm:gap-3 sm:text-base">
              {links.map(({ label, to }, index) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    ref={(el) => {
                      itemRefs.current[index] = el
                    }}
                    className={({ isActive }) =>
                      `relative z-10 block rounded-lg px-3.5 py-1.5 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        isActive ? 'text-ink' : 'text-white/85 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  )
}