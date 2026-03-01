export function getContactPage(settings: Record<string, string>): string {
  const phone = settings.contact_phone || '787-403-1552'
  const email = settings.contact_email || 'carlos.perez@dataurea.com'

  return `
<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-gradient-to-br from-blue-900 to-gray-900 text-white py-16">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <h1 class="text-4xl font-extrabold mb-4">Get In Touch</h1>
      <p class="text-blue-200 text-xl max-w-2xl mx-auto">Have a project idea, question, or custom order? We'd love to hear from you.</p>
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Contact Info -->
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 mb-5">Contact Information</h2>
          <div class="space-y-5">
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-phone-alt text-blue-600 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Phone</h3>
                <a href="tel:${phone}" class="text-blue-600 hover:text-blue-700 text-lg font-bold">${phone}</a>
                <p class="text-xs text-gray-400 mt-1">Mon-Fri 9am-6pm AST</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-envelope text-blue-600 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Email</h3>
                <a href="mailto:${email}" class="text-blue-600 hover:text-blue-700 break-all">${email}</a>
                <p class="text-xs text-gray-400 mt-1">We respond within 24 hours</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-map-marker-alt text-blue-600 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Location</h3>
                <p class="text-gray-600">Puerto Rico, USA</p>
                <p class="text-xs text-gray-400 mt-1">Shipping available island-wide</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-clock text-blue-600 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Business Hours</h3>
                <p class="text-gray-600 text-sm">Monday – Friday: 9am – 6pm</p>
                <p class="text-gray-600 text-sm">Saturday: 10am – 4pm</p>
                <p class="text-gray-400 text-sm">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <!-- What We Offer -->
        <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <h3 class="font-bold text-lg mb-4">What We Offer</h3>
          <ul class="space-y-3 text-sm text-blue-100">
            ${[
              'FDM & Resin 3D Printing',
              'Custom design consultation',
              'Prototype development',
              'Bulk order discounts',
              'Rush orders available',
              'Material samples available',
            ].map(item => `<li class="flex items-center"><i class="fas fa-check-circle mr-2 text-green-400"></i>${item}</li>`).join('')}
          </ul>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 class="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <a href="tel:${phone}" class="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
              <span class="flex items-center text-green-700 font-medium"><i class="fas fa-phone-alt mr-3 text-green-600"></i>Call Now</span>
              <i class="fas fa-arrow-right text-green-500 group-hover:translate-x-1 transition-transform"></i>
            </a>
            <a href="mailto:${email}" class="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
              <span class="flex items-center text-blue-700 font-medium"><i class="fas fa-envelope mr-3 text-blue-600"></i>Send Email</span>
              <i class="fas fa-arrow-right text-blue-500 group-hover:translate-x-1 transition-transform"></i>
            </a>
            <a href="/preview" class="flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group">
              <span class="flex items-center text-orange-700 font-medium"><i class="fas fa-magic mr-3 text-orange-600"></i>3D Preview Tool</span>
              <i class="fas fa-arrow-right text-orange-500 group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
          <p class="text-gray-500 mb-6">Fill out the form and we'll get back to you as soon as possible.</p>
          
          <div id="contact-success" class="hidden bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div class="flex items-center text-green-700">
              <i class="fas fa-check-circle text-2xl mr-3"></i>
              <div>
                <h4 class="font-bold">Message Sent!</h4>
                <p class="text-sm">Thank you! We'll get back to you within 24 hours.</p>
              </div>
            </div>
          </div>
          
          <div id="contact-error" class="hidden bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div class="flex items-center text-red-700">
              <i class="fas fa-exclamation-circle text-2xl mr-3"></i>
              <div>
                <h4 class="font-bold">Oops!</h4>
                <p id="contact-error-msg" class="text-sm">Something went wrong. Please try again.</p>
              </div>
            </div>
          </div>

          <form id="contact-form" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input type="text" id="contact-name" required
                       placeholder="Carlos Pérez"
                       class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input type="email" id="contact-email" required
                       placeholder="you@example.com"
                       class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" id="contact-phone"
                       placeholder="787-XXX-XXXX"
                       class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select id="contact-subject" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option>General Inquiry</option>
                  <option>Custom Order Request</option>
                  <option>Pricing Question</option>
                  <option>Technical Support</option>
                  <option>Bulk Order</option>
                  <option>Prototype Request</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
              <textarea id="contact-message" required rows="6"
                        placeholder="Tell us about your project, dimensions needed, quantity, timeline, or any questions you have..."
                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"></textarea>
            </div>
            <div class="flex items-start space-x-3">
              <input type="checkbox" id="terms" required class="mt-1 text-blue-600 focus:ring-blue-500">
              <label for="terms" class="text-sm text-gray-600">
                I agree to be contacted regarding my inquiry. We respect your privacy and won't spam you.
              </label>
            </div>
            <button type="submit" id="contact-submit" 
                    class="btn-primary w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg">
              <i class="fas fa-paper-plane mr-2"></i>Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('contact-submit');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
  document.getElementById('contact-success').classList.add('hidden');
  document.getElementById('contact-error').classList.add('hidden');

  try {
    const res = await axios.post('/api/contact', {
      name: document.getElementById('contact-name').value,
      email: document.getElementById('contact-email').value,
      phone: document.getElementById('contact-phone').value,
      subject: document.getElementById('contact-subject').value,
      message: document.getElementById('contact-message').value
    });
    if (res.data.success) {
      document.getElementById('contact-success').classList.remove('hidden');
      document.getElementById('contact-form').reset();
      document.getElementById('contact-success').scrollIntoView({ behavior: 'smooth' });
    }
  } catch(err) {
    const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
    document.getElementById('contact-error-msg').textContent = msg;
    document.getElementById('contact-error').classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
  }
});
</script>
`
}
