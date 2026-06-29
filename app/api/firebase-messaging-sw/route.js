export const runtime = 'nodejs'

// Serve Firebase Messaging service worker with config injected from env vars.
// Accessed via rewrite: /firebase-messaging-sw.js → /api/firebase-messaging-sw
export async function GET() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  const script = `
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

firebase.initializeApp(${JSON.stringify(config)});
const messaging = firebase.messaging();

// Handle background push messages (app is closed / in background)
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Order Baru!';
  const options = {
    body: payload.notification?.body || 'Ada pesanan baru masuk.',
    icon: payload.notification?.icon || '/icons/icon.svg',
    badge: '/icons/badge.svg',
    tag: 'new-order',
    renotify: true,
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});

// Open admin orders when notification is clicked
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/admin/orders';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes('/admin') && 'focus' in c);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
`

  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Service-Worker-Allowed': '/',
      'Cache-Control': 'no-cache',
    },
  })
}
