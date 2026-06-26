import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Three separate Firebase app instances → three independent auth sessions
// Each instance holds its own token, so all three can be active simultaneously.

// 1. Primary — superadmin session
const app =
  getApps().find((a) => a.name === '[DEFAULT]') || initializeApp(firebaseConfig)

// 2. Secondary — admin toko session
const storeApp =
  getApps().find((a) => a.name === 'store') || initializeApp(firebaseConfig, 'store')

// 3. Tertiary — customer session
const customerApp =
  getApps().find((a) => a.name === 'customer') || initializeApp(firebaseConfig, 'customer')

export const auth = getAuth(app)             // SuperAdminContext
export const storeAuth = getAuth(storeApp)   // AuthContext (admin toko)
export const customerAuth = getAuth(customerApp) // CustomerAuthContext
export const db = getFirestore(app)          // Firestore shared (satu project)
export default app
