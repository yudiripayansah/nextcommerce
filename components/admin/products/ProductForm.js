'use client'

import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import ImageUploader from './ImageUploader'
import VariantGenerator from './VariantGenerator'
import VariantTable from './VariantTable'
import { slugify, generateVariantCombinations } from '@/lib/helpers'
import { useAuth } from '@/contexts/AuthContext'
import { getCollections } from '@/services/collections'
import { PRODUCT_STATUSES } from '@/constants'

export default function ProductForm({ initialData, onSubmit, loading }) {
  const { tenantId } = useAuth()
  const [form, setForm] = useState({
    title: '',
    handle: '',
    description: '',
    featuredImage: '',
    images: [],
    tags: [],
    collectionId: '',
    collectionTitle: '',
    options: [],
    variants: [],
    status: 'active',
    ...initialData,
  })
  const [errors, setErrors] = useState({})
  const [collections, setCollections] = useState([])
  const [globalPrice, setGlobalPrice] = useState('')

  useEffect(() => {
    if (!tenantId) return
    getCollections(tenantId, { status: 'active' }).then((c) =>
      setCollections(c.map((x) => ({ value: x.id, label: x.title, title: x.title })))
    )
  }, [tenantId])

  function set(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !initialData?.handle) {
        next.handle = slugify(value)
      }
      return next
    })
  }

  function handleImagesChange(imgs) {
    setForm((prev) => ({
      ...prev,
      images: imgs,
      featuredImage: imgs[0] || '',
    }))
  }

  function handleOptionsChange(options) {
    const price = Number(globalPrice) || 0
    const variants = generateVariantCombinations(options).map((v) => ({
      ...v,
      price: price || v.price,
    }))
    setForm((prev) => ({ ...prev, options, variants }))
  }

  function applyGlobalPrice(price) {
    const p = Number(price) || 0
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => ({ ...v, price: p })),
    }))
  }

  function handleCollectionChange(e) {
    const id = e.target.value
    const found = collections.find((c) => c.value === id)
    setForm((prev) => ({
      ...prev,
      collectionId: id,
      collectionTitle: found?.title || '',
    }))
  }

  function handleTagsChange(e) {
    const tags = e.target.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    set('tags', tags)
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Judul wajib diisi'
    if (!form.handle.trim()) errs.handle = 'Handle wajib diisi'
    if (form.variants.length > 0) {
      const hasPrice = form.variants.every((v) => v.price > 0)
      if (!hasPrice) errs.variants = 'Semua varian harus memiliki harga'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const minPrice = form.variants.length
      ? Math.min(...form.variants.map((v) => v.price))
      : 0
    const maxPrice = form.variants.length
      ? Math.max(...form.variants.map((v) => v.price))
      : 0
    const totalStock = form.variants.reduce((s, v) => s + (v.stock || 0), 0)

    onSubmit({ ...form, minPrice, maxPrice, totalStock })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-medium text-gray-900">Informasi Produk</h3>
            <Input
              label="Judul Produk"
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              error={errors.title}
              placeholder="Kaos Polos Pria"
            />
            <Input
              label="Handle (URL)"
              required
              value={form.handle}
              onChange={(e) => set('handle', slugify(e.target.value))}
              error={errors.handle}
              placeholder="kaos-polos-pria"
            />
            <Textarea
              label="Deskripsi"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Deskripsi produk..."
              rows={4}
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <ImageUploader images={form.images} onChange={handleImagesChange} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-medium text-gray-900">Varian</h3>

            {/* Global price */}
            <div className="flex items-end gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Harga Global (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={globalPrice}
                  onChange={(e) => {
                    setGlobalPrice(e.target.value)
                    if (form.variants.length > 0) applyGlobalPrice(e.target.value)
                  }}
                  placeholder="Contoh: 150000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {form.variants.length > 0 && (
                <button
                  type="button"
                  onClick={() => applyGlobalPrice(globalPrice)}
                  className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 whitespace-nowrap"
                >
                  Terapkan ke Semua
                </button>
              )}
            </div>

            <VariantGenerator options={form.options} onChange={handleOptionsChange} />
            {errors.variants && <p className="text-xs text-red-600">{errors.variants}</p>}
            <VariantTable variants={form.variants} onChange={(v) => set('variants', v)} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-medium text-gray-900">Pengaturan</h3>
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              options={PRODUCT_STATUSES}
            />
            <Select
              label="Koleksi"
              value={form.collectionId}
              onChange={handleCollectionChange}
              options={collections}
              placeholder="Pilih koleksi..."
            />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tags</label>
              <input
                type="text"
                value={form.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="tag1, tag2, tag3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Pisahkan dengan koma</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Button type="submit" loading={loading} size="lg">
          {initialData ? 'Simpan Perubahan' : 'Buat Produk'}
        </Button>
      </div>
    </form>
  )
}
