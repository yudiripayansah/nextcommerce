// Seed data demo untuk toko manga-mise dan naikinnid
// Jalankan: node scripts/seed-demo-stores.js
// Atau seed satu toko: SLUG=manga-mise node scripts/seed-demo-stores.js

const { initializeApp } = require('firebase/app')
const {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  Timestamp,
} = require('firebase/firestore')

const firebaseConfig = {
  apiKey: 'AIzaSyDzO43Bqonz3cAVXKnuW8uD2_mTo-E3LcU',
  authDomain: 'nextcommerce-f2631.firebaseapp.com',
  projectId: 'nextcommerce-f2631',
  storageBucket: 'nextcommerce-f2631.firebasestorage.app',
  messagingSenderId: '913795303372',
  appId: '1:913795303372:web:be67085db95afb95497f69',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const now = Timestamp.now()

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function img(seed) {
  return `https://picsum.photos/seed/${seed}/600/800`
}

function makeVariants(options, skuPrefix, prices) {
  // prices: single number or { [optionValue]: price }
  const getPrice = (val) =>
    typeof prices === 'object' ? (prices[val] || Object.values(prices)[0]) : prices

  if (options.length === 1) {
    return options[0].values.map((v, i) => ({
      id: `v${i + 1}`,
      title: v,
      sku: `${skuPrefix}-${v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)}`,
      price: getPrice(v),
      stock: Math.floor(Math.random() * 12) + 4,
      image: '',
      option1: v, option2: '', option3: '',
    }))
  }

  const variants = []
  let i = 1
  for (const a of options[0].values) {
    for (const b of options[1].values) {
      variants.push({
        id: `v${i++}`,
        title: `${a} / ${b}`,
        sku: `${skuPrefix}-${a.slice(0, 2).toUpperCase()}-${b}`,
        price: getPrice(a),
        stock: Math.floor(Math.random() * 10) + 3,
        image: '',
        option1: a, option2: b, option3: '',
      })
    }
  }
  return variants
}

function prod({ id, title, desc, colId, colTitle, price, options, tags, imgSeed }) {
  const variants = makeVariants(options, id.toUpperCase().slice(0, 5), price)
  const prices = variants.map(v => v.price)
  return {
    id,
    title,
    handle: id,
    description: desc,
    featuredImage: img(imgSeed || id),
    images: [img(imgSeed || id), img(`${imgSeed || id}-b`)],
    tags,
    collectionId: colId,
    collectionTitle: colTitle,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    totalStock: variants.reduce((s, v) => s + v.stock, 0),
    options,
    variants,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// MANGA-MISE — Toko manga, anime merchandise, figures
// ═════════════════════════════════════════════════════════════════════════════

const mangaMiseSettings = {
  storeName: 'Manga Mise',
  logo: '',
  favicon: '',
  whatsappNumber: '6281200010001',
  email: 'hello@mangamise.id',
  phone: '08120001001',
  address: 'Jl. Akihabara No. 88, Jakarta Selatan',
  facebook: '',
  instagram: 'https://instagram.com/mangamise.id',
  tiktok: 'https://tiktok.com/@mangamise',
  theme: {
    template: 'urban-fashion',
    primary: '#1a1a2e',
    primaryFg: '#e94560',
    accent: '#16213e',
    bg: '#0f0e17',
    surface: '#1a1a2e',
    text: '#fffffe',
  },
  updatedAt: now,
}

const mangaMiseCollections = [
  { id: 'manga-komik', title: 'Manga & Komik', handle: 'manga-komik', description: 'Koleksi manga original Jepang dan komik terjemahan terlengkap.', image: img('manga-book'), status: 'active', productCount: 8, createdAt: now, updatedAt: now },
  { id: 'action-figure', title: 'Action Figure', handle: 'action-figure', description: 'Action figure dan statue karakter anime premium berbagai skala.', image: img('manga-figure'), status: 'active', productCount: 8, createdAt: now, updatedAt: now },
  { id: 'merch-anime', title: 'Merchandise Anime', handle: 'merch-anime', description: 'Merchandise resmi: poster, pin, stiker, gantungan kunci.', image: img('manga-merch'), status: 'active', productCount: 8, createdAt: now, updatedAt: now },
  { id: 'apparel-anime', title: 'Apparel Anime', handle: 'apparel-anime', description: 'Kaos, hoodie, dan jaket dengan desain karakter anime favorit.', image: img('manga-apparel'), status: 'active', productCount: 8, createdAt: now, updatedAt: now },
]

const mangaMiseProducts = [
  // ── Manga & Komik ──
  prod({ id: 'manga-one-piece-vol1', title: 'One Piece Vol. 1 – 10 (Box Set)', desc: 'Box set One Piece volume 1 hingga 10, edisi resmi Elex Media. Kondisi baru segel pabrik.', colId: 'manga-komik', colTitle: 'Manga & Komik', price: 450000, options: [{ name: 'Edisi', values: ['Indonesia', 'Jepang Original'] }], tags: ['manga', 'one piece', 'eiichiro oda'], imgSeed: 'op-manga' }),
  prod({ id: 'manga-naruto-box', title: 'Naruto Box Set Complete (72 Vol)', desc: 'Koleksi lengkap Naruto 72 volume dalam box eksklusif. Wajib dimiliki penggemar sejati.', colId: 'manga-komik', colTitle: 'Manga & Komik', price: 3200000, options: [{ name: 'Kondisi', values: ['Baru', 'Second Mulus'] }], tags: ['manga', 'naruto', 'masashi kishimoto'], imgSeed: 'naruto-box' }),
  prod({ id: 'manga-demon-slayer', title: 'Demon Slayer Vol. 1 – 23 (Complete)', desc: 'Kimetsu no Yaiba edisi lengkap. Cerita epik Tanjiro membalaskan dendam keluarganya.', colId: 'manga-komik', colTitle: 'Manga & Komik', price: 920000, options: [{ name: 'Edisi', values: ['Indonesia', 'Jepang'] }], tags: ['manga', 'kimetsu no yaiba', 'demon slayer'], imgSeed: 'demon-slayer-m' }),
  prod({ id: 'manga-attack-on-titan', title: 'Attack on Titan Vol. 1 – 34', desc: 'Shingeki no Kyojin koleksi lengkap. Salah satu manga terbaik sepanjang masa.', colId: 'manga-komik', colTitle: 'Manga & Komik', price: 1360000, options: [{ name: 'Edisi', values: ['Indonesia', 'Jepang'] }], tags: ['manga', 'aot', 'shingeki no kyojin'], imgSeed: 'aot-manga' }),
  prod({ id: 'manga-jujutsu-kaisen', title: 'Jujutsu Kaisen Vol. 1 – 20', desc: 'Serial terbaru Gege Akutami yang mengguncang dunia manga. Koleksi lengkap tersedia.', colId: 'manga-komik', colTitle: 'Manga & Komik', price: 800000, options: [{ name: 'Edisi', values: ['Indonesia', 'Jepang'] }], tags: ['manga', 'jjk', 'jujutsu kaisen'], imgSeed: 'jjk-manga' }),
  prod({ id: 'manga-my-hero-academia', title: 'My Hero Academia Vol. 1 – 15', desc: 'Boku no Hero Academia – petualangan Deku menjadi hero terbesar. Edisi Indonesia resmi.', colId: 'manga-komik', colTitle: 'Manga & Komik', price: 600000, options: [{ name: 'Edisi', values: ['Indonesia', 'Jepang'] }], tags: ['manga', 'boku no hero', 'bnha'], imgSeed: 'mha-manga' }),
  prod({ id: 'manga-fullmetal-alchemist', title: 'Fullmetal Alchemist Complete Box', desc: 'FMA 27 volume dalam box premium. Mahakarya Hiromu Arakawa yang tak lekang waktu.', colId: 'manga-komik', colTitle: 'Manga & Komik', price: 1080000, options: [{ name: 'Edisi', values: ['Indonesia', 'Jepang'] }], tags: ['manga', 'fma', 'fullmetal alchemist'], imgSeed: 'fma-manga' }),
  prod({ id: 'manga-death-note', title: 'Death Note Complete Box Set', desc: 'Death Note 12 volume + bonus eksklusif How to Read. Koleksi wajib penggemar thriller.', colId: 'manga-komik', colTitle: 'Manga & Komik', price: 520000, options: [{ name: 'Edisi', values: ['Indonesia', 'Jepang'] }], tags: ['manga', 'death note', 'light yagami'], imgSeed: 'dn-manga' }),

  // ── Action Figure ──
  prod({ id: 'figure-luffy-gear5', title: 'Figure Luffy Gear 5 – S.H.Figuarts', desc: 'S.H.Figuarts Monkey D. Luffy Gear 5 dengan ekspresi Joy Boy ikonik. Tinggi ±15cm, bisa pose.', colId: 'action-figure', colTitle: 'Action Figure', price: 650000, options: [{ name: 'Ukuran', values: ['15cm (S.H.Figuarts)', '30cm (DXF)'] }], tags: ['figure', 'luffy', 'one piece'], imgSeed: 'luffy-fig' }),
  prod({ id: 'figure-tanjiro-statue', title: 'Statue Tanjiro Kamado – Premium', desc: 'Statue resin Tanjiro dalam pose Water Breathing. Detail cat tangan yang luar biasa halus.', colId: 'action-figure', colTitle: 'Action Figure', price: 1250000, options: [{ name: 'Tinggi', values: ['20cm', '35cm (Deluxe)'] }], tags: ['figure', 'tanjiro', 'demon slayer'], imgSeed: 'tanjiro-fig' }),
  prod({ id: 'figure-eren-titan', title: 'Eren Titan Nendoroid', desc: 'Nendoroid Eren Yeager dengan 3 ekspresi wajah dan berbagai aksesori. Imut tapi mengerikan.', colId: 'action-figure', colTitle: 'Action Figure', price: 480000, options: [{ name: 'Tipe', values: ['Nendoroid Standard', 'Nendoroid Deluxe'] }], tags: ['figure', 'eren', 'aot'], imgSeed: 'eren-fig' }),
  prod({ id: 'figure-gojo-satoru', title: 'Gojo Satoru Figure – DXF', desc: 'Figure Gojo Satoru pose Infinity dengan mata biru ikonik. Edisi terbatas resmi Jump.', colId: 'action-figure', colTitle: 'Action Figure', price: 520000, options: [{ name: 'Versi', values: ['Standard', 'SPY Mode Blindfold'] }], tags: ['figure', 'gojo', 'jjk'], imgSeed: 'gojo-fig' }),
  prod({ id: 'figure-deku-all-might', title: 'Deku vs All Might Diorama', desc: 'Diorama Deku dan All Might dalam pertarungan epik. Base diorama detil tinggi.', colId: 'action-figure', colTitle: 'Action Figure', price: 890000, options: [{ name: 'Skala', values: ['1/8', '1/6 (Deluxe)'] }], tags: ['figure', 'deku', 'all might', 'mha'], imgSeed: 'mha-fig' }),
  prod({ id: 'figure-zero-two', title: 'Zero Two Figure – 1/7 Scale', desc: 'Figure Zero Two dari DARLING in the FRANXX skala 1/7. Bahan PVC berkualitas tinggi.', colId: 'action-figure', colTitle: 'Action Figure', price: 780000, options: [{ name: 'Pose', values: ['Standing Ver.', 'Battle Ver.'] }], tags: ['figure', 'zero two', 'darling in the franxx'], imgSeed: 'zero2-fig' }),
  prod({ id: 'figure-edward-elric', title: 'Edward Elric Nendoroid', desc: 'Nendoroid Edward Elric lengkap dengan Alphonse dan aksesori alchemy. Koleksi ikonik FMA.', colId: 'action-figure', colTitle: 'Action Figure', price: 460000, options: [{ name: 'Set', values: ['Edward Saja', 'Set Ed + Al'] }], tags: ['figure', 'edward', 'fma'], imgSeed: 'ed-fig' }),
  prod({ id: 'figure-ryuk-death-note', title: 'Ryuk Figure – Death Note', desc: 'Figure Ryuk shinigami dari Death Note. Detail sayap dan apel merah yang ikonik.', colId: 'action-figure', colTitle: 'Action Figure', price: 395000, options: [{ name: 'Ukuran', values: ['15cm', '25cm'] }], tags: ['figure', 'ryuk', 'death note'], imgSeed: 'ryuk-fig' }),

  // ── Merchandise Anime ──
  prod({ id: 'poster-demon-slayer-a2', title: 'Poster Demon Slayer A2 – Hashira', desc: 'Poster A2 glossy seluruh anggota Hashira dalam pose epik. Kertas foto premium 200gsm.', colId: 'merch-anime', colTitle: 'Merchandise Anime', price: 65000, options: [{ name: 'Ukuran', values: ['A3', 'A2', 'A1'] }], tags: ['poster', 'demon slayer', 'hashira'], imgSeed: 'poster-ds' }),
  prod({ id: 'keychain-set-naruto', title: 'Gantungan Kunci Set Naruto', desc: 'Set 5 gantungan kunci karakter Naruto: Naruto, Sasuke, Sakura, Kakashi, Itachi. Akrilik 5cm.', colId: 'merch-anime', colTitle: 'Merchandise Anime', price: 85000, options: [{ name: 'Jumlah', values: ['Set 5pcs', 'Satuan'] }], tags: ['gantungan kunci', 'naruto', 'aksesoris'], imgSeed: 'keychain-nar' }),
  prod({ id: 'pin-button-jjk', title: 'Pin Button Jujutsu Kaisen Set', desc: 'Set 6 pin button 58mm karakter JJK: Gojo, Geto, Itadori, Nobara, Megumi, Sukuna.', colId: 'merch-anime', colTitle: 'Merchandise Anime', price: 72000, options: [{ name: 'Set', values: ['6pcs Standard', '10pcs Complete'] }], tags: ['pin', 'button', 'jjk'], imgSeed: 'pin-jjk' }),
  prod({ id: 'sticker-pack-aot', title: 'Sticker Pack Attack on Titan', desc: 'Pack 20 stiker AoT berbahan vinyl waterproof. Karakter + quote ikonik dari serial.', colId: 'merch-anime', colTitle: 'Merchandise Anime', price: 45000, options: [{ name: 'Tipe', values: ['Vinyl Biasa', 'Holographic'] }], tags: ['stiker', 'aot', 'vinyl'], imgSeed: 'sticker-aot' }),
  prod({ id: 'mug-one-piece', title: 'Mug One Piece – Jolly Roger', desc: 'Mug keramik 350ml desain Jolly Roger Straw Hat Pirates. Tahan microwave dan dishwasher.', colId: 'merch-anime', colTitle: 'Merchandise Anime', price: 120000, options: [{ name: 'Desain', values: ['Straw Hat', 'Marine', 'Whitebeard'] }], tags: ['mug', 'one piece', 'merchandise'], imgSeed: 'mug-op' }),
  prod({ id: 'tote-bag-anime', title: 'Totebag Kanvas Anime', desc: 'Tote bag kanvas 380gsm dengan sablon karakter anime. Ukuran 38x40cm, bisa cuci mesin.', colId: 'merch-anime', colTitle: 'Merchandise Anime', price: 95000, options: [{ name: 'Desain', values: ['Naruto Akatsuki', 'One Piece Crew', 'JJK Gang', 'Demon Slayer'] }], tags: ['totebag', 'anime', 'kanvas'], imgSeed: 'tote-anime' }),
  prod({ id: 'washi-tape-mha', title: 'Washi Tape My Hero Academia Set', desc: 'Set 3 washi tape motif MHA lebar 15mm. Cocok untuk journaling, dekorasi buku, dan scrapbook.', colId: 'merch-anime', colTitle: 'Merchandise Anime', price: 55000, options: [{ name: 'Set', values: ['3pcs', '5pcs'] }], tags: ['washi tape', 'mha', 'stationery'], imgSeed: 'washi-mha' }),
  prod({ id: 'acrylic-stand-fma', title: 'Acrylic Stand FMA Set', desc: 'Stand akrilik 10cm Ed, Winry, dan Al. Desain chibi lucu, cetak UV double-side.', colId: 'merch-anime', colTitle: 'Merchandise Anime', price: 68000, options: [{ name: 'Set', values: ['2pcs Ed + Al', '3pcs Ed + Al + Winry'] }], tags: ['akrilik', 'stand', 'fma'], imgSeed: 'acrylic-fma' }),

  // ── Apparel Anime ──
  prod({ id: 'kaos-akatsuki-oversize', title: 'Kaos Akatsuki Oversize', desc: 'Kaos oversize hitam dengan sablon logo Akatsuki merah. Bahan cotton 30s, screenprint premium.', colId: 'apparel-anime', colTitle: 'Apparel Anime', price: 145000, options: [{ name: 'Ukuran', values: ['M', 'L', 'XL', 'XXL'] }], tags: ['kaos', 'akatsuki', 'naruto', 'oversize'], imgSeed: 'kaos-akatsuki' }),
  prod({ id: 'hoodie-survey-corps', title: 'Hoodie Survey Corps AoT', desc: 'Hoodie fleece Survey Corps dari Attack on Titan. Ada bordir Wings of Freedom di punggung.', colId: 'apparel-anime', colTitle: 'Apparel Anime', price: 285000, options: [{ name: 'Warna', values: ['Abu-Abu', 'Olive', 'Hitam'] }, { name: 'Ukuran', values: ['M', 'L', 'XL', 'XXL'] }], tags: ['hoodie', 'aot', 'survey corps'], imgSeed: 'hoodie-aot' }),
  prod({ id: 'kaos-jjk-cursed-energy', title: 'Kaos JJK Cursed Energy Print', desc: 'Kaos JJK dengan desain cursed energy mengalir. Print glow-in-dark di tulang-tulang Sukuna.', colId: 'apparel-anime', colTitle: 'Apparel Anime', price: 168000, options: [{ name: 'Warna', values: ['Hitam', 'Navy'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL'] }], tags: ['kaos', 'jjk', 'glow in dark'], imgSeed: 'kaos-jjk' }),
  prod({ id: 'jaket-denim-anime-patch', title: 'Jaket Denim Patch Anime Custom', desc: 'Jaket denim dengan patch bordir karakter anime pilihan. Bisa request patch sesuai keinginan.', colId: 'apparel-anime', colTitle: 'Apparel Anime', price: 420000, options: [{ name: 'Ukuran', values: ['M', 'L', 'XL'] }], tags: ['jaket', 'denim', 'patch', 'custom'], imgSeed: 'jaket-denim' }),
  prod({ id: 'kaos-one-piece-strawhat', title: 'Kaos Straw Hat Pirates Official', desc: 'Kaos resmi One Piece dengan sablon full crew Straw Hat Pirates. Bahan katun premium.', colId: 'apparel-anime', colTitle: 'Apparel Anime', price: 155000, options: [{ name: 'Warna', values: ['Putih', 'Hitam', 'Navy'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL'] }], tags: ['kaos', 'one piece', 'straw hat'], imgSeed: 'kaos-op' }),
  prod({ id: 'sweater-mha-plus-ultra', title: 'Sweater MHA PLUS ULTRA', desc: 'Sweater cropped panjang dengan tulisan PLUS ULTRA besar. Bahan cotton fleece ringan.', colId: 'apparel-anime', colTitle: 'Apparel Anime', price: 235000, options: [{ name: 'Warna', values: ['Merah', 'Biru', 'Hitam'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL'] }], tags: ['sweater', 'mha', 'plus ultra'], imgSeed: 'sweater-mha' }),
  prod({ id: 'kaos-fma-equivalent-exchange', title: 'Kaos FMA Equivalent Exchange', desc: 'Kaos dengan transmutation circle FMA di depan dan tulisan "Equivalent Exchange" di belakang.', colId: 'apparel-anime', colTitle: 'Apparel Anime', price: 138000, options: [{ name: 'Warna', values: ['Hitam', 'Putih'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL'] }], tags: ['kaos', 'fma', 'alchemy'], imgSeed: 'kaos-fma' }),
  prod({ id: 'topi-anime-dad-hat', title: 'Dad Hat Anime Series', desc: 'Topi dad hat bordir logo anime. Pilihan One Piece, Naruto, AoT, dan JJK. Adjustable.', colId: 'apparel-anime', colTitle: 'Apparel Anime', price: 115000, options: [{ name: 'Desain', values: ['Straw Hat OP', 'Konoha Symbol', 'Wings AoT', 'JJK Cursed'] }], tags: ['topi', 'anime', 'dad hat'], imgSeed: 'topi-anime' }),
]

const mangaMisePages = {
  'about-us': {
    title: 'Tentang Manga Mise',
    content: `<h2>Selamat Datang di Manga Mise!</h2>
<p>Manga Mise adalah surga bagi para penggemar manga dan anime di Indonesia. Berdiri sejak 2021, kami hadir untuk memenuhi kebutuhan koleksi Anda dengan produk-produk berkualitas tinggi.</p>
<p>Dari manga original Jepang, action figure premium, hingga merchandise dan apparel anime – semua tersedia di sini dengan harga kompetitif dan kondisi terjamin.</p>
<h3>Apa yang Kami Tawarkan?</h3>
<ul>
<li>📚 Manga original dan terjemahan resmi</li>
<li>🗿 Action figure, nendoroid, dan statue premium</li>
<li>👕 Apparel anime berkualitas tinggi</li>
<li>🎁 Merchandise: poster, pin, gantungan kunci, dan lainnya</li>
</ul>
<p>Semua produk 100% original dan bersumber dari distributor resmi. Kami berkomitmen memberikan pengalaman belanja terbaik bagi para Otaku Indonesia.</p>`,
    updatedAt: now,
  },
  'how-to-buy': {
    title: 'Cara Belanja',
    content: `<h2>Cara Berbelanja di Manga Mise</h2>
<ol>
<li><strong>Pilih Produk</strong> – Browse koleksi manga, figure, atau merchandise favoritmu</li>
<li><strong>Pilih Varian</strong> – Pilih ukuran, edisi, atau versi yang diinginkan</li>
<li><strong>Tambah ke Keranjang</strong> – Klik "Tambah ke Keranjang"</li>
<li><strong>Isi Data</strong> – Masukkan nama lengkap dan nomor WhatsApp</li>
<li><strong>Pesan via WhatsApp</strong> – Tim kami akan konfirmasi stok dan ongkir</li>
<li><strong>Transfer Pembayaran</strong> – Tersedia bank transfer dan e-wallet</li>
<li><strong>Packing & Kirim</strong> – Semua produk dikemas bubble wrap anti-rusak</li>
</ol>`,
    updatedAt: now,
  },
  'contact-us': {
    title: 'Hubungi Kami',
    content: `<p>Punya pertanyaan tentang produk atau pesanan? Jangan ragu hubungi kami!</p>
<p><strong>WhatsApp:</strong> 0812-0001-0001 (aktif 10.00 – 22.00 WIB, setiap hari)</p>
<p><strong>Instagram:</strong> @mangamise.id</p>
<p><strong>TikTok:</strong> @mangamise</p>`,
    updatedAt: now,
  },
  faq: {
    title: 'FAQ',
    content: `<h2>Pertanyaan yang Sering Ditanyakan</h2>
<h3>Apakah semua produk original?</h3>
<p>Ya, 100% original. Manga dari Elex Media/M&C resmi, figure dari distributor terpercaya.</p>
<h3>Apakah ada garansi untuk figure?</h3>
<p>Figure baru memiliki garansi 7 hari dari tanggal terima untuk cacat produksi.</p>
<h3>Berapa lama pengiriman?</h3>
<p>Pengiriman dalam kota 1-2 hari. Luar kota 2-5 hari kerja via JNE/J&T/SiCepat.</p>
<h3>Bagaimana cara custom order apparel?</h3>
<p>Hubungi kami via WhatsApp untuk info custom order. Minimum order 1 pcs untuk item tertentu.</p>`,
    updatedAt: now,
  },
}

const mangaMiseCustomers = [
  { id: 'mm-cust-1', name: 'Rizky Pratama', email: 'rizky@mail.com', whatsapp: '6281234567001', totalOrders: 3, totalSpent: 1850000, lastOrderDate: now, createdAt: now, updatedAt: now },
  { id: 'mm-cust-2', name: 'Anisa Dewi', email: 'anisa@mail.com', whatsapp: '6281234567002', totalOrders: 2, totalSpent: 920000, lastOrderDate: now, createdAt: now, updatedAt: now },
  { id: 'mm-cust-3', name: 'Farhan Nugroho', email: '', whatsapp: '6281234567003', totalOrders: 1, totalSpent: 480000, lastOrderDate: now, createdAt: now, updatedAt: now },
]

const mangaMiseOrders = [
  {
    id: 'mm-order-1', orderNumber: 'ORD-260629-MM01', customerId: 'mm-cust-1', customerName: 'Rizky Pratama', customerWhatsapp: '6281234567001',
    notes: 'Tolong tambahkan stiker thank you ya kak',
    items: [
      { productId: 'figure-luffy-gear5', productTitle: 'Figure Luffy Gear 5', variantTitle: '15cm (S.H.Figuarts)', price: 650000, quantity: 1, subtotal: 650000 },
      { productId: 'kaos-akatsuki-oversize', productTitle: 'Kaos Akatsuki Oversize', variantTitle: 'L', price: 145000, quantity: 2, subtotal: 290000 },
    ],
    totalItems: 3, totalAmount: 940000, status: 'completed', createdAt: now, updatedAt: now,
  },
  {
    id: 'mm-order-2', orderNumber: 'ORD-260629-MM02', customerId: 'mm-cust-2', customerName: 'Anisa Dewi', customerWhatsapp: '6281234567002',
    notes: '',
    items: [
      { productId: 'manga-demon-slayer', productTitle: 'Demon Slayer Vol. 1-23', variantTitle: 'Indonesia', price: 920000, quantity: 1, subtotal: 920000 },
    ],
    totalItems: 1, totalAmount: 920000, status: 'shipped', createdAt: now, updatedAt: now,
  },
  {
    id: 'mm-order-3', orderNumber: 'ORD-260629-MM03', customerId: 'mm-cust-3', customerName: 'Farhan Nugroho', customerWhatsapp: '6281234567003',
    notes: 'Request bubblewrap extra untuk figure',
    items: [
      { productId: 'figure-gojo-satoru', productTitle: 'Gojo Satoru Figure DXF', variantTitle: 'Standard', price: 520000, quantity: 1, subtotal: 520000 },
    ],
    totalItems: 1, totalAmount: 520000, status: 'new', createdAt: now, updatedAt: now,
  },
]

// ═════════════════════════════════════════════════════════════════════════════
// NAIKINNID — Toko sneakers, streetwear, hype culture
// ═════════════════════════════════════════════════════════════════════════════

const naikinnidSettings = {
  storeName: 'Naiki.n.nid',
  logo: '',
  favicon: '',
  whatsappNumber: '6281300020002',
  email: 'hype@naikinnid.co',
  phone: '08130002002',
  address: 'Jl. Kemang Raya No. 17, Jakarta Selatan',
  facebook: 'https://facebook.com/naikinnid',
  instagram: 'https://instagram.com/naikinnid',
  tiktok: 'https://tiktok.com/@naikinnid',
  theme: {
    template: 'happy-hobby',
    primary: '#ff6b35',
    primaryFg: '#ffffff',
    accent: '#004e89',
    bg: '#f8f9fa',
    surface: '#ffffff',
    text: '#1a1a2e',
  },
  updatedAt: now,
}

const naikinnidCollections = [
  { id: 'sneakers', title: 'Sneakers', handle: 'sneakers', description: 'Koleksi sneakers hype lokal dan impor pilihan terkurasi.', image: img('sneaker-col'), status: 'active', productCount: 8, createdAt: now, updatedAt: now },
  { id: 'streetwear', title: 'Streetwear', handle: 'streetwear', description: 'Kaos, hoodie, dan jaket streetwear brand lokal kekinian.', image: img('street-col'), status: 'active', productCount: 8, createdAt: now, updatedAt: now },
  { id: 'sneaker-care', title: 'Sneaker Care', handle: 'sneaker-care', description: 'Produk perawatan sneakers: sol, tali, cleaner, dan storage.', image: img('care-col'), status: 'active', productCount: 6, createdAt: now, updatedAt: now },
  { id: 'headwear', title: 'Headwear', handle: 'headwear', description: 'Topi, beanies, dan bucket hat dari brand streetwear terpilih.', image: img('hat-col'), status: 'active', productCount: 6, createdAt: now, updatedAt: now },
]

const naikinnidProducts = [
  // ── Sneakers ──
  prod({ id: 'sneaker-jogger-mono', title: 'Jogger Mono Black – Naikinnid OG', desc: 'Sneaker jogging all-black dengan sole tebalan comfort tech 3cm. Bahan mesh breathable dan inner EVA ultra-ringan.', colId: 'sneakers', colTitle: 'Sneakers', price: 580000, options: [{ name: 'Ukuran', values: ['38', '39', '40', '41', '42', '43', '44'] }], tags: ['sneaker', 'jogger', 'all black', 'naikinnid'], imgSeed: 'shoe-black' }),
  prod({ id: 'sneaker-chunky-retro', title: 'Chunky Retro White – Classic Run', desc: 'Sneaker chunky putih dengan aksen warna-warni retro. Sole tebal 5cm, gaya 90s yang kembali hits.', colId: 'sneakers', colTitle: 'Sneakers', price: 650000, options: [{ name: 'Ukuran', values: ['37', '38', '39', '40', '41', '42', '43'] }], tags: ['sneaker', 'chunky', 'retro', 'putih'], imgSeed: 'shoe-retro' }),
  prod({ id: 'sneaker-collab-batik', title: 'Collab Batik Series – Limited', desc: 'Sneaker eksklusif kolaborasi dengan pengrajin batik Yogyakarta. Upper motif batik modern, sole putih bersih. Hanya 200 pasang.', colId: 'sneakers', colTitle: 'Sneakers', price: 890000, options: [{ name: 'Ukuran', values: ['38', '39', '40', '41', '42', '43'] }], tags: ['sneaker', 'batik', 'collab', 'limited'], imgSeed: 'shoe-batik' }),
  prod({ id: 'sneaker-casual-slip', title: 'Casual Slip-On Loafer', desc: 'Slip-on casual berbahan canvas premium. Nyaman dipakai tanpa tali, cocok untuk santai maupun nongkrong.', colId: 'sneakers', colTitle: 'Sneakers', price: 420000, options: [{ name: 'Warna', values: ['Hitam', 'Navy', 'Cream'] }, { name: 'Ukuran', values: ['37', '38', '39', '40', '41', '42', '43'] }], tags: ['sepatu', 'slip on', 'casual'], imgSeed: 'shoe-slipon' }),
  prod({ id: 'sneaker-high-top-canvas', title: 'High Top Canvas Street', desc: 'Sneaker high top berbahan canvas robek-tebal, gaya klasik yang tak pernah mati. Tersedia dalam warna ikonik.', colId: 'sneakers', colTitle: 'Sneakers', price: 495000, options: [{ name: 'Warna', values: ['Hitam', 'Putih', 'Merah', 'Navy'] }, { name: 'Ukuran', values: ['37', '38', '39', '40', '41', '42', '43', '44'] }], tags: ['sneaker', 'high top', 'canvas', 'street'], imgSeed: 'shoe-hightop' }),
  prod({ id: 'sneaker-trail-runner', title: 'Trail Runner Olive', desc: 'Sneaker trail untuk medan ringan dan aktivitas outdoor kasual. Sole grip anti-slip, bahan water-resistant.', colId: 'sneakers', colTitle: 'Sneakers', price: 720000, options: [{ name: 'Ukuran', values: ['39', '40', '41', '42', '43', '44'] }], tags: ['sneaker', 'trail', 'outdoor', 'olive'], imgSeed: 'shoe-trail' }),
  prod({ id: 'sneaker-low-minimalist', title: 'Low Minimalist Court – White/Gum', desc: 'Sneaker low minimalis dengan sole gum kecoklatan. Clean, simpel, cocok untuk semua outfit.', colId: 'sneakers', colTitle: 'Sneakers', price: 545000, options: [{ name: 'Ukuran', values: ['37', '38', '39', '40', '41', '42', '43'] }], tags: ['sneaker', 'minimalist', 'court', 'white'], imgSeed: 'shoe-court' }),
  prod({ id: 'sneaker-dad-shoe', title: 'Dad Shoe Chunky Colorblock', desc: 'Dad shoe dengan upper colorblock bold dan sole super-chunky. Statement piece yang paling dicari.', colId: 'sneakers', colTitle: 'Sneakers', price: 760000, options: [{ name: 'Warna', values: ['Grey/Orange', 'White/Blue', 'Black/Red'] }, { name: 'Ukuran', values: ['38', '39', '40', '41', '42', '43', '44'] }], tags: ['sneaker', 'dad shoe', 'chunky', 'colorblock'], imgSeed: 'shoe-dad' }),

  // ── Streetwear ──
  prod({ id: 'kaos-naikinnid-logo', title: 'Kaos Logo Naikinnid OG', desc: 'Kaos oversize boxy dengan logo Naikinnid di dada kiri. Bahan combed 30s, print screenpress premium tahan lama.', colId: 'streetwear', colTitle: 'Streetwear', price: 185000, options: [{ name: 'Warna', values: ['Hitam', 'Putih', 'Sand', 'Biru Tua'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL', 'XXL'] }], tags: ['kaos', 'naikinnid', 'oversize', 'streetwear'], imgSeed: 'kaos-nn' }),
  prod({ id: 'hoodie-bold-arch', title: 'Hoodie Bold Arch Logo', desc: 'Hoodie boxy dengan tulisan NAIKINNID melengkung besar di dada. Bahan fleece 320gsm, sangat tebal dan hangat.', colId: 'streetwear', colTitle: 'Streetwear', price: 320000, options: [{ name: 'Warna', values: ['Abu-Abu', 'Hitam', 'Oranye', 'Cream'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL', 'XXL'] }], tags: ['hoodie', 'naikinnid', 'boxy', 'fleece'], imgSeed: 'hoodie-nn' }),
  prod({ id: 'kaos-indonesia-flag', title: 'Kaos Flag Series – Merah Putih', desc: 'Kaos dengan desain bendera Indonesia yang dieksekusi secara street art. Bangga pakai lokal.', colId: 'streetwear', colTitle: 'Streetwear', price: 168000, options: [{ name: 'Ukuran', values: ['S', 'M', 'L', 'XL'] }], tags: ['kaos', 'indonesia', 'merah putih', 'lokal'], imgSeed: 'kaos-idn' }),
  prod({ id: 'crewneck-varsity', title: 'Crewneck Varsity Striped', desc: 'Crewneck bergaya varsity dengan stripe di lengan dan logo bordir di dada. Retro tapi tetap kekinian.', colId: 'streetwear', colTitle: 'Streetwear', price: 275000, options: [{ name: 'Warna', values: ['Navy/Putih', 'Hitam/Merah', 'Abu/Oranye'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL'] }], tags: ['crewneck', 'varsity', 'bordir', 'retro'], imgSeed: 'crewneck-nn' }),
  prod({ id: 'jaket-coach-nn', title: 'Jaket Coach Naikinnid', desc: 'Coach jacket berbahan nylon tipis anti-angin. Bisa dilipat masuk kantong sendiri. Perfect untuk transisi cuaca.', colId: 'streetwear', colTitle: 'Streetwear', price: 395000, options: [{ name: 'Warna', values: ['Hitam', 'Navy', 'Olive', 'Orange'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL'] }], tags: ['jaket', 'coach', 'nylon', 'windbreaker'], imgSeed: 'jaket-nn' }),
  prod({ id: 'celana-cargo-street', title: 'Celana Cargo Streetwear', desc: 'Cargo pants dengan banyak kantong, bahan ripstop tebal. Cocok untuk tampilan utility streetwear.', colId: 'streetwear', colTitle: 'Streetwear', price: 295000, options: [{ name: 'Warna', values: ['Hitam', 'Olive', 'Cream', 'Biru Tua'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL'] }], tags: ['celana', 'cargo', 'utility', 'streetwear'], imgSeed: 'cargo-nn' }),
  prod({ id: 'kaos-grunge-text', title: 'Kaos Distressed Grunge Text', desc: 'Kaos dengan print grunge typography yang bold. Bahan katun pigment-dye dengan efek faded.', colId: 'streetwear', colTitle: 'Streetwear', price: 195000, options: [{ name: 'Warna', values: ['Hitam Faded', 'Abu Faded', 'Putih Faded'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL', 'XXL'] }], tags: ['kaos', 'grunge', 'distressed', 'faded'], imgSeed: 'kaos-grunge' }),
  prod({ id: 'shorts-active-nn', title: 'Active Shorts 5-inch', desc: 'Shorts olahraga 5 inci berbahan polyester dry-fit quick-dry. Side pocket dan liner dalam bawaan.', colId: 'streetwear', colTitle: 'Streetwear', price: 155000, options: [{ name: 'Warna', values: ['Hitam', 'Navy', 'Abu-Abu', 'Oranye'] }, { name: 'Ukuran', values: ['S', 'M', 'L', 'XL'] }], tags: ['shorts', 'aktif', 'olahraga', 'dry-fit'], imgSeed: 'shorts-nn' }),

  // ── Sneaker Care ──
  prod({ id: 'sneaker-cleaner-kit', title: 'Sneaker Cleaner Kit Lengkap', desc: 'Kit lengkap perawatan sneaker: foam cleaner 200ml, brush lembut, dan microfiber cloth. Aman untuk semua bahan.', colId: 'sneaker-care', colTitle: 'Sneaker Care', price: 145000, options: [{ name: 'Tipe', values: ['Kit Standard', 'Kit Premium + Case'] }], tags: ['cleaner', 'sneaker care', 'sikat'], imgSeed: 'cleaner-kit' }),
  prod({ id: 'sneaker-sole-protector', title: 'Sole Protector Transparant', desc: 'Pelindung sol bening anti-kuning, mencegah yellowing pada sole putih. Cocok untuk ukuran 36-46.', colId: 'sneaker-care', colTitle: 'Sneaker Care', price: 78000, options: [{ name: 'Ukuran', values: ['S (36-39)', 'M (40-42)', 'L (43-46)'] }], tags: ['sole protector', 'anti kuning', 'sneaker care'], imgSeed: 'sole-prot' }),
  prod({ id: 'tali-sepatu-premium', title: 'Tali Sepatu Premium Flat', desc: 'Tali flat premium lebar 10mm dengan berbagai warna. Bahan polyester halus, tidak mudah kotor.', colId: 'sneaker-care', colTitle: 'Sneaker Care', price: 38000, options: [{ name: 'Warna', values: ['Putih', 'Hitam', 'Oranye', 'Merah', 'Navy', 'Kuning'] }], tags: ['tali sepatu', 'laces', 'flat'], imgSeed: 'laces' }),
  prod({ id: 'insole-memory-foam', title: 'Insole Memory Foam Ultra', desc: 'Insole memory foam yang menyesuaikan bentuk kaki. Menambah kenyamanan sneaker lama jadi seperti baru.', colId: 'sneaker-care', colTitle: 'Sneaker Care', price: 125000, options: [{ name: 'Ukuran', values: ['S (36-38)', 'M (39-41)', 'L (42-44)'] }], tags: ['insole', 'memory foam', 'kenyamanan'], imgSeed: 'insole' }),
  prod({ id: 'sneaker-box-display', title: 'Kotak Display Sneaker Transparan', desc: 'Kotak display akrilik transparan untuk display dan penyimpanan sneaker. Stackable, anti-debu, ukuran 33x20x13cm.', colId: 'sneaker-care', colTitle: 'Sneaker Care', price: 95000, options: [{ name: 'Isi', values: ['1 pcs', '3 pcs', '6 pcs'] }], tags: ['kotak', 'display', 'storage', 'sneaker'], imgSeed: 'box-display' }),
  prod({ id: 'crep-protect-spray', title: 'Waterproof Protect Spray', desc: 'Spray anti-air dan anti-noda untuk semua jenis sneaker. Perlindungan hingga 30 hari sekali semprot.', colId: 'sneaker-care', colTitle: 'Sneaker Care', price: 168000, options: [{ name: 'Volume', values: ['200ml', '400ml'] }], tags: ['spray', 'anti air', 'waterproof', 'sneaker care'], imgSeed: 'spray-prot' }),

  // ── Headwear ──
  prod({ id: 'snapback-naikinnid', title: 'Snapback Naikinnid Classic', desc: 'Snapback dengan bordir logo Naikinnid di depan. Bahan wool blend, tali snap adjustable.', colId: 'headwear', colTitle: 'Headwear', price: 145000, options: [{ name: 'Warna', values: ['Hitam', 'Navy', 'Cream', 'Red'] }], tags: ['snapback', 'topi', 'naikinnid', 'bordir'], imgSeed: 'snap-nn' }),
  prod({ id: 'bucket-hat-reversible', title: 'Bucket Hat Reversible 2-in-1', desc: 'Bucket hat dua sisi: satu polos, satu bermotif checkerboard. Bahan katun ripstop tahan air ringan.', colId: 'headwear', colTitle: 'Headwear', price: 165000, options: [{ name: 'Warna', values: ['Hitam/Check', 'Cream/Check', 'Navy/Check', 'Olive/Check'] }], tags: ['bucket hat', 'reversible', 'checkerboard'], imgSeed: 'bucket-nn' }),
  prod({ id: 'beanie-knit-nn', title: 'Beanie Knit Logo NN', desc: 'Beanie rajut dengan logo NN di cuff. Bahan acrylic hangat yang elastis untuk semua ukuran kepala.', colId: 'headwear', colTitle: 'Headwear', price: 98000, options: [{ name: 'Warna', values: ['Abu-Abu', 'Hitam', 'Oranye', 'Navy', 'Cream'] }], tags: ['beanie', 'knit', 'topi', 'hangat'], imgSeed: 'beanie-nn' }),
  prod({ id: 'trucker-cap-mesh', title: 'Trucker Cap Mesh Back', desc: 'Trucker cap dengan bagian belakang mesh rajut yang ventilasi. Logo bordir depan, adjuster snap.', colId: 'headwear', colTitle: 'Headwear', price: 125000, options: [{ name: 'Warna', values: ['Hitam/Mesh Hitam', 'Putih/Mesh Abu', 'Navy/Mesh Navy', 'Orange/Mesh Hitam'] }], tags: ['trucker cap', 'mesh', 'topi'], imgSeed: 'trucker-nn' }),
  prod({ id: 'dad-hat-embroidered', title: 'Dad Hat Embroidered Mini Logo', desc: 'Dad hat dengan mini logo bordir di depan. Low profile, unstructured, gaya retro subtle.', colId: 'headwear', colTitle: 'Headwear', price: 115000, options: [{ name: 'Warna', values: ['Putih', 'Hitam', 'Krem', 'Sage', 'Dusty Pink'] }], tags: ['dad hat', 'embroidered', 'low profile'], imgSeed: 'dad-nn' }),
  prod({ id: 'balaclava-knit', title: 'Balaclava Knit – Winter Style', desc: 'Balaclava rajut full cover untuk tampilan streetwear yang edgy dan fungsional di cuaca dingin.', colId: 'headwear', colTitle: 'Headwear', price: 138000, options: [{ name: 'Warna', values: ['Hitam', 'Cream', 'Abu-Abu', 'Oranye'] }], tags: ['balaclava', 'rajut', 'winter', 'streetwear'], imgSeed: 'balaclava-nn' }),
]

const naikinnidPages = {
  'about-us': {
    title: 'Tentang Naikinnid',
    content: `<h2>Hype Lokal, Kualitas Global 🔥</h2>
<p>Naikinnid lahir dari kecintaan terhadap sneaker culture dan streetwear Indonesia. Berdiri sejak 2022, kami hadir sebagai jembatan antara hype culture global dan identitas lokal yang kuat.</p>
<p>Setiap produk kami dibuat dengan cermat, dari sneaker yang nyaman dipakai sampai sepuluh jam, hingga apparel yang tetap fresh setelah berkali-kali cuci.</p>
<h3>Kenapa Pilih Naikinnid?</h3>
<ul>
<li>🔥 Produk hype lokal berkualitas premium</li>
<li>👟 Sneaker dengan teknologi sole terkini</li>
<li>🧢 Headwear dan apparel streetwear pilihan</li>
<li>🛠️ Sneaker care tools terlengkap</li>
</ul>
<p>Brand by anak muda Indonesia, untuk anak muda Indonesia. Bangga pakai lokal!</p>`,
    updatedAt: now,
  },
  'how-to-buy': {
    title: 'Cara Beli',
    content: `<h2>Gampang Banget Belanja di Naikinnid!</h2>
<ol>
<li>🔍 <strong>Browse</strong> – Cari produk yang kamu mau di kategori Sneakers, Streetwear, atau Headwear</li>
<li>📦 <strong>Pilih Ukuran/Warna</strong> – Pastikan ukuran sesuai. Cek tabel ukuran kami di deskripsi</li>
<li>🛒 <strong>Add to Cart</strong> – Masukkan ke keranjang, lanjut shopping atau langsung checkout</li>
<li>📝 <strong>Isi Data</strong> – Nama lengkap dan nomor WhatsApp aktif</li>
<li>💬 <strong>Chat WA</strong> – Tim kami konfirmasi stok, ongkir, dan rekening tujuan</li>
<li>✅ <strong>Transfer & Done!</strong> – Setelah konfirmasi pembayaran, kita packing dan kirim!</li>
</ol>
<p>⚡ Pro tip: Untuk item limited (collab series), follow IG kami @naikinnid agar tidak ketinggalan drop terbaru!</p>`,
    updatedAt: now,
  },
  'contact-us': {
    title: 'Kontak',
    content: `<p>DM langsung atau WA aja bro/sis! Kami online hampir 24 jam. 🙌</p>
<p><strong>WhatsApp:</strong> 0813-0002-0002</p>
<p><strong>Instagram:</strong> @naikinnid</p>
<p><strong>TikTok:</strong> @naikinnid (cek unboxing dan review produk terbaru)</p>`,
    updatedAt: now,
  },
  faq: {
    title: 'FAQ',
    content: `<h2>FAQ 🙋</h2>
<h3>Apakah ukuran sneakernya true to size?</h3>
<p>Untuk kebanyakan model iya. Beberapa model chunky kami sarankan up 0.5 size. Detail ada di tiap halaman produk.</p>
<h3>Berapa lama restock kalau habis?</h3>
<p>Tergantung model. Untuk regular line biasanya 2–4 minggu. Collab series biasanya tidak restock setelah sold out.</p>
<h3>Apakah ada diskon untuk pembelian banyak?</h3>
<p>Ada! Beli 3+ item dapat diskon 10%, beli 5+ item diskon 15%. Hubungi CS kami untuk kode promo.</p>
<h3>Bisa COD tidak?</h3>
<p>Sayangnya belum tersedia COD untuk saat ini. Kami menerima transfer bank dan e-wallet (GoPay, OVO, Dana, ShopeePay).</p>
<h3>Apakah ada garansi untuk sneakers?</h3>
<p>Ada! Garansi 30 hari untuk cacat produksi (sol copot, jahitan lepas). Tidak termasuk kerusakan akibat pemakaian.</p>`,
    updatedAt: now,
  },
}

const naikinnidCustomers = [
  { id: 'nn-cust-1', name: 'Bintang Ramadhan', email: 'bintang@mail.com', whatsapp: '6281334567001', totalOrders: 4, totalSpent: 2850000, lastOrderDate: now, createdAt: now, updatedAt: now },
  { id: 'nn-cust-2', name: 'Citra Lestari', email: 'citra@mail.com', whatsapp: '6281334567002', totalOrders: 2, totalSpent: 980000, lastOrderDate: now, createdAt: now, updatedAt: now },
  { id: 'nn-cust-3', name: 'Dimas Prasetyo', email: '', whatsapp: '6281334567003', totalOrders: 1, totalSpent: 760000, lastOrderDate: now, createdAt: now, updatedAt: now },
]

const naikinnidOrders = [
  {
    id: 'nn-order-1', orderNumber: 'ORD-260629-NN01', customerId: 'nn-cust-1', customerName: 'Bintang Ramadhan', customerWhatsapp: '6281334567001',
    notes: 'Minta box original ya, buat koleksi',
    items: [
      { productId: 'sneaker-collab-batik', productTitle: 'Collab Batik Series – Limited', variantTitle: '42', price: 890000, quantity: 1, subtotal: 890000 },
      { productId: 'kaos-naikinnid-logo', productTitle: 'Kaos Logo Naikinnid OG', variantTitle: 'Hitam / L', price: 185000, quantity: 2, subtotal: 370000 },
    ],
    totalItems: 3, totalAmount: 1260000, status: 'completed', createdAt: now, updatedAt: now,
  },
  {
    id: 'nn-order-2', orderNumber: 'ORD-260629-NN02', customerId: 'nn-cust-2', customerName: 'Citra Lestari', customerWhatsapp: '6281334567002',
    notes: '',
    items: [
      { productId: 'sneaker-chunky-retro', productTitle: 'Chunky Retro White', variantTitle: '38', price: 650000, quantity: 1, subtotal: 650000 },
      { productId: 'bucket-hat-reversible', productTitle: 'Bucket Hat Reversible', variantTitle: 'Cream/Check', price: 165000, quantity: 1, subtotal: 165000 },
    ],
    totalItems: 2, totalAmount: 815000, status: 'paid', createdAt: now, updatedAt: now,
  },
  {
    id: 'nn-order-3', orderNumber: 'ORD-260629-NN03', customerId: 'nn-cust-3', customerName: 'Dimas Prasetyo', customerWhatsapp: '6281334567003',
    notes: 'Kasih bubble wrap extra dong',
    items: [
      { productId: 'sneaker-dad-shoe', productTitle: 'Dad Shoe Chunky Colorblock', variantTitle: 'Grey/Orange / 42', price: 760000, quantity: 1, subtotal: 760000 },
    ],
    totalItems: 1, totalAmount: 760000, status: 'new', createdAt: now, updatedAt: now,
  },
]

// ═════════════════════════════════════════════════════════════════════════════
// SEED RUNNER
// ═════════════════════════════════════════════════════════════════════════════

async function findTenantIdBySlug(slug) {
  const q = query(collection(db, 'tenants'), where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return snap.docs[0].id
}

async function seedStore({ slug, settings, collections, products, pages, customers, orders }) {
  console.log(`\n🔍 Mencari tenant: ${slug}...`)
  const tenantId = await findTenantIdBySlug(slug)
  if (!tenantId) {
    console.log(`❌ Tenant dengan slug "${slug}" tidak ditemukan di Firestore.`)
    console.log(`   Buat dulu lewat panel Superadmin → Buat Toko Baru`)
    return
  }
  console.log(`✅ Tenant ID: ${tenantId}`)

  const base = `tenants/${tenantId}`

  // Settings
  await setDoc(doc(db, base, 'settings', 'store'), settings)
  console.log(`   ✅ Settings`)

  // Collections
  for (const col of collections) {
    const { id, ...data } = col
    await setDoc(doc(db, base, 'collections', id), data)
  }
  console.log(`   ✅ ${collections.length} Collections`)

  // Products
  for (const p of products) {
    const { id, ...data } = p
    await setDoc(doc(db, base, 'products', id), data)
  }
  console.log(`   ✅ ${products.length} Products`)

  // Customers
  for (const c of customers) {
    const { id, ...data } = c
    await setDoc(doc(db, base, 'customers', id), data)
  }
  console.log(`   ✅ ${customers.length} Customers`)

  // Orders
  for (const o of orders) {
    const { id, ...data } = o
    await setDoc(doc(db, base, 'orders', id), data)
  }
  console.log(`   ✅ ${orders.length} Orders`)

  // Pages
  for (const [slug, data] of Object.entries(pages)) {
    await setDoc(doc(db, base, 'pages', slug), data)
  }
  console.log(`   ✅ ${Object.keys(pages).length} Pages`)

  console.log(`\n🎉 ${slug} selesai di-seed!`)
}

async function main() {
  const targetSlug = process.env.SLUG

  const stores = [
    {
      slug: 'manga-mise',
      settings: mangaMiseSettings,
      collections: mangaMiseCollections,
      products: mangaMiseProducts,
      pages: mangaMisePages,
      customers: mangaMiseCustomers,
      orders: mangaMiseOrders,
    },
    {
      slug: 'naikinnid',
      settings: naikinnidSettings,
      collections: naikinnidCollections,
      products: naikinnidProducts,
      pages: naikinnidPages,
      customers: naikinnidCustomers,
      orders: naikinnidOrders,
    },
  ]

  const toSeed = targetSlug ? stores.filter(s => s.slug === targetSlug) : stores

  if (toSeed.length === 0) {
    console.error(`❌ Slug "${targetSlug}" tidak dikenali. Pilih: manga-mise atau naikinnid`)
    process.exit(1)
  }

  console.log(`🌱 Naikinnid Demo Store Seeder`)
  console.log(`   Target: ${toSeed.map(s => s.slug).join(', ')}`)

  for (const store of toSeed) {
    await seedStore(store)
  }

  console.log('\n✨ Semua selesai!')
  process.exit(0)
}

main().catch(e => {
  console.error('❌ Error:', e.message)
  process.exit(1)
})
