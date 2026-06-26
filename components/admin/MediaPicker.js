'use client'

import { useState, useEffect, useRef } from 'react'
import { uploadImage } from '@/lib/cloudinary'
import { useAuth } from '@/contexts/AuthContext'
import { getFiles, addFile, deleteFile } from '@/services/files'

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaPicker({ open, onClose, onSelect, multiple = false, initialSelected = [] }) {
  const { tenantId } = useAuth()
  const [files, setFiles] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadCount, setUploadCount] = useState({ done: 0, total: 0 })
  const [dragOver, setDragOver] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const initial = Array.isArray(initialSelected)
      ? initialSelected
      : initialSelected
      ? [initialSelected]
      : []
    setSelected(initial)
    load()
  }, [open])

  async function load() {
    if (!tenantId) return
    setLoading(true)
    try {
      const data = await getFiles(tenantId)
      setFiles(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(fileList) {
    if (!tenantId) return
    const toUpload = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!toUpload.length) return
    setUploading(true)
    setUploadCount({ done: 0, total: toUpload.length })

    const newUrls = []
    for (let i = 0; i < toUpload.length; i++) {
      const result = await uploadImage(toUpload[i], 'media')
      const id = await addFile(tenantId, {
        url: result.url,
        publicId: result.publicId,
        name: result.name,
        size: result.size,
        format: result.format,
        width: result.width,
        height: result.height,
      })
      setFiles((prev) => [{ id, ...result }, ...prev])
      newUrls.push(result.url)
      setUploadCount({ done: i + 1, total: toUpload.length })
    }

    setSelected((prev) => {
      if (multiple) return [...new Set([...prev, ...newUrls])]
      return [newUrls[newUrls.length - 1]]
    })
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function toggleSelect(url) {
    setSelected((prev) => {
      if (multiple) {
        return prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
      }
      return prev[0] === url ? [] : [url]
    })
  }

  function handleConfirm() {
    onSelect(multiple ? selected : selected[0] || null)
    onClose()
  }

  async function handleDelete(file) {
    await deleteFile(tenantId, file.id)
    setFiles((prev) => prev.filter((f) => f.id !== file.id))
    setSelected((prev) => prev.filter((u) => u !== file.url))
    setConfirmDelete(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl max-h-[92vh] flex flex-col mx-0 sm:mx-4">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">File & Media</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {multiple ? 'Pilih satu atau lebih file' : 'Pilih satu file'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Upload zone */}
        <div className="px-5 pt-4 flex-shrink-0">
          <div
            className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files) }}
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-3 py-1">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-blue-600 font-medium">
                  Mengupload {uploadCount.done}/{uploadCount.total}...
                </span>
              </div>
            ) : (
              <label className="cursor-pointer flex items-center justify-center gap-2 py-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-sm text-gray-600">
                  Drop file di sini atau{' '}
                  <span className="text-blue-600 font-medium">klik untuk upload</span>
                </span>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2" />
              Memuat...
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <svg className="w-10 h-10 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Belum ada file. Upload file pertama Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {files.map((file) => {
                const isSelected = selected.includes(file.url)
                return (
                  <div key={file.id} className="group relative aspect-square">
                    <button
                      type="button"
                      onClick={() => toggleSelect(file.url)}
                      className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all block ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-1'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center pointer-events-none">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(file) }}
                      className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/60 rounded-full items-center justify-center hidden group-hover:flex"
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex-shrink-0">
          <span className="text-sm text-gray-500">
            {selected.length > 0
              ? `${selected.length} file dipilih`
              : `${files.length} file tersedia`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {selected.length > 0
                ? `Pilih${multiple ? ` (${selected.length})` : ''}`
                : 'Pilih'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirm dialog */}
      {confirmDelete && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 mx-4">
            <h3 className="font-semibold text-gray-900 mb-2">Hapus File?</h3>
            <p className="text-sm text-gray-500 mb-4">
              File ini akan dihapus dari library. Produk yang sudah menggunakan gambar ini tidak akan terpengaruh.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
