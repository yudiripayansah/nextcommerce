# CLAUDE.md

# Project: OnlineShop Generator

## Project Goal

Build a simple Shopify-inspired online store generator for Indonesian SMEs.

The application must be:

* Simple
* Fast
* Mobile-first
* SEO-friendly
* Easy to maintain
* Low Firestore cost
* WhatsApp-based ordering

The system is NOT an e-commerce marketplace.

This is a catalog website with cart functionality that forwards orders to WhatsApp.

---

# Tech Stack

## Frontend

* Next.js 15+
* App Router
* JavaScript (NO TypeScript)
* Tailwind CSS v4

## Backend

* Firebase Authentication (admin login + customer login)
* Firestore
* Cloudinary (image & media upload — NOT Firebase Storage)

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

DO NOT use TypeScript.

Never generate:

```ts
interface Product
type Product
```

Use JavaScript only.

---

## Keep Everything Simple

This project targets SMEs.

Avoid:

* Complex architecture
* Over engineering
* Unnecessary abstractions
* Enterprise patterns

Prefer:

* Readable code
* Small reusable components
* Simple Firestore queries

---

## Mobile First

All pages must be mobile friendly.

Mobile experience is more important than desktop.

---

## SEO Friendly

Frontend pages must support:

* Metadata API
* Dynamic title
* Dynamic description
* Open Graph tags

---

## All Store Pages Must Be Client Components

Firebase client SDK does NOT work in Next.js Server Components.

All store pages (`app/(store)/...`) MUST have `'use client'` at the top and load data via `useEffect`.

---

## Firestore Query Rules

Avoid composite indexes.

Use single `orderBy` then filter client-side.

For `where()` queries without `orderBy`, sort by `createdAt.seconds` client-side after fetching.

---

# Application Structure

## Public Store Routes

```txt
/
```

Home Page

```txt
/collections
```

All Collections

```txt
/collections/[handle]
```

Collection Detail with product grid, breadcrumb, filter bar

```txt
/products/[handle]
```

Product Detail

```txt
/cart
```

Shopping Cart + WhatsApp order form

```txt
/about-us
/contact-us
/how-to-buy
/faq
```

CMS-editable content pages

```txt
/account
```

Customer Account (profile)

```txt
/account/login
```

Customer Login

```txt
/account/register
```

Customer Register

```txt
/account/orders
```

Customer Order History

```txt
/account/addresses
```

Customer Saved Addresses

---

## Admin Routes (Protected)

```txt
/admin
```

Dashboard with analytics

```txt
/admin/orders
/admin/orders/[id]
```

Orders list + detail

```txt
/admin/products
/admin/products/new
/admin/products/[id]
```

Products CRUD

```txt
/admin/collections
/admin/collections/new
/admin/collections/[id]
```

Collections CRUD

```txt
/admin/customers
/admin/customers/[id]
```

Customer list + detail

```txt
/admin/pages
```

CMS page editor (about-us, contact-us, how-to-buy, faq)

```txt
/admin/files
```

Media library (Cloudinary uploads)

```txt
/admin/theme
```

Theme customizer (color presets + CSS variables)

```txt
/admin/settings
```

Store settings

---

# Folder Structure

