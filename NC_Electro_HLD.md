# NC Electro - High-Level Design (HLD)

**Status:** Approved baseline for LLD
**Version:** 2.0
**Date:** 2026-09-26
**Scope:** Customer e-commerce website, Super Admin panel, Sub-Admin operations panel

## 1. Purpose and Scope

NC Electro is a B2C e-commerce platform for electrical products. Customers browse products, manage a wishlist and cart, place orders, track orders, and download order documents. Internal users manage the catalog, customers, orders, sellers/suppliers, stock, reporting, and fulfillment operations.

This document is the architectural baseline for the Low-Level Design (LLD), database schema, and OpenAPI specification. It replaces the earlier draft HLDs where they conflict with the decisions in Section 19.

### 1.1 In scope for V1

- Responsive customer website for desktop, tablet, and mobile
- Customer registration, login, password reset, profile, and addresses
- Product catalog, categories, sub-categories, search, filters, sorting, and pagination
- Product images, specifications, pricing, discounts, SKU, stock availability, and related products
- Wishlist, cart, checkout, order placement, order tracking, and PDF invoices
- Super Admin and permission-controlled Sub-Admin panels
- Seller/supplier management without seller/supplier logins
- First-accept order allocation and seller/supplier-wise reporting
- Stock management and low/out-of-stock views
- Sales summaries, analytics, reports, and CSV export where practical
- Basic technical SEO for customer-facing catalog pages

### 1.2 Explicitly out of scope for V1

- Seller/supplier portal or login
- Customer loyalty redemption or reward redemption workflows
- Automatic seller/supplier dispatch integration
- Multi-supplier fulfillment for one order
- Advanced SEO/content marketing
- Native mobile applications
- COD unless added through a change request

## 2. Architecture Overview

The system uses a modular monolith: one stateless Go API and one PostgreSQL database, with clear domain, service, and repository boundaries. This keeps the first release operationally simple while allowing the backend to scale horizontally later.

```text
Customer Web      Admin Web       Sub-Admin Web
(Next.js)         (Next.js)       (Next.js)
      \              |              /
             HTTPS / REST API
                    |
          Nginx / TLS termination
                    |
       Go API (Chi Router, stateless)
       Middleware -> Services -> Repositories
                    |
              PostgreSQL
                    |
                  File Storage
```

### 2.1 Technology baseline

| Area | Decision |
| --- | --- |
| Customer frontend | Next.js with React and SSR/SSG for SEO-critical pages |
| Admin frontends | Next.js/React, client-rendered operational screens |
| Backend | Go with Chi Router |
| Database | PostgreSQL |
| Database driver | pgx |
| Migrations | golang-migrate |
| API style | Versioned REST JSON API under `/api` |
| Authentication | Short-lived JWT access token plus refresh token |
| Password hashing | bcrypt, cost factor at least 12 |
| Payment | Deferred to V2; no payment gateway integration in V1 |
| WhatsApp | Deferred to V2; no WhatsApp integration in V1 |
| Invoice PDF | HTML template rendered by a server-side PDF engine |
| File storage | Local VPS storage for V1, S3-compatible storage migration path |
| Deployment | Linux VPS or managed equivalent, Nginx, systemd or Docker |

## 3. System Surfaces and Roles

### 3.1 User surfaces

| Surface | Users | Responsibility |
| --- | --- | --- |
| Customer website | Customers | Discovery, purchase, order tracking |
| Super Admin panel | Owners/managers | Full configuration and business management |
| Sub-Admin panel | Operations staff | Order operations and supplier coordination |

Sellers/suppliers are the same fulfillment-party concept in this system. They are internal records only and do not receive credentials or a separate portal in V1.

### 3.2 Roles and access boundaries

