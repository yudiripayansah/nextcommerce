// node scripts/seed.js
// Jalankan: node scripts/seed.js

const { initializeApp } = require('firebase/app')
const { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp, Timestamp } = require('firebase/firestore')

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

// ─── SETTINGS ────────────────────────────────────────────────────────────────
const settings = {
  storeName: 'FashionKita',
  logo: '',
  favicon: '',
  whatsappNumber: '628121913683',
  email: 'hello@fashionkita.id',
  phone: '08121913683',
  address: 'Jl. Merdeka No. 10, Jakarta Selatan',
  facebook: 'https://facebook.com/fashionkita',
  instagram: 'https://instagram.com/fashionkita',
  tiktok: 'https://tiktok.com/@fashionkita',
  updatedAt: now,
}

// ─── COLLECTIONS ─────────────────────────────────────────────────────────────
const collections = [
  {
    id: 'kaos-pria',
    title: 'Kaos Pria',
    handle: 'kaos-pria',
    description: 'Koleksi kaos pria premium berbahan katun combed 30s.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    status: 'active',
    productCount: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'kaos-wanita',
    title: 'Kaos Wanita',
    handle: 'kaos-wanita',
    description: 'Kaos wanita casual dengan pilihan warna lengkap.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
    status: 'active',
    productCount: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'celana',
    title: 'Celana',
    handle: 'celana',
    description: 'Koleksi celana panjang dan pendek untuk pria dan wanita.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    status: 'active',
    productCount: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'aksesoris',
    title: 'Aksesoris',
    handle: 'aksesoris',
    description: 'Aksesoris fashion pelengkap penampilan Anda.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    status: 'active',
    productCount: 2,
    createdAt: now,
    updatedAt: now,
  },
]

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
const products = [
  {
    id: 'kaos-polos-hitam',
    title: 'Kaos Polos Premium Hitam',
    handle: 'kaos-polos-hitam',
    description: 'Kaos polos berbahan katun combed 30s, lembut dan nyaman dipakai sehari-hari. Anti kusut dan tahan lama.',
    featuredImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    ],
    tags: ['kaos', 'polos', 'pria'],
    collectionId: 'kaos-pria',
    collectionTitle: 'Kaos Pria',
    minPrice: 85000,
    maxPrice: 85000,
    totalStock: 50,
    options: [{ name: 'Ukuran', values: ['S', 'M', 'L', 'XL', 'XXL'] }],
    variants: [
      { id: 'v1', title: 'S', sku: 'KPH-S', price: 85000, stock: 10, image: '', option1: 'S', option2: '', option3: '' },
      { id: 'v2', title: 'M', sku: 'KPH-M', price: 85000, stock: 15, image: '', option1: 'M', option2: '', option3: '' },
      { id: 'v3', title: 'L', sku: 'KPH-L', price: 85000, stock: 15, image: '', option1: 'L', option2: '', option3: '' },
      { id: 'v4', title: 'XL', sku: 'KPH-XL', price: 85000, stock: 7, image: '', option1: 'XL', option2: '', option3: '' },
      { id: 'v5', title: 'XXL', sku: 'KPH-XXL', price: 85000, stock: 3, image: '', option1: 'XXL', option2: '', option3: '' },
    ],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'kaos-grafis-vintage',
    title: 'Kaos Grafis Vintage',
    handle: 'kaos-grafis-vintage',
    description: 'Kaos dengan desain grafis vintage yang stylish. Bahan cotton 100% tebal dan tidak menerawang.',
    featuredImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    ],
    tags: ['kaos', 'grafis', 'vintage'],
    collectionId: 'kaos-pria',
    collectionTitle: 'Kaos Pria',
    minPrice: 120000,
    maxPrice: 130000,
    totalStock: 30,
    options: [
      { name: 'Warna', values: ['Putih', 'Abu-Abu'] },
      { name: 'Ukuran', values: ['M', 'L', 'XL'] },
    ],
    variants: [
      { id: 'v1', title: 'Putih / M', sku: 'KGV-W-M', price: 120000, stock: 5, image: '', option1: 'Putih', option2: 'M', option3: '' },
      { id: 'v2', title: 'Putih / L', sku: 'KGV-W-L', price: 120000, stock: 5, image: '', option1: 'Putih', option2: 'L', option3: '' },
      { id: 'v3', title: 'Putih / XL', sku: 'KGV-W-XL', price: 120000, stock: 5, image: '', option1: 'Putih', option2: 'XL', option3: '' },
      { id: 'v4', title: 'Abu-Abu / M', sku: 'KGV-G-M', price: 130000, stock: 5, image: '', option1: 'Abu-Abu', option2: 'M', option3: '' },
      { id: 'v5', title: 'Abu-Abu / L', sku: 'KGV-G-L', price: 130000, stock: 5, image: '', option1: 'Abu-Abu', option2: 'L', option3: '' },
      { id: 'v6', title: 'Abu-Abu / XL', sku: 'KGV-G-XL', price: 130000, stock: 5, image: '', option1: 'Abu-Abu', option2: 'XL', option3: '' },
    ],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'kaos-oversize-pria',
    title: 'Kaos Oversize Distro',
    handle: 'kaos-oversize-pria',
    description: 'Kaos oversize dengan potongan boxy, cocok untuk tampilan kasual yang trendy.',
    featuredImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'],
    tags: ['kaos', 'oversize'],
    collectionId: 'kaos-pria',
    collectionTitle: 'Kaos Pria',
    minPrice: 110000,
    maxPrice: 110000,
    totalStock: 20,
    options: [{ name: 'Ukuran', values: ['M', 'L', 'XL'] }],
    variants: [
      { id: 'v1', title: 'M', sku: 'KOS-M', price: 110000, stock: 7, image: '', option1: 'M', option2: '', option3: '' },
      { id: 'v2', title: 'L', sku: 'KOS-L', price: 110000, stock: 8, image: '', option1: 'L', option2: '', option3: '' },
      { id: 'v3', title: 'XL', sku: 'KOS-XL', price: 110000, stock: 5, image: '', option1: 'XL', option2: '', option3: '' },
    ],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'kaos-wanita-basic',
    title: 'Kaos Wanita Basic',
    handle: 'kaos-wanita-basic',
    description: 'Kaos wanita basic berbahan lembut dan breathable. Cocok untuk aktivitas sehari-hari.',
    featuredImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80'],
    tags: ['kaos', 'wanita', 'basic'],
    collectionId: 'kaos-wanita',
    collectionTitle: 'Kaos Wanita',
    minPrice: 90000,
    maxPrice: 90000,
    totalStock: 35,
    options: [
      { name: 'Warna', values: ['Putih', 'Pink', 'Hitam'] },
      { name: 'Ukuran', values: ['S', 'M', 'L'] },
    ],
    variants: [
      { id: 'v1', title: 'Putih / S', sku: 'KWB-W-S', price: 90000, stock: 4, image: '', option1: 'Putih', option2: 'S', option3: '' },
      { id: 'v2', title: 'Putih / M', sku: 'KWB-W-M', price: 90000, stock: 4, image: '', option1: 'Putih', option2: 'M', option3: '' },
      { id: 'v3', title: 'Putih / L', sku: 'KWB-W-L', price: 90000, stock: 4, image: '', option1: 'Putih', option2: 'L', option3: '' },
      { id: 'v4', title: 'Pink / S', sku: 'KWB-P-S', price: 90000, stock: 4, image: '', option1: 'Pink', option2: 'S', option3: '' },
      { id: 'v5', title: 'Pink / M', sku: 'KWB-P-M', price: 90000, stock: 4, image: '', option1: 'Pink', option2: 'M', option3: '' },
      { id: 'v6', title: 'Pink / L', sku: 'KWB-P-L', price: 90000, stock: 4, image: '', option1: 'Pink', option2: 'L', option3: '' },
      { id: 'v7', title: 'Hitam / S', sku: 'KWB-B-S', price: 90000, stock: 4, image: '', option1: 'Hitam', option2: 'S', option3: '' },
      { id: 'v8', title: 'Hitam / M', sku: 'KWB-B-M', price: 90000, stock: 4, image: '', option1: 'Hitam', option2: 'M', option3: '' },
      { id: 'v9', title: 'Hitam / L', sku: 'KWB-B-L', price: 90000, stock: 3, image: '', option1: 'Hitam', option2: 'L', option3: '' },
    ],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'kaos-crop-wanita',
    title: 'Kaos Crop Top Wanita',
    handle: 'kaos-crop-wanita',
    description: 'Crop top wanita trendy dengan bahan stretch nyaman. Cocok dipadukan dengan high waist jeans.',
    featuredImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'],
    tags: ['kaos', 'crop', 'wanita'],
    collectionId: 'kaos-wanita',
    collectionTitle: 'Kaos Wanita',
    minPrice: 95000,
    maxPrice: 95000,
    totalStock: 18,
    options: [{ name: 'Ukuran', values: ['S', 'M', 'L'] }],
    variants: [
      { id: 'v1', title: 'S', sku: 'KCW-S', price: 95000, stock: 6, image: '', option1: 'S', option2: '', option3: '' },
      { id: 'v2', title: 'M', sku: 'KCW-M', price: 95000, stock: 7, image: '', option1: 'M', option2: '', option3: '' },
      { id: 'v3', title: 'L', sku: 'KCW-L', price: 95000, stock: 5, image: '', option1: 'L', option2: '', option3: '' },
    ],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'celana-chino',
    title: 'Celana Chino Slim Fit',
    handle: 'celana-chino',
    description: 'Celana chino slim fit berbahan katun twill premium. Nyaman dan elegan untuk tampilan casual maupun semi-formal.',
    featuredImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80'],
    tags: ['celana', 'chino', 'slim'],
    collectionId: 'celana',
    collectionTitle: 'Celana',
    minPrice: 180000,
    maxPrice: 180000,
    totalStock: 25,
    options: [
      { name: 'Warna', values: ['Krem', 'Navy', 'Hitam'] },
      { name: 'Ukuran', values: ['30', '32', '34'] },
    ],
    variants: [
      { id: 'v1', title: 'Krem / 30', sku: 'CC-K-30', price: 180000, stock: 3, image: '', option1: 'Krem', option2: '30', option3: '' },
      { id: 'v2', title: 'Krem / 32', sku: 'CC-K-32', price: 180000, stock: 3, image: '', option1: 'Krem', option2: '32', option3: '' },
      { id: 'v3', title: 'Krem / 34', sku: 'CC-K-34', price: 180000, stock: 3, image: '', option1: 'Krem', option2: '34', option3: '' },
      { id: 'v4', title: 'Navy / 30', sku: 'CC-N-30', price: 180000, stock: 3, image: '', option1: 'Navy', option2: '30', option3: '' },
      { id: 'v5', title: 'Navy / 32', sku: 'CC-N-32', price: 180000, stock: 3, image: '', option1: 'Navy', option2: '32', option3: '' },
      { id: 'v6', title: 'Navy / 34', sku: 'CC-N-34', price: 180000, stock: 2, image: '', option1: 'Navy', option2: '34', option3: '' },
      { id: 'v7', title: 'Hitam / 30', sku: 'CC-B-30', price: 180000, stock: 3, image: '', option1: 'Hitam', option2: '30', option3: '' },
      { id: 'v8', title: 'Hitam / 32', sku: 'CC-B-32', price: 180000, stock: 2, image: '', option1: 'Hitam', option2: '32', option3: '' },
      { id: 'v9', title: 'Hitam / 34', sku: 'CC-B-34', price: 180000, stock: 3, image: '', option1: 'Hitam', option2: '34', option3: '' },
    ],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'celana-jogger',
    title: 'Celana Jogger Fleece',
    handle: 'celana-jogger',
    description: 'Celana jogger berbahan fleece tebal, hangat dan nyaman untuk santai di rumah atau outdoor.',
    featuredImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'],
    tags: ['celana', 'jogger', 'casual'],
    collectionId: 'celana',
    collectionTitle: 'Celana',
    minPrice: 150000,
    maxPrice: 150000,
    totalStock: 20,
    options: [{ name: 'Ukuran', values: ['M', 'L', 'XL'] }],
    variants: [
      { id: 'v1', title: 'M', sku: 'CJ-M', price: 150000, stock: 7, image: '', option1: 'M', option2: '', option3: '' },
      { id: 'v2', title: 'L', sku: 'CJ-L', price: 150000, stock: 8, image: '', option1: 'L', option2: '', option3: '' },
      { id: 'v3', title: 'XL', sku: 'CJ-XL', price: 150000, stock: 5, image: '', option1: 'XL', option2: '', option3: '' },
    ],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'topi-baseball',
    title: 'Topi Baseball Distro',
    handle: 'topi-baseball',
    description: 'Topi baseball premium dengan bordir logo. Bahan canvas berkualitas tinggi dan adjustable.',
    featuredImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80'],
    tags: ['topi', 'aksesoris'],
    collectionId: 'aksesoris',
    collectionTitle: 'Aksesoris',
    minPrice: 75000,
    maxPrice: 75000,
    totalStock: 30,
    options: [{ name: 'Warna', values: ['Hitam', 'Putih', 'Navy'] }],
    variants: [
      { id: 'v1', title: 'Hitam', sku: 'TB-B', price: 75000, stock: 10, image: '', option1: 'Hitam', option2: '', option3: '' },
      { id: 'v2', title: 'Putih', sku: 'TB-W', price: 75000, stock: 10, image: '', option1: 'Putih', option2: '', option3: '' },
      { id: 'v3', title: 'Navy', sku: 'TB-N', price: 75000, stock: 10, image: '', option1: 'Navy', option2: '', option3: '' },
    ],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'jam-tangan-casual',
    title: 'Jam Tangan Casual Minimalis',
    handle: 'jam-tangan-casual',
    description: 'Jam tangan casual dengan desain minimalis. Tahan air 30m, cocok untuk aktivitas sehari-hari.',
    featuredImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
    tags: ['jam', 'aksesoris', 'casual'],
    collectionId: 'aksesoris',
    collectionTitle: 'Aksesoris',
    minPrice: 250000,
    maxPrice: 280000,
    totalStock: 15,
    options: [{ name: 'Warna', values: ['Silver', 'Gold', 'Black'] }],
    variants: [
      { id: 'v1', title: 'Silver', sku: 'JTC-S', price: 250000, stock: 5, image: '', option1: 'Silver', option2: '', option3: '' },
      { id: 'v2', title: 'Gold', sku: 'JTC-G', price: 280000, stock: 5, image: '', option1: 'Gold', option2: '', option3: '' },
      { id: 'v3', title: 'Black', sku: 'JTC-B', price: 260000, stock: 5, image: '', option1: 'Black', option2: '', option3: '' },
    ],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
]

