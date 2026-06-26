'use client'

import { useState, useEffect, useRef } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { uploadImage } from '@/lib/cloudinary'
import { getFiles, addFile, deleteFile } from '@/services/files'
import toast from 'react-hot-toast'

function formatSize(bytes) {
  if (!bytes) return '-'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(ts) {
  if (!ts) return '-'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function FilesPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadCount, setUploadCount] = useState({ done: 0, total: 0 })
  const [dragOver, setDragOver] = useState(false)
  const [selected, setSelected] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await getFiles()
      setFiles(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(fileList) {
    const toUpload = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!toUpload.length) return
    setUploading(true)
    setUploadCount({ done: 0, total: toUpload.length })

    for (let i = 0; i < toUpload.length; i++) {
      try {
        const result = await uploadImage(toUpload[i], 'media')
        const id = await addFile({
          url: result.url,
          publicId: result.publicId,
          name: result.name,
          size: result.size,
          format: result.format,
          width: result.width,
          height: result.height,
        })
        setFiles((prev) => [{ id, ...result }, ...prev])
        setUploadCount({ done: i + 1, total: toUpload.length })
      } catch {
        toast.error(`Gagal upload: ${toUpload[i].name}`)
      }
    }

    toast.success(`${toUpload.length} file berhasil diupload`)
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDelete(file) {
    try {
      await deleteFile(file.id)
      setFiles((prev) => prev.filter((f) => f.id !== file.id))
      if (selected?.id === file.id) setSelected(null)
      toast.success('File dihapus')
    } catch {
      toast.error('Gagal menghapus file')
    } finally {
      setConfirmDelete(null)
    }
  }

  function copyUrl(url, id) {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast.success('URL disalin')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const totalSize = files.reduce((s, f) => s + (f.size || 0), 0)

  return (
    <AdminLayout title="File & Media">
      <div className="space-y-5">

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span><strong className="text-gray-900">{files.length}</strong> file</span>
          <span><strong className="text-gray-900">{formatSize(totalSize)}</strong> digunakan</span>
        </div>

        {/* Upload zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/40'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files) }}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-blue-600">
                Mengupload {uploadCount.done}/{uploadCount.total} file...
              </p>
              <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${(uploadCount.done / uploadCount.total) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Drop file di sini atau <span className="text-blue-600">klik untuk upload</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF — bisa pilih banyak sekaligus</p>
                </div>
              </div>
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

        {/* Grid + Detail panel */}
        <div className="flex gap-5 items-start">

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2" />
                Memuat...
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Belum ada file. Upload file pertama Anda di atas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
                {files.map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setSelected(selected?.id === file.id ? null : file)}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selected?.id === file.id
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-1'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    {selected?.id === file.id && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-64 flex-shrink-0 bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="aspect-square bg-gray-50">
                <img src={selected.url} alt={selected.name} className="w-full h-full object-contain p-3" />
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm font-medium text-gray-900 truncate">{selected.name}.{selected.format}</p>
                <div className="space-y-1 text-xs text-gray-500">
                  {selected.width && selected.height && (
                    <div className="flex justify-between">
                      <span>Dimensi</span>
                      <span className="text-gray-700">{selected.width} × {selected.height}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Ukuran</span>
                    <span className="text-gray-700">{formatSize(selected.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diupload</span>
                    <span className="text-gray-700">{formatDate(selected.createdAt)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyUrl(selected.url, selected.id)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copiedId === selected.id ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      URL Disalin!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Salin URL
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmDelete(selected)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-80 mx-4">
            <h3 className="font-semibold text-gray-900 mb-1">Hapus File?</h3>
            <p className="text-sm text-gray-500 mb-5">
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
    </AdminLayout>
  )
}
