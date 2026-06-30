import { NextResponse } from 'next/server'
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { sanitizeApiInput } from '@/lib/sanitize'

export const runtime = 'nodejs'

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function genericError(res, status = 500) {
  return NextResponse.json({ error: res }, { status })
}

export async function POST(request) {
  // Verify Bearer token
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return genericError('Unauthorized', 401)
  }

  try {
    const adminAuth = getAdminAuth()
    const adminDb = getAdminDb()

    const token = authHeader.slice(7)
    const decoded = await adminAuth.verifyIdToken(token)

    // Only superadmin may create tenants
    const callerDoc = await adminDb.collection('users').doc(decoded.uid).get()
    if (!callerDoc.exists || callerDoc.data().role !== 'superadmin') {
      return genericError('Forbidden', 403)
    }

    const body = await request.json().catch(() => null)
    if (!body) return genericError('Request tidak valid', 400)

    const { ownerName, storeName, email, password, whatsapp } = body

    // Validate required fields
    if (!ownerName?.trim() || !storeName?.trim() || !email?.trim() || !password) {
      return genericError('Field wajib tidak lengkap', 400)
    }
    if (typeof password !== 'string' || password.length < 8) {
      return genericError('Password minimal 8 karakter', 400)
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return genericError('Format email tidak valid', 400)
    }

    // Sanitize display strings
    const safeName = sanitizeApiInput(ownerName, 100)
    const safeStoreName = sanitizeApiInput(storeName, 100)
    const safeWhatsapp = whatsapp ? sanitizeApiInput(whatsapp, 20).replace(/\D/g, '') : ''

    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email: email.trim().toLowerCase(),
      password,
      displayName: safeName,
    })
    const uid = userRecord.uid

    // Generate unique slug
    let slug = slugify(safeStoreName)
    if (!slug) slug = `toko-${Date.now().toString(36)}`
    const existing = await adminDb.collection('tenants').where('slug', '==', slug).get()
    if (!existing.empty) slug = `${slug}-${Date.now().toString(36)}`

    const tenantRef = adminDb.collection('tenants').doc()
    const tenantId = tenantRef.id
    const now = FieldValue.serverTimestamp()

    await Promise.all([
      tenantRef.set({
        slug,
        name: safeStoreName,
        ownerUid: uid,
        status: 'active',
        plan: 'free',
        createdAt: now,
        updatedAt: now,
      }),
      adminDb.collection('users').doc(uid).set({
        tenantId,
        role: 'admin',
        email: email.trim().toLowerCase(),
        name: safeName,
        createdAt: now,
      }),
      adminDb
        .collection('tenants')
        .doc(tenantId)
        .collection('settings')
        .doc('store')
        .set({
          storeName: safeStoreName,
          whatsappNumber: safeWhatsapp,
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
      return genericError('Email sudah terdaftar', 400)
    }
    if (err.code === 'auth/invalid-email') {
      return genericError('Format email tidak valid', 400)
    }
    if (err.code === 'auth/weak-password') {
      return genericError('Password terlalu lemah', 400)
    }
    // Don't expose internal error messages
    return genericError('Terjadi kesalahan. Coba lagi.', 500)
  }
}