// ─── ORDERS (demo) ────────────────────────────────────────────────────────────
const customers = [
  {
    id: 'cust-1',
    name: 'Budi Santoso',
    whatsapp: '6281111111111',
    totalOrders: 2,
    totalSpent: 370000,
    lastOrderDate: now,
    createdAt: now,
  },
  {
    id: 'cust-2',
    name: 'Siti Rahayu',
    whatsapp: '6282222222222',
    totalOrders: 1,
    totalSpent: 180000,
    lastOrderDate: now,
    createdAt: now,
  },
  {
    id: 'cust-3',
    name: 'Ahmad Fauzi',
    whatsapp: '6283333333333',
    totalOrders: 1,
    totalSpent: 250000,
    lastOrderDate: now,
    createdAt: now,
  },
]

const orders = [
  {
    id: 'order-1',
    orderNumber: 'ORD-260625-1001',
    customerId: 'cust-1',
    customerName: 'Budi Santoso',
    customerWhatsapp: '6281111111111',
    notes: 'Tolong kirim ke alamat kantor ya',
    items: [
      { productId: 'kaos-polos-hitam', productTitle: 'Kaos Polos Premium Hitam', variantTitle: 'L', price: 85000, quantity: 2, subtotal: 170000 },
      { productId: 'topi-baseball', productTitle: 'Topi Baseball Distro', variantTitle: 'Hitam', price: 75000, quantity: 2, subtotal: 150000 },
    ],
    totalItems: 4,
    totalAmount: 320000,
    status: 'completed',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-260625-1002',
    customerId: 'cust-1',
    customerName: 'Budi Santoso',
    customerWhatsapp: '6281111111111',
    notes: '',
    items: [
      { productId: 'celana-chino', productTitle: 'Celana Chino Slim Fit', variantTitle: 'Navy / 32', price: 180000, quantity: 1, subtotal: 180000 },
    ],
    totalItems: 1,
    totalAmount: 180000,
    status: 'paid',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-260625-1003',
    customerId: 'cust-2',
    customerName: 'Siti Rahayu',
    customerWhatsapp: '6282222222222',
    notes: 'Minta bonus stiker ya kak',
    items: [
      { productId: 'kaos-wanita-basic', productTitle: 'Kaos Wanita Basic', variantTitle: 'Pink / M', price: 90000, quantity: 2, subtotal: 180000 },
    ],
    totalItems: 2,
    totalAmount: 180000,
    status: 'shipped',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'order-4',
    orderNumber: 'ORD-260625-1004',
    customerId: 'cust-3',
    customerName: 'Ahmad Fauzi',
    customerWhatsapp: '6283333333333',
    notes: '',
    items: [
      { productId: 'jam-tangan-casual', productTitle: 'Jam Tangan Casual Minimalis', variantTitle: 'Silver', price: 250000, quantity: 1, subtotal: 250000 },
    ],
    totalItems: 1,
    totalAmount: 250000,
    status: 'new',
    createdAt: now,
    updatedAt: now,
  },
]

