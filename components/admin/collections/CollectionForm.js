'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
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
      <Input
        label="URL Gambar"
        value={form.image}
        onChange={(e) => set('image', e.target.value)}
        placeholder="https://..."
      />
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
    </form>
  )
}
