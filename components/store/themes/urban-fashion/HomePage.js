'use client'

import Link from 'next/link'
import ProductCard from './ProductCard'
import { useTenant } from '@/contexts/TenantContext'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=85'
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
    title: 'TUKAR UKURAN 7 HARI',
    desc: 'Penukaran ukuran dapat dilakukan dalam 7 hari setelah barang diterima',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'KUALITAS TERJAMIN',
    desc: 'Setiap produk melalui quality control ketat sebelum dikirim ke pelanggan',
  },
]

export default function UrbanFashionHomePage({ products, collections }) {
  const { slug } = useTenant()
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-12 left-8 md:left-16 text-white">
          <p className="text-xs tracking-widest uppercase mb-3 opacity-80">Koleksi Terbaru</p>
          <h1 className="font-serif text-4xl md:text-6xl font-medium leading-tight mb-6 max-w-md">
            Tampil Percaya Diri Setiap Hari
          </h1>
          <div className="flex gap-4">
            <Link
              href={`/${slug}/collections/kaos-pria`}
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white border-b border-white pb-0.5 hover:opacity-70 transition-opacity"
            >
              Shop Pria <span>›</span>
            </Link>
            <Link
              href={`/${slug}/collections/kaos-wanita`}
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white border-b border-white pb-0.5 hover:opacity-70 transition-opacity"
            >
              Shop Wanita <span>›</span>
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
                <img
                  src={col.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
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
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">Koleksi</p>
              <h2 className="font-serif text-2xl md:text-3xl text-black">Produk Terbaru</h2>
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

      {/* ── EDITORIAL SPLIT ──────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
        <div className="relative overflow-hidden aspect-[4/5] md:aspect-auto">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
            alt="Women collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute bottom-8 left-8">
            <p className="text-xs tracking-widest uppercase text-white/70 mb-2">Koleksi Wanita</p>
            <Link
              href={`/${slug}/collections/kaos-wanita`}
              className="inline-flex items-center gap-2 text-sm text-white border-b border-white pb-0.5 tracking-wider uppercase hover:opacity-70 transition-opacity"
            >
              Shop Now ›
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden aspect-[4/5] md:aspect-auto">
          <img
            src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80"
            alt="Men collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute bottom-8 left-8">
            <p className="text-xs tracking-widest uppercase text-white/70 mb-2">Koleksi Pria</p>
            <Link
              href={`/${slug}/collections/kaos-pria`}
              className="inline-flex items-center gap-2 text-sm text-white border-b border-white pb-0.5 tracking-wider uppercase hover:opacity-70 transition-opacity"
            >
              Shop Now ›
            </Link>
          </div>
        </div>
      </section>

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
          <p className="font-serif text-lg md:text-2xl font-normal max-w-2xl leading-relaxed mb-6">
            Kami berkomitmen menghadirkan pakaian berkualitas tinggi yang nyaman dipakai sehari-hari, dengan harga terjangkau langsung dari produsen untuk Anda.
          </p>
          <Link
            href={`/${slug}/about-us`}
            className="text-xs tracking-widest uppercase border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* ── SUSTAINABILITY SPLIT ─────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={SUSTAINABILITY_IMAGE}
            alt="Quality"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-stone-50 flex items-center p-10 md:p-16">
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">Kualitas Kami</p>
            <p className="font-serif text-xl md:text-2xl text-gray-900 leading-relaxed mb-6">
              Setiap helai kain dipilih dengan cermat untuk memastikan kenyamanan dan ketahanan jangka panjang. Fashion yang baik tidak harus mahal.
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
      <section className="border-t border-gray-100 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-3">
              <div className="text-gray-600">{f.icon}</div>
              <p className="text-xs tracking-widest uppercase font-medium text-black">{f.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
