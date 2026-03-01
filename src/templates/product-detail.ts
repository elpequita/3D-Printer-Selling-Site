export function getProductDetailPage(product: any, relatedProducts: any[], settings: Record<string, string>): string {
  const images = product.images || []
  const primaryImage = images.find((i: any) => i.is_primary) || images[0]
  const dims = product.dimensions_mm ? (() => { try { return JSON.parse(product.dimensions_mm) } catch { return null } })() : null
  const displayPrice = product.sale_price
    ? `<div><span class="text-gray-400 line-through text-xl">$${parseFloat(product.price).toFixed(2)}</span><span class="text-blue-600 font-extrabold text-3xl ml-2">$${parseFloat(product.sale_price).toFixed(2)}</span></div>`
    : `<span class="text-blue-600 font-extrabold text-3xl">$${parseFloat(product.price).toFixed(2)}</span>`

  const imageGallery = images.length > 0 ? images.map((img: any, idx: number) => `
    <button onclick="showImage('${img.url}', this)" class="gallery-thumb w-16 h-16 rounded-xl overflow-hidden border-2 ${idx === 0 ? 'border-blue-500' : 'border-gray-200'} hover:border-blue-400 transition-all flex-shrink-0">
      <img src="${img.url}" alt="${img.alt_text || product.name}" class="w-full h-full object-cover"
           onerror="this.parentNode.style.display='none'">
    </button>`).join('') : ''

  const relatedCards = relatedProducts.map(p => `
    <a href="/products/${p.slug}" class="card-hover bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
      <div class="h-36 product-image-placeholder overflow-hidden">
        <img src="${p.primary_image || ''}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             onerror="this.style.display='none';this.parentNode.innerHTML+='<div class=\\'flex items-center justify-center h-full\\'><i class=\\"fas fa-cube text-blue-300 text-3xl\\"></i></div>'">
      </div>
      <div class="p-3">
        <h4 class="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-blue-600">${p.name}</h4>
        <span class="text-blue-600 font-bold text-sm">$${parseFloat(p.price).toFixed(2)}</span>
      </div>
    </a>`).join('')

  return `
<div class="max-w-7xl mx-auto px-4 py-8">
  <!-- Breadcrumb -->
  <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-8">
    <a href="/" class="hover:text-blue-600 transition-colors">Home</a>
    <i class="fas fa-chevron-right text-xs"></i>
    <a href="/products" class="hover:text-blue-600 transition-colors">Products</a>
    ${product.category_name ? `<i class="fas fa-chevron-right text-xs"></i><a href="/products?category=${product.category_slug}" class="hover:text-blue-600">${product.category_name}</a>` : ''}
    <i class="fas fa-chevron-right text-xs"></i>
    <span class="text-gray-900 font-medium">${product.name}</span>
  </nav>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
    <!-- Image Section -->
    <div>
      <div id="main-image-container" class="relative aspect-square rounded-2xl overflow-hidden product-image-placeholder mb-4 shadow-lg">
        ${primaryImage ? `
        <img id="main-image" src="${primaryImage.url}" alt="${product.name}" 
             class="w-full h-full object-cover"
             onerror="this.style.display='none';document.getElementById('main-image-placeholder').style.display='flex'">
        <div id="main-image-placeholder" class="absolute inset-0 flex items-center justify-center" style="display:none">
          <i class="fas fa-cube text-blue-300 text-8xl opacity-50"></i>
        </div>` : `
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="fas fa-cube text-blue-300 text-8xl opacity-50"></i>
        </div>`}
        ${product.is_customizable ? `
        <div class="absolute top-4 left-4">
          <span class="bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-lg">
            <i class="fas fa-magic mr-1"></i>Customizable
          </span>
        </div>` : ''}
      </div>
      ${images.length > 1 ? `
      <div class="flex space-x-3 overflow-x-auto pb-2">
        ${imageGallery}
      </div>` : ''}
    </div>

    <!-- Product Info -->
    <div>
      <div class="flex items-start justify-between mb-2">
        <div>
          ${product.category_name ? `<span class="text-blue-500 font-semibold text-sm uppercase tracking-wide">${product.category_name}</span>` : ''}
          <h1 class="text-3xl font-extrabold text-gray-900 mt-1">${product.name}</h1>
        </div>
        <div class="flex items-center ml-4">
          ${product.is_available ? '<span class="flex items-center text-green-600 text-sm font-semibold"><span class="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>In Stock</span>' : '<span class="flex items-center text-red-500 text-sm font-semibold"><span class="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>Unavailable</span>'}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <div class="flex text-yellow-400 mr-2">
          <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
        </div>
        <span class="text-sm text-gray-500">(4.8 / 5 average)</span>
      </div>

      ${displayPrice}
      ${product.sale_price ? '<p class="text-sm text-green-600 font-medium mt-1"><i class="fas fa-tag mr-1"></i>Special pricing applied</p>' : ''}

      <p class="text-gray-600 leading-relaxed mt-5 mb-6">${product.short_description || ''}</p>

      <!-- Specs Grid -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="bg-gray-50 rounded-xl p-3">
          <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Material</div>
          <div class="font-semibold text-gray-900 flex items-center">
            <i class="fas fa-layer-group mr-2 text-blue-500 text-sm"></i>${product.material}
          </div>
        </div>
        <div class="bg-gray-50 rounded-xl p-3">
          <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Color</div>
          <div class="font-semibold text-gray-900 flex items-center">
            <span class="w-4 h-4 rounded-full border mr-2" style="background-color: ${product.color?.toLowerCase() || '#888'}"></span>${product.color}
          </div>
        </div>
        ${product.weight_grams ? `
        <div class="bg-gray-50 rounded-xl p-3">
          <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Weight</div>
          <div class="font-semibold text-gray-900"><i class="fas fa-weight mr-2 text-blue-500 text-sm"></i>${product.weight_grams}g</div>
        </div>` : ''}
        ${dims ? `
        <div class="bg-gray-50 rounded-xl p-3">
          <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Dimensions</div>
          <div class="font-semibold text-gray-900 text-sm"><i class="fas fa-ruler-combined mr-2 text-blue-500"></i>${dims.x}×${dims.y}×${dims.z}mm</div>
        </div>` : ''}
        ${product.print_time_hours ? `
        <div class="bg-gray-50 rounded-xl p-3">
          <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Print Time</div>
          <div class="font-semibold text-gray-900"><i class="fas fa-hourglass-half mr-2 text-blue-500 text-sm"></i>${product.print_time_hours}h</div>
        </div>` : ''}
        <div class="bg-gray-50 rounded-xl p-3">
          <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Lead Time</div>
          <div class="font-semibold text-gray-900"><i class="fas fa-truck mr-2 text-blue-500 text-sm"></i>${product.lead_time_days || 3} days</div>
        </div>
      </div>

      <!-- Quantity -->
      <div class="flex items-center space-x-4 mb-6">
        <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button onclick="changeQty(-1)" class="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors font-bold">−</button>
          <span id="qty-display" class="px-4 py-3 text-gray-900 font-semibold min-w-[48px] text-center">1</span>
          <button onclick="changeQty(1)" class="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors font-bold">+</button>
        </div>
        <div class="text-sm text-gray-500">
          ${product.stock_quantity === -1 ? '<i class="fas fa-infinity mr-1 text-green-500"></i>Made to order' : `${product.stock_quantity} available`}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mb-6">
        <button 
          onclick="addProductToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.sale_price || product.price}, '${primaryImage?.url || ''}')"
          class="btn-primary flex-1 text-white py-4 rounded-xl font-bold text-lg shadow-lg">
          <i class="fas fa-cart-plus mr-2"></i>Add to Cart
        </button>
        <button 
          onclick="buyNow(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.sale_price || product.price}, '${primaryImage?.url || ''}')"
          class="btn-accent flex-1 text-white py-4 rounded-xl font-bold text-lg shadow-lg">
          <i class="fas fa-bolt mr-2"></i>Buy Now
        </button>
      </div>

      ${product.is_customizable ? `
      <div class="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
        <h4 class="font-semibold text-orange-800 mb-2"><i class="fas fa-magic mr-2"></i>This product is customizable!</h4>
        <p class="text-sm text-orange-700">Add to cart and include your customization notes at checkout, or <a href="/preview" class="underline hover:text-orange-900">use our 3D Preview Tool</a> to visualize your design first.</p>
      </div>` : ''}

      <!-- Trust Badges -->
      <div class="grid grid-cols-3 gap-3 text-center text-xs text-gray-500 pt-4 border-t">
        <div class="flex flex-col items-center space-y-1">
          <i class="fas fa-lock text-green-500 text-lg"></i>
          <span>Secure Payment</span>
        </div>
        <div class="flex flex-col items-center space-y-1">
          <i class="fas fa-medal text-blue-500 text-lg"></i>
          <span>Quality Guarantee</span>
        </div>
        <div class="flex flex-col items-center space-y-1">
          <i class="fas fa-undo text-purple-500 text-lg"></i>
          <span>Easy Returns</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Full Description Tab -->
  <div class="bg-white rounded-2xl border border-gray-100 p-8 mb-12">
    <div class="flex space-x-6 border-b mb-6">
      <button onclick="showTab('description')" id="tab-description" class="tab-btn pb-3 border-b-2 border-blue-600 text-blue-600 font-semibold text-sm">Description</button>
      <button onclick="showTab('specs')" id="tab-specs" class="tab-btn pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-semibold text-sm">Specifications</button>
      <button onclick="showTab('shipping')" id="tab-shipping" class="tab-btn pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-semibold text-sm">Shipping & Info</button>
    </div>
    <div id="tab-content-description" class="tab-content">
      <div class="prose max-w-none text-gray-600 leading-relaxed">
        ${product.description || 'No description available.'}
      </div>
      ${product.tags ? `<div class="mt-6 flex flex-wrap gap-2">${product.tags.split(',').map((tag: string) => `<span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">#${tag.trim()}</span>`).join('')}</div>` : ''}
    </div>
    <div id="tab-content-specs" class="tab-content hidden">
      <table class="w-full text-sm">
        <tbody class="divide-y divide-gray-100">
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
          <tr>
            <td class="py-3 pr-4 font-semibold text-gray-700 w-40">${label}</td>
            <td class="py-3 text-gray-600">${val}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div id="tab-content-shipping" class="tab-content hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
        <div class="space-y-3">
          <h4 class="font-bold text-gray-900 mb-3">Shipping Information</h4>
          <div class="flex items-start space-x-3"><i class="fas fa-clock text-blue-500 mt-0.5"></i><div><strong>Processing:</strong> ${product.lead_time_days || 3} business days to print</div></div>
          <div class="flex items-start space-x-3"><i class="fas fa-shipping-fast text-blue-500 mt-0.5"></i><div><strong>Standard Shipping:</strong> $8.99 (Free over $100)</div></div>
          <div class="flex items-start space-x-3"><i class="fas fa-map-marker-alt text-blue-500 mt-0.5"></i><div><strong>From:</strong> Puerto Rico, USA</div></div>
        </div>
        <div class="space-y-3">
          <h4 class="font-bold text-gray-900 mb-3">Returns & Quality</h4>
          <div class="flex items-start space-x-3"><i class="fas fa-check-circle text-green-500 mt-0.5"></i><div>Quality inspected before shipping</div></div>
          <div class="flex items-start space-x-3"><i class="fas fa-undo text-blue-500 mt-0.5"></i><div>30-day return policy for defects</div></div>
          <div class="flex items-start space-x-3"><i class="fas fa-phone-alt text-blue-500 mt-0.5"></i><div>Questions? Call <a href="tel:787-403-1552" class="text-blue-600 hover:underline">787-403-1552</a></div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Related Products -->
  ${relatedProducts.length > 0 ? `
  <div>
    <h2 class="text-2xl font-extrabold text-gray-900 mb-6">You Might Also Like</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
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
  const mainImg = document.getElementById('main-image');
  if (mainImg) mainImg.src = url;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('border-blue-500'));
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.add('border-gray-200'));
  btn.classList.add('border-blue-500');
  btn.classList.remove('border-gray-200');
}

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('border-blue-600', 'text-blue-600');
    b.classList.add('border-transparent', 'text-gray-500');
  });
  document.getElementById('tab-content-' + tab)?.classList.remove('hidden');
  const activeBtn = document.getElementById('tab-' + tab);
  activeBtn?.classList.add('border-blue-600', 'text-blue-600');
  activeBtn?.classList.remove('border-transparent', 'text-gray-500');
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
