export function getPreviewPage(settings: Record<string, string>): string {
  return `
<div style="min-height:100vh">
  <!-- Header -->
  <section style="position:relative;overflow:hidden;padding:72px 24px 60px;text-align:center">
    <div class="orb orb-purple" style="width:500px;height:500px;top:-200px;left:-100px;opacity:0.5"></div>
    <div class="orb orb-cyan" style="width:400px;height:400px;bottom:-100px;right:-80px;opacity:0.4"></div>
    <div class="bg-grid" style="position:absolute;inset:0;opacity:0.3"></div>
    <div style="position:relative;z-index:1">
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(191,0,255,0.1);border:1px solid rgba(191,0,255,0.3);color:#d87fff;padding:8px 18px;border-radius:50px;font-size:13px;font-weight:600;margin-bottom:20px">
        <i class="fas fa-cube"></i>Three.js Powered 3D Viewer
      </div>
      <h1 class="font-display" style="font-size:clamp(26px,4vw,52px);font-weight:900;color:#fff;margin-bottom:16px">Interactive 3D Preview Tool</h1>
      <p style="color:var(--text-secondary);font-size:16px;max-width:580px;margin:0 auto;line-height:1.7">Upload your image and see it mapped onto a rotatable 3D object. Drag to spin it on all axes, scroll to zoom, and choose your material finish.</p>
    </div>
  </section>

  <!-- Main Panel -->
  <div style="max-width:1200px;margin:0 auto;padding:0 24px 80px">
    <div style="display:grid;grid-template-columns:1fr;gap:24px" id="preview-layout">
      
      <!-- Left: Controls -->
      <div style="display:flex;flex-direction:column;gap:20px">

        <!-- Upload -->
        <div class="glass-card" style="border-radius:24px;padding:24px">
          <h2 style="font-size:15px;font-weight:700;color:#fff;margin-bottom:16px;display:flex;align-items:center;gap:8px">
            <i class="fas fa-upload" style="color:var(--neon-cyan)"></i>Upload Your Image
          </h2>
          <div id="dropzone" onclick="document.getElementById('file-input').click()"
               style="border:2px dashed rgba(0,245,255,0.2);border-radius:16px;padding:28px;text-align:center;cursor:pointer;transition:all 0.3s;background:rgba(0,245,255,0.02)"
               ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)" ondrop="handleDrop(event)"
               onmouseover="this.style.borderColor='rgba(0,245,255,0.5)';this.style.background='rgba(0,245,255,0.04)'"
               onmouseout="if(!selectedFile){this.style.borderColor='rgba(0,245,255,0.2)';this.style.background='rgba(0,245,255,0.02)'}">
            <div id="upload-placeholder">
              <div style="width:56px;height:56px;background:rgba(0,245,255,0.08);border:1px solid rgba(0,245,255,0.2);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
                <i class="fas fa-cloud-upload-alt" style="color:var(--neon-cyan);font-size:22px;filter:drop-shadow(0 0 8px var(--neon-cyan))"></i>
              </div>
              <p style="font-weight:600;color:#fff;font-size:14px">Click or drag to upload</p>
              <p style="font-size:12px;color:var(--text-muted);margin-top:4px">JPG, PNG, GIF, WebP – up to 10MB</p>
            </div>
            <div id="upload-preview" style="display:none">
              <img id="preview-thumbnail" style="max-height:120px;border-radius:12px;border:1px solid rgba(0,245,255,0.2);margin:0 auto;display:block;margin-bottom:10px" alt="Uploaded">
              <p style="font-size:12px;color:var(--text-secondary)" id="upload-filename">File ready</p>
              <button onclick="resetUpload(event)" style="margin-top:8px;background:none;border:none;cursor:pointer;color:#ff5555;font-size:12px;font-family:inherit">
                <i class="fas fa-times mr-1"></i>Remove
              </button>
            </div>
          </div>
          <input type="file" id="file-input" accept="image/*" class="hidden" style="display:none" onchange="handleFileSelect(this)">
        </div>

        <!-- 3D Shape & Options -->
        <div class="glass-card" style="border-radius:24px;padding:24px">
          <h2 style="font-size:15px;font-weight:700;color:#fff;margin-bottom:20px;display:flex;align-items:center;gap:8px">
            <i class="fas fa-sliders-h" style="color:var(--neon-purple)"></i>Print Options
          </h2>

          <!-- Shape selector -->
          <div style="margin-bottom:20px">
            <label style="display:block;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px">3D Shape</label>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
              ${[
                { value:'box', label:'Box', icon:'fa-cube' },
                { value:'sphere', label:'Sphere', icon:'fa-circle' },
                { value:'cylinder', label:'Cylinder', icon:'fa-database' },
                { value:'torus', label:'Ring', icon:'fa-ring' },
                { value:'cone', label:'Cone', icon:'fa-play' },
                { value:'dodecahedron', label:'Crystal', icon:'fa-gem' },
              ].map((s, i) => `
              <label style="cursor:pointer">
                <input type="radio" name="shape" value="${s.value}" ${s.value === 'box' ? 'checked' : ''} style="display:none" onchange="updateShape('${s.value}')">
                <div class="shape-card" id="shape-${s.value}" style="border:1px solid ${s.value === 'box' ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.08)'};border-radius:12px;padding:10px 6px;text-align:center;transition:all 0.2s;background:${s.value === 'box' ? 'rgba(0,245,255,0.08)' : 'rgba(255,255,255,0.02)'}">
                  <i class="fas ${s.icon}" style="color:${s.value === 'box' ? 'var(--neon-cyan)' : 'var(--text-muted)'};font-size:16px;display:block;margin-bottom:4px;transition:color 0.2s"></i>
                  <span style="font-size:10px;font-weight:600;color:${s.value === 'box' ? '#fff' : 'var(--text-secondary)'};">${s.label}</span>
                </div>
              </label>`).join('')}
            </div>
          </div>

          <!-- Material -->
          <div style="margin-bottom:16px">
            <label style="display:block;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">Material</label>
            <select id="preview-material" onchange="updateMaterial()" class="dark-input" style="width:100%;padding:10px 14px;border-radius:12px;font-size:13px;font-family:inherit">
              <option value="PLA">PLA – Eco-friendly (Recommended)</option>
              <option value="ABS">ABS – High Strength</option>
              <option value="PETG">PETG – Flexible & Durable</option>
              <option value="Resin">Resin – Ultra Fine Detail</option>
              <option value="TPU">TPU – Rubber-like Flexible</option>
              <option value="Nylon">Nylon – Industrial Grade</option>
            </select>
          </div>

          <!-- Surface Finish -->
          <div style="margin-bottom:16px">
            <label style="display:block;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">Surface Finish</label>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
              ${[
                { value:'standard', label:'Standard', icon:'fa-cube' },
                { value:'metallic', label:'Metallic', icon:'fa-circle' },
                { value:'matte', label:'Matte', icon:'fa-square' },
                { value:'glossy', label:'Glossy', icon:'fa-star' },
              ].map(f => `
              <label style="cursor:pointer">
                <input type="radio" name="finish" value="${f.value}" ${f.value === 'standard' ? 'checked' : ''} style="display:none" onchange="updateFinish('${f.value}')">
                <div class="finish-card" id="finish-${f.value}" style="border:1px solid ${f.value === 'standard' ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.08)'};border-radius:10px;padding:8px;display:flex;align-items:center;gap:8px;transition:all 0.2s;background:${f.value === 'standard' ? 'rgba(0,245,255,0.06)' : 'transparent'}">
                  <i class="fas ${f.icon}" style="font-size:12px;color:${f.value === 'standard' ? 'var(--neon-cyan)' : 'var(--text-muted)'}"></i>
                  <span style="font-size:12px;font-weight:600;color:${f.value === 'standard' ? '#fff' : 'var(--text-secondary)'}">${f.label}</span>
                </div>
              </label>`).join('')}
            </div>
          </div>

          <!-- Color Tint -->
          <div style="margin-bottom:20px">
            <label style="display:block;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">Color Tint</label>
            <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:8px">
              ${[
                { name:'None', hex:'transparent' },
                { name:'White', hex:'#f8fafc' },
                { name:'Black', hex:'#1e293b' },
                { name:'Red', hex:'#dc2626' },
                { name:'Blue', hex:'#2563eb' },
                { name:'Cyan', hex:'#00f5ff' },
                { name:'Green', hex:'#16a34a' },
                { name:'Yellow', hex:'#ca8a04' },
                { name:'Orange', hex:'#ea580c' },
                { name:'Purple', hex:'#7c3aed' },
                { name:'Gold', hex:'#b45309' },
                { name:'Silver', hex:'#94a3b8' },
              ].map(c => `
              <button onclick="selectColor('${c.name}','${c.hex}',this)" title="${c.name}"
                      class="color-swatch" style="width:100%;aspect-ratio:1;border-radius:8px;border:2px solid ${c.name==='None'?'rgba(0,245,255,0.6)':'rgba(255,255,255,0.12)'};cursor:pointer;background:${c.hex==='transparent'?'linear-gradient(135deg,#1e293b,#334155)':c.hex};transition:all 0.2s;position:relative;overflow:hidden">
                ${c.name==='None'?'<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:var(--neon-cyan)">NONE</span>':''}
              </button>`).join('')}
            </div>
            <p style="font-size:12px;color:var(--text-muted)">Tint: <span id="selected-color-name" style="color:#fff;font-weight:600">None</span></p>
          </div>

          <!-- Email -->
          <div style="margin-bottom:16px">
            <label style="display:block;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">Email (optional)</label>
            <input type="email" id="preview-email" placeholder="For follow-up & quote"
                   class="dark-input" style="width:100%;padding:10px 14px;border-radius:12px;font-size:13px;font-family:inherit">
          </div>
          <div style="margin-bottom:20px">
            <label style="display:block;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">Notes</label>
            <textarea id="preview-notes" rows="3" placeholder="Size requirements, special features..."
                      class="dark-input" style="width:100%;padding:10px 14px;border-radius:12px;font-size:13px;resize:none;font-family:inherit"></textarea>
          </div>

          <button onclick="generatePreview()" id="generate-btn" class="btn-solid-cyan" style="width:100%;padding:14px;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer">
            <i class="fas fa-cube mr-2"></i>Generate 3D Preview
          </button>
        </div>
      </div>

      <!-- Right: 3D Viewer -->
      <div style="display:flex;flex-direction:column;gap:20px">
        <div class="glass-card" style="border-radius:24px;overflow:hidden">
          <!-- Viewer Header -->
          <div style="padding:18px 24px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
            <h2 style="font-size:15px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px">
              <i class="fas fa-eye" style="color:var(--neon-cyan)"></i>Interactive 3D Viewer
            </h2>
            <div style="display:flex;align-items:center;gap:8px">
              <span id="preview-status-badge" style="font-size:12px;color:var(--text-muted);background:rgba(255,255,255,0.04);padding:4px 12px;border-radius:20px">Awaiting upload</span>
              <div style="display:flex;gap:4px">
                <button onclick="toggleAutoRotate()" id="autorotate-btn" title="Toggle Auto-rotate" style="width:32px;height:32px;background:rgba(0,245,255,0.08);border:1px solid rgba(0,245,255,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--neon-cyan);transition:all 0.2s">
                  <i class="fas fa-sync-alt" style="font-size:12px"></i>
                </button>
                <button onclick="resetCamera()" title="Reset Camera" style="width:32px;height:32px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);transition:all 0.2s"
                        onmouseover="this.style.borderColor='rgba(0,245,255,0.3)';this.style.color='var(--neon-cyan)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.color='var(--text-secondary)'">
                  <i class="fas fa-undo" style="font-size:12px"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 3D Canvas Container -->
          <div style="position:relative;background:linear-gradient(135deg,#02040a 0%,#060912 50%,#02040a 100%);min-height:420px">
            <!-- Grid floor effect -->
            <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(0,245,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.03) 1px,transparent 1px);background-size:30px 30px"></div>

            <!-- Empty State -->
            <div id="viewer-empty" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted);text-align:center;padding:40px">
              <div style="width:100px;height:100px;background:linear-gradient(135deg,rgba(0,245,255,0.06),rgba(191,0,255,0.04));border:1px solid rgba(0,245,255,0.12);border-radius:28px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;animation:float 3s ease-in-out infinite">
                <i class="fas fa-cube" style="color:rgba(0,245,255,0.4);font-size:44px;filter:drop-shadow(0 0 15px rgba(0,245,255,0.3))"></i>
              </div>
              <h3 style="font-size:18px;font-weight:700;color:var(--text-secondary);margin-bottom:8px">3D Viewer Ready</h3>
              <p style="font-size:13px;max-width:300px;line-height:1.6">Upload an image and click "Generate 3D Preview" to see your design mapped onto a 3D object you can rotate from any angle.</p>
            </div>

            <!-- Loading State -->
            <div id="viewer-loading" style="display:none;position:absolute;inset:0;flex-direction:column;align-items:center;justify-content:center;text-align:center">
              <div style="position:relative;width:80px;height:80px;margin-bottom:20px">
                <div style="position:absolute;inset:0;border:3px solid rgba(0,245,255,0.1);border-radius:50%"></div>
                <div style="position:absolute;inset:0;border:3px solid var(--neon-cyan);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></div>
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
                  <i class="fas fa-cube" style="color:var(--neon-cyan);font-size:24px"></i>
                </div>
              </div>
              <p style="font-size:15px;font-weight:600;color:#fff">Generating 3D Preview...</p>
              <p style="font-size:12px;color:var(--text-muted);margin-top:4px">Mapping texture to 3D geometry</p>
            </div>
            <style>@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style>

            <!-- THREE.js Canvas -->
            <canvas id="three-canvas" style="display:none;width:100%;height:420px;cursor:grab;touch-action:none"></canvas>

            <!-- Overlay controls hint -->
            <div id="viewer-hint" style="display:none;position:absolute;bottom:12px;left:0;right:0;text-align:center;pointer-events:none">
              <span style="font-size:11px;color:rgba(0,245,255,0.5);background:rgba(0,0,0,0.5);padding:4px 12px;border-radius:20px;backdrop-filter:blur(8px)">
                <i class="fas fa-mouse mr-1"></i>Drag to rotate · Scroll to zoom · Right-drag to pan
              </span>
            </div>
          </div>

          <!-- Info bar under canvas -->
          <div id="viewer-info-bar" style="display:none;padding:12px 20px;border-top:1px solid rgba(255,255,255,0.05);background:rgba(0,0,0,0.2);display:flex;align-items:center;gap:16px;flex-wrap:wrap">
            <span id="viewer-material-badge" style="font-size:12px;font-weight:700;background:rgba(0,245,255,0.1);border:1px solid rgba(0,245,255,0.25);color:var(--neon-cyan);padding:3px 10px;border-radius:20px">PLA</span>
            <span id="viewer-color-badge" style="font-size:12px;font-weight:700;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:3px 10px;border-radius:20px">No Tint</span>
            <span id="viewer-finish-badge" style="font-size:12px;font-weight:700;background:rgba(191,0,255,0.1);border:1px solid rgba(191,0,255,0.25);color:#d87fff;padding:3px 10px;border-radius:20px">Standard Finish</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div id="viewer-actions" style="display:none;display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
          <button onclick="savePreview()" class="btn-neon-cyan" style="padding:14px;border-radius:14px;font-size:13px;font-weight:700;cursor:pointer">
            <i class="fas fa-download mr-2"></i>Save Preview
          </button>
          <button onclick="orderCustomPrint()" class="btn-solid-fire" style="padding:14px;border-radius:14px;font-size:13px;font-weight:700;cursor:pointer">
            <i class="fas fa-shopping-cart mr-2"></i>Order This Print
          </button>
          <button onclick="sharePreview()" class="btn-neon-purple" style="padding:14px;border-radius:14px;font-size:13px;font-weight:700;cursor:pointer">
            <i class="fas fa-share-alt mr-2"></i>Share Preview
          </button>
          <a href="/contact" class="btn-neon-cyan" style="padding:14px;border-radius:14px;font-size:13px;font-weight:700;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px">
            <i class="fas fa-comments"></i>Get Quote
          </a>
        </div>

        <!-- Info Cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px">
          ${[
            { icon:'fa-cube', title:'FDM Printing', desc:'Layer-by-layer precision for durable parts', neon:'var(--neon-cyan)' },
            { icon:'fa-star', title:'Resin Printing', desc:'Ultra-fine details for miniatures & jewelry', neon:'var(--neon-purple)' },
            { icon:'fa-paint-brush', title:'Custom Colors', desc:'12+ colors or custom color matching', neon:'var(--neon-orange)' },
          ].map(i => `
          <div class="glass-card" style="border-radius:16px;padding:18px;text-align:center">
            <div style="width:44px;height:44px;background:rgba(0,245,255,0.06);border:1px solid rgba(0,245,255,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
              <i class="fas ${i.icon}" style="color:${i.neon};filter:drop-shadow(0 0 6px ${i.neon})"></i>
            </div>
            <h4 style="font-weight:700;color:#fff;font-size:13px;margin-bottom:6px">${i.title}</h4>
            <p style="font-size:12px;color:var(--text-secondary);line-height:1.5">${i.desc}</p>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
@media(min-width:900px) { #preview-layout { grid-template-columns: 360px 1fr !important; } }
</style>

<!-- Load Three.js from CDN (ES module shim via importmap) -->
<script async src="https://unpkg.com/es-module-shims@1.8.0/dist/es-module-shims.js"></script>
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js"
  }
}
</script>
<script type="module">
import * as THREE from 'three';
window.THREE = THREE;
</script>
<script>
// Ensure THREE is available before any user interaction
window.__threeReady = new Promise(resolve => {
  const check = () => { if(window.THREE) resolve(); else setTimeout(check, 50); };
  check();
});
</script>

