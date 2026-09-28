# NC Electro - Low-Level Design (LLD)

**Status:** Implementation baseline
**Version:** 1.0
**Date:** 2026-09-26
**Parent design:** `docs/NC_Electro_HLD.md`
**Scope:** V1 customer website, Super Admin panel, Sub-Admin operations panel

## 1. Purpose

This document translates the approved HLD into implementation-level contracts for the Go backend, PostgreSQL database, and frontend integration.

V1 includes catalog, customers, wishlist, cart, checkout, direct order placement, first-accept Sub-Admin fulfillment, seller/supplier master data, stock, order documents, reward points, analytics, and reporting.

Payment gateway integration and WhatsApp integration are explicitly deferred to V2. V1 must not create payment sessions, payment webhooks, WhatsApp jobs, WhatsApp credentials, or payment-gated order states.

## 2. Implementation Rules

1. Handlers translate HTTP requests and responses only.
2. Services own business rules and transaction boundaries.
3. Repositories own SQL and persistence only.
4. All monetary values use PostgreSQL `numeric` and Go decimal-safe representations; never floating point.
5. All timestamps are stored in UTC.
6. Every protected resource is authorized on the server using the authenticated user ID, role, and permission.
7. Customer-submitted totals are never trusted. The backend recalculates all prices.
8. Order history uses snapshots so later catalog, address, or seller/supplier changes cannot alter historical records.
9. First acceptance is decided by one atomic database update. Application-level locks are not sufficient.
10. V1 external coordination with the seller/supplier is outside the system. Sub-Admins record only the resulting order status and notes.

## 3. V1 Scope and Actors

### 3.1 Actors

| Actor | Authentication | Main responsibilities |
| --- | --- | --- |
| Customer | Self-registration/login | Browse, wishlist, cart, order, track own orders |
| Sub-Admin | Created by Super Admin | Accept first available orders, coordinate fulfillment, update assigned order status, earn points |
| Super Admin | Seeded/created operationally | Full management, configuration, reports, override operations |
| Seller/Supplier | No login | External fulfillment party represented by internal master data |

Seller and supplier are synonymous in V1. The database entity is `seller_suppliers` and the UI may display the business label selected by NC Electro.

### 3.2 V1 exclusions

- Online payment and payment status integration
- COD workflow
- WhatsApp notifications
- Seller/supplier login or portal
- Automatic nearest-party allocation
- Multi-party fulfillment for one order
- Reward redemption
- Automated gateway refunds

## 4. Backend Project Structure

```text
nc-electro-backend/
├── cmd/api/main.go
├── internal/
│   ├── api/
│   │   ├── router.go
│   │   ├── handler/
│   │   └── middleware/
│   ├── config/config.go
│   ├── domain/
│   │   ├── user.go
│   │   ├── catalog.go
│   │   ├── cart.go
│   │   ├── order.go
│   │   ├── inventory.go
│   │   ├── seller_supplier.go
│   │   ├── invoice.go
│   │   ├── reward.go
│   │   └── permission.go
│   ├── service/
│   │   ├── auth_service.go
│   │   ├── catalog_service.go
│   │   ├── customer_service.go
│   │   ├── wishlist_service.go
│   │   ├── cart_service.go
│   │   ├── checkout_service.go
│   │   ├── order_service.go
│   │   ├── inventory_service.go
│   │   ├── seller_supplier_service.go
│   │   ├── invoice_service.go
│   │   ├── reward_service.go
│   │   ├── analytics_service.go
│   │   └── report_service.go
│   ├── repository/
│   │   ├── user_repository.go
│   │   ├── catalog_repository.go
│   │   ├── cart_repository.go
│   │   ├── order_repository.go
│   │   ├── inventory_repository.go
│   │   ├── seller_supplier_repository.go
│   │   ├── invoice_repository.go
│   │   ├── reward_repository.go
│   │   └── analytics_repository.go
│   ├── integration/
│   │   ├── file_storage.go
│   │   └── pdf_generator.go
│   └── platform/
│       ├── database.go
│       ├── logger.go
│       └── clock.go
├── migrations/
├── tests/
├── .env.example
├── Makefile
└── go.mod
```

### 4.1 Dependency direction

```text
HTTP handler -> service -> repository -> PostgreSQL
                    |-> file storage
                    |-> PDF generator
```

Repositories must not call services or external integrations. Services receive dependencies through constructors. The clock and ID generator should be injectable for deterministic tests.

## 5. Domain Enumerations

### 5.1 User roles

```text
customer
sub_admin
super_admin
```

### 5.2 Order statuses

```text
order_placed
accepted
processing
ready_for_dispatch
shipped
out_for_delivery
delivered
cancelled
returned
```

`order_placed` is the initial state. `delivered`, `cancelled`, and `returned` are terminal for the normal V1 workflow. A returned order is recorded manually; a new replacement order is a separate order.

### 5.3 Allowed status transitions

