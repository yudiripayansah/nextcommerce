// Jalankan: node scripts/seed-products.js

const { initializeApp } = require('firebase/app')
const { getFirestore, setDoc, doc, Timestamp } = require('firebase/firestore')

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

const img = (seed) => `https://picsum.photos/seed/${seed}/600/600`

const sizeOnly = (sizes) => [{ name: 'Ukuran', values: sizes }]
const colorSize = (colors, sizes) => [
  { name: 'Warna', values: colors },
  { name: 'Ukuran', values: sizes },
]

function makeVariants(options, sku, price, stock = 8) {
  if (options.length === 1) {
    return options[0].values.map((v, i) => ({
      id: `v${i + 1}`,
      title: v,
      sku: `${sku}-${v.toUpperCase().slice(0, 3)}`,
      price,
      stock,
      image: '',
      option1: v,
      option2: '',
      option3: '',
    }))
  }
  const variants = []
  let i = 1
  for (const c of options[0].values) {
    for (const s of options[1].values) {
      variants.push({
        id: `v${i++}`,
        title: `${c} / ${s}`,
        sku: `${sku}-${c.toUpperCase().slice(0, 2)}-${s}`,
        price,
        stock,
        image: '',
        option1: c,
        option2: s,
        option3: '',
      })
    }
  }
  return variants
}

function product({ id, title, description, collection, collectionTitle, price, options, tags, stockPerVariant = 8 }) {
  const opts = options
  const variants = makeVariants(opts, id.toUpperCase().slice(0, 6), price, stockPerVariant)
  const totalStock = variants.reduce((s, v) => s + v.stock, 0)
  return {
    id,
    title,
    handle: id,
    description,
    featuredImage: img(id),
    images: [img(id), img(`${id}-2`)],
    tags,
    collectionId: collection,
    collectionTitle,
    minPrice: price,
    maxPrice: price,
    totalStock,
    options: opts,
    variants,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }
}