<script>
// ═══════════════════════════════════════════════════════════
// State
// ═══════════════════════════════════════════════════════════
let selectedFile = null;
let selectedColor = { name: 'None', hex: 'transparent' };
let selectedShape = 'box';
let selectedFinish = 'standard';
let previewImageUrl = null;
let previewId = null;
let autoRotate = true;

// Three.js state
let scene, camera, renderer, mesh, animId;
let isPointerDown = false, isRightDown = false;
let lastX = 0, lastY = 0;
let rotX = 0.3, rotY = 0.5;
let zoomLevel = 3.5;
let panX = 0, panY = 0;
let targetRotX = 0.3, targetRotY = 0.5;

// ═══════════════════════════════════════════════════════════
// Upload Handling
// ═══════════════════════════════════════════════════════════
function handleFileSelect(input) {
  const file = input.files[0];
  if (!file) return;
  selectedFile = file;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('preview-thumbnail').src = e.target.result;
    document.getElementById('upload-filename').textContent = file.name + ' (' + (file.size/1024).toFixed(0) + ' KB)';
    document.getElementById('upload-placeholder').style.display = 'none';
    document.getElementById('upload-preview').style.display = 'block';
    const dz = document.getElementById('dropzone');
    dz.style.borderColor = 'rgba(0,245,255,0.5)';
    dz.style.background = 'rgba(0,245,255,0.04)';
  };
  reader.readAsDataURL(file);
}
function handleDragOver(e) {
  e.preventDefault();
  const dz = document.getElementById('dropzone');
  dz.style.borderColor = 'rgba(0,245,255,0.7)';
  dz.style.background = 'rgba(0,245,255,0.06)';
}
function handleDragLeave(e) {
  if (!selectedFile) {
    const dz = document.getElementById('dropzone');
    dz.style.borderColor = 'rgba(0,245,255,0.2)';
    dz.style.background = 'rgba(0,245,255,0.02)';
  }
}
function handleDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  if (files[0]) {
    document.getElementById('file-input').files = files;
    handleFileSelect(document.getElementById('file-input'));
  }
}
function resetUpload(e) {
  e.stopPropagation();
  selectedFile = null;
  document.getElementById('file-input').value = '';
  document.getElementById('upload-placeholder').style.display = 'block';
  document.getElementById('upload-preview').style.display = 'none';
  const dz = document.getElementById('dropzone');
  dz.style.borderColor = 'rgba(0,245,255,0.2)';
  dz.style.background = 'rgba(0,245,255,0.02)';
}

