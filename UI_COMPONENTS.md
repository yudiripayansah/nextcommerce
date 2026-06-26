# UI_COMPONENTS.md

# Design Principles

Reference: editorial fashion minimal, inspired by my.therestyletrait.com

Also inspired by:

* Shopify Admin (admin UI)
* Tokopedia (product grid)
* Nike (typography, whitespace)

Goals:

* Clean
* Fast
* Minimal
* Mobile First

Avoid:

* Fancy animations
* Heavy UI libraries
* Complex interactions

---

# Store Design Tokens

Typography:

* Body: Inter (sans-serif)
* Headings: Playfair Display (serif) — via CSS `@import` in `globals.css`

Colors (CSS variables, set by ThemeContext):

```css
--color-primary     /* button bg, key accents */
--color-primary-fg  /* text on primary bg */
--color-accent      /* secondary accent */
--color-bg          /* page background */
--color-surface     /* card / section background */
--color-text        /* body text */
```

Default theme: black (`#000000`) on white (`#ffffff`).

---

# Shared UI Components

## Button

Path: `components/ui/Button.js`

Variants:

```txt
primary    — filled, uses --color-primary
secondary  — gray
outline    — border only
danger     — red
success    — green
```

Props:

```js
{ children, onClick, disabled, loading, variant, type, className }
```

---

## Input

Path: `components/ui/Input.js`

Props:

```js
{ label, placeholder, value, onChange, error, type, required, ...rest }
```

---

## Textarea

Path: `components/ui/Textarea.js`

Props:

```js
{ label, placeholder, value, onChange, error, rows, ...rest }
```

---

## Select

Path: `components/ui/Select.js`

Props:

```js
{ label, value, onChange, options, error, ...rest }
// options: [{ value, label }]
```

---

## Modal

Path: `components/ui/Modal.js`

Reusable confirmation/content modal.

Props:

```js
{ open, onClose, title, children }
```

---

## LoadingSpinner

Path: `components/ui/LoadingSpinner.js`

Inline or full-page spinner.

---

## EmptyState

Path: `components/ui/EmptyState.js`

Shown when a list has no data.

Props:

```js
{ title, description, action }
```

---

## Pagination

Path: `components/ui/Pagination.js`

Props:

```js
{ page, totalPages, onChange }
```

Used in: Products, Orders, Customers lists.

---

# Admin Components

## AdminLayout

Path: `components/admin/AdminLayout.js`

Wraps all `/admin/*` pages.

Contains:

* Sidebar (collapsible on mobile)
* Top header bar
* Main content area

Redirects unauthenticated users to `/login`.

---

## Sidebar

Path: `components/admin/Sidebar.js`

Navigation items (from `constants/index.js` `ADMIN_NAV`):

```txt
Dashboard      /admin
Pesanan        /admin/orders
Produk         /admin/products
Koleksi        /admin/collections
Pelanggan      /admin/customers
Halaman        /admin/pages
Pengaturan     /admin/settings
```

Note: Files and Theme are accessible from Settings or direct URL but not always in primary nav.

---

## DashboardCard

Path: `components/admin/DashboardCard.js`

Display a single KPI metric.

Props:

```js
{ title, value, icon, color }
```

---

## DataTable

Path: `components/admin/DataTable.js`

Reusable table with built-in search, pagination, empty state.

Props:

```js
{ columns, data, loading, searchable, pageSize }
// columns: [{ key, label, render }]
```

Used by: Products, Orders, Customers, Collections pages.

---

## MediaPicker

Path: `components/admin/MediaPicker.js`

Reusable modal for selecting or uploading files from Cloudinary media library.

Props:

```js
{
  open,            // boolean
  onClose,         // () => void
  onSelect,        // (urls: string[] | string) => void
  multiple,        // boolean — allow multi-select (default false)
  initialSelected  // string[] — pre-selected URLs
}
```

Features:

* Drag & drop upload to Cloudinary
* Browse existing files from Firestore `files` collection
* Single or multiple selection
* Delete file from both Cloudinary and Firestore
* Upload progress indicator

---

## RichTextEditor

Path: `components/admin/RichTextEditor.js`

Simple rich text editor for CMS pages.

Props:

```js
{ value, onChange }
```

Used by: `/admin/pages` editor.

---

# Product Admin Components

## ProductForm

Path: `components/admin/products/ProductForm.js`

Full product creation/editing form.

Fields:

* Title (auto-generates handle)
* Description
* Featured Image + additional images (via ImageUploader)
* Collection (dropdown)
* Tags
* Status (active / draft / archived)

Does NOT include variants — those are handled by VariantGenerator + VariantTable.

---

## ImageUploader

Path: `components/admin/products/ImageUploader.js`

