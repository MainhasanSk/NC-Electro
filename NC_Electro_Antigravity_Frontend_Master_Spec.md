# NC Electro — Antigravity Frontend Design & Implementation Specification

**Document Type:** Frontend UI/UX + Implementation Master Prompt  
**Project:** NC Electro  
**Version:** 1.0  
**Date:** 28 September 2026  
**Primary Build Tool:** Antigravity  
**Frontend Baseline:** Next.js + React  
**Backend Contract:** Go + Chi REST API + PostgreSQL  
**Product Type:** B2C Electronics E-commerce + Same-Day Delivery & Installation Brand

---

# 1. IMPORTANT — HOW TO USE THIS DOCUMENT

This document is the **master frontend specification** for building the NC Electro frontend in Antigravity.

Use this document together with:

- `NC_Electro_HLD.md`
- `NC_Electro_LLD.md`

The HLD and LLD are the technical source of truth for backend behavior, roles, APIs, data, security, and V1 scope.

This document is the **visual, UX, frontend architecture, interaction, component, responsive, and implementation layer** that sits on top of those specifications.

## Antigravity instruction

Do NOT create a generic e-commerce template.

Build NC Electro as a **premium, modern, trustworthy, high-conversion electronics service-commerce brand for Guwahati**.

The website should immediately communicate:

> **Buy Electronics. Get It Delivered. Get It Installed.**

The visual experience should feel closer to a premium technology company + modern local service brand than a traditional electrical shop.

The website must be:

- Eye-catching
- Premium
- Fast
- Mobile-first
- Conversion-focused
- Trust-building
- Extremely easy to navigate
- Product-focused
- Installation/service-focused
- SEO-ready
- Accessible
- Production-ready
- Fully responsive
- Ready to connect to the existing V1 REST API

Do not invent backend capabilities that are not present in the HLD/LLD.

---

# 2. PROJECT SOURCE OF TRUTH

## 2.1 HLD baseline

NC Electro V1 is a B2C e-commerce platform where customers can browse products, manage wishlist/cart, place orders, track orders, and download order documents. Internal users manage products, customers, orders, sellers/suppliers, stock, reports, analytics, and fulfillment.

The approved frontend technology baseline is:

- Customer frontend: Next.js with React
- Admin frontends: Next.js/React
- SEO-critical customer pages should use SSR/SSG
- REST API
- Backend: Go + Chi
- Database: PostgreSQL

Reference: HLD technology and scope. fileciteturn0file0L14-L26 fileciteturn0file0L58-L74

## 2.2 V1 limitations

The frontend MUST NOT implement:

- Online payment gateway
- Payment checkout
- COD workflow
- WhatsApp notification integration
- Seller/supplier login
- Seller/supplier portal
- Automatic nearest seller/supplier allocation
- Multi-supplier fulfillment for one order
- Reward redemption
- Automated gateway refunds

Payment and WhatsApp are V2 items. fileciteturn0file1L43-L52

---

# 3. BUSINESS POSITIONING

## Brand

**NC Electro**

## Primary market

Guwahati, Assam.

## Business proposition

NC Electro sells electronics/electrical products such as:

- CCTV
- Batteries
- Inverters
- Other electrical/electronic materials

The customer experience should emphasize:

1. Product discovery
2. Product availability
3. Fast local delivery
4. Installation/service convenience
5. Trust
6. Easy ordering
7. Transparent product information
8. Order tracking

## Core marketing message

Use a visual hierarchy around:

**Electronics Delivered. Installation Simplified.**

Alternative supporting messages:

- Same-Day Electronics Delivery in Guwahati
- Quality Products. Fast Delivery. Professional Installation.
- From CCTV to Inverters — Get What You Need, Delivered to Your Door.
- Shop Electronics. Schedule Installation. Stay Protected.

Do not claim guaranteed same-day delivery for every product unless the business configuration/API supports it. Present same-day delivery as the core brand promise while allowing product/service availability messaging to remain dynamic.

---

# 4. DESIGN DIRECTION

## 4.1 Overall aesthetic

Create a visual identity that combines:

- Premium technology
- Modern Indian startup
- Local service convenience
- Electronics/engineering
- Trust
- Speed
- Professional installation

Avoid:

- Old-fashioned electrical shop layouts
- Excessive gradients
- Generic marketplace design
- Cluttered product grids
- Tiny typography
- Too many colors
- Cheap-looking icons
- Excessive animation
- Overly dark UI everywhere
- Amazon/Flipkart visual imitation

## 4.2 Visual personality

The interface should feel:

**Bold + Clean + Technical + Trustworthy + Fast**

Use large visual sections, strong typography, high-quality product imagery, controlled whitespace, subtle motion, clear CTAs, and premium cards.

## 4.3 Color system

Use a professional technology-oriented palette.

Recommended foundation:

- Deep Navy / Near Black: primary background and premium sections
- Electric Blue: primary brand/action color
- White: main surface
- Cool Gray: secondary surface
- Green: available/success/same-day/service confirmation
- Amber: warnings/limited stock
- Red: errors/out-of-stock/destructive actions

Do not use every color everywhere.

Primary brand blue should dominate interactive elements.

Create design tokens so the palette can be changed centrally.

Example token system:

```css
--color-primary
--color-primary-hover
--color-primary-soft
--color-dark
--color-surface
--color-surface-muted
--color-border
--color-text
--color-text-muted
--color-success
--color-warning
--color-danger
```

## 4.4 Typography

Use a modern sans-serif font.

Recommended:

- Inter
- Manrope
- Plus Jakarta Sans

Use one primary typeface throughout.

Typography hierarchy:

- Display: 56–76px desktop
- H1: 44–60px
- H2: 32–44px
- H3: 22–30px
- Body: 15–18px
- Small: 12–14px

On mobile, scale responsively.

Use high font weight for:

- Hero headlines
- Product prices
- Key CTAs
- Section headings

---

# 5. CORE UX PRINCIPLES

## 5.1 First-screen rule

When a visitor opens the homepage, within the first viewport they should understand:

1. What NC Electro sells
2. That it serves Guwahati
3. That delivery is fast/local
4. That installation is available
5. Where to shop

The hero must contain a strong CTA.

Primary CTA:

**Shop Electronics**

Secondary CTA:

**Explore Categories**

Optional service CTA:

**Get Installation**

## 5.2 Conversion hierarchy

Primary actions:

- Shop Now
- Add to Cart
- Buy / Order Now
- Checkout
- Track Order

Secondary:

- Add to Wishlist
- View Details
- Compare-like informational interaction only if implemented later

Do not create unsupported backend actions.

## 5.3 Trust hierarchy

Trust elements should appear throughout the experience:

- Same-day delivery messaging
- Installation available
- Genuine products
- Product specifications
- Stock availability
- Local Guwahati service
- Clear order tracking
- Professional support
- Secure account

Do not display fake ratings, fake reviews, fake customer counts, fake certifications, or fake guarantees.

---

# 6. INFORMATION ARCHITECTURE

## Customer website routes

Implement the following major routes:

```text
/
 /about
 /products
 /categories
 /categories/[categorySlug]
 /categories/[categorySlug]/[subCategorySlug]
 /products/[slug]
 /search
 /contact

 /login
 /register
 /forgot-password
 /reset-password

 /account
 /account/profile
 /account/addresses
 /account/wishlist
 /account/cart
 /account/orders
 /account/orders/[orderId]
 /account/orders/[orderId]/invoice

 /checkout
```