// ═══════════════════════════════════════════════════════════
// Shape / Material / Finish / Color UI
// ═══════════════════════════════════════════════════════════
function updateShape(shape) {
  selectedShape = shape;
  document.querySelectorAll('.shape-card').forEach(c => {
    c.style.borderColor = 'rgba(255,255,255,0.08)';
    c.style.background = 'rgba(255,255,255,0.02)';
    c.querySelector('i').style.color = 'var(--text-muted)';
    c.querySelector('span').style.color = 'var(--text-secondary)';
  });
  const active = document.getElementById('shape-' + shape);
  if (active) {
    active.style.borderColor = 'var(--neon-cyan)';
    active.style.background = 'rgba(0,245,255,0.08)';
    active.querySelector('i').style.color = 'var(--neon-cyan)';
    active.querySelector('span').style.color = '#fff';
  }
  if (previewImageUrl) rebuildMesh();
}
function updateMaterial() {
  if (previewImageUrl) updateMeshMaterial();
  const mat = document.getElementById('preview-material').value;
  document.getElementById('viewer-material-badge').textContent = mat;
}
function updateFinish(finish) {
  selectedFinish = finish;
  document.querySelectorAll('.finish-card').forEach(c => {
    c.style.borderColor = 'rgba(255,255,255,0.08)';
    c.style.background = 'transparent';
    c.querySelector('i').style.color = 'var(--text-muted)';
    c.querySelector('span').style.color = 'var(--text-secondary)';
  });
  const active = document.getElementById('finish-' + finish);
  if (active) {
    active.style.borderColor = 'var(--neon-cyan)';
    active.style.background = 'rgba(0,245,255,0.06)';
    active.querySelector('i').style.color = 'var(--neon-cyan)';
    active.querySelector('span').style.color = '#fff';
  }
  const labels = { standard:'Standard Finish', metallic:'Metallic Finish', matte:'Matte Finish', glossy:'Glossy Finish' };
  document.getElementById('viewer-finish-badge').textContent = labels[finish] || finish;
  if (previewImageUrl) updateMeshMaterial();
}
function selectColor(name, hex, btn) {
  selectedColor = { name, hex };
  document.getElementById('selected-color-name').textContent = name;
  document.querySelectorAll('.color-swatch').forEach(s => s.style.borderColor = 'rgba(255,255,255,0.12)');
  btn.style.borderColor = 'var(--neon-cyan)';
  document.getElementById('viewer-color-badge').textContent = name === 'None' ? 'No Tint' : name + ' Tint';
  if (previewImageUrl) updateMeshMaterial();
}

