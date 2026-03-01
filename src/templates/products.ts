export function getProductsPage(products: any[], categories: any[], materials: any[], filters: { category: string, search: string, material: string }): string {
  const productCards = products.map(p => {
    const displayPrice = p.sale_price
      ? `<span class="text-gray-400 line-through text-sm">$${parseFloat(p.price).toFixed(2)}</span><span class="text-blue-600 font-bold ml-2">$${parseFloat(p.sale_price).toFixed(2)}</span>`
      : `<span class="text-blue-600 font-bold text-lg">$${parseFloat(p.price).toFixed(2)}</span>`

    return `
    <div class="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col">
      <a href="/products/${p.slug}" class="block">
        <div class="relative h-48 product-image-placeholder overflow-hidden">
          <img src="${p.primary_image || ''}" alt="${p.name}"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               onerror="this.style.display='none';this.parentNode.innerHTML+='<div class=\\'flex items-center justify-center h-full\\'><i class=\\"fas fa-cube text-blue-300 text-4xl\\"></i></div>'">
          <div class="absolute top-3 left-3 flex gap-2 flex-wrap">
            ${p.is_featured ? '<span class="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">Featured</span>' : ''}
            ${p.is_customizable ? '<span class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Custom</span>' : ''}
            ${p.sale_price ? '<span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Sale</span>' : ''}
          </div>
        </div>
        <div class="p-4 flex-1">
          <p class="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">${p.category_name || 'Uncategorized'}</p>
          <h3 class="font-bold text-gray-900 text-base leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">${p.name}</h3>
          <p class="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">${p.short_description || ''}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              <i class="fas fa-layer-group mr-1"></i>${p.material}
            </span>
            <div>${displayPrice}</div>
          </div>
          <div class="flex items-center text-xs text-gray-400 mt-2">
            <i class="fas fa-clock mr-1"></i>${p.lead_time_days || 3} day lead time
          </div>
        </div>
      </a>
      <div class="px-4 pb-4">
        <button 
          onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.sale_price || p.price}, '${p.primary_image || ''}'); event.stopPropagation()"
          class="btn-primary w-full text-white py-2.5 rounded-xl font-semibold text-sm">
          <i class="fas fa-cart-plus mr-2"></i>Add to Cart
        </button>
      </div>
    </div>`
  }).join('')

  const categoryFilters = `
    <a href="/products" class="filter-chip ${!filters.category ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'} px-4 py-2 rounded-full text-sm font-medium transition-all">
      All
    </a>
    ${categories.map(cat => `
    <a href="/products?category=${cat.slug}${filters.material ? '&material='+filters.material : ''}" 
       class="filter-chip ${filters.category === cat.slug ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'} px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap">
      ${cat.name} <span class="ml-1 text-xs opacity-70">(${cat.product_count || 0})</span>
    </a>`).join('')}`

  const materialFilters = materials.map(m => `
    <label class="flex items-center space-x-2 cursor-pointer group">
      <input type="radio" name="material" value="${m.name}" ${filters.material === m.name ? 'checked' : ''} 
             onchange="applyMaterialFilter(this.value)"
             class="text-blue-600 focus:ring-blue-500">
      <span class="text-sm text-gray-700 group-hover:text-blue-600">${m.name}</span>
    </label>`).join('')

  return `
<div class="min-h-screen bg-gray-50">
  <!-- Page Header -->
  <div class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">
            ${filters.search ? `Search: "${filters.search}"` : filters.category ? `${categories.find(c => c.slug === filters.category)?.name || 'Products'}` : 'All Products'}
          </h1>
          <p class="text-gray-500 mt-1">${products.length} product${products.length !== 1 ? 's' : ''} found</p>
        </div>
        <form action="/products" method="GET" class="flex gap-2">
          <input type="hidden" name="category" value="${filters.category}">
          <input type="hidden" name="material" value="${filters.material}">
          <div class="relative">
            <input type="text" name="search" value="${filters.search}"
                   placeholder="Search products..." 
                   class="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64">
            <i class="fas fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
          </div>
          <button type="submit" class="btn-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Search</button>
          ${filters.search || filters.category || filters.material ? '<a href="/products" class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 flex items-center">Clear</a>' : ''}
        </form>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Category Filters -->
    <div class="mb-6 overflow-x-auto pb-2">
      <div class="flex gap-2 min-w-max">
        ${categoryFilters}
      </div>
    </div>

    <div class="flex gap-8">
      <!-- Sidebar Filters -->
      <aside class="hidden lg:block w-56 flex-shrink-0">
        <div class="bg-white rounded-2xl p-5 border border-gray-100 sticky top-24">
          <h3 class="font-bold text-gray-900 mb-4 flex items-center">
            <i class="fas fa-filter mr-2 text-blue-500"></i>Filter by Material
          </h3>
          <div class="space-y-3">
            <label class="flex items-center space-x-2 cursor-pointer group">
              <input type="radio" name="material" value="" ${!filters.material ? 'checked' : ''} 
                     onchange="applyMaterialFilter('')" class="text-blue-600">
              <span class="text-sm text-gray-700 group-hover:text-blue-600">All Materials</span>
            </label>
            ${materialFilters}
          </div>

          <hr class="my-5 border-gray-100">

          <h3 class="font-bold text-gray-900 mb-4 flex items-center">
            <i class="fas fa-sort mr-2 text-blue-500"></i>Sort By
          </h3>
          <select onchange="applySorting(this.value)" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </aside>

      <!-- Products Grid -->
      <div class="flex-1">
        <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          ${productCards || `
          <div class="col-span-3 text-center py-20 text-gray-400">
            <i class="fas fa-search text-5xl mb-4 opacity-30"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p class="text-sm">Try adjusting your filters or <a href="/products" class="text-blue-600 hover:underline">view all products</a></p>
          </div>`}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
</style>

<script>
function applyMaterialFilter(material) {
  const url = new URL(window.location.href);
  if (material) url.searchParams.set('material', material);
  else url.searchParams.delete('material');
  window.location.href = url.toString();
}

function applySorting(sort) {
  const grid = document.getElementById('products-grid');
  const cards = Array.from(grid.querySelectorAll('.card-hover'));
  
  cards.sort((a, b) => {
    if (sort === 'price-asc') {
      const priceA = parseFloat(a.querySelector('.text-blue-600.font-bold')?.textContent?.replace('$','') || '0');
      const priceB = parseFloat(b.querySelector('.text-blue-600.font-bold')?.textContent?.replace('$','') || '0');
      return priceA - priceB;
    } else if (sort === 'price-desc') {
      const priceA = parseFloat(a.querySelector('.text-blue-600.font-bold')?.textContent?.replace('$','') || '0');
      const priceB = parseFloat(b.querySelector('.text-blue-600.font-bold')?.textContent?.replace('$','') || '0');
      return priceB - priceA;
    } else if (sort === 'name') {
      const nameA = a.querySelector('h3')?.textContent || '';
      const nameB = b.querySelector('h3')?.textContent || '';
      return nameA.localeCompare(nameB);
    }
    return 0;
  });
  
  cards.forEach(card => grid.appendChild(card));
}
</script>
`
}
