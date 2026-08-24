import { useState } from 'react'
// ponytail: kredensial lewat .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
// Anon key memang publik di client — keamanan ditangani RLS policy sisi Supabase.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

async function uploadSertifikat(file: File): Promise<string> {
  const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/pendaftaran/${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  })
  if (!res.ok) throw new Error('Upload sertifikat gagal')
  return path
}

async function insertPendaftaran(d: Record<string, string>, sertifikat: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pendaftaran`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ ...d, sertifikat }),
  })
  if (!res.ok) throw new Error('Simpan pendaftaran gagal')
}

function Register() {
  const input =
    'liquid-glass w-full rounded-md px-4 py-2.5 text-base sm:text-sm'
  const label = 'block text-left text-sm font-medium text-foreground mb-1.5'
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error('.env belum di-set — restart dev server')
      const f = e.currentTarget
      const d = Object.fromEntries(new FormData(f)) as Record<string, string>
      const file = (f.elements.namedItem('sertifikat_ldkm') as HTMLInputElement).files?.[0]
      const sertifikat = file ? await uploadSertifikat(file) : null
      await insertPendaftaran(
        { nama: d.nama, email: d.email, prodi: d.prodi, github: d.github, linkedin: d.linkedin, wa: d.wa, ttl: d.ttl, divisi: d.divisi },
        sertifikat ?? '',
      )
      setStatus('done')
    } catch (err) {
      console.error('Pendaftaran gagal:', err)
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <section className="relative z-10 mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center px-4 text-center">
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">Pendaftaran Terkirim</h2>
        <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">
          Data dan Sertifikat LDKM kamu sudah kami terima. Pantau WhatsApp dan email kamu untuk info tahap selanjutnya.
        </p>
      </section>
    )
  }

  return (
    <section className="relative z-10 mx-auto w-full max-w-md px-4 py-4 text-center sm:max-w-lg sm:px-6 sm:py-8">
      <h2 className="text-xl font-display font-normal text-foreground mb-4 sm:text-2xl">
        Pendaftaran BEM FILKOM
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={label}>Nama Lengkap</label>
          <input name="nama" type="text" required className={input} placeholder="Masukkan nama lengkap" />
        </div>
        <div>
          <label className={label}>Email</label>
          <input name="email" type="email" required className={input} placeholder="contoh@email.com" />
        </div>
        <div>
          <label className={label}>Program Studi</label>
          <select name="prodi" className={input}>
            <option value="Ilmu Komputer">Ilmu Komputer</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Github</label>
            <input name="github" type="text" className={input} placeholder="@username" />
          </div>
          <div>
            <label className={label}>Linkedin</label>
            <input name="linkedin" type="text" className={input} placeholder="/in/username" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Nomer Whatsapp</label>
            <input name="wa" type="tel" required className={input} placeholder="08xxxxxxxxx" />
          </div>
          <div>
            <label className={label}>Tempat, Tanggal Lahir</label>
            <input name="ttl" type="text" required className={input} placeholder="Bandung, 15 Agustus 2005" />
          </div>
        </div>
        <fieldset>
          <legend className={label}>Divisi</legend>
          {/* ponytail: 2x2 pill grid agar satu layar; jadi list vertikal kalau label makin panjang */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {['Peninfo', 'Netkomas', 'PSDM', 'Himpunan'].map((d) => (
              <label
                key={d}
                className="liquid-glass flex cursor-pointer select-none items-center justify-center gap-2 rounded-md px-3 py-2.5 text-base sm:text-sm"
              >
                <input type="radio" name="divisi" value={d} required className="accent-white" />
                {d}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label className={label}>Sertifikat LDKM</label>
          <input
            type="file"
            name="sertifikat_ldkm"
            required
            accept="image/png,image/jpeg,image/webp"
            className="liquid-glass w-full rounded-md px-4 py-2 text-base text-muted-foreground sm:text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-foreground"
          />
        </div>
        {status === 'error' && (
          <p className="text-left text-xs text-red-400">
            Gagal mengirim. Periksa koneksi lalu coba lagi, atau hubungi panitia lewat WhatsApp di bawah.
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="liquid-glass text-foreground w-full cursor-pointer rounded-md px-6 py-3 text-base font-medium transition-transform not-disabled:hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 sm:text-sm"
        >
          {status === 'sending' ? 'Mengirim...' : 'Kirim Pendaftaran'}
        </button>
        <p className="text-sm text-muted-foreground">
          Ada pertanyaan?{' '}
          <a
              href="https://wa.me/6285771082758"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Hubungin WhatsApp
          </a>
        </p>
      </form>
    </section>
  )
}


export default Register