// ═══════════════════════════════════════════════════════════
// Generate Preview & Three.js Initialization
// ═══════════════════════════════════════════════════════════
async function generatePreview() {
  await window.__threeReady;
  if (!selectedFile) {
    showToast('Please upload an image first!', 'exclamation-circle', 'var(--neon-orange)');
    return;
  }
  // Show loading
  document.getElementById('viewer-empty').style.display = 'none';
  document.getElementById('viewer-loading').style.display = 'flex';
  const canvas = document.getElementById('three-canvas');
  canvas.style.display = 'none';
  document.getElementById('preview-status-badge').textContent = 'Processing...';
  document.getElementById('preview-status-badge').style.cssText = 'font-size:12px;color:var(--neon-cyan);background:rgba(0,245,255,0.08);padding:4px 12px;border-radius:20px;animation:pulse-glow 1s infinite';

  const formData = new FormData();
  formData.append('image', selectedFile);
  formData.append('style', selectedFinish);
  formData.append('material', document.getElementById('preview-material').value);
  formData.append('color', selectedColor.name);
  formData.append('notes', document.getElementById('preview-notes').value);
  formData.append('email', document.getElementById('preview-email').value);
  formData.append('session_id', getSessionId());

  try {
    const res = await axios.post('/api/preview', formData);
    if (res.data.success) {
      previewId = res.data.data.preview_id;
      previewImageUrl = res.data.data.uploaded_image;
      document.getElementById('viewer-loading').style.display = 'none';
      initThreeJS(previewImageUrl);
    }
  } catch(err) {
    document.getElementById('viewer-loading').style.display = 'none';
    document.getElementById('viewer-empty').style.display = 'flex';
    document.getElementById('preview-status-badge').textContent = 'Error';
    document.getElementById('preview-status-badge').style.cssText = 'font-size:12px;color:#ff5555;background:rgba(255,80,80,0.08);padding:4px 12px;border-radius:20px';
    showToast('Error generating preview. Try again.', 'exclamation-circle', '#ff5555');
  }
}