// ─── PAGES ────────────────────────────────────────────────────────────────────
const pages = {
  'about-us': {
    title: 'Tentang Kami',
    content: `<h2>Selamat datang di FashionKita!</h2>
<p>FashionKita adalah brand fashion lokal Indonesia yang berdiri sejak 2020. Kami menyediakan pakaian dan aksesoris berkualitas tinggi dengan harga yang terjangkau.</p>
<p>Visi kami adalah menjadi brand fashion pilihan utama masyarakat Indonesia yang mengutamakan kualitas, kenyamanan, dan gaya.</p>
<h3>Mengapa Pilih FashionKita?</h3>
<ul>
<li>Bahan berkualitas premium</li>
<li>Harga terjangkau langsung dari produsen</li>
<li>Proses pemesanan mudah via WhatsApp</li>
<li>Pengiriman ke seluruh Indonesia</li>
</ul>`,
    updatedAt: now,
  },
  'contact-us': {
    title: 'Hubungi Kami',
    content: `<p>Kami siap melayani Anda! Hubungi kami melalui saluran berikut:</p>
<p>Tim kami aktif setiap hari Senin–Sabtu pukul 08.00–17.00 WIB.</p>`,
    updatedAt: now,
  },
  'how-to-buy': {
    title: 'Cara Pembelian',
    content: `<h2>Cara Berbelanja di FashionKita</h2>
<ol>
<li><strong>Pilih Produk</strong> – Browse koleksi kami dan pilih produk yang Anda suka</li>
<li><strong>Pilih Varian</strong> – Pilih ukuran dan warna yang tersedia</li>
<li><strong>Tambah ke Keranjang</strong> – Klik tombol "Tambah ke Keranjang"</li>
<li><strong>Buka Keranjang</strong> – Periksa kembali produk yang dipilih</li>
<li><strong>Isi Data</strong> – Masukkan nama dan nomor WhatsApp Anda</li>
<li><strong>Pesan via WhatsApp</strong> – Klik tombol "Pesan via WhatsApp"</li>
<li><strong>Konfirmasi</strong> – Tim kami akan membalas dan memandu proses pembayaran</li>
</ol>`,
    updatedAt: now,
  },
  faq: {
    title: 'FAQ',
    content: `<h2>Pertanyaan yang Sering Ditanyakan</h2>

<h3>Berapa lama proses pengiriman?</h3>
<p>Pengiriman reguler 2–5 hari kerja. Pengiriman ekspres 1–2 hari kerja.</p>

<h3>Apakah bisa tukar ukuran?</h3>
<p>Ya, penukaran ukuran dapat dilakukan dalam 7 hari setelah barang diterima dengan kondisi barang belum dicuci dan label masih terpasang.</p>

<h3>Metode pembayaran apa saja yang diterima?</h3>
<p>Kami menerima transfer bank (BCA, Mandiri, BRI), GoPay, OVO, dan DANA.</p>

<h3>Apakah ada minimum pembelian?</h3>
<p>Tidak ada minimum pembelian. Anda bisa memesan mulai dari 1 item.</p>

<h3>Bagaimana jika produk cacat atau salah kirim?</h3>
<p>Hubungi kami via WhatsApp dalam 2×24 jam setelah barang diterima. Kami akan segera menangani keluhan Anda.</p>`,
    updatedAt: now,
  },
}

