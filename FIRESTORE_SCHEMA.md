# FIRESTORE_SCHEMA.md

# Database Philosophy

* Low read cost
* Simple queries (no composite indexes)
* Flat structures where possible
* Multi-tenant: all store data lives under `tenants/{tenantId}/`

---

# Top-Level Collections

```txt
users/              — admin + superadmin accounts
tenants/            — tenant metadata (one doc per store)
```

# Tenant-Scoped Subcollections

```txt
tenants/{tenantId}/
├── settings/       — singleton: doc ID = "store"
├── collections/
├── products/
├── orders/
├── customers/
├── addresses/
├── pages/
└── files/
```

---

# users

Admin and superadmin accounts. Created by superadmin via `/api/create-tenant` or manually.

```js
// users/{uid}   (uid = Firebase Auth UID)
{
  name: "",
  email: "",
  role: "admin",      // "admin" | "superadmin"
  tenantId: "",       // null / undefined for superadmin
  createdAt: null
}
```

Role checks:
- `role === 'superadmin'` → `SuperAdminContext`, can access `/superadmin`
- `role === 'admin'` → `AuthContext`, can access `/admin` (scoped to their tenantId)

---

# tenants

One document per store. Created by superadmin.

```js
// tenants/{tenantId}
{
  name: "",
  slug: "",           // URL path segment: /{slug}
  plan: "free",       // "free" | "pro" | "enterprise"
  status: "active",   // "active" | "inactive" | "suspended"
  ownerName: "",
  email: "",
  whatsapp: "",       // 628xxxxxxxxxx
  createdAt: null,
  updatedAt: null
}
```

Query (superadmin only):
```js
query(collection(db, 'tenants'), orderBy('createdAt', 'desc'))
```

---

# tenants/{tenantId}/settings

Singleton. Document ID: `store`.

```js
{
  storeName: "",
  logo: "",           // Cloudinary URL
  favicon: "",        // Cloudinary URL
  whatsappNumber: "", // 628xxxxxxxxxx
  email: "",
  phone: "",
  address: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  theme: {
    template: "urban-fashion",  // "urban-fashion" | "happy-hobby"
    primary: "#000000",
    primaryFg: "#ffffff",
    accent: "#374151",
    bg: "#ffffff",
    surface: "#f9fafb",
    text: "#111827"
  },
  updatedAt: null
}
```

---

# tenants/{tenantId}/collections

```js
{
  id: "",
  title: "",
  handle: "",         // slugified, url-safe
  description: "",
  image: "",          // Cloudinary URL
  status: "active",   // "active" | "draft"
  productCount: 0,
  createdAt: null,
  updatedAt: null
}
```

Query pattern:
```js
// Single orderBy, filter client-side to avoid composite index
query(COL, orderBy('createdAt', 'desc'))
// then: .filter(c => c.status === 'active')
```

---

# tenants/{tenantId}/products

```js
{
  id: "",
  title: "",
  handle: "",
  description: "",
  featuredImage: "",  // Cloudinary URL
  images: [],         // Cloudinary URLs
  tags: [],
  collectionId: "",
  collectionTitle: "",
  options: [          // max 3
    { name: "Color", values: ["Black", "White"] }
  ],
  variants: [
    {
      id: "",
      title: "Black / M",
      sku: "",
      price: 0,
      stock: 0,
      image: "",      // optional per-variant Cloudinary URL
      option1: "Black",
      option2: "M",
      option3: ""
    }
  ],
  status: "active",   // "active" | "draft" | "archived"
  createdAt: null,
  updatedAt: null
}
```

`minPrice`, `maxPrice`, `totalStock` are NOT stored — computed client-side by `normalize()` in `services/products.js`.

Query patterns:
```js
// List: single orderBy + client filter
query(COL, orderBy('createdAt', 'desc'), limit(pageLimit))

// By handle:
query(COL, where('handle', '==', handle))

// By collection (sort client-side):
query(COL, where('collectionId', '==', collectionId))
// .sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0))

// Search (client-side filter on fetched active products):
query(COL, where('status', '==', 'active'), limit(200))
```

---

# tenants/{tenantId}/customers

Document ID = Firebase Auth UID for registered customers, or Firestore auto-ID for guests.

```js
{
  id: "",
  name: "",
  email: "",          // populated for registered customers
  whatsapp: "",
  totalOrders: 0,
  totalSpent: 0,
  lastOrderDate: null,
  createdAt: null,
  updatedAt: null
}
```

Customers are upserted automatically when an order is placed (guest or registered).
Registered customers have a matching Firebase Auth entry via `customerAuth` instance.

---

# tenants/{tenantId}/addresses

```js
{
  id: "",
  customerId: "",     // Firebase Auth UID
  recipientName: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  isDefault: false,
  createdAt: null,
  updatedAt: null
}
```

Query pattern:
```js
query(COL, where('customerId', '==', customerId), orderBy('isDefault', 'desc'))
```

To set a new default: clear existing default first, then set new one.

---

# tenants/{tenantId}/orders

```js
{
  id: "",
  orderNumber: "",    // "ORD-YYYYMMDD-XXXX"
  customerId: "",
  customerName: "",
  customerWhatsapp: "",
  notes: "",
  items: [
    {
      productId: "",
      productTitle: "",
      variantTitle: "",
      price: 0,
      quantity: 0,
      subtotal: 0
    }
  ],
  totalItems: 0,
  totalAmount: 0,
  status: "new",      // new | contacted | paid | shipped | completed | cancelled
  createdAt: null,
  updatedAt: null
}
```

Statuses:
```
new        — placed via WhatsApp
contacted  — admin reached out
paid       — payment confirmed
shipped    — in transit
completed  — delivered
cancelled  — cancelled
```

Query patterns:
```js
// List: single orderBy
query(COL, orderBy('createdAt', 'desc'), limit(pageLimit))

// By customer (sort client-side):
query(COL, where('customerId', '==', customerId))
// .sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0))
```

---

# tenants/{tenantId}/pages

Document ID = slug (fixed set):

```txt
about-us | contact-us | how-to-buy | faq
```

```js
{
  title: "",
  content: "",        // HTML string from rich text editor
  updatedAt: null
}
```

---

# tenants/{tenantId}/files

Mirrors Cloudinary. Each upload adds a record here.

```js
{
  id: "",
  url: "",            // Cloudinary secure_url
  publicId: "",       // Cloudinary public_id (for deletion)
  name: "",
  size: 0,            // bytes
  format: "",         // jpg, png, webp…
  width: 0,
  height: 0,
  createdAt: null
}
```

Query pattern:
```js
query(COL, orderBy('createdAt', 'desc'), limit(200))
```

---

# Analytics Strategy

For MVP: query orders with simple filters, compute totals client-side in dashboard.

Do NOT calculate analytics from all orders on every page load — use `limit()` and compute only what's visible.

Future: `tenants/{tenantId}/analytics/summary` updated via Cloud Functions on order status change.