The HLD explicitly includes home, about, products, categories, sub-categories, product details, search, contact, policy pages, authentication, account, addresses, wishlist, cart, checkout, orders, order details, and invoice access. fileciteturn0file0L406-L410

---

# 7. GLOBAL WEBSITE STRUCTURE

## 7.1 Desktop header

Create a premium multi-layer header.

### Top utility strip

Small strip:

- "Same-Day Delivery in Guwahati"
- "Professional Installation Available"
- Support/contact indicator

Keep it compact.

### Main navigation

Left:

- NC Electro logo

Center:

- Home
- Shop
- Categories
- Services
- About
- Contact

Right:

- Search
- Wishlist
- Account
- Cart

Use icon + label where useful.

### Search

Search should be visually prominent.

Desktop:

```text
[ 🔍 Search CCTV, inverter, battery, electronics... ]
```

Mobile:

- Search icon in header
- Dedicated search page / search drawer

## 7.2 Mobile header

Use:

- Hamburger
- Logo
- Search
- Cart

The account/wishlist can be accessible from the mobile menu.

Do not overcrowd the mobile header.

---

# 8. HOMEPAGE — PRIMARY MARKETING EXPERIENCE

The homepage is the most important page.

It should not look like a simple product catalog.

It should tell a visual story:

```text
Brand Promise
      ↓
Categories
      ↓
Featured Products
      ↓
Delivery + Installation
      ↓
Trust
      ↓
Popular Products
      ↓
How It Works
      ↓
Service CTA
      ↓
Footer
```

---

# 9. HOMEPAGE HERO SECTION

## Goal

Immediately communicate NC Electro's proposition.

## Recommended composition

Desktop:

Left:

```text
YOUR ELECTRONICS.
DELIVERED TODAY.

Shop CCTV, Inverters, Batteries
and essential electronics with
fast local delivery and installation
support in Guwahati.

[ Shop Electronics ]
[ Explore Categories ]
```

Right:

A premium 3D/product composition showing:

- CCTV camera
- Inverter
- Battery
- Electrical/electronic equipment
- Subtle Guwahati/local delivery cue

Use high-quality realistic product imagery.

Do not use generic stock-photo people as the primary hero visual.

## Hero micro-elements

Add small floating cards:

```text
✓ Fast Local Delivery
✓ Installation Support
✓ Quality Products
```

Use subtle floating animation.

## Hero background

Use:

- Soft dark gradient
- Abstract circuit/electric pattern
- Subtle glow
- Very light grid

Do not make the background visually louder than the product.

---

# 10. TRUST / SERVICE STRIP

Immediately below hero.

Four cards:

### Fast Delivery
Same-day/local delivery messaging

### Professional Installation
Installation support available

### Quality Products
Reliable electronics and electrical products

### Local Service
Serving customers in Guwahati

Use simple line icons.

---

# 11. CATEGORY SECTION

Title:

**Shop by Category**

Subtitle:

**Everything you need to power, protect and secure your space.**

Use large visual category cards.

Possible categories:

- CCTV
- Inverters
- Batteries
- Security
- Electrical
- Accessories
- Other categories supplied by API

IMPORTANT:

Do not hard-code categories if the API provides them dynamically.

Use API categories.

Each card:

- Image
- Category name
- Short descriptor
- Arrow
- Hover animation

Desktop:

3–5 cards depending on width.

Mobile:

Horizontal scroll or 2-column grid.

---

# 12. FEATURED PRODUCTS

Section title:

**Popular Right Now**

Subtitle:

**Top electronics customers are looking for.**

Product cards must be premium.

## Product card anatomy

```text
┌───────────────────────────────┐
│ Wishlist ♡                    │
│                               │
│        PRODUCT IMAGE          │
│                               │
│ [In Stock]                    │
├───────────────────────────────┤
│ Brand                         │
│ Product Name                  │
│ Short descriptor              │
│                               │
│ ₹12,999   ₹15,999  -19%      │
│                               │
│ [ Add to Cart ]               │
└───────────────────────────────┘
```

Product card should support:

- Primary image
- Product name
- Brand
- Effective price
- Original price
- Discount
- Availability
- Wishlist
- Add to cart

These fields are consistent with the LLD catalog response requirements. fileciteturn0file1L793-L810

## Hover

Desktop:

- Image zoom
- Card elevation
- Quick action
- Wishlist state animation

Do not over-animate.

---

# 13. PRODUCT GRID DESIGN

Use a responsive grid.

Desktop:

```text
4 columns
```

Large desktop:

```text
4–5 columns
```

Tablet:

```text
3 columns
```

Mobile:

```text
2 columns
```

For premium products with detailed information, allow 1-column mode when needed.

Every grid must maintain consistent card height.

---

# 14. DELIVERY + INSTALLATION SECTION

Create a visually strong section.

Headline:

**Delivered to Your Door. Installed by Professionals.**

Visual:

A split-screen:

Left:
Product delivery illustration / electronics package

Right:
3-step process

```text
01
Choose Your Product

02
Place Your Order

03
Get Delivery + Installation
```

Use a modern timeline or connected step visual.

Important:

The backend's V1 order workflow tracks operational fulfillment states. The UI should show the customer-facing order journey without pretending that an external seller/supplier is automatically contacted by the system.

---

# 15. FEATURE / SERVICE PROMO SECTION

Create product-specific marketing cards.

Examples:

### CCTV
**Protect What Matters.**

### Inverter
**Power That Doesn't Stop.**

### Battery
**Reliable Backup.**

### Electrical Materials
**The Right Components.**

Each card:

- Large product visual
- Short copy
- Explore button

Only show categories actually returned/configured.

---

# 16. HOW IT WORKS

Use four steps:

```text
01 Browse
Explore electronics

02 Select
Check product specifications and availability

03 Order
Confirm address and place your order

04 Receive
Track delivery and installation progress
```

Use animated line connection.

---

# 17. LOCAL GUWAHATI SECTION

Create a location-oriented section.

Headline:

**Your Local Electronics Partner in Guwahati**

Visual concept:

Stylized Guwahati map outline or abstract city visual.

Do not use an interactive map unless a map integration is explicitly added.

Messaging:

- Local service
- Fast delivery
- Installation support
- Product availability

Avoid making unsupported claims about exact delivery zones unless backend/business configuration provides them.

---

# 18. FINAL CTA

Dark premium section:

```text
Need Electronics Today?

Find the right product for your home,
office or business.

[ Shop Electronics ]
```

Add support/contact CTA if business provides it.

---

# 19. FOOTER

Footer sections:

## Company

- About
- Contact
- Services

## Shop

- Products
- Categories
- Search

## Customer

- My Account
- Wishlist
- Cart
- Orders

## Support

- Contact
- Delivery information
- Installation information
- Policies

## Legal

- Privacy Policy
- Terms
- Shipping/Delivery Policy
- Return Policy

Only show policy pages once their content is supplied by the business.

Footer bottom:

```text
© 2026 NC Electro. All rights reserved.
```

---

# 20. SHOP / PRODUCTS PAGE

Route:

`/products`

Layout:

```text
Breadcrumb
Page Heading
Search / Filter / Sort
---------------------------------
Filters | Product Grid
        | Product Grid
        | Product Grid
Pagination
```

## Filter panel

Supported API filters:

- Search keyword
- Category
- Sub-category
- Brand
- Minimum price
- Maximum price
- Availability
- Sort

The LLD explicitly supports these query parameters. fileciteturn0file1L795-L806

## Sort

Supported:

- Newest
- Price: Low to High
- Price: High to Low
- Name A-Z
- Name Z-A

