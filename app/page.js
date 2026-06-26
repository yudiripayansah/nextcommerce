import Link from 'next/link'

export const metadata = {
  title: 'NextCommerce — Buka Toko Online dalam 5 Menit',
  description: 'Platform toko online paling simpel untuk UMKM Indonesia. Upload produk, terima pesanan via WhatsApp — tanpa coding, langsung aktif.',
  openGraph: {
    title: 'NextCommerce — Buka Toko Online dalam 5 Menit',
    description: 'Platform toko online paling simpel untuk UMKM Indonesia.',
  },
}

const BG = '#F9F9F6'
const DARK = '#0E0E0D'
const GREEN = '#16A34A'
const GREEN_LIGHT = '#F0FDF4'
const MUTED = '#888882'
const BORDER = '#E5E5E0'
const SURFACE = '#FFFFFF'
const TEXT = '#2A2A27'

const STATS = [
  { value: '5.000+', label: 'Toko Aktif' },
  { value: '200.000+', label: 'Pesanan Diproses' },
  { value: '5 Menit', label: 'Toko Langsung Online' },
  { value: 'Rp 0', label: 'Untuk Mulai' },
]

const FEATURES = [
  {
    emoji: '💬',
    title: 'Pesanan via WhatsApp',
    desc: 'Tidak perlu payment gateway. Pelanggan checkout, langsung masuk ke WhatsApp Anda. Bayar dan konfirmasi manual — simpel seperti jualan biasa.',
    highlight: true,
  },
  {
    emoji: '🛍️',
    title: 'Katalog Produk Profesional',
    desc: 'Upload foto berkualitas, tulis deskripsi, atur varian warna & ukuran, kelola stok — semua dalam satu tempat yang rapi.',
  },
  {
    emoji: '📱',
    title: 'Tampilan Mobile-First',
    desc: 'Toko Anda otomatis tampil sempurna di HP. Lebih dari 90% pelanggan UMKM belanja dari ponsel mereka.',
  },
  {
    emoji: '🎨',
    title: 'Tema & Branding Sendiri',
    desc: 'Pilih template, sesuaikan warna ke brand Anda. Toko terlihat profesional tanpa perlu desainer.',
  },
  {
    emoji: '📦',
    title: 'Manajemen Pesanan Lengkap',
    desc: 'Lacak status pesanan dari baru masuk sampai selesai. Tidak ada pesanan yang terlewat lagi.',
  },
  {
    emoji: '👥',
    title: 'Data Pelanggan Tersimpan',
    desc: 'Semua data pelanggan dan riwayat transaksi tersimpan otomatis. Mudah untuk follow-up dan repeat order.',
  },
]

const STEPS = [
  {
    n: '1',
    title: 'Daftar & Buat Toko',
    desc: 'Masukkan nama toko dan info dasar. URL toko Anda langsung aktif dalam hitungan detik.',
    detail: 'cukup 2 menit',
  },
  {
    n: '2',
    title: 'Upload Produk',
    desc: 'Tambah produk dengan foto, harga, varian warna dan ukuran. Bisa langsung dari kamera HP Anda.',
    detail: 'bisa kapan saja',
  },
  {
    n: '3',
    title: 'Terima Pesanan',
    desc: 'Bagikan link toko ke pelanggan. Pesanan masuk ke WhatsApp, Anda tinggal konfirmasi dan proses.',
    detail: 'langsung mulai',
  },
]

const TESTIMONIALS = [
  {
    name: 'Rina Wulandari',
    store: 'Toko Jilbab Cantik',
    avatar: 'RW',
    quote: 'Sebelumnya saya terima pesanan lewat DM Instagram, capek banget dan sering kelewatan. Sekarang semua rapi, pelanggan tinggal klik link toko saya. Omzet bulan pertama langsung naik.',
    stars: 5,
  },
  {
    name: 'Budi Santoso',
    store: 'Kerajinan Bambu Pak Budi',
    avatar: 'BS',
    quote: 'Saya tidak bisa coding sama sekali, tapi toko online saya jadi dalam satu hari. Sekarang produk saya bisa dilihat orang seluruh Indonesia, bukan cuma tetangga saja.',
    stars: 5,
  },
  {
    name: 'Sari Dewi',
    store: 'Snack Homemade Sari',
    avatar: 'SD',
    quote: 'Awalnya ragu karena takut ribet. Ternyata gampang banget. Pelanggan saya bilang toko saya keliatan lebih profesional dari sebelumnya. Repeat order juga jauh lebih mudah.',
    stars: 5,
  },
]

