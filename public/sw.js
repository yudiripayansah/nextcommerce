// Service Worker — push notifications + basic offline shell
const CACHE = 'nc-shell-v1'

self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim())
})

// Push: show notification to admin
self.addEventListener('push', (e) => {
  const data = e.data?.json() ?? {}
  const title = data.title || 'Order Baru!'
  const options = {
    body: data.body || 'Ada pesanan baru masuk.',
    icon: data.icon || '/icons/icon.svg',
    badge: '/icons/badge.svg',
    tag: data.tag || 'new-order',
    renotify: true,
    data: { url: data.url || '/admin/orders' },
    actions: [{ action: 'open', title: 'Lihat Order' }],
  }
  e.waitUntil(self.registration.showNotification(title, options))
})

// Notification click: open admin orders
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const url = e.notification.data?.url || '/admin/orders'
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(url) && 'focus' in c)
      if (existing) return existing.focus()
      return clients.openWindow(url)
    })
  )
})
