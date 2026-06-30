'use client'

import Link from 'next/link'
import ProductCard from './ProductCard'
import { useSettings } from '@/contexts/SettingsContext'
import { useTenant } from '@/contexts/TenantContext'

const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80'
const DEFAULT_QUALITY_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=85'

export default function UrbanFashionHomePage({ products, collections }) {
  const { slug } = useTenant()
  const settings = useSettings()
  const c = settings?.content || {}

  const heroImage = c.hero?.image || settings?.heroImage || DEFAULT_HERO_IMAGE
  const aboutImage = c.about?.image || DEFAULT_ABOUT_IMAGE
  const qualityImage = c.about?.image || DEFAULT_QUALITY_IMAGE

  const heroTitle = c.hero?.title || settings?.storeName || 'Toko Online'
  const heroBadge = c.hero?.badge || 'Koleksi Terbaru'
  const heroCta = c.hero?.ctaText || 'Lihat Koleksi'
  const collectionsTitle = c.collectionsTitle || 'Koleksi'
  const productsTitle = c.productsTitle || 'Produk Terbaru'
  const aboutTitle = c.about?.title || 'Tentang Kami'
  const aboutText = c.about?.text || 'Kami berkomitmen menghadirkan produk berkualitas tinggi dengan harga terjangkau langsung untuk Anda.'
  const promoTitle = c.promo?.title || 'Kualitas Kami'
  const promoText = c.promo?.text || 'Setiap produk dipilih dengan cermat untuk memastikan kenyamanan dan ketahanan jangka panjang.'

  const features = c.features?.length === 3 ? c.features : [
    { icon: '📦', title: 'PENGIRIMAN KE RUMAH', desc: 'Gratis ongkir ke seluruh Indonesia tanpa minimum pembelian' },
    { icon: '🔄', title: 'TUKAR BARANG 7 HARI', desc: 'Penukaran barang dapat dilakukan dalam 7 hari setelah diterima' },
    { icon: '✅', title: 'KUALITAS TERJAMIN', desc: 'Setiap produk melalui quality control ketat sebelum dikirim' },
  ]

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
          <p className="text-xs tracking-widest uppercase mb-3 opacity-80">{heroBadge}</p>
          <h1 className="font-serif text-4xl md:text-6xl font-medium leading-tight mb-6 max-w-md">
            {heroTitle}
          </h1>
          {c.hero?.subtitle && (
            <p className="text-sm md:text-base max-w-sm mb-6 opacity-85 leading-relaxed">{c.hero.subtitle}</p>
          )}
          <div className="flex gap-4">
            <Link
              href={`/${slug}/collections`}
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white border-b border-white pb-0.5 hover:opacity-70 transition-opacity"
            >
              {heroCta} <span>›</span>
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
                    src={col.image || DEFAULT_QUALITY_IMAGE}
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
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>{collectionsTitle}</p>
              <h2 className="font-serif text-2xl md:text-3xl" style={{ color: 'var(--color-text)' }}>{productsTitle}</h2>
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
          src={aboutImage}
          alt="About us"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <p className="text-xs tracking-widest uppercase mb-4 opacity-70">{aboutTitle}</p>
          <p className="font-serif text-lg md:text-2xl font-normal max-w-2xl leading-relaxed mb-6 opacity-90">
            {aboutText}
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
            src={qualityImage}
            alt="Quality"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center p-10 md:p-16" style={{ background: 'var(--color-surface)' }}>
          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-muted)' }}>Kualitas Kami</p>
            <p className="font-serif text-xl md:text-2xl leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>
              {promoText}
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
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <span className="text-3xl">{f.icon}</span>
              <p className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--color-text)' }}>{f.title}</p>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--color-text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
