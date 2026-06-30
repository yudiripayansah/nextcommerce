'use client'

import Link from 'next/link'
import ProductCard from './ProductCard'
import { useTenant } from '@/contexts/TenantContext'
import { useSettings } from '@/contexts/SettingsContext'

export default function HappyHobbyHomePage({ products, collections }) {
  const { slug } = useTenant()
  const settings = useSettings()
  const c = settings?.content || {}

  const heroBadge = c.hero?.badge || '✨ Koleksi Terbaru'
  const heroTitle = c.hero?.title || 'Temukan Produk Yang Kamu Suka'
  const heroSubtitle = c.hero?.subtitle || 'Pilihan lengkap dengan kualitas terbaik, langsung dari produsen ke tanganmu.'
  const heroCta = c.hero?.ctaText || 'Belanja Sekarang'
  const collectionsTitle = c.collectionsTitle || 'Belanja Berdasarkan Kategori'
  const productsTitle = c.productsTitle || '🔥 Produk Terpopuler'
  const promoTitle = c.promo?.title || 'Gratis Ongkir Seluruh Indonesia!'
  const promoText = c.promo?.text || 'Untuk setiap pembelian di atas Rp200.000. Pesan sekarang, dikirim hari ini!'
  const promoCta = c.promo?.ctaText || 'Mulai Belanja Sekarang'

  const features = c.features?.length === 3 ? c.features : [
    { icon: '🚀', title: 'Pengiriman Cepat', desc: 'Pesanan diproses dalam 1x24 jam ke seluruh Indonesia' },
    { icon: '🔄', title: 'Tukar Ukuran 7 Hari', desc: 'Tidak pas? Tukar ukuran gratis dalam 7 hari setelah terima' },
    { icon: '✅', title: 'Kualitas Terjamin', desc: 'Setiap produk dicek kualitasnya sebelum dikirim ke kamu' },
  ]

  return (
    <div style={{ background: 'var(--color-bg)' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-surface)' }} className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 mb-5"
                style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderRadius: 'var(--tm-radius-pill)' }}
              >
                {heroBadge}
              </span>
              <h1
                className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-5"
                style={{ color: 'var(--color-text)' }}
              >
                {heroTitle.includes('\n')
                  ? heroTitle.split('\n').map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {i === 1 ? <span style={{ color: 'var(--color-primary)' }}>{line}</span> : line}
                      </span>
                    ))
                  : <><span>{heroTitle.split(' ').slice(0, Math.ceil(heroTitle.split(' ').length / 2)).join(' ')}</span><br /><span style={{ color: 'var(--color-primary)' }}>{heroTitle.split(' ').slice(Math.ceil(heroTitle.split(' ').length / 2)).join(' ')}</span></>
                }
              </h1>
              <p className="text-base text-gray-500 mb-8 max-w-md mx-auto md:mx-0">
                {heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href={`/${slug}/collections`}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderRadius: 'var(--tm-radius-pill)' }}
                >
                  {heroCta} →
                </Link>
                <Link
                  href={`/${slug}/how-to-buy`}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold border-2 transition-colors hover:opacity-80"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', background: 'transparent', borderRadius: 'var(--tm-radius-pill)' }}
                >
                  Cara Pembelian
                </Link>
              </div>
            </div>

            {/* Hero image grid */}
            {collections.length > 0 && (
              <div className="flex-1 grid grid-cols-2 gap-3 max-w-sm md:max-w-md w-full">
                {collections.slice(0, 4).map((col, i) => (
                  <Link
                    key={col.id}
                    href={`/${slug}/collections/${col.handle}`}
                    className={`group relative overflow-hidden ${i === 0 ? 'row-span-2' : ''}`}
                    style={{ borderRadius: 'var(--tm-radius-lg)', aspectRatio: i === 0 ? '3/4' : '1/1' }}
                  >
                    <img
                      src={col.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80'}
                      alt={col.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <span
                        className="inline-block text-[10px] font-bold px-2 py-0.5"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderRadius: 'var(--tm-radius-pill)' }}
                      >
                        {col.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ─────────────────────────────── */}
      {collections.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold" style={{ color: 'var(--color-text)' }}>
                {collectionsTitle}
              </h2>
              <Link
                href={`/${slug}/collections`}
                className="text-sm font-bold transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}
              >
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/${slug}/collections/${col.handle}`}
                  className="group block relative overflow-hidden aspect-square"
                  style={{ borderRadius: 'var(--tm-radius-lg)', boxShadow: 'var(--tm-card-shadow)' }}
                >
                  {col.image ? (
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: 'var(--color-surface)' }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/5 group-hover:from-black/70 transition" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-sm leading-tight">{col.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ────────────────────────────── */}
      {products.length > 0 && (
        <section className="py-12 md:py-16" style={{ background: 'var(--color-surface)' }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold" style={{ color: 'var(--color-text)' }}>
                {productsTitle}
              </h2>
              <Link
                href={`/${slug}/collections`}
                className="text-sm font-bold transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}
              >
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROMO BANNER ─────────────────────────────────── */}
      <section
        className="py-16 md:py-20"
        style={{ background: 'var(--color-primary)' }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p
            className="text-5xl mb-4 font-extrabold"
            style={{ color: 'var(--color-primary-fg)' }}
          >
            🎁
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-3"
            style={{ color: 'var(--color-primary-fg)' }}
          >
            {promoTitle}
          </h2>
          <p
            className="text-base mb-8"
            style={{ color: 'var(--color-primary-fg)', opacity: 0.85 }}
          >
            {promoText}
          </p>
          <Link
            href={`/${slug}/collections`}
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-extrabold transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary-fg)', color: 'var(--color-primary)', borderRadius: 'var(--tm-radius-pill)' }}
          >
            {promoCta} →
          </Link>
        </div>
      </section>

      {/* ── FEATURES STRIP ───────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5"
                style={{ background: 'var(--color-surface)', borderRadius: 'var(--tm-radius-lg)' }}
              >
                <span className="text-3xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{f.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
