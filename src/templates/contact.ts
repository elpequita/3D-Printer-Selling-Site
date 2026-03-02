export function getContactPage(settings: Record<string, string>): string {
  const phone = settings.contact_phone || '787-403-1552'
  const email = settings.contact_email || 'carlos.perez@dataurea.com'

  return `
<div style="min-height:100vh">
  <!-- Header -->
  <section style="position:relative;overflow:hidden;padding:80px 24px;text-align:center">
    <div class="orb orb-cyan" style="width:500px;height:500px;top:-200px;left:-100px;opacity:0.5"></div>
    <div class="orb orb-purple" style="width:400px;height:400px;bottom:-150px;right:-80px;opacity:0.4"></div>
    <div class="bg-grid" style="position:absolute;inset:0;opacity:0.3"></div>
    <div style="position:relative;z-index:1">
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(0,245,255,0.08);border:1px solid rgba(0,245,255,0.2);color:var(--neon-cyan);padding:8px 18px;border-radius:50px;font-size:13px;font-weight:600;margin-bottom:20px">
        <i class="fas fa-comments"></i>Let's Talk
      </div>
      <h1 class="font-display" style="font-size:clamp(28px,4vw,52px);font-weight:900;color:#fff;margin-bottom:16px">Get In Touch</h1>
      <p style="color:var(--text-secondary);font-size:17px;max-width:520px;margin:0 auto;line-height:1.7">Have a project idea, custom order, or question? We'd love to hear from you.</p>
    </div>
  </section>

  <div style="max-width:1100px;margin:0 auto;padding:0 24px 80px">
    <div style="display:grid;grid-template-columns:1fr;gap:24px" id="contact-layout">
      <!-- Left Panel -->
      <div style="display:flex;flex-direction:column;gap:20px">
        <!-- Contact Info Card -->
        <div class="glass-card" style="border-radius:24px;padding:28px">
          <h2 style="font-size:17px;font-weight:700;color:#fff;margin-bottom:24px">Contact Information</h2>
          <div style="display:flex;flex-direction:column;gap:20px">
            ${[
              { icon:'fa-phone-alt', neon:'var(--neon-green)', label:'Phone', val: phone, href:'tel:'+phone, note:'Mon-Fri 9am-6pm AST' },
              { icon:'fa-envelope', neon:'var(--neon-cyan)', label:'Email', val: email, href:'mailto:'+email, note:'We respond within 24 hours' },
              { icon:'fa-map-marker-alt', neon:'var(--neon-purple)', label:'Location', val:'Puerto Rico, USA', href:'', note:'Shipping available island-wide' },
              { icon:'fa-clock', neon:'var(--neon-orange)', label:'Hours', val:'Mon–Fri 9am–6pm', href:'', note:'Saturday: 10am–4pm' },
            ].map(c => `
            <div style="display:flex;align-items:flex-start;gap:16px">
              <div style="width:46px;height:46px;background:linear-gradient(135deg,rgba(0,245,255,0.08),rgba(191,0,255,0.06));border:1px solid rgba(255,255,255,0.08);border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas ${c.icon}" style="color:${c.neon};font-size:16px;filter:drop-shadow(0 0 6px ${c.neon})"></i>
              </div>
              <div>
                <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px">${c.label}</div>
                ${c.href ? `<a href="${c.href}" style="font-size:15px;font-weight:700;color:#fff;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='${c.neon}'" onmouseout="this.style.color='#fff'">${c.val}</a>` : `<div style="font-size:15px;font-weight:600;color:#fff">${c.val}</div>`}
                <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${c.note}</div>
              </div>
            </div>`).join('')}
          </div>
        </div>

        <!-- What We Offer -->
        <div style="border-radius:24px;padding:28px;background:linear-gradient(135deg,rgba(0,245,255,0.06),rgba(191,0,255,0.04));border:1px solid rgba(0,245,255,0.15)">
          <h3 style="font-weight:700;color:#fff;font-size:16px;margin-bottom:18px">What We Offer</h3>
          <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px">
            ${['FDM & Resin 3D Printing','Custom design consultation','Prototype development','Bulk order discounts','Rush orders available','Material samples available'].map(item =>
              `<li style="display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text-secondary)"><i class="fas fa-check-circle" style="color:var(--neon-green);flex-shrink:0;filter:drop-shadow(0 0 4px var(--neon-green))"></i>${item}</li>`
            ).join('')}
          </ul>
        </div>

        <!-- Quick Actions -->
        <div class="glass-card" style="border-radius:24px;padding:24px">
          <h3 style="font-weight:700;color:#fff;font-size:15px;margin-bottom:16px">Quick Actions</h3>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${[
              { href:'tel:'+phone, icon:'fa-phone-alt', label:'Call Now', neon:'var(--neon-green)', bg:'rgba(0,255,136,0.06)', border:'rgba(0,255,136,0.2)' },
              { href:'mailto:'+email, icon:'fa-envelope', label:'Send Email', neon:'var(--neon-cyan)', bg:'rgba(0,245,255,0.06)', border:'rgba(0,245,255,0.2)' },
              { href:'/preview', icon:'fa-cube', label:'3D Preview Tool', neon:'var(--neon-purple)', bg:'rgba(191,0,255,0.06)', border:'rgba(191,0,255,0.2)' },
            ].map(q => `
            <a href="${q.href}" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:${q.bg};border:1px solid ${q.border};border-radius:14px;text-decoration:none;transition:all 0.2s"
               onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='none'">
              <span style="display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600;color:#fff">
                <i class="fas ${q.icon}" style="color:${q.neon}"></i>${q.label}
              </span>
              <i class="fas fa-arrow-right" style="color:${q.neon};font-size:12px"></i>
            </a>`).join('')}
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div>
        <div class="glass-card" style="border-radius:24px;padding:36px">
          <h2 class="font-display" style="font-size:22px;font-weight:800;color:#fff;margin-bottom:8px">Send Us a Message</h2>
          <p style="color:var(--text-secondary);margin-bottom:28px;font-size:14px">Fill out the form and we'll get back to you as soon as possible.</p>

          <div id="contact-success" style="display:none;background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.25);border-radius:16px;padding:16px;margin-bottom:20px">
            <div style="display:flex;align-items:center;gap:12px;color:var(--neon-green)">
              <i class="fas fa-check-circle" style="font-size:24px;filter:drop-shadow(0 0 8px var(--neon-green))"></i>
              <div><div style="font-weight:700;margin-bottom:2px">Message Sent!</div><div style="font-size:13px;color:var(--text-secondary)">Thank you! We'll get back to you within 24 hours.</div></div>
            </div>
          </div>
          <div id="contact-error" style="display:none;background:rgba(255,80,80,0.06);border:1px solid rgba(255,80,80,0.25);border-radius:16px;padding:16px;margin-bottom:20px">
            <div style="display:flex;align-items:center;gap:12px;color:#ff5555">
              <i class="fas fa-exclamation-circle" style="font-size:24px"></i>
              <div><div style="font-weight:700;margin-bottom:2px">Oops!</div><div id="contact-error-msg" style="font-size:13px;color:var(--text-secondary)">Something went wrong. Please try again.</div></div>
            </div>
          </div>

          <form id="contact-form" style="display:flex;flex-direction:column;gap:18px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px" class="form-grid">
              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Full Name *</label>
                <input type="text" id="contact-name" required placeholder="Carlos Pérez"
                       class="dark-input" style="width:100%;padding:12px 16px;border-radius:12px;font-size:14px;font-family:inherit">
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Email Address *</label>
                <input type="email" id="contact-email" required placeholder="you@example.com"
                       class="dark-input" style="width:100%;padding:12px 16px;border-radius:12px;font-size:14px;font-family:inherit">
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px" class="form-grid">
              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Phone Number</label>
                <input type="tel" id="contact-phone" placeholder="787-XXX-XXXX"
                       class="dark-input" style="width:100%;padding:12px 16px;border-radius:12px;font-size:14px;font-family:inherit">
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Subject</label>
                <select id="contact-subject"
                        class="dark-input" style="width:100%;padding:12px 16px;border-radius:12px;font-size:14px;font-family:inherit">
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
              <label style="display:block;font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Message *</label>
              <textarea id="contact-message" required rows="6" placeholder="Tell us about your project, dimensions needed, quantity, timeline, or any questions you have..."
                        class="dark-input" style="width:100%;padding:12px 16px;border-radius:12px;font-size:14px;resize:none;font-family:inherit"></textarea>
            </div>
            <div style="display:flex;align-items:flex-start;gap:10px">
              <input type="checkbox" id="terms" required style="margin-top:3px;accent-color:var(--neon-cyan)">
              <label for="terms" style="font-size:13px;color:var(--text-secondary);line-height:1.6;cursor:pointer">
                I agree to be contacted regarding my inquiry. We respect your privacy and won't spam you.
              </label>
            </div>
            <button type="submit" id="contact-submit" class="btn-solid-cyan" style="padding:16px;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;width:100%">
              <i class="fas fa-paper-plane mr-2"></i>Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
@media(min-width:768px) {
  #contact-layout { grid-template-columns: 360px 1fr !important; }
}
@media(max-width:480px) {
  .form-grid { grid-template-columns: 1fr !important; }
}
</style>

<script>
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('contact-submit');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
  document.getElementById('contact-success').style.display = 'none';
  document.getElementById('contact-error').style.display = 'none';
  try {
    const res = await axios.post('/api/contact', {
      name: document.getElementById('contact-name').value,
      email: document.getElementById('contact-email').value,
      phone: document.getElementById('contact-phone').value,
      subject: document.getElementById('contact-subject').value,
      message: document.getElementById('contact-message').value
    });
    if (res.data.success) {
      document.getElementById('contact-success').style.display = 'block';
      document.getElementById('contact-form').reset();
      document.getElementById('contact-success').scrollIntoView({ behavior:'smooth' });
    }
  } catch(err) {
    const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
    document.getElementById('contact-error-msg').textContent = msg;
    document.getElementById('contact-error').style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
  }
});
</script>
`
}