Do not add unsupported sorting modes.

## Mobile filters

Use bottom sheet:

```text
[ Filter ] [ Sort ]
```

Filter sheet should have:

- Category
- Brand
- Price range
- Availability
- Clear all
- Apply

---

# 21. SEARCH EXPERIENCE

Route:

`/search`

Search UX should feel premium.

Search input:

```text
Search CCTV, inverter, battery...
```

States:

### Initial

Show:

- Popular categories
- Suggested products if supported
- Search guidance

### Loading

Use skeleton cards.

### Results

Show:

```text
Search results for "CCTV"
42 products
```

### Empty

Create a helpful empty state:

```text
We couldn't find that product.

Try searching for:
CCTV
Inverter
Battery
Camera
```

Do not fabricate search result counts.

The LLD allows PostgreSQL search initially; no external search engine is required for V1. fileciteturn0file1L816-L818

---

# 22. CATEGORY PAGE

Route:

`/categories/[categorySlug]`

Structure:

```text
Breadcrumb
Category Hero
Sub-category chips/cards
Product grid
```

Category hero:

- Category image
- Category title
- Description
- Product count if API supplies it

Example:

```text
CCTV Cameras

Secure your home, office and business
with reliable surveillance solutions.
```

Do not hard-code product counts.

---

# 23. SUB-CATEGORY PAGE

Route:

`/categories/[categorySlug]/[subCategorySlug]`

Same structure as category page.

Show:

- Breadcrumb
- Sub-category title
- Description
- Filters
- Product grid
- Pagination

---

# 24. PRODUCT DETAILS PAGE

Route:

`/products/[slug]`

This is a critical conversion page.

Desktop layout:

```text
------------------------------------------------
| Product Gallery | Product Information        |
|                 |                            |
|                 | Brand                      |
|                 | Product Name               |
|                 | Rating area if real data   |
|                 | Price                      |
|                 | Availability               |
|                 | Delivery/Installation     |
|                 | Quantity                   |
|                 | [Add to Cart]             |
|                 | [Order]                   |
------------------------------------------------
| Product Description                          |
| Specifications                               |
| Delivery / Installation information          |
| Related Products                             |
------------------------------------------------
```

## Product gallery

Support:

- Up to five product images in V1
- Thumbnail navigation
- Main image
- Zoom/lightbox
- Keyboard navigation
- Mobile swipe

The HLD limits product uploads to five images in V1. fileciteturn0file0L146-L151

## Product information

Show:

- Brand
- Product name
- SKU where useful
- Price
- Original price
- Discount
- Availability
- Category
- Description
- Key specifications

## CTA hierarchy

Primary:

**Add to Cart**

Secondary:

**Order Now** / equivalent supported ordering CTA

Wishlist:

Heart icon.

## Installation callout

Show:

```text
Installation Available

Need professional installation?
NC Electro can help with installation support.
```

Keep the wording aligned with the business's actual service policy.

## Stock states

### In stock

Green status.

### Low stock

Amber warning.

### Out of stock

Disable ordering and show:

**Currently unavailable**

Do not allow the user to add unavailable products to a new cart.

---

# 25. PRODUCT SPECIFICATIONS

Create a premium specification table.

Example:

| Specification | Value |
|---|---|
| Brand | Example |
| Model | Example |
| Resolution | Example |
| Warranty | Example |

Specifications must come from API data.

Do not invent specification values.

---

# 26. RELATED PRODUCTS

At the bottom:

**You May Also Need**

Use related products from API.

LLD supports related products on product details. fileciteturn0file1L808-L810

---

# 27. WISHLIST

Route:

`/account/wishlist`

Design:

```text
My Wishlist
12 saved products

[Product Card] [Product Card] [Product Card]
```

Each item:

- Image
- Name
- Price
- Availability
- Add to Cart
- Remove

The V1 API supports adding/removing wishlist items and moving wishlist items to cart.

---

# 28. CART

Route:

`/account/cart`

Premium two-column desktop layout.

Left:

Cart items.

Right:

Order summary.

Cart item:

- Image
- Product
- SKU
- Price
- Quantity
- Line total
- Remove

Summary:

```text
Subtotal
Discount
Shipping
Tax
----------------
Total

[Proceed to Checkout]
```

Important:

The frontend must never calculate the authoritative total.

The backend recalculates price, shipping, tax, and total.

The LLD explicitly states client-submitted totals are not trusted. fileciteturn0file1L19-L28

---

# 29. CHECKOUT

Route:

`/checkout`

V1 checkout is NOT a payment gateway checkout.

Do not create:

- Card form
- UPI payment form
- Payment gateway modal
- Payment success page
- Payment webhook UI

## Checkout structure

### Step 1 — Delivery address

Show saved addresses.

```text
+ Add New Address
```

Fields:

- Label
- Recipient name
- Phone
- Address
- City
- State
- Pincode

Pincode must be six digits.

### Step 2 — Order review

Show:

- Products
- Quantity
- Price
- Discount
- Shipping
- Tax
- Total

### Step 3 — Place order

CTA:

**Place Order**

Use a confirmation state.

The LLD confirms V1 order placement is direct and not payment-gated. fileciteturn0file1L844-L869

---

# 30. ORDER SUCCESS PAGE

After successful order creation:

```text
✓ Order Placed

Your order #NCXXXX has been placed successfully.

[ Track Order ]
[ Continue Shopping ]
```

Show:

- Order number
- Date
- Delivery address
- Item summary
- Current status

Do not show fake payment confirmation.

---

# 31. CUSTOMER ORDERS

Route:

`/account/orders`

Card/list view.

Each order:

```text
Order #NC12345
Placed: 28 Sep 2026

3 items
₹12,500

Status:
● Order Placed

[View Order]
```

Filters:

- Status
- Date range
- Sort

The API supports order history and status/date filters. fileciteturn0file1L871-L877

---

# 32. ORDER DETAILS + TRACKING

Route:

`/account/orders/[orderId]`

This should be one of the most polished screens.

## Timeline

```text
✓ Order Placed
  ↓
✓ Accepted
  ↓
✓ Processing
  ↓
○ Ready for Dispatch
  ↓
○ Shipped
  ↓
○ Out for Delivery
  ↓
○ Delivered
```

Statuses are based on the approved V1 order lifecycle. fileciteturn0file0L177-L202

## Timeline design

Use:

- Vertical timeline desktop/mobile
- Completed state
- Current state
- Upcoming state
- Timestamp
- Optional note

Never invent a status.

If an order is cancelled:

Show a separate terminal state.

If returned:

Show returned state.

---

# 33. INVOICE / ORDER DOCUMENT

Customers can download their generated order document.

UI:

```text
Order Document
Invoice / Order PDF

[ Download PDF ]
```

If document is still being generated:

```text
Your document is being prepared.
Please try again shortly.
```

The LLD defines pending/generated/failed document states and an invoice download endpoint. fileciteturn0file1L508-L536

---

# 34. CUSTOMER AUTHENTICATION

## Login

Fields:

- Email or phone
- Password

Actions:

- Login
- Forgot password
- Register

## Register

Fields:

- Full name
- Email
- Phone
- Password

Follow API validation.

## Forgot password

Do not reveal whether an account exists.

Use generic confirmation messaging.

The LLD requires generic `202` behavior for forgot-password to prevent account enumeration. fileciteturn0file1L754-L791

---

# 35. CUSTOMER ACCOUNT

Route:

`/account`

Create premium dashboard.

Show:

```text
Welcome back, [Name]

Recent Orders
Wishlist
Saved Addresses
Profile
```

Cards:

- Total orders
- Active orders
- Wishlist count

Only show values that are actually available from API.

---

# 36. PROFILE PAGE

Allow:

- Name
- Email
- Phone

Do not allow editing:

- Role
- Account status
- Password hash
- Backend-controlled fields

The LLD explicitly restricts role, active flag, and password hash from client editing. fileciteturn0file1L820-L824

---

# 37. ADDRESS MANAGEMENT

Route:

`/account/addresses`

Features:

- Add address
- Edit address
- Delete address
- Set default
- Show pincode clearly

Create polished address cards.

Example:

```text
HOME
Main Hasan
Guwahati, Assam
781001

[Default]

Edit   Delete
```

---

# 38. LOADING STATES

Every data-driven screen must have intentional loading states.

Use skeleton loaders rather than blank pages.

Components:

- ProductCardSkeleton
- ProductDetailsSkeleton
- CategorySkeleton
- OrderSkeleton
- DashboardSkeleton
- TableSkeleton
- ChartSkeleton

Avoid giant spinners unless the entire application is blocked.

---

# 39. EMPTY STATES

Create custom empty states.

Examples:

### Empty cart

```text
Your cart is waiting.

Looks like you haven't added
anything yet.

[Start Shopping]
```

### Empty wishlist

```text
Save products you love.

Tap the heart icon to build
your wishlist.

[Explore Products]
```

### No orders

```text
No orders yet.

Your next electronics purchase
will appear here.

[Shop Now]
```

### No search results

Provide useful suggestions.

---

# 40. ERROR STATES

Use human-friendly messages.

Never show raw API errors.

Map backend error codes to UX messages.

Examples:

```text
ORDER_ALREADY_ACCEPTED
→ This order has already been accepted.

ORDER_INVALID_TRANSITION
→ This order cannot move to that stage.

INSUFFICIENT_STOCK
→ One or more items are no longer available in the requested quantity.

DOCUMENT_NOT_READY
→ Your document is still being prepared.
```

The LLD defines a stable error envelope and specific order conflict behavior. fileciteturn0file1L741-L750

---

# 41. TOAST SYSTEM

Create global toast notifications.

Types:

- Success
- Error
- Warning
- Information

Examples:

```text
✓ Added to cart
✓ Added to wishlist
✓ Address updated
✓ Order placed successfully
⚠ Product quantity updated
✕ Something went wrong
```

Do not use excessive toast notifications.

---

# 42. MODAL SYSTEM

Use reusable modals.

Required:

- Login prompt
- Add address
- Delete confirmation
- Logout confirmation
- Image viewer
- Order action confirmation where needed

Modals must:

- Trap focus
- Close with ESC
- Work on mobile
- Have clear primary/secondary actions

---

# 43. ANIMATION SYSTEM

The site should feel alive, but not distracting.

Use:

- Framer Motion or equivalent
- Fade-up sections
- Staggered product cards
- Button hover
- Image hover
- Subtle page transitions
- Cart badge animation
- Wishlist heart animation
- Timeline progress animation

Do NOT animate:

- Every text line
- Every card continuously
- Large background elements excessively

Respect:

`prefers-reduced-motion`.

---

# 44. MICROINTERACTIONS

Important microinteractions:

### Add to cart

Button:

```text
Add to Cart
```

Then:

```text
✓ Added
```

with subtle animation.

### Wishlist

Heart:

```text
♡ → ♥
```

### Filter

Results update smoothly.

### Order timeline

Current status has subtle pulse.

### Image gallery

Smooth thumbnail transition.

---

# 45. ADMIN APPLICATION

Create a separate professional admin application.

Recommended route prefix:

```text
/admin
```

Do not mix customer and admin visual systems.

Admin should feel like a serious operations dashboard.

---

# 46. ADMIN DESIGN LANGUAGE

Use:

- Dense but readable tables
- Sidebar navigation
- KPI cards
- Charts
- Filters
- Search
- Status badges
- Drawer/detail views
- Confirmation dialogs

Avoid:

- Huge marketing animations
- Excessive whitespace
- Consumer-style hero sections

Admin = operational clarity.

---

# 47. ADMIN SIDEBAR

Main navigation:

```text
Dashboard

Catalog
  Products
  Categories
  Sub-categories

Orders
Customers
Seller / Suppliers
Stock

Invoices
Sales
Analytics
Reports

Rewards

Sub-Admins
Permissions

Settings
```

This maps to the approved admin modules and API route groups. fileciteturn0file0L124-L140

---

# 48. ADMIN DASHBOARD

Route:

`/admin`

Create high-quality dashboard.

Top KPI cards:

- Orders
- Order Value
- Active Orders
- Delivered
- Low Stock
- Out of Stock

Do not label V1 figures as paid revenue because payment is deferred.

Use:

**Order Value** or **Sales Value**

rather than:

**Paid Revenue**

The LLD explicitly requires this distinction. fileciteturn0file1L949-L966

## Charts

Required chart types:

1. Orders over time
2. Order value over time
3. Product performance
4. Category performance
5. Fulfillment-party performance
6. Order status distribution

Support date filters:

- Today
- 7 days
- 30 days
- 3 months
- Custom

Only show periods supported by API.

---

# 49. ADMIN ORDER MANAGEMENT

Route:

`/admin/orders`

Create a powerful operations table.

Columns:

- Order number
- Customer
- Pincode
- Order value
- Status
- Accepted by
- Seller/supplier
- Date
- Actions

Filters:

- Status
- Accepted/unaccepted
- Sub-Admin
- Customer
- Order number
- Pincode
- Seller/supplier
- Date range

These filters are defined in the LLD. fileciteturn0file1L883-L919

---

# 50. UNACCEPTED ORDER EXPERIENCE

This is an important NC Electro operational feature.

New order:

```text
NEW ORDER
#NC12345

Customer: XXXXX
Pincode: 781001
Value: ₹12,500

[ ACCEPT ORDER ]
```

Sub-Admins can see unaccepted orders.

The backend decides the winner using an atomic first-accept operation.

The UI must handle the race correctly.

## If accepted successfully

Show:

```text
✓ Order accepted
You are now responsible for this order.
```

## If another Sub-Admin wins

Show:

```text
Order already accepted

Another Sub-Admin accepted this order first.
```

The first successful acceptance wins. fileciteturn0file0L169-L217

---

# 51. SUB-ADMIN DASHBOARD

Route:

`/sub-admin`

or role-based redirect to the shared operational dashboard.

Show:

- New available orders
- My active orders
- Delivered orders
- Reward points
- Today’s order activity

## My orders

Show:

```text
Accepted
Processing
Ready for Dispatch
Shipped
Out for Delivery
Delivered
```

Sub-Admin must not be allowed to modify another Sub-Admin's accepted order.

The LLD explicitly enforces ownership and permission rules. fileciteturn0file1L698-L712

---

# 52. SUB-ADMIN ORDER DETAIL

Show:

- Order information
- Customer details
- Delivery address
- Pincode
- Items
- Stock information
- Seller/supplier
- Status timeline
- Notes

Actions should depend on permissions.

Do not show unauthorized buttons.

Frontend hiding is not security; backend authorization remains authoritative.

---

# 53. SELLER / SUPPLIER MANAGEMENT

Admin screen:

`/admin/seller-suppliers`

Show:

- Business name
- Contact person
- Phone
- Email
- City
- Pincode
- Active/inactive
- Products supplied

Important:

Seller/supplier does not have a login or portal in V1.