```txt
app/
├── (store)/
│   ├── layout.js            — SettingsProvider > CustomerAuthProvider > ThemeProvider > Header/Footer
│   ├── page.js              — Home
│   ├── collections/
│   │   ├── page.js          — All collections
│   │   └── [handle]/page.js — Collection detail + product grid
│   ├── products/
│   │   └── [handle]/
│   │       ├── page.js
│   │       └── ProductDetailClient.js
│   ├── cart/page.js
│   ├── account/
│   │   ├── page.js          — Profile
│   │   ├── login/page.js
│   │   ├── register/page.js
│   │   ├── orders/page.js
│   │   └── addresses/page.js
│   ├── about-us/page.js
│   ├── contact-us/page.js
│   ├── how-to-buy/page.js
│   └── faq/page.js
├── admin/
│   ├── page.js
│   ├── orders/
│   ├── products/
│   ├── collections/
│   ├── customers/
│   ├── pages/
│   ├── files/page.js
│   ├── theme/page.js
│   └── settings/page.js
├── login/page.js            — Admin login
├── layout.js                — Root: AuthProvider > CartProvider > Toaster
└── globals.css              — Tailwind v4 import + Google Fonts (Inter + Playfair Display)

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
    ├── AdminLayout.js
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
├── firebase.js              — Firebase app init (client SDK)
├── firestore.js             — Firestore re-exports
├── helpers.js               — slugify, formatCurrency, formatDate, generateOrderNumber, generateVariantCombinations, buildWhatsAppMessage
├── cloudinary.js            — uploadImage() via Cloudinary REST API
└── theme.js                 — THEME_PRESETS, DEFAULT_THEME, applyThemeVars()

services/
├── products.js              — getProducts, getProductByHandle, getProductById, getProductsByCollection, searchProducts, createProduct, updateProduct, deleteProduct
├── collections.js           — getCollections, getCollectionByHandle, getCollectionById, createCollection, updateCollection, deleteCollection
├── orders.js                — getOrders, getOrderById, createOrder, updateOrderStatus, getOrdersByCustomer
├── customers.js             — getCustomers, getCustomerById, upsertCustomer, updateCustomer
├── settings.js              — getSettings, saveSettings
├── pages.js                 — getPage, savePage
├── addresses.js             — getAddresses, getDefaultAddress, addAddress, updateAddress, deleteAddress
└── files.js                 — getFiles, addFile, deleteFile

contexts/
├── AuthContext.js           — Admin Firebase Auth (useAuth hook)
├── CustomerAuthContext.js   — Customer Firebase Auth + Firestore profile (useCustomerAuth hook)
├── SettingsContext.js       — Store settings via useEffect (useSettings hook)
└── ThemeContext.js          — CSS variable theme (useTheme hook)

store/
└── cartStore.js             — Cart reducer + CartProvider + useCart hook (localStorage persistence)

constants/
└── index.js                 — ORDER_STATUSES, PRODUCT_STATUSES, COLLECTION_STATUSES, ADMIN_NAV, PAGE_SLUGS, PAGE_TITLES, ITEMS_PER_PAGE

scripts/
├── seed.js                  — Seeds all demo data (settings, collections, products, customers, orders, pages)
└── seed-products.js         — Supplementary product seeder
```

---

# Data Structures

## Settings

Document path: `settings/store`

```js
{
  storeName: "",
  logo: "",
  favicon: "",
  whatsappNumber: "",   // format: 628xxxxxxxxxx (no + or spaces)
  email: "",
  phone: "",
  address: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  theme: {}             // color theme object (see Theme section)
}
```

---

## Collection

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

---

