import { Link, useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  // Fungsi untuk fitur pencarian cepat
  const handleQuickSearch = (keyword: string) => {
    // Arahkan ke halaman lost dan (idealnya) set keyword pencarian.
    // Karena saat ini ItemListPage menggunakan state lokal untuk pencarian,
    // kita cukup arahkan ke halaman /lost sebagai jalan pintas.
    navigate('/lost')
  }

  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12 sm:px-12 md:py-20">
      {/* --- Injeksi CSS Khusus Animasi --- */}
      <style>{`
        .glass-panel { 
          background: rgba(255, 255, 255, 0.03); 
          backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08); 
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out 3s infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-15px) rotate(calc(var(--tw-rotate) + 2deg)); }
          100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
        }
      `}</style>

      {/* --- Pendaran Cahaya Background --- */}
      <div 
        className="absolute -right-20 -top-20 -z-10 h-[500px] w-[500px] rounded-full sm:h-[700px] sm:w-[700px]" 
        style={{ background: 'radial-gradient(circle, rgba(199,177,98,0.12) 0%, rgba(11,18,22,0) 60%)' }}
      />
      <div 
        className="absolute -bottom-20 -left-20 -z-10 h-[400px] w-[400px] rounded-full sm:h-[600px] sm:w-[600px]" 
        style={{ background: 'radial-gradient(circle, rgba(6,69,91,0.2) 0%, rgba(11,18,22,0) 60%)' }}
      />

      {/* --- Konten Utama --- */}
      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-8">
        
        {/* Kolom Kiri: Teks & Aksi */}
        <div className="relative z-10 flex flex-col space-y-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Kehilangan <br className="hidden lg:block" /> Sesuatu? <br />
            <span className="bg-gradient-to-r from-accent to-[#e8d591] bg-clip-text text-transparent">
              Jangan Panik.
            </span>
          </h1>
          
          <p className="mx-auto max-w-lg text-base leading-relaxed text-muted lg:mx-0 lg:text-lg">
            Ribuan mata siap membantu. Laporkan barangmu yang hilang di area kampus, atau jadilah pahlawan dengan melaporkan barang yang kamu temukan.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start pt-2">
            <Link
              to="/report"
              className="rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-ink shadow-[0_0_20px_rgba(199,177,98,0.25)] transition-all hover:scale-105 hover:bg-[#d3c078] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Lapor Kehilangan
            </Link>
            <Link
              to="/report"
              className="glass-panel rounded-xl px-8 py-3.5 text-base font-bold text-white transition-all hover:scale-105 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Lapor Penemuan
            </Link>
          </div>

          {/* Quick Filters */}
          <div className="mt-8 border-t border-white/10 pt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              Pencarian Cepat
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 lg:justify-start text-sm text-muted">
              {[
                { label: 'Dompet', icon: '💳' },
                { label: 'Elektronik', icon: '📱' },
                { label: 'Kunci', icon: '🔑' },
                { label: 'Dokumen', icon: '📄' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleQuickSearch(item.label)}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 transition-colors hover:border-accent hover:text-accent"
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Visual Kartu Melayang */}
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center aspect-square lg:max-w-full">
          {/* Lingkaran blur di belakang kartu */}
          <div className="absolute h-3/4 w-3/4 rounded-full bg-brand/30 blur-[80px]"></div>

          {/* Kartu 1: Found (Di Belakang) */}
          <div className="glass-panel animate-float-delayed absolute right-4 top-4 z-0 w-[55%] rotate-6 rounded-2xl p-3 shadow-2xl sm:right-10 sm:top-10 sm:p-4">
            <div className="relative mb-3 flex h-20 items-center justify-center overflow-hidden rounded-xl bg-white/5 sm:h-28 sm:mb-4">
               <svg className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <span className="rounded-md bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Ditemukan</span>
            <h3 className="mt-2 text-xs font-bold sm:text-sm">Kunci Motor Honda</h3>
            <p className="mt-1 text-[10px] text-muted sm:text-xs">Area parkir FEB</p>
          </div>

          {/* Kartu 2: Lost (Di Depan, Fokus Utama) */}
          <div className="glass-panel animate-float absolute z-10 w-[70%] -rotate-3 rounded-2xl border-white/20 bg-[#0b1216]/80 p-4 shadow-2xl sm:w-80 sm:p-5">
            <div className="relative mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-white/10 sm:h-40">
              <svg className="h-10 w-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <span className="rounded-md bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow-[0_0_10px_rgba(199,177,98,0.5)]">Hilang</span>
            <h3 className="mt-3 text-base font-bold text-white sm:text-lg md:text-xl">Dompet Kulit Hitam</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">Hilang di sekitar perpustakaan lantai 2. Berisi KTP, KTM, dan kartu penting.</p>
            
            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-[10px] font-medium text-muted sm:mt-5 sm:text-xs">
              <div className="flex items-center gap-2"><span className="text-sm sm:text-lg">📍</span> Perpustakaan Pusat</div>
              <div className="flex items-center gap-2"><span className="text-sm sm:text-lg">🕒</span> Hari ini, 10:30 WIB</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}