// ═══════════════════════════════════════════════════════════
// Three.js Engine
// ═══════════════════════════════════════════════════════════
function initThreeJS(imageUrl) {
  const canvas = document.getElementById('three-canvas');

  // Destroy previous instance
  if (animId) cancelAnimationFrame(animId);
  if (renderer) { renderer.dispose(); }
  if (scene) {
    if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); if (mesh.material.map) mesh.material.map.dispose(); mesh.material.dispose(); }
  }

  // Scene
  scene = new THREE.Scene();
  scene.background = null;

  // Camera
  const W = canvas.offsetWidth || 600;
  const H = canvas.offsetHeight || 420;
  camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 1000);
  camera.position.set(0, 0, zoomLevel);
  camera.position.x = panX;
  camera.position.y = panY;

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(5, 8, 5);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x00f5ff, 0.3);
  fillLight.position.set(-5, -2, -3);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xbf00ff, 0.5, 20);
  rimLight.position.set(-3, 3, -3);
  scene.add(rimLight);

  // Load texture and build mesh
  const loader = new THREE.TextureLoader();
  loader.load(imageUrl, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    createMeshWithTexture(texture);
    showViewer();
  }, undefined, () => {
    // Fallback: create mesh without texture
    createMeshWithTexture(null);
    showViewer();
  });
}

