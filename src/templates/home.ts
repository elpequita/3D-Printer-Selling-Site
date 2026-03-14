export function getHomePage(featuredProducts: any[], categories: any[], settings: Record<string, string>, keychains: any[] = []): string {
  const heroTitle = settings.hero_title || 'Custom 3D Printing Services'
  const heroSubtitle = settings.hero_subtitle || 'From concept to reality — precision, quality, and speed.'

  const categoryIconMap: Record<string, string> = {
    'home': 'fa-home', 'wrench': 'fa-wrench', 'star': 'fa-star',
    'gem': 'fa-gem', 'magic': 'fa-magic', 'flask': 'fa-flask',
    'cube': 'fa-cube', 'cog': 'fa-cog', 'key': 'fa-key'
  }

  const neonColors = ['var(--neon-cyan)', 'var(--neon-purple)', 'var(--neon-green)', 'var(--neon-orange)', 'var(--neon-pink)', 'var(--neon-cyan)']
  const gradients = [
    'linear-gradient(135deg,rgba(0,245,255,0.12),rgba(0,128,255,0.08))',
    'linear-gradient(135deg,rgba(191,0,255,0.12),rgba(100,0,200,0.08))',
    'linear-gradient(135deg,rgba(0,255,136,0.12),rgba(0,180,80,0.08))',
    'linear-gradient(135deg,rgba(255,107,0,0.12),rgba(255,0,128,0.08))',
    'linear-gradient(135deg,rgba(0,245,255,0.10),rgba(191,0,255,0.08))',
    'linear-gradient(135deg,rgba(255,0,128,0.12),rgba(191,0,255,0.08))',
  ]

  const productCards = featuredProducts.map((p, idx) => {
    const neon = neonColors[idx % neonColors.length]
    const grad = gradients[idx % gradients.length]
    const displayPrice = p.sale_price
      ? `<span style="color:var(--text-secondary);text-decoration:line-through;font-size:13px">$${parseFloat(p.price).toFixed(2)}</span><span style="color:var(--neon-cyan);font-weight:800;font-size:18px;margin-left:6px">$${parseFloat(p.sale_price).toFixed(2)}</span>`
      : `<span style="color:var(--neon-cyan);font-weight:800;font-size:18px">$${parseFloat(p.price).toFixed(2)}</span>`
    return `
    <div class="glass-card card-glow-cyan" style="border-radius:20px;overflow:hidden;display:flex;flex-direction:column;cursor:pointer" onclick="window.location='/products/${p.slug}'">
      <div style="position:relative;height:200px;background:linear-gradient(135deg,#080d18,#101829);overflow:hidden">
        <img src="${p.primary_image || ''}" alt="${p.name}"
             style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease"
             onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'"
             onerror="this.style.display='none';this.parentNode.querySelector('.img-fallback').style.display='flex'">
        <div class="img-fallback" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;background:linear-gradient(135deg,#080d18,#101829)">
          <i class="fas fa-cube" style="color:${neon};font-size:48px;filter:drop-shadow(0 0 12px ${neon})"></i>
        </div>
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(2,4,10,0.7) 0%,transparent 60%)"></div>
        ${p.is_customizable ? `<span style="position:absolute;top:12px;left:12px;background:rgba(255,107,0,0.85);color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:700;backdrop-filter:blur(8px)"><i class="fas fa-magic mr-1"></i>Custom</span>` : ''}
        ${p.is_featured ? `<span style="position:absolute;top:12px;right:12px;background:rgba(0,245,255,0.2);border:1px solid rgba(0,245,255,0.5);color:var(--neon-cyan);font-size:11px;padding:3px 10px;border-radius:20px;font-weight:700;backdrop-filter:blur(8px)">Featured</span>` : ''}
      </div>
      <div style="padding:18px 20px;flex:1;display:flex;flex-direction:column;gap:8px">
        <span style="font-size:11px;font-weight:700;color:${neon};text-transform:uppercase;letter-spacing:1.5px">${p.category_name || 'Product'}</span>
        <h3 style="font-size:16px;font-weight:700;color:#fff;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${p.name}</h3>
        <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${p.short_description || (p.description || '').substring(0,100)}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:10px">
          <span style="font-size:11px;color:var(--text-muted);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);padding:3px 10px;border-radius:20px">
            <i class="fas fa-layer-group mr-1" style="color:${neon}"></i>${p.material}
          </span>
          <div>${displayPrice}</div>
        </div>
      </div>
      <div style="padding:0 20px 20px">
        <button onclick="addToCart(${p.id},'${p.name.replace(/'/g, "\\'")}',${p.sale_price || p.price},'${p.primary_image || ''}');event.stopPropagation()"
                class="btn-solid-cyan" style="width:100%;padding:11px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer">
          <i class="fas fa-cart-plus mr-2"></i>Add to Cart
        </button>
      </div>
    </div>`
  }).join('')

  const categoryCards = categories.map((cat, idx) => {
    const neon = neonColors[idx % neonColors.length]
    const grad = gradients[idx % gradients.length]
    const iconClass = categoryIconMap[cat.icon] || 'fa-cube'
    return `
    <a href="/products?category=${cat.slug}" style="display:block;text-decoration:none;border-radius:20px;padding:24px;text-align:center;background:${grad};border:1px solid rgba(255,255,255,0.06);transition:all 0.3s;cursor:pointer"
       onmouseover="this.style.borderColor='${neon}';this.style.boxShadow='0 0 25px rgba(0,0,0,0.4), 0 0 20px ${neon}22';this.style.transform='translateY(-4px)'"
       onmouseout="this.style.borderColor='rgba(255,255,255,0.06)';this.style.boxShadow='none';this.style.transform='none'">
      <div style="width:52px;height:52px;margin:0 auto 12px;background:${grad};border:1px solid ${neon}44;border-radius:14px;display:flex;align-items:center;justify-content:center">
        <i class="fas ${iconClass}" style="color:${neon};font-size:20px;filter:drop-shadow(0 0 6px ${neon})"></i>
      </div>
      <h3 style="font-weight:700;color:#fff;font-size:14px;margin-bottom:4px">${cat.name}</h3>
      <p style="font-size:12px;color:var(--text-secondary)">${cat.product_count || 0} products</p>
    </a>`
  }).join('')

  const materialDefs = [
    { name:'PLA', desc:'Eco-friendly', icon:'fa-leaf', neon:'var(--neon-green)', grad:'linear-gradient(135deg,rgba(0,255,136,0.15),rgba(0,180,80,0.08))' },
    { name:'ABS', desc:'High-strength', icon:'fa-shield-alt', neon:'#ff4444', grad:'linear-gradient(135deg,rgba(255,68,68,0.15),rgba(180,0,0,0.08))' },
    { name:'PETG', desc:'Food-safe', icon:'fa-flask', neon:'var(--neon-cyan)', grad:'linear-gradient(135deg,rgba(0,245,255,0.15),rgba(0,128,255,0.08))' },
    { name:'TPU', desc:'Flexible', icon:'fa-expand-alt', neon:'var(--neon-purple)', grad:'linear-gradient(135deg,rgba(191,0,255,0.15),rgba(100,0,200,0.08))' },
    { name:'Resin', desc:'Ultra-detail', icon:'fa-star', neon:'var(--neon-orange)', grad:'linear-gradient(135deg,rgba(255,107,0,0.15),rgba(255,0,128,0.08))' },
    { name:'Nylon', desc:'Industrial', icon:'fa-industry', neon:'#aaa', grad:'linear-gradient(135deg,rgba(170,170,170,0.1),rgba(80,80,80,0.08))' },
  ]

  const steps = [
    { icon:'fa-search', step:'01', title:'Browse & Choose', desc:'Explore our catalog or bring your own design idea' },
    { icon:'fa-cube', step:'02', title:'Customize & Preview', desc:'Use our 3D viewer to rotate and visualize your design' },
    { icon:'fa-credit-card', step:'03', title:'Order & Pay', desc:'Securely checkout with PayPal integration' },
    { icon:'fa-truck', step:'04', title:'Print & Deliver', desc:'We print with precision and ship to your door' }
  ]

  return `
<!-- Hero Section -->
<section style="position:relative;overflow:hidden;padding:80px 24px 100px;background:linear-gradient(135deg,var(--bg-base) 0%,#0d1424 50%,var(--bg-base) 100%)">
  <!-- Animated orbs -->
  <div class="orb orb-cyan" style="width:600px;height:600px;top:-200px;left:-100px;opacity:0.6"></div>
  <div class="orb orb-purple" style="width:500px;height:500px;bottom:-150px;right:-50px;opacity:0.5"></div>
  <div class="bg-grid" style="position:absolute;inset:0;opacity:0.4"></div>

  <!-- Floating cubes decoration -->
  <div style="position:absolute;right:5%;top:50%;transform:translateY(-50%);display:none" id="hero-cubes">
    ${[...Array(6)].map((_, i) => `<div style="width:70px;height:70px;border:1px solid rgba(0,245,255,${0.1 + i*0.05});border-radius:14px;display:flex;align-items:center;justify-content:center;animation:float ${3+i*0.4}s ease-in-out infinite;animation-delay:${i*0.3}s;background:rgba(0,245,255,0.03)"><i class="fas fa-cube" style="color:rgba(0,245,255,0.3);font-size:28px"></i></div>`).join('')}
  </div>
  <style>@media(min-width:1100px){#hero-cubes{display:grid!important;grid-template-columns:1fr 1fr;gap:16px}}</style>

  <div style="max-width:1280px;margin:0 auto;position:relative;z-index:2">
    <div style="max-width:680px">
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(0,245,255,0.08);border:1px solid rgba(0,245,255,0.2);color:var(--neon-cyan);padding:8px 18px;border-radius:50px;font-size:13px;font-weight:600;margin-bottom:28px;letter-spacing:0.5px">
        <span style="width:8px;height:8px;background:var(--neon-cyan);border-radius:50%;box-shadow:0 0 8px var(--neon-cyan);animation:pulse-glow 2s infinite"></span>
        Puerto Rico's Premier 3D Printing Studio
      </div>
      <h1 style="font-size:clamp(36px,5vw,62px);font-weight:900;line-height:1.1;margin-bottom:24px" class="font-display text-gradient-hero">${heroTitle}</h1>
      <p style="font-size:18px;color:var(--text-secondary);line-height:1.7;margin-bottom:36px;max-width:560px">${heroSubtitle}</p>
      <div style="display:flex;flex-wrap:wrap;gap:14px;margin-bottom:44px">
        <a href="/products" class="btn-solid-cyan" style="display:inline-flex;align-items:center;gap:10px;padding:16px 32px;border-radius:14px;font-size:16px;font-weight:700;text-decoration:none">
          <i class="fas fa-th-large"></i>Browse Products
        </a>
        <a href="/preview" class="btn-neon-purple" style="display:inline-flex;align-items:center;gap:10px;padding:16px 32px;border-radius:14px;font-size:16px;font-weight:700;text-decoration:none">
          <i class="fas fa-cube"></i>3D Preview Tool
        </a>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:20px">
        ${['Fast Turnaround (2-5 days)','Premium Materials','100% Custom Designs','Secure PayPal Payments'].map(t =>
          `<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-secondary)"><i class="fas fa-check-circle" style="color:var(--neon-green)"></i>${t}</div>`
        ).join('')}
      </div>
    </div>
  </div>