| Capability | Customer | Sub-Admin | Super Admin |
| --- | :---: | :---: | :---: |
| Register/login/profile/addresses | Yes | Yes | Yes |
| Browse catalog | Yes | Yes | Yes |
| Wishlist/cart/checkout/order placement | Yes | No | No |
| View own orders and invoices | Yes | No | No |
| View and operate all orders | No | Permission-controlled | Yes |
| Update operational order status | No | Permission-controlled | Yes |
| Accept and fulfill orders | No | Permission-controlled | Yes |
| Product/category/stock CRUD | No | No | Yes |
| Customer management | No | No | Yes |
| View seller/supplier records | No | Permission-controlled read-only | Yes |
| Seller/supplier CRUD | No | No | Yes |
| Reports and analytics | No | Permission-controlled | Yes |
| Sub-Admin and permission management | No | No | Yes |
| System and integration settings | No | No | Yes |
| Reward points view | No | Own points | All points |

The server enforces permissions on every protected endpoint. Frontend route hiding is not an authorization control.

## 4. Functional Modules

### 4.1 Customer modules

- **Authentication:** registration, login, logout, refresh, forgot/reset password
- **Profile:** contact details and multiple delivery addresses
- **Catalog:** products, categories, sub-categories, brands, specifications, related products
- **Search:** keyword search, filters for price/category/brand/availability, sorting, pagination
- **Wishlist:** add, remove, list, and move an item to cart
- **Cart:** add, update quantity, remove, stock validation, totals
- **Checkout:** address, server-side pricing, shipping/tax, order confirmation
- **Orders:** history, details, status timeline, invoice/order document download

### 4.2 Admin modules

1. Dashboard
2. Product management
3. Category management
4. Sub-category management
5. Order management
6. Customer management
7. Seller/supplier management
9. Sub-Admin management
10. Sales management
11. Sales analytics
12. Invoice management
13. Stock management
14. Order document management
15. Reports
16. System settings

## 5. Core Domain Rules

### 5.1 Catalog and pricing

- Product prices, discounts, shipping, and tax are calculated by the backend.
- Client-submitted totals are advisory only and never trusted.
- A product has one active selling price at a time; order items store immutable price and product snapshots.
- Product and category deletion is preferably a soft delete/deactivation to preserve order history.
- SKU and slug are unique. Slugs are generated on creation and updated through an explicit redirect strategy if changed.
- Product uploads are limited to five images in V1 unless changed in configuration.

### 5.2 Stock and reservation

Stock is protected by a PostgreSQL transaction and row-level locking. Order placement creates a temporary reservation with an expiry. The reservation is converted into a sale when the order is accepted/confirmed, and is released when an order is cancelled or expires.

The LLD must define either `stock_reservations` or equivalent reservation fields, including `expires_at`, status, and an idempotency key. Available stock must never become negative.

### 5.3 Order ownership and snapshots

- Customers can only access orders belonging to their authenticated user ID.
- Orders store a delivery-address JSON snapshot; later address edits cannot change history.
- Order items store product name, SKU, unit price, discount, and category snapshots.
- One seller/supplier is allocated per order in V1.
- Customer delivery addresses store a required pincode.
- Seller/supplier records store a required pincode for nearest-party matching and reporting.
- Seller/supplier attribution is stored on the order as a snapshot; this makes reports deterministic if the master record later changes.

### 5.4 First-accept seller/supplier allocation

When a customer places an order, it is visible to every authorized Sub-Admin. Any Sub-Admin may accept it. The backend performs an atomic conditional update so only the first successful acceptance can allocate the order; later attempts receive a conflict response and cannot take ownership. The accepting Sub-Admin coordinates with the allocated seller/supplier outside the system. The system stores customer and seller/supplier pincodes for database matching and future nearest-party logic; V1 does not automatically select a seller/supplier by distance.

### 5.5 Reward points

The Sub-Admin who accepts and fulfills an order receives one reward point for every fulfilled order. An order is considered fulfilled when it reaches `DELIVERED`. Points are recorded in an append-only ledger against the Sub-Admin and order, tracked for reporting only. Redemption is excluded from V1. A unique `(user_id, order_id, reason)` constraint must prevent duplicate points if the delivery update is retried.

## 6. Order Lifecycle

### 6.1 Order status model

