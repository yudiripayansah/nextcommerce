# UI_COMPONENTS.md

# Design Principles

Reference: editorial fashion minimal, inspired by my.therestyletrait.com

Also inspired by: Shopify Admin (admin UI), Tokopedia (product grid), Nike (typography, whitespace).

Goals: Clean · Fast · Minimal · Mobile First

Avoid: fancy animations, heavy UI libraries, complex interactions.

---

# Store Design Tokens

Typography:
- Body: Inter (sans-serif)
- Headings: Playfair Display (serif) — via CSS `@import` in `globals.css`

Colors (CSS variables, set by ThemeContext per tenant):

```css
--color-primary     /* button bg, key accents */
--color-primary-fg  /* text on primary bg */
--color-accent      /* secondary accent */
--color-bg          /* page background */
--color-surface     /* card / section background */
--color-text        /* body text */
```

Structural variables (set by template):

```css
--tm-radius / --tm-radius-sm / --tm-radius-lg / --tm-radius-pill
--tm-card-shadow / --tm-card-hover-shadow
```

Default theme: black (`#000000`) on white (`#ffffff`).

---

# Shared UI Components (`components/ui/`)

## Button

Props: `{ children, onClick, disabled, loading, variant, type, className }`

Variants: `primary` · `secondary` · `outline` · `danger` · `success`

## Input

Props: `{ label, placeholder, value, onChange, error, type, required, ...rest }`

## Textarea

Props: `{ label, placeholder, value, onChange, error, rows, ...rest }`

## Select

Props: `{ label, value, onChange, options, error, ...rest }` — `options: [{ value, label }]`

## Modal

Props: `{ open, onClose, title, children }` — reusable confirmation/content modal.

## LoadingSpinner

Inline or full-page spinner.

## EmptyState

Props: `{ title, description, action }` — shown when a list has no data.

## Pagination

Props: `{ page, totalPages, onChange }` — used in Products, Orders, Customers lists.

---

# Admin Components (`components/admin/`)

## AdminLayout

Path: `components/admin/AdminLayout.js`

Wraps all `/admin/*` pages (imported as a component, not a Next.js layout).

- Reads `useAuth()` from `AuthContext` (storeAuth instance)
- If loading → spinner
- If no `user` → redirect to `/admin/login`
- Contains: collapsible Sidebar (mobile) + top header bar + main content area

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

## DashboardCard

Props: `{ title, value, icon, color }` — single KPI metric.

## DataTable

Props: `{ columns, data, loading, searchable, pageSize }` — `columns: [{ key, label, render }]`

Reusable table with built-in search, pagination, empty state. Used by: Products, Orders, Customers, Collections.

## MediaPicker

Props: `{ open, onClose, onSelect, multiple, initialSelected }`

Reusable modal for selecting/uploading from Cloudinary media library.
- Drag & drop upload
- Browse existing files from Firestore
- Single or multi-select
- Delete from Cloudinary + Firestore

## RichTextEditor

Props: `{ value, onChange }` — simple rich text for CMS pages.

---

# Product Admin Components

## ProductForm (`components/admin/products/ProductForm.js`)

Full create/edit form: Title (auto-generates handle), Description, Images (via ImageUploader), Collection, Tags, Status. Does NOT include variants.

## ImageUploader (`components/admin/products/ImageUploader.js`)

Multi-image picker using MediaPicker. Preview, remove, reorder.

## VariantGenerator (`components/admin/products/VariantGenerator.js`)

Defines up to 3 options → generates all combinations → passes to VariantTable.

## VariantTable (`components/admin/products/VariantTable.js`)

Editable table: Variant title · SKU · Price · Stock · Image (optional).

---

# Collection / Order / Customer Admin Components

## CollectionForm — Title, Description, Image, Status

## OrderStatusBadge — Color-coded: new(blue) contacted(yellow) paid(purple) shipped(indigo) completed(green) cancelled(red)

## OrderDetailCard — Order number, date, status, customer WhatsApp link, items table, total, notes, status update dropdown

## CustomerCard — Name, WhatsApp, Total Orders, Total Spending, Last Order Date

---

