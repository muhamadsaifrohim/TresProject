import { useState, useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../hooks/useAuth'
import { useItems } from '../hooks/useItems'
import type { ItemStatus } from '../Types'

// Style input dengan efek glass
const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 backdrop-blur-sm transition-all focus:border-accent focus:bg-white/10 focus:outline-none [color-scheme:dark]'
const labelClass = 'mb-2 block text-sm font-semibold text-white/80'

export default function Report() {
  const navigate = useNavigate()
  const { addItem } = useItems()

  const [status, setStatus] = useState<Exclude<ItemStatus, 'selesai'>>('lost')
  const [form, setForm] = useState({
    name: '',
    description: '',
    building: '', // <-- Tambahan state untuk dropdown gedung
    room: '',     // <-- Tambahan state untuk input detail ruangan
    date: new Date().toLocaleDateString('en-CA'),
    contact: '',
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, dll).')
      return
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 2MB.')
      return
    }

    setError('')
    setImageFile(file)
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }
  
  function handleRemoveImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('status', status)
      formData.append('name', form.name.trim())
      formData.append('description', form.description.trim())
      
      // Menggabungkan pilihan gedung dan detail ruangan untuk disimpan ke database
      const fullLocation = `${form.building} - ${form.room.trim()}`
      formData.append('location', fullLocation)
      
      formData.append('date', form.date)
      formData.append('contact', form.contact.trim())
      
      if (imageFile) formData.append('image', imageFile)

      await addItem(formData as any) 
      navigate(status === 'lost' ? '/lost' : '/found')
    } catch (err) {
      setError(err instanceof ApiError ? (err as ApiError).message : 'Terjadi kesalahan, coba lagi.')
      setSubmitting(false)
    }
  }

  return (
    <section className="relative mx-auto w-full max-w-3xl px-6 py-12 lg:px-8">
      {/* Dekorasi Blur Background */}
      <div className="absolute top-20 left-0 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white/90">Lapor Barang</h1>
        <p className="mt-2 text-muted">Isi data secara lengkap agar mudah dikenali.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md sm:p-10 space-y-8 shadow-2xl">
        
        {/* Pilihan Status */}
        <div>
          <span className={labelClass}>Jenis Laporan</span>
          <div className="grid grid-cols-2 gap-4">
            <button
                type="button"
                onClick={() => setStatus('lost')}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  status === 'lost' 
                  ? 'bg-accent text-ink shadow-[0_0_15px_rgba(199,177,98,0.3)] border-transparent' 
                  : 'bg-white/5 border border-white/10 text-muted hover:bg-white/10'
                }`}
              >
                Saya Kehilangan Barang
            </button>
            <button
                type="button"
                onClick={() => setStatus('found')}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  status === 'found' 
                  ? 'bg-brand text-white shadow-[0_0_15px_rgba(6,69,91,0.5)] border-transparent' 
                  : 'bg-white/5 border border-white/10 text-muted hover:bg-white/10'
                }`}
              >
                Saya Menemukan Barang
            </button>
          </div>
        </div>

        {/* Info Barang */}
        <div className="space-y-5 border-t border-white/10 pt-6">
          <div>
            <label htmlFor="name" className={labelClass}>Nama Barang</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Contoh: Dompet kulit hitam" className={inputClass} />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Deskripsi Detail</label>
            <textarea id="description" name="description" required rows={3} value={form.description} onChange={handleChange} placeholder="Sebutkan ciri-ciri khusus, merek, warna, atau isi di dalamnya..." className={inputClass} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            
            {/* Lokasi Gedung (Dropdown) */}
            <div>
              <label htmlFor="building" className={labelClass}>Pilih Gedung</label>
              <div className="relative">
                <select
                  id="building"
                  name="building"
                  required
                  value={form.building}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                >
                  <option value="" disabled className="bg-[#0b1216] text-white">Pilih Gedung...</option>
                  <option value="Gedung Kemang" className="bg-[#0b1216] text-white">Gedung Kemang</option>
                  <option value="Gedung Sudirman" className="bg-[#0b1216] text-white">Gedung Sudirman</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Lokasi Detail / Ruangan (Teks Bebas) */}
            <div>
              <label htmlFor="room" className={labelClass}>Detail Ruangan / Tempat</label>
              <input 
                id="room" 
                name="room" 
                required 
                value={form.room} 
                onChange={handleChange} 
                placeholder="Contoh: Kantin, Lab Komputer, Toilet lantai 2" 
                className={inputClass} 
              />
            </div>
            
            {/* Tanggal Kejadian */}
            <div>
              <label htmlFor="date" className={labelClass}>Tanggal Kejadian</label>
              <input id="date" name="date" type="date" required max={new Date().toLocaleDateString('en-CA')} value={form.date} onChange={handleChange} className={inputClass} />
            </div>

            {/* Info Kontak */}
            <div>
              <label htmlFor="contact" className={labelClass}>Info Kontak (WA / Email)</label>
              <input id="contact" name="contact" required value={form.contact} onChange={handleChange} placeholder="Contoh: 0812-xxxx-xxxx" className={inputClass} />
            </div>
            
          </div>
        </div>

        {/* Upload Foto */}
        <div className="border-t border-white/10 pt-6">
          <span className={labelClass}>Foto Barang (Sangat Disarankan)</span>
          
          {!imagePreview ? (
            <div 
              className="group relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-sm transition-all hover:border-accent/50 hover:bg-white/[0.05]"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="rounded-full bg-white/5 p-4 text-muted group-hover:text-accent transition-colors">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-center">
                <span className="font-bold text-accent">Klik untuk upload foto</span>
                <p className="mt-1 text-xs text-muted">Maksimal 2MB (JPG, PNG, WEBP)</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} className="hidden" />
            </div>
          ) : (
            <div className="relative mt-2 overflow-hidden rounded-xl border border-white/10 bg-black/50 p-2">
              <img src={imagePreview} alt="Preview" className="h-64 w-full rounded-lg object-contain" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-4 top-4 rounded-full bg-black/70 p-2 text-white backdrop-blur-md transition-colors hover:bg-red-500"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-accent py-4 text-lg font-bold text-ink transition-all hover:scale-[1.02] hover:bg-[#d3c078] hover:shadow-[0_0_20px_rgba(199,177,98,0.3)] disabled:pointer-events-none disabled:opacity-60"
        >
          {submitting ? 'Memproses Laporan...' : 'Kirim Laporan'}
        </button>
      </form>
    </section>
  )
}