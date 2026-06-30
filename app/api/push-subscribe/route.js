import { NextResponse } from 'next/server'
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'

export async function POST(request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const adminAuth = getAdminAuth()
    const adminDb = getAdminDb()

    const token = authHeader.slice(7)
    const decoded = await adminAuth.verifyIdToken(token)

    const { fcmToken } = await request.json()
    if (!fcmToken) return NextResponse.json({ error: 'fcmToken wajib' }, { status: 400 })

    await adminDb.collection('users').doc(decoded.uid).update({ fcmToken })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[push-subscribe]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const adminAuth = getAdminAuth()
    const adminDb = getAdminDb()

    const token = authHeader.slice(7)
    const decoded = await adminAuth.verifyIdToken(token)
    const { FieldValue } = await import('firebase-admin/firestore')
    await adminDb.collection('users').doc(decoded.uid).update({ fcmToken: FieldValue.delete() })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[push-unsubscribe]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