const PRICING = [
  {
    name: 'Gratis',
    price: 'Rp 0',
    period: 'selamanya',
    desc: 'Untuk memulai dan mencoba semua fitur dasar.',
    features: [
      '10 produk aktif',
      'Pesan via WhatsApp',
      'Halaman toko online',
      'Kelola pesanan dasar',
      'Akses mobile admin',
    ],
    cta: 'Mulai Gratis',
    href: '/register',
    featured: false,
  },
  {
    name: 'Pro',
    price: 'Rp 79.000',
    period: '/bulan',
    desc: 'Untuk penjual serius yang ingin berkembang lebih cepat.',
    features: [
      'Produk tidak terbatas',
      'Multi-varian produk',
      'Media library Cloudinary',
      'Tema & warna custom',
      'Analitik penjualan',
      'Manajemen pelanggan',
      'Halaman CMS (FAQ, About, dll)',
      'Koleksi produk',
    ],
    cta: 'Coba 14 Hari Gratis',
    href: '/register',
    featured: true,
  },
]

const FAQS = [
  {
    q: 'Apakah saya perlu kemampuan coding?',
    a: 'Sama sekali tidak. NextCommerce dirancang untuk pemilik usaha, bukan developer. Jika Anda bisa upload foto ke WhatsApp, Anda bisa kelola toko di NextCommerce.',
  },
  {
    q: 'Bagaimana cara pelanggan memesan?',
    a: 'Pelanggan buka toko Anda, pilih produk, masukkan ke keranjang, isi nama dan nomor WhatsApp, lalu klik "Pesan via WhatsApp". Mereka otomatis diarahkan ke chat WhatsApp Anda dengan detail pesanan yang sudah terformat rapi.',
  },
  {
    q: 'Apakah ada biaya per transaksi atau komisi?',
    a: 'Tidak ada sama sekali. Anda hanya bayar biaya langganan bulanan (atau gratis selamanya untuk paket Gratis). Tidak ada potongan dari setiap penjualan — 100% milik Anda.',
  },
  {
    q: 'Apakah toko saya bisa ditemukan di Google?',
    a: 'Ya. Setiap toko dioptimalkan untuk SEO dengan judul, deskripsi, dan Open Graph yang proper. Produk dan halaman koleksi juga terindeks oleh mesin pencari.',
  },
  {
    q: 'Bagaimana dengan keamanan data saya?',
    a: 'Data tersimpan di Google Firebase, infrastruktur cloud kelas enterprise yang digunakan jutaan aplikasi di seluruh dunia. Autentikasi menggunakan Firebase Authentication yang dienkripsi penuh.',
  },
  {
    q: 'Bisakah saya upgrade atau downgrade kapan saja?',
    a: 'Ya, Anda bebas upgrade ke Pro kapan pun siap, atau tetap di paket Gratis selama yang Anda mau. Tidak ada kontrak jangka panjang.',
  },
]

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={GREEN} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg className="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.25s', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function LandingPage() {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        details summary { cursor: pointer; list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        details[open] .chevron { transform: rotate(180deg); }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatUpDelay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        .badge-float { animation: floatUp 4s ease-in-out infinite; }
        .badge-float-delay { animation: floatUpDelay 4s ease-in-out infinite 2s; }
        .live-dot { animation: pulse-dot 2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .badge-float, .badge-float-delay, .live-dot { animation: none; }
        }
        .nav-link { color: ${MUTED}; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.15s; }
        .nav-link:hover { color: ${DARK}; }
        .faq-item { border-bottom: 1px solid ${BORDER}; }
        .faq-item:last-child { border-bottom: none; }
        details summary:focus-visible { outline: 2px solid ${GREEN}; outline-offset: 4px; border-radius: 4px; }
        .cta-primary:focus-visible { outline: 2px solid ${GREEN}; outline-offset: 4px; }
        .cta-secondary:focus-visible { outline: 2px solid ${DARK}; outline-offset: 4px; }
      `}</style>

      <div style={{ background: BG, color: TEXT, fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>

        {/* ── NAV ── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(249,249,246,0.85)', backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${BORDER}`,
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, fontSize: '1.125rem', color: DARK, letterSpacing: '-0.02em' }}>
              Next<span style={{ color: GREEN }}>Commerce</span>
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile">
              <a href="#fitur" className="nav-link">Fitur</a>
              <a href="#cara-kerja" className="nav-link">Cara Kerja</a>
              <a href="#harga" className="nav-link">Harga</a>
              <a href="#faq" className="nav-link">FAQ</a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link href="/admin/login" style={{ color: MUTED, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, display: 'none' }} className="nav-link">
                Masuk
              </Link>
              <Link
                href="/admin/login"
                style={{ fontSize: '0.875rem', fontWeight: 500, color: MUTED, textDecoration: 'none', padding: '8px 16px' }}
                className="nav-link"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="cta-primary"
                style={{
                  background: DARK, color: '#fff', textDecoration: 'none',
                  padding: '9px 20px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                Coba Gratis →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ padding: '72px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 64, alignItems: 'center' }}>

            {/* Left: copy */}
            <div style={{ maxWidth: 640 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: GREEN_LIGHT, border: `1px solid #BBF7D0`,
                borderRadius: 100, padding: '6px 14px', marginBottom: 28,
              }}>
                <span className="live-dot" style={{ width: 7, height: 7, background: GREEN, borderRadius: '50%', display: 'block' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: GREEN }}>
                  Gratis untuk memulai · Tanpa kartu kredit
                </span>
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                color: DARK,
                letterSpacing: '-0.03em',
                marginBottom: 24,
                textWrap: 'balance',
              }}>
                Buka Toko Online Anda{' '}
                <span style={{ color: GREEN, fontStyle: 'italic' }}>Sekarang.</span>
                <br />Pesanan Masuk Lewat WhatsApp.
              </h1>

              <p style={{ fontSize: '1.125rem', color: MUTED, lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
                Platform toko online paling simpel untuk UMKM Indonesia. Upload produk, atur harga, dan terima pesanan langsung lewat WhatsApp — tanpa coding, tanpa ribet.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                <Link
                  href="/register"
                  className="cta-primary"
                  style={{
                    background: DARK, color: '#fff', textDecoration: 'none',
                    padding: '14px 32px', borderRadius: 10, fontSize: '1rem', fontWeight: 700,
                    letterSpacing: '-0.01em', display: 'inline-block',
                  }}
                >
                  Buat Toko Gratis →
                </Link>
                <Link
                  href="/admin/login"
                  className="cta-secondary"
                  style={{
                    border: `2px solid ${BORDER}`, color: TEXT, textDecoration: 'none',
                    padding: '14px 32px', borderRadius: 10, fontSize: '1rem', fontWeight: 600,
                    display: 'inline-block', background: SURFACE,
                  }}
                >
                  Sudah Punya Akun
                </Link>
              </div>

              <p style={{ fontSize: '0.8125rem', color: MUTED }}>
                ✓ Gratis selamanya &nbsp;&nbsp; ✓ Tanpa coding &nbsp;&nbsp; ✓ Aktif dalam 5 menit
              </p>
            </div>

            {/* Right: phone mockup */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 40, paddingBottom: 40 }}>

              {/* Phone frame */}
              <div style={{
                background: '#1A1A1A',
                borderRadius: 44,
                padding: '14px',
                boxShadow: '0 40px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.12)',
                width: 260,
                flexShrink: 0,
              }}>
                {/* Notch */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <div style={{ width: 80, height: 6, background: '#333', borderRadius: 10 }} />
                </div>
                {/* Screen */}
                <div style={{ background: SURFACE, borderRadius: 30, overflow: 'hidden', height: 520, position: 'relative' }}>
                  {/* Store header */}
                  <div style={{ background: DARK, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 9, color: '#666', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Toko Online</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Batik Nusantara</div>
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🛒</div>
                  </div>

                  {/* Collection label */}
                  <div style={{ padding: '10px 12px 4px', fontSize: 9, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Koleksi Terbaru
                  </div>

                  {/* Product grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '4px 12px 12px' }}>
                    {[
                      { name: 'Batik Solo Klasik', price: 'Rp 250.000', bg: '#FEF3C7', emoji: '👘', sold: true },
                      { name: 'Batik Parang Jogja', price: 'Rp 180.000', bg: '#FCE7F3', emoji: '🪷', sold: false },
                      { name: 'Batik Mega Mendung', price: 'Rp 320.000', bg: '#DBEAFE', emoji: '🌊', sold: false },
                      { name: 'Batik Kawung Madura', price: 'Rp 150.000', bg: '#D1FAE5', emoji: '🌿', sold: false },
                    ].map((p) => (
                      <div key={p.name} style={{ background: SURFACE, borderRadius: 12, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                        <div style={{ background: p.bg, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, position: 'relative' }}>
                          {p.emoji}
                          {p.sold && (
                            <div style={{ position: 'absolute', top: 6, left: 6, background: DARK, color: '#fff', fontSize: 7, fontWeight: 700, borderRadius: 4, padding: '2px 5px' }}>
                              HABIS
                            </div>
                          )}
                        </div>
                        <div style={{ padding: '6px 8px' }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: DARK, marginBottom: 2, lineHeight: 1.3 }}>{p.name}</div>
                          <div style={{ fontSize: 10, color: GREEN, fontWeight: 700 }}>{p.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp CTA */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px 14px', background: 'linear-gradient(to top, white 70%, transparent)' }}>
                    <div style={{
                      background: GREEN, color: '#fff', borderRadius: 12,
                      padding: '11px', textAlign: 'center', fontSize: 12, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <span>💬</span> Pesan via WhatsApp
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge: new order */}
              <div className="badge-float" style={{
                position: 'absolute', right: -10, top: 60,
                background: SURFACE, border: `1px solid ${BORDER}`,
                borderRadius: 16, padding: '10px 14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                minWidth: 160,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: DARK, marginBottom: 3 }}>📦 Pesanan Baru!</div>
                <div style={{ fontSize: 10, color: MUTED }}>2 × Batik Solo · Rp 500rb</div>
                <div style={{ fontSize: 9, color: GREEN, marginTop: 4, fontWeight: 600 }}>Baru saja</div>
              </div>

              {/* Floating badge: active */}
              <div className="badge-float-delay" style={{
                position: 'absolute', left: -20, bottom: 80,
                background: SURFACE, border: `1px solid ${BORDER}`,
                borderRadius: 16, padding: '10px 14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                minWidth: 150,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span className="live-dot" style={{ width: 6, height: 6, background: GREEN, borderRadius: '50%', display: 'block' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>Toko Aktif</span>
                </div>
                <div style={{ fontSize: 10, color: MUTED }}>38 pengunjung hari ini</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px 0' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '0 16px' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: DARK, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.8125rem', color: MUTED, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROBLEM ── */}
        <section style={{ background: DARK, padding: '80px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
                Masalah yang Anda Hadapi
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700, color: '#F9F9F6',
                lineHeight: 1.2, letterSpacing: '-0.025em',
                textWrap: 'balance',
              }}>
                Selama ini, jualan online itu…<br />
                <span style={{ fontStyle: 'italic', color: '#F87171' }}>ribet banget.</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
              {[
                { icon: '💸', title: 'Bikin website mahal', desc: 'Harus bayar developer jutaan rupiah, belum termasuk hosting dan domain yang harus diperpanjang setiap tahun.' },
                { icon: '😤', title: 'Marketplace terlalu kompetitif', desc: 'Produk Anda tenggelam di antara ribuan pesaing. Belum lagi komisi platform yang memotong keuntungan.' },
                { icon: '😰', title: 'Jualan di sosmed itu melelahkan', desc: 'DM terus-menerus, pesanan tidak tercatat, dan tidak bisa dilihat pelanggan baru yang tidak follow Anda.' },
              ].map((p) => (
                <div key={p.title} style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16, padding: '24px',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F9F9F6', marginBottom: 8 }}>{p.title}</div>
                  <div style={{ fontSize: '0.875rem', color: '#888882', lineHeight: 1.65 }}>{p.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-block',
                background: GREEN, color: '#fff',
                borderRadius: 100, padding: '12px 28px',
                fontSize: '0.9375rem', fontWeight: 700,
              }}>
                NextCommerce hadir sebagai solusinya →
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="fitur" style={{ padding: '88px 24px', background: BG }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
                Semua yang Anda Butuhkan
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700, color: DARK,
                lineHeight: 1.2, letterSpacing: '-0.025em',
                textWrap: 'balance',
              }}>
                Fitur lengkap. Harga masuk akal.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  style={{
                    background: f.highlight ? DARK : SURFACE,
                    border: `1px solid ${f.highlight ? 'transparent' : BORDER}`,
                    borderRadius: 16, padding: '28px 24px',
                    position: 'relative',
                  }}
                >
                  {f.highlight && (
                    <div style={{
                      position: 'absolute', top: 20, right: 20,
                      background: GREEN, color: '#fff',
                      fontSize: '0.6875rem', fontWeight: 700, borderRadius: 100,
                      padding: '3px 10px', letterSpacing: '0.04em',
                    }}>
                      Unggulan
                    </div>
                  )}
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{f.emoji}</div>
                  <div style={{
                    fontSize: '1rem', fontWeight: 700, marginBottom: 10,
                    color: f.highlight ? '#F9F9F6' : DARK,
                  }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', lineHeight: 1.7, color: f.highlight ? '#888882' : MUTED }}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="cara-kerja" style={{ background: '#F2F2EE', padding: '88px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
                Cara Kerja
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700, color: DARK,
                lineHeight: 1.2, letterSpacing: '-0.025em',
                textWrap: 'balance',
              }}>
                Toko online Anda aktif<br />dalam 3 langkah.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 0, position: 'relative' }}>
              {STEPS.map((s, i) => (
                <div key={s.n} style={{ padding: '0 32px 0 0', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                    <div style={{
                      width: 48, height: 48, background: DARK, color: '#fff',
                      borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.125rem', fontWeight: 900, flexShrink: 0,
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}>
                      {s.n}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                        {s.detail}
                      </div>
                      <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: DARK, marginBottom: 10 }}>{s.title}</div>
                      <div style={{ fontSize: '0.875rem', color: MUTED, lineHeight: 1.7 }}>{s.desc}</div>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      position: 'absolute', top: 24, left: 72,
                      width: 'calc(100% - 40px)', height: 1,
                      background: `linear-gradient(to right, ${BORDER} 60%, transparent)`,
                      display: 'none',
                    }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 56 }}>
              <Link href="/register" className="cta-primary" style={{
                background: DARK, color: '#fff', textDecoration: 'none',
                padding: '14px 36px', borderRadius: 10, fontSize: '1rem', fontWeight: 700,
                display: 'inline-block', letterSpacing: '-0.01em',
              }}>
                Mulai Sekarang, Gratis →
              </Link>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ padding: '88px 24px', background: BG }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
                Kata Mereka
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700, color: DARK,
                lineHeight: 1.2, letterSpacing: '-0.025em',
              }}>
                Penjual UMKM sudah merasakannya.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} style={{
                  background: SURFACE, border: `1px solid ${BORDER}`,
                  borderRadius: 20, padding: '28px',
                }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                    {Array.from({ length: t.stars }).map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <p style={{
                    fontSize: '0.9375rem', color: TEXT, lineHeight: 1.75,
                    marginBottom: 24, fontStyle: 'italic',
                  }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, background: DARK, color: '#fff',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: DARK }}>{t.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: MUTED }}>{t.store}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="harga" style={{ background: '#F2F2EE', padding: '88px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
                Harga
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700, color: DARK,
                lineHeight: 1.2, letterSpacing: '-0.025em',
                textWrap: 'balance',
              }}>
                Mulai gratis. Upgrade jika sudah siap.
              </h2>
              <p style={{ color: MUTED, marginTop: 16, fontSize: '0.9375rem' }}>
                Tidak ada biaya tersembunyi. Tidak ada komisi per transaksi.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 740, margin: '0 auto' }}>
              {PRICING.map((p) => (
                <div key={p.name} style={{
                  background: p.featured ? DARK : SURFACE,
                  border: `2px solid ${p.featured ? DARK : BORDER}`,
                  borderRadius: 20, padding: '32px 28px',
                  position: 'relative',
                }}>
                  {p.featured && (
                    <div style={{
                      position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                      background: GREEN, color: '#fff',
                      fontSize: '0.75rem', fontWeight: 700, borderRadius: 100,
                      padding: '5px 16px', whiteSpace: 'nowrap',
                    }}>
                      Paling Populer
                    </div>
                  )}

                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: p.featured ? '#888882' : MUTED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {p.name}
                    </span>
                  </div>

                  <div style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: p.featured ? '#F9F9F6' : DARK, letterSpacing: '-0.04em' }}>
                      {p.price}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: p.featured ? '#888882' : MUTED, marginLeft: 4 }}>
                      {p.period}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: p.featured ? '#888882' : MUTED, marginBottom: 28, lineHeight: 1.6 }}>
                    {p.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {p.features.map((f) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CheckIcon />
                        <span style={{ fontSize: '0.875rem', color: p.featured ? '#D1D5DB' : TEXT }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link href={p.href} className="cta-primary" style={{
                    display: 'block', textAlign: 'center', textDecoration: 'none',
                    background: p.featured ? GREEN : DARK,
                    color: '#fff', borderRadius: 10,
                    padding: '13px', fontSize: '0.9375rem', fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}>
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ padding: '88px 24px', background: BG }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700, color: DARK,
                lineHeight: 1.2, letterSpacing: '-0.025em',
              }}>
                Pertanyaan yang Sering Ditanyakan
              </h2>
            </div>

            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', background: SURFACE }}>
              {FAQS.map((f, i) => (
                <details key={i} className="faq-item" style={{ padding: '0' }}>
                  <summary style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', gap: 16,
                  }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: DARK, lineHeight: 1.5 }}>
                      {f.q}
                    </span>
                    <ChevronIcon />
                  </summary>
                  <div style={{ padding: '0 24px 20px', fontSize: '0.9rem', color: MUTED, lineHeight: 1.75 }}>
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ background: DARK, padding: '96px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>
              Mulai Jualan Online
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800, color: '#F9F9F6',
              lineHeight: 1.15, letterSpacing: '-0.03em',
              marginBottom: 24, textWrap: 'balance',
            }}>
              Toko online Anda bisa aktif<br />
              <span style={{ color: GREEN, fontStyle: 'italic' }}>hari ini juga.</span>
            </h2>
            <p style={{ color: '#666', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: 40 }}>
              Lebih dari 5.000 penjual UMKM Indonesia sudah membuka toko mereka di NextCommerce.
              Giliran Anda — tanpa biaya awal, tanpa risiko.
            </p>
            <Link href="/register" className="cta-primary" style={{
              display: 'inline-block', textDecoration: 'none',
              background: GREEN, color: '#fff',
              padding: '16px 44px', borderRadius: 12,
              fontSize: '1.0625rem', fontWeight: 700,
              letterSpacing: '-0.01em',
            }}>
              Buat Toko Gratis Sekarang →
            </Link>
            <p style={{ color: '#444', fontSize: '0.8125rem', marginTop: 18 }}>
              Gratis selamanya · Tidak perlu kartu kredit · Aktif dalam 5 menit
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: '#0A0A09', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px 36px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, marginBottom: 40 }}>
              <div style={{ maxWidth: 280 }}>
                <div style={{ fontWeight: 800, fontSize: '1.125rem', color: '#F9F9F6', marginBottom: 12, letterSpacing: '-0.02em' }}>
                  Next<span style={{ color: GREEN }}>Commerce</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#555', lineHeight: 1.7 }}>
                  Platform toko online untuk UMKM Indonesia. Simpel, cepat, dan langsung via WhatsApp.
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                    Produk
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['Fitur', 'Cara Kerja', 'Harga', 'FAQ'].map((l) => (
                      <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.875rem', color: '#555', textDecoration: 'none' }}>{l}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                    Akun
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Link href="/register" style={{ fontSize: '0.875rem', color: '#555', textDecoration: 'none' }}>Daftar Gratis</Link>
                    <Link href="/admin/login" style={{ fontSize: '0.875rem', color: '#555', textDecoration: 'none' }}>Login Admin</Link>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <p style={{ fontSize: '0.8125rem', color: '#333' }}>
                © {year} NextCommerce · Platform UMKM Indonesia
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#333' }}>
                Dibuat dengan ❤️ di Indonesia
              </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
