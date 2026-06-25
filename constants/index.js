export const ORDER_STATUSES = [
  { value: 'new', label: 'Baru', color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted', label: 'Dihubungi', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'paid', label: 'Dibayar', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'Dikirim', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'completed', label: 'Selesai', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
]

export const PRODUCT_STATUSES = [
  { value: 'active', label: 'Aktif' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Diarsipkan' },
]

export const COLLECTION_STATUSES = [
  { value: 'active', label: 'Aktif' },
  { value: 'draft', label: 'Draft' },
]

export const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/orders', label: 'Pesanan', icon: 'orders' },
  { href: '/admin/products', label: 'Produk', icon: 'products' },
  { href: '/admin/collections', label: 'Koleksi', icon: 'collections' },
  { href: '/admin/customers', label: 'Pelanggan', icon: 'customers' },
  { href: '/admin/pages', label: 'Halaman', icon: 'pages' },
  { href: '/admin/settings', label: 'Pengaturan', icon: 'settings' },
]

export const PAGE_SLUGS = ['about-us', 'contact-us', 'how-to-buy', 'faq']
export const PAGE_TITLES = {
  'about-us': 'Tentang Kami',
  'contact-us': 'Hubungi Kami',
  'how-to-buy': 'Cara Pembelian',
  faq: 'FAQ',
}

export const ITEMS_PER_PAGE = 10