</section>

<!-- Stats Bar -->
<section style="background:rgba(13,20,36,0.9);border-top:1px solid rgba(0,245,255,0.08);border-bottom:1px solid rgba(0,245,255,0.08)">
  <div style="max-width:1280px;margin:0 auto;padding:32px 24px">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:24px;text-align:center">
      ${[
        { val:'500+', label:'Happy Customers', neon:'var(--neon-cyan)' },
        { val:'1000+', label:'Items Printed', neon:'var(--neon-purple)' },
        { val:'6', label:'Material Types', neon:'var(--neon-green)' },
        { val:'3-5', label:'Day Delivery', neon:'var(--neon-orange)' },
      ].map(s => `
      <div>
        <div class="font-display" style="font-size:32px;font-weight:800;color:${s.neon};filter:drop-shadow(0 0 10px ${s.neon}88)">${s.val}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">${s.label}</div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- Categories -->
<section style="max-width:1280px;margin:0 auto;padding:80px 24px">
  <div style="text-align:center;margin-bottom:48px">
    <span style="font-size:12px;font-weight:700;color:var(--neon-cyan);text-transform:uppercase;letter-spacing:3px">Explore</span>
    <h2 class="font-display" style="font-size:clamp(24px,3vw,36px);font-weight:800;color:#fff;margin-top:10px">Shop by Category</h2>
    <p style="color:var(--text-secondary);margin-top:10px;max-width:500px;margin-left:auto;margin-right:auto">From home décor to functional prototypes — find the perfect print</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px">
    ${categoryCards}
  </div>
</section>

<!-- Keychains Spotlight -->
<section style="padding:80px 24px;background:linear-gradient(135deg,rgba(191,0,255,0.04),rgba(0,245,255,0.03));border-top:1px solid rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.04)">
  <div style="max-width:1280px;margin:0 auto">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:48px;flex-wrap:wrap;gap:16px">
      <div>
        <span style="font-size:12px;font-weight:700;color:var(--neon-purple);text-transform:uppercase;letter-spacing:3px">
          <i class="fas fa-key" style="margin-right:6px"></i>Keychains
        </span>
        <h2 class="font-display" style="font-size:clamp(24px,3vw,36px);font-weight:800;color:#fff;margin-top:10px">Custom Keychains</h2>
        <p style="color:var(--text-secondary);margin-top:6px;max-width:500px">The perfect personalized gift — your name, logo, or favorite shape, printed in 3D</p>
      </div>
      <a href="/products?category=keychains" style="color:var(--neon-purple);text-decoration:none;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;border:1px solid rgba(191,0,255,0.3);padding:10px 20px;border-radius:50px;transition:all 0.3s"
         onmouseover="this.style.background='rgba(191,0,255,0.08)';this.style.boxShadow='0 0 15px rgba(191,0,255,0.2)'"
         onmouseout="this.style.background='none';this.style.boxShadow='none'">
        View All Keychains <i class="fas fa-arrow-right"></i>
      </a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px">
      ${keychains.length > 0 ? keychains.map((p: any, idx: number) => {
        const neon = ['var(--neon-purple)','var(--neon-cyan)','var(--neon-pink)','var(--neon-orange)'][idx % 4]
        return `
        <div class="glass-card" style="border-radius:18px;overflow:hidden;display:flex;flex-direction:column;cursor:pointer;border:1px solid rgba(191,0,255,0.12);transition:all 0.3s"
             onclick="window.location='/products/${p.slug}'"
             onmouseover="this.style.borderColor='${neon}';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,0.4),0 0 20px ${neon}22'"
             onmouseout="this.style.borderColor='rgba(191,0,255,0.12)';this.style.transform='none';this.style.boxShadow='none'">
          <div style="position:relative;height:170px;background:linear-gradient(135deg,#080d18,#0f0820);overflow:hidden">
            <img src="${p.primary_image || ''}" alt="${p.name}"
                 style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease"
                 onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'"
                 onerror="this.style.display='none';this.parentNode.querySelector('.kc-fallback').style.display='flex'">
            <div class="kc-fallback" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;background:linear-gradient(135deg,#080d18,#0f0820)">
              <i class="fas fa-key" style="color:${neon};font-size:42px;filter:drop-shadow(0 0 12px ${neon})"></i>
            </div>
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(2,4,10,0.6) 0%,transparent 60%)"></div>
            ${p.is_customizable ? `<span style="position:absolute;top:10px;left:10px;background:rgba(191,0,255,0.8);color:#fff;font-size:10px;padding:3px 9px;border-radius:20px;font-weight:700;backdrop-filter:blur(8px)"><i class="fas fa-magic" style="margin-right:4px"></i>Custom</span>` : ''}
          </div>
          <div style="padding:14px 16px;flex:1;display:flex;flex-direction:column;gap:6px">
            <h3 style="font-size:14px;font-weight:700;color:#fff;line-height:1.3">${p.name}</h3>
            <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${p.short_description || ''}</p>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:8px">
              <span style="font-size:10px;color:var(--text-muted);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);padding:2px 8px;border-radius:20px">
                <i class="fas fa-layer-group" style="color:${neon};margin-right:3px"></i>${p.material}
              </span>
              <span style="color:${neon};font-weight:800;font-size:16px">$${parseFloat(p.price).toFixed(2)}</span>
            </div>
          </div>
          <div style="padding:0 16px 14px">
            <button onclick="addToCart(${p.id},'${p.name.replace(/'/g, "\\'")}',${p.price},'${p.primary_image || ''}');event.stopPropagation()"
                    style="width:100%;padding:9px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;background:rgba(191,0,255,0.15);border:1px solid rgba(191,0,255,0.4);color:var(--neon-purple);transition:all 0.3s"
                    onmouseover="this.style.background='rgba(191,0,255,0.3)'" onmouseout="this.style.background='rgba(191,0,255,0.15)'">
              <i class="fas fa-cart-plus" style="margin-right:6px"></i>Add to Cart
            </button>
          </div>
        </div>`
      }).join('') : `
      <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-muted)">
        <i class="fas fa-key" style="font-size:48px;margin-bottom:16px;display:block;opacity:0.2"></i>
        <p style="font-size:16px">Keychains coming soon.</p>
      </div>`}
    </div>
  </div>
</section>

<!-- Featured Products -->
<section style="padding:80px 0;background:linear-gradient(180deg,rgba(8,13,24,0) 0%,rgba(8,13,24,0.8) 20%,rgba(8,13,24,0.8) 80%,rgba(8,13,24,0) 100%)">
  <div style="max-width:1280px;margin:0 auto;padding:0 24px">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:48px;flex-wrap:wrap;gap:16px">
      <div>
        <span style="font-size:12px;font-weight:700;color:var(--neon-cyan);text-transform:uppercase;letter-spacing:3px">Top Picks</span>
        <h2 class="font-display" style="font-size:clamp(24px,3vw,36px);font-weight:800;color:#fff;margin-top:10px">Featured Products</h2>
        <p style="color:var(--text-secondary);margin-top:6px">Our most popular custom 3D printed items</p>
      </div>
      <a href="/products" style="color:var(--neon-cyan);text-decoration:none;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;border:1px solid rgba(0,245,255,0.25);padding:10px 20px;border-radius:50px;transition:all 0.3s"
         onmouseover="this.style.background='rgba(0,245,255,0.08)';this.style.boxShadow='0 0 15px rgba(0,245,255,0.2)'"
         onmouseout="this.style.background='none';this.style.boxShadow='none'">
        View All <i class="fas fa-arrow-right"></i>
      </a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px">
      ${productCards || `<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-muted)"><i class="fas fa-cube" style="font-size:48px;margin-bottom:16px;display:block;opacity:0.2"></i><p style="font-size:16px">No featured products yet.</p></div>`}
    </div>
  </div>
