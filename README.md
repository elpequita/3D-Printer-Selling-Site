# 3D Creations PR — Custom 3D Printing Services Website

## Project Overview
- **Business**: 3D Creations PR – Puerto Rico-based custom 3D printing studio
- **Contact**: 📞 787-403-1552 | ✉️ carlos.perez@dataurea.com
- **Tech Stack**: Hono (TypeScript) + Cloudflare Workers/Pages + D1 SQLite
- **Framework**: Hono v4 on Cloudflare Workers edge runtime

---

## 🚀 Live URLs (Development)
- **Homepage**: `http://localhost:3000/`
- **Products**: `http://localhost:3000/products`
- **3D Preview Tool**: `http://localhost:3000/preview`
- **Checkout**: `http://localhost:3000/checkout`
- **Contact**: `http://localhost:3000/contact`
- **Admin Panel**: `http://localhost:3000/admin` (PIN: `1234`)

---

## ✅ Completed Features

### Frontend
- [x] **Modern responsive homepage** with hero section, featured products, categories, how-it-works
- [x] **Product catalog** with filtering by category, material, search
- [x] **Individual product detail pages** with image gallery, specs, and tabs
- [x] **Shopping cart** (localStorage) with quantity management, subtotal, tax, shipping
- [x] **Checkout page** with full customer form + PayPal integration
- [x] **Order success page** with next-steps timeline
- [x] **Contact page** with business info (phone: 787-403-1552, email: carlos.perez@dataurea.com)
- [x] **3D Preview Tool** — upload image, choose material/color/style, visual effects (metallic, glossy, wireframe, blueprint)
- [x] **Admin Panel** (PIN protected) — dashboard, CRUD for products, order management, customer list, messages, settings

### Backend (API Routes)
| Route | Method | Description |
|-------|--------|-------------|
| `/api/products` | GET | List products (filter by category, material, search) |
| `/api/products/categories` | GET | List all categories |
| `/api/products/materials` | GET | List all materials |
| `/api/products/:slug` | GET | Get product by slug |
| `/api/products` | POST | Create product (admin) |
| `/api/products/:id` | PUT | Update product (admin) |
| `/api/products/:id` | DELETE | Delete product (admin) |
| `/api/orders` | POST | Create new order |
| `/api/orders/:id/payment` | POST | Confirm PayPal payment |
| `/api/orders/:number/track` | GET | Track order by number |
| `/api/orders` | GET | List orders (admin) |
| `/api/orders/:id/status` | PUT | Update order status (admin) |
| `/api/admin/login` | POST | Admin PIN login |
| `/api/admin/dashboard` | GET | Dashboard stats |
| `/api/admin/settings` | GET/PUT | Site settings |
| `/api/admin/customers` | GET | Customer list |
| `/api/admin/contacts` | GET | Contact messages |
| `/api/admin/init` | POST | Initialize DB with seed data |
| `/api/preview` | POST | Submit 3D preview request |
| `/api/contact` | POST | Submit contact form |

---

## 🗄️ Database Schema (SQLite / D1)

### Tables
| Table | Description |
|-------|-------------|
| `products` | Product catalog (name, slug, description, material, color, price, availability, customizable) |
| `product_images` | Product images (url, alt_text, is_primary, sort_order) |
| `categories` | Product categories (name, slug, icon, sort_order) |
| `materials` | Material library (PLA, ABS, PETG, TPU, Resin, Nylon) |
| `customers` | Customer profiles (email, name, address, total_orders, total_spent) |
| `orders` | Orders (number, status, payment_status, paypal_ids, totals, shipping) |
| `order_items` | Order line items (product, quantity, price, customization) |
| `preview_requests` | 3D preview tool submissions (image, style, material, color) |
| `contact_messages` | Contact form submissions |
| `admin_users` | Admin accounts |
| `site_settings` | Key-value site configuration store |

### Migration Files
- `migrations/0001_initial_schema.sql` — Full schema with indexes
- `migrations/0002_seed_data.sql` — Sample categories, materials, products, settings

---

## 💳 Payments (PayPal)

**Setup PayPal:**
1. Go to [developer.paypal.com](https://developer.paypal.com) and create an app
2. Copy your **Live Client ID**
3. Go to Admin Panel → Settings → PayPal Client ID
4. Enter your client ID and save

**Current behavior (no Client ID):**
- Sandbox PayPal buttons load in test mode
- A fallback "Pay with PayPal" button is shown after 3 seconds
- All order creation + tracking still works

**Tax Rate:** 11.5% (Puerto Rico) — configurable in Admin Settings  
**Free shipping threshold:** $100 — configurable in Admin Settings

---

## 🔐 Admin Panel

**Access:** `/admin`  
**Default PIN:** `1234` (change in Settings after first login)

### Features
- **Dashboard** — Stats (products, orders, revenue, customers), recent orders
- **Products** — Full CRUD (add, edit, delete, mark featured/available)
- **Orders** — View all orders, filter by status, update order status
- **Categories** — View product categories with counts
- **Customers** — View customer list with order counts and spending
- **Messages** — View contact form submissions, reply via email
- **Settings** — Edit site name, phone, email, PayPal ID, tax rate, shipping, admin PIN
- **Init DB** — Button to initialize database tables and seed sample data

---

## 🖨️ 3D Preview Tool

**URL:** `/preview`

1. Upload an image (drag & drop or click)
2. Choose print style (Standard, Detailed, Artistic, Functional)
3. Select material (PLA, ABS, PETG, Resin, TPU, Nylon)
4. Select color from palette
5. Click "Generate 3D Preview"
6. Apply visual effects (Metallic, Matte, Glossy, Wireframe, Blueprint)
7. Save preview or add to cart as custom order

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Initialize database with schema and seed data
npm run db:migrate:local

# Build the project
npm run build

# Start development server
pm2 start ecosystem.config.cjs

# Reset database (drop + recreate + seed)
npm run db:reset
```

---

## 🚢 Deployment to Cloudflare Pages

```bash
# 1. Set up Cloudflare API key
# (use setup_cloudflare_api_key tool or set CLOUDFLARE_API_TOKEN env var)

# 2. Create D1 production database
npx wrangler d1 create webapp-production
# Copy the database_id to wrangler.jsonc

# 3. Apply migrations to production
npm run db:migrate:local  # After running with --remote flag
# Or: npx wrangler d1 migrations apply webapp-production

# 4. Build and deploy
npm run build
npx wrangler pages deploy dist --project-name webapp
```

---

## 📦 Future Enhancements (Recommended)

- [ ] Real product photography (replace SVG placeholders)
- [ ] AI-powered 3D model generation from uploaded images (using Meshy.ai or similar API)
- [ ] Email notifications (order confirmation, shipping updates) via Resend.com
- [ ] Customer account system (login, order history)
- [ ] Product reviews and ratings
- [ ] Discount codes and promotions
- [ ] Azure PostgreSQL migration (replace D1 SQLite)
- [ ] Bulk order pricing tiers
- [ ] File upload for STL/OBJ files (customer designs)
- [ ] Real-time order status notifications

---

## 📞 Contact Information

| | |
|-|-|
| Phone | **787-403-1552** |
| Email | **carlos.perez@dataurea.com** |
| Location | Puerto Rico, USA |

---

*Built with Hono + TypeScript + Cloudflare D1 + TailwindCSS + PayPal SDK*
