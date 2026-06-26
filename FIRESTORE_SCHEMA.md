# FIRESTORE_SCHEMA.md

# Database Philosophy

Firestore should be optimized for:

* Low read cost
* Simple queries
* Fast dashboard loading
* Easy maintenance

Avoid:

* Deep nesting
* Complex joins
* Large arrays that grow unbounded

Use flat structures whenever possible.

---

# Collections

```txt
settings
collections
products
orders
customers
addresses
pages
files
```

---

# settings

Document ID: `store` (singleton)

```js
{
  storeName: "",

  logo: "",             // Cloudinary URL

  favicon: "",          // Cloudinary URL

  whatsappNumber: "",   // format: 628xxxxxxxxxx (no + or spaces)

  email: "",

  phone: "",

  address: "",

  facebook: "",

  instagram: "",

  tiktok: "",

  theme: {              // optional, color preset object
    primary: "",
    primaryFg: "",
    accent: "",
    bg: "",
    surface: "",
    text: ""
  },

  updatedAt: null
}
```

---

# collections

```js
{
  id: "",

  title: "",

  handle: "",           // slugified, url-safe

  description: "",

  image: "",            // Cloudinary URL

  status: "active",     // active | draft

  productCount: 0,

  createdAt: null,

  updatedAt: null
}
```

Query pattern:

```js
// Avoid composite index: fetch all with single orderBy, filter client-side
query(COL, orderBy('createdAt', 'desc'))
// then: results.filter(c => c.status === 'active')
```

---

# products

```js
{
  id: "",

  title: "",

  handle: "",           // slugified, url-safe

  description: "",

  featuredImage: "",    // Cloudinary URL

  images: [],           // Cloudinary URLs

  tags: [],

  collectionId: "",

  collectionTitle: "",

  options: [            // max 3 options
    { name: "Color", values: ["Black", "White"] }
  ],

  variants: [           // generated from options
    {
      id: "",
      title: "Black / M",
      sku: "",
      price: 0,
      stock: 0,
      image: "",
      option1: "Black",
      option2: "M",
      option3: ""
    }
  ],

  status: "active",     // active | draft | archived

  createdAt: null,

  updatedAt: null
}
```

Important:

`minPrice`, `maxPrice`, `totalStock` are NOT stored in Firestore.
They are computed client-side by `normalize()` in `services/products.js`:

```js
function normalize(product) {
  const variants = product.variants || []
  const prices = variants.map(v => v.price || 0).filter(Boolean)
  const stock = variants.reduce((sum, v) => sum + (v.stock || 0), 0)
  return {
    ...product,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    totalStock: stock,
  }
}
```

Query patterns:

```js
// Products list: single orderBy + client filter
query(COL, orderBy('createdAt', 'desc'), limit(pageLimit))
// then filter by status/collectionId client-side

// By handle: where only
query(COL, where('handle', '==', handle))

// By collection: where only, sort by createdAt.seconds client-side
query(COL, where('collectionId', '==', collectionId))
// then .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))

// Search: fetch active with limit, filter client-side by title/description/tags
query(COL, where('status', '==', 'active'), limit(200))
```

---

# customers

Document ID: Firebase Auth UID (registered customers) or Firestore auto-ID (guest orders)

```js
{
  id: "",

  name: "",

  email: "",            // populated for registered customers, empty for guests

  whatsapp: "",

  totalOrders: 0,

  totalSpent: 0,

  lastOrderDate: null,

  createdAt: null,

  updatedAt: null
}
```

Customers are upserted automatically when an order is placed.

Registered customers are created in Firebase Auth + this collection simultaneously.

---

# addresses

```js
{
  id: "",

  customerId: "",       // Firebase Auth UID of the customer

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
// Fetch customer addresses, default first
query(COL, where('customerId', '==', customerId), orderBy('isDefault', 'desc'))
```

When setting a new default: clear the old default first, then set the new one.

---

# orders

```js
{
  id: "",

  orderNumber: "",      // e.g. ORD-20240101-XXXX

  customerId: "",

  customerName: "",

  customerWhatsapp: "",

  notes: "",

  items: [
    {
      productId: "",
      productTitle: "",
      variantTitle: "",
      quantity: 1,
      price: 120000,
      subtotal: 120000
    }
  ],

  totalItems: 0,

  totalAmount: 0,

  status: "new",        // new | contacted | paid | shipped | completed | cancelled

  createdAt: null,

  updatedAt: null
}
```

Statuses (in order):

```txt
new        — order just placed via WhatsApp
contacted  — admin has contacted the customer
paid       — customer has paid
shipped    — order has been shipped
completed  — order delivered and done
cancelled  — order cancelled
```

Query patterns:

```js
// List all: single orderBy
query(COL, orderBy('createdAt', 'desc'), limit(pageLimit))

// By customer: where only, sort client-side
query(COL, where('customerId', '==', customerId))
// then .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
```

---

# pages

Document ID = slug (fixed set):

```txt
about-us
contact-us
how-to-buy
faq
```

```js
{
  title: "",

  content: "",          // HTML string from rich text editor

  updatedAt: null
}
```

These documents are pre-created by the seed script and edited via `/admin/pages`.

---

# files

Media library records (mirrors Cloudinary).

```js
{
  id: "",

  url: "",              // Cloudinary secure_url

  publicId: "",         // Cloudinary public_id (for deletion)

  name: "",

  size: 0,              // bytes

  format: "",           // jpg, png, webp, etc.

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

Do NOT calculate analytics from all orders on every page load.

For MVP: query orders with simple filters and compute totals client-side in the dashboard.

Future: use a separate `analytics` collection (denormalized summary document) updated via Cloud Functions when order status changes.

Future document structure:

```js
// analytics/summary
{
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  monthlyRevenue: 0,
  monthlyOrders: 0,
  updatedAt: null
}
```