# Storefront Components (`components/store/`)

## Header (`components/store/Header.js`)

Two template variants (`useTheme().template`):
- `urban-fashion` → `UrbanFashionHeader`
- `happy-hobby` → `HappyHobbyHeader`

Structure (Urban Fashion):
- Announcement bar (black strip)
- Centered logo (from settings)
- Nav left: uppercase collection links
- Icons right: account icon + cart badge
- Mobile hamburger

Account icon: if `customerUser` logged in → `/{slug}/account`, else → `/{slug}/account/login`

## Footer (`components/store/Footer.js`)

Two template variants. Columns: Brand info · Shop links · Info links · Social icons. Bottom bar: copyright + quick links.

## ProductCard (`components/store/ProductCard.js`)

- `aspect-[3/4]` portrait, `bg-stone-100`
- Hover scale-105 (700ms)
- "Habis" badge if `totalStock === 0`
- Uppercase collection label · title · price range

## ProductGallery (`components/store/ProductGallery.js`)

Product detail image display:
- Desktop: vertical thumbnail strip on LEFT, large main image on right
- Mobile: main image on top, horizontal thumbnail scroll below
- Click thumbnail to switch main image

## ProductVariantSelector (`components/store/ProductVariantSelector.js`)

- One selector per option (Color, Size, etc.)
- Selected: dark filled button with `var(--color-primary)` via inline style
- Unavailable: diagonal strikethrough line, disabled

## CartItem (`components/store/CartItem.js`)

Single cart line item: image · title + variant · unit price · qty controls (+ / -) · subtotal · remove.

## AccountLayout (`components/store/AccountLayout.js`)

Wraps all `/{slug}/account/*` pages.
- Reads `useCustomerAuth()` from `CustomerAuthContext` (customerAuth instance)
- If `!loading && !customerUser` → redirect to `/{slug}/account/login`
- Sidebar: Akun Saya · Riwayat Pesanan · Buku Alamat · Logout

## WhatsAppOrderButton (`components/store/WhatsAppOrderButton.js`)

Cart page CTA:
- Collect name + WhatsApp (pre-filled if logged in)
- Validate → Create order in Firestore → Upsert customer → Generate WhatsApp message → Redirect to `wa.me`
- Clear cart after redirect

## FaviconSync (`components/store/FaviconSync.js`)

Client component — reads `settings.favicon` from `SettingsContext`, updates `<link rel="icon">` dynamically. Placed inside store shell, outside main content tree.

---

# Authentication Pages

## `/login` (Superadmin)

Uses `useSuperAdmin()` from `SuperAdminContext` (primary Firebase `auth`).
Redirects to `/superadmin` on success.
Error `NOT_SUPERADMIN` → "Akun ini bukan akun superadmin."
Footer link: "Admin toko? Login di sini → /admin/login"

## `/admin/login` (Admin Toko)

Uses `useAuth()` from `AuthContext` (Firebase `storeAuth`).
Redirects to `/admin` via `useEffect` watching `user`.
Error `NOT_ADMIN` → "Akun ini bukan akun admin toko."
Footer link: "Superadmin? Login di sini → /login"

## `/{slug}/account/login` (Customer)

Uses `useCustomerAuth()` from `CustomerAuthContext` (Firebase `customerAuth`).
Redirects to `/{slug}/account` via `useEffect` watching `customerUser`.
Error `ADMIN_ACCOUNT` → "Akun ini adalah akun admin."
Link to register page.

## `/{slug}/account/register` (Customer)

Uses `useCustomerAuth().signUp()`.
Creates Firebase Auth user (customerAuth) + Firestore `tenants/{tid}/customers/{uid}` doc.
Redirects to `/{slug}/account` via `useEffect` watching `customerUser`.

---

# Forms

Use React Hook Form for all admin forms.

All forms must:
- Validate required fields
- Show inline error messages
- Disable submit while saving (loading state)
- Prevent duplicate submissions

---

# Notifications

Use react-hot-toast.

```js
toast.success('Tersimpan')
toast.error('Terjadi kesalahan')
toast.loading('Menyimpan...')
```

Keep messages short (1–5 words, Indonesian).