| From | Allowed next state | Actor |
| --- | --- | --- |
| `order_placed` | `accepted` | Assigned Sub-Admin or Super Admin |
| `order_placed` | `cancelled` | Super Admin |
| `accepted` | `processing` | Assigned Sub-Admin or Super Admin |
| `accepted` | `cancelled` | Super Admin |
| `processing` | `ready_for_dispatch` | Assigned Sub-Admin or Super Admin |
| `processing` | `cancelled` | Super Admin |
| `ready_for_dispatch` | `shipped` | Assigned Sub-Admin or Super Admin |
| `ready_for_dispatch` | `cancelled` | Super Admin |
| `shipped` | `out_for_delivery` | Assigned Sub-Admin or Super Admin |
| `out_for_delivery` | `delivered` | Assigned Sub-Admin or Super Admin |
| `delivered` | `returned` | Super Admin |

No backward transitions or arbitrary jumps are allowed. Super Admin override must still use an explicit permitted transition and must be audited.

### 5.4 Stock reservation states

```text
reserved
committed
released
expired
```

### 5.5 Invoice/document states

```text
pending
generated
failed
```

## 6. PostgreSQL Schema

The following is the logical schema. Exact migration syntax may be split into ordered migration files.

### 6.1 Extensions and common conventions

- Enable `pgcrypto` for UUID generation if UUIDs are generated in PostgreSQL.
- Use `uuid` primary keys.
- Use `timestamptz` for timestamps.
- Use `numeric(12,2)` for currency fields.
- Use `citext` or normalized lowercase values for case-insensitive email uniqueness.
- Use soft deactivation (`is_active = false`) for business records referenced by history.

### 6.2 Users and authentication

```sql
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role text NOT NULL CHECK (role IN ('customer', 'sub_admin', 'super_admin')),
    full_name varchar(120) NOT NULL,
    email varchar(255),
    phone varchar(20),
    password_hash text NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE UNIQUE INDEX users_email_lower_uq
    ON users (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX users_phone_uq
    ON users (phone) WHERE phone IS NOT NULL;

CREATE TABLE refresh_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id),
    token_hash text NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX refresh_tokens_user_idx ON refresh_tokens(user_id);
```

Password-reset tokens, if implemented, must store only a hash, an expiry, a used timestamp, and the user ID. Plain reset tokens must never be persisted.

### 6.3 Customer addresses

```sql
CREATE TABLE user_addresses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id),
    label varchar(40) NOT NULL,
    recipient_name varchar(120) NOT NULL,
    phone varchar(20) NOT NULL,
    address_line_1 varchar(200) NOT NULL,
    address_line_2 varchar(200),
    city varchar(80) NOT NULL,
    state varchar(80) NOT NULL,
    pincode varchar(10) NOT NULL,
    is_default boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (pincode ~ '^[0-9]{6}$')
);

CREATE INDEX user_addresses_user_idx ON user_addresses(user_id);
CREATE UNIQUE INDEX one_default_address_per_user
    ON user_addresses(user_id) WHERE is_default = true;
```

The service must unset the previous default address in the same transaction before setting a new default.

### 6.4 Catalog

```sql
CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(120) NOT NULL,
    slug varchar(160) NOT NULL UNIQUE,
    description text,
    image_key text,
    sort_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sub_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid NOT NULL REFERENCES categories(id),
    name varchar(120) NOT NULL,
    slug varchar(160) NOT NULL UNIQUE,
    description text,
    image_key text,
    sort_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(category_id, name)
);

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_category_id uuid NOT NULL REFERENCES sub_categories(id),
    name varchar(200) NOT NULL,
    slug varchar(220) NOT NULL UNIQUE,
    sku varchar(80) NOT NULL UNIQUE,
    brand varchar(120),
    description text,
    price numeric(12,2) NOT NULL CHECK (price >= 0),
    discount_price numeric(12,2),
    meta_title varchar(160),
    meta_description varchar(320),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (discount_price IS NULL OR (discount_price >= 0 AND discount_price <= price))
);

CREATE INDEX products_sub_category_idx ON products(sub_category_id);
CREATE INDEX products_brand_idx ON products(lower(brand));
CREATE INDEX products_active_idx ON products(is_active);

CREATE TABLE product_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    file_key text NOT NULL,
    alt_text varchar(220) NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    is_primary boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX one_primary_product_image
    ON product_images(product_id) WHERE is_primary = true;
CREATE INDEX product_images_product_idx ON product_images(product_id, sort_order);

CREATE TABLE product_specifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    spec_key varchar(100) NOT NULL,
    spec_value varchar(500) NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    UNIQUE(product_id, spec_key)
);

CREATE TABLE related_products (
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    related_product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY(product_id, related_product_id),
    CHECK(product_id <> related_product_id)
);
```

### 6.5 Stock

