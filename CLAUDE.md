# CLAUDE.md

# Project: NextCommerce — Online Store Generator

## Project Goal

Multi-tenant SaaS platform to generate Shopify-inspired online stores for Indonesian SMEs.

Each tenant gets their own branded store at `/{slug}` with a full admin panel at `/admin`.

The system is NOT a marketplace. Each store is a catalog + WhatsApp ordering system.

Requirements:

* Simple
* Fast
* Mobile-first
* SEO-friendly
* Easy to maintain
* Low Firestore cost
* WhatsApp-based ordering

---

# Tech Stack

## Frontend

* Next.js 15+
* App Router
* JavaScript (NO TypeScript)
* Tailwind CSS v4

## Backend

* Firebase Authentication — 3 separate instances (superadmin / admin / customer)
* Firestore — multi-tenant data model
* Cloudinary — image & media upload (NOT Firebase Storage)

## Hosting

* Vercel

---

# Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

# Important Rules

## Use JavaScript Only

DO NOT use TypeScript. Never generate `interface`, `type`, or generic syntax.

---

## Keep Everything Simple

Avoid: complex architecture, over-engineering, unnecessary abstractions, enterprise patterns.

Prefer: readable code, small reusable components, simple Firestore queries.

---

## Mobile First

All pages must be mobile friendly. Mobile experience is more important than desktop.

---

## SEO Friendly

Frontend pages must support Metadata API, dynamic title/description, Open Graph tags.

---

## All Store Pages Must Be Client Components

Firebase client SDK does NOT work in Next.js Server Components.

All store pages (`app/[tenant]/...`) MUST have `'use client'` and load data via `useEffect`.

---

## Firestore Query Rules

Avoid composite indexes. Use single `orderBy` then filter client-side.

For `where()` without `orderBy`, sort by `createdAt.seconds` client-side after fetching.

---

# Authentication Architecture

Three completely independent Firebase Auth sessions (separate app instances in `lib/firebase.js`):

| Instance | Firebase App | Context | Firestore check | Portal |
|---|---|---|---|---|
| `auth` | `[DEFAULT]` | `SuperAdminContext` | `users/{uid}.role === 'superadmin'` | `/superadmin` |
| `storeAuth` | `'store'` | `AuthContext` | `users/{uid}.role === 'admin'` | `/admin` |
| `customerAuth` | `'customer'` | `CustomerAuthContext` | `tenants/{tid}/customers/{uid}` | `/{slug}/account` |

All three can be active in the same browser simultaneously without conflict.

## Login Pages

| URL | Role | Context used |
|---|---|---|
| `/login` | Superadmin | `useSuperAdmin()` |
| `/admin/login` | Admin toko | `useAuth()` |
| `/{slug}/account/login` | Customer | `useCustomerAuth()` |

---

# Application Routes

## Superadmin (`/login` → `/superadmin`)

```txt
/login             — Superadmin login
/superadmin        — Tenant management dashboard
```

## Admin Toko (`/admin/login` → `/admin`)

```txt
/admin/login       — Admin toko login
/admin             — Dashboard (analytics)
/admin/orders
/admin/orders/[id]
/admin/products
/admin/products/new
/admin/products/[id]
/admin/collections
/admin/collections/new
/admin/collections/[id]
/admin/customers
/admin/customers/[id]
/admin/pages       — CMS pages editor
/admin/files       — Cloudinary media library
/admin/theme       — Theme customizer
/admin/settings    — Store settings
```

## Store Publik (`/{slug}/...`)

```txt
/{slug}                    — Home
/{slug}/collections        — All collections
/{slug}/collections/[handle]
/{slug}/products/[handle]
/{slug}/cart
/{slug}/about-us
/{slug}/contact-us
/{slug}/how-to-buy
/{slug}/faq
/{slug}/account            — Customer profile
/{slug}/account/login
/{slug}/account/register
/{slug}/account/orders
/{slug}/account/addresses
```

