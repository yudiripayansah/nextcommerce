'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import MediaPicker from '@/components/admin/MediaPicker'
import { useAuth } from '@/contexts/AuthContext'
import { getSettings, saveSettings } from '@/services/settings'
import { toast } from 'react-hot-toast'

const DEFAULT_CONTENT = {
  announcement: 'Pesan via WhatsApp — Gratis Ongkir seluruh Indonesia',
  hero: {
    badge: '✨ Koleksi Terbaru',
    title: '',
    subtitle: '',
    ctaText: 'Belanja Sekarang',
    image: '',
  },
  collectionsTitle: 'Belanja Berdasarkan Kategori',
  productsTitle: 'Produk Terbaru',
  about: {
    title: 'Tentang Kami',
    text: 'Kami berkomitmen menghadirkan produk berkualitas tinggi dengan harga terjangkau langsung untuk Anda.',
    image: '',
  },
  promo: {
    title: 'Gratis Ongkir Seluruh Indonesia!',
    text: 'Untuk setiap pembelian di atas Rp200.000. Pesan sekarang, dikirim hari ini!',
    ctaText: 'Mulai Belanja Sekarang',
  },
  features: [
    { icon: '🚀', title: 'Pengiriman Cepat', desc: 'Pesanan diproses dalam 1x24 jam ke seluruh Indonesia' },
    { icon: '🔄', title: 'Tukar 7 Hari', desc: 'Tidak pas? Tukar ukuran gratis dalam 7 hari setelah terima' },
    { icon: '✅', title: 'Kualitas Terjamin', desc: 'Setiap produk dicek kualitasnya sebelum dikirim ke kamu' },
  ],
  footerTagline: '',
}

function merge(defaults, saved) {
  if (!saved) return { ...defaults }
  return {
    ...defaults,
    ...saved,
    hero: { ...defaults.hero, ...(saved.hero || {}) },
    about: { ...defaults.about, ...(saved.about || {}) },
    promo: { ...defaults.promo, ...(saved.promo || {}) },
    features: saved.features?.length === 3 ? saved.features : defaults.features,
  }
}

function ImageField({ label, value, onSelect, note }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {note && <p className="text-xs text-gray-500 mb-2">{note}</p>}
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-24 h-16 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {value ? 'Ganti Gambar' : 'Pilih Gambar'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onSelect('')}
              className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              Hapus
            </button>
          )}
        </div>
      </div>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => { onSelect(url || ''); setPickerOpen(false) }}
      />
    </div>
  )
}

const TABS = ['Header', 'Beranda', 'Footer']

