export function getProductDetailPage(product: any, relatedProducts: any[], settings: Record<string, string>): string {
  const images = product.images || []
  const primaryImage = images.find((i: any) => i.is_primary) || images[0]
  const dims = product.dimensions_mm ? (() => { try { return JSON.parse(product.dimensions_mm) } catch { return null } })() : null
  const displayPrice = product.sale_price
    ? `<div style="display:flex;align-items:baseline;gap:10px"><span style="color:var(--text-secondary);text-decoration:line-through;font-size:18px">$${parseFloat(product.price).toFixed(2)}</span><span style="color:var(--neon-cyan);font-weight:900;font-size:36px;filter:drop-shadow(0 0 12px rgba(0,245,255,0.4))">$${parseFloat(product.sale_price).toFixed(2)}</span></div>`
    : `<span style="color:var(--neon-cyan);font-weight:900;font-size:36px;filter:drop-shadow(0 0 12px rgba(0,245,255,0.4))">$${parseFloat(product.price).toFixed(2)}</span>`

  const imageGallery = images.length > 0 ? images.map((img: any, idx: number) => `
    <button onclick="showImage('${img.url}', this)"
            style="width:64px;height:64px;border-radius:12px;overflow:hidden;border:2px solid ${idx === 0 ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.08)'};flex-shrink:0;cursor:pointer;padding:0;background:transparent;transition:border-color 0.2s"
            class="gallery-thumb">
      <img src="${img.url}" alt="${img.alt_text || product.name}" style="width:100%;height:100%;object-fit:cover"
           onerror="this.parentNode.style.display='none'">
    </button>`).join('') : ''

  const relatedCards = relatedProducts.map(p => `
    <a href="/products/${p.slug}" style="display:block;text-decoration:none;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);background:rgba(13,20,36,0.6);transition:all 0.3s"
       onmouseover="this.style.borderColor='rgba(0,245,255,0.25)';this.style.transform='translateY(-3px)'"
       onmouseout="this.style.borderColor='rgba(255,255,255,0.06)';this.style.transform='none'">
      <div style="height:130px;background:linear-gradient(135deg,#080d18,#101829);overflow:hidden">
        <img src="${p.primary_image || ''}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s"
             onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'"
             onerror="this.style.display='none';this.parentNode.innerHTML+='<div style=\\"display:flex;align-items:center;justify-content:center;height:100%\\"><i class=\\"fas fa-cube\\" style=\\"color:var(--neon-cyan);font-size:32px\\"></i></div>'">
      </div>
      <div style="padding:12px 14px">
        <h4 style="font-size:13px;font-weight:700;color:#fff;margin-bottom:6px;line-height:1.3">${p.name}</h4>
        <span style="color:var(--neon-cyan);font-weight:700;font-size:14px">$${parseFloat(p.price).toFixed(2)}</span>
      </div>
    </a>`).join('')

  const specs = [
    ['Material', product.material, 'fa-layer-group'],
    ['Color', product.color, 'fa-palette'],
    ...(product.weight_grams ? [['Weight', `${product.weight_grams}g`, 'fa-weight']] : []),
    ...(dims ? [['Dimensions', `${dims.x}×${dims.y}×${dims.z}mm`, 'fa-ruler-combined']] : []),
    ...(product.print_time_hours ? [['Print Time', `${product.print_time_hours}h`, 'fa-hourglass-half']] : []),
    ['Lead Time', `${product.lead_time_days || 3} days`, 'fa-truck'],
  ] as [string, string, string][]

  return `
<div style="max-width:1280px;margin:0 auto;padding:32px 24px">
  <!-- Breadcrumb -->
  <nav style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted);margin-bottom:36px;flex-wrap:wrap">
    <a href="/" style="color:var(--text-secondary);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">Home</a>
    <i class="fas fa-chevron-right" style="font-size:10px;color:var(--text-muted)"></i>
    <a href="/products" style="color:var(--text-secondary);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">Products</a>
    ${product.category_name ? `<i class="fas fa-chevron-right" style="font-size:10px;color:var(--text-muted)"></i><a href="/products?category=${product.category_slug}" style="color:var(--text-secondary);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">${product.category_name}</a>` : ''}
    <i class="fas fa-chevron-right" style="font-size:10px;color:var(--text-muted)"></i>
    <span style="color:#fff;font-weight:500">${product.name}</span>
  </nav>

  <div style="display:grid;grid-template-columns:1fr;gap:40px;margin-bottom:64px" id="product-layout">
    <!-- Image Section -->
    <div id="product-images">
      <div id="main-image-container" style="position:relative;aspect-ratio:1;border-radius:24px;overflow:hidden;background:linear-gradient(135deg,#080d18,#101829);border:1px solid rgba(0,245,255,0.12);box-shadow:0 0 40px rgba(0,0,0,0.5);margin-bottom:16px">
        ${primaryImage ? `
        <img id="main-image" src="${primaryImage.url}" alt="${product.name}"
             style="width:100%;height:100%;object-fit:cover"
             onerror="this.style.display='none';document.getElementById('main-img-ph').style.display='flex'">
        <div id="main-img-ph" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center">
          <i class="fas fa-cube" style="color:var(--neon-cyan);font-size:80px;filter:drop-shadow(0 0 20px rgba(0,245,255,0.5))"></i>
        </div>` : `
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
          <i class="fas fa-cube" style="color:var(--neon-cyan);font-size:80px;filter:drop-shadow(0 0 20px rgba(0,245,255,0.5))"></i>
        </div>`}
        ${product.is_customizable ? `
        <div style="position:absolute;top:16px;left:16px">
          <span style="background:linear-gradient(135deg,#ff6b00,#ff0080);color:#fff;font-size:12px;padding:5px 14px;border-radius:50px;font-weight:700;box-shadow:0 4px 15px rgba(255,107,0,0.4)">
            <i class="fas fa-magic mr-1"></i>Customizable
          </span>
        </div>` : ''}
        <!-- Scan line corner decoration -->
        <div style="position:absolute;top:12px;right:12px;width:24px;height:24px;border-top:2px solid rgba(0,245,255,0.4);border-right:2px solid rgba(0,245,255,0.4);border-radius:0 6px 0 0"></div>
        <div style="position:absolute;bottom:12px;left:12px;width:24px;height:24px;border-bottom:2px solid rgba(0,245,255,0.4);border-left:2px solid rgba(0,245,255,0.4);border-radius:0 0 0 6px"></div>
      </div>
      ${images.length > 1 ? `
      <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:4px">
        ${imageGallery}
      </div>` : ''}
    </div>

    <!-- Product Info -->
    <div id="product-info">
      ${product.category_name ? `<span style="font-size:12px;font-weight:700;color:var(--neon-cyan);text-transform:uppercase;letter-spacing:2px">${product.category_name}</span>` : ''}
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-top:8px;margin-bottom:16px">
        <h1 class="font-display" style="font-size:clamp(22px,3vw,32px);font-weight:800;color:#fff;line-height:1.2">${product.name}</h1>
        <div>
          ${product.is_available
            ? '<span style="display:flex;align-items:center;gap:6px;color:var(--neon-green);font-size:13px;font-weight:600;white-space:nowrap"><span style="width:8px;height:8px;background:var(--neon-green);border-radius:50%;box-shadow:0 0 8px var(--neon-green)"></span>In Stock</span>'
            : '<span style="display:flex;align-items:center;gap:6px;color:#ff5555;font-size:13px;font-weight:600;white-space:nowrap"><span style="width:8px;height:8px;background:#ff5555;border-radius:50%"></span>Unavailable</span>'}
        </div>
      </div>

      <!-- Stars -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
        <div style="color:#f59e0b;display:flex;gap:2px">
          ${[...Array(4)].map(() => '<i class="fas fa-star" style="font-size:14px"></i>').join('')}
          <i class="fas fa-star-half-alt" style="font-size:14px;color:#f59e0b"></i>
        </div>
        <span style="font-size:13px;color:var(--text-muted)">(4.8 / 5 average)</span>
      </div>

      <div style="margin-bottom:20px">${displayPrice}</div>
      ${product.sale_price ? '<p style="color:var(--neon-green);font-size:13px;font-weight:600;margin-bottom:16px"><i class="fas fa-tag mr-1"></i>Special pricing applied</p>' : ''}

      <p style="color:var(--text-secondary);line-height:1.7;font-size:15px;margin-bottom:28px">${product.short_description || ''}</p>

      <!-- Specs Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:28px">
        ${specs.map(([label, val, icon]) => `
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:12px 14px">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">${label}</div>
          <div style="font-size:13px;font-weight:600;color:#fff;display:flex;align-items:center;gap:6px">
            <i class="fas ${icon}" style="color:var(--neon-cyan);font-size:12px"></i>${val}
          </div>
        </div>`).join('')}
      </div>

      <!-- Quantity -->
      <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px">
        <div style="display:flex;align-items:center;border:1px solid rgba(255,255,255,0.1);border-radius:14px;overflow:hidden">
          <button onclick="changeQty(-1)" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);background:transparent;border:none;font-size:16px;font-weight:700;transition:all 0.2s"
                  onmouseover="this.style.background='rgba(0,245,255,0.08)';this.style.color='var(--neon-cyan)'" onmouseout="this.style.background='transparent';this.style.color='var(--text-secondary)'">−</button>
          <span id="qty-display" style="width:48px;text-align:center;font-weight:700;color:#fff;font-size:16px">1</span>
          <button onclick="changeQty(1)" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);background:transparent;border:none;font-size:16px;font-weight:700;transition:all 0.2s"
                  onmouseover="this.style.background='rgba(0,245,255,0.08)';this.style.color='var(--neon-cyan)'" onmouseout="this.style.background='transparent';this.style.color='var(--text-secondary)'">+</button>
        </div>
        <span style="font-size:13px;color:var(--text-muted)">
          ${product.stock_quantity === -1 ? '<i class="fas fa-infinity mr-1" style="color:var(--neon-green)"></i>Made to order' : `${product.stock_quantity} available`}
        </span>
      </div>

      <!-- Action Buttons -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
        <button onclick="addProductToCart(${product.id},'${product.name.replace(/'/g, "\\'")}',${product.sale_price || product.price},'${primaryImage?.url || ''}')"
                class="btn-solid-cyan" style="padding:16px;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer">
          <i class="fas fa-cart-plus mr-2"></i>Add to Cart
        </button>
        <button onclick="buyNow(${product.id},'${product.name.replace(/'/g, "\\'")}',${product.sale_price || product.price},'${primaryImage?.url || ''}')"
                class="btn-solid-fire" style="padding:16px;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer">
          <i class="fas fa-bolt mr-2"></i>Buy Now
        </button>
      </div>

      ${product.is_customizable ? `
      <div style="background:linear-gradient(135deg,rgba(255,107,0,0.08),rgba(255,0,128,0.06));border:1px solid rgba(255,107,0,0.25);border-radius:16px;padding:16px;margin-bottom:20px">
        <h4 style="font-weight:700;color:#ff9940;margin-bottom:8px;font-size:14px"><i class="fas fa-magic mr-2"></i>This product is customizable!</h4>
        <p style="font-size:13px;color:var(--text-secondary)">Add to cart and include your customization notes at checkout, or <a href="/preview" style="color:var(--neon-cyan)">use our 3D Preview Tool</a> to visualize your design first.</p>
      </div>` : ''}

      <!-- Trust Badges -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06)">
        ${[
          { icon:'fa-lock', label:'Secure Payment', color:'var(--neon-green)' },
          { icon:'fa-medal', label:'Quality Guarantee', color:'var(--neon-cyan)' },
          { icon:'fa-undo', label:'Easy Returns', color:'var(--neon-purple)' },
        ].map(b => `
        <div style="text-align:center">
          <i class="fas ${b.icon}" style="color:${b.color};font-size:20px;display:block;margin-bottom:6px;filter:drop-shadow(0 0 6px ${b.color})"></i>
          <span style="font-size:11px;color:var(--text-secondary)">${b.label}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>
  <style>@media(min-width:768px){#product-layout{grid-template-columns:1fr 1fr}}</style>

  <!-- Description Tabs -->
  <div class="glass-card" style="border-radius:24px;padding:0;overflow:hidden;margin-bottom:64px">
    <div style="display:flex;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 8px">
      ${['description','specs','shipping'].map((tab, i) => {
        const labels = ['Description','Specifications','Shipping & Info']
        return `<button onclick="showTab('${tab}')" id="tab-${tab}"
                        style="padding:16px 24px;font-size:13px;font-weight:600;cursor:pointer;border:none;background:transparent;transition:all 0.2s;${i === 0 ? 'color:var(--neon-cyan);border-bottom:2px solid var(--neon-cyan)' : 'color:var(--text-secondary);border-bottom:2px solid transparent'}"
                        class="tab-btn">${labels[i]}</button>`
      }).join('')}
    </div>
    <div style="padding:32px">
      <div id="tab-content-description" class="tab-content" style="color:var(--text-secondary);line-height:1.8;font-size:15px">
        ${product.description || 'No description available.'}
        ${product.tags ? `<div style="margin-top:24px;display:flex;flex-wrap:wrap;gap:8px">${product.tags.split(',').map((tag: string) => `<span style="background:rgba(0,245,255,0.06);border:1px solid rgba(0,245,255,0.15);color:var(--neon-cyan);padding:4px 12px;border-radius:50px;font-size:12px">#${tag.trim()}</span>`).join('')}</div>` : ''}
      </div>
      <div id="tab-content-specs" class="tab-content" style="display:none">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tbody>
            ${[
              ['Material', product.material],
              ['Color', product.color],
              ['SKU', product.sku || 'N/A'],
              ['Weight', product.weight_grams ? `${product.weight_grams}g` : 'N/A'],
              ['Dimensions', dims ? `${dims.x}×${dims.y}×${dims.z} mm` : 'N/A'],
              ['Print Time', product.print_time_hours ? `~${product.print_time_hours} hours` : 'N/A'],
              ['Lead Time', `${product.lead_time_days || 3} business days`],
              ['Customizable', product.is_customizable ? 'Yes' : 'No'],
            ].map(([label, val]) => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.04)">
              <td style="padding:12px 0;font-weight:600;color:var(--text-muted);width:140px;font-size:12px;text-transform:uppercase;letter-spacing:1px">${label}</td>
              <td style="padding:12px 0;color:#fff;font-size:14px">${val}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div id="tab-content-shipping" class="tab-content" style="display:none">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:32px;font-size:14px;color:var(--text-secondary)">
          <div>
            <h4 style="font-weight:700;color:#fff;margin-bottom:16px">Shipping Information</h4>
            <div style="display:flex;flex-direction:column;gap:12px">
              <div style="display:flex;align-items:flex-start;gap:12px"><i class="fas fa-clock" style="color:var(--neon-cyan);margin-top:2px"></i><div><strong style="color:#fff">Processing:</strong> ${product.lead_time_days || 3} business days to print</div></div>
              <div style="display:flex;align-items:flex-start;gap:12px"><i class="fas fa-shipping-fast" style="color:var(--neon-cyan);margin-top:2px"></i><div><strong style="color:#fff">Standard Shipping:</strong> $8.99 (Free over $100)</div></div>
              <div style="display:flex;align-items:flex-start;gap:12px"><i class="fas fa-map-marker-alt" style="color:var(--neon-cyan);margin-top:2px"></i><div><strong style="color:#fff">From:</strong> Puerto Rico, USA</div></div>
            </div>
          </div>
          <div>
            <h4 style="font-weight:700;color:#fff;margin-bottom:16px">Returns & Quality</h4>
            <div style="display:flex;flex-direction:column;gap:12px">
              <div style="display:flex;align-items:flex-start;gap:12px"><i class="fas fa-check-circle" style="color:var(--neon-green);margin-top:2px"></i><div>Quality inspected before shipping</div></div>
              <div style="display:flex;align-items:flex-start;gap:12px"><i class="fas fa-undo" style="color:var(--neon-cyan);margin-top:2px"></i><div>30-day return policy for defects</div></div>
              <div style="display:flex;align-items:flex-start;gap:12px"><i class="fas fa-phone-alt" style="color:var(--neon-cyan);margin-top:2px"></i><div>Questions? Call <a href="tel:787-403-1552" style="color:var(--neon-cyan)">787-403-1552</a></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Related Products -->
  ${relatedProducts.length > 0 ? `
  <div>
    <h2 class="font-display" style="font-size:22px;font-weight:800;color:#fff;margin-bottom:24px">You Might Also Like</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
      ${relatedCards}
    </div>
  </div>` : ''}
</div>

<script>
let qty = 1;
function changeQty(delta) {
  qty = Math.max(1, qty + delta);
  document.getElementById('qty-display').textContent = qty;
}
function showImage(url, btn) {
  const img = document.getElementById('main-image');
  if (img) img.src = url;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.style.borderColor = 'rgba(255,255,255,0.08)');
  btn.style.borderColor = 'var(--neon-cyan)';
}
function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.style.color = 'var(--text-secondary)';
    b.style.borderBottom = '2px solid transparent';
  });
  document.getElementById('tab-content-' + tab).style.display = 'block';
  const btn = document.getElementById('tab-' + tab);
  btn.style.color = 'var(--neon-cyan)';
  btn.style.borderBottom = '2px solid var(--neon-cyan)';
}
function addProductToCart(id, name, price, image) {
  addToCart(id, name, price, image, qty);
  toggleCart();
}
function buyNow(id, name, price, image) {
  addToCart(id, name, price, image, qty);
  window.location.href = '/checkout';
}
</script>
`
}