function buildGeometry(shape) {
  switch(shape) {
    case 'sphere':      return new THREE.SphereGeometry(1.2, 64, 64);
    case 'cylinder':    return new THREE.CylinderGeometry(0.9, 0.9, 1.8, 64);
    case 'torus':       return new THREE.TorusGeometry(1, 0.4, 32, 100);
    case 'cone':        return new THREE.ConeGeometry(1, 2, 64);
    case 'dodecahedron':return new THREE.DodecahedronGeometry(1.2, 0);
    default:            return new THREE.BoxGeometry(1.8, 1.8, 1.8, 4, 4, 4);
  }
}

function buildMaterialProps(texture) {
  const mat = document.getElementById('preview-material').value;
  const tintHex = selectedColor.hex !== 'transparent' ? selectedColor.hex : null;
  const tintColor = tintHex ? new THREE.Color(tintHex) : new THREE.Color(0xffffff);

  let roughness, metalness, envIntensity;
  switch(selectedFinish) {
    case 'metallic': roughness=0.2; metalness=0.9; envIntensity=1.5; break;
    case 'matte':    roughness=0.95; metalness=0.0; envIntensity=0.3; break;
    case 'glossy':   roughness=0.05; metalness=0.1; envIntensity=2.0; break;
    default:         roughness=0.6; metalness=0.1; envIntensity=0.8;
  }

  // Material-specific overrides
  if (mat === 'Resin') { roughness *= 0.5; metalness = Math.max(metalness, 0.15); }
  if (mat === 'ABS') { roughness = Math.max(roughness, 0.5); }
  if (mat === 'TPU') { roughness = 0.8; }

  const params = {
    map: texture || null,
    color: tintColor,
    roughness,
    metalness,
    envMapIntensity: envIntensity,
  };
  return new THREE.MeshStandardMaterial(params);
}