```sql
CREATE TABLE product_stock (
    product_id uuid PRIMARY KEY REFERENCES products(id),
    quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity integer NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    low_stock_threshold integer NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (reserved_quantity <= quantity)
);

CREATE TABLE stock_reservations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL,
    product_id uuid NOT NULL REFERENCES products(id),
    quantity integer NOT NULL CHECK (quantity > 0),
    status text NOT NULL CHECK (status IN ('reserved', 'committed', 'released', 'expired')),
    idempotency_key varchar(100) NOT NULL,
    expires_at timestamptz NOT NULL,
    committed_at timestamptz,
    released_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(order_id, product_id),
    UNIQUE(idempotency_key)
);

CREATE INDEX stock_reservations_expiry_idx
    ON stock_reservations(status, expires_at);
```

`stock_reservations.order_id` references `orders`, which is created later in migration order. Add that foreign key in the orders migration or create orders before reservations.

### 6.6 Seller/supplier master data

```sql
CREATE TABLE seller_suppliers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name varchar(160) NOT NULL,
    contact_person varchar(120),
    phone varchar(20) NOT NULL,
    whatsapp_number varchar(20),
    email varchar(255),
    address_line_1 varchar(200) NOT NULL,
    address_line_2 varchar(200),
    city varchar(80) NOT NULL,
    state varchar(80) NOT NULL,
    pincode varchar(10) NOT NULL,
    notes text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (pincode ~ '^[0-9]{6}$')
);

CREATE INDEX seller_suppliers_pincode_idx ON seller_suppliers(pincode);
CREATE INDEX seller_suppliers_active_idx ON seller_suppliers(is_active);

CREATE TABLE seller_supplier_products (
    seller_supplier_id uuid NOT NULL REFERENCES seller_suppliers(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    is_available boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY(seller_supplier_id, product_id)
);
```

Pincode matching in V1 is data storage and query support only. It must not silently allocate a seller/supplier by distance.

### 6.7 Cart and wishlist

```sql
CREATE TABLE wishlist_items (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id, product_id)
);

CREATE TABLE cart_items (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id),
    quantity integer NOT NULL CHECK (quantity > 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id, product_id)
);
```

Only active products may be added to a new cart item. Existing cart rows are revalidated at checkout.

### 6.8 Orders

```sql
CREATE TABLE orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number varchar(32) NOT NULL UNIQUE,
    customer_id uuid NOT NULL REFERENCES users(id),
    status text NOT NULL CHECK (status IN (
        'order_placed', 'accepted', 'processing', 'ready_for_dispatch',
        'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'
    )),
    subtotal_amount numeric(12,2) NOT NULL CHECK (subtotal_amount >= 0),
    discount_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    shipping_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
    tax_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount numeric(12,2) NOT NULL CHECK (total_amount >= 0),
    delivery_address_snapshot jsonb NOT NULL,
    customer_pincode varchar(10) NOT NULL CHECK (customer_pincode ~ '^[0-9]{6}$'),
    accepted_by uuid REFERENCES users(id),
    accepted_at timestamptz,
    seller_supplier_id uuid REFERENCES seller_suppliers(id),
    seller_supplier_snapshot jsonb,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK ((accepted_by IS NULL) = (accepted_at IS NULL)),
    CHECK (status = 'order_placed' OR accepted_by IS NOT NULL)
);

CREATE INDEX orders_customer_idx ON orders(customer_id, created_at DESC);
CREATE INDEX orders_status_idx ON orders(status, created_at DESC);
CREATE INDEX orders_unaccepted_idx ON orders(created_at ASC)
    WHERE status = 'order_placed' AND accepted_by IS NULL;
CREATE INDEX orders_accepted_by_idx ON orders(accepted_by, status, created_at DESC);

CREATE TABLE order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id),
    product_name_snapshot varchar(200) NOT NULL,
    sku_snapshot varchar(80) NOT NULL,
    category_snapshot varchar(120),
    quantity integer NOT NULL CHECK (quantity > 0),
    unit_price numeric(12,2) NOT NULL CHECK (unit_price >= 0),
    discount_price numeric(12,2),
    line_total numeric(12,2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX order_items_order_idx ON order_items(order_id);
CREATE INDEX order_items_product_idx ON order_items(product_id);

CREATE TABLE order_status_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status text,
    to_status text NOT NULL,
    changed_by uuid NOT NULL REFERENCES users(id),
    note varchar(500),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX order_status_history_order_idx
    ON order_status_history(order_id, created_at);

CREATE TABLE seller_supplier_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL UNIQUE REFERENCES orders(id),
    seller_supplier_id uuid NOT NULL REFERENCES seller_suppliers(id),
    accepted_by uuid NOT NULL REFERENCES users(id),
    accepted_at timestamptz NOT NULL DEFAULT now(),
    is_current boolean NOT NULL DEFAULT true
);
```

The assignment table records the fulfillment party. `orders.accepted_by` records the Sub-Admin who won the first-accept race. They are deliberately separate concepts.

### 6.9 Invoices/order documents and rewards

