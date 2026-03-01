export function getLayout(content: string, title: string, settings: Record<string, string>): string {
  const siteName = settings.site_name || '3D Creations PR'
  const tagline = settings.site_tagline || 'Bringing Your Ideas to Life'
  const phone = settings.contact_phone || '787-403-1552'
  const email = settings.contact_email || 'carlos.perez@dataurea.com'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${siteName}</title>
  <meta name="description" content="${tagline}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' },
            accent: { 400:'#fb923c',500:'#f97316',600:'#ea580c' }
          },
          fontFamily: { sans: ['Inter','system-ui','sans-serif'] }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
    .gradient-hero { background: linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #0f172a 100%); }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
    .btn-primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); transition: all 0.3s; }
    .btn-primary:hover { background: linear-gradient(135deg, #1d4ed8, #1e40af); transform: translateY(-1px); box-shadow: 0 8px 20px rgba(37,99,235,0.4); }
    .btn-accent { background: linear-gradient(135deg, #f97316, #ea580c); transition: all 0.3s; }
    .btn-accent:hover { background: linear-gradient(135deg, #ea580c, #dc2626); transform: translateY(-1px); }
    .nav-link { position: relative; }
    .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:#3b82f6; transition:width 0.3s; }
    .nav-link:hover::after { width:100%; }
    .toast { position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999; transition:all 0.3s; }
    .product-image-placeholder { background: linear-gradient(135deg, #1e293b, #334155); display:flex; align-items:center; justify-content:center; }
    .shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .quantity-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid #e2e8f0; border-radius:6px; cursor:pointer; user-select:none; }
    .quantity-btn:hover { background:#f1f5f9; }
    .cart-badge { position:absolute; top:-6px; right:-6px; background:#ef4444; color:white; border-radius:50%; width:18px; height:18px; font-size:10px; display:flex; align-items:center; justify-content:center; font-weight:700; }
    .cart-panel { transform:translateX(100%); transition:transform 0.3s ease; }
    .cart-panel.open { transform:translateX(0); }
    .overlay { opacity:0; pointer-events:none; transition:opacity 0.3s; }
    .overlay.active { opacity:1; pointer-events:all; }
    @media print { .no-print { display:none !important; } }
  </style>
</head>
<body class="bg-gray-50 text-gray-900">

<!-- Top Bar -->
<div class="bg-primary-900 text-white py-2 px-4 text-center text-sm no-print">
  <span class="mr-4"><i class="fas fa-phone-alt mr-1"></i> <a href="tel:${phone}" class="hover:text-blue-200">${phone}</a></span>
  <span><i class="fas fa-envelope mr-1"></i> <a href="mailto:${email}" class="hover:text-blue-200">${email}</a></span>
</div>

<!-- Navigation -->
<nav class="bg-white shadow-md sticky top-0 z-50 no-print">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <a href="/" class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
          <i class="fas fa-cube text-white text-lg"></i>
        </div>
        <div>
          <span class="font-bold text-xl text-gray-900">${siteName}</span>
          <p class="text-xs text-gray-500 leading-none">${tagline}</p>
        </div>
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center space-x-8">
        <a href="/" class="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
        <a href="/products" class="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">Products</a>
        <a href="/preview" class="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">
          <i class="fas fa-magic mr-1 text-accent-500"></i>3D Preview
        </a>
        <a href="/contact" class="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
      </div>

      <div class="flex items-center space-x-3">
        <!-- Search -->
        <form action="/products" method="GET" class="hidden md:flex items-center">
          <div class="relative">
            <input type="text" name="search" placeholder="Search..." class="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48">
            <i class="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
          </div>
        </form>

        <!-- Cart button -->
        <button onclick="toggleCart()" class="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
          <i class="fas fa-shopping-cart text-xl"></i>
          <span id="cart-badge" class="cart-badge hidden">0</span>
        </button>

        <!-- Mobile menu -->
        <button onclick="toggleMobileMenu()" class="md:hidden p-2 text-gray-700">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div id="mobile-menu" class="hidden md:hidden border-t bg-white px-4 pb-4">
    <form action="/products" method="GET" class="py-3">
      <input type="text" name="search" placeholder="Search products..." class="w-full px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
    </form>
    <a href="/" class="block py-2 text-gray-700 hover:text-blue-600">Home</a>
    <a href="/products" class="block py-2 text-gray-700 hover:text-blue-600">Products</a>
    <a href="/preview" class="block py-2 text-gray-700 hover:text-blue-600">3D Preview Tool</a>
    <a href="/contact" class="block py-2 text-gray-700 hover:text-blue-600">Contact</a>
  </div>
</nav>

<!-- Cart Overlay -->
<div id="cart-overlay" class="overlay fixed inset-0 bg-black bg-opacity-50 z-40" onclick="toggleCart()"></div>

<!-- Cart Panel -->
<div id="cart-panel" class="cart-panel fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
  <div class="flex items-center justify-between p-6 border-b bg-gray-50">
    <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-shopping-cart mr-2 text-blue-600"></i>Your Cart</h2>
    <button onclick="toggleCart()" class="text-gray-400 hover:text-gray-600 text-xl">
      <i class="fas fa-times"></i>
    </button>
  </div>
  <div id="cart-items" class="flex-1 overflow-y-auto p-6">
    <div id="cart-empty" class="text-center py-12 text-gray-400">
      <i class="fas fa-shopping-cart text-4xl mb-3 opacity-30"></i>
      <p class="text-lg font-medium">Your cart is empty</p>
      <p class="text-sm mt-1">Add products to get started</p>
      <a href="/products" onclick="toggleCart()" class="mt-4 inline-block text-blue-600 hover:underline text-sm">Browse Products →</a>
    </div>
    <div id="cart-list" class="space-y-4 hidden"></div>
  </div>
  <div id="cart-footer" class="hidden border-t p-6 bg-gray-50 space-y-4">
    <div class="space-y-2 text-sm">
      <div class="flex justify-between text-gray-600"><span>Subtotal</span><span id="cart-subtotal">$0.00</span></div>
      <div class="flex justify-between text-gray-600"><span>Tax (11.5%)</span><span id="cart-tax">$0.00</span></div>
      <div class="flex justify-between text-gray-600"><span>Shipping</span><span id="cart-shipping">$8.99</span></div>
      <div class="flex justify-between font-bold text-gray-900 text-base pt-2 border-t"><span>Total</span><span id="cart-total">$0.00</span></div>
    </div>
    <a href="/checkout" id="checkout-btn" class="btn-primary block w-full text-center text-white py-3 px-6 rounded-xl font-semibold">
      <i class="fas fa-lock mr-2"></i>Proceed to Checkout
    </a>
    <button onclick="clearCart()" class="w-full text-center text-sm text-red-500 hover:text-red-700">
      <i class="fas fa-trash mr-1"></i>Clear Cart
    </button>
  </div>
</div>

<!-- Toast notification -->
<div id="toast" class="toast hidden">
  <div class="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center space-x-3">
    <i id="toast-icon" class="fas fa-check-circle text-green-400"></i>
    <span id="toast-message">Added to cart!</span>
  </div>
</div>

<!-- Main Content -->
<main>
${content}
</main>

<!-- Footer -->
<footer class="bg-gray-900 text-white mt-16 no-print">
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
            <i class="fas fa-cube text-white"></i>
          </div>
          <span class="font-bold text-xl">${siteName}</span>
        </div>
        <p class="text-gray-400 text-sm leading-relaxed mb-4">${settings.about_text || 'Puerto Rico-based 3D printing studio bringing your ideas to life.'}</p>
        <div class="flex space-x-4">
          <a href="tel:${phone}" class="flex items-center text-gray-400 hover:text-white text-sm transition-colors">
            <i class="fas fa-phone-alt mr-2 text-blue-400"></i>${phone}
          </a>
        </div>
        <div class="mt-2">
          <a href="mailto:${email}" class="flex items-center text-gray-400 hover:text-white text-sm transition-colors">
            <i class="fas fa-envelope mr-2 text-blue-400"></i>${email}
          </a>
        </div>
      </div>
      <div>
        <h4 class="font-semibold text-white mb-4">Quick Links</h4>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li><a href="/" class="hover:text-white transition-colors">Home</a></li>
          <li><a href="/products" class="hover:text-white transition-colors">All Products</a></li>
          <li><a href="/preview" class="hover:text-white transition-colors">3D Preview Tool</a></li>
          <li><a href="/contact" class="hover:text-white transition-colors">Contact Us</a></li>
          <li><a href="/admin" class="hover:text-white transition-colors text-gray-600">Admin Panel</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-white mb-4">Materials</h4>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li><a href="/products?material=PLA" class="hover:text-white transition-colors">PLA (Eco-friendly)</a></li>
          <li><a href="/products?material=ABS" class="hover:text-white transition-colors">ABS (Durable)</a></li>
          <li><a href="/products?material=PETG" class="hover:text-white transition-colors">PETG (Flexible)</a></li>
          <li><a href="/products?material=Resin" class="hover:text-white transition-colors">Resin (High-Detail)</a></li>
          <li><a href="/products?material=TPU" class="hover:text-white transition-colors">TPU (Rubber-like)</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
      <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved. Puerto Rico, USA</p>
      <p class="mt-2 md:mt-0">Powered by precision FDM &amp; Resin 3D printing</p>
    </div>
  </div>
</footer>

<script>
// ============================================================
// Cart System
// ============================================================
let cart = JSON.parse(localStorage.getItem('3dp_cart') || '[]');

function saveCart() {
  localStorage.setItem('3dp_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id, name, price, image, quantity = 1) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, name, price: parseFloat(price), image, quantity });
  }
  saveCart();
  showToast('Added to cart!', 'check-circle', 'text-green-400');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function updateQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
    saveCart();
  }
}

function clearCart() {
  cart = [];
  saveCart();
}

function updateCartUI() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.115;
  const shipping = subtotal >= 100 ? 0 : (subtotal > 0 ? 8.99 : 0);
  const total = subtotal + tax + shipping;
  const totalQty = cart.reduce((s, i) => s + i.quantity, 0);

  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalQty;
    badge.classList.toggle('hidden', totalQty === 0);
  }

  const cartEmpty = document.getElementById('cart-empty');
  const cartList = document.getElementById('cart-list');
  const cartFooter = document.getElementById('cart-footer');

  if (cart.length === 0) {
    cartEmpty?.classList.remove('hidden');
    cartList?.classList.add('hidden');
    cartFooter?.classList.add('hidden');
  } else {
    cartEmpty?.classList.add('hidden');
    cartList?.classList.remove('hidden');
    cartFooter?.classList.remove('hidden');

    if (cartList) {
      cartList.innerHTML = cart.map(item => \`
        <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl" id="cart-item-\${item.id}">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            \${item.image ? \`<img src="\${item.image}" alt="\${item.name}" class="w-full h-full object-cover" onerror="this.style.display='none';this.parentNode.innerHTML='<i class=\\"fas fa-cube text-white text-xl\\"></i>'">\` : '<i class="fas fa-cube text-white text-xl"></i>'}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 text-sm truncate">\${item.name}</p>
            <p class="text-blue-600 font-bold">$\${item.price.toFixed(2)}</p>
            <div class="flex items-center space-x-2 mt-2">
              <button onclick="updateQuantity(\${item.id}, -1)" class="quantity-btn text-gray-600 hover:text-gray-900">
                <i class="fas fa-minus text-xs"></i>
              </button>
              <span class="text-sm font-medium w-8 text-center">\${item.quantity}</span>
              <button onclick="updateQuantity(\${item.id}, 1)" class="quantity-btn text-gray-600 hover:text-gray-900">
                <i class="fas fa-plus text-xs"></i>
              </button>
              <button onclick="removeFromCart(\${item.id})" class="ml-2 text-red-400 hover:text-red-600 transition-colors">
                <i class="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-gray-900">$\${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      \`).join('');
    }

    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  }
}

function toggleCart() {
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  panel?.classList.toggle('open');
  overlay?.classList.toggle('active');
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu?.classList.toggle('hidden');
}

function showToast(message, icon = 'check-circle', iconClass = 'text-green-400') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  if (toastIcon) toastIcon.className = 'fas fa-' + icon + ' ' + iconClass;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Initialize cart
updateCartUI();
</script>
</body>
</html>`
}