</section>

<!-- How It Works -->
<section style="max-width:1280px;margin:0 auto;padding:80px 24px">
  <div style="text-align:center;margin-bottom:56px">
    <span style="font-size:12px;font-weight:700;color:var(--neon-purple);text-transform:uppercase;letter-spacing:3px">Process</span>
    <h2 class="font-display" style="font-size:clamp(24px,3vw,36px);font-weight:800;color:#fff;margin-top:10px">How It Works</h2>
    <p style="color:var(--text-secondary);margin-top:10px">Getting your custom 3D print is simple and fast</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px;position:relative">
    <!-- Connector line desktop -->
    <div style="position:absolute;top:40px;left:12%;right:12%;height:1px;background:linear-gradient(90deg,transparent,rgba(0,245,255,0.2),rgba(191,0,255,0.2),rgba(0,245,255,0.2),transparent)" class="hide-mobile"></div>
    ${steps.map((s, i) => {
      const nc = neonColors[i]
      return `
    <div style="text-align:center;position:relative">
      <div style="position:relative;display:inline-block;margin-bottom:20px">
        <div style="width:80px;height:80px;background:linear-gradient(135deg,rgba(0,245,255,0.08),rgba(191,0,255,0.05));border:1px solid rgba(0,245,255,0.15);border-radius:24px;display:flex;align-items:center;justify-content:center;margin:0 auto;transition:all 0.3s"
             onmouseover="this.style.borderColor='${nc}';this.style.boxShadow='0 0 25px ${nc}33'"
             onmouseout="this.style.borderColor='rgba(0,245,255,0.15)';this.style.boxShadow='none'">
          <i class="fas ${s.icon}" style="color:${nc};font-size:28px;filter:drop-shadow(0 0 8px ${nc})"></i>
        </div>
        <span class="font-display" style="position:absolute;top:-8px;right:-8px;width:26px;height:26px;background:${nc};color:#000;font-size:10px;font-weight:800;border-radius:50%;display:flex;align-items:center;justify-content:center">${s.step}</span>
      </div>
      <h3 style="font-weight:700;color:#fff;font-size:15px;margin-bottom:8px">${s.title}</h3>
      <p style="color:var(--text-secondary);font-size:13px;line-height:1.6">${s.desc}</p>
    </div>`
    }).join('')}
  </div>
