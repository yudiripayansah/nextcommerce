import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { getMessaging } from 'firebase-admin/messaging'
import { getApp } from 'firebase-admin/app'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { tenantId, orderNumber, customerName, totalAmount } = await request.json()
    if (!tenantId) return NextResponse.json({ ok: false, reason: 'tenantId required' })

    // Resolve admin UID from tenant
    const tenantSnap = await adminDb.collection('tenants').doc(tenantId).get()
    if (!tenantSnap.exists) return NextResponse.json({ ok: false, reason: 'tenant not found' })

    const { ownerUid } = tenantSnap.data()
    if (!ownerUid) return NextResponse.json({ ok: false, reason: 'no ownerUid' })

    // Get FCM token for the admin user
    const userSnap = await adminDb.collection('users').doc(ownerUid).get()
    const fcmToken = userSnap.data()?.fcmToken
    if (!fcmToken) return NextResponse.json({ ok: false, reason: 'no fcmToken' })

    const amount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(totalAmount || 0)

    await getMessaging(getApp('admin')).send({
      token: fcmToken,
      notification: {
        title: `Order Baru! #${orderNumber}`,
        body: `Dari ${customerName} — ${amount}`,
        imageUrl: '/icons/icon.svg',
      },
      webpush: {
        notification: {
          icon: '/icons/icon.svg',
          badge: '/icons/badge.svg',
          tag: 'new-order',
          renotify: true,
          requireInteraction: true,
        },
        fcmOptions: { link: '/admin/orders' },
        data: { url: '/admin/orders' },
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[push-notify]', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
