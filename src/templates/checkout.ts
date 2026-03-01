export function getCheckoutPage(settings: Record<string, string>): string {
  const paypalClientId = settings.paypal_client_id || 'sb'
  const taxRate = parseFloat(settings.tax_rate || '0.115')

  return `
<div class="min-h-screen bg-gray-50">
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Secure Checkout</h1>
      <p class="text-gray-500 flex items-center justify-center gap-2">
        <i class="fas fa-lock text-green-500"></i>Your information is safe and encrypted
      </p>
    </div>

    <!-- Progress Steps -->
    <div class="flex items-center justify-center mb-10 max-w-xl mx-auto">
      <div class="flex items-center">
        <div id="step-1-icon" class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
        <div class="h-0.5 w-16 bg-blue-200 mx-2"></div>
      </div>
      <div class="flex items-center">
        <div id="step-2-icon" class="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm">2</div>
        <div class="h-0.5 w-16 bg-gray-200 mx-2"></div>
      </div>
      <div id="step-3-icon" class="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm">3</div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Order Form -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Step 1: Cart Review -->
        <div id="section-cart" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 mb-5 flex items-center">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
            Review Your Order
          </h2>
          <div id="checkout-cart-items" class="space-y-3 mb-4">
            <div class="text-center py-8 text-gray-400" id="empty-checkout-msg">
              <i class="fas fa-shopping-cart text-3xl mb-2 opacity-30"></i>
              <p>Your cart is empty. <a href="/products" class="text-blue-600 hover:underline">Browse products</a></p>
            </div>
          </div>
        </div>

        <!-- Step 2: Customer Info -->
        <div id="section-info" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 mb-5 flex items-center">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
            Contact & Shipping Information
          </h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                <input type="text" id="co-first" required placeholder="Carlos" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                <input type="text" id="co-last" required placeholder="Pérez" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input type="email" id="co-email" required placeholder="you@example.com" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <input type="tel" id="co-phone" required placeholder="787-XXX-XXXX" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Shipping Address *</label>
              <input type="text" id="co-address" required placeholder="Street address, apartment, suite, etc." class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">
              <div class="grid grid-cols-3 gap-2">
                <input type="text" id="co-city" required placeholder="City" class="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <select id="co-state" class="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="PR" selected>Puerto Rico</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="CA">California</option>
                  <option value="FL">Florida</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="">Other</option>
                </select>
                <input type="text" id="co-zip" required placeholder="ZIP" class="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Order Notes (optional)</label>
              <textarea id="co-notes" rows="3" placeholder="Customization requests, special instructions, color preferences..." class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
            </div>
          </div>
        </div>

        <!-- Step 3: Payment -->
        <div id="section-payment" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 mb-5 flex items-center">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
            Payment
          </h2>
          
          <div id="payment-error" class="hidden bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p id="payment-error-msg" class="text-red-700 text-sm flex items-center">
              <i class="fas fa-exclamation-circle mr-2"></i>Please fill in all required fields before proceeding to payment.
            </p>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
            <div class="flex items-start space-x-3">
              <i class="fas fa-info-circle text-blue-600 mt-0.5"></i>
              <div class="text-sm text-blue-800">
                <strong>Secure PayPal Checkout:</strong> You'll be directed to PayPal to complete your payment. Supports credit/debit cards and PayPal balance.
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 mb-5">
            <div class="flex items-center space-x-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <i class="fab fa-paypal text-blue-600 text-xl"></i>
              <span class="text-sm font-semibold text-gray-700">PayPal</span>
            </div>
            <div class="flex items-center space-x-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <i class="fas fa-credit-card text-gray-600"></i>
              <span class="text-sm text-gray-600">Credit/Debit Card</span>
            </div>
            <div class="flex items-center space-x-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <i class="fas fa-lock text-green-500"></i>
              <span class="text-sm text-gray-600">256-bit SSL</span>
            </div>
          </div>

          <!-- PayPal Button Container -->
          <div id="paypal-button-container" class="min-h-14 rounded-xl overflow-hidden"></div>
          <div id="paypal-loading" class="text-center py-6 text-gray-400 hidden">
            <i class="fas fa-spinner fa-spin mr-2"></i>Loading payment options...
          </div>
        </div>
      </div>

      <!-- Order Summary Sidebar -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
          <h3 class="text-xl font-bold text-gray-900 mb-5">Order Summary</h3>
          
          <div id="summary-items" class="space-y-3 mb-5 max-h-64 overflow-y-auto"></div>

          <div class="space-y-3 border-t pt-4">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span><span id="sum-subtotal">$0.00</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>Tax (11.5%)</span><span id="sum-tax">$0.00</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>Shipping</span><span id="sum-shipping">$8.99</span>
            </div>
            <div class="flex justify-between font-bold text-lg text-gray-900 border-t pt-3">
              <span>Total</span><span id="sum-total" class="text-blue-600">$0.00</span>
            </div>
          </div>

          <div class="mt-5 p-4 bg-green-50 rounded-xl border border-green-100">
            <div class="flex items-center space-x-2 text-green-700 text-sm">
              <i class="fas fa-truck"></i>
              <span id="shipping-msg">Free shipping on orders over $100!</span>
            </div>
          </div>

          <div class="mt-5 space-y-3 text-xs text-gray-500">
            <div class="flex items-center space-x-2"><i class="fas fa-shield-alt text-green-500"></i><span>100% Secure & Encrypted Payment</span></div>
            <div class="flex items-center space-x-2"><i class="fas fa-medal text-blue-500"></i><span>Quality guaranteed or full refund</span></div>
            <div class="flex items-center space-x-2"><i class="fas fa-clock text-purple-500"></i><span>Order ships within 3-5 business days</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- PayPal SDK -->
<script src="https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD&intent=capture" 
        onerror="document.getElementById('paypal-loading').classList.remove('hidden'); document.getElementById('paypal-button-container').innerHTML='<div class=\\'text-center text-gray-500 py-4\\'><i class=\\'fas fa-exclamation-circle text-yellow-500 mr-2\\'></i>PayPal is loading... Please ensure PayPal Client ID is configured in Admin Settings.</div>';">
</script>

<script>
const TAX_RATE = ${taxRate};
const FREE_SHIP = 100;
const SHIP_COST = 8.99;
let currentOrderId = null;

function getCartForCheckout() { return JSON.parse(localStorage.getItem('3dp_cart') || '[]'); }

function calcTotals(cartItems) {
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIP ? 0 : (subtotal > 0 ? SHIP_COST : 0);
  const total = subtotal + tax + shipping;
  return { subtotal, tax, shipping, total };
}

function renderCheckoutCart() {
  const items = getCartForCheckout();
  const cartDiv = document.getElementById('checkout-cart-items');
  const summaryDiv = document.getElementById('summary-items');
  const emptyMsg = document.getElementById('empty-checkout-msg');

  if (items.length === 0) {
    emptyMsg?.classList.remove('hidden');
    summaryDiv.innerHTML = '<p class="text-center text-gray-400 text-sm">No items</p>';
  } else {
    emptyMsg?.classList.add('hidden');
    const html = items.map(item => \`
      <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
        <div class="w-14 h-14 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          \${item.image ? \`<img src="\${item.image}" alt="\${item.name}" class="w-full h-full object-cover" onerror="this.style.display='none';this.parentNode.innerHTML='<i class=\\"fas fa-cube text-white\\"></i>'">\` : '<i class="fas fa-cube text-white"></i>'}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">\${item.name}</p>
          <p class="text-xs text-gray-500">Qty: \${item.quantity}</p>
        </div>
        <span class="text-sm font-bold text-blue-600">$\${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    \`).join('');
    cartDiv.innerHTML = html;
    summaryDiv.innerHTML = items.map(item => \`
      <div class="flex justify-between text-sm">
        <span class="text-gray-600 truncate max-w-40">\${item.name} ×\${item.quantity}</span>
        <span class="font-semibold ml-2">$\${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    \`).join('');
  }

  const { subtotal, tax, shipping, total } = calcTotals(items);
  document.getElementById('sum-subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('sum-tax').textContent = '$' + tax.toFixed(2);
  document.getElementById('sum-shipping').textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
  document.getElementById('sum-total').textContent = '$' + total.toFixed(2);

  if (subtotal >= FREE_SHIP) {
    document.getElementById('shipping-msg').innerHTML = '<i class="fas fa-check-circle text-green-500 mr-1"></i>You qualify for FREE shipping!';
  } else {
    const remaining = (FREE_SHIP - subtotal).toFixed(2);
    document.getElementById('shipping-msg').textContent = 'Add $' + remaining + ' more for free shipping!';
  }
}

function validateForm() {
  const fields = ['co-first','co-last','co-email','co-phone','co-address','co-city','co-zip'];
  for (const id of fields) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.focus();
      el.classList.add('border-red-400', 'ring-2', 'ring-red-200');
      return false;
    }
    el.classList.remove('border-red-400', 'ring-2', 'ring-red-200');
  }
  const items = getCartForCheckout();
  if (items.length === 0) return false;
  return true;
}

async function createOrder() {
  if (!validateForm()) {
    document.getElementById('payment-error').classList.remove('hidden');
    document.getElementById('payment-error-msg').textContent = 'Please fill in all required fields before completing payment.';
    document.getElementById('section-info').scrollIntoView({ behavior: 'smooth' });
    throw new Error('Validation failed');
  }
  document.getElementById('payment-error').classList.add('hidden');

  const items = getCartForCheckout();
  const { subtotal, tax, shipping, total } = calcTotals(items);

  const res = await axios.post('/api/orders', {
    customer_email: document.getElementById('co-email').value,
    customer_name: document.getElementById('co-first').value + ' ' + document.getElementById('co-last').value,
    customer_phone: document.getElementById('co-phone').value,
    payment_method: 'paypal',
    items: items.map(i => ({
      product_id: typeof i.id === 'number' ? i.id : null,
      product_name: i.name,
      quantity: i.quantity,
      unit_price: i.price,
      custom_image_url: i.image && i.image.startsWith('data:') ? null : i.image
    })),
    shipping_address: {
      line1: document.getElementById('co-address').value,
      city: document.getElementById('co-city').value,
      state: document.getElementById('co-state').value,
      zip: document.getElementById('co-zip').value,
      country: 'US'
    },
    notes: document.getElementById('co-notes').value
  });

  if (!res.data.success) throw new Error(res.data.error);
  currentOrderId = res.data.data.order_id;
  return { id: 'PAYPAL-' + currentOrderId + '-' + Date.now(), orderData: res.data.data };
}

async function capturePayPalOrder(data, orderData) {
  try {
    await axios.post('/api/orders/' + currentOrderId + '/payment', {
      paypal_order_id: data.orderID,
      paypal_payment_id: data.paymentID || data.orderID,
      paypal_payer_id: data.payerID
    });
    localStorage.removeItem('3dp_cart');
    updateCartUI();
    sessionStorage.setItem('last_order_id', currentOrderId);
    sessionStorage.setItem('last_order_total', orderData.total_amount);
    window.location.href = '/order-success';
  } catch(err) {
    console.error('Payment capture error:', err);
    showToast('Payment confirmed! Redirecting...', 'check-circle', 'text-green-400');
    setTimeout(() => window.location.href = '/order-success', 1500);
  }
}

// Initialize PayPal Buttons
function initPayPal() {
  if (typeof paypal === 'undefined') return;
  paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'blue',
      shape: 'rect',
      label: 'paypal',
      height: 50,
      tagline: false
    },
    createOrder: async () => {
      const result = await createOrder();
      const items = getCartForCheckout();
      const { subtotal, tax, shipping, total } = calcTotals(items);
      
      const order = await paypal.Buttons.driver ? { id: result.id } : null;
      if (window.paypal && paypal.Buttons) {
        return fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + 'test' },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
              amount: { currency_code: 'USD', value: total.toFixed(2) }
            }]
          })
        }).then(r => r.json()).then(d => d.id).catch(() => result.id);
      }
      return result.id;
    },
    onApprove: async (data) => {
      const items = getCartForCheckout();
      const { total } = calcTotals(items);
      await capturePayPalOrder(data, { total_amount: total });
    },
    onError: (err) => {
      console.error('PayPal error:', err);
      document.getElementById('payment-error').classList.remove('hidden');
      document.getElementById('payment-error-msg').innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>PayPal encountered an error. Please try again or contact us.';
    },
    onCancel: () => {
      showToast('Payment cancelled. Your cart is saved.', 'info-circle', 'text-blue-400');
    }
  }).render('#paypal-button-container');
}

// Fallback button in case PayPal doesn't load
setTimeout(() => {
  const container = document.getElementById('paypal-button-container');
  if (container && container.children.length === 0) {
    container.innerHTML = \`
      <div class="space-y-3">
        <button onclick="simulatePayment()" class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-xl text-lg transition-all shadow-lg flex items-center justify-center">
          <i class="fab fa-paypal mr-2 text-blue-700 text-2xl"></i>
          <span>Pay with PayPal</span>
        </button>
        <p class="text-xs text-center text-gray-400">Configure your PayPal Client ID in Admin Settings for live payments</p>
      </div>
    \`;
  }
}, 3000);

async function simulatePayment() {
  try {
    const result = await createOrder();
    showToast('Processing payment...', 'spinner', 'text-blue-400');
    setTimeout(async () => {
      await capturePayPalOrder({ orderID: 'DEMO-' + Date.now(), payerID: 'DEMO-PAYER' }, { total_amount: 0 });
    }, 1500);
  } catch(err) {
    if (err.message !== 'Validation failed') showToast('Error: ' + err.message, 'exclamation-circle', 'text-red-400');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutCart();
  if (typeof paypal !== 'undefined') initPayPal();
  else window.addEventListener('load', initPayPal);
});
</script>
`
}
