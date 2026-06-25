'use client'

import { useState } from 'react'
import EmptyState from '../ui/EmptyState'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function DataTable({
  columns,
  data,
  loading,
  searchable,
  searchPlaceholder = 'Cari...',
  emptyTitle,
  emptyDescription,
  onSearch,
  searchValue,
  actions,
}) {
  const [localSearch, setLocalSearch] = useState('')

  const handleSearch = (e) => {
    const val = e.target.value
    if (onSearch) {
      onSearch(val)
    } else {
      setLocalSearch(val)
    }
  }

  const searchTerm = onSearch ? searchValue : localSearch

  const filteredData = searchTerm && !onSearch
    ? data.filter((row) =>
        columns.some((col) => {
          const val = row[col.key]
          return val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    : data

  return (
    <div>
      {(searchable || actions) && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {searchable && (
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={onSearch ? searchValue : localSearch}
                onChange={handleSearch}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : filteredData.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide"
                    style={col.width ? { width: col.width } : {}}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredData.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