It is internal master data only. fileciteturn0file0L79-L87

---

# 54. SELLER / SUPPLIER ASSIGNMENT

Order detail should provide:

```text
Seller / Supplier

[ Select Seller / Supplier ]

Business
Pincode
Availability
Products supported

[ Assign ]
```

Do not automatically claim nearest-party selection.

V1 stores pincode and supports matching/filtering but does not automatically select by distance. fileciteturn0file0L169-L172

---

# 55. PRODUCT MANAGEMENT ADMIN

Route:

`/admin/products`

Table:

- Image
- Product name
- SKU
- Brand
- Category
- Price
- Discount
- Stock
- Status
- Actions

Actions:

- View
- Edit
- Deactivate

Delete should behave as deactivation when historical references exist.

---

# 56. PRODUCT CREATION / EDIT FORM

Fields:

- Product name
- Slug
- SKU
- Brand
- Category
- Sub-category
- Description
- Price
- Discount price
- Images
- Specifications
- SEO title
- SEO description
- Active state
- Stock
- Low-stock threshold
- Related products

Maximum five product images in V1.

Do not allow discount price greater than original price.

---

# 57. CATEGORY MANAGEMENT

Admin:

- Category list
- Add
- Edit
- Deactivate
- Sort order
- Image
- Description

Sub-category:

- Parent category
- Name
- Slug
- Description
- Image
- Sort order
- Active state

---

# 58. STOCK MANAGEMENT

Route:

`/admin/stock`

Show:

- Product
- Current quantity
- Reserved quantity
- Available quantity
- Low-stock threshold
- Status

Statuses:

```text
In Stock
Low Stock
Out of Stock
```

Do not let the frontend assume availability from a stale cart.

The backend revalidates stock during checkout/order creation.

---

# 59. CUSTOMER MANAGEMENT

Admin screen:

`/admin/customers`

Show:

- Name
- Email
- Phone
- Account status
- Registration date
- Order count if API supplies it

Customer detail:

- Profile
- Addresses
- Orders
- Order value
- Account state

Do not expose unnecessary sensitive data.

---

# 60. INVOICE MANAGEMENT

Route:

`/admin/invoices`

Show:

- Document number
- Order
- Customer
- Status
- Generated date
- Download

States:

- Pending
- Generated
- Failed

---

# 61. REPORTS

Create report interface.

Reports:

- Sales report
- Seller/supplier report
- Product performance
- Category performance
- Customer performance
- Stock report
- Reward points

Allow:

- Date range
- Filters
- Export CSV where supported

The LLD defines bounded CSV export. fileciteturn0file1L949-L966

---

# 62. REWARDS

Sub-Admin:

```text
My Reward Points
24 Points
```

Ledger:

- Order
- Reason
- Date
- Points

V1 reward rule:

**1 point for every fulfilled order at Delivered.**

No redemption UI in V1.

The reward is recorded through an append-only ledger. fileciteturn0file0L173-L175

---

# 63. SUB-ADMIN PERMISSIONS UI

Admin should have a permission management screen.

Permissions include:

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

These keys are defined in the LLD. fileciteturn0file1L662-L693

Use grouped checkbox/toggle sections.

---

# 64. AUTHENTICATION + ROLE REDIRECTION

Shared login endpoint.

After authentication:

```text
customer → customer website/account
sub_admin → sub-admin operations
super_admin → admin dashboard
```

Role is determined from authenticated user data.

Do not rely only on frontend role checks.

Server remains authoritative.

---

# 65. API CLIENT ARCHITECTURE

Create a clean frontend API layer.

Recommended:

```text
src/
  lib/
    api/
      client.ts
      auth.ts
      products.ts
      categories.ts
      search.ts
      wishlist.ts
      cart.ts
      checkout.ts
      orders.ts
      invoices.ts
      admin/
        dashboard.ts
        products.ts
        orders.ts
        stock.ts
        customers.ts
        sellerSuppliers.ts
        analytics.ts
        reports.ts
        rewards.ts
        subAdmins.ts
        settings.ts
```

Do not call `fetch()` directly from every component.

Centralize:

- Base URL
- Auth headers
- Error mapping
- Request ID handling
- Token refresh
- File downloads

---

# 66. API BASE PATH

The LLD's implementation API base is:

```text
/api/v1
```

All frontend API services should use this contract.

Customer routes include:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh

GET /api/v1/products
GET /api/v1/products/{slug}
GET /api/v1/categories
GET /api/v1/categories/{slug}
GET /api/v1/search

GET/PUT /api/v1/me/profile
GET/POST/PUT/DELETE /api/v1/me/addresses
GET/POST/DELETE /api/v1/me/wishlist
GET/POST/PUT/DELETE /api/v1/me/cart
POST /api/v1/me/checkout/preview
POST /api/v1/me/orders
GET /api/v1/me/orders
GET /api/v1/me/orders/{orderID}
GET /api/v1/me/orders/{orderID}/invoice
```

Follow the LLD contract exactly. fileciteturn0file1L754-L881

---

# 67. STATE MANAGEMENT

Use a clean state strategy.

Recommended:

- Server data: TanStack Query / React Query
- UI state: Zustand or React Context where appropriate
- Form state: React Hook Form
- Validation: Zod

Do not create a huge global store.

Suggested stores:

```text
authStore
cartStore
wishlistStore
uiStore
```

Server state remains in the query layer.

---

# 68. AUTH TOKEN HANDLING

Implement:

- Short-lived access token
- Refresh token
- Automatic refresh on expiration
- Logout
- Unauthorized state

HLD baseline:

- Access token: 15 minutes
- Refresh token: 7 days

Refresh tokens must be handled securely. fileciteturn0file0L363-L373

Never expose secrets in client-side code.

---

# 69. TYPESCRIPT DATA MODELS

Create TypeScript interfaces/types aligned with API schemas.

Examples:

```ts
User
Product
Category
SubCategory
ProductImage
ProductSpecification
CartItem
WishlistItem
Address
Order
OrderItem
OrderStatusHistory
SellerSupplier
Invoice
RewardPoint
Pagination
ApiError
```

Do not duplicate models unnecessarily.

---

# 70. PRODUCT TYPE

Conceptually:

```ts
type Product = {
  id: string
  name: string
  slug: string
  sku: string
  brand?: string
  description?: string
  price: number
  discountPrice?: number
  primaryImage?: string
  availability: Availability
  category: CategorySummary
  subCategory?: SubCategorySummary
}
```

Use decimal-safe handling for money where required by the API.

Do not use frontend floating-point arithmetic as the authoritative source for totals.

---

# 71. ORDER STATUS TYPE

Use exact backend values:

```ts
type OrderStatus =
  | "order_placed"
  | "accepted"
  | "processing"
  | "ready_for_dispatch"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
