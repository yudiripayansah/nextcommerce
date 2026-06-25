'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { getSettings, saveSettings } from '@/services/settings'
import { storage } from '@/lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
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
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    getSettings().then((s) => { if (s) setForm({ ...DEFAULTS, ...s }) })
  }, [])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function uploadImage(file, field) {
    const storageRef = ref(storage, `settings/${field}_${Date.now()}`)
    setUploadingLogo(true)
    await new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file)
      task.on('state_changed', null, reject, async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        set(field, url)
        resolve()
      })
    })
    setUploadingLogo(false)
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
            {form.logo && <img src={form.logo} alt="Logo" className="h-12 mb-2 object-contain" />}
            <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
              {uploadingLogo ? 'Mengupload...' : 'Upload Logo'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], 'logo')}
              />
            </label>
          </div>
          <Input
            label="URL Favicon"
            value={form.favicon}
            onChange={(e) => set('favicon', e.target.value)}
            placeholder="https://..."
          />
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
    </AdminLayout>
  )
}