```sql
CREATE TABLE invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL UNIQUE REFERENCES orders(id),
    document_number varchar(40) NOT NULL UNIQUE,
    status text NOT NULL CHECK (status IN ('pending', 'generated', 'failed')),
    totals_snapshot jsonb NOT NULL,
    file_key text,
    failure_reason text,
    generated_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reward_points (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id),
    order_id uuid NOT NULL REFERENCES orders(id),
    points integer NOT NULL CHECK (points > 0),
    reason varchar(80) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, order_id, reason)
);

CREATE INDEX reward_points_user_idx ON reward_points(user_id, created_at DESC);
```

V1 inserts exactly one point with reason `order_fulfilled` when the accepting Sub-Admin moves the order to `delivered`.

### 6.10 Permissions and settings

```sql
CREATE TABLE sub_admin_permissions (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_key varchar(100) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id, permission_key)
);

CREATE TABLE system_settings (
    setting_key varchar(120) PRIMARY KEY,
    setting_value jsonb NOT NULL,
    is_secret boolean NOT NULL DEFAULT false,
    updated_by uuid REFERENCES users(id),
    updated_at timestamptz NOT NULL DEFAULT now()
);
```

Do not store passwords, JWT secrets, file credentials, payment credentials, or WhatsApp credentials in `system_settings`.

## 7. Transaction Algorithms

### 7.1 Checkout preview

Read-only transaction or normal consistent read:

1. Authenticate customer.
2. Load cart rows and active product rows.
3. Reject inactive, missing, or zero-stock products.
4. Load current stock without reserving it.
5. Calculate item prices, discounts, subtotal, shipping, tax, and total on the server.
6. Return a preview with an expiry timestamp for UI display.
7. Do not create an order or reduce stock.

A preview is not a reservation. The order transaction must repeat every validation.

### 7.2 Create order and reserve stock

`POST /api/v1/me/orders` runs in one PostgreSQL transaction:

1. Lock the customer cart rows for update.
2. Load products and prices.
3. Lock each `product_stock` row in deterministic product-ID order.
4. Recalculate all totals.
5. Reject if any `quantity - reserved_quantity < requested quantity`.
6. Create the order with `order_placed`.
7. Insert immutable order item snapshots.
8. Increment `reserved_quantity` for each product.
9. Insert `stock_reservations` with a configured expiry.
10. Insert the initial status-history row with `from_status = NULL`.
11. Create a pending invoice/document row if document generation is enabled.
12. Clear the customer cart.
13. Commit.
14. Generate the PDF asynchronously after commit, or synchronously only if the product decision requires it.

Order creation is idempotent using the `Idempotency-Key` header. Store the key against the customer and resulting order, or use a dedicated idempotency table.

### 7.3 First-accept race

`POST /api/v1/admin/orders/{orderID}/accept`:

```sql
UPDATE orders
SET accepted_by = $sub_admin_id,
    accepted_at = now(),
    status = 'accepted',
    updated_at = now()
WHERE id = $order_id
  AND status = 'order_placed'
  AND accepted_by IS NULL
RETURNING *;
```

Application behavior:

- One returned row: acceptance succeeded.
- Zero rows: fetch the order; return `ORDER_ALREADY_ACCEPTED` if another Sub-Admin won, or a transition/permission error if it is no longer eligible.
- The winning request inserts `seller_supplier_assignments` only if the fulfillment party is selected in the same operation. If seller/supplier selection is a separate V1 step, the assignment endpoint must be restricted to the accepted Sub-Admin/Super Admin.
- Insert the `order_accepted` status-history row in the same transaction.
- Acceptance is idempotent for the winning Sub-Admin: repeated calls return the current assigned order rather than creating a second assignment.

The HLD says the first Sub-Admin accepts the order and coordinates with the seller/supplier. Therefore the recommended V1 API accepts the order first and allows the accepting Sub-Admin to select/record the seller/supplier immediately afterward.

### 7.4 Assign seller/supplier

Transaction:

1. Lock the order row.
2. Verify caller is the assigned Sub-Admin or Super Admin.
3. Verify order is `accepted` or `processing`.
4. Verify seller/supplier is active.
5. Verify the seller/supplier can supply the requested products when product mappings are configured.
6. Insert/update `seller_supplier_assignments`.
7. Copy the seller/supplier record into `orders.seller_supplier_snapshot`.
8. Release any previous assignment only through an audited reassignment action.
9. Commit.

Pincode is stored and may be used for filtering/reporting. It does not automatically determine the selected party.

### 7.5 Status transition

Transaction:

1. Lock order row.
2. Verify caller role and ownership rule.
3. Check transition matrix.
4. Update status with optimistic version or row lock.
5. Insert status-history row.
6. If new status is `delivered`, insert one reward row for `accepted_by` using `ON CONFLICT DO NOTHING`.
7. If new status is `cancelled`, release reservations in the same transaction.
8. If new status commits stock, update `product_stock.reserved_quantity` and reservation state.
9. Commit.

### 7.6 Reservation expiry worker

