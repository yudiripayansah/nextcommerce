'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { getSettings, saveSettings } from '@/services/settings'
import MediaPicker from '@/components/admin/MediaPicker'
import toast from 'react-hot-toast'

const DEFAULTS = {
  storeName: '',
  logo: '',
  favicon: '',
  whatsappNumber: '',
  email: '',
  phone: '',
  address: '',
  facebook: '',
  instagram: '',
  tiktok: '',
}

export default function SettingsPage() {
  const [form, setForm] = useState(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [logoPicker, setLogoPicker] = useState(false)
  const [faviconPicker, setFaviconPicker] = useState(false)

  useEffect(() => {
    getSettings().then((s) => { if (s) setForm({ ...DEFAULTS, ...s }) })
  }, [])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSettings(form)
      toast.success('Pengaturan disimpan')
    } catch {
      toast.error('Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Pengaturan">
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {/* Store info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Informasi Toko</h3>
          <Input label="Nama Toko" value={form.storeName} onChange={(e) => set('storeName', e.target.value)} required />
          <Input label="Nomor WhatsApp" value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} placeholder="628123456789" required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          <Input label="Telepon" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Alamat</label>
            <textarea
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Logo & Favicon</h3>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Logo</label>
            {form.logo ? (
              <div className="flex items-center gap-4 mb-2">
                <div className="w-24 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img src={form.logo} alt="Logo" className="max-h-full max-w-full object-contain p-1" />
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => setLogoPicker(true)} className="text-sm text-blue-600 hover:underline text-left">Ganti Logo</button>
                  <button type="button" onClick={() => set('logo', '')} className="text-sm text-red-500 hover:underline text-left">Hapus</button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLogoPicker(true)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Pilih Logo dari Media Library
              </button>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Favicon</label>
            {form.favicon ? (
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img src={form.favicon} alt="Favicon" className="max-h-full max-w-full object-contain p-1" />
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => setFaviconPicker(true)} className="text-sm text-blue-600 hover:underline text-left">Ganti Favicon</button>
                  <button type="button" onClick={() => set('favicon', '')} className="text-sm text-red-500 hover:underline text-left">Hapus</button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setFaviconPicker(true)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Pilih Favicon dari Media Library
              </button>
            )}
          </div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Media Sosial</h3>
          <Input label="Facebook" value={form.facebook} onChange={(e) => set('facebook', e.target.value)} placeholder="https://facebook.com/..." />
          <Input label="Instagram" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="https://instagram.com/..." />
          <Input label="TikTok" value={form.tiktok} onChange={(e) => set('tiktok', e.target.value)} placeholder="https://tiktok.com/..." />
        </div>

        <Button type="submit" loading={saving} size="lg">
          Simpan Pengaturan
        </Button>
      </form>

      <MediaPicker
        open={logoPicker}
        onClose={() => setLogoPicker(false)}
        onSelect={(url) => { set('logo', url); setLogoPicker(false) }}
        multiple={false}
        initialSelected={form.logo ? [form.logo] : []}
      />
      <MediaPicker
        open={faviconPicker}
        onClose={() => setFaviconPicker(false)}
        onSelect={(url) => { set('favicon', url); setFaviconPicker(false) }}
        multiple={false}
        initialSelected={form.favicon ? [form.favicon] : []}
      />
    </AdminLayout>
  )
}
