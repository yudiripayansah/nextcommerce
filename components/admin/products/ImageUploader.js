'use client'

import { useState } from 'react'
import MediaPicker from '@/components/admin/MediaPicker'

export default function ImageUploader({ images = [], onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false)

  function handleSelect(urls) {
    const merged = [...new Set([...images, ...urls])]
    onChange(merged)
  }

  function handleRemove(url) {
    onChange(images.filter((u) => u !== url))
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Gambar Produk</label>

      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={url} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group flex-shrink-0">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs text-center py-0.5">
                Utama
              </span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors flex-shrink-0"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs text-gray-500 mt-1">Tambah</span>
        </button>
      </div>

      {images.length > 0 && (
        <p className="text-xs text-gray-400">Gambar pertama akan menjadi gambar utama produk</p>
      )}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
        multiple
        initialSelected={images}
      />
    </div>
  )
}
