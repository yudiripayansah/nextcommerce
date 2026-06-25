# UI_COMPONENTS.md

# Design Principles

Inspired by:

* Shopify Admin
* Shopify Storefront
* Tokopedia
* Nike

Goals:

* Clean
* Fast
* Minimal
* Mobile First

Avoid:

* Fancy animation
* Heavy UI libraries
* Complex interactions

---

# Shared Components

## Button

Path:

```txt
components/ui/Button.js
```

Variants:

```txt
primary
secondary
outline
danger
success
```

Props:

```js
{
  children,
  onClick,
  disabled,
  loading,
  variant
}
```

---

## Input

Path:

```txt
components/ui/Input.js
```

Props:

```js
{
  label,
  placeholder,
  value,
  onChange,
  error
}
```

---

## Textarea

Path:

```txt
components/ui/Textarea.js
```

---

## Select

Path:

```txt
components/ui/Select.js
```

---

## Modal

Path:

```txt
components/ui/Modal.js
```

Reusable confirmation modal.

---

## LoadingSpinner

Path:

```txt
components/ui/LoadingSpinner.js
```

---

## EmptyState

Path:

```txt
components/ui/EmptyState.js
```

Display when data not found.

---

## Pagination

Path:

```txt
components/ui/Pagination.js
```

Reusable for:

* Products
* Orders
* Customers

---

# Admin Components

## AdminLayout

Path:

```txt
components/admin/AdminLayout.js
```

Contains:

* Sidebar
* Header
* Main Content

---

## Sidebar

Path:

```txt
components/admin/Sidebar.js
```

Menu:

```txt
Dashboard
Orders
Products
Collections
Customers
Pages
Settings
```

---

## DashboardCard

Path:

```txt
components/admin/DashboardCard.js
```

Display:

* Title
* Value
* Icon

---

## DataTable

Path:

```txt
components/admin/DataTable.js
```

Reusable table component.

Features:

* Search
* Pagination
* Empty State

Used by:

* Products
* Orders
* Customers
* Collections

---

# Product Components

## ProductForm

Path:

```txt
components/admin/products/ProductForm.js
```

Fields:

* Title
* Description
* Images
* Collection
* Tags
* Status

---

## ImageUploader

Path:

```txt
components/admin/products/ImageUploader.js
```

Features:

* Multiple Upload
* Preview
* Delete

Storage:

Firebase Storage

---

## VariantGenerator

Path:

```txt
components/admin/products/VariantGenerator.js
```

Features:

* Maximum 3 options
* Auto Generate Variants

Example:

```txt
Color:
Black, White

Size:
M, L
```

Generate:

```txt
Black / M
Black / L
White / M
White / L
```

---

## VariantTable

Path:

```txt
components/admin/products/VariantTable.js
```

Columns:

```txt
Variant
SKU
Price
Stock
Image
```

---

# Collection Components

## CollectionForm

Path:

```txt
components/admin/collections/CollectionForm.js
```

Fields:

* Title
* Description
* Image
* Status

---

# Order Components

## OrderStatusBadge

Path:

```txt
components/admin/orders/OrderStatusBadge.js
```

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

## OrderDetailCard

Path:

```txt
components/admin/orders/OrderDetailCard.js
```

Display:

* Customer Info
* Products
* Total
* Notes

---

# Customer Components

## CustomerCard

Path:

```txt
components/admin/customers/CustomerCard.js
```

Display:

* Name
* WhatsApp
* Total Orders
* Total Spending

---

# Storefront Components

## Header

Path:

```txt
components/store/Header.js
```

Contains:

* Logo
* Navigation
* Cart Icon

---

## Footer

Path:

```txt
components/store/Footer.js
```

Contains:

* Store Info
* Social Media
* Copyright

---

## ProductCard

Path:

```txt
components/store/ProductCard.js
```

Display:

* Image
* Product Name
* Price

Used in:

* Home
* Collection
* Search

---

## ProductGallery

Path:

```txt
components/store/ProductGallery.js
```

Display:

* Featured Image
* Thumbnails

---

## ProductVariantSelector

Path:

```txt
components/store/ProductVariantSelector.js
```

Handles:

* Option Selection
* Variant Matching

---

## CartItem

Path:

```txt
components/store/CartItem.js
```

Display:

* Product
* Variant
* Quantity
* Subtotal

---

## WhatsAppOrderButton

Path:

```txt
components/store/WhatsAppOrderButton.js
```

Responsibilities:

* Create Order
* Save Firestore
* Generate Message
* Redirect WhatsApp

---

# Forms

Use React Hook Form.

All forms must:

* Validate required fields
* Show error messages
* Prevent duplicate submissions

---

# Notifications

Use Toast Notifications.

Success:

```txt
Saved Successfully
```

Error:

```txt
Something Went Wrong
```

Loading:

```txt
Saving...
```

Keep notifications simple and short.