A scheduled worker runs every minute:

1. Select expired `reserved` rows using `FOR UPDATE SKIP LOCKED`.
2. Mark reservations `expired`.
3. Decrease `reserved_quantity` by the reserved amount.
4. If the order is still `order_placed`, set it to `cancelled` with system actor and history note `reservation_expired`.
5. Commit each bounded batch.

## 8. RBAC and Permissions

### 8.1 Permission catalog

```text
orders.view_all
orders.accept
orders.view_assigned
orders.assign_seller_supplier
orders.update_status
orders.cancel
orders.return
products.read
products.create
products.update
products.delete
categories.manage
stock.read
stock.adjust
customers.read
customers.manage
seller_suppliers.read
seller_suppliers.manage
invoices.read_all
invoices.download
reports.read
reports.export
analytics.read
sub_admins.manage
rewards.read_own
rewards.read_all
settings.manage
```

### 8.2 Permission rules

| Operation | Customer | Sub-Admin | Super Admin |
| --- | --- | --- | --- |
| Public catalog reads | Public | Public/authenticated | Public/authenticated |
| Create own order | Own customer | Denied | Denied |
| Read own orders | Own customer | Denied | Denied |
| View unaccepted orders | Denied | `orders.view_all` | Always |
| Accept order | Denied | `orders.accept` | Always |
| Update accepted order | Denied | Assigned + `orders.update_status` | Always |
| Cancel/return order | Denied | Denied in V1 | Always |
| Manage catalog/stock | Denied | Denied | Always |
| Manage seller/supplier | Denied | Read-only if permission | Always |
| View own reward points | Denied | `rewards.read_own` | Always |
| View all reward points | Denied | Denied | `rewards.read_all` |

A Sub-Admin must not update another Sub-Admin's accepted order unless a future explicit reassignment/override permission is added.

## 9. API Contract

### 9.1 Common conventions

- Base path: `/api/v1`
- JSON request/response bodies unless downloading a file
- `Authorization: Bearer <access-token>` for authenticated requests
- `Idempotency-Key` required for order creation and recommended for acceptance/status mutation
- IDs are UUID strings
- Dates are ISO-8601 UTC strings
- List endpoints use `page`, `page_size`, `sort`, and allow-listed filters
- Default `page_size = 20`, maximum `page_size = 100`

