'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { THEME_PRESETS, DEFAULT_THEME, applyThemeVars } from '@/lib/theme'
import { getSettings, saveSettings } from '@/services/settings'

const COLOR_FIELDS = [
  { key: 'primary', label: 'Warna Utama', desc: 'Warna brand utama, digunakan pada tombol dan elemen penting' },
  { key: 'primaryFg', label: 'Teks di Warna Utama', desc: 'Warna teks di atas warna utama (biasanya putih atau hitam)' },
  { key: 'accent', label: 'Warna Aksen', desc: 'Warna pendukung untuk elemen sekunder' },
  { key: 'bg', label: 'Background Halaman', desc: 'Warna latar belakang halaman utama' },
  { key: 'surface', label: 'Background Kartu', desc: 'Warna latar belakang kartu dan panel' },
  { key: 'text', label: 'Warna Teks', desc: 'Warna teks utama halaman' },
]

function ColorSwatch({ color, size = 'md' }) {
  const s = size === 'sm' ? 'w-5 h-5' : 'w-8 h-8'
  return (
    <span
      className={`${s} rounded-full border border-black/10 inline-block flex-shrink-0`}
      style={{ background: color }}
    />
  )
}

function PresetCard({ preset, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(preset)}
      className={`relative text-left rounded-2xl border-2 p-4 transition-all ${
        selected
          ? 'border-blue-600 shadow-md'
          : 'border-gray-200 hover:border-gray-400'
      }`}
    >
      {selected && (
        <span className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      <div className="flex gap-1.5 mb-3">
        <ColorSwatch color={preset.colors.primary} />
        <ColorSwatch color={preset.colors.accent} />
        <ColorSwatch color={preset.colors.bg} />
        <ColorSwatch color={preset.colors.surface} />
      </div>
      <p className="text-sm font-semibold text-gray-900">{preset.name}</p>
      {preset.id === 'urban-fashion' && (
        <p className="text-xs text-gray-500 mt-0.5">Tema default</p>
      )}
    </button>
  )
}

export default function ThemePage() {
  const [colors, setColors] = useState(DEFAULT_THEME.colors)
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_THEME.id)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const settings = await getSettings()
        if (settings?.theme) {
          setColors(settings.theme)
          const match = THEME_PRESETS.find(
            (p) =>
              p.colors.primary === settings.theme.primary &&
              p.colors.primaryFg === settings.theme.primaryFg &&
              p.colors.accent === settings.theme.accent
          )
          setSelectedPreset(match?.id || 'custom')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handlePresetSelect(preset) {
    setSelectedPreset(preset.id)
    setColors(preset.colors)
    applyThemeVars(preset.colors)
  }

  function handleColorChange(key, value) {
    setSelectedPreset('custom')
    setColors((prev) => {
      const next = { ...prev, [key]: value }
      applyThemeVars(next)
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await saveSettings({ theme: colors })
      try { localStorage.setItem('store_theme', JSON.stringify(colors)) } catch {}
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

  const activePresetName =
    THEME_PRESETS.find((p) => p.id === selectedPreset)?.name || 'Custom'

  return (
    <AdminLayout>
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tema Toko</h1>
        <p className="text-sm text-gray-500 mt-1">
          Aktif: <span className="font-medium text-gray-700">{activePresetName}</span>
        </p>
      </div>

      {/* Preset Cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Preset Warna
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEME_PRESETS.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              selected={selectedPreset === preset.id}
              onSelect={handlePresetSelect}
            />
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Kustomisasi Warna
        </h2>
        <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
          {COLOR_FIELDS.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3.5 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <ColorSwatch color={colors[key]} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 truncate">{desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-400 font-mono uppercase hidden sm:block">
                  {colors[key]}
                </span>
                <input
                  type="color"
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5 bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Bar */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Preview
        </h2>
        <div
          className="rounded-2xl overflow-hidden border border-gray-200"
          style={{ background: colors.bg }}
        >
          <div
            className="px-4 py-2 text-xs text-center tracking-widest uppercase"
            style={{ background: colors.primary, color: colors.primaryFg }}
          >
            FREE ONGKIR MIN. BELANJA 200RB
          </div>
          <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: colors.text }}>
              NAMA TOKO
            </span>
            <div className="flex gap-3">
              <span
                className="px-4 py-2 rounded-lg text-xs font-medium"
                style={{ background: colors.primary, color: colors.primaryFg }}
              >
                Beli Sekarang
              </span>
            </div>
          </div>
          <div className="px-4 py-4 flex gap-3">
            <div
              className="rounded-xl p-3 flex-1"
              style={{ background: colors.surface }}
            >
              <div className="h-16 rounded-lg mb-2" style={{ background: colors.accent + '33' }} />
              <p className="text-xs font-medium" style={{ color: colors.text }}>Nama Produk</p>
              <p className="text-xs mt-0.5" style={{ color: colors.accent }}>Rp 150.000</p>
            </div>
            <div
              className="rounded-xl p-3 flex-1"
              style={{ background: colors.surface }}
            >
              <div className="h-16 rounded-lg mb-2" style={{ background: colors.accent + '33' }} />
              <p className="text-xs font-medium" style={{ color: colors.text }}>Nama Produk</p>
              <p className="text-xs mt-0.5" style={{ color: colors.accent }}>Rp 200.000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3 pb-8">
        {saved && (
          <span className="text-sm text-green-600 font-medium">Tema berhasil disimpan!</span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Menyimpan...' : 'Simpan Tema'}
        </button>
      </div>
    </div>
    </AdminLayout>
  )
}