```text
ORDER_PLACED -> ACCEPTED -> PROCESSING
                         -> READY_FOR_DISPATCH
                         -> SHIPPED
                         -> OUT_FOR_DELIVERY
                         -> DELIVERED
```

Exception states:

- `CANCELLED`: order cancelled before delivery, subject to actor permissions
- `RETURNED`: delivered order returned; manual V1 workflow

Rules:

- `ORDER_PLACED` is created after the customer confirms checkout.
- All authorized Sub-Admins can view unaccepted orders.
- The first successful `accept` operation atomically assigns the order to that Sub-Admin and changes it to `ACCEPTED`.
- Operational states move forward only through an explicit transition matrix.
- Seller/supplier coordination happens outside the system; the Sub-Admin records the resulting status updates in the system.
- Super Admin alone can cancel, return, or refund in V1.
- Every transition records previous status, new status, actor, timestamp, and optional note.

### 6.2 First-accept flow

```text
1. Customer confirms checkout with address and pincode.
2. API validates cart, stock, address, pricing, shipping, and tax.
3. Transaction creates ORDER_PLACED and reserves stock.
4. All authorized Sub-Admins see the unaccepted order.
5. One Sub-Admin calls accept; the database conditionally updates only if no Sub-Admin is assigned.
6. The winner becomes the order owner and the order moves to ACCEPTED.
7. The winning Sub-Admin coordinates with the seller/supplier externally.
8. The winning Sub-Admin records processing, dispatch, delivery, and exception statuses.
```

The acceptance operation must be idempotent for the winning Sub-Admin and must return a conflict for later competing acceptances.

## 7. Order Documents

V1 may generate an order document/PDF from the finalized order. It contains NC Electro branding, order number/date, customer and address snapshots, item snapshots, discount, configured tax, and totals. Payment method and gateway reference are omitted until payment is implemented in V2. Customers can download only their own document; admins can download any permitted document.

## 8. Data Model (High-Level)

```text
users -> addresses, wishlist_items, cart_items, orders, permissions, reward_points
categories -> sub_categories -> products -> images, specifications
products <-> seller_suppliers through seller_supplier_products
orders -> order_items, status_history, invoices, seller_supplier_assignment
orders -> stock_reservations
```

### 8.1 Required entities

| Entity | Key design requirements |
| --- | --- |
| `users` | UUID, role, email/phone uniqueness, password hash, active flag |
| `user_addresses` | User-owned address fields, default flag |
| `categories` / `sub_categories` | Unique slugs, active flag, sort order |
| `products` | SKU, slug, prices, brand, category, active flag, SEO fields |
| `product_images` | URL/key, primary flag, sort order |
| `product_specifications` | Key/value pairs and sort order |
| `product_stock` | Quantity, low-stock threshold, derived availability |
| `seller_suppliers` | One internal fulfillment-party record: name, contact, phone, email, address, required pincode, active flag |
| `seller_supplier_products` | Unique seller/supplier-product pair and availability |
| `wishlist_items` | Unique user/product pair |
| `cart_items` | Unique user/product pair and positive quantity |
| `orders` | Order number, user, status, money fields, address snapshot, timestamps |
| `order_items` | Product snapshot, quantity, immutable prices |
| `order_status_history` | From/to statuses, actor, note, timestamp |
| `stock_reservations` | Order, product, quantity, expiry, status, idempotency key |
| `seller_supplier_assignments` | Order, seller/supplier, accepting Sub-Admin, accepted timestamp |
| `invoices` | Unique document number, order, totals snapshot, file key, status |
| `sub_admin_permissions` | User and permission key unique pair |
| `reward_points` | User, order, points, reason, unique earning event |
| `system_settings` | Non-secret configurable business settings |

### 8.2 Integrity requirements

- UUID primary keys and UTC timestamps
- Foreign keys and appropriate unique constraints
- `CHECK` constraints for positive quantities and non-negative monetary values
- Money represented as PostgreSQL `numeric`, never floating point
- Indexes on order user/status/date, unaccepted orders, accepting Sub-Admin, product slug/SKU/category, and seller/supplier pincode
- Secrets stored only in environment/secret management, not `system_settings`
- Migrations are forward-only in deployed environments and reviewed before release

