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
* Large arrays

Use flat structures whenever possible.

---

# Collections

```txt
settings
products
collections
orders
customers
pages
```

---

# settings

Document ID:

```txt
store
```

Structure:

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

  tiktok: "",

  createdAt: null,

  updatedAt: null
}
```

---

# collections

```js
{
  id: "",

  title: "",

  handle: "",

  description: "",

  image: "",

  status: "active",

  productCount: 0,

  createdAt: null,

  updatedAt: null
}
```

Indexes:

```txt
status + createdAt
handle
```

---

# products

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

  collectionTitle: "",

  minPrice: 0,

  maxPrice: 0,

  totalStock: 0,

  options: [],

  variants: [],

  status: "active",

  createdAt: null,

  updatedAt: null
}
```

Indexes:

```txt
status + createdAt
collectionId + status
handle
```

---

# Product Options

```js
[
  {
    name: "Color",
    values: ["Black", "White"]
  }
]
```

---

# Product Variants

```js
[
  {
    id: "",

    title: "Black / XL",

    sku: "",

    price: 120000,

    stock: 10,

    image: "",

    option1: "Black",

    option2: "XL",

    option3: ""
  }
]
```

---

# customers

```js
{
  id: "",

  name: "",

  whatsapp: "",

  totalOrders: 0,

  totalSpent: 0,

  lastOrderDate: null,

  createdAt: null
}
```

Indexes:

```txt
whatsapp
createdAt
```

---

# orders

```js
{
  id: "",

  orderNumber: "",

  customerId: "",

  customerName: "",

  customerWhatsapp: "",

  notes: "",

  totalItems: 0,

  totalAmount: 0,

  status: "new",

  items: [],

  createdAt: null,

  updatedAt: null
}
```

Indexes:

```txt
status + createdAt
customerId + createdAt
orderNumber
```

---

# Order Items

```js
[
  {
    productId: "",

    productTitle: "",

    variantTitle: "",

    quantity: 1,

    price: 120000,

    subtotal: 120000
  }
]
```

---

# pages

Document IDs:

```txt
about-us
contact-us
how-to-buy
faq
```

Structure:

```js
{
  title: "",

  content: "",

  updatedAt: null
}
```

---

# Analytics Strategy

Do NOT calculate analytics from all orders every page load.

Store summary values.

Future collection:

```txt
analytics
```

Document:

```js
{
  totalRevenue: 0,

  totalOrders: 0,

  totalCustomers: 0,

  monthlyRevenue: 0,

  monthlyOrders: 0
}
```

Use Cloud Functions later if needed.

For MVP, simple queries are acceptable.