## Product

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
  options: [],          // max 3 options
  variants: [],
  status: "active",     // active | draft | archived
  createdAt: null,
  updatedAt: null
}
```

Note: `minPrice`, `maxPrice`, `totalStock` are NOT stored in Firestore.
They are computed client-side by `normalize()` inside `services/products.js`.

---

## Product Option (max 3)

```js
{
  name: "Color",        // e.g. Color, Size, Material
  values: ["Black", "White"]
}
```

---

## Product Variant

```js
{
  id: "",
  title: "Black / XL",
  sku: "",
  price: 0,
  stock: 0,
  image: "",            // Cloudinary URL (optional, per-variant)
  option1: "Black",
  option2: "XL",
  option3: ""
}
```

---

## Customer

Document ID: Firebase Auth UID (registered) or auto-generated (guest from order)

```js
{
  id: "",
  name: "",
  email: "",            // populated for registered customers
  whatsapp: "",
  totalOrders: 0,
  totalSpent: 0,
  lastOrderDate: null,
  createdAt: null,
  updatedAt: null
}
```

---

## Address

```js
{
  id: "",
  customerId: "",       // Firebase Auth UID
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

---

## Order

```js
{
  id: "",
  orderNumber: "",      // e.g. ORD-20240101-XXXX
  customerId: "",
  customerName: "",
  customerWhatsapp: "",
  notes: "",
  items: [],
  totalItems: 0,
  totalAmount: 0,
  status: "new",        // new | contacted | paid | shipped | completed | cancelled
  createdAt: null,
  updatedAt: null
}
```

---

## Order Item

```js
{
  productId: "",
  productTitle: "",
  variantTitle: "",
  price: 0,
  quantity: 0,
  subtotal: 0
}
```

---

## Page (CMS)

Document ID = slug (`about-us`, `contact-us`, `how-to-buy`, `faq`)

```js
{
  title: "",
  content: "",          // HTML from rich text editor
  updatedAt: null
}
```

---

## File (Media Library)

```js
{
  id: "",
  url: "",              // Cloudinary secure_url
  publicId: "",         // Cloudinary public_id
  name: "",
  size: 0,              // bytes
  format: "",           // jpg, png, webp, etc.
  width: 0,
  height: 0,
  createdAt: null
}
```

---

# Theme System

Store colors are stored in `settings/store.theme` and applied as CSS custom properties.

CSS variables:

```css
--color-primary
--color-primary-fg
--color-accent
--color-bg
--color-surface
--color-text
```

Default preset: Urban Fashion (black/white).

All presets are in `lib/theme.js`: Urban Fashion, Ocean Breeze, Rose Gold, Forest Sage, Sunset Warm.

Theme is cached in `localStorage` and applied via inline `<script>` in `app/layout.js` to prevent flash on load.

---

# Provider / Context Tree

```txt
Root Layout (app/layout.js)
└── AuthProvider          — Admin Firebase Auth
    └── CartProvider      — Cart state (localStorage persistence)
        └── Toaster       — react-hot-toast

Store Layout (app/(store)/layout.js)
└── SettingsProvider      — Fetches settings/store from Firestore once
    └── CustomerAuthProvider — Customer Firebase Auth + Firestore profile
        └── ThemeProvider — Applies CSS variables from settings.theme
            └── FaviconSync — Updates browser favicon from settings.favicon
                └── Header / main / Footer
```

---

# WhatsApp Ordering System

There is NO checkout system.

There is NO payment gateway.

There is NO shipping integration.

Order flow:

```txt
Product
↓
Add To Cart
↓
Cart
↓
Fill Name + WhatsApp
↓
Create Order (Firestore)
↓
Upsert Customer (Firestore)
↓
Redirect To WhatsApp
```

WhatsApp message format:

```txt
Halo, saya ingin memesan produk berikut:

{PRODUCTS}

Total Item: {TOTAL_ITEMS}

Nama:
Alamat:

Terima kasih.
```

WhatsApp URL:

```js
`https://wa.me/${number}?text=${encodeURIComponent(message)}`
```

---

# Image Upload (Cloudinary)

All image uploads use Cloudinary, NOT Firebase Storage.

Upload via `lib/cloudinary.js`:

```js
uploadImage(file, folder = 'media')
// returns { url, publicId, name, size, format, width, height }
```

After upload, save file record to Firestore `files` collection via `services/files.js`.

MediaPicker component (`components/admin/MediaPicker.js`) provides reusable file browsing and upload UI for all admin forms.

---

# Store UI Style

Reference design: editorial fashion minimal (my.therestyletrait.com)

Key design decisions:

* Fonts: Inter (body) + Playfair Display (serif headings) via CSS `@import` in `globals.css`
* Hero: 85vh full-bleed image with dark overlay, serif heading
* Collection grid: 4-column, `aspect-[3/4]` portrait, `bg-stone-100`, no gap between cells
* Product cards: hover scale, "Habis" sold-out badge, uppercase collection label
* Collection/product list pages: breadcrumb → uppercase h1 → divider → filter bar → grid
* Filter bar: "Filter & Sort" icon (left), in-stock checkbox (right)
* Announcement bar: black strip above header

---

# Admin Features Summary

| Module    | Features                                                                  |
|-----------|---------------------------------------------------------------------------|
| Dashboard | Revenue, Orders, Products, Customers KPIs + charts + top products         |
| Products  | CRUD, Cloudinary image upload, variant generator, collection assign, search|
| Collections | CRUD, Cloudinary image upload                                           |
| Orders    | List, detail, status update (6 statuses), search, filter                  |
| Customers | List, detail, order history                                               |
| Pages     | Rich text editor for 4 CMS pages                                          |
| Files     | Cloudinary media library (upload, browse, delete)                         |
| Theme     | Color preset picker + live preview                                        |
| Settings  | Store info, logo, favicon, WhatsApp number, social links                  |

---

# Performance Rules

Minimize Firestore reads.

Use:

* Pagination
* Query limits (`pageLimit` param on `getProducts`)
* Client-side filtering instead of composite index queries

Never load entire collections unnecessarily.

---

# Out Of Scope

Do NOT implement:

* Payment Gateway
* Checkout / Shipping Integration
* Wishlist / Reviews / Blog
* Multi Vendor / Multi Store
* Multi Language
* Affiliate / Subscription System

Only implement features explicitly described in this document.