// ─── 25 KAOS PRIA ─────────────────────────────────────────────────────────────
const kaosPria = [
  product({ id: 'kaos-polo-pria', title: 'Kaos Polo Pria Casual', description: 'Kaos polo pria bahan pique cotton, elegan dan nyaman untuk kerja maupun santai.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 130000, options: colorSize(['Putih', 'Hitam', 'Navy'], ['S', 'M', 'L', 'XL']), tags: ['kaos', 'polo', 'pria'] }),
  product({ id: 'kaos-raglan-bw', title: 'Kaos Raglan Hitam Putih', description: 'Kaos raglan klasik dengan lengan hitam dan badan putih. Bahan katun combed berkualitas.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 95000, options: sizeOnly(['S', 'M', 'L', 'XL']), tags: ['kaos', 'raglan'] }),
  product({ id: 'kaos-longline-pria', title: 'Kaos Longline Pria', description: 'Kaos longline dengan potongan panjang di belakang, cocok untuk gaya streetwear modern.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 115000, options: colorSize(['Hitam', 'Abu-Abu'], ['M', 'L', 'XL']), tags: ['kaos', 'longline', 'streetwear'] }),
  product({ id: 'kaos-stripe-navy', title: 'Kaos Stripe Navy', description: 'Kaos bergaris navy putih bergaya nautical. Bahan cotton 100% adem dan breathable.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 98000, options: sizeOnly(['S', 'M', 'L', 'XL']), tags: ['kaos', 'stripe', 'navy'] }),
  product({ id: 'kaos-hoodie-pullover', title: 'Kaos Hoodie Pullover', description: 'Hoodie ringan bahan fleece tipis, hangat di AC tapi tidak gerah di luar ruangan.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 175000, options: colorSize(['Abu-Abu', 'Hitam', 'Maroon'], ['M', 'L', 'XL', 'XXL']), tags: ['hoodie', 'pria'] }),
  product({ id: 'kaos-vneck-pria', title: 'Kaos V-Neck Premium Pria', description: 'Kaos V-neck berbahan spandex cotton, elastis dan mengikuti bentuk tubuh dengan nyaman.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 89000, options: colorSize(['Putih', 'Hitam', 'Biru'], ['S', 'M', 'L', 'XL']), tags: ['kaos', 'vneck'] }),
  product({ id: 'kaos-pocket-distro', title: 'Kaos Pocket Distro', description: 'Kaos dengan saku kecil di dada kiri, detail minimalis yang menambah kesan stylish.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 105000, options: colorSize(['Putih', 'Krem', 'Sage'], ['S', 'M', 'L']), tags: ['kaos', 'pocket', 'distro'] }),
  product({ id: 'kaos-batik-modern', title: 'Kaos Batik Modern Pria', description: 'Kaos dengan motif batik kontemporer hasil print digital, perpaduan modern dan tradisional.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 145000, options: sizeOnly(['S', 'M', 'L', 'XL']), tags: ['kaos', 'batik'] }),
  product({ id: 'kaos-tiedye-pria', title: 'Kaos Tie-Dye Pria', description: 'Kaos tie-dye dengan motif celup unik, setiap piece berbeda dan eksklusif.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 120000, options: colorSize(['Biru-Hijau', 'Ungu-Pink', 'Oranye-Kuning'], ['M', 'L', 'XL']), tags: ['kaos', 'tiedye'] }),
  product({ id: 'kaos-sablon-digital', title: 'Kaos Sablon Digital Art', description: 'Kaos dengan sablon digital resolusi tinggi, warna tajam dan tidak mudah luntur.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 135000, options: sizeOnly(['S', 'M', 'L', 'XL']), tags: ['kaos', 'sablon', 'digital'] }),
  product({ id: 'kaos-combed-40s', title: 'Kaos Premium Combed 40s', description: 'Kaos berbahan combed 40s ultra-soft, lebih halus dan ringan dari combed 30s biasa.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 110000, options: colorSize(['Putih', 'Hitam', 'Navy', 'Abu-Abu'], ['S', 'M', 'L', 'XL']), tags: ['kaos', 'premium', 'combed'] }),
  product({ id: 'kaos-henley', title: 'Kaos Panjang Henley', description: 'Kaos lengan panjang dengan kancing di leher gaya henley, casual namun tetap rapi.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 125000, options: colorSize(['Putih', 'Krem', 'Hitam'], ['M', 'L', 'XL']), tags: ['kaos', 'henley', 'lenganpanjang'] }),
  product({ id: 'kaos-army-style', title: 'Kaos Army Style Pria', description: 'Kaos bermotif army/militar yang trendi, bahan ripstop ringan dan tahan lama.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 115000, options: colorSize(['Hijau Army', 'Coklat Tan', 'Hitam'], ['M', 'L', 'XL']), tags: ['kaos', 'army'] }),
  product({ id: 'kaos-retro-90s', title: 'Kaos Retro 90s Pria', description: 'Kaos dengan desain retro 90s yang kembali hits, grafis bold dan warna-warna cerah.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 130000, options: sizeOnly(['S', 'M', 'L', 'XL']), tags: ['kaos', 'retro', '90s'] }),
  product({ id: 'kaos-floral-pria', title: 'Kaos Floral Hawaiian Pria', description: 'Kaos bermotif floral Hawaiian, cocok untuk liburan pantai atau hangout kasual.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 140000, options: colorSize(['Merah', 'Biru', 'Hijau'], ['M', 'L', 'XL']), tags: ['kaos', 'floral', 'hawaiian'] }),
  product({ id: 'kaos-raglan-baseball', title: 'Kaos Raglan Baseball', description: 'Kaos raglan tiga perempat bergaya baseball, tampil sporty dan trendy setiap hari.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 105000, options: colorSize(['Putih-Hitam', 'Putih-Navy', 'Putih-Merah'], ['S', 'M', 'L', 'XL']), tags: ['kaos', 'raglan', 'baseball'] }),
  product({ id: 'kaos-boxy-fit', title: 'Kaos Boxy Fit Oversize', description: 'Kaos dengan potongan boxy yang lega dan nyaman, tren streetwear masa kini.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 118000, options: colorSize(['Hitam', 'Putih', 'Cream'], ['M', 'L', 'XL']), tags: ['kaos', 'boxy', 'oversize'] }),
  product({ id: 'kaos-distro-print', title: 'Kaos Distro Full Print', description: 'Kaos all-over print dengan motif bold eksklusif. Dijamin beda di keramaian.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 155000, options: sizeOnly(['M', 'L', 'XL']), tags: ['kaos', 'distro', 'print'] }),
  product({ id: 'kaos-katun-bambu', title: 'Kaos Katun Bambu Eco', description: 'Kaos berbahan serat bambu yang ramah lingkungan, super lembut dan anti-bau alami.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 165000, options: colorSize(['Putih', 'Abu Muda', 'Hijau Sage'], ['S', 'M', 'L', 'XL']), tags: ['kaos', 'bambu', 'eco'] }),
  product({ id: 'kaos-washed-effect', title: 'Kaos Washed Effect Distro', description: 'Kaos dengan efek washed yang memberikan kesan vintage dan sudah usang namun stylish.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 135000, options: colorSize(['Hitam Washed', 'Biru Washed', 'Hijau Washed'], ['M', 'L', 'XL']), tags: ['kaos', 'washed', 'vintage'] }),
  product({ id: 'kaos-vintage-faded', title: 'Kaos Vintage Faded Premium', description: 'Kaos dengan teknik pigment dye menghasilkan warna yang memudar secara alami dan unik.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 145000, options: colorSize(['Putih', 'Krem', 'Sage', 'Dusty Blue'], ['S', 'M', 'L', 'XL']), tags: ['kaos', 'vintage', 'faded'] }),
  product({ id: 'kaos-motif-abstrak', title: 'Kaos Motif Abstrak Art', description: 'Kaos dengan motif abstrak hasil karya seniman lokal. Limited edition.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 160000, options: sizeOnly(['S', 'M', 'L', 'XL']), tags: ['kaos', 'abstrak', 'art'] }),
  product({ id: 'kaos-linen-blend', title: 'Kaos Linen Blend Pria', description: 'Kaos campuran linen dan cotton, sangat adem dan cocok untuk iklim tropis Indonesia.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 150000, options: colorSize(['Putih', 'Cream', 'Biru Muda'], ['S', 'M', 'L', 'XL']), tags: ['kaos', 'linen', 'adem'] }),
  product({ id: 'kaos-button-down', title: 'Kaos Button Down Casual', description: 'Kaos dengan bukaan kancing di dada, antara kaos dan kemeja, tampil semi-formal dengan santai.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 125000, options: colorSize(['Putih', 'Biru', 'Stripe'], ['M', 'L', 'XL']), tags: ['kaos', 'button', 'casual'] }),
  product({ id: 'kaos-camouflage-pria', title: 'Kaos Camouflage Pria', description: 'Kaos camouflage dengan pola camo modern dan warna yang lebih fashion-forward.', collection: 'kaos-pria', collectionTitle: 'Kaos Pria', price: 120000, options: colorSize(['Camo Green', 'Camo Blue', 'Camo Brown'], ['M', 'L', 'XL']), tags: ['kaos', 'camouflage'] }),
]

// ─── 25 KAOS WANITA ───────────────────────────────────────────────────────────
const kaosWanita = [
  product({ id: 'kaos-offshoulder', title: 'Kaos Off-Shoulder Wanita', description: 'Kaos off-shoulder berbahan jersey lembut, tampil feminin dan romantis setiap hari.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 105000, options: colorSize(['Putih', 'Pink', 'Lavender'], ['S', 'M', 'L']), tags: ['kaos', 'offshoulder', 'wanita'] }),
  product({ id: 'kaos-blouse-casual', title: 'Blouse Casual Wanita', description: 'Blouse kasual berbahan rayon yang jatuh dan adem, cocok untuk kerja maupun jalan-jalan.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 135000, options: colorSize(['Putih', 'Cream', 'Sage', 'Dusty Pink'], ['S', 'M', 'L']), tags: ['blouse', 'casual', 'wanita'] }),
  product({ id: 'kaos-floral-wanita', title: 'Kaos Floral Print Wanita', description: 'Kaos bermotif bunga-bunga yang cantik dan feminin, bahan cotton spandex nyaman dipakai.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 115000, options: colorSize(['Merah Floral', 'Biru Floral', 'Hitam Floral'], ['S', 'M', 'L']), tags: ['kaos', 'floral', 'wanita'] }),
  product({ id: 'kaos-puff-sleeve', title: 'Kaos Puff Sleeve Trendy', description: 'Kaos dengan lengan puff yang mengembang, tampil feminin dan kekinian sesuai tren fashion.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 125000, options: colorSize(['Putih', 'Pink', 'Mint'], ['S', 'M', 'L']), tags: ['kaos', 'puff', 'sleeve'] }),
  product({ id: 'kaos-tiedye-wanita', title: 'Kaos Tie-Dye Wanita', description: 'Kaos tie-dye warna pastel yang lembut dan cantik, perfect untuk gaya boho chic.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 115000, options: colorSize(['Pink Pastel', 'Lavender', 'Mint'], ['S', 'M', 'L']), tags: ['kaos', 'tiedye', 'wanita'] }),
  product({ id: 'kaos-rib-wanita', title: 'Kaos Rib Fitted Wanita', description: 'Kaos berbahan rib elastis yang mengikuti lekukan tubuh, tampil body-fit dan chic.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 98000, options: colorSize(['Hitam', 'Putih', 'Cream', 'Maroon'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'rib', 'fitted'] }),
  product({ id: 'kaos-knotted-front', title: 'Kaos Knotted Front Wanita', description: 'Kaos dengan ikatan simpul di depan, tampil trendy dan modis tanpa perlu aksesoris tambahan.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 108000, options: colorSize(['Putih', 'Pink', 'Hitam'], ['S', 'M', 'L']), tags: ['kaos', 'knotted'] }),
  product({ id: 'kaos-butterfly-print', title: 'Kaos Print Butterfly Wanita', description: 'Kaos dengan motif kupu-kupu cantik hasil print high-definition, warna cerah dan tahan lama.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 120000, options: sizeOnly(['XS', 'S', 'M', 'L']), tags: ['kaos', 'butterfly', 'print'] }),
  product({ id: 'kaos-oversized-wanita', title: 'Kaos Oversized Wanita', description: 'Kaos oversized untuk wanita yang menyukai gaya tomboy-chic. Nyaman dan stylish.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 110000, options: colorSize(['Hitam', 'Abu-Abu', 'Putih'], ['S', 'M', 'L']), tags: ['kaos', 'oversized', 'wanita'] }),
  product({ id: 'kaos-babydoll', title: 'Kaos Babydoll Wanita', description: 'Kaos babydoll dengan siluet mengembang di bawah, feminin dan menutupi perut dengan anggun.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 118000, options: colorSize(['Putih', 'Pink', 'Biru Muda'], ['S', 'M', 'L']), tags: ['kaos', 'babydoll'] }),
  product({ id: 'kaos-stripe-wanita', title: 'Kaos Stripe Breton Wanita', description: 'Kaos bergaris breton gaya Perancis, timeless dan cocok dipadukan dengan apapun.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 100000, options: colorSize(['Biru-Putih', 'Hitam-Putih', 'Merah-Putih'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'stripe', 'breton'] }),
  product({ id: 'kaos-linen-wanita', title: 'Kaos Linen Look Wanita', description: 'Kaos dengan tekstur seperti linen, adem dan cocok untuk tampilan casual chic.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 138000, options: colorSize(['Putih', 'Cream', 'Olive', 'Biru Langit'], ['S', 'M', 'L']), tags: ['kaos', 'linen', 'wanita'] }),
  product({ id: 'kaos-ruffle-shoulder', title: 'Kaos Ruffle Shoulder Wanita', description: 'Kaos dengan detail ruffles di bahu, tampil romantis dan feminim setiap saat.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 125000, options: colorSize(['Putih', 'Pink Mauve', 'Sage'], ['S', 'M', 'L']), tags: ['kaos', 'ruffle', 'feminin'] }),
  product({ id: 'kaos-polo-wanita', title: 'Kaos Polo Wanita Elegan', description: 'Kaos polo wanita berbahan pique premium, tampil sporty-chic yang elegan.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 130000, options: colorSize(['Putih', 'Navy', 'Cream'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'polo', 'wanita'] }),
  product({ id: 'kaos-vneck-wanita', title: 'Kaos V-Neck Wanita Kasual', description: 'Kaos V-neck basic wanita yang versatile, cocok dipadukan dengan celana apapun.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 88000, options: colorSize(['Putih', 'Hitam', 'Abu-Abu', 'Pink'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'vneck', 'wanita'] }),
  product({ id: 'kaos-tube-top', title: 'Tube Top Wanita', description: 'Tube top elastis yang nyaman dan stylish, perfect untuk layering outfit harian.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 75000, options: colorSize(['Hitam', 'Putih', 'Cream', 'Pink', 'Coklat'], ['XS', 'S', 'M']), tags: ['tube', 'top', 'wanita'] }),
  product({ id: 'kaos-halter-neck', title: 'Kaos Halter Neck Wanita', description: 'Kaos halter neck yang trendi, cocok untuk tampilan kasual maupun semi-formal.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 95000, options: colorSize(['Hitam', 'Putih', 'Nude'], ['XS', 'S', 'M', 'L']), tags: ['halter', 'neck', 'wanita'] }),
  product({ id: 'kaos-jersey-wanita', title: 'Kaos Jersey Sport Wanita', description: 'Kaos berbahan jersey berkualitas tinggi, ringan dan elastis untuk aktivitas aktif sehari-hari.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 105000, options: colorSize(['Hitam', 'Abu-Abu', 'Navy', 'Pink'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'jersey', 'sport'] }),
  product({ id: 'kaos-asymmetric', title: 'Kaos Asymmetric Hem Wanita', description: 'Kaos dengan potongan hem tidak simetris yang artistik, tampil edgy dan berbeda.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 115000, options: colorSize(['Hitam', 'Putih', 'Abu-Abu'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'asymmetric', 'edgy'] }),
  product({ id: 'kaos-turtleneck-ringan', title: 'Kaos Turtleneck Ringan Wanita', description: 'Turtleneck berbahan tipis yang nyaman di iklim tropis, tetap stylish sepanjang tahun.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 118000, options: colorSize(['Hitam', 'Cream', 'Coklat', 'Abu-Abu'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'turtleneck', 'wanita'] }),
  product({ id: 'kaos-print-abstrak-wanita', title: 'Kaos Print Abstrak Art Wanita', description: 'Kaos dengan motif abstrak artistik hasil kolaborasi dengan ilustrator lokal.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 140000, options: sizeOnly(['XS', 'S', 'M', 'L']), tags: ['kaos', 'abstrak', 'art'] }),
  product({ id: 'kaos-modal-wanita', title: 'Kaos Modal Premium Wanita', description: 'Kaos berbahan modal yang sangat lembut dan hypoallergenic, cocok untuk kulit sensitif.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 155000, options: colorSize(['Putih', 'Cream', 'Dusty Pink', 'Sage'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'modal', 'premium'] }),
  product({ id: 'kaos-casual-premium-wanita', title: 'Kaos Casual Premium Wanita', description: 'Kaos kasual premium wanita dengan bahan cotton combed 30s terbaik, cocok untuk tampilan sehari-hari.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 99000, options: colorSize(['Putih', 'Hitam', 'Pink', 'Lavender', 'Mint'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'casual', 'premium'] }),
  product({ id: 'kaos-cut-out-wanita', title: 'Kaos Cut-Out Detail Wanita', description: 'Kaos dengan detail potongan unik di bahu atau punggung, tampil edgy dan berani.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 128000, options: colorSize(['Hitam', 'Putih'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'cutout', 'fashion'] }),
  product({ id: 'kaos-smocked-wanita', title: 'Kaos Smocked Back Wanita', description: 'Kaos dengan detail smocked di punggung yang memberikan fit sempurna dan tampilan unik.', collection: 'kaos-wanita', collectionTitle: 'Kaos Wanita', price: 135000, options: colorSize(['Putih', 'Pink', 'Sage', 'Lavender'], ['XS', 'S', 'M', 'L']), tags: ['kaos', 'smocked', 'wanita'] }),
]

// ─── 25 CELANA ────────────────────────────────────────────────────────────────
const celana = [
  product({ id: 'celana-jeans-slim', title: 'Celana Jeans Slim Fit Pria', description: 'Jeans slim fit berbahan denim stretch premium, nyaman bergerak dan tampil slim.', collection: 'celana', collectionTitle: 'Celana', price: 220000, options: colorSize(['Biru', 'Hitam', 'Abu-Abu'], ['28', '30', '32', '34']), tags: ['celana', 'jeans', 'slim'] }),
  product({ id: 'celana-cargo-pria', title: 'Celana Cargo Pria', description: 'Celana cargo dengan banyak kantong fungsional, bahan ripstop tahan lama untuk aktivitas outdoor.', collection: 'celana', collectionTitle: 'Celana', price: 195000, options: colorSize(['Khaki', 'Hitam', 'Olive'], ['30', '32', '34', '36']), tags: ['celana', 'cargo', 'outdoor'] }),
  product({ id: 'celana-pendek-chino', title: 'Celana Pendek Chino', description: 'Celana pendek chino katun twill yang rapi dan nyaman, cocok untuk casual maupun semi-formal.', collection: 'celana', collectionTitle: 'Celana', price: 145000, options: colorSize(['Krem', 'Navy', 'Hitam', 'Olive'], ['28', '30', '32', '34']), tags: ['celana', 'pendek', 'chino'] }),
  product({ id: 'celana-kulot-wanita', title: 'Celana Kulot Wanita', description: 'Kulot elegan berbahan crepe jatuh, memberikan kesan tinggi dan langsing pada pemakainya.', collection: 'celana', collectionTitle: 'Celana', price: 165000, options: colorSize(['Hitam', 'Navy', 'Cream', 'Mauve'], ['XS', 'S', 'M', 'L']), tags: ['celana', 'kulot', 'wanita'] }),
  product({ id: 'celana-training-pria', title: 'Celana Training Olahraga', description: 'Celana training berbahan polyester dry-fit, cepat kering dan nyaman untuk olahraga.', collection: 'celana', collectionTitle: 'Celana', price: 120000, options: colorSize(['Hitam', 'Abu-Abu', 'Navy'], ['S', 'M', 'L', 'XL']), tags: ['celana', 'training', 'olahraga'] }),
  product({ id: 'celana-linen-pria', title: 'Celana Linen Pria', description: 'Celana linen yang sangat adem dan breathable, ideal untuk iklim tropis Indonesia.', collection: 'celana', collectionTitle: 'Celana', price: 185000, options: colorSize(['Putih', 'Krem', 'Biru Muda', 'Olive'], ['28', '30', '32', '34']), tags: ['celana', 'linen', 'adem'] }),
  product({ id: 'celana-formal-slim', title: 'Celana Formal Slim Pria', description: 'Celana bahan formal slim fit, cocok untuk kantor maupun acara semi-formal.', collection: 'celana', collectionTitle: 'Celana', price: 210000, options: colorSize(['Hitam', 'Abu-Abu', 'Navy'], ['28', '30', '32', '34', '36']), tags: ['celana', 'formal', 'slim'] }),
  product({ id: 'celana-shorts-cargo', title: 'Celana Cargo Shorts Pria', description: 'Shorts cargo dengan kantong samping yang fungsional, perfect untuk aktivitas outdoor ringan.', collection: 'celana', collectionTitle: 'Celana', price: 150000, options: colorSize(['Khaki', 'Hitam', 'Olive', 'Abu-Abu'], ['28', '30', '32', '34']), tags: ['celana', 'cargo', 'shorts'] }),
  product({ id: 'celana-palazzo-wanita', title: 'Celana Palazzo Wanita', description: 'Celana palazzo wide leg berbahan sifon jatuh, elegan dan nyaman untuk berbagai kesempatan.', collection: 'celana', collectionTitle: 'Celana', price: 175000, options: colorSize(['Hitam', 'Navy', 'Putih', 'Caramel'], ['XS', 'S', 'M', 'L']), tags: ['celana', 'palazzo', 'wanita'] }),
  product({ id: 'celana-jeans-wanita', title: 'Celana Jeans Wanita Skinny', description: 'Jeans skinny wanita berbahan denim stretch yang pas dan membentuk kaki dengan sempurna.', collection: 'celana', collectionTitle: 'Celana', price: 210000, options: colorSize(['Biru Denim', 'Hitam', 'Abu-Abu'], ['25', '26', '27', '28', '29', '30']), tags: ['celana', 'jeans', 'skinny'] }),
  product({ id: 'celana-legging-wanita', title: 'Celana Legging Wanita', description: 'Legging berbahan spandex berkualitas tinggi, elastis dan tidak mudah turun saat dipakai.', collection: 'celana', collectionTitle: 'Celana', price: 95000, options: colorSize(['Hitam', 'Abu-Abu', 'Navy', 'Coklat'], ['XS', 'S', 'M', 'L']), tags: ['celana', 'legging', 'wanita'] }),
  product({ id: 'celana-sweatpants', title: 'Celana Sweatpants Unisex', description: 'Sweatpants berbahan fleece yang hangat dan nyaman, perfect untuk bersantai di rumah.', collection: 'celana', collectionTitle: 'Celana', price: 160000, options: colorSize(['Abu-Abu', 'Hitam', 'Navy', 'Cream'], ['S', 'M', 'L', 'XL']), tags: ['celana', 'sweatpants', 'santai'] }),
  product({ id: 'celana-bermuda', title: 'Celana Bermuda Pria', description: 'Celana bermuda panjang lutut berbahan ripstop, cocok untuk casual outdoor.', collection: 'celana', collectionTitle: 'Celana', price: 155000, options: colorSize(['Krem', 'Navy', 'Olive', 'Hitam'], ['28', '30', '32', '34']), tags: ['celana', 'bermuda', 'outdoor'] }),
  product({ id: 'celana-high-waist', title: 'Celana High Waist Wanita', description: 'Celana high waist berbahan stretch, menonjolkan pinggang dan memberikan kesan kaki panjang.', collection: 'celana', collectionTitle: 'Celana', price: 188000, options: colorSize(['Hitam', 'Abu-Abu', 'Cream'], ['XS', 'S', 'M', 'L']), tags: ['celana', 'highwaist', 'wanita'] }),
  product({ id: 'celana-ripped-jeans', title: 'Celana Ripped Jeans Distro', description: 'Ripped jeans dengan sobekan yang sudah terdesain rapi, tampil edgy dan trendy.', collection: 'celana', collectionTitle: 'Celana', price: 235000, options: colorSize(['Biru Muda', 'Biru Tua', 'Hitam'], ['28', '30', '32', '34']), tags: ['celana', 'ripped', 'distro'] }),
  product({ id: 'celana-wide-leg', title: 'Celana Wide Leg Wanita', description: 'Celana wide leg dengan potongan lebar yang retro, tampil bold dan penuh percaya diri.', collection: 'celana', collectionTitle: 'Celana', price: 195000, options: colorSize(['Hitam', 'Putih', 'Cream', 'Blue'], ['XS', 'S', 'M', 'L']), tags: ['celana', 'wideleg', 'retro'] }),
  product({ id: 'celana-mom-jeans', title: 'Celana Mom Jeans Wanita', description: 'Mom jeans dengan pinggang tinggi dan potongan loose, timeless dan sangat versatile.', collection: 'celana', collectionTitle: 'Celana', price: 225000, options: colorSize(['Biru Classic', 'Hitam', 'Light Wash'], ['25', '26', '27', '28', '29', '30']), tags: ['celana', 'momjeans', 'wanita'] }),
  product({ id: 'celana-korduroi', title: 'Celana Korduroi Pria', description: 'Celana korduroi dengan tekstur garis halus, hangat dan bernuansa vintage.', collection: 'celana', collectionTitle: 'Celana', price: 200000, options: colorSize(['Coklat', 'Olive', 'Navy', 'Maroon'], ['28', '30', '32', '34']), tags: ['celana', 'korduroi', 'vintage'] }),
  product({ id: 'celana-plaid-pria', title: 'Celana Plaid Casual Pria', description: 'Celana bermotif plaid/kotak-kotak yang stylish, cocok untuk tampilan smart-casual.', collection: 'celana', collectionTitle: 'Celana', price: 190000, options: colorSize(['Biru-Putih', 'Hitam-Abu', 'Coklat-Krem'], ['28', '30', '32', '34']), tags: ['celana', 'plaid', 'casual'] }),
  product({ id: 'celana-denim-shorts', title: 'Celana Denim Shorts Wanita', description: 'Denim shorts wanita dengan potongan yang pas, cocok untuk tampilan kasual musim panas.', collection: 'celana', collectionTitle: 'Celana', price: 165000, options: colorSize(['Biru Muda', 'Biru Tua', 'Hitam', 'Putih'], ['25', '26', '27', '28', '29', '30']), tags: ['celana', 'denim', 'shorts'] }),
  product({ id: 'celana-tapered', title: 'Celana Tapered Fit Pria', description: 'Celana tapered fit yang semakin mengecil ke bawah, tampil modern dan proporsi seimbang.', collection: 'celana', collectionTitle: 'Celana', price: 205000, options: colorSize(['Hitam', 'Abu-Abu', 'Navy', 'Olive'], ['28', '30', '32', '34']), tags: ['celana', 'tapered', 'modern'] }),
  product({ id: 'celana-relaxed-fit', title: 'Celana Relaxed Fit Pria', description: 'Celana dengan potongan relaxed yang longgar dan nyaman, gaya workwear casual.', collection: 'celana', collectionTitle: 'Celana', price: 185000, options: colorSize(['Krem', 'Hitam', 'Olive', 'Biru'], ['28', '30', '32', '34', '36']), tags: ['celana', 'relaxed', 'workwear'] }),
  product({ id: 'celana-jegging-wanita', title: 'Celana Jegging Wanita', description: 'Perpaduan jeans dan legging yang menawarkan kenyamanan legging dengan tampilan denim.', collection: 'celana', collectionTitle: 'Celana', price: 175000, options: colorSize(['Biru Denim', 'Hitam', 'Abu Denim'], ['XS', 'S', 'M', 'L']), tags: ['celana', 'jegging', 'wanita'] }),
  product({ id: 'celana-linen-wanita', title: 'Celana Linen Wide Wanita', description: 'Celana linen wide leg untuk wanita, super adem dan elegan untuk tampilan resort.', collection: 'celana', collectionTitle: 'Celana', price: 178000, options: colorSize(['Putih', 'Cream', 'Sage', 'Coral'], ['XS', 'S', 'M', 'L']), tags: ['celana', 'linen', 'wanita'] }),
  product({ id: 'celana-biker-wanita', title: 'Celana Biker Shorts Wanita', description: 'Biker shorts berbahan spandex tebal, cocok untuk olahraga maupun gaya athleisure.', collection: 'celana', collectionTitle: 'Celana', price: 110000, options: colorSize(['Hitam', 'Abu-Abu', 'Navy', 'Olive'], ['XS', 'S', 'M', 'L']), tags: ['celana', 'biker', 'athleisure'] }),
]

// ─── 25 AKSESORIS ─────────────────────────────────────────────────────────────
const aksesoris = [
  product({ id: 'kalung-rantai-silver', title: 'Kalung Rantai Silver Pria', description: 'Kalung rantai silver stainless anti karat, tebal dan berbobot, tampilan maskulin.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 120000, options: [{ name: 'Panjang', values: ['45cm', '50cm', '55cm'] }], tags: ['kalung', 'silver', 'pria'] }),
  product({ id: 'gelang-kulit-pria', title: 'Gelang Kulit Pria', description: 'Gelang berbahan kulit asli dengan aksen metal, simpel namun berkesan kuat dan maskulin.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 85000, options: [{ name: 'Warna', values: ['Coklat', 'Hitam', 'Tan'] }], tags: ['gelang', 'kulit', 'pria'] }),
  product({ id: 'dompet-kulit-slim', title: 'Dompet Kulit Slim Bifold', description: 'Dompet kulit slim bifold dengan kapasitas cukup tanpa bikin kantong menonjol.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 175000, options: [{ name: 'Warna', values: ['Coklat', 'Hitam', 'Tan'] }], tags: ['dompet', 'kulit', 'slim'] }),
  product({ id: 'ikat-pinggang-kulit', title: 'Ikat Pinggang Kulit Asli', description: 'Belt kulit asli dengan gesper metal premium, cocok untuk formal maupun kasual.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 145000, options: [{ name: 'Warna', values: ['Hitam', 'Coklat'] }], tags: ['belt', 'kulit', 'ikat pinggang'] }),
  product({ id: 'kacamata-round', title: 'Kacamata Hitam Round Vintage', description: 'Kacamata hitam frame round berbahan metal ringan, gaya vintage yang timeless.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 165000, options: [{ name: 'Warna Frame', values: ['Gold', 'Silver', 'Black'] }], tags: ['kacamata', 'round', 'vintage'] }),
  product({ id: 'tas-tote-canvas', title: 'Tas Tote Canvas Unisex', description: 'Tote bag berbahan canvas tebal, kapasitas besar untuk daily use, eco-friendly.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 115000, options: [{ name: 'Warna', values: ['Natural', 'Hitam', 'Navy'] }], tags: ['tas', 'tote', 'canvas'] }),
  product({ id: 'cincin-stainless-pria', title: 'Cincin Stainless Steel Pria', description: 'Cincin stainless steel anti karat dengan desain minimalis, cocok untuk pria modern.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 65000, options: [{ name: 'Ukuran', values: ['17', '18', '19', '20', '21'] }], tags: ['cincin', 'stainless', 'pria'] }),
  product({ id: 'anting-stud-wanita', title: 'Anting Stud Gold Wanita', description: 'Anting stud berbahan gold-plated hypoallergenic, aman untuk kulit sensitif.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 55000, options: [{ name: 'Motif', values: ['Bintang', 'Hati', 'Bulan', 'Lingkaran'] }], tags: ['anting', 'stud', 'wanita'] }),
  product({ id: 'kalung-choker-wanita', title: 'Kalung Choker Wanita', description: 'Choker berbahan satin lembut dengan aksen charm metal, tampil feminin dan elegan.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 58000, options: [{ name: 'Warna', values: ['Hitam', 'Putih', 'Merah'] }], tags: ['kalung', 'choker', 'wanita'] }),
  product({ id: 'scarf-batik', title: 'Scarf Batik Premium', description: 'Scarf bermotif batik berbahan satin, serbaguna sebagai aksesoris leher, rambut, atau tas.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 125000, options: [{ name: 'Motif', values: ['Parang', 'Kawung', 'Mega Mendung'] }], tags: ['scarf', 'batik', 'premium'] }),
  product({ id: 'topi-bucket-hat', title: 'Topi Bucket Hat Kasual', description: 'Bucket hat berbahan canvas tipis, cocok untuk outdoor, melindungi dari matahari dengan stylish.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 85000, options: [{ name: 'Warna', values: ['Hitam', 'Cream', 'Olive', 'Blue'] }], tags: ['topi', 'bucket', 'outdoor'] }),
  product({ id: 'kacamata-cat-eye', title: 'Kacamata Cat Eye Wanita', description: 'Kacamata cat eye feminin dengan frame asetat berkualitas, tampil playful dan sophisticated.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 178000, options: [{ name: 'Warna', values: ['Tortoise', 'Hitam', 'Pink Transparan'] }], tags: ['kacamata', 'cateye', 'wanita'] }),
  product({ id: 'gelang-manik-wanita', title: 'Gelang Manik-Manik Wanita', description: 'Gelang manik-manik berwarna dengan charm lucu, cocok untuk gaya bohemian dan casual.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 45000, options: [{ name: 'Warna', values: ['Colorful', 'Pastel', 'Earth Tone'] }], tags: ['gelang', 'manik', 'wanita'] }),
  product({ id: 'dompet-mini-wanita', title: 'Dompet Mini Wanita', description: 'Dompet mini fungsional untuk wanita, muat kartu dan uang kertas, mudah dibawa kemana-mana.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 95000, options: [{ name: 'Warna', values: ['Pink', 'Hitam', 'Cream', 'Maroon'] }], tags: ['dompet', 'mini', 'wanita'] }),
  product({ id: 'sabuk-anyam', title: 'Sabuk Anyam Rotan Wanita', description: 'Sabuk anyam berbahan rotan sintetis dengan gesper metal, aksesoris fashion yang unik.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 78000, options: [{ name: 'Warna', values: ['Natural', 'Coklat', 'Hitam'] }], tags: ['sabuk', 'anyam', 'wanita'] }),
  product({ id: 'sling-bag', title: 'Tas Sling Bag Kasual', description: 'Sling bag kecil multi-pocket yang praktis untuk daily use, bisa dipakai di depan atau belakang.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 148000, options: [{ name: 'Warna', values: ['Hitam', 'Abu-Abu', 'Olive', 'Navy'] }], tags: ['tas', 'sling', 'kasual'] }),
  product({ id: 'sunglasses-sporty', title: 'Sunglasses Sporty UV400', description: 'Kacamata hitam sporty dengan perlindungan UV400, ringan dan tahan benturan.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 138000, options: [{ name: 'Warna Frame', values: ['Hitam', 'Putih', 'Merah', 'Biru'] }], tags: ['kacamata', 'sporty', 'uv400'] }),
  product({ id: 'cincin-fashion-wanita', title: 'Set Cincin Fashion Wanita', description: 'Set 3 buah cincin dengan desain bertumpuk yang dapat digunakan sendiri-sendiri atau digabung.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 72000, options: [{ name: 'Warna', values: ['Gold', 'Silver', 'Rose Gold'] }], tags: ['cincin', 'fashion', 'set'] }),
  product({ id: 'hair-clip-set', title: 'Hair Clip Set Wanita', description: 'Set klip rambut aesthetic berbagai ukuran dan motif, tampil cute dan kekinian.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 48000, options: [{ name: 'Tema', values: ['Floral', 'Solid Color', 'Checkerboard'] }], tags: ['hairclip', 'rambut', 'wanita'] }),
  product({ id: 'gelang-charm-wanita', title: 'Gelang Charm Wanita', description: 'Gelang rantai dengan charm yang dapat di-customize, hadiah yang sempurna.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 88000, options: [{ name: 'Warna', values: ['Gold', 'Silver', 'Rose Gold'] }], tags: ['gelang', 'charm', 'wanita'] }),
  product({ id: 'kalung-pendant-wanita', title: 'Kalung Pendant Wanita', description: 'Kalung dengan pendant minimalis berbahan stainless steel anti karat, elegan setiap hari.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 78000, options: [{ name: 'Motif', values: ['Bintang', 'Bulan', 'Infinity', 'Hati'] }], tags: ['kalung', 'pendant', 'wanita'] }),
  product({ id: 'brooch-floral', title: 'Brooch Floral Premium', description: 'Bros bunga berbahan kain dengan detail bordir halus, sentuhan klasik untuk tampilan formal.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 62000, options: [{ name: 'Warna', values: ['Merah', 'Pink', 'Ungu', 'Putih'] }], tags: ['bros', 'floral', 'formal'] }),
  product({ id: 'topi-snapback', title: 'Topi Snapback Distro', description: 'Snapback dengan logo bordir eksklusif, adjustable untuk semua ukuran kepala.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 95000, options: [{ name: 'Warna', values: ['Hitam', 'Putih', 'Navy', 'Maroon'] }], tags: ['topi', 'snapback', 'distro'] }),
  product({ id: 'kacamata-aviator', title: 'Kacamata Aviator Classic', description: 'Kacamata aviator klasik berbahan metal ringan, timeless style yang tidak pernah ketinggalan zaman.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 155000, options: [{ name: 'Warna Lensa', values: ['Hitam', 'Coklat', 'Biru Mirror'] }], tags: ['kacamata', 'aviator', 'classic'] }),
  product({ id: 'tas-clutch-wanita', title: 'Tas Clutch Wanita Elegan', description: 'Clutch bag berbahan satin berkilau, sempurna untuk acara pesta atau dinner formal.', collection: 'aksesoris', collectionTitle: 'Aksesoris', price: 128000, options: [{ name: 'Warna', values: ['Hitam', 'Gold', 'Silver', 'Merah'] }], tags: ['tas', 'clutch', 'pesta'] }),
]

// ─── GABUNG 100 PRODUK ────────────────────────────────────────────────────────
const products = [...kaosPria, ...kaosWanita, ...celana, ...aksesoris]

async function seed() {
  console.log('🌱 Seeding 100 sample products...\n')

  for (const prod of products) {
    const { id, ...data } = prod
    await setDoc(doc(db, 'products', id), data)
    process.stdout.write('.')
  }

  console.log(`\n\n✅ ${products.length} produk berhasil disimpan ke Firestore`)
  process.exit(0)
}

seed().catch((e) => {
  console.error('\n❌ Error:', e)
  process.exit(1)
})
