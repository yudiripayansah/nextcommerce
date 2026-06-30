const { initializeApp } = require('firebase/app')
const { getFirestore, collection, query, where, getDocs, doc, updateDoc, serverTimestamp } = require('firebase/firestore')

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

async function fixTheme() {
  const q = query(collection(db, 'tenants'), where('slug', '==', 'manga-mise'))
  const snap = await getDocs(q)

  if (snap.empty) {
    console.log('manga-mise tenant not found')
    process.exit(1)
  }

  const tenantId = snap.docs[0].id
  console.log('Found tenant:', tenantId)

  const settingsRef = doc(db, 'tenants', tenantId, 'settings', 'store')

  await updateDoc(settingsRef, {
    'theme.primary': '#e94560',
    'theme.primaryFg': '#ffffff',
    'theme.accent': '#0f3460',
    'theme.bg': '#0f0e17',
    'theme.surface': '#16213e',
    'theme.text': '#e8e8e8',
    updatedAt: serverTimestamp(),
  })

  console.log('✓ manga-mise theme updated:')
  console.log('  primary: #e94560 (vivid red)')
  console.log('  primaryFg: #ffffff')
  console.log('  accent: #0f3460 (deep blue)')
  console.log('  bg: #0f0e17 (very dark)')
  console.log('  surface: #16213e (dark navy)')
  console.log('  text: #e8e8e8 (near white)')
  process.exit(0)
}

fixTheme().catch(err => { console.error(err); process.exit(1) })
