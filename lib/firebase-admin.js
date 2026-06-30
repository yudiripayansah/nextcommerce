import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Lazy init — never runs at module load time.
// Calling getAdminApp() inside a request handler means init errors are
// caught by the route's own try/catch and return proper JSON, not HTML.
let _adminApp = null

function getAdminApp() {
  if (_adminApp) return _adminApp
  const existing = getApps().find((a) => a.name === 'admin')
  if (existing) {
    _adminApp = existing
    return _adminApp
  }
  _adminApp = initializeApp(
    {
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    },
    'admin'
  )
  return _adminApp
}

export function getAdminAuth() {
  return getAuth(getAdminApp())
}

export function getAdminDb() {
  return getFirestore(getAdminApp())
}
