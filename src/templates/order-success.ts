export function getOrderSuccessPage(): string {
  return `
<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
  <div class="max-w-2xl w-full text-center">
    <!-- Success Animation -->
    <div class="relative inline-block mb-8">
      <div class="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl mx-auto">
        <i class="fas fa-check text-white text-5xl"></i>
      </div>
      <div class="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
        <i class="fas fa-star text-white text-sm"></i>
      </div>
    </div>

    <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Order Confirmed! 🎉</h1>
    <p class="text-xl text-gray-600 mb-2">Thank you for your order!</p>
    <p class="text-gray-500 mb-8">We've received your order and will begin printing shortly. You'll receive a confirmation email with updates.</p>

    <!-- Order Details Box -->
    <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-md mb-8 text-left">
      <h2 class="text-xl font-bold text-gray-900 mb-5 text-center">What Happens Next?</h2>
      <div class="space-y-4">
        ${[
          { step: '1', icon: 'fa-check-circle', color: 'text-green-500', title: 'Order Received', desc: 'Your order has been placed and payment confirmed.', done: true },
          { step: '2', icon: 'fa-cube', color: 'text-blue-500', title: 'Design Preparation', desc: 'We review your order and prepare the 3D print files.', done: false },
          { step: '3', icon: 'fa-print', color: 'text-purple-500', title: '3D Printing', desc: 'Your item is printed with care using premium materials.', done: false },
          { step: '4', icon: 'fa-search', color: 'text-orange-500', title: 'Quality Check', desc: 'Each piece is carefully inspected before packaging.', done: false },
          { step: '5', icon: 'fa-truck', color: 'text-blue-600', title: 'Shipped to You', desc: 'Your order ships within 3-5 business days.', done: false },
        ].map(s => `
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 ${s.done ? 'bg-green-50' : 'bg-gray-50'} rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas ${s.icon} ${s.done ? 'text-green-500' : s.color} text-lg"></i>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-gray-900 ${s.done ? 'text-green-700' : ''}">${s.title} ${s.done ? '✓' : ''}</p>
            <p class="text-sm text-gray-500">${s.desc}</p>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <!-- Contact Info -->
    <div class="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
      <h3 class="font-bold text-blue-900 mb-3">Questions about your order?</h3>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="tel:787-403-1552" class="flex items-center justify-center space-x-2 bg-white hover:bg-blue-100 border border-blue-200 rounded-xl px-5 py-3 text-blue-700 font-semibold transition-colors">
          <i class="fas fa-phone-alt"></i>
          <span>787-403-1552</span>
        </a>
        <a href="mailto:carlos.perez@dataurea.com" class="flex items-center justify-center space-x-2 bg-white hover:bg-blue-100 border border-blue-200 rounded-xl px-5 py-3 text-blue-700 font-semibold transition-colors">
          <i class="fas fa-envelope"></i>
          <span>Email Us</span>
        </a>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap justify-center gap-4">
      <a href="/products" class="btn-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg">
        <i class="fas fa-shopping-bag mr-2"></i>Continue Shopping
      </a>
      <a href="/" class="border-2 border-gray-200 text-gray-700 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-colors">
        <i class="fas fa-home mr-2"></i>Back to Home
      </a>
    </div>
  </div>
</div>

<script>
// Clear cart on success page
localStorage.removeItem('3dp_cart');
if (typeof updateCartUI === 'function') updateCartUI();
</script>
`
}
