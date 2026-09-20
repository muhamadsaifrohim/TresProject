import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="flex flex-1 items-center justify-center px-5 pb-24 text-center sm:px-8">
      <div className="flex max-w-3xl flex-col items-center">
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-accent sm:text-5xl md:text-6xl">
          Kehilangan Barang di Lingkungan Kampus?
        </h1>

        <p className="mt-5 max-w-2xl text-balance text-base text-muted md:text-lg">
          Klik tombol di bawah untuk melihat daftar barang hilang dan memeriksa
          apakah barangmu sudah ditemukan.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/lost"
            className="rounded-xl bg-accent px-10 py-3 text-lg font-semibold text-ink transition-colors hover:bg-[#d3c078] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Lost
          </Link>
          <Link
            to="/found"
            className="rounded-xl bg-brand px-10 py-3 text-lg font-semibold text-white transition-colors hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Found
          </Link>
        </div>
      </div>
    </section>
  )
}