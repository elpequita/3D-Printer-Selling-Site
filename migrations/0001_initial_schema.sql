-- ============================================================
-- 3D Print Shop - Initial Database Schema
-- Compatible with both SQLite (dev) and PostgreSQL (prod)
-- ============================================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'cube',
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  material TEXT NOT NULL DEFAULT 'PLA',
  color TEXT DEFAULT 'White',
  price REAL NOT NULL DEFAULT 0.00,
  sale_price REAL,
  sku TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT -1, -- -1 = unlimited / made-to-order
  is_available INTEGER DEFAULT 1,   -- 0 = unavailable, 1 = available
  is_featured INTEGER DEFAULT 0,
  is_customizable INTEGER DEFAULT 0,
  weight_grams REAL,
  dimensions_mm TEXT,               -- JSON: {"x": 100, "y": 100, "z": 100}
  print_time_hours REAL,
  lead_time_days INTEGER DEFAULT 3,
  tags TEXT,                        -- comma-separated
  meta_title TEXT,
  meta_description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Materials table (for dropdowns / info)
CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  description TEXT,
  properties TEXT,       -- JSON: strength, flexibility, etc.
  color_options TEXT,    -- comma-separated colors
  price_modifier REAL DEFAULT 1.0,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  notes TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent REAL DEFAULT 0.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  -- Status values: pending, confirmed, printing, quality_check, shipped, delivered, cancelled, refunded
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  -- Payment: unpaid, paid, refunded, failed
  payment_method TEXT DEFAULT 'paypal',
  paypal_order_id TEXT,
  paypal_payment_id TEXT,
  paypal_payer_id TEXT,
  subtotal REAL NOT NULL DEFAULT 0.00,
  shipping_cost REAL DEFAULT 0.00,
  tax_amount REAL DEFAULT 0.00,
  discount_amount REAL DEFAULT 0.00,
  total_amount REAL NOT NULL DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  shipping_address TEXT,            -- JSON object
  billing_address TEXT,             -- JSON object
  notes TEXT,
  internal_notes TEXT,
  estimated_completion DATETIME,
  shipped_at DATETIME,
  delivered_at DATETIME,
  cancelled_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  customization TEXT,               -- JSON: custom options
  custom_image_url TEXT,            -- uploaded image for preview tool
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Custom preview requests table (3D preview tool)
CREATE TABLE IF NOT EXISTS preview_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  customer_email TEXT,
  uploaded_image_url TEXT NOT NULL,
  style TEXT DEFAULT 'standard',    -- standard, detailed, artistic, functional
  material TEXT DEFAULT 'PLA',
  color TEXT DEFAULT 'White',
  notes TEXT,
  preview_image_url TEXT,           -- generated preview
  status TEXT DEFAULT 'pending',    -- pending, processing, completed, failed
  converted_to_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',        -- new, read, replied, archived
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',        -- admin, super_admin
  is_active INTEGER DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  type TEXT DEFAULT 'text',         -- text, json, boolean, number
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
