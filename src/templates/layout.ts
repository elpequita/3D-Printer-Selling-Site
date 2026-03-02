export function getLayout(content: string, title: string, settings: Record<string, string>): string {
  const siteName = settings.site_name || '3D Creations PR'
  const tagline = settings.site_tagline || 'Bringing Your Ideas to Life'
  const phone = settings.contact_phone || '787-403-1552'
  const email = settings.contact_email || 'carlos.perez@dataurea.com'

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${siteName}</title>
  <meta name="description" content="${tagline}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;600;700;900&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            neon: { cyan:'#00f5ff', purple:'#bf00ff', green:'#00ff88', orange:'#ff6b00', pink:'#ff0080' },
            dark: { 950:'#02040a', 900:'#060912', 850:'#080d18', 800:'#0d1424', 750:'#101829', 700:'#141e33', 600:'#1a2640', 500:'#1f2f50' }
          },
          fontFamily: {
            sans: ['Space Grotesk','system-ui','sans-serif'],
            display: ['Orbitron','monospace']
          },
          boxShadow: {
            'neon-cyan': '0 0 20px rgba(0,245,255,0.4), 0 0 60px rgba(0,245,255,0.15)',
            'neon-purple': '0 0 20px rgba(191,0,255,0.4), 0 0 60px rgba(191,0,255,0.15)',
            'neon-green': '0 0 20px rgba(0,255,136,0.4)',
            'neon-orange': '0 0 20px rgba(255,107,0,0.5)',
          }
        }
      }
    }
  </script>

  <style>
    :root {
      --neon-cyan: #00f5ff;
      --neon-purple: #bf00ff;
      --neon-green: #00ff88;
      --neon-orange: #ff6b00;
      --neon-pink: #ff0080;
      --bg-base: #02040a;
      --bg-card: #0d1424;
      --bg-card2: #101829;
      --border-dim: rgba(255,255,255,0.06);
      --border-glow: rgba(0,245,255,0.3);
      --text-primary: #e8edf8;
      --text-secondary: #8896b3;
      --text-muted: #4a5568;
    }

    *, *::before, *::after { box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      background-color: var(--bg-base);
      color: var(--text-primary);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ── Typography ── */
    .font-display { font-family: 'Orbitron', monospace; }
    .text-gradient-cyan {
      background: linear-gradient(135deg, var(--neon-cyan), #0080ff);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .text-gradient-purple {
      background: linear-gradient(135deg, var(--neon-purple), #6600cc);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .text-gradient-fire {
      background: linear-gradient(135deg, #ff6b00, #ff0080);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .text-gradient-hero {
      background: linear-gradient(135deg, #ffffff 0%, var(--neon-cyan) 50%, var(--neon-purple) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }

    /* ── Background ── */
    .bg-grid {
      background-image:
        linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .bg-noise {
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    }

    /* ── Cards ── */
    .glass-card {
      background: linear-gradient(135deg, rgba(13,20,36,0.9), rgba(16,24,41,0.7));
      border: 1px solid var(--border-dim);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    .glass-card:hover {
      border-color: rgba(0,245,255,0.25);
      box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,245,255,0.08);
      transform: translateY(-4px);
    }
    .card-glow-cyan:hover { border-color: rgba(0,245,255,0.4); box-shadow: 0 0 30px rgba(0,245,255,0.15), 0 20px 40px rgba(0,0,0,0.5); }
    .card-glow-purple:hover { border-color: rgba(191,0,255,0.4); box-shadow: 0 0 30px rgba(191,0,255,0.15), 0 20px 40px rgba(0,0,0,0.5); }

    /* ── Buttons ── */
    .btn-neon-cyan {
      background: linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,128,255,0.15));
      border: 1px solid rgba(0,245,255,0.5);
      color: var(--neon-cyan);
      transition: all 0.3s;
      position: relative; overflow: hidden;
    }
    .btn-neon-cyan::before {
      content:''; position:absolute; inset:0;
      background: linear-gradient(135deg, rgba(0,245,255,0.2), rgba(0,128,255,0.2));
      opacity:0; transition:opacity 0.3s;
    }
    .btn-neon-cyan:hover { box-shadow: 0 0 25px rgba(0,245,255,0.4); border-color: var(--neon-cyan); }
    .btn-neon-cyan:hover::before { opacity:1; }

    .btn-neon-purple {
      background: linear-gradient(135deg, rgba(191,0,255,0.15), rgba(100,0,200,0.15));
      border: 1px solid rgba(191,0,255,0.5);
      color: #d87fff;
      transition: all 0.3s;
    }
    .btn-neon-purple:hover { box-shadow: 0 0 25px rgba(191,0,255,0.4); border-color: var(--neon-purple); }

    .btn-solid-cyan {
      background: linear-gradient(135deg, #0080cc, #00c8ff);
      color: #000;
      font-weight: 700;
      border: none;
      transition: all 0.3s;
    }
    .btn-solid-cyan:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(0,200,255,0.5), 0 8px 20px rgba(0,0,0,0.4); }

    .btn-solid-fire {
      background: linear-gradient(135deg, #ff6b00, #ff0080);
      color: #fff;
      font-weight: 700;
      border: none;
      transition: all 0.3s;
    }
    .btn-solid-fire:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(255,107,0,0.5), 0 8px 20px rgba(0,0,0,0.4); }

    /* Keep backwards compat */
    .btn-primary { background: linear-gradient(135deg, #0080cc, #00c8ff); color: #000; font-weight:700; transition: all 0.3s; border: none; }
    .btn-primary:hover { transform:translateY(-2px); box-shadow: 0 0 30px rgba(0,200,255,0.5); }
    .btn-accent { background: linear-gradient(135deg, #ff6b00, #ff0080); color: #fff; font-weight:700; transition: all 0.3s; border: none; }
    .btn-accent:hover { transform:translateY(-2px); box-shadow: 0 0 30px rgba(255,107,0,0.5); }

    /* ── Inputs ── */
    .dark-input {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--text-primary);
      transition: all 0.3s;
    }
    .dark-input::placeholder { color: var(--text-muted); }
    .dark-input:focus { outline:none; border-color: rgba(0,245,255,0.5); box-shadow: 0 0 15px rgba(0,245,255,0.1); background: rgba(0,245,255,0.03); }

    /* ── Dividers / Borders ── */
    .border-dim { border-color: var(--border-dim); }
    .border-glow-cyan { border-color: rgba(0,245,255,0.3); }
    .divider { height:1px; background: linear-gradient(90deg, transparent, rgba(0,245,255,0.3), rgba(191,0,255,0.3), transparent); }

    /* ── Glow orbs ── */
    .orb {
      position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px);
    }
    .orb-cyan { background: radial-gradient(circle, rgba(0,245,255,0.15), transparent 70%); }
    .orb-purple { background: radial-gradient(circle, rgba(191,0,255,0.12), transparent 70%); }
    .orb-fire { background: radial-gradient(circle, rgba(255,107,0,0.12), transparent 70%); }

    /* ── Navigation ── */
    .nav-glass {
      background: rgba(2,4,10,0.85);
      border-bottom: 1px solid rgba(0,245,255,0.1);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }
    .nav-link { position: relative; color: #8896b3; transition: color 0.3s; }
    .nav-link::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:1px; background: var(--neon-cyan); box-shadow: 0 0 8px var(--neon-cyan); transition: width 0.3s; }
    .nav-link:hover { color: var(--neon-cyan); }
    .nav-link:hover::after { width:100%; }

    /* ── Tags / Badges ── */
    .badge-cyan { background: rgba(0,245,255,0.12); border:1px solid rgba(0,245,255,0.25); color: var(--neon-cyan); }
    .badge-purple { background: rgba(191,0,255,0.12); border:1px solid rgba(191,0,255,0.25); color: #d87fff; }
    .badge-green { background: rgba(0,255,136,0.12); border:1px solid rgba(0,255,136,0.25); color: var(--neon-green); }
    .badge-fire { background: rgba(255,107,0,0.12); border:1px solid rgba(255,107,0,0.25); color: #ff9940; }

    /* ── Product card image placeholder ── */
    .product-image-placeholder {
      background: linear-gradient(135deg, #080d18, #101829);
      display:flex; align-items:center; justify-content:center;
    }

    /* ── Shimmer (loading) ── */
    .shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.8s infinite;
    }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    /* ── Cart ── */
    .cart-badge { position:absolute; top:-6px; right:-6px; background: var(--neon-cyan); color:#000; border-radius:50%; width:18px; height:18px; font-size:10px; display:flex; align-items:center; justify-content:center; font-weight:800; }
    .cart-panel { transform:translateX(100%); transition:transform 0.35s cubic-bezier(0.4,0,0.2,1); background: #0d1424; border-left: 1px solid rgba(0,245,255,0.15); }
    .cart-panel.open { transform:translateX(0); }
    .overlay { opacity:0; pointer-events:none; transition:opacity 0.3s; }
    .overlay.active { opacity:1; pointer-events:all; }
    .quantity-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer; user-select:none; color: var(--text-secondary); background: transparent; transition: all 0.2s; }
    .quantity-btn:hover { border-color: var(--neon-cyan); color: var(--neon-cyan); background: rgba(0,245,255,0.06); }

    /* ── Animations ── */
    @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
    @keyframes pulse-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
    @keyframes scan-line { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
    @keyframes rotate3d { from{transform:rotateY(0deg) rotateX(10deg)} to{transform:rotateY(360deg) rotateX(10deg)} }
    @keyframes fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    .animate-float { animation: float 4s ease-in-out infinite; }
    .animate-fade-up { animation: fade-up 0.6s ease forwards; }

    /* ── Line clamp ── */
    .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .line-clamp-3 { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width:6px; }
    ::-webkit-scrollbar-track { background: #02040a; }
    ::-webkit-scrollbar-thumb { background: rgba(0,245,255,0.3); border-radius:3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0,245,255,0.5); }

    /* ── Toast ── */
    .toast { position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999; transition:all 0.3s; }

    /* ── Select / option dark ── */
    select { background-color: #0d1424; color: var(--text-primary); }
    option { background-color: #0d1424; }

    @media print { .no-print { display:none !important; } }
  </style>
</head>
<body class="bg-noise">

<!-- Ambient scan line effect -->
<div style="position:fixed;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,245,255,0.4),transparent);animation:scan-line 8s linear infinite;z-index:9998;pointer-events:none;opacity:0.5"></div>

<!-- Top Bar -->
<div class="no-print" style="background:rgba(0,245,255,0.06);border-bottom:1px solid rgba(0,245,255,0.1);padding:8px 16px;text-align:center;font-size:13px;color:var(--text-secondary)">
  <span class="mr-6">
    <i class="fas fa-phone-alt mr-1" style="color:var(--neon-cyan)"></i>
    <a href="tel:${phone}" style="color:var(--text-secondary)" onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">${phone}</a>
  </span>
  <span>
    <i class="fas fa-envelope mr-1" style="color:var(--neon-purple)"></i>
    <a href="mailto:${email}" style="color:var(--text-secondary)" onmouseover="this.style.color='var(--neon-purple)'" onmouseout="this.style.color='var(--text-secondary)'">${email}</a>
  </span>
</div>

<!-- Navigation -->
<nav class="nav-glass sticky top-0 z-50 no-print">
  <div style="max-width:1280px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:68px">
    <a href="/" style="display:flex;align-items:center;gap:12px;text-decoration:none">
      <div style="width:42px;height:42px;background:linear-gradient(135deg,rgba(0,245,255,0.15),rgba(0,128,255,0.15));border:1px solid rgba(0,245,255,0.4);border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(0,245,255,0.2)">
        <i class="fas fa-cube" style="color:var(--neon-cyan);font-size:18px"></i>
      </div>
      <div>
        <div class="font-display" style="font-size:17px;font-weight:700;color:#fff;letter-spacing:1px">${siteName}</div>
        <div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;text-transform:uppercase">${tagline}</div>
      </div>
    </a>

    <!-- Desktop Nav -->
    <div style="display:none" id="desktop-nav" class="md-flex-items">
      <a href="/" class="nav-link" style="font-size:14px;font-weight:500;padding:6px 4px">Home</a>
      <a href="/products" class="nav-link" style="font-size:14px;font-weight:500;padding:6px 4px">Products</a>
      <a href="/preview" class="nav-link" style="font-size:14px;font-weight:500;padding:6px 4px">
        <i class="fas fa-cube mr-1" style="color:var(--neon-purple);font-size:12px"></i>3D Preview
      </a>
      <a href="/contact" class="nav-link" style="font-size:14px;font-weight:500;padding:6px 4px">Contact</a>
    </div>

    <div style="display:flex;align-items:center;gap:12px">
      <!-- Search -->
      <form action="/products" method="GET" class="hide-mobile" style="position:relative">
        <input type="text" name="search" placeholder="Search prints…"
               style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:var(--text-primary);border-radius:24px;padding:8px 36px 8px 16px;font-size:13px;width:200px;outline:none;font-family:inherit"
               onfocus="this.style.borderColor='rgba(0,245,255,0.4)';this.style.boxShadow='0 0 15px rgba(0,245,255,0.1)'"
               onblur="this.style.borderColor='rgba(255,255,255,0.1)';this.style.boxShadow='none'">
        <button type="submit" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-muted);cursor:pointer">
          <i class="fas fa-search" style="font-size:12px"></i>
        </button>
      </form>

      <!-- Cart button -->
      <button onclick="toggleCart()" style="position:relative;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s;color:var(--text-secondary)"
              onmouseover="this.style.borderColor='rgba(0,245,255,0.4)';this.style.color='var(--neon-cyan)'"
              onmouseout="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='var(--text-secondary)'">
        <i class="fas fa-shopping-cart" style="font-size:16px"></i>
        <span id="cart-badge" class="cart-badge hidden" style="font-family:'Space Grotesk'">0</span>
      </button>

      <!-- Mobile menu -->
      <button onclick="toggleMobileMenu()" id="mobile-menu-btn" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary)">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div id="mobile-menu" class="hidden" style="border-top:1px solid rgba(255,255,255,0.06);padding:16px 24px 20px;background:rgba(2,4,10,0.97)">
    <form action="/products" method="GET" style="margin-bottom:16px">
      <input type="text" name="search" placeholder="Search products..."
             style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:var(--text-primary);border-radius:12px;padding:10px 16px;font-size:14px;outline:none;font-family:inherit">
    </form>
    <div style="display:flex;flex-direction:column;gap:4px">
      <a href="/" style="color:var(--text-secondary);text-decoration:none;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-weight:500">Home</a>
      <a href="/products" style="color:var(--text-secondary);text-decoration:none;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-weight:500">Products</a>
      <a href="/preview" style="color:var(--neon-purple);text-decoration:none;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-weight:500"><i class="fas fa-cube mr-2" style="font-size:12px"></i>3D Preview Tool</a>
      <a href="/contact" style="color:var(--text-secondary);text-decoration:none;padding:10px 0;font-weight:500">Contact</a>
    </div>
  </div>
</nav>

<style>
@media (min-width: 768px) {
  #desktop-nav { display:flex !important; align-items:center; gap:32px; }
  #mobile-menu-btn { display:none !important; }
  .hide-mobile { display:block !important; }
}
.hide-mobile { display:none; }
</style>

<!-- Cart Overlay -->
<div id="cart-overlay" class="overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:40;backdrop-filter:blur(4px)" onclick="toggleCart()"></div>

<!-- Cart Panel -->
<div id="cart-panel" class="cart-panel" style="position:fixed;top:0;right:0;height:100%;width:100%;max-width:420px;z-index:50;display:flex;flex-direction:column">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:24px;border-bottom:1px solid rgba(0,245,255,0.1);background:rgba(8,13,24,0.95)">
    <h2 style="font-size:18px;font-weight:700;color:#fff;display:flex;align-items:center;gap:10px">
      <i class="fas fa-shopping-cart" style="color:var(--neon-cyan)"></i>Your Cart
    </h2>
    <button onclick="toggleCart()" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);transition:all 0.2s"
            onmouseover="this.style.borderColor='rgba(255,80,80,0.5)';this.style.color='#ff5050'"
            onmouseout="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='var(--text-secondary)'">
      <i class="fas fa-times"></i>
    </button>
  </div>
  <div id="cart-items" style="flex:1;overflow-y:auto;padding:20px">
    <div id="cart-empty" style="text-align:center;padding:48px 0;color:var(--text-muted)">
      <i class="fas fa-shopping-cart" style="font-size:40px;margin-bottom:12px;opacity:0.2;display:block"></i>
      <p style="font-size:16px;font-weight:600;color:var(--text-secondary)">Your cart is empty</p>
      <p style="font-size:13px;margin-top:4px">Add products to get started</p>
      <a href="/products" onclick="toggleCart()" style="display:inline-block;margin-top:16px;color:var(--neon-cyan);text-decoration:none;font-size:13px">Browse Products →</a>
    </div>
    <div id="cart-list" class="hidden" style="display:none;flex-direction:column;gap:12px"></div>
  </div>
  <div id="cart-footer" class="hidden" style="display:none;border-top:1px solid rgba(255,255,255,0.06);padding:20px;background:rgba(8,13,24,0.95)">
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary)">
        <span>Subtotal</span><span id="cart-subtotal">$0.00</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary)">
        <span>Tax (11.5%)</span><span id="cart-tax">$0.00</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary)">
        <span>Shipping</span><span id="cart-shipping">$8.99</span>
      </div>
      <div class="divider" style="margin:8px 0"></div>
      <div style="display:flex;justify-content:space-between;font-size:17px;font-weight:700;color:#fff">
        <span>Total</span><span id="cart-total" style="color:var(--neon-cyan)">$0.00</span>
      </div>
    </div>
    <a href="/checkout" id="checkout-btn" class="btn-solid-cyan" style="display:block;width:100%;text-align:center;padding:14px;border-radius:14px;font-size:15px;text-decoration:none;margin-bottom:10px">
      <i class="fas fa-lock mr-2"></i>Secure Checkout
    </a>
    <button onclick="clearCart()" style="width:100%;text-align:center;font-size:12px;color:#ff5555;background:none;border:none;cursor:pointer;padding:6px">
      <i class="fas fa-trash mr-1"></i>Clear Cart
    </button>
  </div>
</div>

<!-- Toast notification -->
<div id="toast" class="toast hidden">
  <div style="background:rgba(13,20,36,0.97);border:1px solid rgba(0,245,255,0.3);color:#fff;padding:12px 20px;border-radius:14px;box-shadow:0 0 30px rgba(0,0,0,0.5),0 0 15px rgba(0,245,255,0.15);display:flex;align-items:center;gap:12px;backdrop-filter:blur(20px)">
    <i id="toast-icon" class="fas fa-check-circle" style="color:var(--neon-green)"></i>
    <span id="toast-message" style="font-size:14px;font-weight:500">Added to cart!</span>
  </div>
</div>

<!-- Main Content -->
<main>
${content}
</main>

<!-- Footer -->
<footer class="no-print" style="background:rgba(6,9,18,0.95);border-top:1px solid rgba(0,245,255,0.08);margin-top:80px">
  <div style="max-width:1280px;margin:0 auto;padding:64px 24px 32px">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:48px;margin-bottom:48px">
      <div style="grid-column:span 2 / span 2">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:40px;height:40px;background:linear-gradient(135deg,rgba(0,245,255,0.15),rgba(0,128,255,0.15));border:1px solid rgba(0,245,255,0.4);border-radius:12px;display:flex;align-items:center;justify-content:center">
            <i class="fas fa-cube" style="color:var(--neon-cyan)"></i>
          </div>
          <span class="font-display" style="font-size:16px;font-weight:700;color:#fff;letter-spacing:1px">${siteName}</span>
        </div>
        <p style="color:var(--text-secondary);font-size:14px;line-height:1.7;max-width:300px;margin-bottom:20px">${settings.about_text || 'Puerto Rico-based 3D printing studio bringing your ideas to life with precision and technology.'}</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          <a href="tel:${phone}" style="display:flex;align-items:center;gap:8px;color:var(--text-secondary);text-decoration:none;font-size:14px;transition:color 0.2s"
             onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">
            <i class="fas fa-phone-alt" style="color:var(--neon-cyan);width:16px"></i>${phone}
          </a>
          <a href="mailto:${email}" style="display:flex;align-items:center;gap:8px;color:var(--text-secondary);text-decoration:none;font-size:14px;transition:color 0.2s"
             onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">
            <i class="fas fa-envelope" style="color:var(--neon-purple);width:16px"></i>${email}
          </a>
        </div>
      </div>
      <div>
        <h4 style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:3px;margin-bottom:16px">Navigation</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
          ${['/', '/products', '/preview', '/contact', '/admin'].map((href, i) => {
            const labels = ['Home', 'All Products', '3D Preview Tool', 'Contact Us', 'Admin Panel']
            const col = i === 4 ? 'var(--text-muted)' : 'var(--text-secondary)'
            return `<li><a href="${href}" style="color:${col};text-decoration:none;font-size:14px;transition:color 0.2s" onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='${col}'">${labels[i]}</a></li>`
          }).join('')}
        </ul>
      </div>
      <div>
        <h4 style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:3px;margin-bottom:16px">Materials</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
          ${['PLA','ABS','PETG','Resin','TPU','Nylon'].map(m =>
            `<li><a href="/products?material=${m}" style="color:var(--text-secondary);text-decoration:none;font-size:14px;transition:color 0.2s" onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">${m}</a></li>`
          ).join('')}
        </ul>
      </div>
    </div>
    <div class="divider" style="margin-bottom:24px"></div>
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px">
      <p style="color:var(--text-muted);font-size:13px">&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved. Puerto Rico, USA</p>
      <p style="color:var(--text-muted);font-size:13px">Powered by precision FDM &amp; Resin 3D printing</p>
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
  const existing = cart.find(i => i.id == id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, name, price: parseFloat(price), image, quantity });
  }
  saveCart();
  showToast('Added to cart!', 'check-circle', 'var(--neon-green)');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id != id);
  saveCart();
}

function updateQuantity(id, delta) {
  const item = cart.find(i => i.id == id);
  if (item) { item.quantity = Math.max(1, item.quantity + delta); saveCart(); }
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
    badge.style.display = totalQty === 0 ? 'none' : 'flex';
    badge.classList.toggle('hidden', totalQty === 0);
  }

  const cartEmpty = document.getElementById('cart-empty');
  const cartList = document.getElementById('cart-list');
  const cartFooter = document.getElementById('cart-footer');

  if (cart.length === 0) {
    if (cartEmpty) cartEmpty.style.display = 'block';
    if (cartList) cartList.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'none';
  } else {
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartList) { cartList.style.display = 'flex'; cartList.classList.remove('hidden'); }
    if (cartFooter) { cartFooter.style.display = 'block'; cartFooter.classList.remove('hidden'); }

    if (cartList) {
      cartList.innerHTML = cart.map(item => \`
        <div style="display:flex;align-items:flex-start;gap:12px;padding:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px">
          <div style="width:56px;height:56px;background:linear-gradient(135deg,#080d18,#101829);border:1px solid rgba(0,245,255,0.15);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">
            \${item.image && !item.image.startsWith('data:') ? \`<img src="\${item.image}" alt="\${item.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.parentNode.innerHTML='<i class=\\"fas fa-cube\\" style=\\"color:var(--neon-cyan);font-size:20px\\"></i>'">\` : '<i class="fas fa-cube" style="color:var(--neon-cyan);font-size:20px"></i>'}
          </div>
          <div style="flex:1;min-width:0">
            <p style="font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${item.name}</p>
            <p style="color:var(--neon-cyan);font-weight:700;font-size:14px;margin-top:2px">$\${item.price.toFixed(2)}</p>
            <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
              <button onclick="updateQuantity('\${item.id}',-1)" class="quantity-btn"><i class="fas fa-minus" style="font-size:10px"></i></button>
              <span style="font-size:13px;font-weight:600;color:#fff;width:24px;text-align:center">\${item.quantity}</span>
              <button onclick="updateQuantity('\${item.id}',1)" class="quantity-btn"><i class="fas fa-plus" style="font-size:10px"></i></button>
              <button onclick="removeFromCart('\${item.id}')" style="margin-left:4px;background:none;border:none;cursor:pointer;color:#ff5555;padding:4px;transition:color 0.2s">
                <i class="fas fa-trash-alt" style="font-size:12px"></i>
              </button>
            </div>
          </div>
          <div style="font-weight:700;color:#fff;font-size:14px;flex-shrink:0">$\${(item.price*item.quantity).toFixed(2)}</div>
        </div>
      \`).join('');
    }

    const els = { sub:'cart-subtotal', tax:'cart-tax', ship:'cart-shipping', tot:'cart-total' };
    const v = document.getElementById(els.sub); if(v) v.textContent='$'+subtotal.toFixed(2);
    const t = document.getElementById(els.tax); if(t) t.textContent='$'+tax.toFixed(2);
    const s = document.getElementById(els.ship); if(s) s.textContent = shipping===0?'FREE':'$'+shipping.toFixed(2);
    const to = document.getElementById(els.tot); if(to) to.textContent='$'+total.toFixed(2);
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

function showToast(message, icon = 'check-circle', iconColor = 'var(--neon-green)') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  if (toastIcon) { toastIcon.className = 'fas fa-' + icon; toastIcon.style.color = iconColor; }
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

updateCartUI();
</script>
</body>
</html>`
}
