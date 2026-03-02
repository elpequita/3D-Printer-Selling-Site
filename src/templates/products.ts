export function getProductsPage(products: any[], categories: any[], materials: any[], filters: { category: string, search: string, material: string }): string {
  const neonColors = ['var(--neon-cyan)','var(--neon-purple)','var(--neon-green)','var(--neon-orange)','var(--neon-pink)','var(--neon-cyan)']

  const productCards = products.map((p, idx) => {
    const neon = neonColors[idx % neonColors.length]
    const displayPrice = p.sale_price
      ? `<span style="color:var(--text-secondary);text-decoration:line-through;font-size:12px">$${parseFloat(p.price).toFixed(2)}</span><span style="color:var(--neon-cyan);font-weight:800;font-size:17px;margin-left:6px">$${parseFloat(p.sale_price).toFixed(2)}</span>`
      : `<span style="color:var(--neon-cyan);font-weight:800;font-size:17px">$${parseFloat(p.price).toFixed(2)}</span>`

    return `
    <div class="glass-card" style="border-radius:20px;overflow:hidden;display:flex;flex-direction:column">
      <a href="/products/${p.slug}" style="display:block;text-decoration:none">
        <div style="position:relative;height:190px;background:linear-gradient(135deg,#080d18,#101829);overflow:hidden">
          <img src="${p.primary_image || ''}" alt="${p.name}"
               style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s"
               onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'"
               onerror="this.style.display='none';this.parentNode.querySelector('.img-fb').style.display='flex'">
          <div class="img-fb" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center">
            <i class="fas fa-cube" style="color:${neon};font-size:44px;filter:drop-shadow(0 0 12px ${neon})"></i>
          </div>
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(2,4,10,0.6) 0%,transparent 60%)"></div>
          <div style="position:absolute;top:10px;left:10px;display:flex;gap:6px;flex-wrap:wrap">
            ${p.is_featured ? `<span style="background:rgba(0,245,255,0.2);border:1px solid rgba(0,245,255,0.5);color:var(--neon-cyan);font-size:10px;padding:3px 8px;border-radius:20px;font-weight:700;backdrop-filter:blur(8px)">Featured</span>` : ''}
            ${p.is_customizable ? `<span style="background:rgba(255,107,0,0.8);color:#fff;font-size:10px;padding:3px 8px;border-radius:20px;font-weight:700">Custom</span>` : ''}
            ${p.sale_price ? `<span style="background:rgba(255,0,80,0.8);color:#fff;font-size:10px;padding:3px 8px;border-radius:20px;font-weight:700">Sale</span>` : ''}
          </div>
        </div>
        <div style="padding:16px 18px;flex:1">
          <span style="font-size:10px;font-weight:700;color:${neon};text-transform:uppercase;letter-spacing:1.5px">${p.category_name || 'Uncategorized'}</span>
          <h3 style="font-size:15px;font-weight:700;color:#fff;margin:6px 0 8px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${p.name}</h3>
          <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:12px">${p.short_description || ''}</p>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:11px;color:var(--text-muted);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);padding:2px 8px;border-radius:20px">
              <i class="fas fa-layer-group mr-1" style="color:${neon}"></i>${p.material}
            </span>
            <div>${displayPrice}</div>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:8px;display:flex;align-items:center;gap:4px">
            <i class="fas fa-clock" style="color:var(--neon-green)"></i>${p.lead_time_days || 3} day lead time
          </div>
        </div>
      </a>
      <div style="padding:0 18px 18px">
        <button onclick="addToCart(${p.id},'${p.name.replace(/'/g, "\\'")}',${p.sale_price || p.price},'${p.primary_image || ''}');event.stopPropagation()"
                class="btn-solid-cyan" style="width:100%;padding:10px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer">
          <i class="fas fa-cart-plus mr-2"></i>Add to Cart
        </button>
      </div>
    </div>`
  }).join('')

  const catActiveStyle = `background:var(--neon-cyan);color:#000;font-weight:700;border-color:var(--neon-cyan)`
  const catDefaultStyle = `background:rgba(255,255,255,0.04);color:var(--text-secondary);border:1px solid rgba(255,255,255,0.08)`

  const categoryFilters = `
    <a href="/products" style="display:inline-block;padding:8px 18px;border-radius:50px;font-size:13px;text-decoration:none;transition:all 0.2s;${!filters.category ? catActiveStyle : catDefaultStyle}">All</a>
    ${categories.map(cat => `
    <a href="/products?category=${cat.slug}${filters.material ? '&material='+filters.material : ''}"
       style="display:inline-block;padding:8px 18px;border-radius:50px;font-size:13px;text-decoration:none;transition:all 0.2s;white-space:nowrap;${filters.category === cat.slug ? catActiveStyle : catDefaultStyle}">
      ${cat.name} <span style="opacity:0.6;font-size:11px">(${cat.product_count || 0})</span>
    </a>`).join('')}`

  const materialFilters = materials.map(m => `
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
      <input type="radio" name="material" value="${m.name}" ${filters.material === m.name ? 'checked' : ''}
             onchange="applyMaterialFilter(this.value)"
             style="accent-color:var(--neon-cyan)">
      <span style="font-size:13px;color:var(--text-secondary)">${m.name}</span>
    </label>`).join('')

  return `
<div style="min-height:100vh">
  <!-- Page Header -->
  <div style="padding:48px 24px 32px;border-bottom:1px solid rgba(255,255,255,0.05);background:linear-gradient(135deg,rgba(8,13,24,0.9),rgba(13,20,36,0.9))">
    <div style="max-width:1280px;margin:0 auto">
      <div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px">
        <div>
          <span style="font-size:12px;font-weight:700;color:var(--neon-cyan);text-transform:uppercase;letter-spacing:3px">Catalog</span>
          <h1 class="font-display" style="font-size:clamp(22px,3vw,32px);font-weight:800;color:#fff;margin-top:8px">
            ${filters.search ? `Search: &ldquo;${filters.search}&rdquo;` : filters.category ? `${categories.find(c => c.slug === filters.category)?.name || 'Products'}` : 'All Products'}
          </h1>
          <p style="color:var(--text-secondary);margin-top:4px;font-size:14px">${products.length} product${products.length !== 1 ? 's' : ''} found</p>
        </div>
        <form action="/products" method="GET" style="display:flex;gap:8px;flex-wrap:wrap">
          <input type="hidden" name="category" value="${filters.category}">
          <input type="hidden" name="material" value="${filters.material}">
          <div style="position:relative">
            <input type="text" name="search" value="${filters.search}" placeholder="Search products…"
                   class="dark-input" style="padding:10px 40px 10px 16px;border-radius:12px;font-size:13px;width:220px;font-family:inherit">
            <i class="fas fa-search" style="position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:12px"></i>
          </div>
          <button type="submit" class="btn-solid-cyan" style="padding:10px 20px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer">Search</button>
          ${filters.search || filters.category || filters.material ? `<a href="/products" style="padding:10px 16px;border:1px solid rgba(255,255,255,0.1);border-radius:12px;font-size:13px;color:var(--text-secondary);text-decoration:none;display:flex;align-items:center">Clear</a>` : ''}
        </form>
      </div>
    </div>
  </div>

  <div style="max-width:1280px;margin:0 auto;padding:24px">
    <!-- Category Filters -->
    <div style="margin-bottom:24px;overflow-x:auto;padding-bottom:8px">
      <div style="display:flex;gap:8px;min-width:max-content">
        ${categoryFilters}
      </div>
    </div>

    <div style="display:flex;gap:24px">
      <!-- Sidebar -->
      <aside style="width:200px;flex-shrink:0;display:none" id="sidebar">
        <div class="glass-card" style="padding:20px;border-radius:16px;position:sticky;top:88px">
          <h3 style="font-size:13px;font-weight:700;color:#fff;margin-bottom:16px;display:flex;align-items:center;gap:8px">
            <i class="fas fa-filter" style="color:var(--neon-cyan)"></i>Material Filter
          </h3>
          <div style="display:flex;flex-direction:column;gap:10px">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
              <input type="radio" name="material" value="" ${!filters.material ? 'checked' : ''} onchange="applyMaterialFilter('')" style="accent-color:var(--neon-cyan)">
              <span style="font-size:13px;color:var(--text-secondary)">All Materials</span>
            </label>
            ${materialFilters}
          </div>
          <div style="height:1px;background:rgba(255,255,255,0.06);margin:16px 0"></div>
          <h3 style="font-size:13px;font-weight:700;color:#fff;margin-bottom:12px;display:flex;align-items:center;gap:8px">
            <i class="fas fa-sort" style="color:var(--neon-cyan)"></i>Sort By
          </h3>
          <select onchange="applySorting(this.value)"
                  style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:var(--text-primary);border-radius:10px;padding:8px 12px;font-size:12px;outline:none;font-family:inherit">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </aside>
      <style>@media(min-width:900px){#sidebar{display:block!important}}</style>

      <!-- Products Grid -->
      <div style="flex:1;min-width:0">
        <div id="products-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px">
          ${productCards || `
          <div style="grid-column:1/-1;text-align:center;padding:80px 0;color:var(--text-muted)">
            <i class="fas fa-search" style="font-size:48px;margin-bottom:16px;display:block;opacity:0.2"></i>
            <h3 style="font-size:18px;font-weight:600;color:var(--text-secondary);margin-bottom:8px">No products found</h3>
            <p style="font-size:14px">Try adjusting your filters or <a href="/products" style="color:var(--neon-cyan)">view all products</a></p>
          </div>`}
        </div>
      </div>
    </div>
  </div>
</div>

<script>
function applyMaterialFilter(material) {
  const url = new URL(window.location.href);
  if (material) url.searchParams.set('material', material);
  else url.searchParams.delete('material');
  window.location.href = url.toString();
}

function applySorting(sort) {
  const grid = document.getElementById('products-grid');
  const cards = Array.from(grid.querySelectorAll('.glass-card'));
  cards.sort((a, b) => {
    if (sort === 'price-asc' || sort === 'price-desc') {
      const getP = el => parseFloat(el.querySelector('[style*="neon-cyan"]')?.textContent?.replace('$','') || '0');
      return sort === 'price-asc' ? getP(a) - getP(b) : getP(b) - getP(a);
    } else if (sort === 'name') {
      return (a.querySelector('h3')?.textContent || '').localeCompare(b.querySelector('h3')?.textContent || '');
    }
    return 0;
  });
  cards.forEach(card => grid.appendChild(card));
}
</script>
`
}
