-- ============================================================
-- Seed Data for 3D Print Shop
-- ============================================================

-- Insert categories
INSERT OR IGNORE INTO categories (name, slug, description, icon, sort_order) VALUES
  ('Home & Decor', 'home-decor', 'Decorative items for your home and living spaces', 'home', 1),
  ('Functional Parts', 'functional-parts', 'Practical parts, brackets, adapters and more', 'wrench', 2),
  ('Miniatures & Figurines', 'miniatures', 'Detailed miniatures, figurines, and collectibles', 'star', 3),
  ('Jewelry & Accessories', 'jewelry', 'Custom jewelry, pendants, and fashion accessories', 'gem', 4),
  ('Custom Orders', 'custom-orders', 'Fully customized prints from your designs', 'magic', 5),
  ('Prototypes', 'prototypes', 'Rapid prototyping for product development', 'flask', 6);

-- Insert materials
INSERT OR IGNORE INTO materials (name, code, description, color_options, price_modifier, sort_order) VALUES
  ('PLA', 'PLA', 'Polylactic Acid – easy to print, eco-friendly, great for decorative items', 'White,Black,Red,Blue,Green,Yellow,Orange,Purple,Gray,Silver,Gold', 1.0, 1),
  ('ABS', 'ABS', 'Acrylonitrile Butadiene Styrene – strong and durable, ideal for functional parts', 'White,Black,Red,Blue,Gray', 1.2, 2),
  ('PETG', 'PETG', 'Polyethylene Terephthalate Glycol – flexible yet strong, food-safe options', 'Clear,White,Black,Blue,Green', 1.3, 3),
  ('TPU', 'TPU', 'Thermoplastic Polyurethane – flexible rubber-like material', 'Black,White,Red,Blue', 1.5, 4),
  ('Resin', 'RESIN', 'High detail SLA/MSLA resin – ultra fine details for miniatures and jewelry', 'Clear,White,Gray,Black', 2.0, 5),
  ('Nylon', 'NYLON', 'Nylon PA12 – industrial strength, wear resistant', 'White,Black,Gray', 1.8, 6);

-- Insert sample products
INSERT OR IGNORE INTO products (name, slug, short_description, description, category_id, material, color, price, is_available, is_featured, is_customizable, weight_grams, dimensions_mm, print_time_hours, lead_time_days, tags) VALUES
  (
    'Custom Name Plate',
    'custom-name-plate',
    'Personalized wall nameplate with your name or message',
    'Create a beautiful personalized nameplate for your home, office, or as a gift. Choose your text, font style, and finish. Perfect for doors, desks, or wall mounting. Each piece is printed with precision and care.',
    1, 'PLA', 'White', 24.99,
    1, 1, 1, 45.0,
    '{"x": 150, "y": 50, "z": 10}',
    2.5, 3,
    'nameplate,personalized,home,decor,gift'
  ),
  (
    'Geometric Plant Pot',
    'geometric-plant-pot',
    'Modern geometric design pot for small plants and succulents',
    'Add a modern touch to your living space with our geometric plant pot. Features a contemporary hexagonal design that works perfectly with succulents, cacti, and small plants. Printed in durable PLA with a drainage hole option.',
    1, 'PLA', 'White', 18.99,
    1, 1, 1, 120.0,
    '{"x": 100, "y": 100, "z": 90}',
    5.0, 3,
    'plant pot,geometric,home,succulents,modern'
  ),
  (
    'Custom Phone Stand',
    'custom-phone-stand',
    'Adjustable phone/tablet stand for desk use',
    'A sturdy, adjustable phone stand that keeps your device at the perfect viewing angle. Compatible with all phone sizes up to 7 inches. Features cable management slot and non-slip base. Available in multiple colors.',
    2, 'PETG', 'Black', 14.99,
    1, 1, 0, 80.0,
    '{"x": 120, "y": 80, "z": 100}',
    4.0, 3,
    'phone stand,desk,tablet,accessories,functional'
  ),
  (
    'Dragon Miniature Figure',
    'dragon-miniature',
    'Highly detailed dragon miniature for tabletop gaming',
    'An incredibly detailed dragon miniature perfect for tabletop RPGs, display, or collecting. Printed in high-resolution resin for maximum detail. Available in different poses and sizes. Great for D&D, Pathfinder, and other games.',
    3, 'RESIN', 'Gray', 34.99,
    1, 1, 1, 35.0,
    '{"x": 80, "y": 60, "z": 70}',
    6.0, 5,
    'miniature,dragon,tabletop,RPG,DnD,gaming,figure'
  ),
  (
    'Custom Keychain',
    'custom-keychain',
    'Personalized keychain with your name, initials, or logo',
    'A durable and stylish personalized keychain printed to your exact specifications. Can include names, initials, logos, or custom shapes. Strong PLA construction with key ring included. Perfect for gifts or branding.',
    4, 'PLA', 'Black', 9.99,
    1, 0, 1, 15.0,
    '{"x": 60, "y": 30, "z": 5}',
    1.0, 2,
    'keychain,personalized,gift,accessories,custom'
  ),
  (
    'Architectural Scale Model',
    'architectural-scale-model',
    'Custom architectural model for presentations and visualization',
    'Professional quality architectural scale models for presentations, real estate, interior design, and educational purposes. Printed in sections and assembled for large models. Highly detailed with fine layer resolution.',
    6, 'PLA', 'White', 149.99,
    1, 0, 1, 350.0,
    '{"x": 300, "y": 300, "z": 150}',
    24.0, 10,
    'architecture,model,scale,prototype,presentation'
  ),
  (
    'Wall Art Panel - Topographic',
    'wall-art-topographic',
    '3D topographic map wall art panel',
    'Transform any space with a stunning 3D topographic map wall art panel. Choose any location in the world – your city, a favorite mountain, or the ocean floor. Available in multiple sizes and finishes. Each panel tells a geographic story.',
    1, 'PLA', 'White', 49.99,
    1, 1, 1, 200.0,
    '{"x": 250, "y": 250, "z": 15}',
    12.0, 5,
    'wall art,topographic,map,home decor,3D art'
  ),
  (
    'Mechanical Keyboard Keycaps Set',
    'keycaps-set',
    'Custom 3D printed keycap set for mechanical keyboards',
    'Express yourself with fully custom 3D printed keycaps for your mechanical keyboard. Compatible with MX, Cherry, and similar switches. Available in various profiles (SA, DSA, OEM). Fully customizable legends and colors.',
    2, 'PLA', 'White', 39.99,
    1, 0, 1, 60.0,
    '{"x": 200, "y": 100, "z": 10}',
    8.0, 5,
    'keycaps,keyboard,mechanical,gaming,custom'
  );

