// Hapus semua collection lama (single-tenant) dari Firestore root
// Jalankan: node scripts/cleanup-old-data.js

const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs, deleteDoc } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDzO43Bqonz3cAVXKnuW8uD2_mTo-E3LcU',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'nextcommerce-f2631.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nextcommerce-f2631',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '913795303372',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:913795303372:web:be67085db95afb95497f69',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Collection lama yang perlu dihapus
const OLD_COLLECTIONS = ['collections', 'customers', 'files', 'orders', 'pages', 'products', 'settings']

async function deleteCollection(colName) {
  const snap = await getDocs(collection(db, colName))
  if (snap.empty) {
    console.log(`⏭️  ${colName}: kosong, dilewati`)
    return 0
  }
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
  console.log(`🗑️  ${colName}: ${snap.size} dokumen dihapus`)
  return snap.size
}

async function cleanup() {
  console.log('🧹 Membersihkan data lama (single-tenant)...\n')

  let total = 0
  for (const col of OLD_COLLECTIONS) {
    const count = await deleteCollection(col)
    total += count
  }

  console.log(`\n✅ Selesai! Total ${total} dokumen dihapus.`)
  console.log('Collection yang dihapus:', OLD_COLLECTIONS.join(', '))
  process.exit(0)
}

cleanup().catch((e) => {
  console.error('❌ Error:', e.message)
  process.exit(1)
})