## 9. Backend Structure

```text
nc-electro-backend/
├── cmd/server/main.go
├── internal/
│   ├── api/handlers/              # HTTP transport only
│   ├── api/middleware/            # auth, RBAC, validation, logging, recovery
│   ├── domain/                    # entities, enums, transition rules
│   ├── service/                   # business use cases and transactions
│   ├── repository/                # pgx data access
│   ├── integration/               # storage and PDF adapters; payment/WhatsApp reserved for V2
│   └── config/
├── pkg/                           # response, validation, observability helpers
├── migrations/
├── .env.example
├── Makefile
└── go.mod
```

Handlers must not contain business rules or direct SQL. Services own transaction boundaries and state transitions. Repositories do not call external services.

## 10. API Boundary

All endpoints use `/api`. The LLD must produce the complete OpenAPI contract, including schemas, pagination, filters, status codes, and errors.

### 10.1 Public routes

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/refresh
GET  /api/products
GET  /api/products/{slug}
GET  /api/categories
GET  /api/categories/{slug}
GET  /api/categories/{categorySlug}/{subCategorySlug}
GET  /api/search
GET  /api/health
```

### 10.2 Customer routes

```text
GET/PUT              /api/me/profile
GET/POST/PUT/DELETE  /api/me/addresses
GET/POST/DELETE      /api/me/wishlist
POST                 /api/me/wishlist/{id}/move-to-cart
GET/POST/PUT/DELETE  /api/me/cart
POST                 /api/me/checkout/preview
POST                 /api/me/orders
GET                  /api/me/orders
GET                  /api/me/orders/{id}
GET                  /api/me/orders/{id}/invoice
```

### 10.3 Admin route groups

```text
/api/admin/dashboard/*
/api/admin/products/*
/api/admin/categories/*
/api/admin/orders/*
/api/admin/customers/*
/api/admin/seller-suppliers/*
/api/admin/subadmins/*
/api/admin/stock/*
/api/admin/invoices/*
/api/admin/sales/*
/api/admin/analytics/*
/api/admin/reports/*
/api/admin/rewards/*
/api/admin/settings/*
```

Each route is annotated with required role and permission. List endpoints use a consistent pagination envelope and allow-list filters/sorts only.

### 10.4 Error and idempotency contract

Errors use a stable shape:

```json
{
  "error": {
    "code": "ORDER_INVALID_TRANSITION",
    "message": "The order cannot move to the requested status.",
    "details": {}
  }
}
```

Order creation, acceptance, stock reservation, invoice generation, and reward allocation require idempotency keys or unique business constraints. Repeating a request must not duplicate an order, invoice, stock movement, reward, or acceptance.

## 11. Authentication and Security

- Access token lifetime: 15 minutes; refresh token lifetime: 7 days.
- Refresh tokens are stored/revoked securely; rotation is preferred.
- JWT claims contain user ID, role, issued-at, and expiry. Permissions are resolved server-side or invalidated when changed.
- HTTPS is mandatory in deployed environments.
- CORS allow-lists known frontend origins only.
- Request bodies are validated before service calls.
- SQL uses parameterized pgx queries.
- Auth and order-acceptance endpoints are rate-limited.
- Security headers, CSP, secure cookies where used, and structured audit logs are enabled.
- Personal data is returned only to authorized users; logs must redact tokens, passwords, payment secrets, and unnecessary PII.

## 12. Deployment and Operations

| Component | V1 approach |
| --- | --- |
| API | Go binary behind Nginx |
| Frontend | Next.js deployment or self-hosted behind Nginx |
| Database | Managed PostgreSQL preferred; private network access |
| Process | systemd or Docker |
| Files | Local persistent volume with backup; S3-compatible migration path |
| TLS | Nginx with managed/Let's Encrypt certificate |
| Backups | Daily PostgreSQL backup with restore verification |
| Observability | Structured logs, health/readiness endpoints, error monitoring |
| CI/CD | Test, lint, migration check, build, deploy, smoke test |

Required environments: local, staging, and production. Production secrets are injected by the deployment environment. A deployment is not complete until migrations, health checks, authentication, first-accept concurrency behavior, and critical customer/admin smoke tests pass.

## 13. Non-Functional Requirements

| Requirement | Target / rule |
| --- | --- |
| API performance | p95 under 300 ms for normal reads; analytics under 1 s where feasible |
| Availability | 99.5% target for production |
| Consistency | PostgreSQL transactions for checkout, stock, acceptance, and status changes |
| Scalability | Stateless API, horizontally scalable behind a load balancer |
| Security | OWASP Top 10 baseline and least-privilege access |
| SEO | SSR/SSG catalog pages, canonical URLs, metadata, sitemap, robots.txt |
| Responsiveness | Mobile-first support for current desktop/tablet/iOS/Android browsers |
| Auditability | Order transitions, acceptance events, stock changes, and admin actions traceable |
| Recovery | Documented database/file restore procedure and tested backup |

## 14. SEO and Customer Pages

Customer routes include home, about, products, categories, sub-categories, product details, search, contact, policy pages, login, registration, account, addresses, wishlist, cart, checkout, orders, order details, and invoice access.

Product and category pages use stable unique slugs, metadata, canonical URLs, semantic HTML, optimized images, `alt` text, `sitemap.xml`, and `robots.txt`. Admin pages are not indexed.

## 15. Resolved Decisions for LLD

| Decision | Final V1 position |
| --- | --- |
| Backend stack | Go + Chi + pgx |
| Database | PostgreSQL |
| Payment | Deferred to V2; order placement is not payment-gated in V1 |
| WhatsApp | Deferred to V2; no notification provider in V1 |
| Fulfillment party | Seller and supplier are one internal `seller_suppliers` entity |
| Order allocation | All Sub-Admins see new orders; first successful acceptance wins |
| Nearest-party data | Customer and seller/supplier pincodes stored for database matching; no automatic distance selection in V1 |
| Multiple fulfillment parties/order | Not supported in V1 |
| Sub-Admin cancellation | Super Admin only |
| Returns/refunds | Manual status tracking; payment refund workflow deferred with payment |
| Reward points | One point for every order fulfilled by the accepting Sub-Admin, awarded at Delivered; no redemption |
| Storage | Local persistent storage in V1; S3-compatible path documented |
| Seller meaning | Seller and supplier are synonymous fulfillment-party terms in V1 |
| Tax | Configurable tax/GST fields; legal rates supplied by client/accountant |
| COD | Excluded unless explicitly approved |
| Shipping | Configurable flat-rate default; advanced calculation deferred |
| Product images | Maximum five per product in V1 |
| Admin login | Shared login endpoint with role-based redirect |
| Scope change control | Any new portal, provider, workflow, or report requires impact review |

Tax values, shipping amount, legal policies, seller/supplier master data, and production domains are external inputs. Payment gateway and WhatsApp details are deferred V2 inputs and do not block the V1 implementation.

## 16. LLD Handoff Checklist

The LLD phase should deliver:

- PostgreSQL schema, constraints, indexes, and migration order
- Complete ERD including stock reservations and seller/order-item attribution
- Order transition matrix and authorization rules
- Transaction boundaries for checkout, stock, first-accept allocation, cancellation, and status changes
- OpenAPI specification with request/response/error schemas
- Permission catalog and route-to-permission matrix
- V2 integration boundary note for payment and WhatsApp; no V1 implementation
- Background retry/job strategy for order documents
- File storage and PDF lifecycle details
- Test matrix for customer, Sub-Admin, Super Admin, first-accept race conditions, pincode persistence, and stock concurrency
- Environment variable contract and deployment configuration

**HLD exit criterion:** no business-critical behavior remains implicit. Any new requirement discovered during LLD is recorded as a change request with scope, data, API, security, and timeline impact.