export default function ContentPage() {
  const { tenantId } = useAuth()
  const [activeTab, setActiveTab] = useState('Header')
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!tenantId) return
    getSettings(tenantId).then((s) => {
      setContent(merge(DEFAULT_CONTENT, s?.content))
      setLoading(false)
    })
  }, [tenantId])

  function setField(path, value) {
    setContent((prev) => {
      const parts = path.split('.')
      if (parts.length === 1) return { ...prev, [path]: value }
      const [section, key] = parts
      return { ...prev, [section]: { ...prev[section], [key]: value } }
    })
  }

  function setFeature(index, key, value) {
    setContent((prev) => {
      const features = prev.features.map((f, i) => i === index ? { ...f, [key]: value } : f)
      return { ...prev, features }
    })
  }

  async function handleSave() {
    if (!tenantId) return
    setSaving(true)
    try {
      await saveSettings(tenantId, { content })
      toast.success('Konten berhasil disimpan')
    } catch {
      toast.error('Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Memuat...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Konten Toko</h1>
            <p className="text-sm text-gray-500 mt-1">Edit teks dan gambar yang tampil di halaman toko Anda</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── HEADER TAB ──────────────────────────────────────────────── */}
        {activeTab === 'Header' && (
          <div className="space-y-6">
            <Section title="Announcement Bar" desc="Teks berjalan di bagian paling atas header toko">
              <Field label="Teks Pengumuman">
                <input
                  type="text"
                  value={content.announcement}
                  onChange={(e) => setField('announcement', e.target.value)}
                  placeholder={DEFAULT_CONTENT.announcement}
                  className="input"
                />
              </Field>
              <p className="text-xs text-gray-400">Contoh: &quot;Gratis Ongkir Min. Rp200.000 • Chat WA untuk info produk&quot;</p>
            </Section>
          </div>
        )}

        {/* ── BERANDA TAB ─────────────────────────────────────────────── */}
        {activeTab === 'Beranda' && (
          <div className="space-y-6">

            <Section title="Hero / Banner Utama" desc="Bagian paling atas halaman depan toko">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Badge / Label Kecil">
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) => setField('hero.badge', e.target.value)}
                    placeholder={DEFAULT_CONTENT.hero.badge}
                    className="input"
                  />
                </Field>
                <Field label="Teks Tombol Utama">
                  <input
                    type="text"
                    value={content.hero.ctaText}
                    onChange={(e) => setField('hero.ctaText', e.target.value)}
                    placeholder={DEFAULT_CONTENT.hero.ctaText}
                    className="input"
                  />
                </Field>
              </div>
              <Field label="Judul Utama (Headline)">
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => setField('hero.title', e.target.value)}
                  placeholder="Temukan Produk Yang Kamu Suka"
                  className="input"
                />
              </Field>
              <Field label="Subjudul / Deskripsi">
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => setField('hero.subtitle', e.target.value)}
                  placeholder="Pilihan lengkap dengan kualitas terbaik, langsung dari produsen ke tanganmu."
                  rows={2}
                  className="input resize-none"
                />
              </Field>
              <ImageField
                label="Gambar Hero"
                value={content.hero.image}
                onSelect={(url) => setField('hero.image', url)}
                note="Digunakan sebagai background pada tema Urban Fashion"
              />
            </Section>

            <Section title="Judul Seksi" desc="Teks judul untuk seksi koleksi dan produk">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Judul Seksi Koleksi">
                  <input
                    type="text"
                    value={content.collectionsTitle}
                    onChange={(e) => setField('collectionsTitle', e.target.value)}
                    placeholder={DEFAULT_CONTENT.collectionsTitle}
                    className="input"
                  />
                </Field>
                <Field label="Judul Seksi Produk">
                  <input
                    type="text"
                    value={content.productsTitle}
                    onChange={(e) => setField('productsTitle', e.target.value)}
                    placeholder={DEFAULT_CONTENT.productsTitle}
                    className="input"
                  />
                </Field>
              </div>
            </Section>

            <Section title="Seksi Tentang Kami" desc="Banner yang tampil di bawah daftar produk">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Judul">
                  <input
                    type="text"
                    value={content.about.title}
                    onChange={(e) => setField('about.title', e.target.value)}
                    placeholder={DEFAULT_CONTENT.about.title}
                    className="input"
                  />
                </Field>
              </div>
              <Field label="Deskripsi">
                <textarea
                  value={content.about.text}
                  onChange={(e) => setField('about.text', e.target.value)}
                  placeholder={DEFAULT_CONTENT.about.text}
                  rows={3}
                  className="input resize-none"
                />
              </Field>
              <ImageField
                label="Gambar"
                value={content.about.image}
                onSelect={(url) => setField('about.image', url)}
              />
            </Section>

            <Section title="Promo Banner" desc="Banner promosi warna di bagian bawah halaman">
              <Field label="Judul Promo">
                <input
                  type="text"
                  value={content.promo.title}
                  onChange={(e) => setField('promo.title', e.target.value)}
                  placeholder={DEFAULT_CONTENT.promo.title}
                  className="input"
                />
              </Field>
              <Field label="Deskripsi Promo">
                <textarea
                  value={content.promo.text}
                  onChange={(e) => setField('promo.text', e.target.value)}
                  placeholder={DEFAULT_CONTENT.promo.text}
                  rows={2}
                  className="input resize-none"
                />
              </Field>
              <Field label="Teks Tombol">
                <input
                  type="text"
                  value={content.promo.ctaText}
                  onChange={(e) => setField('promo.ctaText', e.target.value)}
                  placeholder={DEFAULT_CONTENT.promo.ctaText}
                  className="input"
                />
              </Field>
            </Section>

            <Section title="Keunggulan Toko" desc="3 poin unggulan yang tampil di bawah halaman">
              {content.features.map((f, i) => (
                <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0 w-14">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ikon / Emoji</label>
                    <input
                      type="text"
                      value={f.icon}
                      onChange={(e) => setFeature(i, 'icon', e.target.value)}
                      className="input text-xl text-center"
                      maxLength={4}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Judul</label>
                      <input
                        type="text"
                        value={f.title}
                        onChange={(e) => setFeature(i, 'title', e.target.value)}
                        placeholder={DEFAULT_CONTENT.features[i].title}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi</label>
                      <input
                        type="text"
                        value={f.desc}
                        onChange={(e) => setFeature(i, 'desc', e.target.value)}
                        placeholder={DEFAULT_CONTENT.features[i].desc}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Section>

          </div>
        )}

        {/* ── FOOTER TAB ──────────────────────────────────────────────── */}
        {activeTab === 'Footer' && (
          <div className="space-y-6">
            <Section title="Tagline Toko" desc="Teks singkat di bawah nama toko pada footer">
              <Field label="Tagline">
                <textarea
                  value={content.footerTagline}
                  onChange={(e) => setField('footerTagline', e.target.value)}
                  placeholder="Toko online terpercaya untuk kebutuhan Anda"
                  rows={2}
                  className="input resize-none"
                />
              </Field>
            </Section>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
              Untuk mengubah info lain di footer (alamat, nomor WA, media sosial, rekening bank), buka halaman{' '}
              <Link href="/admin/settings" className="font-semibold underline">Pengaturan</Link>.
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          color: #111827;
          background: white;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
      `}</style>
    </AdminLayout>
  )
}

function Section({ title, desc, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
