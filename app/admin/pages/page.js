'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { useAuth } from '@/contexts/AuthContext'
import { getPage, savePage } from '@/services/pages'
import { PAGE_SLUGS, PAGE_TITLES } from '@/constants'
import toast from 'react-hot-toast'

export default function PagesPage() {
  const { tenantId } = useAuth()
  const [active, setActive] = useState(PAGE_SLUGS[0])
  const [pages, setPages] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!tenantId) return
    Promise.all(PAGE_SLUGS.map((s) => getPage(tenantId, s).then((d) => [s, d]))).then((results) => {
      const map = {}
      results.forEach(([slug, data]) => {
        map[slug] = { title: PAGE_TITLES[slug], content: '', ...data }
      })
      setPages(map)
    })
  }, [tenantId])

  async function handleSave() {
    if (!tenantId) return
    setSaving(true)
    try {
      await savePage(tenantId, active, { title: pages[active]?.title, content: pages[active]?.content || '' })
      toast.success('Halaman disimpan')
    } catch {
      toast.error('Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  function setContent(val) {
    setPages((prev) => ({
      ...prev,
      [active]: { ...prev[active], content: val },
    }))
  }

  return (
    <AdminLayout title="Halaman">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {PAGE_SLUGS.map((slug) => (
            <button
              key={slug}
              onClick={() => setActive(slug)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                active === slug
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {PAGE_TITLES[slug]}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Konten</label>
            <RichTextEditor
              value={pages[active]?.content || ''}
              onChange={setContent}
            />
          </div>

          <Button onClick={handleSave} loading={saving}>
            Simpan Halaman
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