function createMeshWithTexture(texture) {
  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    if (mesh.material.map) mesh.material.map.dispose();
    mesh.material.dispose();
  }
  const geometry = buildGeometry(selectedShape);
  const material = buildMaterialProps(texture);
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.rotation.x = rotX;
  mesh.rotation.y = rotY;
  scene.add(mesh);
}

function updateMeshMaterial() {
  if (!mesh || !previewImageUrl) return;
  const loader = new THREE.TextureLoader();
  loader.load(previewImageUrl, texture => {
    if (mesh.material.map) mesh.material.map.dispose();
    mesh.material.dispose();
    mesh.material = buildMaterialProps(texture);
    const mat = document.getElementById('preview-material').value;
    document.getElementById('viewer-material-badge').textContent = mat;
  });
}

function rebuildMesh() {
  if (!scene || !previewImageUrl) return;
  const loader = new THREE.TextureLoader();
  loader.load(previewImageUrl, texture => {
    createMeshWithTexture(texture);
  }, undefined, () => {
    createMeshWithTexture(null);
  });
}

function showViewer() {
  const canvas = document.getElementById('three-canvas');
  canvas.style.display = 'block';
  document.getElementById('viewer-hint').style.display = 'block';
  document.getElementById('viewer-info-bar').style.display = 'flex';
  document.getElementById('viewer-actions').style.display = 'grid';

  const mat = document.getElementById('preview-material').value;
  document.getElementById('viewer-material-badge').textContent = mat;
  document.getElementById('viewer-color-badge').textContent = selectedColor.name === 'None' ? 'No Tint' : selectedColor.name + ' Tint';
  const finishLabels = { standard:'Standard Finish', metallic:'Metallic Finish', matte:'Matte Finish', glossy:'Glossy Finish' };
  document.getElementById('viewer-finish-badge').textContent = finishLabels[selectedFinish] || selectedFinish;
  document.getElementById('preview-status-badge').textContent = '✓ 3D Ready';
  document.getElementById('preview-status-badge').style.cssText = 'font-size:12px;color:var(--neon-green);background:rgba(0,255,136,0.08);padding:4px 12px;border-radius:20px;font-weight:600';

  animate();
}

