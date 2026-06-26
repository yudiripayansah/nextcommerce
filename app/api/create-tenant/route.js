import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export const runtime = 'nodejs'

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function POST(request) {
  // Verify Bearer token
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const token = authHeader.slice(7)
    const decoded = await adminAuth.verifyIdToken(token)

    // Hanya superadmin yang boleh
    const callerDoc = await adminDb.collection('users').doc(decoded.uid).get()
    if (!callerDoc.exists || callerDoc.data().role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { ownerName, storeName, email, password, whatsapp } = await request.json()

    if (!ownerName || !storeName || !email || !password) {
      return NextResponse.json({ error: 'Field wajib tidak lengkap' }, { status: 400 })
    }

    // Buat Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: ownerName,
    })
    const uid = userRecord.uid

    // Generate slug unik (tambah timestamp suffix jika bentrok)
    let slug = slugify(storeName)
    const existing = await adminDb.collection('tenants').where('slug', '==', slug).get()
    if (!existing.empty) slug = `${slug}-${Date.now().toString(36)}`

    // Buat tenant doc
    const tenantRef = adminDb.collection('tenants').doc()
    const tenantId = tenantRef.id
    const now = FieldValue.serverTimestamp()

    await Promise.all([
      // tenants/{tenantId}
      tenantRef.set({
        slug,
        name: storeName,
        ownerUid: uid,
        status: 'active',
        plan: 'free',
        createdAt: now,
        updatedAt: now,
      }),
      // users/{uid}
      adminDb.collection('users').doc(uid).set({
        tenantId,
        role: 'admin',
        email,
        name: ownerName,
        createdAt: now,
      }),
      // tenants/{tenantId}/settings/store
      adminDb
        .collection('tenants')
        .doc(tenantId)
        .collection('settings')
        .doc('store')
        .set({
          storeName,
          whatsappNumber: whatsapp || '',
          logo: '',
          favicon: '',
          email: '',
          phone: '',
          address: '',
          facebook: '',
          instagram: '',
          tiktok: '',
          updatedAt: now,
        }),
    ])

    return NextResponse.json({ success: true, tenantId, uid, slug })
  } catch (err) {
    console.error('[create-tenant]', err)
    if (err.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