Common list envelope:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 0,
    "total_pages": 0
  }
}
```

Common error envelope:

```json
{
  "error": {
    "code": "ORDER_ALREADY_ACCEPTED",
    "message": "This order has already been accepted by another Sub-Admin.",
    "details": {}
  },
  "request_id": "uuid"
}
```

### 9.2 Authentication endpoints

#### `POST /api/v1/auth/register`

Request:

```json
{
  "full_name": "Asha Kumar",
  "email": "asha@example.com",
  "phone": "9876543210",
  "password": "strong-password"
}
```

Rules: customer role only, email or phone required, password minimum 8 characters, normalize email lowercase, reject duplicate email/phone.

Responses: `201` user summary and token pair; `400` validation; `409` duplicate identity.

#### `POST /api/v1/auth/login`

Request: `email_or_phone`, `password`.

Responses: `200` token pair and user role; `401` invalid credentials; `403` inactive account.

#### `POST /api/v1/auth/refresh`

Request: refresh token. Rotate refresh token, revoke old token, issue new access/refresh pair.

Responses: `200`; `401` expired, revoked, or invalid token.

#### `POST /api/v1/auth/forgot-password`

Always return `202` with a generic message to avoid account enumeration. Implement delivery only when an approved email/SMS mechanism exists; token persistence remains hashed.

#### `POST /api/v1/auth/reset-password`

Validate one-time token, expiry, and password policy. Revoke all refresh tokens for the user after success.

### 9.3 Public catalog endpoints

#### `GET /api/v1/products`

Query parameters:

```text
page, page_size, q, category_slug, sub_category_slug, brand,
min_price, max_price, availability, sort
```

Allowed sorts: `newest`, `price_asc`, `price_desc`, `name_asc`, `name_desc`.

Only active products and active categories are returned. Response product summaries contain ID, name, slug, SKU, brand, effective price, original price, primary image, availability, and category names.

#### `GET /api/v1/products/{slug}`

Returns full active product, images, specifications, related products, stock availability, and category path. Inactive products return `404` to customers.

#### `GET /api/v1/categories`

Returns active categories and active sub-categories ordered by `sort_order`, then name.

#### `GET /api/v1/search`

Equivalent catalog search endpoint. Search implementation may begin with PostgreSQL `ILIKE`/full-text indexes; do not introduce an external search engine in V1 without a scope change.

### 9.4 Customer endpoints

#### `GET/PUT /api/v1/me/profile`

Customer may update name, email, and phone subject to uniqueness checks. Role, active flag, and password hash are never client-editable.

#### `GET/POST/PUT/DELETE /api/v1/me/addresses`

Address fields: label, recipient name, phone, address lines, city, state, six-digit pincode, default flag. Customer may access only own addresses.

#### `GET/POST/DELETE /api/v1/me/wishlist`

- `POST`: product ID; active product required; duplicate is a successful no-op or `409`, choose one convention and document it.
- `DELETE`: product ID or wishlist item ID.
- `GET`: paginated product summaries.

#### `GET/POST/PUT/DELETE /api/v1/me/cart`

- `GET`: cart items plus server-calculated current totals.
- `POST`: product ID and positive quantity.
- `PUT`: product ID and replacement quantity.
- `DELETE`: product ID.
- Reject quantities over configured maximum and inactive products.

#### `POST /api/v1/me/checkout/preview`

Request:

```json
{
  "address_id": "uuid"
}
```

Response includes address snapshot preview, line items, subtotal, discount, shipping, tax, total, stock warnings, and `expires_at`. It does not create an order.

#### `POST /api/v1/me/orders`

Headers: authenticated customer and `Idempotency-Key`.

Request:

```json
{
  "address_id": "uuid",
  "customer_note": "Please call before delivery"
}
```

The server reads the cart, not client line items. Response `201` returns order summary and status `order_placed`. `409` indicates insufficient stock or reused idempotency key with a different payload.

#### `GET /api/v1/me/orders`

Returns only the authenticated customer's orders. Filters: status, date_from, date_to, sort.

#### `GET /api/v1/me/orders/{orderID}`

Returns order header, item snapshots, address snapshot, seller/supplier status if permitted by product policy, current status, and timeline.

#### `GET /api/v1/me/orders/{orderID}/invoice`

Streams the generated PDF after ownership check. If generation is pending, return `409 DOCUMENT_NOT_READY` or a documented `202` response.

### 9.5 Sub-Admin and Super Admin order endpoints

#### `GET /api/v1/admin/orders`

Permissions: `orders.view_all` or Super Admin.

Filters: status, accepted, accepted_by, customer, order_number, pincode, seller_supplier_id, date range. New unaccepted orders use `status=order_placed&accepted=false`.

#### `GET /api/v1/admin/orders/{orderID}`

Returns operational details, customer contact/address, items, stock status, acceptance owner, seller/supplier, and complete status history.

#### `POST /api/v1/admin/orders/{orderID}/accept`

Permissions: `orders.accept` or Super Admin. Atomic first-wins behavior. Responses:

- `200` accepted by current caller
- `409 ORDER_ALREADY_ACCEPTED` another Sub-Admin won
- `404` order not found
- `403` permission denied

#### `POST /api/v1/admin/orders/{orderID}/seller-supplier`

Permissions: assigned Sub-Admin with `orders.assign_seller_supplier` or Super Admin. Request contains `seller_supplier_id`. This is an internal record operation; no message is sent to the seller/supplier.

#### `POST /api/v1/admin/orders/{orderID}/status`

Request:

```json
{
  "to_status": "processing",
  "note": "Seller confirmed stock"
}
```

Assigned Sub-Admin may update only operational statuses for their order. Super Admin may perform allowed cancellation/return actions. Invalid transitions return `409 ORDER_INVALID_TRANSITION`.

#### `GET /api/v1/admin/orders/{orderID}/invoice`

Permission: `invoices.download` or Super Admin.

### 9.6 Admin master-data endpoints

| Route | Methods | Permission |
| --- | --- | --- |
| `/api/v1/admin/products` | GET, POST | `products.read`, `products.create` |
| `/api/v1/admin/products/{id}` | GET, PUT, DELETE | `products.read`, update/delete |
| `/api/v1/admin/products/{id}/images` | POST, DELETE | Product update |
| `/api/v1/admin/categories` | GET, POST | `categories.manage` |
| `/api/v1/admin/categories/{id}` | PUT, DELETE | `categories.manage` |
| `/api/v1/admin/sub-categories` | GET, POST | `categories.manage` |
| `/api/v1/admin/sub-categories/{id}` | PUT, DELETE | `categories.manage` |
| `/api/v1/admin/seller-suppliers` | GET, POST | Read/manage |
| `/api/v1/admin/seller-suppliers/{id}` | GET, PUT, DELETE | Read/manage |
| `/api/v1/admin/seller-suppliers/{id}/products` | GET, PUT | Read/manage |
| `/api/v1/admin/stock` | GET | `stock.read` |
| `/api/v1/admin/stock/{productID}` | PUT | `stock.adjust` |
| `/api/v1/admin/customers` | GET | `customers.read` |
| `/api/v1/admin/customers/{id}` | GET, PUT | `customers.read/manage` |
| `/api/v1/admin/subadmins` | GET, POST | `sub_admins.manage` |
| `/api/v1/admin/subadmins/{id}` | GET, PUT, DELETE | `sub_admins.manage` |
| `/api/v1/admin/subadmins/{id}/permissions` | PUT | `sub_admins.manage` |

Product delete means deactivate unless no historical references exist. Seller/supplier delete also means deactivate.

### 9.7 Rewards, documents, analytics, and reports

| Route | Method | Result |
| --- | --- | --- |
| `/api/v1/me/rewards` | GET | Current Sub-Admin's ledger and total |
| `/api/v1/admin/rewards` | GET | All Sub-Admin reward totals and ledger |
| `/api/v1/admin/invoices` | GET | Paginated document list |
| `/api/v1/admin/invoices/{id}/download` | GET | PDF stream |
| `/api/v1/admin/dashboard/stats` | GET | KPI counts and revenue/order summaries |
| `/api/v1/admin/analytics/trends` | GET | Daily/monthly order and revenue series |
| `/api/v1/admin/analytics/products` | GET | Product units and revenue |
| `/api/v1/admin/analytics/categories` | GET | Category units and revenue |
| `/api/v1/admin/analytics/seller-suppliers` | GET | Fulfillment-party performance |
| `/api/v1/admin/reports/seller-suppliers` | GET | Filterable report |
| `/api/v1/admin/reports/sales` | GET | Date/product/category/order sales report |
| `/api/v1/admin/reports/export` | GET | CSV export with bounded date range |

Revenue in V1 means order totals for non-cancelled orders. Since payment is deferred, analytics must label values as `order_value` or `sales_value`, not `paid_revenue`.

## 10. Validation and Error Codes

### 10.1 Validation rules

- UUID fields must parse strictly.
- Pincodes must be exactly six digits.
- Phone numbers must pass the configured Indian phone validation rule.
- Prices and quantities must be non-negative/positive as appropriate.
- Page size maximum is 100.
- Sort fields must come from allow-lists.
- Search length is bounded, for example 2-100 characters.
- Uploaded images must pass content type, size, and count limits.
- Product image count is maximum five per product in V1.
- Notes are length-limited and HTML is escaped or rejected.

### 10.2 Stable errors

```text
VALIDATION_FAILED                 400
UNAUTHENTICATED                   401
FORBIDDEN                         403
RESOURCE_NOT_FOUND                404
CONFLICT                          409
ORDER_ALREADY_ACCEPTED            409
ORDER_INVALID_TRANSITION          409
INSUFFICIENT_STOCK                409
DOCUMENT_NOT_READY                409
IDEMPOTENCY_KEY_REUSED            409
RATE_LIMITED                      429
INTERNAL_ERROR                    500
```

Do not expose SQL errors, stack traces, password state, or whether a private account exists.

## 11. Invoice Generation

1. Create `invoices` row in `pending` state after order commit.
2. Build the document from order and immutable snapshots, never live product prices.
3. Render HTML with escaped values.
4. Convert to PDF through the configured adapter.
5. Store the file using a non-guessable key such as `invoices/{order_id}/{document_number}.pdf`.
6. Update invoice row to `generated` with file key and timestamp.
7. On failure, mark `failed` with a safe reason and retry using a bounded job.
8. Download handler checks authorization before opening the file.

Invoice generation must be idempotent on `order_id`. Never create two document numbers for one order.

## 12. Analytics and Reporting Queries

All analytics are deterministic PostgreSQL queries. Use date filters and indexes. Avoid loading raw order items into Go for aggregation.

Required query families:

- Order counts by status and date
- Order value by day/month
- Units and order value by product
- Units and order value by category
- Orders accepted by Sub-Admin
- Fulfillment-party order count and order value
- Customer order count and total order value
- Low-stock and out-of-stock products
- Reward points by Sub-Admin

Exclude cancelled orders from sales/order-value metrics unless a report explicitly requests cancellation totals. Returned orders remain separately identifiable.

## 13. Middleware and Request Pipeline

```text
Request
  -> request ID
  -> panic recovery
  -> access logging/redaction
  -> CORS
  -> rate limit
  -> body size limit
  -> authentication (protected routes)
  -> role/permission middleware
  -> handler validation
  -> service
  -> standardized response