// ─── SEED ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Mulai seeding data demo...\n')

  // Settings
  await setDoc(doc(db, 'settings', 'store'), settings)
  console.log('✅ Settings')

  // Collections
  for (const col of collections) {
    const { id, ...data } = col
    await setDoc(doc(db, 'collections', id), data)
  }
  console.log(`✅ ${collections.length} Collections`)

  // Products
  for (const prod of products) {
    const { id, ...data } = prod
    await setDoc(doc(db, 'products', id), data)
  }
  console.log(`✅ ${products.length} Products`)

  // Customers
  for (const cust of customers) {
    const { id, ...data } = cust
    await setDoc(doc(db, 'customers', id), data)
  }
  console.log(`✅ ${customers.length} Customers`)

  // Orders
  for (const order of orders) {
    const { id, ...data } = order
    await setDoc(doc(db, 'orders', id), data)
  }
  console.log(`✅ ${orders.length} Orders`)

  // Pages
  for (const [slug, data] of Object.entries(pages)) {
    await setDoc(doc(db, 'pages', slug), data)
  }
  console.log(`✅ ${Object.keys(pages).length} Pages`)

  console.log('\n🎉 Seeding selesai!')
  process.exit(0)
}

seed().catch((e) => {
  console.error('❌ Error:', e)
  process.exit(1)
})
