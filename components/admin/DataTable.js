'use client'

import { useState, useMemo } from 'react'
import EmptyState from '../ui/EmptyState'
import LoadingSpinner from '../ui/LoadingSpinner'

function SortIcon({ dir }) {
  return (
    <span className="inline-flex flex-col ml-1 gap-[2px]">
      <svg
        className={`w-2.5 h-2.5 ${dir === 'asc' ? 'text-gray-900' : 'text-gray-300'}`}
        viewBox="0 0 10 6" fill="currentColor"
      >
        <path d="M5 0L0 6h10z" />
      </svg>
      <svg
        className={`w-2.5 h-2.5 ${dir === 'desc' ? 'text-gray-900' : 'text-gray-300'}`}
        viewBox="0 0 10 6" fill="currentColor"
      >
        <path d="M5 6L0 0h10z" />
      </svg>
    </span>
  )
}

function getValue(row, key) {
  const v = row[key]
  if (v == null) return ''
  // Firestore Timestamp
  if (typeof v === 'object' && typeof v.seconds === 'number') return v.seconds
  if (typeof v === 'object' && typeof v.toDate === 'function') return v.toDate().getTime()
  return v
}

function sortData(data, sortKey, sortDir) {
  if (!sortKey) return data
  return [...data].sort((a, b) => {
    const va = getValue(a, sortKey)
    const vb = getValue(b, sortKey)
    let cmp = 0
    if (typeof va === 'number' && typeof vb === 'number') {
      cmp = va - vb
    } else {
      cmp = String(va).localeCompare(String(vb), 'id', { numeric: true })
    }
    return sortDir === 'desc' ? -cmp : cmp
  })
}

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
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  function handleHeaderClick(col) {
    if (col.sortable === false || col.key.startsWith('__')) return
    if (sortKey === col.key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(col.key)
      setSortDir('asc')
    }
  }

  const handleSearch = (e) => {
    const val = e.target.value
    if (onSearch) onSearch(val)
    else setLocalSearch(val)
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

  const sortedData = useMemo(
    () => sortData(filteredData, sortKey, sortDir),
    [filteredData, sortKey, sortDir]
  )

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
      ) : sortedData.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                {columns.map((col) => {
                  const isSortable = col.sortable !== false && !String(col.key).startsWith('__')
                  const isActive = sortKey === col.key
                  return (
                    <th
                      key={col.key}
                      onClick={() => handleHeaderClick(col)}
                      className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap ${isSortable ? 'cursor-pointer select-none hover:text-gray-700' : ''}`}
                      style={col.width ? { width: col.width } : {}}
                    >
                      <span className="inline-flex items-center gap-0.5">
                        {col.label}
                        {isSortable && <SortIcon dir={isActive ? sortDir : null} />}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {sortedData.map((row, i) => (
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