```

Create a centralized UI mapping:

```ts
orderStatusConfig
```

containing:

- Label
- Description
- Icon
- Visual state
- Allowed customer-facing message

---

# 72. RESPONSIVE DESIGN

The entire application must be mobile-first.

Breakpoints:

```text
Mobile: < 640px
Tablet: 640–1024px
Desktop: 1024–1440px
Large: > 1440px
```

Do not simply shrink desktop.

Recompose layouts for mobile.

---

# 73. MOBILE CUSTOMER EXPERIENCE

Mobile homepage:

```text
Header
Hero
Quick categories
Featured products
Delivery/installation
Popular products
How it works
CTA
Footer
```

Product grid:

2 columns.

Sticky mobile cart/checkout action where appropriate.

Product detail:

- Image first
- Price
- Availability
- CTA
- Description
- Specs

Use a sticky bottom CTA for product purchase:

```text
[ Add to Cart ]
```

---

# 74. MOBILE CHECKOUT

Make checkout extremely simple.

Avoid unnecessary steps.

Use:

```text
Address
↓
Review
↓
Place Order
```

No payment step in V1.

---

# 75. ADMIN RESPONSIVENESS

Admin must support tablet and desktop.

On mobile:

- Sidebar becomes drawer
- Tables become cards or horizontal scroll
- Filters become bottom sheets
- Actions remain accessible
- KPI cards become horizontal/stacked

Do not allow critical admin functionality to disappear on mobile.

---

# 76. ACCESSIBILITY

Follow WCAG-oriented principles.

Required:

- Keyboard navigation
- Visible focus states
- Proper semantic HTML
- ARIA labels for icon buttons
- Accessible form labels
- Sufficient contrast
- Alt text
- Error announcements
- Modal focus management
- Reduced motion support

Product images must have meaningful `alt` text.

The HLD explicitly requires semantic HTML and optimized images with alt text. fileciteturn0file0L406-L410

---

# 77. SEO

Customer-facing catalog pages must be SEO-ready.

Implement:

- SSR/SSG where appropriate
- Metadata
- Dynamic product titles
- Dynamic descriptions
- Canonical URLs
- Semantic HTML
- Open Graph metadata
- Twitter/social metadata
- Sitemap
- robots.txt
- Clean slugs
- Image alt text
- Structured data where appropriate and supported by actual product information

Admin pages must not be indexed.

The HLD explicitly requires SSR/SSG catalog pages, canonical URLs, metadata, sitemap, robots.txt, and non-indexed admin pages. fileciteturn0file0L392-L410

---

# 78. PERFORMANCE

Target a fast experience.

Priorities:

1. Optimized images
2. Lazy loading below the fold
3. Server rendering where beneficial
4. Code splitting
5. Avoid giant JS bundles
6. Skeleton loading
7. Prefetch important navigation
8. Avoid unnecessary client components
9. Use responsive image sizes
10. Avoid heavy animation libraries unless justified

Do not sacrifice page speed for visual effects.

---

# 79. IMAGE SYSTEM

Product imagery is critical.

Use:

- `next/image`
- Responsive image sizes
- WebP/AVIF where supported
- Proper dimensions
- Lazy loading
- Priority loading only for hero/critical images

Do not stretch product images.

Maintain consistent product-card image aspect ratio.

Recommended:

```text
1:1
```

Product detail gallery can use:

```text
4:3 or 1:1
```

---

# 80. DESIGN SYSTEM COMPONENTS

Create reusable components.

## Layout

```text
Container
Section
PageHeader
Breadcrumbs
Footer
Header
MobileNav
```

## Buttons

```text
PrimaryButton
SecondaryButton
GhostButton
DangerButton
IconButton
```

## Product

```text
ProductCard
ProductGrid
ProductGallery
ProductPrice
ProductAvailability
ProductSpecifications
RelatedProducts
WishlistButton
AddToCartButton
```

## Commerce

```text
CartItem
CartSummary
CheckoutAddress
OrderSummary
OrderTimeline
OrderCard
```

## UI

```text
Modal
Drawer
Toast
Tabs
Accordion
Skeleton
EmptyState
ErrorState
Badge
Tooltip
Pagination
```

## Admin

```text
AdminSidebar
AdminHeader
KpiCard
DataTable
FilterBar
StatusBadge
ChartCard
DetailDrawer
```

---

# 81. COMPONENT QUALITY RULE

Do not create duplicated components.

For example:

Bad:

```text
HomeProductCard
SearchProductCard
CategoryProductCard
WishlistProductCard
```

Prefer:

```text
ProductCard
```

with controlled variants:

```tsx
<ProductCard variant="default" />
<ProductCard variant="compact" />
```

---

# 82. DESIGN TOKENS

Create centralized tokens for:

- Colors
- Typography
- Radius
- Shadows
- Spacing
- Breakpoints
- Motion duration

Example:

```text
radius-sm
radius-md
radius-lg
radius-xl

shadow-sm
shadow-md
shadow-lg

space-1
space-2
space-3
...
```

Use consistent spacing.

---

# 83. CARD DESIGN

Avoid excessive rounded cards.

Recommended:

- 14–24px radius for premium feature cards
- 12–16px for product cards
- Minimal border
- Subtle shadow
- Clear hover state

Do not use strong shadows everywhere.

---

# 84. ICONOGRAPHY

Use one icon system.

Recommended:

- Lucide React

Icons should be:

- Consistent
- Simple
- Accessible
- Never used as the only explanation for critical actions

---

# 85. DATA FETCHING RULES

For public catalog:

Prefer server-side fetching for SEO-critical pages.

For interactive screens:

Use client data fetching with caching.

Avoid refetching identical data unnecessarily.

Cache:

- Categories
- Product details
- Product lists where appropriate

Do not cache user-specific sensitive data incorrectly.

---

# 86. PAGINATION

Use API pagination.

Default:

```text
page_size = 20
```

Maximum:

```text
100
```

The LLD defines this contract. fileciteturn0file1L714-L725

For customer product browsing, either:

- Traditional pagination
- Load more

Use traditional pagination for SEO-indexable catalog pages unless there is a strong UX reason otherwise.

---

# 87. FILTER URL SYNCHRONIZATION

Product filter state should be reflected in the URL.

Example:

```text
/products?
category_slug=cctv
brand=hikvision
min_price=1000
max_price=10000
availability=in_stock
sort=price_asc
page=1
```

This allows:

- Shareable searches
- Browser back/forward
- SEO-safe canonical handling
- Better UX

Only allow supported filter parameters.

---

# 88. BREADCRUMBS

Use on:

- Category pages
- Sub-category pages
- Product pages
- Account pages
- Admin detail pages

Example:

```text
Home
→ CCTV
→ Security Cameras
→ Product Name
```

---

# 89. SECURITY UX

Never expose:

- JWT secrets
- Database details
- Internal IDs unnecessarily
- Raw stack traces
- Password information

Do not rely on route hiding for security.

Backend remains authoritative.

The HLD explicitly states frontend route hiding is not an authorization control. fileciteturn0file0L109-L109

---

# 90. API ERROR HANDLING

Create one global API error mapper.

Input:

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

Map to user-friendly UI.

Keep `request_id` available for support/debugging where useful.

---

# 91. CONCURRENCY UX — FIRST ACCEPT

The UI must expect concurrent acceptance.

Flow:

```text
Order appears
      ↓
Sub-Admin clicks Accept
      ↓
Disable button
      ↓
API request
      ↓
Success → Assigned to me
      OR
