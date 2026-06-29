import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { getMessaging } from 'firebase-admin/messaging'
import { getApp } from 'firebase-admin/app'
import { sanitizeApiInput } from '@/lib/sanitize'

export const runtime = 'nodejs'

// Simple in-process cooldown: one notification per tenantId per 10s.
// Mitigates spam in single-instance environments.
const recentNotifications = new Map()
const COOLDOWN_MS = 10_000

function isAllowed(tenantId) {
  const last = recentNotifications.get(tenantId)
  if (last && Date.now() - last < COOLDOWN_MS) return false
  recentNotifications.set(tenantId, Date.now())
  // Prune old entries to avoid unbounded growth
  if (recentNotifications.size > 1000) {
    const cutoff = Date.now() - COOLDOWN_MS * 2
    for (const [k, v] of recentNotifications) {
      if (v < cutoff) recentNotifications.delete(k)
    }
  }
  return true
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const { tenantId, orderNumber, customerName, totalAmount } = body

    // Validate required fields
    if (
      typeof tenantId !== 'string' ||
      tenantId.length < 1 ||
      tenantId.length > 128 ||
      !/^[a-zA-Z0-9_-]+$/.test(tenantId)
    ) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    // Cooldown check
    if (!isAllowed(tenantId)) {
      return NextResponse.json({ ok: true }) // silent, don't reveal rate limit
    }

    // Sanitize display strings
    const safeOrderNumber = sanitizeApiInput(String(orderNumber || ''), 50)
    const safeCustomerName = sanitizeApiInput(String(customerName || 'Pelanggan'), 100)
    const safeAmount = typeof totalAmount === 'number' && Number.isFinite(totalAmount) ? totalAmount : 0

    // Resolve admin UID from tenant
    const tenantSnap = await adminDb.collection('tenants').doc(tenantId).get()
    if (!tenantSnap.exists) return NextResponse.json({ ok: false })

    const { ownerUid } = tenantSnap.data()
    if (!ownerUid) return NextResponse.json({ ok: false })

    const userSnap = await adminDb.collection('users').doc(ownerUid).get()
    const fcmToken = userSnap.data()?.fcmToken
    if (!fcmToken) return NextResponse.json({ ok: false })

    const amount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(safeAmount)

    await getMessaging(getApp('admin')).send({
      token: fcmToken,
      notification: {
        title: `Order Baru! #${safeOrderNumber}`,
        body: `Dari ${safeCustomerName} — ${amount}`,
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
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
