'use client'

import Link from 'next/link'
import ProductCard from './ProductCard'
import { useSettings } from '@/contexts/SettingsContext'
import { useTenant } from '@/contexts/TenantContext'

const SUSTAINABILITY_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80'

const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'PENGIRIMAN KE RUMAH',
    desc: 'Gratis ongkir ke seluruh Indonesia tanpa minimum pembelian',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'TUKAR BARANG 7 HARI',
    desc: 'Penukaran barang dapat dilakukan dalam 7 hari setelah diterima',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'KUALITAS TERJAMIN',
    desc: 'Setiap produk melalui quality control ketat sebelum dikirim',
  },
]

export default function UrbanFashionHomePage({ products, collections }) {
  const { slug } = useTenant()
  const settings = useSettings()

  const heroImage = settings?.heroImage || 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=85'

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute bottom-12 left-8 md:left-16 text-white">
          <p className="text-xs tracking-widest uppercase mb-3 opacity-80">Koleksi Terbaru</p>
          <h1 className="font-serif text-4xl md:text-6xl font-medium leading-tight mb-6 max-w-md">
            {settings?.storeName || 'Toko Online'}
          </h1>
          <div className="flex gap-4">
            <Link
              href={`/${slug}/collections`}
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white border-b border-white pb-0.5 hover:opacity-70 transition-opacity"
            >
              Lihat Koleksi <span>›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS GRID ─────────────────────────────────────────── */}
      {collections.length > 0 && (
        <section className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {collections.slice(0, 4).map((col) => (
              <Link
                key={col.id}
                href={`/${slug}/collections/${col.handle}`}
                className="group relative overflow-hidden aspect-[3/4]"
              >
                <div className="w-full h-full" style={{ background: 'var(--color-surface)' }}>
                  <img
                    src={col.image || SUSTAINABILITY_IMAGE}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-xs tracking-widest uppercase font-medium">{col.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── NEW ARRIVALS ─────────────────────────────────────────────── */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>Koleksi</p>
              <h2 className="font-serif text-2xl md:text-3xl" style={{ color: 'var(--color-text)' }}>Produk Terbaru</h2>
            </div>
            <Link
              href={`/${slug}/collections`}
              className="text-xs tracking-widest uppercase pb-0.5 hover:opacity-60 transition-opacity"
              style={{ color: 'var(--color-primary)', borderBottom: '1px solid var(--color-primary)' }}
            >
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── ABOUT US BANNER ──────────────────────────────────────────── */}
      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={ABOUT_IMAGE}
          alt="About us"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <p className="text-xs tracking-widest uppercase mb-4 opacity-70">Tentang Kami</p>
          <p className="font-serif text-lg md:text-2xl font-normal max-w-2xl leading-relaxed mb-6 opacity-90">
            Kami berkomitmen menghadirkan produk berkualitas tinggi dengan harga terjangkau langsung untuk Anda.
          </p>
          <Link
            href={`/${slug}/about-us`}
            className="text-xs tracking-widest uppercase border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors"
          >
            Selengkapnya
          </Link>
        </div>
      </section>

      {/* ── QUALITY SPLIT ─────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={SUSTAINABILITY_IMAGE}
            alt="Quality"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center p-10 md:p-16" style={{ background: 'var(--color-surface)' }}>
          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-muted)' }}>Kualitas Kami</p>
            <p className="font-serif text-xl md:text-2xl leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>
              Setiap produk dipilih dengan cermat untuk memastikan kenyamanan dan ketahanan jangka panjang.
            </p>
            <Link
              href={`/${slug}/how-to-buy`}
              className="text-xs tracking-widest uppercase pb-0.5 hover:opacity-60 transition-opacity"
              style={{ color: 'var(--color-primary)', borderBottom: '1px solid var(--color-primary)' }}
            >
              Cara Pembelian
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-3">
              <div style={{ color: 'var(--color-text-muted)' }}>{f.icon}</div>
              <p className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--color-text)' }}>{f.title}</p>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--color-text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
