'use client'

import { formatCurrency } from '@/lib/helpers'

export default function VariantTable({ variants, onChange }) {
  function update(id, field, value) {
    const updated = variants.map((v) => {
      if (v.id !== id) return v
      const next = { ...v, [field]: field === 'price' || field === 'stock' ? Number(value) || 0 : value }
      if (field === 'price' || field === 'quantity') return next
      return next
    })
    onChange(updated)
  }

  if (!variants || variants.length === 0) return null

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">Varian Produk</label>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs text-gray-500 font-medium">Varian</th>
              <th className="px-3 py-2 text-left text-xs text-gray-500 font-medium">SKU</th>
              <th className="px-3 py-2 text-left text-xs text-gray-500 font-medium">Harga (Rp)</th>
              <th className="px-3 py-2 text-left text-xs text-gray-500 font-medium">Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {variants.map((v) => (
              <tr key={v.id}>
                <td className="px-3 py-2 font-medium text-gray-900">{v.title}</td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => update(v.id, 'sku', e.target.value)}
                    placeholder="SKU-001"
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => update(v.id, 'price', e.target.value)}
                    min="0"
                    className="w-28 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => update(v.id, 'stock', e.target.value)}
                    min="0"
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
