'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function VariantGenerator({ options, onChange }) {
  // Track raw text per option so commas don't disappear mid-typing
  const [rawInputs, setRawInputs] = useState({})

  function addOption() {
    if (options.length >= 3) return
    onChange([...options, { name: '', values: [] }])
  }

  function removeOption(i) {
    const newRaw = {}
    Object.entries(rawInputs).forEach(([k, v]) => {
      const ki = parseInt(k)
      if (ki < i) newRaw[ki] = v
      else if (ki > i) newRaw[ki - 1] = v
    })
    setRawInputs(newRaw)
    onChange(options.filter((_, idx) => idx !== i))
  }

  function setOptionName(i, name) {
    const updated = [...options]
    updated[i] = { ...updated[i], name }
    onChange(updated)
  }

  function handleValuesInput(i, raw) {
    setRawInputs((prev) => ({ ...prev, [i]: raw }))
    const values = raw.split(',').map((v) => v.trim()).filter(Boolean)
    const updated = [...options]
    updated[i] = { ...updated[i], values }
    onChange(updated)
  }

  function handleValuesBlur(i) {
    setRawInputs((prev) => {
      const next = { ...prev }
      delete next[i]
      return next
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Opsi Produk</label>
        {options.length < 3 && (
          <Button type="button" size="sm" variant="outline" onClick={addOption}>
            + Tambah Opsi
          </Button>
        )}
      </div>

      {options.length === 0 && (
        <p className="text-sm text-gray-400">Belum ada opsi. Klik tombol untuk menambahkan.</p>
      )}

      {options.map((opt, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={opt.name}
              onChange={(e) => setOptionName(i, e.target.value)}
              placeholder="Nama opsi (Warna, Ukuran, ...)"
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeOption(i)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            value={i in rawInputs ? rawInputs[i] : opt.values.join(', ')}
            onChange={(e) => handleValuesInput(i, e.target.value)}
            onBlur={() => handleValuesBlur(i)}
            placeholder="Nilai dipisah koma: S, M, L, XL"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {opt.values.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {opt.values.map((v) => (
                <span key={v} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                  {v}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
