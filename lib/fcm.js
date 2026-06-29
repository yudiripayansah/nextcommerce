'use client'

import { getMessaging, getToken, isSupported } from 'firebase/messaging'
import app from './firebase'

export async function fcmSupported() {
  try {
    return typeof window !== 'undefined' && await isSupported()
  } catch {
    return false
  }
}

export async function requestFCMToken() {
  if (!await fcmSupported()) return null
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null

    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' })
    await navigator.serviceWorker.ready

    const messaging = getMessaging(app)
    return await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: reg,
    })
  } catch (err) {
    console.error('[FCM] getToken error:', err)
    return null
  }
}

export function getNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission // 'default' | 'granted' | 'denied'
}