</section>

<!-- Materials Section -->
<section style="padding:80px 24px;background:linear-gradient(135deg,rgba(8,13,24,0.95),rgba(13,20,36,0.95));border-top:1px solid rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.04)">
  <div style="max-width:1280px;margin:0 auto">
    <div style="text-align:center;margin-bottom:48px">
      <span style="font-size:12px;font-weight:700;color:var(--neon-orange);text-transform:uppercase;letter-spacing:3px">Materials</span>
      <h2 class="font-display" style="font-size:clamp(24px,3vw,36px);font-weight:800;color:#fff;margin-top:10px">Premium Materials</h2>
      <p style="color:var(--text-secondary);margin-top:10px">We use only the highest quality filaments and resins</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px">
      ${materialDefs.map(m => `
      <a href="/products?material=${m.name}" style="display:block;text-decoration:none;text-align:center;padding:24px 16px;background:${m.grad};border:1px solid rgba(255,255,255,0.06);border-radius:20px;transition:all 0.3s"
         onmouseover="this.style.borderColor='${m.neon}';this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 30px rgba(0,0,0,0.4),0 0 20px ${m.neon}22'"
         onmouseout="this.style.borderColor='rgba(255,255,255,0.06)';this.style.transform='none';this.style.boxShadow='none'">
        <div style="width:48px;height:48px;margin:0 auto 12px;border-radius:14px;background:${m.grad};border:1px solid ${m.neon}44;display:flex;align-items:center;justify-content:center">
          <i class="fas ${m.icon}" style="color:${m.neon};font-size:20px;filter:drop-shadow(0 0 6px ${m.neon})"></i>
        </div>
        <h4 style="font-weight:700;color:#fff;font-size:15px;margin-bottom:4px">${m.name}</h4>
        <p style="color:var(--text-secondary);font-size:12px">${m.desc}</p>
      </a>`).join('')}
    </div>
  </div>
