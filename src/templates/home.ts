export function getHomePage(featuredProducts: any[], categories: any[], settings: Record<string, string>): string {
  const heroTitle = settings.hero_title || 'Custom 3D Printing Services'
  const heroSubtitle = settings.hero_subtitle || 'From concept to reality — precision, quality, and speed.'

  const categoryIcons: Record<string, string> = {
    'home': 'fa-home', 'wrench': 'fa-wrench', 'star': 'fa-star',
    'gem': 'fa-gem', 'magic': 'fa-magic', 'flask': 'fa-flask'
  }

  const productCards = featuredProducts.map(p => {
    const displayPrice = p.sale_price ? `
      <span class="text-gray-400 line-through text-sm">$${parseFloat(p.price).toFixed(2)}</span>
      <span class="text-blue-600 font-bold text-lg ml-1">$${parseFloat(p.sale_price).toFixed(2)}</span>
    ` : `<span class="text-blue-600 font-bold text-lg">$${parseFloat(p.price).toFixed(2)}</span>`

    return `
    <div class="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
      <a href="/products/${p.slug}" class="block">
        <div class="relative h-56 product-image-placeholder overflow-hidden">
          <img src="${p.primary_image || ''}" alt="${p.name}" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               onerror="this.style.display='none';this.parentNode.innerHTML+='<div class=\\'flex items-center justify-center h-full\\'><i class=\\"fas fa-cube text-blue-300 text-5xl\\"></i></div>'">
          ${p.is_customizable ? '<span class="absolute top-3 left-3 bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Customizable</span>' : ''}
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div class="p-5">
          <p class="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">${p.category_name || 'Product'}</p>
          <h3 class="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">${p.name}</h3>
          <p class="text-gray-500 text-sm line-clamp-2 leading-relaxed">${p.short_description || p.description?.substring(0, 100) || ''}</p>
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center space-x-1">
              <i class="fas fa-layer-group text-gray-400 text-xs mr-1"></i>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">${p.material}</span>
            </div>
            <div>${displayPrice}</div>
          </div>
        </div>
      </a>
      <div class="px-5 pb-5">
        <button 
          onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.sale_price || p.price}, '${p.primary_image || ''}'); event.stopPropagation()"
          class="btn-primary w-full text-white py-2.5 rounded-xl font-semibold text-sm">
          <i class="fas fa-cart-plus mr-2"></i>Add to Cart
        </button>
      </div>
    </div>`
  }).join('')

  const categoryCards = categories.map(cat => {
    const iconClass = categoryIcons[cat.icon] || 'fa-cube'
    return `
    <a href="/products?category=${cat.slug}" class="card-hover group bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:border-blue-200">
      <div class="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
        <i class="fas ${iconClass} text-blue-600 text-2xl"></i>
      </div>
      <h3 class="font-bold text-gray-900 mb-1">${cat.name}</h3>
      <p class="text-sm text-gray-500">${cat.product_count || 0} products</p>
    </a>`
  }).join('')

  return `
<!-- Hero Section -->
<section class="gradient-hero text-white relative overflow-hidden">
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
  </div>
  <div class="max-w-7xl mx-auto px-4 py-24 relative z-10">
    <div class="max-w-3xl">
      <div class="inline-flex items-center bg-blue-800 bg-opacity-60 border border-blue-500 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <i class="fas fa-map-marker-alt mr-2"></i>Puerto Rico's Premier 3D Printing Studio
      </div>
      <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-6">${heroTitle}</h1>
      <p class="text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl">${heroSubtitle}</p>
      <div class="flex flex-wrap gap-4">
        <a href="/products" class="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
          <i class="fas fa-th-large mr-2"></i>Browse Products
        </a>
        <a href="/preview" class="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold px-8 py-4 rounded-xl text-lg transition-all">
          <i class="fas fa-magic mr-2"></i>3D Preview Tool
        </a>
      </div>
      <div class="mt-10 flex flex-wrap gap-8 text-sm text-blue-200">
        <div class="flex items-center"><i class="fas fa-check-circle mr-2 text-green-400"></i>Fast Turnaround (2-5 days)</div>
        <div class="flex items-center"><i class="fas fa-check-circle mr-2 text-green-400"></i>Premium Materials</div>
        <div class="flex items-center"><i class="fas fa-check-circle mr-2 text-green-400"></i>100% Custom Designs</div>
        <div class="flex items-center"><i class="fas fa-check-circle mr-2 text-green-400"></i>Secure Payments</div>
      </div>
    </div>
  </div>
  <!-- Decorative 3D cubes -->
  <div class="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:grid grid-cols-2 gap-4 opacity-20">
    ${[...Array(6)].map((_, i) => `<div class="w-20 h-20 border-2 border-blue-300 rounded-xl flex items-center justify-center" style="animation: float ${2+i*0.3}s ease-in-out infinite alternate"><i class="fas fa-cube text-blue-300 text-3xl"></i></div>`).join('')}
  </div>
</section>

<style>
@keyframes float { from{transform:translateY(0)} to{transform:translateY(-10px)} }
.line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
</style>

<!-- Stats Bar -->
<section class="bg-white border-b">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div class="text-3xl font-extrabold text-blue-600">500+</div>
        <div class="text-sm text-gray-500 mt-1">Happy Customers</div>
      </div>
      <div>
        <div class="text-3xl font-extrabold text-blue-600">1000+</div>
        <div class="text-sm text-gray-500 mt-1">Items Printed</div>
      </div>
      <div>
        <div class="text-3xl font-extrabold text-blue-600">6</div>
        <div class="text-sm text-gray-500 mt-1">Material Types</div>
      </div>
      <div>
        <div class="text-3xl font-extrabold text-blue-600">3-5</div>
        <div class="text-sm text-gray-500 mt-1">Day Delivery</div>
      </div>
    </div>
  </div>
</section>

<!-- Categories -->
<section class="max-w-7xl mx-auto px-4 py-16">
  <div class="text-center mb-12">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-3">Shop by Category</h2>
    <p class="text-gray-500 text-lg max-w-xl mx-auto">From home décor to functional prototypes — find the perfect print for your needs</p>
  </div>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    ${categoryCards}
  </div>
</section>

<!-- Featured Products -->
<section class="bg-gray-50 py-16">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex items-center justify-between mb-12">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Featured Products</h2>
        <p class="text-gray-500">Our most popular custom 3D printed items</p>
      </div>
      <a href="/products" class="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-semibold">
        View All <i class="fas fa-arrow-right ml-2"></i>
      </a>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${productCards || '<p class="text-gray-500 col-span-4 text-center py-12">No featured products yet. <a href="/api/admin/init" class="text-blue-600 hover:underline">Initialize the database</a> to add sample products.</p>'}
    </div>
    <div class="text-center mt-8 md:hidden">
      <a href="/products" class="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
        View All Products <i class="fas fa-arrow-right ml-2"></i>
      </a>
    </div>
  </div>
</section>

<!-- How it Works -->
<section class="max-w-7xl mx-auto px-4 py-16">
  <div class="text-center mb-12">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-3">How It Works</h2>
    <p class="text-gray-500 text-lg">Getting your custom 3D print is simple and fast</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
    ${[
      { icon: 'fa-search', step: '01', title: 'Browse & Choose', desc: 'Explore our catalog or bring your own design idea' },
      { icon: 'fa-magic', step: '02', title: 'Customize & Preview', desc: 'Use our 3D preview tool to visualize your design' },
      { icon: 'fa-credit-card', step: '03', title: 'Order & Pay', desc: 'Securely checkout with PayPal or credit card' },
      { icon: 'fa-truck', step: '04', title: 'Print & Deliver', desc: 'We print with precision and ship to your door' }
    ].map(s => `
    <div class="text-center group">
      <div class="relative mb-6">
        <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
          <i class="fas ${s.icon} text-blue-600 text-2xl"></i>
        </div>
        <span class="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto">${s.step}</span>
      </div>
      <h3 class="font-bold text-gray-900 text-lg mb-2">${s.title}</h3>
      <p class="text-gray-500 text-sm leading-relaxed">${s.desc}</p>
    </div>`).join('')}
  </div>
</section>

<!-- Materials Section -->
<section class="bg-gradient-to-br from-blue-900 to-gray-900 text-white py-16">
  <div class="max-w-7xl mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-extrabold mb-3">Premium Materials</h2>
      <p class="text-blue-200 text-lg">We use only the highest quality filaments and resins</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      ${[
        { name: 'PLA', desc: 'Eco-friendly', icon: 'fa-leaf', color: 'from-green-500 to-green-700' },
        { name: 'ABS', desc: 'High-strength', icon: 'fa-shield-alt', color: 'from-red-500 to-red-700' },
        { name: 'PETG', desc: 'Food-safe', icon: 'fa-flask', color: 'from-blue-400 to-blue-600' },
        { name: 'TPU', desc: 'Flexible', icon: 'fa-expand-alt', color: 'from-purple-500 to-purple-700' },
        { name: 'Resin', desc: 'Ultra-detail', icon: 'fa-star', color: 'from-yellow-500 to-orange-600' },
        { name: 'Nylon', desc: 'Industrial', icon: 'fa-industry', color: 'from-gray-500 to-gray-700' }
      ].map(m => `
      <a href="/products?material=${m.name}" class="card-hover group text-center p-5 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-2xl border border-white border-opacity-10 transition-all">
        <div class="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-3">
          <i class="fas ${m.icon} text-white"></i>
        </div>
        <h4 class="font-bold text-white">${m.name}</h4>
        <p class="text-blue-300 text-xs mt-1">${m.desc}</p>
      </a>`).join('')}
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="max-w-7xl mx-auto px-4 py-16">
  <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-center text-white">
    <i class="fas fa-magic text-4xl mb-4 text-blue-200"></i>
    <h2 class="text-3xl font-extrabold mb-4">Have a Custom Idea?</h2>
    <p class="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Upload your image or describe your vision and we'll create a 3D preview concept. Custom prints made to your exact specifications.</p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="/preview" class="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg">
        <i class="fas fa-upload mr-2"></i>Try 3D Preview Tool
      </a>
      <a href="/contact" class="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold px-8 py-4 rounded-xl text-lg transition-all">
        <i class="fas fa-comments mr-2"></i>Talk to Us
      </a>
    </div>
  </div>
</section>
`
}
