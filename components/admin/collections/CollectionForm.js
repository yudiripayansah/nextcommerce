'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import MediaPicker from '@/components/admin/MediaPicker'
import { slugify } from '@/lib/helpers'
import { COLLECTION_STATUSES } from '@/constants'

export default function CollectionForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: '',
    handle: '',
    description: '',
    image: '',
    status: 'active',
    ...initialData,
  })
  const [errors, setErrors] = useState({})
  const [pickerOpen, setPickerOpen] = useState(false)

  function set(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !initialData?.handle) {
        next.handle = slugify(value)
      }
      return next
    })
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Judul wajib diisi'
    if (!form.handle.trim()) errs.handle = 'Handle wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Judul Koleksi"
        required
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
        error={errors.title}
        placeholder="Contoh: Kaos Pria"
      />
      <Input
        label="Handle (URL)"
        required
        value={form.handle}
        onChange={(e) => set('handle', slugify(e.target.value))}
        error={errors.handle}
        placeholder="kaos-pria"
      />
      <Textarea
        label="Deskripsi"
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        placeholder="Deskripsi koleksi..."
        rows={3}
      />

      {/* Image picker */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Gambar Koleksi</label>
        {form.image ? (
          <div className="flex items-start gap-3">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
              <img src={form.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Ganti Gambar
              </button>
              <button
                type="button"
                onClick={() => set('image', '')}
                className="text-sm text-red-500 hover:underline"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Pilih Gambar dari Media Library
          </button>
        )}
      </div>

      <Select
        label="Status"
        value={form.status}
        onChange={(e) => set('status', e.target.value)}
        options={COLLECTION_STATUSES}
      />
      <div className="pt-2">
        <Button type="submit" loading={loading}>
          {initialData ? 'Simpan Perubahan' : 'Buat Koleksi'}
        </Button>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => { set('image', url); setPickerOpen(false) }}
        multiple={false}
        initialSelected={form.image ? [form.image] : []}
      />
    </form>
  )
}
