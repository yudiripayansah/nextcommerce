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
* JavaScript
* Tailwind CSS

## Backend

* Firebase Authentication
* Firestore
* Firebase Storage

## Hosting

* Vercel

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

# Application Structure

## Public Store

Routes:

```txt
/
```

Home Page

```txt
/collections
```

Collection List

```txt
/collections/[handle]
```

Collection Detail

```txt
/products/[handle]
```

Product Detail

```txt
/cart
```

Shopping Cart

```txt
/about-us
```

About Us

```txt
/contact-us
```

Contact Us

```txt
/how-to-buy
```

How To Buy

```txt
/faq
```

FAQ

---

## Admin

Protected Routes

```txt
/admin
```

Dashboard

```txt
/admin/orders
```

Orders

```txt
/admin/products
```

Products

```txt
/admin/collections
```

Collections

```txt
/admin/customers
```

Customers

```txt
/admin/pages
```

Pages

```txt
/admin/settings
```

Settings

---

# Folder Structure

```txt
src/

├── app/
│
├── components/
│
│   ├── ui/
│   ├── store/
│   ├── admin/
│
├── lib/
│
│   ├── firebase.js
│   ├── firestore.js
│   ├── helpers.js
│
├── services/
│
│   ├── products.js
│   ├── collections.js
│   ├── orders.js
│   ├── customers.js
│
├── hooks/
│
├── contexts/
│
├── store/
│
├── styles/
│
└── constants/
```

---

# Firestore Collections

```txt
settings
products
collections
orders
customers
pages
```

---

# Product Data Structure

```js
{
  id: "",

  title: "",

  handle: "",

  description: "",

  featuredImage: "",

  images: [],

  tags: [],

  collectionId: "",

  options: [],

  variants: [],

  status: "active",

  createdAt: null,

  updatedAt: null
}
```

---

# Product Option

Maximum 3 options.

Example:

```txt
Color
Size
Material
```

Structure:

```js
{
  name: "",
  values: []
}
```

---

# Product Variant

```js
{
  id: "",

  title: "",

  sku: "",

  price: 0,

  stock: 0,

  image: "",

  option1: "",

  option2: "",

  option3: ""
}
```

Example:

```txt
Black / XL
White / L
Red / M
```

---

# Collection Structure

```js
{
  id: "",

  title: "",

  handle: "",

  description: "",

  image: "",

  status: "active",

  createdAt: null,

  updatedAt: null
}
```

---

# Customer Structure

```js
{
  id: "",

  name: "",

  whatsapp: "",

  totalOrders: 0,

  totalSpent: 0,

  createdAt: null
}
```

---

# Order Structure

```js
{
  id: "",

  orderNumber: "",

  customerName: "",

  customerWhatsapp: "",

  notes: "",

  items: [],

  totalItems: 0,

  totalAmount: 0,

  status: "new",

  createdAt: null,

  updatedAt: null
}
```

---

# Order Item

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

# Page Structure

```js
{
  id: "",

  slug: "",

  title: "",

  content: "",

  updatedAt: null
}
```

---

# Settings Structure

```js
{
  storeName: "",

  logo: "",

  favicon: "",

  whatsappNumber: "",

  email: "",

  phone: "",

  address: "",

  facebook: "",

  instagram: "",

  tiktok: ""
}
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
Create Order
↓
Save To Firestore
↓
Redirect To WhatsApp
```

---

# WhatsApp Message Format

```txt
Halo, saya ingin memesan produk berikut:

{PRODUCTS}

Total Item: {TOTAL_ITEMS}

Nama:
Alamat:

Terima kasih.
```

Generate automatically.

Use:

```js
https://wa.me/{number}?text={message}
```

---

# Dashboard Requirements

Dashboard must be useful and lightweight.

Display:

## Sales

* Total Revenue
* Monthly Revenue

## Orders

* Total Orders
* New Orders
* Completed Orders

## Products

* Total Products
* Out Of Stock Products

## Customers

* Total Customers

## Analytics

* Sales Chart
* Orders Chart
* Top Products
* Top Collections

---

# Admin Product Features

Must support:

* Create Product
* Edit Product
* Delete Product
* Search Product
* Filter Product
* Product Images Upload
* Variant Generator
* Collection Assignment

---

# Admin Collection Features

Must support:

* Create Collection
* Edit Collection
* Delete Collection

---

# Admin Order Features

Must support:

* View Orders
* Update Status
* Search Orders
* Filter Orders

Statuses:

```txt
new
contacted
paid
shipped
completed
cancelled
```

---

# Admin Customer Features

Must support:

* Customer List
* Customer Detail
* Order History

Customers are generated automatically from orders.

---

# Admin Pages Features

Editable Pages:

* About Us
* Contact Us
* How To Buy
* FAQ

Use simple rich text editor.

---

# Admin Settings Features

Store Information:

* Store Name
* Logo
* Favicon
* WhatsApp Number
* Email
* Phone
* Address
* Social Media Links

---

# UI Guidelines

Style inspiration:

* Shopify
* Tokopedia
* Nike

Requirements:

* Clean
* Minimal
* Fast
* Professional

Avoid:

* Fancy animations
* Heavy libraries
* Complex UI

---

# Performance Requirements

Minimize Firestore reads.

Use:

* Pagination
* Query limits
* Cached requests where possible

Never load entire collections unnecessarily.

---

# Development Order

Build in this exact order:

Phase 1

* Firebase Setup
* Authentication
* Admin Layout

Phase 2

* Collections CRUD

Phase 3

* Products CRUD

Phase 4

* Product Variants

Phase 5

* Store Frontend

Phase 6

* Cart System

Phase 7

* WhatsApp Ordering

Phase 8

* Orders Module

Phase 9

* Customers Module

Phase 10

* Dashboard Analytics

Phase 11

* SEO Optimization

---

# Out Of Scope

Do NOT implement:

* Payment Gateway
* Checkout
* Shipping Integration
* Wishlist
* Reviews
* Blog
* Multi Vendor
* Multi Store
* Multi Language
* Affiliate System
* Subscription System

Only implement features explicitly described in this document.