```

Middleware must not make database decisions that belong to services. Permission middleware may load permission claims or a permission provider, but the service must still enforce ownership and state rules.

## 14. Configuration Contract

```text
APP_ENV
APP_PORT
DATABASE_URL
JWT_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRY
JWT_REFRESH_EXPIRY
CORS_ALLOWED_ORIGINS
UPLOAD_DIR
PDF_OUTPUT_DIR
MAX_UPLOAD_BYTES
STOCK_RESERVATION_MINUTES
DEFAULT_SHIPPING_AMOUNT
DEFAULT_TAX_RATE
INVOICE_COMPANY_NAME
INVOICE_COMPANY_ADDRESS
INVOICE_LOGO_KEY
LOG_LEVEL
```

No payment or WhatsApp environment variables are required for V1.

## 15. Background Jobs

V1 jobs:

- Stock reservation expiry
- Pending invoice/document generation and retry
- Optional cleanup of expired refresh/reset tokens
- Optional daily aggregate refresh only if query performance requires it

Jobs must be safe to run more than once. Use row locks or claim columns with `FOR UPDATE SKIP LOCKED`. Do not introduce a distributed queue before a measured need; a database-backed worker is sufficient for V1.

## 16. Testing Strategy and Acceptance Gates

### 16.1 Unit tests

- Price and discount calculation
- Shipping/tax calculation
- Pincode validation
- Order transition matrix
- Permission checks
- Order number generation
- Reward point eligibility
- Invoice number/document data mapping

### 16.2 Repository/integration tests

- Migration applies from empty database
- Unique constraints for email, SKU, slug, cart, wishlist, rewards
- Stock row locking and reservation updates
- Address default uniqueness
- Order snapshots
- Assignment persistence
- Pagination and filters

### 16.3 Concurrency tests

Required first-accept test:

1. Create one `order_placed` order.
2. Start two transactions with different Sub-Admin IDs.
3. Call accept concurrently.
4. Assert exactly one succeeds.
5. Assert exactly one `accepted_by` value exists.
6. Assert exactly one acceptance history row exists.
7. Assert the loser receives a conflict.

Required stock test:

1. Set quantity to 1.
2. Submit two concurrent orders for quantity 1.
3. Assert one succeeds and one receives `INSUFFICIENT_STOCK`.
4. Assert quantity/reserved quantity remain consistent.

### 16.4 API tests

- Customer cannot read another customer's order.
- Sub-Admin cannot modify another Sub-Admin's accepted order.
- Sub-Admin cannot cancel or return in V1.
- Inactive products cannot be ordered.
- Client totals are ignored.
- Repeated order idempotency key does not create a second order.
- Repeated Delivered transition does not award a second point.
- Seller/supplier pincode is persisted and filterable.
- Payment and WhatsApp endpoints do not exist in the V1 route table.

### 16.5 End-to-end acceptance flows

Customer:

1. Register/login.
2. Browse/search/filter catalog.
3. Add wishlist item and move it to cart.
4. Add/update/remove cart items.
5. Save address with pincode.
6. Preview checkout.
7. Place order without payment.
8. View status timeline and download document.

Sub-Admin:

1. Login.
2. View all unaccepted orders.
3. Compete with another Sub-Admin and verify first-accept behavior.
4. Record seller/supplier.
5. Move the owned order through operational statuses.
6. Reach Delivered and verify one reward point.

Super Admin:

1. Manage catalog, stock, seller/supplier records, customers, Sub-Admins, and permissions.
2. View all orders and override permitted operations.
3. View documents, reports, analytics, and reward points.

## 17. Migration Plan

Recommended migration order:

```text
000001_extensions_and_updated_at
000002_users_and_refresh_tokens
000003_user_addresses
000004_categories_and_sub_categories
000005_products_and_product_children
000006_product_stock
000007_seller_suppliers
000008_seller_supplier_products
000009_cart_and_wishlist
000010_orders_and_order_items
000011_order_history_and_assignments
000012_stock_reservations
000013_invoices
000014_rewards_and_permissions
000015_system_settings
000016_indexes_and_constraints_review
```

Seed data:

- One Super Admin from deployment secret/bootstrap command, not a committed password.
- Initial categories only when supplied by the business.
- No sample customer passwords in production.

## 18. Implementation Sequence

Aligned to the project plan, with deferred integration work removed:

1. Days 4-5: finalize migrations, ERD, constraints, indexes, and seed strategy.
2. Days 6-7: freeze this API contract and produce OpenAPI from it.
3. Day 8: scaffold Go modules, config, database, migrations, router, errors, logging.
4. Days 8-9: authentication, refresh tokens, roles, permissions, and middleware.
5. Days 10-11: catalog, images, specifications, search, stock adjustments.
6. Days 12-13: seller/supplier master data and product mappings.
7. Day 14: customer profile, addresses, wishlist.
8. Days 15-16: cart, checkout preview, order creation, stock reservation.
9. Days 17-19: first-accept race-safe allocation, seller/supplier assignment, status transitions, rewards.
10. Day 20: order document/PDF generation.
11. Days 21-22: V1 integration hardening, no payment/WhatsApp implementation; record V2 extension interfaces only.
12. Days 23-24: analytics and reporting.
13. Days 25-26: unit, integration, concurrency, and API testing.
14. Days 27-28: frontend stitching and contract verification.
15. Day 29: end-to-end testing.
16. Day 30: staging sign-off, deployment, smoke tests, and handover.

## 19. LLD Exit Criteria

Implementation may start after:

- Schema migrations and ERD are reviewed.
- The order status matrix is approved.
- First-accept concurrency behavior is covered by an automated test.
- API request/response/error schemas are copied into OpenAPI.
- Permission keys are mapped to every admin route.
- Pincode fields and seller/supplier terminology are approved.
- Invoice/document behavior is approved.
- V1 explicitly contains no payment or WhatsApp implementation.
- Local development, staging variables, and migration commands are documented.