Conflict → Another Sub-Admin accepted
```

Never show success before API confirmation.

Never simulate acceptance locally.

---

# 92. CART / STOCK CONCURRENCY UX

A product may become unavailable after being added to cart.

At checkout:

```text
Validate
↓
If stock changed:
Show clear warning
↓
Ask customer to update cart
```

Never assume the cart guarantees inventory.

---

# 93. ORDER STATUS UX

Use exact lifecycle.

Customer-facing:

```text
Order Placed
Accepted
Processing
Ready for Dispatch
Shipped
Out for Delivery
Delivered
```

Exception:

```text
Cancelled
Returned
```

Do not allow arbitrary status jumps from UI.

Backend transition matrix is authoritative. fileciteturn0file1L149-L165

---

# 94. ADMIN TABLE UX

Tables must have:

- Sticky header
- Search
- Filters
- Sort
- Pagination
- Row hover
- Status badges
- Action menu
- Responsive behavior
- Empty state
- Loading state

For mobile, convert important rows to cards rather than forcing an unreadable table.

---

# 95. DASHBOARD CHART UX

Charts must have:

- Clear title
- Date range
- Tooltip
- Legend when needed
- Empty state
- Loading state
- No-data state

Avoid chart overload.

Every chart must answer one business question.

---

# 96. FORM UX

All forms must:

- Validate inline
- Show required fields
- Preserve entered data after non-fatal errors
- Disable submit during request
- Show success state
- Show API error
- Have accessible labels

Never use browser-default ugly validation alone.

---

# 97. RESPONSIVE NAVIGATION

Desktop:

Full navigation.

Tablet:

Reduced navigation + search.

Mobile:

Drawer navigation.

Mobile drawer:

```text
Home
Shop
Categories
Services
About
Contact

Account
Wishlist
Orders
Cart
```

---

# 98. GLOBAL SEARCH UX

Desktop search can open a command-style search overlay.

Example:

```text
Search NC Electro

[ Search products... ]

Popular:
CCTV
Inverter
Battery
```

When typing:

```text
Products
Categories
```

Only show actual API results.

---

# 99. INSTALLATION SERVICE UX

Installation is an important business differentiator.

Use service messaging in:

- Homepage
- Product details
- Cart
- Order detail
- Service/landing sections

But keep operational behavior consistent with backend scope.

If the backend does not expose an independent installation booking workflow, do NOT create a fake booking system.

Instead present installation as a service feature associated with the product/order.

---

# 100. SAME-DAY DELIVERY UX

Use same-day delivery as a prominent marketing differentiator.

Possible UI:

```text
⚡ Same-Day Delivery in Guwahati
```

On product page:

```text
Fast Local Delivery
Availability depends on product and service area.
```

Avoid promising same-day delivery for every product unless business rules/API data confirm eligibility.

---

# 101. CONTENT TONE

NC Electro copy should be:

- Short
- Confident
- Modern
- Helpful
- Local
- Professional

Avoid:

- Corporate jargon
- Long paragraphs
- Overpromising
- Fake urgency
- Fake scarcity

Examples:

Good:

> Power through the day with dependable backup solutions.

Bad:

> BUY NOW!!! LIMITED!!! BEST DEAL EVER!!!

---

# 102. GUWAHATI LOCALIZATION

Use Indian conventions:

- ₹ currency
- Indian phone number formatting
- Indian six-digit pincode
- Assam/Guwahati references where appropriate

The backend validates Indian phone/pincode rules. fileciteturn0file1L970-L979

Do not hard-code a single pincode.

---

# 103. PRODUCT PRICE DISPLAY

Example:

```text
₹12,499
₹15,999
19% OFF
```

Only show discount percentage when calculated from valid API prices.

Use:

```text
discount_price
price
```

according to API semantics.

---

# 104. PRODUCT AVAILABILITY DISPLAY

Use clear states:

```text
● In Stock
● Low Stock
● Out of Stock
```

Do not show exact quantity publicly unless the business explicitly wants that.

---

# 105. SEO-FRIENDLY URLS

Use:

```text
/products/hikvision-2mp-cctv-camera
/categories/cctv
/categories/cctv/security-cameras
/search?q=cctv
```

Do not expose database UUIDs in public URLs.

The backend already uses product/category slugs.

---

# 106. IMAGE ALT TEXT

Generate from real product data.

Example:

```text
Hikvision 2MP CCTV camera
```

Do not use:

```text
image1
photo
product
```

---

# 107. PAGE METADATA

Product page:

```text
<title>{Product Name} | NC Electro</title>
<meta description="{Product description}">
```

Category:

```text
<title>{Category} | NC Electro</title>
```

Search pages should have controlled indexing behavior according to SEO strategy.

---

# 108. 404 PAGE

Create premium branded 404.

```text
404

Looks like this circuit
lost its connection.

The page you're looking for
isn't available.

[ Go Home ]
[ Shop Electronics ]
```

Use subtle electronics/circuit visual.

---

# 109. GLOBAL ERROR PAGE

Create branded fallback:

```text
Something went wrong.

We're having trouble loading
this page.

[ Try Again ]
```

Do not expose technical details.

---

# 110. MAINTENANCE / OFFLINE STATES

Create reusable maintenance state.

For temporary API failure:

```text
NC Electro is having trouble connecting.

