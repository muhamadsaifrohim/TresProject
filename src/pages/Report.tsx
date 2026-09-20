import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import { canUploadImage, uploadImage } from '../lib/uploadImage'
import type { ItemStatus } from '../Types'

const MAX_PHOTO_SIZE = 5 * 1024 * 1024 // 5 MB

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-accent [color-scheme:dark]'
const labelClass = 'mb-1.5 block text-sm font-semibold'

export default function Report() {
  const navigate = useNavigate()
  const { addItem } = useItems()

  const [status, setStatus] = useState<ItemStatus>('lost')
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    date: new Date().toLocaleDateString('en-CA'), // tanggal hari ini (YYYY-MM-DD)
    contact: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (file && file.size > MAX_PHOTO_SIZE) {
      setError('Ukuran foto maksimal 5 MB.')
      e.target.value = ''
      setPhoto(null)
      return
    }
    setError('')
    setPhoto(file)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // 1. Kalau ada foto, upload dulu ke API dan ambil link-nya
      const imageUrl = photo ? await uploadImage(photo) : undefined

      // 2. Simpan laporan ke localStorage
      addItem({
        status,
        name: form.name.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        date: form.date,
        contact: form.contact.trim(),
        imageUrl,
      })

      // 3. Pindah ke halaman daftar yang sesuai
      navigate(status === 'lost' ? '/lost' : '/found')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, coba lagi.')
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Lapor Barang</h1>
      <p className="mt-2 text-muted">Isi data barang yang hilang atau yang kamu temukan.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <span className={labelClass}>Jenis laporan</span>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ['lost', 'Saya kehilangan barang'],
                ['found', 'Saya menemukan barang'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={status === value}
                onClick={() => setStatus(value)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  status === value
                    ? 'bg-accent text-ink'
                    : 'border border-white/15 text-white/85 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="name" className={labelClass}>Nama barang</label>
          <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Contoh: Dompet kulit hitam" className={inputClass} />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Deskripsi</label>
          <textarea id="description" name="description" required rows={3} value={form.description} onChange={handleChange} placeholder="Ciri-ciri barang, isi, warna, merek..." className={inputClass} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className={labelClass}>Lokasi</label>
            <input id="location" name="location" required value={form.location} onChange={handleChange} placeholder="Contoh: Kantin" className={inputClass} />
          </div>
          <div>
            <label htmlFor="date" className={labelClass}>Tanggal</label>
            <input id="date" name="date" type="date" required max={new Date().toLocaleDateString('en-CA')} value={form.date} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="contact" className={labelClass}>Kontak</label>
          <input id="contact" name="contact" required value={form.contact} onChange={handleChange} placeholder="No. WhatsApp atau email" className={inputClass} />
          <p className="mt-1.5 text-xs text-muted">Kontak akan tampil di kartu barang supaya mudah dihubungi.</p>
        </div>

        <div>
          <label htmlFor="photo" className={labelClass}>Foto (opsional)</label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            disabled={!canUploadImage}
            onChange={handlePhoto}
            className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-white/15 disabled:opacity-50"
          />
          {!canUploadImage && (
            <p className="mt-1.5 text-xs text-muted">
              Upload foto belum aktif. Isi VITE_IMGBB_API_KEY di file .env.local, lalu jalankan ulang npm run dev.
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-accent px-10 py-3 text-lg font-semibold text-ink transition-colors hover:bg-[#d3c078] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Menyimpan...' : 'Kirim laporan'}
        </button>
      </form>
    </section>
  )
}