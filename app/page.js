import Link from 'next/link'

export const metadata = {
  title: 'NextCommerce — Platform Toko Online UMKM Indonesia',
  description: 'Buat toko online Anda dalam menit. Katalog produk, keranjang, dan pemesanan via WhatsApp.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-xl text-gray-900">NextCommerce</span>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-sm text-gray-600 hover:text-gray-900">Login Admin</Link>
            <Link href="/register" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Toko Online untuk<br />UMKM Indonesia
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
          Buat katalog produk, terima pesanan via WhatsApp, dan kelola toko Anda — semua dalam satu platform yang simpel.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="px-8 py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-base">
            Mulai Gratis Sekarang
          </Link>
          <Link href="/admin/login" className="px-8 py-3.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-base">
            Sudah Punya Toko
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: '🛍️', title: 'Katalog Produk', desc: 'Upload produk dengan gambar, varian ukuran/warna, dan stok yang mudah dikelola.' },
            { icon: '💬', title: 'Pesan via WhatsApp', desc: 'Pelanggan checkout langsung ke WhatsApp Anda. Tidak perlu payment gateway.' },
            { icon: '📱', title: 'Mobile-First', desc: 'Tampilan toko optimal di HP. Pelanggan Anda bisa belanja kapan saja dari mana saja.' },
          ].map((f) => (
            <div key={f.title} className="text-center p-6 rounded-2xl bg-gray-50">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Siap buka toko?</h2>
        <p className="text-gray-400 mb-8">Daftar gratis, toko langsung aktif dalam menit.</p>
        <Link href="/register" className="inline-block px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors">
          Daftar Sekarang
        </Link>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} NextCommerce. Dibuat dengan ❤️ untuk UMKM Indonesia.
      </footer>
    </div>
  )
}