</section>

<!-- CTA Section -->
<section style="max-width:1280px;margin:0 auto;padding:80px 24px">
  <div style="position:relative;border-radius:28px;overflow:hidden;padding:64px 48px;background:linear-gradient(135deg,rgba(0,245,255,0.06),rgba(191,0,255,0.04));border:1px solid rgba(0,245,255,0.15);text-align:center">
    <div class="orb orb-cyan" style="width:400px;height:400px;top:-150px;left:-100px;opacity:0.4"></div>
    <div class="orb orb-purple" style="width:350px;height:350px;bottom:-100px;right:-80px;opacity:0.3"></div>
    <div style="position:relative;z-index:1">
      <div style="width:64px;height:64px;margin:0 auto 20px;background:linear-gradient(135deg,rgba(0,245,255,0.12),rgba(191,0,255,0.12));border:1px solid rgba(0,245,255,0.3);border-radius:20px;display:flex;align-items:center;justify-content:center">
        <i class="fas fa-cube" style="color:var(--neon-cyan);font-size:28px;filter:drop-shadow(0 0 10px var(--neon-cyan))"></i>
      </div>
      <h2 class="font-display" style="font-size:clamp(24px,3vw,40px);font-weight:800;color:#fff;margin-bottom:16px">Have a Custom Idea?</h2>
      <p style="color:var(--text-secondary);font-size:16px;max-width:560px;margin:0 auto 36px;line-height:1.7">Upload your image or describe your vision. Use our interactive 3D viewer to rotate and visualize your printed concept from every angle.</p>
      <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px">
        <a href="/preview" class="btn-solid-cyan" style="display:inline-flex;align-items:center;gap:10px;padding:16px 32px;border-radius:14px;font-size:15px;font-weight:700;text-decoration:none">
          <i class="fas fa-cube"></i>Try 3D Preview Tool
        </a>
        <a href="/contact" class="btn-neon-cyan" style="display:inline-flex;align-items:center;gap:10px;padding:16px 32px;border-radius:14px;font-size:15px;font-weight:700;text-decoration:none">
          <i class="fas fa-comments"></i>Talk to Us
        </a>
      </div>
    </div>
  </div>
</section>
`
}
