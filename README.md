# SECOND STORY — Vintage & Archival Fashion E-Commerce Platform

> **"Pre-loved pieces. New stories."**  
> A production-grade, editorial-style full-stack vintage and thrift clothing marketplace engineered with Next.js App Router, React 19, TypeScript, Tailwind CSS, and MongoDB.

---

## 1. ARCHITECTURE & TECH STACK

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript (Strict Mode), Tailwind CSS v4, Lucide React, Framer Motion
- **Backend**: Next.js Route Handlers (`app/api/**/route.ts`), Server Components, Server-only business logic layer
- **Database**: Official MongoDB Node.js driver (`mongodb`), connection pooling, compound & unique indexes, text search index
- **Authentication**: JWT signed session cookies (`jose`), salted password hashing (`bcryptjs`), role-based authorization (`customer`, `staff`, `admin`)
- **Inventory & Oversell Guard**: Concurrency-safe atomic reservations (`$gte` stock condition + `$inc: { stock: -qty }`) guaranteeing one-of-one pieces are never oversold
- **Payments**: Razorpay gateway integration with HMAC-SHA256 server signature verification, idempotent webhook processing, and development test-mode simulation
- **Testing**: Vitest unit test suites for pricing, discount rules, stock validation, HMAC signatures, and state machines

---

## 2. DIRECTORY STRUCTURE

```
second-story/
├── app/
│   ├── layout.tsx                     # Editorial typography & global providers
│   ├── page.tsx                       # Curated editorial storefront homepage
│   ├── globals.css                    # Design tokens & vintage pill classes
│   ├── not-found.tsx                  # Custom 404 archive recovery page
│   ├── error.tsx                      # Global error boundary
│   ├── loading.tsx                    # Minimalist loading skeleton
│   ├── sitemap.ts                     # Dynamic SEO sitemap
│   ├── robots.ts                      # Crawler instructions
│   ├── (shop)/
│   │   ├── shop/page.tsx              # Filterable, searchable catalog
│   │   ├── product/[slug]/page.tsx    # High-detail garment view & measurements
│   │   ├── cart/page.tsx              # Persistent bag with coupon calculator
│   │   ├── checkout/page.tsx          # Multi-step checkout with atomic stock reserve
│   │   ├── order/[id]/page.tsx        # Order confirmation & live tracking timeline
│   │   └── wishlist/page.tsx          # Customer saved pieces
│   ├── (account)/
│   │   ├── login/page.tsx             # Sign in with instant demo fill
│   │   ├── register/page.tsx          # New membership registration
│   │   ├── forgot-password/page.tsx   # Enumeration-safe reset link
│   │   ├── reset-password/page.tsx    # Secure token password update
│   │   └── account/page.tsx           # Order history & saved addresses
│   ├── admin/
│   │   ├── layout.tsx                 # Server-protected admin layout & sidebar
│   │   ├── page.tsx                   # Operations overview & financial KPIs
│   │   ├── products/                  # Product catalog list & new garment entry
│   │   ├── inventory/                 # Stock movement audit log & low stock
│   │   ├── orders/                    # Order status & courier tracking updates
│   │   ├── customers/                 # Collector directory & lifetime spend
│   │   └── discounts/                 # Promotional coupon code generator
│   └── api/
│       ├── auth/                      # login, register, logout, me, reset-password
│       ├── products/                  # Catalog queries & product by ID
│       ├── collections/               # Curated aesthetic collections
│       ├── cart/                      # Cart calculations, discounts, merge
│       ├── wishlist/                  # Wishlist storage & retrieval
│       ├── checkout/                  # Atomic stock reservation & order initiation
│       ├── payments/verify/           # Signature verification & order paid transition
│       ├── webhooks/razorpay/         # Signed webhook handling & idempotency
│       ├── newsletter/                # Newsletter subscription
│       ├── upload/                    # MIME-validated local/cloud image upload
│       └── admin/                     # Admin CRUD endpoints & overview metrics
├── components/
│   ├── layout/                        # Header, AnnouncementBar, Footer
│   ├── home/                          # Hero, CollectionShowcase, FeaturedDrop, Standards, Story
│   ├── products/                      # ProductCard, ProductDetailView
│   ├── cart/                          # CartDrawer with free shipping tracker
│   ├── admin/                         # OrderDetailClient, DiscountsClient
│   └── providers/                     # AuthProvider, CartProvider, ToastProvider
├── lib/
│   ├── db/mongodb.ts                  # MongoClient singleton with connection pool
│   ├── db/indexes.ts                  # Index creation script
│   ├── auth/                          # JWT, password hashing, session guards
│   ├── config/env.ts                  # Validated environment configuration
│   ├── services/                      # Product, Cart, Order, Inventory, Payment, Email
│   └── validations/                   # Zod schemas for auth, products, checkout
├── types/index.ts                     # Domain TypeScript interfaces
├── scripts/
│   ├── seed.ts                        # 25 curated vintage pieces, admin & customer seed
│   ├── init-indexes.ts                # Database indexes initializer
│   └── verify-order.ts                # Order & atomic decrement verification tool
├── tests/unit/                        # Vitest suites for pricing, auth, payment HMAC
├── .env.example                       # Documented environment templates
├── Dockerfile                         # Production Docker deployment
└── README.md
```

---

## 3. GETTING STARTED

### Prerequisites
- Node.js 20+ or 22+
- Local or Cloud MongoDB instance running on port 27017

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Seed Database & Indexes
Run the deterministic seed script to populate 25 curated vintage pieces, drop collections, admin & customer accounts, and demo orders:
```bash
npm run seed
npm run db:indexes
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the specified port).

---

## 4. DEFAULT DEMO CREDENTIALS

The seed script creates the following pre-configured credentials:

| Role | Email | Password |
|---|---|---|
| **Curator Admin** | `admin@secondstory.com` | `Admin@123456` |
| **Customer** | `customer@secondstory.com` | `Customer@123456` |

*Tip: The login page includes quick **"Instant Demo Logins"** buttons to autofill these credentials with a single click.*

---

## 5. PROMOTION CODES

The database includes the following active vouchers for testing checkout discounts:
- `STORY10` — 10% off entire bag
- `ARCHIVE500` — ₹500 off on orders of ₹3,000 or more
- `WELCOME15` — 15% off on orders of ₹2,000 or more

---

## 6. MONGODB COLLECTIONS & INDEXES

1. **`products`**:
   - `{ slug: 1 }` (unique)
   - `{ category: 1, status: 1 }`
   - `{ status: 1, createdAt: -1 }`
   - Text index: `{ name: "text", description: "text", brand: "text", material: "text" }`
2. **`orders`**:
   - `{ orderNumber: 1 }` (unique)
   - `{ userId: 1, createdAt: -1 }`
   - `{ paymentStatus: 1 }`
   - `{ fulfillmentStatus: 1 }`
3. **`users`**:
   - `{ email: 1 }` (unique)
   - `{ role: 1 }`
4. **`inventory_movements`**:
   - `{ productId: 1, createdAt: -1 }`
5. **`webhook_events`**:
   - `{ eventId: 1 }` (unique idempotency key)
6. **`discount_codes`**:
   - `{ code: 1 }` (unique)

---

## 7. AUTOMATED TESTING & BUILD

Run unit tests:
```bash
npm run test
```
Run type-checking:
```bash
npm run typecheck
```
Build production bundle:
```bash
npm run build
```