Multi-image picker that opens MediaPicker.

Features:

* Open MediaPicker for selection or upload
* Preview selected images
* Remove individual images
* Reorder (drag if needed)

---

## VariantGenerator

Path: `components/admin/products/VariantGenerator.js`

Defines up to 3 product options and generates all variant combinations.

Example:

```txt
Color: Black, White
Size: M, L

Generates:
Black / M
Black / L
White / M
White / L
```

Passes generated variants to VariantTable for editing.

---

## VariantTable

Path: `components/admin/products/VariantTable.js`

Editable table of generated variants.

Columns:

```txt
Variant title
SKU
Price
Stock
Image (optional, per-variant)
```

---

# Collection Admin Components

## CollectionForm

Path: `components/admin/collections/CollectionForm.js`

Fields:

* Title (auto-generates handle)
* Description
* Image (via MediaPicker)
* Status (active / draft)

---

# Order Admin Components

## OrderStatusBadge

Path: `components/admin/orders/OrderStatusBadge.js`

Color-coded status badge.

Statuses:

```txt
new        — blue
contacted  — yellow
paid       — purple
shipped    — indigo
completed  — green
cancelled  — red
```

---

## OrderDetailCard

Path: `components/admin/orders/OrderDetailCard.js`

Displays full order detail.

Contains:

* Order number, date, status
* Customer name + WhatsApp link
* Order items table
* Total amount
* Notes
* Status update dropdown

---

# Customer Admin Components

## CustomerCard

Path: `components/admin/customers/CustomerCard.js`

Summary card for a single customer.

Displays:

* Name
* WhatsApp
* Total Orders
* Total Spending
* Last Order Date

---

# Storefront Components

## Header

Path: `components/store/Header.js`

Structure:

* Announcement bar (black strip, configurable text)
* Centered logo (from settings)
* Navigation left: uppercase collection links
* Icons right: account icon + cart icon with item count badge
* Mobile hamburger menu

Account icon behavior:

* If customer logged in → `/account`
* If guest → `/account/login`

---

## Footer

Path: `components/store/Footer.js`

Columns:

* Brand info (store name, address, WhatsApp link)
* Shop links (collections)
* Info links (About, How to Buy, FAQ, Contact)
* Social media icons (Instagram, Facebook, TikTok)

Bottom bar: copyright + quick links.

---

## ProductCard

Path: `components/store/ProductCard.js`

Used in: Home page, Collection pages, search results.

Layout:

* `aspect-[3/4]` portrait image, `bg-stone-100`
* Hover: scale-105 on image (700ms transition)
* "Habis" badge if `totalStock === 0`
* Uppercase collection label (small, gray)
* Product title
* Price (range if min ≠ max)

---

## ProductGallery

Path: `components/store/ProductGallery.js`

Product detail image display.

Features:

* Large featured image
* Thumbnail strip
* Click thumbnail to switch main image

---

## ProductVariantSelector

Path: `components/store/ProductVariantSelector.js`

Option selectors on product detail page.

Features:

* Renders a selector per option (Color, Size, etc.)
* Matches selected options to a specific variant
* Shows price and stock of matched variant
* Disables "Add to Cart" if out of stock

---

## CartItem

Path: `components/store/CartItem.js`

Single line item in the cart.

Displays:

* Product image
* Product title + variant title
* Unit price
* Quantity controls (+ / -)
* Subtotal
* Remove button

---

## AccountLayout

Path: `components/store/AccountLayout.js`

Layout wrapper for all `/account/*` pages.

Features:

* Sidebar: Akun Saya, Riwayat Pesanan, Buku Alamat
* Redirects to `/account/login` if customer not authenticated
* Logout button

---

## WhatsAppOrderButton

Path: `components/store/WhatsAppOrderButton.js`

Primary CTA on the cart page.

Responsibilities:

* Collect customer name + WhatsApp from form (pre-filled if logged in)
* Validate inputs
* Create order in Firestore
* Upsert customer record
* Generate WhatsApp message via `buildWhatsAppMessage()`
* Redirect to `wa.me` URL
* Clear cart after redirect

---

## FaviconSync

Path: `components/store/FaviconSync.js`

Client component that reads `settings.favicon` from `SettingsContext` and updates `<link rel="icon">` dynamically.

Placed directly inside the store layout, outside the main content tree.

---

# Forms

Use React Hook Form for all admin forms.

All forms must:

* Validate required fields
* Show inline error messages
* Disable submit button while saving
* Prevent duplicate submissions (loading state)

---

# Notifications

Use react-hot-toast.

Patterns:

```js
toast.success('Tersimpan')
toast.error('Terjadi kesalahan')
toast.loading('Menyimpan...')
```

Keep messages short (1–5 words in Indonesian).