-- Insert product images (using placeholder image service)
INSERT OR IGNORE INTO product_images (product_id, url, alt_text, is_primary, sort_order) VALUES
  (1, '/static/images/placeholder-nameplate.svg', 'Custom Name Plate', 1, 0),
  (2, '/static/images/placeholder-pot.svg', 'Geometric Plant Pot', 1, 0),
  (3, '/static/images/placeholder-stand.svg', 'Phone Stand', 1, 0),
  (4, '/static/images/placeholder-dragon.svg', 'Dragon Miniature', 1, 0),
  (5, '/static/images/placeholder-keychain.svg', 'Custom Keychain', 1, 0),
  (6, '/static/images/placeholder-arch.svg', 'Architectural Model', 1, 0),
  (7, '/static/images/placeholder-wallart.svg', 'Topographic Wall Art', 1, 0),
  (8, '/static/images/placeholder-keycaps.svg', 'Keycaps Set', 1, 0);

-- Insert site settings
INSERT OR IGNORE INTO site_settings (key, value, type, description) VALUES
  ('site_name', '3D Creations PR', 'text', 'Business name'),
  ('site_tagline', 'Bringing Your Ideas to Life', 'text', 'Site tagline'),
  ('contact_phone', '787-403-1552', 'text', 'Contact phone number'),
  ('contact_email', 'carlos.perez@dataurea.com', 'text', 'Contact email'),
  ('business_address', 'Puerto Rico, USA', 'text', 'Business address'),
  ('paypal_client_id', '', 'text', 'PayPal client ID for checkout'),
  ('currency', 'USD', 'text', 'Currency code'),
  ('tax_rate', '0.115', 'number', 'Tax rate (11.5% for Puerto Rico)'),
  ('free_shipping_threshold', '100', 'number', 'Order total for free shipping'),
  ('base_shipping_cost', '8.99', 'number', 'Standard shipping cost'),
  ('lead_time_days', '3', 'number', 'Default lead time in days'),
  ('about_text', 'We are a Puerto Rico-based 3D printing studio specializing in custom, high-quality prints for homes, businesses, and creatives. Using the latest FDM and resin printing technology, we bring your ideas to life with precision and care.', 'text', 'About us text'),
  ('hero_title', 'Custom 3D Printing Services', 'text', 'Homepage hero title'),
  ('hero_subtitle', 'From concept to reality — we print your ideas with precision, quality, and speed.', 'text', 'Homepage hero subtitle'),
  ('admin_pin', '1234', 'text', 'Simple admin PIN for demo');

-- Insert default admin user (password: admin123 - change in production)
INSERT OR IGNORE INTO admin_users (username, email, password_hash, role) VALUES
  ('admin', 'carlos.perez@dataurea.com', 'admin123', 'super_admin');
