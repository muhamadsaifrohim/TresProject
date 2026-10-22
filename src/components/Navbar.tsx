import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Lost', to: '/lost' },
  { label: 'Found', to: '/found' },
  { label: 'Report', to: '/report' },
  { label: 'History', to: '/history' },
]

function LogoMark() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-ink">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M1 3h3.5v15H12v3H1z" />
        <path d="M14 3h9v3h-5.5v4H22v3h-4.5v8H14z" />
      </svg>
    </div>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, isAdmin, logout } = useAuth()

  const wrapperRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const hasPlaced = useRef(false)

  const activeIndex = links.findIndex(({ to }) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`),
  )

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
      pill.style.transition = 'none'
      placePill()
      pill.getBoundingClientRect()
      pill.style.transition = ''
      hasPlaced.current = true
    } else {
      placePill()
    }
  }, [placePill])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const observer = new ResizeObserver(placePill)
    observer.observe(wrapper)
    document.fonts.ready.then(placePill)

    return () => observer.disconnect()
  }, [placePill])

  return (
    // Menambahkan efek glass (backdrop-blur) dan menghapus border bawah yang kaku
    <header className="sticky top-0 z-50 w-full bg-[#0b1216]/80 backdrop-blur-md border-b border-white/[0.05]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-6 py-4 sm:flex-row sm:justify-between lg:px-8">
        
        {/* LOGO (Kiri) */}
        <Link
          to="/"
          className="flex items-center gap-3 font-logo text-xl font-bold tracking-wide text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <LogoMark />
          LostnFound
        </Link>

        {/* MENU TENGAH (Lebih bersih dan menyatu) */}
        <nav aria-label="Menu utama" className="flex-1 flex justify-center">
          <div ref={wrapperRef} className="relative rounded-full bg-white/[0.03] p-1 border border-white/[0.05]">
            <span
              ref={pillRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 rounded-full bg-white/10 opacity-0 shadow-sm transition-[transform,width,height,opacity] duration-300 ease-out motion-reduce:transition-none"
            />

            <ul className="flex items-center text-sm font-medium">
              {links.map(({ label, to }, index) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    ref={(el) => {
                      itemRefs.current[index] = el
                    }}
                    className={({ isActive }) =>
                      `relative z-10 block rounded-full px-5 py-2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        isActive ? 'text-white font-semibold' : 'text-white/60 hover:text-white'
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

        {/* USER / LOGIN AREA (Kanan) */}
        <div className="flex shrink-0 items-center justify-end sm:w-48">
          {user ? (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex flex-col items-end">
                <span className="font-semibold text-white/90">{user.name}</span>
                {isAdmin && <span className="text-[10px] font-bold tracking-wider text-accent uppercase">Admin</span>}
              </div>
              <button
                type="button"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-red-500/20 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-accent"
                title="Keluar"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-ink transition-all hover:bg-[#d3c078] hover:scale-105 shadow-[0_0_15px_rgba(199,177,98,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Masuk
            </Link>
          )}
        </div>
        
      </div>
    </header>
  )
}