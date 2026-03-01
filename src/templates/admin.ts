export function getAdminPage(): string {
  return `
<div id="admin-app" class="min-h-screen bg-gray-100">
  <!-- Admin Login Screen -->
  <div id="admin-login" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900 px-4">
    <div class="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-shield-alt text-white text-2xl"></i>
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900">Admin Panel</h1>
        <p class="text-gray-500 mt-1">Enter your PIN to access the admin dashboard</p>
      </div>
      <div id="login-error" class="hidden bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm text-center"></div>
      <div class="space-y-4">
        <input type="password" id="admin-pin-input" placeholder="Enter Admin PIN" maxlength="10"
               class="w-full border border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
               onkeypress="if(event.key==='Enter') adminLogin()">
        <button onclick="adminLogin()" class="btn-primary w-full text-white py-4 rounded-xl font-bold text-lg">
          <i class="fas fa-lock-open mr-2"></i>Access Admin Panel
        </button>
        <p class="text-center text-xs text-gray-400">Default PIN: 1234 (change in Settings)</p>
      </div>
    </div>
  </div>

  <!-- Admin Dashboard (hidden until login) -->
  <div id="admin-dashboard" class="hidden">
    <!-- Top Nav -->
    <div class="bg-white shadow-sm border-b sticky top-0 z-40">
      <div class="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-16">
        <div class="flex items-center space-x-4">
          <button onclick="toggleSidebar()" class="text-gray-500 hover:text-gray-700 lg:hidden">
            <i class="fas fa-bars text-xl"></i>
          </button>
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <i class="fas fa-cube text-white text-sm"></i>
            </div>
            <span class="font-bold text-gray-900">Admin Panel</span>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <a href="/" target="_blank" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <i class="fas fa-external-link-alt mr-1"></i>View Site
          </a>
          <button onclick="adminLogout()" class="text-sm text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 border border-red-200 rounded-lg">
            <i class="fas fa-sign-out-alt mr-1"></i>Logout
          </button>
        </div>
      </div>
    </div>

    <div class="flex max-w-screen-xl mx-auto">
      <!-- Sidebar -->
      <aside id="admin-sidebar" class="w-64 min-h-screen bg-white border-r hidden lg:block flex-shrink-0">
        <nav class="p-4 space-y-1 sticky top-16">
          ${[
            { id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
            { id: 'products', icon: 'fa-cube', label: 'Products' },
            { id: 'orders', icon: 'fa-shopping-bag', label: 'Orders' },
            { id: 'categories', icon: 'fa-th-large', label: 'Categories' },
            { id: 'customers', icon: 'fa-users', label: 'Customers' },
            { id: 'messages', icon: 'fa-envelope', label: 'Messages' },
            { id: 'settings', icon: 'fa-cog', label: 'Settings' },
          ].map(item => `
          <button onclick="showSection('${item.id}')" id="nav-${item.id}"
                  class="admin-nav-btn w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-sm font-medium">
            <i class="fas ${item.icon} w-4"></i>
            <span>${item.label}</span>
          </button>`).join('')}
          <hr class="my-2">
          <button onclick="initDatabase()" class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-green-600 hover:bg-green-50 transition-all text-sm font-medium">
            <i class="fas fa-database w-4"></i>
            <span>Init / Seed DB</span>
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-auto">
        <!-- DASHBOARD SECTION -->
        <div id="section-dashboard" class="admin-section">
          <h2 class="text-2xl font-extrabold text-gray-900 mb-6">Dashboard Overview</h2>
          <div id="stats-grid" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="shimmer rounded-2xl h-28"></div>
            <div class="shimmer rounded-2xl h-28"></div>
            <div class="shimmer rounded-2xl h-28"></div>
            <div class="shimmer rounded-2xl h-28"></div>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 class="font-bold text-gray-900 mb-4">Recent Orders</h3>
            <div id="recent-orders-table"></div>
          </div>
        </div>

        <!-- PRODUCTS SECTION -->
        <div id="section-products" class="admin-section hidden">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-extrabold text-gray-900">Products</h2>
            <button onclick="showProductForm()" class="btn-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md">
              <i class="fas fa-plus mr-2"></i>Add Product
            </button>
          </div>
          <div id="products-list" class="space-y-3"></div>
        </div>

        <!-- ORDERS SECTION -->
        <div id="section-orders" class="admin-section hidden">
          <h2 class="text-2xl font-extrabold text-gray-900 mb-6">Orders</h2>
          <div class="flex gap-2 mb-5 overflow-x-auto">
            ${['all','pending','confirmed','printing','quality_check','shipped','delivered','cancelled'].map(s => `
            <button onclick="filterOrders('${s}')" class="order-filter-btn ${s === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'} px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">${s.replace('_',' ').replace(/\b\w/g, l => l.toUpperCase())}</button>`).join('')}
          </div>
          <div id="orders-list" class="space-y-3"></div>
        </div>

        <!-- CATEGORIES SECTION -->
        <div id="section-categories" class="admin-section hidden">
          <h2 class="text-2xl font-extrabold text-gray-900 mb-6">Categories</h2>
          <div id="categories-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
        </div>

        <!-- CUSTOMERS SECTION -->
        <div id="section-customers" class="admin-section hidden">
          <h2 class="text-2xl font-extrabold text-gray-900 mb-6">Customers</h2>
          <div id="customers-list"></div>
        </div>

        <!-- MESSAGES SECTION -->
        <div id="section-messages" class="admin-section hidden">
          <h2 class="text-2xl font-extrabold text-gray-900 mb-6">Contact Messages</h2>
          <div id="messages-list" class="space-y-3"></div>
        </div>

        <!-- SETTINGS SECTION -->
        <div id="section-settings" class="admin-section hidden">
          <h2 class="text-2xl font-extrabold text-gray-900 mb-6">Site Settings</h2>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div id="settings-form" class="space-y-5 max-w-2xl">
              <div class="shimmer h-14 rounded-xl"></div>
              <div class="shimmer h-14 rounded-xl"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Product Form Modal -->
  <div id="product-modal" class="hidden fixed inset-0 z-50 overflow-y-auto">
    <div class="min-h-screen px-4 text-center flex items-start justify-center pt-10 pb-10">
      <div class="fixed inset-0 bg-black bg-opacity-60" onclick="closeProductForm()"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl text-left my-auto">
        <div class="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-2xl">
          <h3 id="product-form-title" class="text-xl font-bold text-gray-900">Add New Product</h3>
          <button onclick="closeProductForm()" class="text-gray-400 hover:text-gray-600 text-xl">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 max-h-screen overflow-y-auto" style="max-height: 70vh;">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
              <input type="text" id="pf-name" placeholder="e.g. Custom Name Plate" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Price ($) *</label>
              <input type="number" id="pf-price" placeholder="24.99" step="0.01" min="0" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Sale Price ($)</label>
              <input type="number" id="pf-sale" placeholder="Optional" step="0.01" min="0" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Material *</label>
              <select id="pf-material" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>PLA</option><option>ABS</option><option>PETG</option>
                <option>TPU</option><option>Resin</option><option>Nylon</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Color</label>
              <input type="text" id="pf-color" placeholder="White" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select id="pf-category" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select category...</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Lead Time (days)</label>
              <input type="number" id="pf-leadtime" placeholder="3" min="1" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
              <input type="text" id="pf-shortdesc" placeholder="Brief 1-line description" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Full Description</label>
              <textarea id="pf-desc" rows="4" placeholder="Detailed product description..." class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
              <input type="text" id="pf-image" placeholder="https://... or /static/images/..." class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tags (comma-separated)</label>
              <input type="text" id="pf-tags" placeholder="home,decor,custom,3d print" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="grid grid-cols-3 gap-4 md:col-span-2">
              <label class="flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                <input type="checkbox" id="pf-available" checked class="text-blue-600 focus:ring-blue-500 w-4 h-4">
                <span class="text-sm font-medium text-gray-700">Available</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                <input type="checkbox" id="pf-featured" class="text-blue-600 focus:ring-blue-500 w-4 h-4">
                <span class="text-sm font-medium text-gray-700">Featured</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                <input type="checkbox" id="pf-customizable" class="text-blue-600 focus:ring-blue-500 w-4 h-4">
                <span class="text-sm font-medium text-gray-700">Customizable</span>
              </label>
            </div>
          </div>
        </div>
        <div class="p-6 border-t bg-gray-50 rounded-b-2xl flex gap-3 justify-end">
          <button onclick="closeProductForm()" class="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onclick="saveProduct()" class="btn-primary text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow-md">
            <i class="fas fa-save mr-2"></i>Save Product
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let adminPin = localStorage.getItem('admin_pin') || '';
let editingProductId = null;
let adminData = {};

// ============================================================
// Authentication
// ============================================================
async function adminLogin() {
  const pin = document.getElementById('admin-pin-input').value;
  try {
    const res = await axios.post('/api/admin/login', { pin });
    if (res.data.success) {
      adminPin = pin;
      localStorage.setItem('admin_pin', pin);
      document.getElementById('admin-login').classList.add('hidden');
      document.getElementById('admin-dashboard').classList.remove('hidden');
      showSection('dashboard');
    }
  } catch(err) {
    const loginErr = document.getElementById('login-error');
    loginErr.textContent = 'Invalid PIN. Please try again.';
    loginErr.classList.remove('hidden');
    document.getElementById('admin-pin-input').value = '';
  }
}

function adminLogout() {
  adminPin = '';
  localStorage.removeItem('admin_pin');
  document.getElementById('admin-dashboard').classList.add('hidden');
  document.getElementById('admin-login').classList.remove('hidden');
  document.getElementById('admin-pin-input').value = '';
}

function getHeaders() { return { 'X-Admin-Pin': adminPin }; }

// Auto-login if PIN saved
window.addEventListener('DOMContentLoaded', () => {
  if (adminPin) {
    axios.get('/api/admin/dashboard', { headers: getHeaders() }).then(res => {
      if (res.data.success) {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        showSection('dashboard');
      } else { adminPin = ''; localStorage.removeItem('admin_pin'); }
    }).catch(() => { adminPin = ''; localStorage.removeItem('admin_pin'); });
  }
});

// ============================================================
// Navigation
// ============================================================
function showSection(id) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.admin-nav-btn').forEach(b => {
    b.classList.remove('bg-blue-50', 'text-blue-700', 'font-semibold');
  });
  document.getElementById('section-' + id)?.classList.remove('hidden');
  const navBtn = document.getElementById('nav-' + id);
  navBtn?.classList.add('bg-blue-50', 'text-blue-700', 'font-semibold');

  // Load data for section
  if (id === 'dashboard') loadDashboard();
  else if (id === 'products') loadProducts();
  else if (id === 'orders') loadOrders('all');
  else if (id === 'categories') loadCategories();
  else if (id === 'customers') loadCustomers();
  else if (id === 'messages') loadMessages();
  else if (id === 'settings') loadSettings();
}

function toggleSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  sidebar.classList.toggle('hidden');
}

// ============================================================
// Dashboard
// ============================================================
async function loadDashboard() {
  try {
    const res = await axios.get('/api/admin/dashboard', { headers: getHeaders() });
    const { stats, recent_orders } = res.data.data;
    
    const statCards = [
      { label: 'Total Products', value: stats.total_products, icon: 'fa-cube', color: 'from-blue-500 to-blue-600' },
      { label: 'Total Orders', value: stats.total_orders, icon: 'fa-shopping-bag', color: 'from-purple-500 to-purple-600' },
      { label: 'Pending Orders', value: stats.pending_orders, icon: 'fa-clock', color: 'from-orange-500 to-orange-600' },
      { label: 'Revenue', value: '$' + (stats.total_revenue || 0).toFixed(2), icon: 'fa-dollar-sign', color: 'from-green-500 to-green-600' },
    ];
    
    document.getElementById('stats-grid').innerHTML = statCards.map(s => \`
      <div class="bg-gradient-to-br \${s.color} rounded-2xl p-5 text-white shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <i class="fas \${s.icon} text-white opacity-80 text-xl"></i>
          <span class="text-white text-opacity-70 text-xs font-medium">\${s.label}</span>
        </div>
        <div class="text-3xl font-extrabold">\${s.value}</div>
      </div>
    \`).join('');
    
    const ordersHtml = recent_orders.length === 0 ? '<p class="text-gray-400 text-sm py-4 text-center">No orders yet.</p>' :
      '<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="text-left text-gray-500 border-b"><th class="pb-3 pr-4">Order #</th><th class="pb-3 pr-4">Customer</th><th class="pb-3 pr-4">Total</th><th class="pb-3">Status</th></tr></thead><tbody>' +
      recent_orders.map(o => \`
        <tr class="border-b hover:bg-gray-50">
          <td class="py-3 pr-4 font-mono text-xs font-semibold text-blue-600">\${o.order_number}</td>
          <td class="py-3 pr-4 text-gray-700">\${o.customer_name || o.customer_email || '-'}</td>
          <td class="py-3 pr-4 font-semibold">$\${parseFloat(o.total_amount).toFixed(2)}</td>
          <td class="py-3"><span class="px-2 py-1 rounded-full text-xs font-semibold \${getStatusColor(o.status)}">\${o.status}</span></td>
        </tr>
      \`).join('') +
      '</tbody></table></div>';
    
    document.getElementById('recent-orders-table').innerHTML = ordersHtml;
  } catch(err) { console.error(err); }
}

// ============================================================
// Products
// ============================================================
async function loadProducts() {
  try {
    const res = await axios.get('/api/products?available=all', { headers: getHeaders() });
    const products = res.data.data;
    
    document.getElementById('products-list').innerHTML = products.length === 0 
      ? '<div class="text-center py-12 text-gray-400"><i class="fas fa-cube text-4xl mb-3 opacity-30"></i><p>No products found. Click "Add Product" to get started or <button onclick="initDatabase()" class="text-blue-600 hover:underline">initialize the database</button>.</p></div>'
      : products.map(p => \`
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
          \${p.primary_image ? \`<img src="\${p.primary_image}" alt="\${p.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">\` : '<i class="fas fa-cube text-white text-xl"></i>'}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="font-bold text-gray-900">\${p.name}</h3>
              <p class="text-xs text-gray-500">\${p.category_name || 'No category'} · \${p.material} · \${p.color}</p>
            </div>
            <div class="text-right flex-shrink-0">
              \${p.sale_price ? \`<p class="text-gray-400 line-through text-sm">$\${parseFloat(p.price).toFixed(2)}</p><p class="text-blue-600 font-bold">$\${parseFloat(p.sale_price).toFixed(2)}</p>\` : \`<p class="text-blue-600 font-bold">$\${parseFloat(p.price).toFixed(2)}</p>\`}
            </div>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-xs px-2 py-0.5 rounded-full \${p.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">\${p.is_available ? 'Available' : 'Unavailable'}</span>
            \${p.is_featured ? '<span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Featured</span>' : ''}
            \${p.is_customizable ? '<span class="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Customizable</span>' : ''}
          </div>
        </div>
        <div class="flex gap-2 flex-shrink-0">
          <a href="/products/\${p.slug}" target="_blank" class="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View">
            <i class="fas fa-eye"></i>
          </a>
          <button onclick="editProduct(\${p.id})" class="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteProduct(\${p.id}, '\${p.name.replace(/'/g,"\\\\'")}')" class="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    \`).join('');
  } catch(err) { console.error(err); }
}

async function showProductForm(productData = null) {
  editingProductId = productData ? productData.id : null;
  document.getElementById('product-form-title').textContent = productData ? 'Edit Product' : 'Add New Product';
  
  // Load categories
  const catRes = await axios.get('/api/products/categories');
  const cats = catRes.data.data;
  const catSelect = document.getElementById('pf-category');
  catSelect.innerHTML = '<option value="">Select category...</option>' + cats.map(c => \`<option value="\${c.id}" \${productData?.category_id == c.id ? 'selected' : ''}>\${c.name}</option>\`).join('');
  
  // Fill form
  document.getElementById('pf-name').value = productData?.name || '';
  document.getElementById('pf-price').value = productData?.price || '';
  document.getElementById('pf-sale').value = productData?.sale_price || '';
  document.getElementById('pf-material').value = productData?.material || 'PLA';
  document.getElementById('pf-color').value = productData?.color || 'White';
  document.getElementById('pf-shortdesc').value = productData?.short_description || '';
  document.getElementById('pf-desc').value = productData?.description || '';
  document.getElementById('pf-tags').value = productData?.tags || '';
  document.getElementById('pf-leadtime').value = productData?.lead_time_days || 3;
  document.getElementById('pf-available').checked = productData ? !!productData.is_available : true;
  document.getElementById('pf-featured').checked = productData ? !!productData.is_featured : false;
  document.getElementById('pf-customizable').checked = productData ? !!productData.is_customizable : false;
  document.getElementById('pf-image').value = productData?.images?.[0]?.url || '';
  
  document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductForm() {
  document.getElementById('product-modal').classList.add('hidden');
  editingProductId = null;
}

async function editProduct(id) {
  try {
    const res = await axios.get('/api/products/' + id);
    await showProductForm(res.data.data);
  } catch(err) { alert('Error loading product'); }
}

async function saveProduct() {
  const name = document.getElementById('pf-name').value.trim();
  const price = document.getElementById('pf-price').value;
  if (!name || !price) { alert('Name and price are required'); return; }
  
  const data = {
    name, price: parseFloat(price),
    sale_price: document.getElementById('pf-sale').value ? parseFloat(document.getElementById('pf-sale').value) : null,
    material: document.getElementById('pf-material').value,
    color: document.getElementById('pf-color').value || 'White',
    category_id: document.getElementById('pf-category').value || null,
    short_description: document.getElementById('pf-shortdesc').value,
    description: document.getElementById('pf-desc').value,
    tags: document.getElementById('pf-tags').value,
    lead_time_days: parseInt(document.getElementById('pf-leadtime').value) || 3,
    is_available: document.getElementById('pf-available').checked ? 1 : 0,
    is_featured: document.getElementById('pf-featured').checked ? 1 : 0,
    is_customizable: document.getElementById('pf-customizable').checked ? 1 : 0,
    images: document.getElementById('pf-image').value ? [{ url: document.getElementById('pf-image').value, alt_text: name }] : []
  };
  
  try {
    if (editingProductId) {
      await axios.put('/api/products/' + editingProductId, data, { headers: getHeaders() });
      showToast('Product updated!', 'check-circle', 'text-green-400');
    } else {
      await axios.post('/api/products', data, { headers: getHeaders() });
      showToast('Product created!', 'check-circle', 'text-green-400');
    }
    closeProductForm();
    loadProducts();
  } catch(err) {
    alert('Error saving product: ' + (err.response?.data?.error || err.message));
  }
}

async function deleteProduct(id, name) {
  if (!confirm(\`Delete "\${name}"? This cannot be undone.\`)) return;
  try {
    await axios.delete('/api/products/' + id, { headers: getHeaders() });
    showToast('Product deleted', 'check-circle', 'text-green-400');
    loadProducts();
  } catch(err) { alert('Error deleting product'); }
}

// ============================================================
// Orders
// ============================================================
async function loadOrders(filter = 'all') {
  document.querySelectorAll('.order-filter-btn').forEach(b => {
    b.classList.remove('bg-blue-600', 'text-white');
    b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200');
  });
  event.target.classList.add('bg-blue-600', 'text-white');
  event.target.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200');
  
  try {
    const params = filter !== 'all' ? '?status=' + filter : '';
    const res = await axios.get('/api/orders' + params, { headers: getHeaders() });
    const orders = res.data.data;
    
    document.getElementById('orders-list').innerHTML = orders.length === 0 
      ? '<div class="text-center py-12 text-gray-400"><i class="fas fa-shopping-bag text-4xl mb-3 opacity-30"></i><p>No orders found.</p></div>'
      : orders.map(o => \`
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <span class="font-mono text-sm font-bold text-blue-600">\${o.order_number}</span>
            <p class="font-semibold text-gray-900 mt-1">\${o.customer_name || o.customer_email}</p>
            <p class="text-xs text-gray-500">\${new Date(o.created_at).toLocaleDateString()}</p>
          </div>
          <div class="text-right">
            <p class="text-xl font-bold text-gray-900">$\${parseFloat(o.total_amount).toFixed(2)}</p>
            <span class="text-xs px-2 py-1 rounded-full \${getStatusColor(o.status)}">\${o.status}</span>
            <span class="text-xs px-2 py-1 rounded-full ml-1 \${o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">\${o.payment_status}</span>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <select onchange="updateOrderStatus('\${o.id}', this.value)" class="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
            \${['pending','confirmed','printing','quality_check','shipped','delivered','cancelled'].map(s => \`<option value="\${s}" \${o.status === s ? 'selected' : ''}>\${s.replace('_',' ')}\</option>\`).join('')}
          </select>
        </div>
      </div>
    \`).join('');
  } catch(err) { console.error(err); }
}

function filterOrders(filter) { loadOrders(filter); }

async function updateOrderStatus(orderId, status) {
  try {
    await axios.put('/api/orders/' + orderId + '/status', { status }, { headers: getHeaders() });
    showToast('Order status updated', 'check-circle', 'text-green-400');
  } catch(err) { alert('Error updating status'); }
}

// ============================================================
// Categories
// ============================================================
async function loadCategories() {
  try {
    const res = await axios.get('/api/products/categories');
    const cats = res.data.data;
    document.getElementById('categories-list').innerHTML = cats.map(c => \`
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center space-x-4">
        <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <i class="fas fa-\${c.icon || 'cube'} text-blue-600"></i>
        </div>
        <div class="flex-1">
          <h3 class="font-bold text-gray-900">\${c.name}</h3>
          <p class="text-xs text-gray-500">\${c.product_count || 0} products · /products?category=\${c.slug}</p>
        </div>
      </div>
    \`).join('');
  } catch(err) { console.error(err); }
}

// ============================================================
// Customers
// ============================================================
async function loadCustomers() {
  try {
    const res = await axios.get('/api/admin/customers', { headers: getHeaders() });
    const customers = res.data.data;
    document.getElementById('customers-list').innerHTML = customers.length === 0
      ? '<div class="text-center py-12 text-gray-400"><i class="fas fa-users text-4xl mb-3 opacity-30"></i><p>No customers yet.</p></div>'
      : '<div class="overflow-x-auto"><table class="w-full text-sm bg-white rounded-2xl border border-gray-100 overflow-hidden"><thead class="bg-gray-50"><tr><th class="p-4 text-left text-gray-600 font-semibold">Customer</th><th class="p-4 text-left text-gray-600 font-semibold">Email</th><th class="p-4 text-left text-gray-600 font-semibold">Orders</th><th class="p-4 text-left text-gray-600 font-semibold">Total Spent</th></tr></thead><tbody>' +
      customers.map(c => \`
        <tr class="border-t hover:bg-gray-50">
          <td class="p-4 font-semibold text-gray-900">\${c.first_name || ''} \${c.last_name || ''}</td>
          <td class="p-4 text-gray-600">\${c.email}</td>
          <td class="p-4 text-gray-600">\${c.total_orders}</td>
          <td class="p-4 font-semibold text-blue-600">$\${parseFloat(c.total_spent).toFixed(2)}</td>
        </tr>
      \`).join('') +
      '</tbody></table></div>';
  } catch(err) { console.error(err); }
}

// ============================================================
// Messages
// ============================================================
async function loadMessages() {
  try {
    const res = await axios.get('/api/admin/contacts', { headers: getHeaders() });
    const msgs = res.data.data;
    document.getElementById('messages-list').innerHTML = msgs.length === 0
      ? '<div class="text-center py-12 text-gray-400"><i class="fas fa-envelope text-4xl mb-3 opacity-30"></i><p>No messages yet.</p></div>'
      : msgs.map(m => \`
      <div class="bg-white rounded-2xl p-5 border \${m.status === 'new' ? 'border-blue-200 bg-blue-50' : 'border-gray-100'} shadow-sm">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-gray-900">\${m.name}</span>
              \${m.status === 'new' ? '<span class="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">New</span>' : ''}
            </div>
            <p class="text-xs text-gray-500 mb-2">\${m.email} · \${m.phone || 'No phone'} · \${new Date(m.created_at).toLocaleDateString()}</p>
            <p class="text-sm font-semibold text-gray-700 mb-1">\${m.subject || 'No subject'}</p>
            <p class="text-sm text-gray-600 line-clamp-3">\${m.message}</p>
          </div>
          <div class="flex gap-2 ml-4 flex-shrink-0">
            <a href="mailto:\${m.email}?subject=Re: \${encodeURIComponent(m.subject || 'Your inquiry')}" 
               onclick="markMessageRead(\${m.id})"
               class="btn-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
              <i class="fas fa-reply mr-1"></i>Reply
            </a>
            <button onclick="markMessageRead(\${m.id})" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
              Mark Read
            </button>
          </div>
        </div>
      </div>
    \`).join('');
  } catch(err) { console.error(err); }
}

async function markMessageRead(id) {
  try {
    await axios.put('/api/admin/contacts/' + id, { status: 'read' }, { headers: getHeaders() });
    loadMessages();
  } catch(err) {}
}

// ============================================================
// Settings
// ============================================================
async function loadSettings() {
  try {
    const res = await axios.get('/api/admin/settings', { headers: getHeaders() });
    const s = res.data.data;
    
    const editableSettings = [
      { key: 'site_name', label: 'Business Name', type: 'text' },
      { key: 'site_tagline', label: 'Tagline', type: 'text' },
      { key: 'contact_phone', label: 'Phone Number', type: 'text' },
      { key: 'contact_email', label: 'Contact Email', type: 'email' },
      { key: 'business_address', label: 'Business Address', type: 'text' },
      { key: 'paypal_client_id', label: 'PayPal Client ID', type: 'text', placeholder: 'Live PayPal Client ID from developer.paypal.com' },
      { key: 'tax_rate', label: 'Tax Rate (decimal, e.g. 0.115 = 11.5%)', type: 'number' },
      { key: 'base_shipping_cost', label: 'Base Shipping Cost ($)', type: 'number' },
      { key: 'free_shipping_threshold', label: 'Free Shipping Threshold ($)', type: 'number' },
      { key: 'admin_pin', label: 'Admin PIN', type: 'password' },
      { key: 'about_text', label: 'About Us Text', type: 'textarea' },
      { key: 'hero_title', label: 'Homepage Hero Title', type: 'text' },
      { key: 'hero_subtitle', label: 'Homepage Hero Subtitle', type: 'text' },
    ];
    
    document.getElementById('settings-form').innerHTML = editableSettings.map(setting => \`
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">\${setting.label}</label>
        \${setting.type === 'textarea' 
          ? \`<textarea id="setting-\${setting.key}" rows="3" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none">\${s[setting.key] || ''}</textarea>\`
          : \`<input type="\${setting.type}" id="setting-\${setting.key}" value="\${s[setting.key] || ''}" placeholder="\${setting.placeholder || ''}" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">\`
        }
      </div>
    \`).join('') + \`
      <button onclick="saveSettings()" class="btn-primary text-white px-8 py-3 rounded-xl font-bold shadow-md">
        <i class="fas fa-save mr-2"></i>Save All Settings
      </button>
    \`;
  } catch(err) { console.error(err); }
}

async function saveSettings() {
  const keys = ['site_name','site_tagline','contact_phone','contact_email','business_address','paypal_client_id','tax_rate','base_shipping_cost','free_shipping_threshold','admin_pin','about_text','hero_title','hero_subtitle'];
  const data = {};
  for (const key of keys) {
    const el = document.getElementById('setting-' + key);
    if (el) data[key] = el.value;
  }
  try {
    await axios.put('/api/admin/settings', data, { headers: getHeaders() });
    if (data.admin_pin) {
      adminPin = data.admin_pin;
      localStorage.setItem('admin_pin', adminPin);
    }
    showToast('Settings saved!', 'check-circle', 'text-green-400');
  } catch(err) { alert('Error saving settings'); }
}

// ============================================================
// Database Init
// ============================================================
async function initDatabase() {
  if (!confirm('This will create database tables and add sample data. Continue?')) return;
  try {
    showToast('Initializing database...', 'spinner', 'text-blue-400');
    const res = await axios.post('/api/admin/init');
    if (res.data.success) {
      showToast('Database initialized successfully!', 'check-circle', 'text-green-400');
      if (document.getElementById('section-products').classList.contains('hidden') === false) loadProducts();
    }
  } catch(err) { alert('Error: ' + (err.response?.data?.error || err.message)); }
}

// ============================================================
// Utilities
// ============================================================
function getStatusColor(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    printing: 'bg-purple-100 text-purple-700',
    quality_check: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-cyan-100 text-cyan-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}
</script>
`
}