---

# Folder Structure

```txt
app/
├── [tenant]/
│   ├── layout.js            — TenantLayout (async, reads slug param)
│   ├── TenantStoreShell.js  — TenantProvider > CartProvider > SettingsProvider > CustomerAuthProvider > ThemeProvider > Header/Footer
│   ├── page.js              — Home
│   ├── collections/
│   │   ├── page.js
│   │   └── [handle]/page.js
│   ├── products/
│   │   └── [handle]/
│   │       ├── page.js
│   │       └── ProductDetailClient.js
│   ├── cart/page.js
│   ├── account/
│   │   ├── page.js
│   │   ├── login/page.js
│   │   ├── register/page.js
│   │   ├── orders/page.js
│   │   └── addresses/page.js
│   ├── about-us/page.js
│   ├── contact-us/page.js
│   ├── how-to-buy/page.js
│   └── faq/page.js
├── admin/
│   ├── login/page.js        — Admin toko login (standalone, no AdminLayout)
│   ├── page.js
│   ├── orders/
│   ├── products/
│   ├── collections/
│   ├── customers/
│   ├── pages/
│   ├── files/page.js
│   ├── theme/page.js
│   └── settings/page.js
├── superadmin/
│   └── page.js              — Tenant list + create tenant
├── login/page.js            — Superadmin login
├── layout.js                — Root: SuperAdminProvider > AuthProvider > Toaster
└── globals.css

components/
├── ui/
│   ├── Button.js
│   ├── Input.js
│   ├── Textarea.js
│   ├── Select.js
│   ├── Modal.js
│   ├── LoadingSpinner.js
│   ├── EmptyState.js
│   └── Pagination.js
├── store/
│   ├── Header.js
│   ├── Footer.js
│   ├── ProductCard.js
│   ├── ProductGallery.js
│   ├── ProductVariantSelector.js
│   ├── CartItem.js
│   ├── AccountLayout.js
│   ├── WhatsAppOrderButton.js
│   └── FaviconSync.js
└── admin/
    ├── AdminLayout.js       — Protects /admin, redirects to /admin/login
    ├── Sidebar.js
    ├── DashboardCard.js
    ├── DataTable.js
    ├── MediaPicker.js
    ├── RichTextEditor.js
    ├── products/
    │   ├── ProductForm.js
    │   ├── ImageUploader.js
    │   ├── VariantGenerator.js
    │   └── VariantTable.js
    ├── collections/
    │   └── CollectionForm.js
    ├── orders/
    │   ├── OrderStatusBadge.js
    │   └── OrderDetailCard.js
    └── customers/
        └── CustomerCard.js

lib/
├── firebase.js              — 3 Firebase app instances: auth (superadmin), storeAuth (admin), customerAuth (customer)
├── firestore.js             — Firestore re-exports
├── helpers.js               — slugify, formatCurrency, formatDate, generateOrderNumber, generateVariantCombinations, buildWhatsAppMessage
├── cloudinary.js            — uploadImage() via Cloudinary REST API
└── theme.js                 — THEME_PRESETS, DEFAULT_THEME, applyThemeVars()

services/
├── products.js              — CRUD scoped to tenant path
├── collections.js           — CRUD scoped to tenant path
├── orders.js                — CRUD scoped to tenant path
├── customers.js             — CRUD scoped to tenant path
├── settings.js              — getSettings, saveSettings (tenant-scoped)
├── pages.js                 — getPage, savePage (tenant-scoped)
├── addresses.js             — getAddresses, addAddress, updateAddress, deleteAddress (tenant-scoped)
├── files.js                 — getFiles, addFile, deleteFile (tenant-scoped)
├── tenants.js               — getTenants, getTenantBySlug (superadmin)
└── users.js                 — admin user management

contexts/
├── SuperAdminContext.js     — Firebase auth (primary), superadmin only (useSuperAdmin hook)
├── AuthContext.js           — Firebase storeAuth (secondary), admin toko only (useAuth hook)
├── CustomerAuthContext.js   — Firebase customerAuth (tertiary), customer only (useCustomerAuth hook)
├── TenantContext.js         — Tenant data (slug → tenantId + settings) (useTenant hook)
├── SettingsContext.js       — Store settings from Firestore (useSettings hook)
└── ThemeContext.js          — CSS variable theme (useTheme hook)

store/
└── cartStore.js             — Cart reducer + CartProvider + useCart (localStorage, keyed by slug)

constants/
└── index.js                 — ORDER_STATUSES, PRODUCT_STATUSES, COLLECTION_STATUSES, ADMIN_NAV, PAGE_SLUGS, ITEMS_PER_PAGE
```

