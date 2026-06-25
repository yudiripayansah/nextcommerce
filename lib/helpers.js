export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(timestamp) {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function generateOrderNumber() {
  const now = new Date()
  const y = now.getFullYear().toString().slice(-2)
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `ORD-${y}${m}${d}-${rand}`
}

export function generateVariantCombinations(options) {
  if (!options || options.length === 0) return []

  const filled = options.filter((o) => o.name && o.values.length > 0)
  if (filled.length === 0) return []

  const combine = (arrays) => {
    if (arrays.length === 0) return [[]]
    const [first, ...rest] = arrays
    const restCombinations = combine(rest)
    return first.flatMap((v) => restCombinations.map((r) => [v, ...r]))
  }

  const valueLists = filled.map((o) => o.values)
  const combinations = combine(valueLists)

  return combinations.map((combo) => ({
    id: crypto.randomUUID(),
    title: combo.join(' / '),
    sku: '',
    price: 0,
    stock: 0,
    image: '',
    option1: combo[0] || '',
    option2: combo[1] || '',
    option3: combo[2] || '',
  }))
}

export function buildWhatsAppMessage(items, totalItems, storeName) {
  const lines = items.map((item) => {
    const variant = item.variantTitle ? ` (${item.variantTitle})` : ''
    return `- ${item.productTitle}${variant} x${item.quantity} = ${formatCurrency(item.subtotal)}`
  })

  const message = `Halo, saya ingin memesan produk berikut:\n\n${lines.join('\n')}\n\nTotal Item: ${totalItems}\n\nNama:\nAlamat:\n\nTerima kasih.`
  return encodeURIComponent(message)
}