Please try again.
```

Avoid making the whole website look broken when only one API request fails.

---

# 111. DESIGN QUALITY BAR

Before considering a screen complete, verify:

- Is the hierarchy obvious?
- Is the primary action obvious?
- Does it feel like NC Electro?
- Does it look premium?
- Does it work on mobile?
- Does it have loading state?
- Does it have empty state?
- Does it have error state?
- Does it handle long product names?
- Does it handle missing images?
- Does it handle out-of-stock?
- Does it handle slow API?
- Does it use real API data?
- Is it accessible?
- Is it SEO-friendly where required?

---

# 112. DO NOT USE FAKE DATA IN PRODUCTION

During development, mock data may be used temporarily.

Clearly isolate mock data:

```text
mock/
```

Once API integration begins, all production-facing data must come from the backend.

Do not permanently hard-code:

- Products
- Categories
- Prices
- Stock
- Order counts
- Customer counts
- Analytics
- Seller/supplier data

---

# 113. API FALLBACK RULE

If the backend API is unavailable:

- Show loading state
- Show retry
- Show friendly error
- Do not fabricate data

---

# 114. FILE / PROJECT STRUCTURE

Recommended:

```text
nc-electro-frontend/
│
├── app/
│   ├── (storefront)/
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── categories/
│   │   ├── search/
│   │   ├── about/
│   │   ├── contact/
│   │   └── account/
│   │
│   ├── admin/
│   ├── sub-admin/
│   │
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── order/
│   └── admin/
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── utils/
│   └── constants/
│
├── hooks/
├── stores/
├── types/
├── config/
├── styles/
└── public/
```

Adapt the exact structure to Antigravity's generated project while preserving the architectural separation.

---

# 115. ROUTE PROTECTION

Protected customer routes:

```text
/account/*
/checkout
```

Protected admin routes:

```text
/admin/*
```

Protected sub-admin routes:

```text
/sub-admin/*
```

Role checks should exist at:

1. Route layer
2. API client/service layer where appropriate
3. Backend authorization

Frontend checks are UX protection, not security.

---

# 116. ADMIN / CUSTOMER VISUAL SEPARATION

Customer:

**Marketing + Shopping + Trust**

Admin:

**Operations + Data + Control**

Sub-admin:

**Orders + Fulfillment + Speed**

Do not make all three interfaces visually identical.

They can share:

- Typography
- Color tokens
- Buttons
- Basic components

But their information architecture must be different.

---

# 117. CUSTOMER NAVIGATION PRIORITY

Highest priority:

```text
Shop
Categories
Search
Cart
Account
```

Secondary:

```text
About
Contact
Services
Policies
```

---

# 118. ADMIN NAVIGATION PRIORITY

Highest priority:

```text
Orders
Products
Stock
Dashboard
```

Secondary:

```text
Customers
Seller/Suppliers
Analytics
Reports
Invoices
```

Management:

```text
Sub-Admins
Permissions
Settings
```

---

# 119. FRONTEND IMPLEMENTATION ORDER

Build in this order:

## Phase 1 — Foundation

- Next.js setup
- TypeScript
- Tailwind/CSS system
- Design tokens
- Fonts
- Icons
- Global layout
- Header
- Footer

## Phase 2 — Storefront

- Homepage
- Category pages
- Product listing
- Search
- Product detail
- Wishlist
- Cart

## Phase 3 — Customer account

- Login
- Register
- Profile
- Addresses
- Orders
- Order detail
- Invoice

## Phase 4 — Checkout

- Checkout preview
- Address
- Review
- Place order
- Success page

## Phase 5 — Admin

- Admin auth
- Dashboard
- Orders
- Products
- Categories
- Stock
- Customers
- Seller/suppliers
- Invoices
- Analytics
- Reports

## Phase 6 — Sub-admin

- Dashboard
- New orders
- Accept
- Assigned orders
- Seller/supplier assignment
- Status updates
- Rewards

## Phase 7 — Polish

- Responsive
- Accessibility
- SEO
- Loading states
- Empty states
- Error states
- Animation
- Performance

## Phase 8 — Integration

- API contract verification
- Auth
- Token refresh
- Error mapping
- Concurrency behavior
- End-to-end testing

---

# 120. ACCEPTANCE TESTS — CUSTOMER

The customer flow must support:

1. Register
2. Login
3. Browse products
4. Search
5. Filter
6. Sort
7. View category
8. View product
9. View specifications
10. Add wishlist
11. Remove wishlist
12. Move wishlist item to cart
13. Add cart item
14. Change quantity
15. Remove cart item
16. Save address
17. Preview checkout
18. Place order without payment
19. View order
20. Track status
21. Download invoice/order document

These flows are aligned with the LLD's end-to-end customer acceptance flow. fileciteturn0file1L1142-L1153

---

# 121. ACCEPTANCE TESTS — SUB-ADMIN

1. Login
2. View available orders
3. Accept order
4. Correctly handle race/conflict
5. View assigned order
6. Assign seller/supplier
7. Update order status
8. Reach Delivered
9. Receive one reward point
10. Cannot modify another Sub-Admin's accepted order
11. Cannot cancel/return in V1

---

# 122. ACCEPTANCE TESTS — SUPER ADMIN

1. Login
2. View dashboard
3. Manage products
4. Manage categories
5. Manage stock
6. Manage seller/suppliers
7. View customers
8. Manage Sub-Admins
9. Manage permissions
10. View all orders
11. Perform permitted order operations
12. View invoices
13. View analytics
14. View reports
15. Export reports
16. View reward points

---

# 123. CRITICAL BUSINESS RULES FOR FRONTEND

Never violate these:

### Rule 1

Frontend does not decide authoritative pricing.

### Rule 2

Frontend does not decide authoritative stock.

### Rule 3

Frontend does not decide who wins order acceptance.

### Rule 4

Frontend does not automatically select nearest seller/supplier.

### Rule 5

Frontend does not implement payment in V1.

### Rule 6

Frontend does not implement WhatsApp in V1.

### Rule 7

Frontend does not provide seller/supplier login in V1.

### Rule 8

Frontend does not provide reward redemption in V1.

### Rule 9

Frontend does not bypass backend permissions.

### Rule 10

Frontend must use exact backend order states.

---

# 124. PERFORMANCE TARGET

The HLD targets:

- API p95 under 300ms for normal reads where feasible
- 99.5% production availability target
- Responsive mobile-first support
- SEO-ready SSR/SSG
- OWASP-oriented security baseline

Frontend implementation should support these goals rather than undermine them with unnecessary client-side complexity. fileciteturn0file0L392-L404

---

# 125. FINAL ANTIGRAVITY BUILD INSTRUCTION

When generating the application:

> Build the complete NC Electro frontend from this document and the supplied HLD/LLD.
>
> Do not create a generic electronics e-commerce website.
>
> Create a premium, visually striking, conversion-focused Indian electronics commerce experience designed for Guwahati.
>
> Prioritize:
>
> 1. Exceptional homepage
> 2. Premium product discovery
> 3. Excellent product cards
> 4. Powerful search/filter experience
> 5. High-converting product detail page
> 6. Extremely simple cart and checkout
> 7. Beautiful order tracking
> 8. Strong same-day delivery + installation positioning
> 9. Professional admin dashboard
> 10. Fast sub-admin order operations
> 11. Mobile-first UX
> 12. SEO
> 13. Accessibility
> 14. Performance
> 15. Clean component architecture
>
> Use real backend API contracts from the HLD/LLD.
>
> Do not invent unsupported backend functionality.
>
> Do not implement payment or WhatsApp in V1.
>
> Do not create seller/supplier login.
>
> Do not create reward redemption.
>
> Do not fabricate product, stock, analytics, customer, or order data in production.
>
> Build reusable components instead of page-specific duplicated components.
>
> Use polished loading, empty, error, success, and responsive states.
>
> The final interface should look like a serious technology company that happens to sell electronics — not like a traditional electrical shop.
>
> Make the design memorable, premium, modern, trustworthy and extremely easy to use.

---

# 126. FINAL QUALITY CHECKLIST

Before declaring the frontend complete:

## Brand

- [ ] NC Electro identity is consistent
- [ ] Premium technology aesthetic
- [ ] Guwahati/local service positioning
- [ ] Delivery + installation proposition visible

## Customer

- [ ] Homepage
- [ ] Categories
- [ ] Products
- [ ] Search
- [ ] Filters
- [ ] Sorting
- [ ] Product detail
- [ ] Wishlist
- [ ] Cart
- [ ] Checkout
- [ ] Authentication
- [ ] Account
- [ ] Addresses
- [ ] Orders
- [ ] Order tracking
- [ ] Invoice download

## Admin

- [ ] Dashboard
- [ ] Products
- [ ] Categories
- [ ] Orders
- [ ] Customers
- [ ] Seller/suppliers
- [ ] Stock
- [ ] Invoices
- [ ] Analytics
- [Reports
- [ ] Rewards
- [ ] Sub-admins
- [ ] Permissions
- [ ] Settings

## Sub-admin

- [ ] Dashboard
- [ ] Available orders
- [ ] Accept order
- [ ] First-accept conflict
- [ ] Assigned orders
- [ ] Seller/supplier assignment
- [ ] Status updates
- [ ] Reward points

## UX

- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Success states
- [ ] Toasts
- [ ] Modals
- [ ] Mobile drawer
- [ ] Responsive filters
- [ ] Accessible forms
- [ ] Keyboard navigation

## Technical

- [ ] API layer centralized
- [ ] TypeScript types
- [ ] Auth refresh
- [ ] Protected routes
- [ ] Server/client boundaries
- [ ] SEO metadata
- [ ] Sitemap
- [ ] Robots
- [ ] Canonical URLs
- [ ] Optimized images
- [ ] Error handling
- [ ] No secrets in frontend
- [ ] No fake production data

## V1 scope

- [ ] No payment gateway
- [ ] No COD
- [ ] No WhatsApp integration
- [ ] No seller portal
- [ ] No automatic nearest seller selection
- [ ] No multi-supplier fulfillment
- [ ] No reward redemption

---

# 127. HANDOFF PRINCIPLE

The final frontend must be **API-contract-driven, visually premium, and production-oriented**.

The visual layer may be creative.

The business rules may not.

Where there is a conflict:

1. Approved HLD
2. Approved LLD
3. API contract
4. This UI/UX specification
5. Visual creativity

This ensures NC Electro can achieve an extraordinary user experience without breaking the approved V1 architecture.

---

# END OF DOCUMENT