// ═══════════════════════════════════════════════════════════
// Animation Loop
// ═══════════════════════════════════════════════════════════
function animate() {
  animId = requestAnimationFrame(animate);
  if (autoRotate && !isPointerDown) {
    targetRotY += 0.005;
  }
  // Smooth interpolation
  if (mesh) {
    mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.1;
    mesh.rotation.y += (targetRotY - mesh.rotation.y) * 0.1;
  }
  if (camera) {
    camera.position.set(panX, panY, zoomLevel);
    camera.lookAt(panX, panY, 0);
  }
  if (renderer && scene && camera) renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════════════════
// Pointer / Mouse / Touch Controls
// ═══════════════════════════════════════════════════════════
function setupControls() {
  const canvas = document.getElementById('three-canvas');

  // Mouse
  canvas.addEventListener('mousedown', e => {
    isPointerDown = true;
    isRightDown = e.button === 2;
    lastX = e.clientX; lastY = e.clientY;
    canvas.style.cursor = 'grabbing';
    e.preventDefault();
  });
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('mouseup', () => { isPointerDown = false; isRightDown = false; document.getElementById('three-canvas').style.cursor = 'grab'; });
  window.addEventListener('mousemove', e => {
    if (!isPointerDown) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    if (isRightDown) {
      panX -= dx * 0.008;
      panY += dy * 0.008;
    } else {
      targetRotY += dx * 0.012;
      targetRotX += dy * 0.012;
      // Clamp vertical rotation
      targetRotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, targetRotX));
    }
  });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    zoomLevel += e.deltaY * 0.005;
    zoomLevel = Math.max(1.5, Math.min(8, zoomLevel));
  }, { passive: false });

  // Touch
  let touches = [];
  let lastTouchDist = 0;
  canvas.addEventListener('touchstart', e => {
    touches = Array.from(e.touches);
    if (touches.length === 1) {
      isPointerDown = true;
      lastX = touches[0].clientX; lastY = touches[0].clientY;
    } else if (touches.length === 2) {
      lastTouchDist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    }
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { isPointerDown = false; touches = []; });
  canvas.addEventListener('touchmove', e => {
    if (e.touches.length === 1 && isPointerDown) {
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
      targetRotY += dx * 0.012;
      targetRotX += dy * 0.012;
      targetRotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, targetRotX));
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      zoomLevel -= (dist - lastTouchDist) * 0.01;
      zoomLevel = Math.max(1.5, Math.min(8, zoomLevel));
      lastTouchDist = dist;
    }
    e.preventDefault();
  }, { passive: false });
}

// ═══════════════════════════════════════════════════════════
// Resize Handler
// ═══════════════════════════════════════════════════════════
window.addEventListener('resize', () => {
  if (!renderer || !camera) return;
  const canvas = document.getElementById('three-canvas');
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  camera.aspect = W/H;
  camera.updateProjectionMatrix();
  renderer.setSize(W, H);
});

// ═══════════════════════════════════════════════════════════
// Camera Controls
// ═══════════════════════════════════════════════════════════
function resetCamera() {
  targetRotX = 0.3; targetRotY = 0.5;
  zoomLevel = 3.5; panX = 0; panY = 0;
}
function toggleAutoRotate() {
  autoRotate = !autoRotate;
  const btn = document.getElementById('autorotate-btn');
  if (autoRotate) {
    btn.style.background = 'rgba(0,245,255,0.12)';
    btn.style.borderColor = 'rgba(0,245,255,0.4)';
    btn.querySelector('i').style.animation = 'spin 2s linear infinite';
  } else {
    btn.style.background = 'rgba(255,255,255,0.04)';
    btn.style.borderColor = 'rgba(255,255,255,0.08)';
    btn.querySelector('i').style.animation = 'none';
  }
}

// ═══════════════════════════════════════════════════════════
// Action Buttons
// ═══════════════════════════════════════════════════════════
function savePreview() {
  if (!renderer) return;
  renderer.render(scene, camera);
  const dataUrl = renderer.domElement.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = '3d-print-preview-' + Date.now() + '.png';
  a.click();
  showToast('Preview saved!', 'check-circle', 'var(--neon-green)');
}
function orderCustomPrint() {
  const mat = document.getElementById('preview-material').value;
  const customItem = {
    id: 'custom-' + Date.now(),
    name: 'Custom 3D Print – ' + mat + ' ' + selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1),
    price: 49.99, image: previewImageUrl || '', quantity: 1
  };
  addToCart(customItem.id, customItem.name, customItem.price, customItem.image);
  showToast('Custom print added to cart!', 'check-circle', 'var(--neon-green)');
  setTimeout(() => toggleCart(), 500);
}
function sharePreview() {
  if (navigator.share) {
    navigator.share({ title:'3D Print Preview', text:'Check out my 3D print preview from 3D Creations PR!', url: window.location.href });
  } else {
    navigator.clipboard?.writeText(window.location.href).then(() => showToast('Link copied!', 'check-circle', 'var(--neon-cyan)'));
  }
}

// ═══════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════
function getSessionId() {
  let sid = localStorage.getItem('3dp_session');
  if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('3dp_session', sid); }
  return sid;
}

// Initialize controls on load
setupControls();

// Auto-rotate btn default state
document.getElementById('autorotate-btn').querySelector('i').style.animation = 'spin 2s linear infinite';
</script>
`
}
