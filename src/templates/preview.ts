export function getPreviewPage(settings: Record<string, string>): string {
  return `
<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 text-white py-16">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <div class="inline-flex items-center bg-white bg-opacity-10 border border-white border-opacity-20 text-blue-200 px-4 py-2 rounded-full text-sm mb-6">
        <i class="fas fa-magic mr-2 text-yellow-300"></i>Powered by visual AI processing
      </div>
      <h1 class="text-4xl font-extrabold mb-4">3D Print Preview Tool</h1>
      <p class="text-blue-200 text-xl max-w-2xl mx-auto">Upload any image and visualize how it could look as a 3D printed object. Choose your material and style to see your concept come to life.</p>
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Upload & Settings Panel -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 mb-5 flex items-center">
            <i class="fas fa-upload mr-2 text-blue-600"></i>Upload Your Image
          </h2>
          
          <!-- Dropzone -->
          <div id="dropzone" onclick="document.getElementById('file-input').click()" 
               class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
            <div id="upload-placeholder">
              <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                <i class="fas fa-cloud-upload-alt text-blue-400 text-2xl"></i>
              </div>
              <p class="font-semibold text-gray-700">Click or drag to upload</p>
              <p class="text-sm text-gray-400 mt-1">JPG, PNG, GIF, WebP – up to 10MB</p>
            </div>
            <div id="upload-preview" class="hidden">
              <img id="preview-thumbnail" class="max-h-40 mx-auto rounded-xl shadow-md mb-3" alt="Uploaded image">
              <p class="text-sm text-gray-500" id="upload-filename">File ready</p>
              <button onclick="resetUpload(event)" class="mt-2 text-xs text-red-500 hover:text-red-700">
                <i class="fas fa-times mr-1"></i>Remove & upload different
              </button>
            </div>
          </div>
          <input type="file" id="file-input" accept="image/*" class="hidden" onchange="handleFileSelect(this)">
        </div>

        <!-- Options -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 mb-5 flex items-center">
            <i class="fas fa-sliders-h mr-2 text-blue-600"></i>Print Options
          </h2>
          
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Print Style</label>
              <div class="grid grid-cols-2 gap-2">
                ${[
                  { value: 'standard', label: 'Standard', icon: 'fa-cube', desc: 'Clean & precise' },
                  { value: 'detailed', label: 'Detailed', icon: 'fa-star', desc: 'High-res finish' },
                  { value: 'artistic', label: 'Artistic', icon: 'fa-paint-brush', desc: 'Creative flair' },
                  { value: 'functional', label: 'Functional', icon: 'fa-wrench', desc: 'Practical design' },
                ].map(style => `
                <label class="style-option cursor-pointer">
                  <input type="radio" name="style" value="${style.value}" ${style.value === 'standard' ? 'checked' : ''} class="hidden" onchange="updateStyle(this)">
                  <div class="style-card border-2 border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-all ${style.value === 'standard' ? 'border-blue-500 bg-blue-50' : ''}">
                    <div class="flex items-center space-x-2">
                      <i class="fas ${style.icon} text-blue-500 text-sm"></i>
                      <div>
                        <p class="text-xs font-bold text-gray-900">${style.label}</p>
                        <p class="text-xs text-gray-400">${style.desc}</p>
                      </div>
                    </div>
                  </div>
                </label>`).join('')}
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Material</label>
              <select id="preview-material" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="PLA">PLA – Eco-friendly (Recommended)</option>
                <option value="ABS">ABS – High Strength</option>
                <option value="PETG">PETG – Flexible & Durable</option>
                <option value="Resin">Resin – Ultra Fine Detail</option>
                <option value="TPU">TPU – Rubber-like Flexible</option>
                <option value="Nylon">Nylon – Industrial Grade</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Color</label>
              <div class="grid grid-cols-6 gap-2 mb-2">
                ${[
                  { name: 'White', hex: '#f8f9fa' },
                  { name: 'Black', hex: '#212529' },
                  { name: 'Red', hex: '#dc3545' },
                  { name: 'Blue', hex: '#0d6efd' },
                  { name: 'Green', hex: '#198754' },
                  { name: 'Yellow', hex: '#ffc107' },
                  { name: 'Orange', hex: '#fd7e14' },
                  { name: 'Purple', hex: '#6f42c1' },
                  { name: 'Gray', hex: '#6c757d' },
                  { name: 'Silver', hex: '#adb5bd' },
                  { name: 'Gold', hex: '#c9a84c' },
                  { name: 'Clear', hex: 'linear-gradient(135deg, #cfe2ff, #fff)' },
                ].map(c => `
                <button onclick="selectColor('${c.name}', this)" 
                        title="${c.name}"
                        class="color-swatch w-8 h-8 rounded-full border-2 border-gray-200 hover:border-blue-400 transition-all ${c.name === 'White' ? 'border-blue-500 ring-2 ring-blue-300' : ''}"
                        style="background: ${c.hex}">
                </button>`).join('')}
              </div>
              <p class="text-xs text-gray-500">Selected: <span id="selected-color-name" class="font-semibold text-gray-700">White</span></p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email (optional)</label>
              <input type="email" id="preview-email" placeholder="For follow-up & quote"
                     class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
              <textarea id="preview-notes" rows="3" placeholder="Size requirements, special features, intended use..."
                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
            </div>

            <button onclick="generatePreview()" id="generate-btn"
                    class="btn-primary w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-magic mr-2"></i>Generate 3D Preview
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Output Panel -->
      <div class="lg:col-span-3 space-y-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b bg-gray-50 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900"><i class="fas fa-eye mr-2 text-blue-600"></i>Preview Result</h2>
            <span id="preview-status-badge" class="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Awaiting upload</span>
          </div>

          <!-- Empty State -->
          <div id="preview-empty" class="p-12 text-center text-gray-400">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-cube text-blue-300 text-4xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Your preview will appear here</h3>
            <p class="text-sm max-w-xs mx-auto">Upload an image and click "Generate 3D Preview" to see how your idea could look when 3D printed.</p>
          </div>

          <!-- Loading State -->
          <div id="preview-loading" class="hidden p-12 text-center">
            <div class="relative w-24 h-24 mx-auto mb-4">
              <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <i class="fas fa-cube text-blue-600 text-2xl"></i>
              </div>
            </div>
            <p class="text-gray-600 font-semibold text-lg">Generating your 3D preview...</p>
            <p class="text-gray-400 text-sm mt-1">Analyzing image and applying material properties</p>
          </div>

          <!-- Result State -->
          <div id="preview-result" class="hidden">
            <div class="relative bg-gradient-to-br from-gray-900 to-gray-800 min-h-80 flex items-center justify-center p-8">
              <!-- 3D-style frame effect -->
              <div id="preview-canvas-container" class="relative">
                <div id="result-image-container" class="relative rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto">
                  <!-- Will be filled by JS -->
                </div>
                <!-- Floating material badge -->
                <div id="material-badge" class="absolute -top-3 -right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold">PLA</div>
                <div id="color-badge" class="absolute -bottom-3 -right-3 bg-gray-800 text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold">White</div>
              </div>
            </div>
            
            <!-- Overlay effects panel -->
            <div id="effects-panel" class="p-6 border-t bg-gray-50">
              <p class="text-sm font-semibold text-gray-700 mb-3">Visual Enhancements</p>
              <div class="flex flex-wrap gap-2">
                <button onclick="applyEffect('none')" class="effect-btn active px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white">Original</button>
                <button onclick="applyEffect('metallic')" class="effect-btn px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">Metallic</button>
                <button onclick="applyEffect('matte')" class="effect-btn px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">Matte</button>
                <button onclick="applyEffect('glossy')" class="effect-btn px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">Glossy</button>
                <button onclick="applyEffect('wireframe')" class="effect-btn px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">Wireframe</button>
                <button onclick="applyEffect('blueprint')" class="effect-btn px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">Blueprint</button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="p-6 grid grid-cols-2 gap-4">
              <button onclick="savePreview()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-colors">
                <i class="fas fa-download mr-2"></i>Save Preview
              </button>
              <button onclick="orderCustomPrint()" class="btn-primary text-white py-3 rounded-xl font-semibold text-sm shadow-lg">
                <i class="fas fa-shopping-cart mr-2"></i>Order This Print
              </button>
              <button onclick="sharePreview()" class="bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-xl font-semibold text-sm transition-colors">
                <i class="fas fa-share-alt mr-2"></i>Share Preview
              </button>
              <a href="/contact" class="border border-gray-200 hover:border-blue-300 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-colors text-center">
                <i class="fas fa-comments mr-2"></i>Get Quote
              </a>
            </div>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="grid grid-cols-3 gap-4">
          ${[
            { icon: 'fa-cube', title: 'FDM Printing', desc: 'Layer-by-layer precision for durable, functional parts' },
            { icon: 'fa-star', title: 'Resin Printing', desc: 'Ultra-fine details perfect for miniatures & jewelry' },
            { icon: 'fa-paint-brush', title: 'Custom Colors', desc: 'Choose from 12+ colors or request custom matching' },
          ].map(info => `
          <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <i class="fas ${info.icon} text-blue-600"></i>
            </div>
            <h4 class="font-bold text-gray-900 text-sm mb-1">${info.title}</h4>
            <p class="text-xs text-gray-500 leading-relaxed">${info.desc}</p>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let selectedFile = null;
let selectedColor = 'White';
let selectedStyle = 'standard';
let previewId = null;
let previewDataUrl = null;
let currentEffect = 'none';

const colorHexMap = {
  'White':'#f8fafc', 'Black':'#1e293b', 'Red':'#dc2626', 'Blue':'#2563eb',
  'Green':'#16a34a', 'Yellow':'#ca8a04', 'Orange':'#ea580c', 'Purple':'#7c3aed',
  'Gray':'#6b7280', 'Silver':'#94a3b8', 'Gold':'#b45309', 'Clear':'#e0f2fe'
};

function handleFileSelect(input) {
  const file = input.files[0];
  if (!file) return;
  selectedFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('preview-thumbnail').src = e.target.result;
    document.getElementById('upload-filename').textContent = file.name + ' (' + (file.size / 1024).toFixed(0) + ' KB)';
    document.getElementById('upload-placeholder').classList.add('hidden');
    document.getElementById('upload-preview').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function resetUpload(e) {
  e.stopPropagation();
  selectedFile = null;
  document.getElementById('file-input').value = '';
  document.getElementById('upload-placeholder').classList.remove('hidden');
  document.getElementById('upload-preview').classList.add('hidden');
}

function selectColor(name, btn) {
  selectedColor = name;
  document.getElementById('selected-color-name').textContent = name;
  document.querySelectorAll('.color-swatch').forEach(s => {
    s.classList.remove('border-blue-500', 'ring-2', 'ring-blue-300');
    s.classList.add('border-gray-200');
  });
  btn.classList.add('border-blue-500', 'ring-2', 'ring-blue-300');
  btn.classList.remove('border-gray-200');
  if (previewDataUrl) updatePreviewDisplay();
}

function updateStyle(input) {
  selectedStyle = input.value;
  document.querySelectorAll('.style-card').forEach(c => {
    c.classList.remove('border-blue-500', 'bg-blue-50');
    c.classList.add('border-gray-200');
  });
  input.closest('.style-option').querySelector('.style-card').classList.add('border-blue-500', 'bg-blue-50');
  input.closest('.style-option').querySelector('.style-card').classList.remove('border-gray-200');
}

async function generatePreview() {
  if (!selectedFile) {
    showToast('Please upload an image first!', 'exclamation-circle', 'text-yellow-400');
    return;
  }

  document.getElementById('preview-empty').classList.add('hidden');
  document.getElementById('preview-result').classList.add('hidden');
  document.getElementById('preview-loading').classList.remove('hidden');
  document.getElementById('preview-status-badge').textContent = 'Processing...';
  document.getElementById('preview-status-badge').className = 'text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-pulse';

  const formData = new FormData();
  formData.append('image', selectedFile);
  formData.append('style', selectedStyle);
  formData.append('material', document.getElementById('preview-material').value);
  formData.append('color', selectedColor);
  formData.append('notes', document.getElementById('preview-notes').value);
  formData.append('email', document.getElementById('preview-email').value);
  formData.append('session_id', getSessionId());

  try {
    const res = await axios.post('/api/preview', formData);
    if (res.data.success) {
      previewId = res.data.data.preview_id;
      previewDataUrl = res.data.data.uploaded_image;
      currentEffect = 'none';
      updatePreviewDisplay();
      document.getElementById('preview-loading').classList.add('hidden');
      document.getElementById('preview-result').classList.remove('hidden');
      document.getElementById('preview-status-badge').textContent = '✓ Preview Ready';
      document.getElementById('preview-status-badge').className = 'text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-semibold';
    }
  } catch(err) {
    document.getElementById('preview-loading').classList.add('hidden');
    document.getElementById('preview-empty').classList.remove('hidden');
    document.getElementById('preview-status-badge').textContent = 'Error';
    document.getElementById('preview-status-badge').className = 'text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full';
    showToast('Error generating preview. Please try again.', 'exclamation-circle', 'text-red-400');
  }
}

function updatePreviewDisplay() {
  const material = document.getElementById('preview-material').value;
  const colorHex = colorHexMap[selectedColor] || '#888';
  const container = document.getElementById('result-image-container');
  
  let filterStyle = '';
  let overlayHtml = '';
  
  switch(currentEffect) {
    case 'metallic':
      filterStyle = 'filter: saturate(0.4) contrast(1.3) brightness(1.1);';
      overlayHtml = '<div class="absolute inset-0 bg-gradient-to-br from-white opacity-20 rounded-2xl mix-blend-overlay"></div>';
      break;
    case 'matte':
      filterStyle = 'filter: saturate(0.7) contrast(1.1);';
      break;
    case 'glossy':
      overlayHtml = '<div class="absolute inset-0 bg-gradient-to-br from-white opacity-30 rounded-2xl" style="mix-blend-mode:screen"></div>';
      break;
    case 'wireframe':
      filterStyle = 'filter: grayscale(1) invert(0.9) contrast(2);';
      overlayHtml = '<div class="absolute inset-0 rounded-2xl" style="background: repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(0,150,255,0.15) 12px, rgba(0,150,255,0.15) 13px), repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,150,255,0.15) 12px, rgba(0,150,255,0.15) 13px);"></div>';
      break;
    case 'blueprint':
      filterStyle = 'filter: sepia(1) hue-rotate(190deg) saturate(3);';
      overlayHtml = '<div class="absolute inset-0 rounded-2xl" style="background: repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)"></div>';
      break;
  }

  // Tint overlay with selected color
  const tintOverlay = selectedColor !== 'White' && selectedColor !== 'Clear' 
    ? \`<div class="absolute inset-0 rounded-2xl" style="background: \${colorHex}; mix-blend-mode: multiply; opacity: 0.25;"></div>\`
    : '';

  container.innerHTML = \`
    <div class="relative" style="min-width: 280px; min-height: 280px;">
      <img src="\${previewDataUrl}" alt="3D Preview" class="w-full h-full object-contain rounded-2xl max-h-80 mx-auto" style="\${filterStyle}" onerror="this.src=''">
      \${tintOverlay}
      \${overlayHtml}
      <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl p-4">
        <p class="text-white text-xs font-semibold">\${selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)} Print · \${material} · \${selectedColor}</p>
      </div>
    </div>
  \`;

  document.getElementById('material-badge').textContent = material;
  document.getElementById('color-badge').textContent = selectedColor;
}

function applyEffect(effect) {
  currentEffect = effect;
  document.querySelectorAll('.effect-btn').forEach(b => {
    b.className = 'effect-btn px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200';
  });
  event.target.className = 'effect-btn active px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white';
  if (previewDataUrl) updatePreviewDisplay();
}

function savePreview() {
  if (!previewDataUrl) return;
  const a = document.createElement('a');
  a.href = previewDataUrl;
  a.download = '3d-print-preview-' + Date.now() + '.jpg';
  a.click();
}

function orderCustomPrint() {
  if (previewDataUrl) {
    sessionStorage.setItem('custom_preview_image', previewDataUrl);
    sessionStorage.setItem('custom_preview_style', selectedStyle);
    sessionStorage.setItem('custom_preview_material', document.getElementById('preview-material').value);
    sessionStorage.setItem('custom_preview_color', selectedColor);
  }
  const customItem = {
    id: 'custom-' + Date.now(),
    name: 'Custom 3D Print - ' + selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1) + ' Style',
    price: 49.99,
    image: previewDataUrl || '',
    quantity: 1
  };
  addToCart(customItem.id, customItem.name, customItem.price, customItem.image);
  showToast('Custom print added to cart!', 'check-circle', 'text-green-400');
  setTimeout(() => toggleCart(), 500);
}

function sharePreview() {
  if (navigator.share && previewDataUrl) {
    navigator.share({ title: '3D Print Preview', text: 'Check out my 3D print preview from 3D Creations PR!', url: window.location.href });
  } else {
    navigator.clipboard?.writeText(window.location.href).then(() => showToast('Link copied!', 'check-circle', 'text-green-400'));
  }
}

function getSessionId() {
  let sid = localStorage.getItem('3dp_session');
  if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('3dp_session', sid); }
  return sid;
}

// Drag & Drop
const dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('border-blue-400', 'bg-blue-50'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-blue-400', 'bg-blue-50'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('border-blue-400', 'bg-blue-50');
  const files = e.dataTransfer.files;
  if (files[0]) {
    document.getElementById('file-input').files = files;
    handleFileSelect(document.getElementById('file-input'));
  }
});
</script>
`
}
