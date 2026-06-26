'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAuth } from '@/contexts/AuthContext'
import { TEMPLATES, DEFAULT_TEMPLATE, DEFAULT_PRESET, applyThemeVars, applyTemplate, parseStoredTheme } from '@/lib/theme'
import { getSettings, saveSettings } from '@/services/settings'

const COLOR_FIELDS = [
  { key: 'primary', label: 'Warna Utama', desc: 'Digunakan pada tombol dan elemen penting' },
  { key: 'primaryFg', label: 'Teks di Warna Utama', desc: 'Teks di atas warna utama (biasanya putih)' },
  { key: 'accent', label: 'Warna Aksen', desc: 'Warna pendukung untuk elemen sekunder' },
  { key: 'bg', label: 'Background Halaman', desc: 'Latar belakang utama halaman' },
  { key: 'surface', label: 'Background Kartu', desc: 'Latar belakang kartu dan panel' },
  { key: 'text', label: 'Warna Teks', desc: 'Teks utama halaman' },
]

function ColorDots({ colors, size = 6 }) {
  const keys = ['primary', 'accent', 'bg', 'surface']
  return (
    <div className="flex gap-1.5 flex-wrap">
      {keys.map(k => (
        <span
          key={k}
          style={{ width: size * 4, height: size * 4, background: colors[k], borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.08)', display: 'inline-block', flexShrink: 0 }}
        />
      ))}
    </div>
  )
}

function TemplateCard({ tmpl, selected, onSelect }) {
  const isUrban = tmpl.id === 'urban-fashion'
  return (
    <button
      onClick={() => onSelect(tmpl)}
      className="relative text-left w-full transition-all"
      style={{
        border: selected ? '2.5px solid #2563eb' : '2px solid #e5e7eb',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: selected ? '0 0 0 3px #dbeafe' : 'none',
        background: '#fff',
      }}
    >
      {selected && (
        <span className="absolute top-3 right-3 z-10 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}

      {/* Preview mockup */}
      <div className="h-32 w-full overflow-hidden relative" style={{ background: isUrban ? '#fff' : '#fff7ed' }}>
        {isUrban ? (
          // Urban Fashion preview: minimal, sharp, monochrome
          <div className="p-3">
            <div className="h-1.5 bg-black w-full mb-2" />
            <div className="flex gap-1.5 mb-2">
              <div className="h-2 bg-gray-800 w-8" />
              <div className="h-2 bg-gray-300 w-10" />
              <div className="h-2 bg-gray-300 w-6" />
            </div>
            <div className="flex gap-2 mt-3">
              {[0,1,2,3].map(i => (
                <div key={i} className="flex-1 bg-stone-100" style={{ aspectRatio: '3/4' }}>
                  <div className="w-full h-full bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Happy Hobby preview: rounded, colorful, playful
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-16 font-bold" style={{ background: '#ea580c', borderRadius: 99 }} />
              <div className="h-3 w-8 bg-gray-200 ml-auto" style={{ borderRadius: 99 }} />
            </div>
            <div className="flex gap-2 mt-2">
              {[0,1,2,3].map(i => (
                <div key={i} className="flex-1 overflow-hidden" style={{ borderRadius: 10, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                  <div className="w-full bg-orange-50" style={{ aspectRatio: '3/4' }} />
                  <div className="px-1 py-1">
                    <div className="h-1.5 bg-gray-200 mb-1" style={{ borderRadius: 99 }} />
                    <div className="h-1.5 bg-orange-400 w-2/3" style={{ borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-bold text-sm text-gray-900">{tmpl.name}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tmpl.description}</p>
      </div>
    </button>
  )
}

function PresetCard({ preset, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(preset)}
      className="relative text-left p-3 transition-all"
      style={{
        border: selected ? '2px solid #2563eb' : '1.5px solid #e5e7eb',
        borderRadius: 12,
        background: selected ? '#eff6ff' : '#fff',
      }}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      <ColorDots colors={preset.colors} />
      <p className="text-xs font-semibold text-gray-800 mt-2">{preset.name}</p>
    </button>
  )
}

function LivePreview({ template, colors }) {
  const isHappy = template === 'happy-hobby'
  const r = isHappy ? 12 : 0
  const pill = isHappy ? 9999 : 0

  return (
    <div className="overflow-hidden border border-gray-200" style={{ borderRadius: 16, background: colors.bg }}>
      {/* Announcement bar */}
      <div className="py-2 px-4 text-center text-xs font-medium" style={{ background: colors.primary, color: colors.primaryFg }}>
        {isHappy ? '🎉 Gratis Ongkir Min. Belanja Rp200.000!' : 'PESAN VIA WHATSAPP — GRATIS ONGKIR SELURUH INDONESIA'}
      </div>

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100" style={{ background: '#fff' }}>
        {isHappy ? (
          <>
            <span className="font-extrabold text-sm" style={{ color: colors.primary }}>MyShop</span>
            <div className="flex gap-1">
              {['Produk', 'Kategori', 'Info'].map(l => (
                <span key={l} className="text-xs px-2.5 py-1 font-medium" style={{ color: colors.text, borderRadius: pill }}>{l}</span>
              ))}
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="text-xs px-3 py-1.5 font-bold" style={{ background: colors.primary, color: colors.primaryFg, borderRadius: pill }}>🛒 2</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-4">
              {['PRIA', 'WANITA', 'CELANA'].map(l => (
                <span key={l} className="text-[10px] tracking-widest" style={{ color: colors.text }}>{l}</span>
              ))}
            </div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: colors.text }}>MYSHOP</span>
            <span className="text-[10px] tracking-widest" style={{ color: colors.text }}>TENTANG</span>
          </>
        )}
      </div>

      {/* Product grid */}
      <div className="px-3 py-3 grid grid-cols-4 gap-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="overflow-hidden" style={{ borderRadius: r, background: isHappy ? '#fff' : '#f3f4f6', boxShadow: isHappy ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>
            <div style={{ aspectRatio: '3/4', background: colors.surface }} />
            <div className={`p-1.5 ${isHappy ? '' : ''}`}>
              <div className="h-1.5 mb-1" style={{ background: '#e5e7eb', borderRadius: 99, width: '80%' }} />
              <div className="h-1.5" style={{ background: isHappy ? colors.primary : '#9ca3af', borderRadius: 99, width: '60%' }} />
            </div>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <div className="px-3 pb-3 flex justify-center">
        <span className="text-xs font-bold px-5 py-2" style={{ background: colors.primary, color: colors.primaryFg, borderRadius: pill }}>
          {isHappy ? 'Belanja Sekarang →' : 'LIHAT SEMUA'}
        </span>
      </div>
    </div>
  )
}

export default function ThemePage() {
  const { tenantId, tenant } = useAuth()
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE.id)
  const [selectedPresetId, setSelectedPresetId] = useState(DEFAULT_PRESET.id)
  const [colors, setColors] = useState(DEFAULT_PRESET.colors)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tenantId) return
    async function load() {
      try {
        const settings = await getSettings(tenantId)
        const { template, colors: c } = parseStoredTheme(settings?.theme)
        setSelectedTemplate(template)
        setColors(c)

        const tmpl = TEMPLATES.find(t => t.id === template)
        const matchPreset = tmpl?.colorPresets.find(p =>
          p.colors.primary === c.primary &&
          p.colors.primaryFg === c.primaryFg &&
          p.colors.accent === c.accent
        )
        setSelectedPresetId(matchPreset?.id || 'custom')

        applyThemeVars(c)
        applyTemplate(template)
      } catch {
        } finally {
        setLoading(false)
      }
    }
    load()
  }, [tenantId])

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || DEFAULT_TEMPLATE

  function handleTemplateSelect(tmpl) {
    setSelectedTemplate(tmpl.id)
    // Switch to that template's first preset
    const firstPreset = tmpl.colorPresets[0]
    setSelectedPresetId(firstPreset.id)
    setColors(firstPreset.colors)
    applyThemeVars(firstPreset.colors)
    applyTemplate(tmpl.id)
  }

  function handlePresetSelect(preset) {
    setSelectedPresetId(preset.id)
    setColors(preset.colors)
    applyThemeVars(preset.colors)
  }

  function handleColorChange(key, value) {
    setSelectedPresetId('custom')
    setColors(prev => {
      const next = { ...prev, [key]: value }
      applyThemeVars(next)
      return next
    })
  }

  async function handleSave() {
    if (!tenantId) return
    setSaving(true)
    setSaved(false)
    try {
      const themeData = { template: selectedTemplate, ...colors }
      await saveSettings(tenantId, { theme: themeData })
      const storageKey = tenant?.slug ? `store_theme_${tenant.slug}` : 'store_theme'
      try { localStorage.setItem(storageKey, JSON.stringify(themeData)) } catch {}
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  const activePreset = currentTemplate.colorPresets.find(p => p.id === selectedPresetId)

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tema Toko</h1>
          <p className="text-sm text-gray-500 mt-1">
            Aktif: <span className="font-semibold text-gray-800">{currentTemplate.name}</span>
            {activePreset && <> · <span className="text-gray-600">{activePreset.name}</span></>}
          </p>
        </div>

        {/* Step 1: Choose template */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Pilih Template</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEMPLATES.map(tmpl => (
              <TemplateCard
                key={tmpl.id}
                tmpl={tmpl}
                selected={selectedTemplate === tmpl.id}
                onSelect={handleTemplateSelect}
              />
            ))}
          </div>
        </div>

        {/* Step 2: Choose color scheme */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Pilih Skema Warna</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {currentTemplate.colorPresets.map(preset => (
              <PresetCard
                key={preset.id}
                preset={preset}
                selected={selectedPresetId === preset.id}
                onSelect={handlePresetSelect}
              />
            ))}
          </div>
        </div>

        {/* Step 3: Custom colors */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Kustomisasi Warna</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
            {COLOR_FIELDS.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between px-4 py-3.5 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-7 h-7 rounded-full flex-shrink-0 border border-black/10"
                    style={{ background: colors[key] }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400 truncate">{desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-300 font-mono uppercase hidden sm:block">
                    {colors[key]}
                  </span>
                  <input
                    type="color"
                    value={colors[key]}
                    onChange={e => handleColorChange(key, e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">👁</span>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Preview</h2>
          </div>
          <LivePreview template={selectedTemplate} colors={colors} />
        </div>

        {/* Save */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm text-green-600 font-semibold flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Tema berhasil disimpan!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan Tema'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