---

# Multi-Tenant Data Model

All store data lives under `tenants/{tenantId}/` subcollections.

```txt
tenants/{tenantId}/
├── settings        (singleton doc: store)
├── collections/
├── products/
├── orders/
├── customers/
├── addresses/
├── pages/
└── files/
```

Top-level collections (not tenant-scoped):

```txt
users/              — admin + superadmin accounts (role field)
tenants/            — tenant metadata (slug, name, plan, status)
```

---

# Data Structures

## Tenant

```js
// tenants/{tenantId}
{
  name: "",
  slug: "",           // URL path: /{slug}
  plan: "free",       // free | pro | enterprise
  status: "active",   // active | inactive | suspended
  ownerName: "",
  email: "",
  whatsapp: "",
  createdAt: null,
  updatedAt: null
}
```

## User (Admin / Superadmin)

```js
// users/{uid}
{
  name: "",
  email: "",
  role: "admin",      // admin | superadmin
  tenantId: "",       // null for superadmin
  createdAt: null
}
```

## Settings

```js
// tenants/{tenantId}/settings/store
{
  storeName: "",
  logo: "",           // Cloudinary URL
  favicon: "",        // Cloudinary URL
  whatsappNumber: "", // format: 628xxxxxxxxxx
  email: "",
  phone: "",
  address: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  theme: {
    template: "urban-fashion",
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

## Collection

```js
// tenants/{tenantId}/collections/{id}
{
  id: "",
  title: "",
  handle: "",
  description: "",
  image: "",          // Cloudinary URL
  status: "active",   // active | draft
  productCount: 0,
  createdAt: null,
  updatedAt: null
}
```

## Product

```js
// tenants/{tenantId}/products/{id}
{
  id: "",
  title: "",
  handle: "",
  description: "",
  featuredImage: "",  // Cloudinary URL
  images: [],
  tags: [],
  collectionId: "",
  collectionTitle: "",
  options: [],        // max 3: [{ name, values }]
  variants: [],
  status: "active",   // active | draft | archived
  createdAt: null,
  updatedAt: null
}
// minPrice, maxPrice, totalStock computed client-side by normalize() in services/products.js
```

## Product Variant

```js
{
  id: "",
  title: "Black / XL",
  sku: "",
  price: 0,
  stock: 0,
  image: "",
  option1: "", option2: "", option3: ""
}
```

## Customer

```js
// tenants/{tenantId}/customers/{uid}
{
  id: "",
  name: "",
  email: "",
  whatsapp: "",
  totalOrders: 0,
  totalSpent: 0,
  lastOrderDate: null,
  createdAt: null,
  updatedAt: null
}
```

## Order

```js
// tenants/{tenantId}/orders/{id}
{
  id: "",
  orderNumber: "",    // ORD-YYYYMMDD-XXXX
  customerId: "",
  customerName: "",
  customerWhatsapp: "",
  notes: "",
  items: [{ productId, productTitle, variantTitle, price, quantity, subtotal }],
  totalItems: 0,
  totalAmount: 0,
  status: "new",      // new | contacted | paid | shipped | completed | cancelled
  createdAt: null,
  updatedAt: null
}
```

## Address

```js
// tenants/{tenantId}/addresses/{id}
{
  id: "",
  customerId: "",
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

## Page (CMS)

```js
// tenants/{tenantId}/pages/{slug}
// slug: about-us | contact-us | how-to-buy | faq
{
  title: "",
  content: "",        // HTML from rich text editor
  updatedAt: null
}
```

## File (Media Library)

```js
// tenants/{tenantId}/files/{id}
{
  id: "",
  url: "",            // Cloudinary secure_url
  publicId: "",       // Cloudinary public_id
  name: "",
  size: 0,
  format: "",
  width: 0,
  height: 0,
  createdAt: null
}
```

---

# Provider / Context Tree

```txt
Root Layout (app/layout.js)
└── SuperAdminProvider   — primary auth (superadmin)
    └── AuthProvider     — storeAuth (admin toko)
        └── Toaster

Store Shell (app/[tenant]/TenantStoreShell.js)
└── TenantProvider        — resolves slug → tenantId
    └── CartProvider      — cart state (localStorage, keyed by slug)
        └── SettingsProvider   — fetches tenants/{tid}/settings/store
            └── CustomerAuthProvider (tenantId)  — customerAuth
                └── ThemeProvider   — applies CSS variables
                    └── FaviconSync
                        └── Header / main / Footer
```

---

# Theme System

Two templates, each with 5 color presets. Stored in tenant settings doc.

## Templates

**Urban Fashion** — editorial, minimal, sharp edges, serif headings.
Components: `UrbanFashionHeader`, `Footer`, `ProductCard`

**Happy Hobby** — fun, colorful, rounded, playful.
Components: `HappyHobbyHeader`, `HappyHobbyFooter`, `HappyHobbyProductCard`

## CSS Variables

```css
--color-primary / --color-primary-fg / --color-accent
--color-bg / --color-surface / --color-text
--tm-radius / --tm-radius-sm / --tm-radius-lg / --tm-radius-pill
--tm-card-shadow / --tm-card-hover-shadow
```

Theme is cached per-slug in `localStorage['store_theme_{slug}']` and applied via inline `<script>` in `app/layout.js` before React hydrates (prevents flash).

---

# WhatsApp Ordering System

No checkout. No payment gateway. No shipping.

```txt
Product → Add To Cart → Cart → Fill Name+WhatsApp → Create Order (Firestore) → Upsert Customer → Redirect to wa.me
```

---

# Image Upload (Cloudinary)

All uploads via `lib/cloudinary.js → uploadImage(file, folder)`.

Returns `{ url, publicId, name, size, format, width, height }`.

After upload, save record to `tenants/{tenantId}/files` via `services/files.js`.

---

# Superadmin Panel

URL: `/superadmin` (protected by `SuperAdminContext`)

Features:
* View all tenants (name, slug, plan, status, created date)
* Create new tenant (triggers `/api/create-tenant` which creates Firebase Auth user + Firestore user doc + tenant doc)
* Stats: total stores, active stores, pro plan count

---

# Admin Features Summary

| Module | Features |
|---|---|
| Dashboard | Revenue, Orders, Products, Customers KPIs + top products |
| Products | CRUD, Cloudinary images, variant generator, collection assign, search |
| Collections | CRUD, Cloudinary image |
| Orders | List, detail, 6-status update, search, filter |
| Customers | List, detail, order history |
| Pages | Rich text editor for 4 CMS pages |
| Files | Cloudinary media library (upload, browse, delete) |
| Theme | Template picker + color presets + live preview |
| Settings | Store info, logo, favicon, WhatsApp, social links |

---

# Performance Rules

* Minimize Firestore reads
* Paginate lists, use query limits
* Client-side filter to avoid composite indexes
* Never load entire collections unnecessarily

---

# Out Of Scope

Do NOT implement: Payment Gateway, Checkout, Shipping, Wishlist, Reviews, Blog, Multi-Vendor, Multi-Language, Affiliate, Subscription.
