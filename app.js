const SoundEffects = {
  enabled: true,
  audioCtx: null,

  init() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
  },

  playBlip() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  },

  playPop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1050, this.audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch (e) {}
  },

  playFanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const start = this.audioCtx.currentTime + (idx * 0.08);
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.16);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(start);
        osc.stop(start + 0.16);
      });
    } catch (e) {}
  }
};

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

const AppState = {
  currentView: 'home',
  activeCategory: 'all',
  searchQuery: '',

  cart: [],

  customer: {
    nama: '',
    instagram: '',
    whatsapp: '',
    deadlineDate: '',
    deadlineTime: '23:59',
    priority: 'reguler',
    catatanTambahan: ''
  },

  activeSheetItem: null
};

const SERVICES_CATALOG = [
  {
    id: 'skripsi',
    category: 'skripsi',
    icon: '🎓',
    title: 'Joki Skripsi (Bab 1-5)',
    priceLabel: 'Mulai Rp 800.000',
    shortDesc: 'Manajemen / Kuantitatif & IT. Free bimbingan & revisi 7x!',
    badge: 'BEST SELLER',
    badgeColor: 'bg-red-500 text-white'
  },
  {
    id: 'website',
    category: 'website',
    icon: '💻',
    title: 'Joki Website (Tugas Kuliah / Lab)',
    priceLabel: '500rb - 1.5jt',
    shortDesc: 'Statis HTML/CSS atau Dinamis CRUD, DB & Machine Learning.',
    badge: 'KODING',
    badgeColor: 'bg-green-600 text-white'
  },
  {
    id: 'ppt',
    category: 'ppt',
    icon: '📊',
    title: 'Joki Buat PPT Presentasi',
    priceLabel: 'Mulai Rp 50.000',
    shortDesc: '10 lembar 50rb, lebih dari 10 dikenakan 7rb/lembar.',
    badge: 'ESTETIK',
    badgeColor: 'bg-yellow-400 text-black'
  },
  {
    id: 'rapihin',
    category: 'format',
    icon: '📑',
    title: 'Rapihin Skripsi (Template Kampus)',
    priceLabel: '70rb - 90rb',
    shortDesc: 'Margin, font, spasi, daftar isi/tabel/gambar otomatis.',
    badge: 'RAPIH',
    badgeColor: 'bg-blue-600 text-white'
  },
  {
    id: 'paper',
    category: 'format',
    icon: '📄',
    title: 'Mindahin Skripsi ke Paper',
    priceLabel: 'Rp 100.000',
    shortDesc: 'Konversi skripsi utuh menjadi format jurnal / SINTA siap submit.',
    badge: 'FLAT',
    badgeColor: 'bg-teal-600 text-white'
  },
  {
    id: 'makalah',
    category: 'makalah',
    icon: '📚',
    title: 'Bikinin Makalah Lengkap',
    priceLabel: '75rb - 100rb',
    shortDesc: '<= 100 lembar 75rb, > 100 lembar 100rb. Sumber referensi terpercaya.',
    badge: 'TUGAS',
    badgeColor: 'bg-purple-600 text-white'
  },
  {
    id: 'flyer',
    category: 'desain',
    icon: '🎨',
    title: 'Flyer & Infografis Standing Banner',
    priceLabel: 'Rp 100.000 / Desain',
    shortDesc: 'Ukuran standing banner (60x160cm), A4, atau poster resolusi tinggi.',
    badge: 'DESAIN',
    badgeColor: 'bg-pink-600 text-white'
  },
  {
    id: 'manipulasi',
    category: 'data',
    icon: '📈',
    title: 'Manipulasi & Olah Data Statistik',
    priceLabel: '75rb - 120rb',
    shortDesc: '0-100 sampel (75k), 101-300 sampel (120k). SPSS, SmartPLS, Excel.',
    badge: 'VALID',
    badgeColor: 'bg-amber-600 text-white'
  },
  {
    id: 'custom',
    category: 'desain',
    icon: '✨',
    title: 'Layanan Lain / Request Khusus',
    priceLabel: 'Konsultasi DM',
    shortDesc: 'Tugas ketik (5k/hlm), translate (10k/hlm), desain CV (15k), dll.',
    badge: 'CUSTOM',
    badgeColor: 'bg-gray-700 text-white'
  }
];

function switchView(targetView) {
  SoundEffects.playBlip();
  AppState.currentView = targetView;

  const views = ['home', 'menu', 'cart', 'faq'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === targetView) {
        el.classList.remove('hidden');
        el.classList.remove('view-animate-in');
        void el.offsetWidth;
        el.classList.add('view-animate-in');
        triggerAppleRevealsInView(targetView);
      } else {
        el.classList.add('hidden');
      }
    }
  });

  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.dataset.target === targetView) {
      tab.classList.add('active');
      const icon = tab.querySelector('span:first-child');
      if (icon) {
        icon.classList.remove('tab-bounce-pop');
        void icon.offsetWidth;
        icon.classList.add('tab-bounce-pop');
      }
    } else {
      tab.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (targetView === 'cart') {
    renderCartView();
  }
}

function triggerAppleRevealsInView(viewId) {
  const container = document.getElementById(`view-${viewId}`);
  if (!container) return;
  const reveals = container.querySelectorAll('.apple-reveal');
  reveals.forEach((el, idx) => {
    el.classList.remove('is-revealed');
    el.style.transitionDelay = `${Math.min(idx * 0.06, 0.45)}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('is-revealed');
      });
    });
  });
}

function initAppleScrollReveal() {
  if (typeof IntersectionObserver === 'undefined') {
    document.querySelectorAll('.apple-reveal').forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -25px 0px'
  });

  document.querySelectorAll('.apple-reveal').forEach(el => {
    observer.observe(el);
  });
}

function renderMenuCatalog() {
  const container = document.getElementById('menu-items-container');
  if (!container) return;

  const query = AppState.searchQuery.toLowerCase().trim();
  const category = AppState.activeCategory;

  const filtered = SERVICES_CATALOG.filter(item => {
    const matchCategory = (category === 'all' || item.category === category);
    const matchQuery = (
      item.title.toLowerCase().includes(query) ||
      item.shortDesc.toLowerCase().includes(query)
    );
    return matchCategory && matchQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-10 text-center text-xs text-gray-500">
        <div class="text-3xl mb-1">🔍</div>
        <div class="font-bold text-gray-800">Layanan Tidak Ditemukan</div>
        <p class="text-[11px] mt-0.5">Coba cari dengan kata kunci lain (misal: skripsi, ppt, web, spss).</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item, idx) => `
    <div class="menu-card apple-reveal is-revealed" style="transition-delay: ${idx * 0.05}s;" onclick="openItemSheet('${item.id}')">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-start gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-yellow-100 border border-black flex items-center justify-center text-xl flex-shrink-0 shadow-[1px_1px_0_#000]">
            ${item.icon}
          </div>
          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <h4 class="font-bold text-xs text-gray-900 leading-snug">${item.title}</h4>
              <span class="text-[9px] font-black px-1.5 py-0.2 rounded border border-black shadow-[0.5px_0.5px_0_#000] shimmer-badge ${item.badgeColor}">${item.badge}</span>
            </div>
            <p class="text-[11px] text-gray-500 mt-0.5 leading-tight">${item.shortDesc}</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
        <div class="font-black text-xs text-indigo-700">${item.priceLabel}</div>
        <button type="button" class="retro-btn retro-btn-yellow retro-btn-sm py-1 px-2.5 text-[11px] font-extrabold">
          + Atur & Pesan
        </button>
      </div>
    </div>
  `).join('');
}

function openItemSheet(serviceId) {
  SoundEffects.playPop();
  const service = SERVICES_CATALOG.find(s => s.id === serviceId);
  if (!service) return;

  AppState.activeSheetItem = {
    serviceId: service.id,
    serviceTitle: service.title,
    serviceIcon: service.icon,
    skripsiJurusan: 'manajemen',
    skripsiPkg: 'bab_1_5_manip',
    skripsiExtraRev: 0,
    websiteType: 'statis',
    websiteStaticTier: 'static_medium',
    websiteDynamicTier: 'dynamic_medium',
    pptSlides: 10,
    rapihinPages: 80,
    makalahPages: 30,
    flyerQty: 1,
    manipSamples: 80,
    customName: 'Tugas Khusus',
    customBudget: 50000,
    notes: ''
  };

  document.getElementById('sheet-item-cat').textContent = service.category.toUpperCase();
  document.getElementById('sheet-item-name').textContent = service.title;
  document.getElementById('sheet-item-desc').textContent = service.shortDesc;
  document.getElementById('sheet-item-notes').value = '';

  renderSheetDynamicOptions();
  updateSheetPricePreview();

  const sheet = document.getElementById('itemSheet');
  if (sheet) sheet.classList.add('active');
}

function renderSheetDynamicOptions() {
  const container = document.getElementById('sheet-dynamic-options');
  if (!container || !AppState.activeSheetItem) return;

  const id = AppState.activeSheetItem.serviceId;
  let html = '';

  if (id === 'skripsi') {
    html = `
      <div class="space-y-3">
        <div>
          <label class="block text-[11px] font-bold text-gray-700 mb-1">JURUSAN / KATEGORI:</label>
          <div class="grid grid-cols-2 gap-1.5">
            <label class="radio-card text-xs flex items-center gap-1.5 p-2">
              <input type="radio" name="sheet-skripsi-jurusan" value="manajemen" checked onchange="onSkripsiJurusanChange(this.value)" class="accent-indigo-600">
              <span class="font-bold">📊 Manajemen / Kuantitatif</span>
            </label>
            <label class="radio-card text-xs flex items-center gap-1.5 p-2">
              <input type="radio" name="sheet-skripsi-jurusan" value="it" onchange="onSkripsiJurusanChange(this.value)" class="accent-indigo-600">
              <span class="font-bold">💻 IT / Komputer</span>
            </label>
          </div>
        </div>

        <div id="sheet-skripsi-mgmt-box" class="space-y-1.5">
          <label class="block text-[11px] font-bold text-gray-700">PILIHAN PAKET MANAJEMEN:</label>
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-skripsi-pkg" value="bab_1_3" onchange="onSkripsiPkgChange(this.value)" class="accent-indigo-600">
                <span>Bab 1 - 3 (Proposal)</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 800.000</span>
            </div>
          </label>
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-skripsi-pkg" value="bab_4_5_cust" onchange="onSkripsiPkgChange(this.value)" class="accent-indigo-600">
                <span>Bab 4 - 5 (Data Sendiri)</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 800.000</span>
            </div>
          </label>
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-skripsi-pkg" value="bab_4_5_manip" onchange="onSkripsiPkgChange(this.value)" class="accent-indigo-600">
                <span class="font-semibold">Bab 4 - 5 (Data Manipulasi Jokify)</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 1.000.000</span>
            </div>
            <div class="text-[10px] text-amber-800 font-semibold mt-1 ml-5 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 flex items-center gap-1">
              <span>💡</span>
              <span>Khusus jika Bab 1–3 beres sendiri. Jika diorder bareng Bab 1–3, otomatis berlaku Paket Lengkap (Rp 2.000.000).</span>
            </div>
          </label>
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-skripsi-pkg" value="bab_1_5_cust" onchange="onSkripsiPkgChange(this.value)" class="accent-indigo-600">
                <span>Bab 1 - 5 Lengkap (Data Sendiri)</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 1.500.000</span>
            </div>
          </label>
          <label class="radio-card block p-2 bg-yellow-50 border-2 border-yellow-400">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-skripsi-pkg" value="bab_1_5_manip" checked onchange="onSkripsiPkgChange(this.value)" class="accent-indigo-600">
                <span class="font-bold text-gray-900">Bab 1 - 5 Lengkap + Data Manipulasi ★</span>
              </div>
              <span class="font-black text-indigo-700">Rp 2.000.000</span>
            </div>
            <div class="text-[10px] text-green-800 font-semibold mt-1 ml-5">
              ✨ Solusi all-in-one tuntas siap sidang + olah data manipulasi akurat & lolos uji.
            </div>
          </label>
        </div>

        <div id="sheet-skripsi-it-box" class="space-y-1.5 hidden">
          <label class="block text-[11px] font-bold text-gray-700">PILIHAN PAKET SKRIPSI IT:</label>
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-skripsi-pkg-it" value="it_skripsi_only" checked onchange="onSkripsiPkgChange(this.value)" class="accent-indigo-600">
                <span>Bab 1 - 5 Skripsi Saja</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 1.600.000</span>
            </div>
          </label>
          <label class="radio-card block p-2 bg-indigo-50">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-skripsi-pkg-it" value="it_skripsi_ml" onchange="onSkripsiPkgChange(this.value)" class="accent-indigo-600">
                <span class="font-bold">Bab 1 - 5 + Website Machine Learning ★</span>
              </div>
              <span class="font-black text-indigo-700">Rp 2.500.000</span>
            </div>
          </label>
        </div>

        <!-- Revisi Perk Callout -->
        <div class="bg-green-50 border-2 border-green-400 rounded-lg p-2.5 text-xs text-green-950 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 font-bold">
              <span>🎁</span>
              <span>Free Bimbingan & Revisi 7x</span>
            </div>
            <span class="bg-green-200 text-green-900 text-[10px] font-black px-1.5 py-0.5 rounded border border-green-400">OTOMATIS FREE</span>
          </div>

          <div class="border-t border-green-200 pt-2">
            <div class="flex items-center justify-between gap-2">
              <div>
                <div class="font-bold text-gray-800 text-[11px]">Tambah Revisi Ekstra:</div>
                <div class="text-[10px] text-gray-500 italic mt-0.5 leading-tight">
                  *Hanya ketik revisi ekstra jika butuh di atas 7x (misal ketik 1 untuk +1 revisi). <strong>Jangan jumlahkan 7 dengan ekstra kamu.</strong>
                </div>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                <input type="number" min="0" max="50" value="${AppState.activeSheetItem.skripsiExtraRev || 0}" id="sheet-extra-rev" oninput="onExtraRevChange(this.value)" placeholder="0" class="w-14 text-center border-2 border-black rounded py-1 text-xs font-bold bg-white">
                <span class="text-[11px] font-bold text-gray-700">x (@5k)</span>
              </div>
            </div>

            <div id="sheet-extra-rev-live" class="text-[10px] font-bold text-indigo-700 mt-1.5 ${AppState.activeSheetItem.skripsiExtraRev > 0 ? '' : 'hidden'}">
              Total Revisi: <strong>Free 7x</strong> + <span id="sheet-extra-rev-val">${AppState.activeSheetItem.skripsiExtraRev || 0}</span>x Revisi Ekstra (+${formatRupiah((AppState.activeSheetItem.skripsiExtraRev || 0) * 5000)})
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (id === 'website') {
    html = `
      <div class="space-y-3">
        <div>
          <label class="block text-[11px] font-bold text-gray-700 mb-1">TIPE WEBSITE:</label>
          <div class="grid grid-cols-2 gap-1.5">
            <label class="radio-card text-xs flex items-center gap-1.5 p-2">
              <input type="radio" name="sheet-web-type" value="statis" checked onchange="onWebTypeChange(this.value)" class="accent-indigo-600">
              <span class="font-bold">📄 Statis Biasa</span>
            </label>
            <label class="radio-card text-xs flex items-center gap-1.5 p-2">
              <input type="radio" name="sheet-web-type" value="dinamis" onchange="onWebTypeChange(this.value)" class="accent-indigo-600">
              <span class="font-bold">⚙️ Dinamis & Logika</span>
            </label>
          </div>
        </div>

        <div id="sheet-web-static-box" class="space-y-1.5">
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-web-tier" value="static_simple" onchange="onWebTierChange(this.value)" class="accent-indigo-600">
                <span>Statis 1-2 Halaman Sederhana</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 500.000</span>
            </div>
          </label>
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-web-tier" value="static_medium" checked onchange="onWebTierChange(this.value)" class="accent-indigo-600">
                <span>Statis 3-5 Halaman Responsive</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 650.000</span>
            </div>
          </label>
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-web-tier" value="static_complete" onchange="onWebTierChange(this.value)" class="accent-indigo-600">
                <span>Statis 5+ Halaman Interaktif JS</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 800.000</span>
            </div>
          </label>
        </div>

        <div id="sheet-web-dynamic-box" class="space-y-1.5 hidden">
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-web-tier-dyn" value="dynamic_basic" onchange="onWebTierChange(this.value)" class="accent-indigo-600">
                <span>Dinamis Standard: CRUD & DB</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 1.000.000</span>
            </div>
          </label>
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-web-tier-dyn" value="dynamic_medium" checked onchange="onWebTierChange(this.value)" class="accent-indigo-600">
                <span>Dinamis Intermediate: Fullstack & Auth</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 1.250.000</span>
            </div>
          </label>
          <label class="radio-card block p-2">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-1.5">
                <input type="radio" name="sheet-web-tier-dyn" value="dynamic_heavy" onchange="onWebTierChange(this.value)" class="accent-indigo-600">
                <span>Dinamis Kompleks & Logika Berat</span>
              </div>
              <span class="font-bold text-indigo-700">Rp 1.500.000</span>
            </div>
          </label>
        </div>
      </div>
    `;
  } else if (id === 'ppt') {
    html = `
      <div class="space-y-3">
        <div class="bg-yellow-50 border border-yellow-300 p-2 rounded text-[11px] text-gray-800">
          <strong>Ketentuan:</strong> &le;10 lembar <strong>Rp 50.000</strong>. Lebih dari 10 lembar dikenakan <strong>Rp 7.000/lembar</strong> berikutnya.
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-[11px] font-bold text-gray-700">JUMLAH LEMBAR / SLIDE:</label>
            <div class="flex items-center gap-1">
              <button type="button" onclick="changePptSlide(-1)" class="w-6 h-6 border border-black rounded bg-gray-200 font-bold text-xs">-</button>
              <input type="number" id="sheet-ppt-input" min="1" max="100" value="10" oninput="onPptSlideInput(this.value)" class="w-14 text-center border border-black rounded py-0.5 text-xs font-bold">
              <button type="button" onclick="changePptSlide(1)" class="w-6 h-6 border border-black rounded bg-gray-200 font-bold text-xs">+</button>
              <span class="text-xs font-bold ml-1">Lbr</span>
            </div>
          </div>
          <input type="range" id="sheet-ppt-range" min="1" max="50" value="10" oninput="onPptSlideInput(this.value)" class="w-full accent-indigo-600">
          <div id="sheet-ppt-calc-note" class="text-[10px] text-gray-500 font-mono mt-0.5">
            10 lembar dasar = Rp 50.000
          </div>
        </div>
      </div>
    `;
  } else if (id === 'rapihin') {
    html = `
      <div class="space-y-3">
        <div class="bg-blue-50 border border-blue-300 p-2 rounded text-[11px] text-gray-800">
          <strong>Ketentuan:</strong> &lt;100 lbr (70k) | 101-150 lbr (80k) | 151-200 lbr (90k) | &gt;200 lbr (penyesuaian).
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-[11px] font-bold text-gray-700">JUMLAH HALAMAN SKRIPSI:</label>
            <div class="flex items-center gap-1">
              <input type="number" id="sheet-rapihin-input" min="1" max="500" value="80" oninput="onRapihinPageInput(this.value)" class="w-16 text-center border border-black rounded py-0.5 text-xs font-bold">
              <span class="text-xs font-bold ml-1">Lbr</span>
            </div>
          </div>
          <input type="range" id="sheet-rapihin-range" min="10" max="300" value="80" oninput="onRapihinPageInput(this.value)" class="w-full accent-indigo-600">
          <div id="sheet-rapihin-tier" class="text-[11px] font-bold text-indigo-700 mt-1">
            Tier: &lt; 100 Lembar (Rp 70.000)
          </div>
        </div>
      </div>
    `;
  } else if (id === 'paper') {
    html = `
      <div class="p-3 bg-green-50 border border-green-300 rounded text-xs">
        <div class="font-bold text-green-900">Konversi Skripsi ke Paper Jurnal</div>
        <div class="text-[11px] text-gray-600 mt-0.5">Format SINTA / IEEE / template jurnal kampus. Flat <strong>Rp 100.000</strong>.</div>
      </div>
    `;
  } else if (id === 'makalah') {
    html = `
      <div class="space-y-3">
        <div class="bg-purple-50 border border-purple-300 p-2 rounded text-[11px] text-gray-800">
          <strong>Ketentuan:</strong> &le;100 lembar: <strong>Rp 75.000</strong> | &gt;100 lembar: <strong>Rp 100.000</strong>.
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-[11px] font-bold text-gray-700">JUMLAH LEMBAR MAKALAH:</label>
            <input type="number" id="sheet-makalah-input" min="1" max="250" value="30" oninput="onMakalahInput(this.value)" class="w-16 text-center border border-black rounded py-0.5 text-xs font-bold">
          </div>
          <input type="range" id="sheet-makalah-range" min="5" max="150" value="30" oninput="onMakalahInput(this.value)" class="w-full accent-indigo-600">
          <div id="sheet-makalah-tier" class="text-[11px] font-bold text-indigo-700 mt-1">
            &le; 100 Lembar (Rp 75.000)
          </div>
        </div>
      </div>
    `;
  } else if (id === 'flyer') {
    html = `
      <div class="space-y-3">
        <div class="bg-pink-50 border border-pink-300 p-2 rounded text-[11px] text-gray-800">
          <strong>Tarif:</strong> Rp 100.000 / desain flyer atau standing banner (60x160cm).
        </div>
        <div class="flex justify-between items-center">
          <label class="text-[11px] font-bold text-gray-700">JUMLAH DESAIN:</label>
          <div class="flex items-center gap-1.5">
            <button type="button" onclick="changeFlyerQty(-1)" class="w-6 h-6 border border-black rounded bg-gray-200 font-bold text-xs">-</button>
            <input type="number" id="sheet-flyer-input" min="1" max="20" value="1" oninput="onFlyerInput(this.value)" class="w-12 text-center border border-black rounded py-0.5 text-xs font-bold">
            <button type="button" onclick="changeFlyerQty(1)" class="w-6 h-6 border border-black rounded bg-gray-200 font-bold text-xs">+</button>
          </div>
        </div>
      </div>
    `;
  } else if (id === 'manipulasi') {
    html = `
      <div class="space-y-3">
        <div class="bg-amber-50 border border-amber-300 p-2 rounded text-[11px] text-gray-800">
          <strong>Ketentuan:</strong> 0-100 sampel (75k) | 101-300 sampel (120k) | >300 sampel (penyesuaian).
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-[11px] font-bold text-gray-700">JUMLAH SAMPEL DATA:</label>
            <input type="number" id="sheet-manip-input" min="1" max="1000" value="80" oninput="onManipInput(this.value)" class="w-16 text-center border border-black rounded py-0.5 text-xs font-bold">
          </div>
          <input type="range" id="sheet-manip-range" min="10" max="500" value="80" oninput="onManipInput(this.value)" class="w-full accent-indigo-600">
          <div id="sheet-manip-tier" class="text-[11px] font-bold text-indigo-700 mt-1">
            0 - 100 Sampel (Rp 75.000)
          </div>
        </div>
      </div>
    `;
  } else if (id === 'custom') {
    html = `
      <div class="space-y-2">
        <div>
          <label class="block text-[11px] font-bold text-gray-700 mb-1">NAMA LAYANAN / TUGAS:</label>
          <input type="text" id="sheet-custom-name" value="Tugas Khusus" oninput="onCustomNameInput(this.value)" class="retro-input text-xs py-1.5">
        </div>
        <div>
          <label class="block text-[11px] font-bold text-gray-700 mb-1">ESTIMASI BUDGET (RP):</label>
          <input type="number" id="sheet-custom-budget" value="50000" step="5000" oninput="onCustomBudgetInput(this.value)" class="retro-input text-xs py-1.5">
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

function onSkripsiJurusanChange(val) {
  SoundEffects.playBlip();
  AppState.activeSheetItem.skripsiJurusan = val;
  const mgmtBox = document.getElementById('sheet-skripsi-mgmt-box');
  const itBox = document.getElementById('sheet-skripsi-it-box');
  if (val === 'manajemen') {
    mgmtBox.classList.remove('hidden');
    itBox.classList.add('hidden');
    AppState.activeSheetItem.skripsiPkg = document.querySelector('input[name="sheet-skripsi-pkg"]:checked')?.value || 'bab_1_5_manip';
  } else {
    mgmtBox.classList.add('hidden');
    itBox.classList.remove('hidden');
    AppState.activeSheetItem.skripsiPkg = document.querySelector('input[name="sheet-skripsi-pkg-it"]:checked')?.value || 'it_skripsi_only';
  }
  updateSheetPricePreview();
}

function onSkripsiPkgChange(val) {
  SoundEffects.playBlip();
  AppState.activeSheetItem.skripsiPkg = val;
  updateSheetPricePreview();
}

function onExtraRevChange(val) {
  const count = Math.max(0, parseInt(val, 10) || 0);
  AppState.activeSheetItem.skripsiExtraRev = count;

  const liveEl = document.getElementById('sheet-extra-rev-live');
  const valEl = document.getElementById('sheet-extra-rev-val');
  if (liveEl && valEl) {
    if (count > 0) {
      liveEl.classList.remove('hidden');
      valEl.textContent = count;
      liveEl.innerHTML = `Total Revisi: <strong>Free 7x</strong> + ${count}x Revisi Ekstra (+${formatRupiah(count * 5000)})`;
    } else {
      liveEl.classList.add('hidden');
    }
  }
  updateSheetPricePreview();
}

function onWebTypeChange(val) {
  SoundEffects.playBlip();
  AppState.activeSheetItem.websiteType = val;
  const sBox = document.getElementById('sheet-web-static-box');
  const dBox = document.getElementById('sheet-web-dynamic-box');
  if (val === 'statis') {
    sBox.classList.remove('hidden');
    dBox.classList.add('hidden');
  } else {
    sBox.classList.add('hidden');
    dBox.classList.remove('hidden');
  }
  updateSheetPricePreview();
}

function onWebTierChange(val) {
  SoundEffects.playBlip();
  if (AppState.activeSheetItem.websiteType === 'statis') {
    AppState.activeSheetItem.websiteStaticTier = val;
  } else {
    AppState.activeSheetItem.websiteDynamicTier = val;
  }
  updateSheetPricePreview();
}

function changePptSlide(delta) {
  SoundEffects.playBlip();
  const input = document.getElementById('sheet-ppt-input');
  if (!input) return;
  const next = Math.max(1, (parseInt(input.value, 10) || 1) + delta);
  onPptSlideInput(next);
}

function onPptSlideInput(val) {
  const v = Math.max(1, parseInt(val, 10) || 1);
  AppState.activeSheetItem.pptSlides = v;
  const inp = document.getElementById('sheet-ppt-input');
  const rng = document.getElementById('sheet-ppt-range');
  const note = document.getElementById('sheet-ppt-calc-note');
  if (inp) inp.value = v;
  if (rng) rng.value = v;
  if (note) {
    if (v <= 10) {
      note.textContent = `${v} lembar dasar (&le;10 lbr) = Rp 50.000`;
    } else {
      const extra = v - 10;
      note.textContent = `10 lbr (50k) + ${extra} lbr x 7k = ${formatRupiah(50000 + extra * 7000)}`;
    }
  }
  updateSheetPricePreview();
}

function onRapihinPageInput(val) {
  const v = Math.max(1, parseInt(val, 10) || 1);
  AppState.activeSheetItem.rapihinPages = v;
  const inp = document.getElementById('sheet-rapihin-input');
  const rng = document.getElementById('sheet-rapihin-range');
  const tier = document.getElementById('sheet-rapihin-tier');
  if (inp) inp.value = v;
  if (rng) rng.value = v;
  if (tier) {
    if (v <= 100) tier.textContent = 'Tier: < 100 Lembar (Rp 70.000)';
    else if (v <= 150) tier.textContent = 'Tier: 101 - 150 Lembar (Rp 80.000)';
    else if (v <= 200) tier.textContent = 'Tier: 151 - 200 Lembar (Rp 90.000)';
    else tier.textContent = `Tier: > 200 Lembar (${formatRupiah(90000 + (v - 200) * 1000)})`;
  }
  updateSheetPricePreview();
}

function onMakalahInput(val) {
  const v = Math.max(1, parseInt(val, 10) || 1);
  AppState.activeSheetItem.makalahPages = v;
  const inp = document.getElementById('sheet-makalah-input');
  const rng = document.getElementById('sheet-makalah-range');
  const tier = document.getElementById('sheet-makalah-tier');
  if (inp) inp.value = v;
  if (rng) rng.value = v;
  if (tier) {
    tier.textContent = v <= 100 ? '&le; 100 Lembar (Rp 75.000)' : '> 100 Lembar (Rp 100.000)';
  }
  updateSheetPricePreview();
}

function changeFlyerQty(delta) {
  SoundEffects.playBlip();
  const input = document.getElementById('sheet-flyer-input');
  if (!input) return;
  const next = Math.max(1, (parseInt(input.value, 10) || 1) + delta);
  onFlyerInput(next);
}

function onFlyerInput(val) {
  const v = Math.max(1, parseInt(val, 10) || 1);
  AppState.activeSheetItem.flyerQty = v;
  const inp = document.getElementById('sheet-flyer-input');
  if (inp) inp.value = v;
  updateSheetPricePreview();
}

function onManipInput(val) {
  const v = Math.max(1, parseInt(val, 10) || 1);
  AppState.activeSheetItem.manipSamples = v;
  const inp = document.getElementById('sheet-manip-input');
  const rng = document.getElementById('sheet-manip-range');
  const tier = document.getElementById('sheet-manip-tier');
  if (inp) inp.value = v;
  if (rng) rng.value = v;
  if (tier) {
    if (v <= 100) tier.textContent = '0 - 100 Sampel (Rp 75.000)';
    else if (v <= 300) tier.textContent = '101 - 300 Sampel (Rp 120.000)';
    else tier.textContent = '> 300 Sampel (Penyesuaian)';
  }
  updateSheetPricePreview();
}

function onCustomNameInput(val) {
  AppState.activeSheetItem.customName = val;
}

function onCustomBudgetInput(val) {
  AppState.activeSheetItem.customBudget = Math.max(0, parseInt(val, 10) || 0);
  updateSheetPricePreview();
}

function calculateActiveSheetPrice() {
  if (!AppState.activeSheetItem) return { price: 0, desc: '' };
  const item = AppState.activeSheetItem;
  let price = 0;
  let desc = '';

  switch (item.serviceId) {
    case 'skripsi': {
      if (item.skripsiJurusan === 'manajemen') {
        if (item.skripsiPkg === 'bab_1_3') { price = 800000; desc = 'Bab 1-3 Manajemen'; }
        else if (item.skripsiPkg === 'bab_4_5_cust') { price = 800000; desc = 'Bab 4-5 (Data Sendiri)'; }
        else if (item.skripsiPkg === 'bab_4_5_manip') { price = 1000000; desc = 'Bab 4-5 (Data Manipulasi)'; }
        else if (item.skripsiPkg === 'bab_1_5_cust') { price = 1500000; desc = 'Bab 1-5 Lengkap (Data Sendiri)'; }
        else { price = 2000000; desc = 'Bab 1-5 Lengkap (Data Manipulasi)'; }
      } else {
        if (item.skripsiPkg === 'it_skripsi_only') { price = 1600000; desc = 'Bab 1-5 Skripsi IT Saja'; }
        else { price = 2500000; desc = 'Bab 1-5 Skripsi IT + Website Machine Learning'; }
      }
      if (item.skripsiExtraRev > 0) {
        price += (item.skripsiExtraRev * 5000);
        desc += ` [Free 7x + ${item.skripsiExtraRev}x Ekstra Revisi: ${formatRupiah(item.skripsiExtraRev * 5000)}]`;
      } else {
        desc += ` [Free Revisi 7x]`;
      }
      break;
    }
    case 'website': {
      if (item.websiteType === 'statis') {
        if (item.websiteStaticTier === 'static_simple') { price = 500000; desc = 'Statis Sederhana (1-2 Hal)'; }
        else if (item.websiteStaticTier === 'static_medium') { price = 650000; desc = 'Statis Menengah (3-5 Hal)'; }
        else { price = 800000; desc = 'Statis Lengkap Interaktif (5+ Hal)'; }
      } else {
        if (item.websiteDynamicTier === 'dynamic_basic') { price = 1000000; desc = 'Dinamis Standard (CRUD & DB)'; }
        else if (item.websiteDynamicTier === 'dynamic_medium') { price = 1250000; desc = 'Dinamis Intermediate (Fullstack)'; }
        else { price = 1500000; desc = 'Dinamis Kompleks & Logika Berat'; }
      }
      break;
    }
    case 'ppt': {
      const s = item.pptSlides || 10;
      price = s <= 10 ? 50000 : 50000 + (s - 10) * 7000;
      desc = `PPT Presentasi (${s} Lembar)`;
      break;
    }
    case 'rapihin': {
      const p = item.rapihinPages || 80;
      if (p <= 100) price = 70000;
      else if (p <= 150) price = 80000;
      else if (p <= 200) price = 90000;
      else price = 90000 + (p - 200) * 1000;
      desc = `Rapihin Skripsi (${p} Halaman)`;
      break;
    }
    case 'paper': {
      price = 100000;
      desc = 'Skripsi ke Paper (Format Jurnal)';
      break;
    }
    case 'makalah': {
      const p = item.makalahPages || 30;
      price = p <= 100 ? 75000 : 100000;
      desc = `Makalah (${p} Lembar)`;
      break;
    }
    case 'flyer': {
      const q = item.flyerQty || 1;
      price = q * 100000;
      desc = `Desain Flyer / Banner (${q} Desain)`;
      break;
    }
    case 'manipulasi': {
      const s = item.manipSamples || 80;
      if (s <= 100) price = 75000;
      else if (s <= 300) price = 120000;
      else price = 120000 + Math.ceil((s - 300) / 100) * 40000;
      desc = `Manipulasi Data (${s} Sampel)`;
      break;
    }
    case 'custom': {
      price = item.customBudget || 50000;
      desc = item.customName || 'Layanan Lain';
      break;
    }
  }

  return { price, desc };
}

function updateSheetPricePreview() {
  const previewEl = document.getElementById('sheet-item-price-preview');
  if (previewEl) {
    const calc = calculateActiveSheetPrice();
    previewEl.textContent = formatRupiah(calc.price);
  }
}

function addItemToCartFromSheet() {
  if (!AppState.activeSheetItem) return;

  const activeItem = AppState.activeSheetItem;
  const notes = document.getElementById('sheet-item-notes')?.value.trim() || '';
  const calc = calculateActiveSheetPrice();

  if (activeItem.serviceId === 'skripsi' && activeItem.skripsiJurusan === 'manajemen') {
    const existingSkripsiIdx = AppState.cart.findIndex(
      item => item.serviceId === 'skripsi' && item.skripsiJurusan === 'manajemen'
    );

    if (existingSkripsiIdx !== -1) {
      const existing = AppState.cart[existingSkripsiIdx];
      const existPkg = existing.skripsiPkg;
      const newPkg = activeItem.skripsiPkg;

      if ((existPkg === 'bab_1_3' && newPkg === 'bab_4_5_manip') || (existPkg === 'bab_4_5_manip' && newPkg === 'bab_1_3')) {
        SoundEffects.playFanfare();
        const combinedExtraRev = (existing.skripsiExtraRev || 0) + (activeItem.skripsiExtraRev || 0);
        const basePrice = 2000000;
        const finalPrice = basePrice + (combinedExtraRev * 5000);
        const combinedNotes = [existing.notes, notes].filter(Boolean).join(' | ');

        let desc = 'Bab 1-5 Lengkap (Data Manipulasi)';
        if (combinedExtraRev > 0) {
          desc += ` [Free 7x + ${combinedExtraRev}x Ekstra Revisi: ${formatRupiah(combinedExtraRev * 5000)}]`;
        } else {
          desc += ` [Free Revisi 7x]`;
        }
        desc += ' ★ Paket Lengkap Resmi';

        AppState.cart[existingSkripsiIdx] = {
          id: existing.id,
          serviceId: 'skripsi',
          title: 'Joki Skripsi (Bab 1–5)',
          icon: '📚',
          specDesc: desc,
          price: finalPrice,
          notes: combinedNotes,
          skripsiJurusan: 'manajemen',
          skripsiPkg: 'bab_1_5_manip',
          skripsiExtraRev: combinedExtraRev,
          isAutoBundle: true,
          bundleNotice: '⚡ Auto-Bundle Resmi: Bab 1-3 & Bab 4-5 Manipulasi otomatis digabung ke Paket Lengkap Bab 1-5 + Data Manipulasi (Rp 2.000.000).'
        };

        closeSheet('itemSheet');
        updateCartBadge();
        if (AppState.currentView === 'cart') renderCartView();

        showToast('⚡ Auto-Bundle: Bab 1-3 & Bab 4-5 Manipulasi otomatis digabung ke Paket Lengkap (Rp 2.000.000)!');
        if (typeof confetti === 'function') {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        }
        return;
      }

      if ((existPkg === 'bab_1_3' && newPkg === 'bab_4_5_cust') || (existPkg === 'bab_4_5_cust' && newPkg === 'bab_1_3')) {
        SoundEffects.playFanfare();
        const combinedExtraRev = (existing.skripsiExtraRev || 0) + (activeItem.skripsiExtraRev || 0);
        const basePrice = 1500000;
        const finalPrice = basePrice + (combinedExtraRev * 5000);
        const combinedNotes = [existing.notes, notes].filter(Boolean).join(' | ');

        let desc = 'Bab 1-5 Lengkap (Data Sendiri)';
        if (combinedExtraRev > 0) {
          desc += ` [Free 7x + ${combinedExtraRev}x Ekstra Revisi: ${formatRupiah(combinedExtraRev * 5000)}]`;
        } else {
          desc += ` [Free Revisi 7x]`;
        }
        desc += ' ★ Paket Lengkap Hemat';

        AppState.cart[existingSkripsiIdx] = {
          id: existing.id,
          serviceId: 'skripsi',
          title: 'Joki Skripsi (Bab 1–5)',
          icon: '📚',
          specDesc: desc,
          price: finalPrice,
          notes: combinedNotes,
          skripsiJurusan: 'manajemen',
          skripsiPkg: 'bab_1_5_cust',
          skripsiExtraRev: combinedExtraRev,
          isAutoBundle: true,
          bundleNotice: '🎉 Auto-Bundle Hemat: Bab 1-3 & Bab 4-5 digabung ke Paket Lengkap Bab 1-5 Data Sendiri (Rp 1.500.000 - Lebih Hemat Rp 100.000)!'
        };

        closeSheet('itemSheet');
        updateCartBadge();
        if (AppState.currentView === 'cart') renderCartView();

        showToast('🎉 Auto-Bundle: Bab 1-3 & Bab 4-5 digabung ke Paket Lengkap (Rp 1.500.000, Hemat Rp 100.000)!');
        if (typeof confetti === 'function') {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        }
        return;
      }

      if (existPkg === 'bab_1_5_cust' || existPkg === 'bab_1_5_manip') {
        alert('ℹ️ Kamu sudah memiliki Paket Lengkap Bab 1-5 di keranjang. Jika ingin mengganti paket, silakan hapus pesanan skripsi di keranjang terlebih dahulu.');
        return;
      }

      if (existPkg === newPkg) {
        alert('ℹ️ Pilihan paket skripsi ini sudah ada di keranjang.');
        return;
      }

      if (newPkg === 'bab_1_5_manip' || newPkg === 'bab_1_5_cust') {
        AppState.cart[existingSkripsiIdx] = {
          id: existing.id,
          serviceId: 'skripsi',
          title: 'Joki Skripsi (Bab 1–5)',
          icon: '📚',
          specDesc: calc.desc,
          price: calc.price,
          notes: notes || existing.notes,
          skripsiJurusan: 'manajemen',
          skripsiPkg: newPkg,
          skripsiExtraRev: activeItem.skripsiExtraRev || 0
        };
        closeSheet('itemSheet');
        updateCartBadge();
        if (AppState.currentView === 'cart') renderCartView();
        showToast('✓ Paket skripsi di keranjang berhasil diperbarui ke Paket Lengkap!');
        return;
      }
    }
  }

  SoundEffects.playFanfare();

  const cartEntry = {
    id: `item-${Date.now()}`,
    serviceId: activeItem.serviceId,
    title: activeItem.serviceTitle,
    icon: activeItem.serviceIcon,
    specDesc: calc.desc,
    price: calc.price,
    notes: notes,
    skripsiJurusan: activeItem.skripsiJurusan,
    skripsiPkg: activeItem.skripsiPkg,
    skripsiExtraRev: activeItem.skripsiExtraRev || 0
  };

  AppState.cart.push(cartEntry);
  closeSheet('itemSheet');
  updateCartBadge();
  if (AppState.currentView === 'cart') renderCartView();
  showToast(`✓ "${cartEntry.title}" berhasil ditambahkan ke keranjang!`);

  if (typeof confetti === 'function') {
    confetti({ particleCount: 40, spread: 55, origin: { y: 0.85 } });
  }
}

function closeSheet(sheetId) {
  SoundEffects.playBlip();
  const sheet = document.getElementById(sheetId);
  if (sheet) sheet.classList.remove('active');
}

function handleSheetBackdropClick(e, sheetId) {
  if (e.target.id === sheetId) {
    closeSheet(sheetId);
  }
}

function updateCartBadge() {
  const count = AppState.cart.length;
  const navBadge = document.getElementById('nav-cart-badge');
  const bar = document.getElementById('mobile-cart-bar');
  const barCount = document.getElementById('bar-cart-count');
  const barDesc = document.getElementById('bar-cart-desc');
  const barTotal = document.getElementById('bar-cart-total');

  if (navBadge) {
    if (count > 0) {
      navBadge.textContent = count;
      navBadge.classList.remove('hidden');
    } else {
      navBadge.classList.add('hidden');
    }
  }

  if (bar) {
    if (count > 0 && AppState.currentView !== 'cart') {
      bar.classList.remove('hidden-bar');
      const sum = AppState.cart.reduce((acc, cur) => acc + cur.price, 0);
      if (barCount) barCount.textContent = count;
      if (barDesc) barDesc.textContent = `${count} Layanan Dipilih`;
      if (barTotal) barTotal.textContent = formatRupiah(sum);
    } else {
      bar.classList.add('hidden-bar');
    }
  }
}

function renderCartView() {
  const listContainer = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const custSection = document.getElementById('cart-customer-section');
  const sumSubtotalEl = document.getElementById('cart-sum-subtotal');
  const sumPriorityEl = document.getElementById('cart-sum-priority');
  const sumTotalEl = document.getElementById('cart-sum-total');

  if (!listContainer) return;

  if (AppState.cart.length === 0) {
    listContainer.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (custSection) custSection.classList.add('hidden');
    updateCartBadge();
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (custSection) custSection.classList.remove('hidden');

  listContainer.innerHTML = AppState.cart.map((item, idx) => `
    <div class="p-2.5 rounded-lg border flex items-start justify-between gap-2 ${item.isAutoBundle ? 'bg-amber-50/90 border-amber-400 shadow-[1.5px_1.5px_0_#d97706] auto-bundle-card' : 'bg-gray-50 border-gray-300'}">
      <div class="flex items-start gap-2">
        <span class="text-xl flex-shrink-0">${item.icon}</span>
        <div>
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-extrabold text-xs text-gray-900">${item.title}</span>
            ${item.isAutoBundle ? `<span class="bg-amber-300 text-black text-[9px] font-black px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0_#000] shimmer-badge">⚡ AUTO-BUNDLE</span>` : ''}
          </div>
          <div class="text-[11px] text-gray-700 font-medium">${item.specDesc}</div>
          ${item.bundleNotice ? `<div class="text-[10px] text-amber-900 bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5 mt-1 font-semibold leading-tight">${item.bundleNotice}</div>` : ''}
          ${item.notes ? `<div class="text-[10px] text-gray-500 italic mt-0.5">Note: "${item.notes}"</div>` : ''}
          <div class="font-black text-xs text-indigo-700 mt-1">${formatRupiah(item.price)}</div>
        </div>
      </div>
      <button onclick="removeCartItem(${idx})" class="w-6 h-6 rounded bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center hover:bg-red-200" title="Hapus">
        ✕
      </button>
    </div>
  `).join('');

  const subtotal = AppState.cart.reduce((acc, cur) => acc + cur.price, 0);
  let mult = 0;
  if (AppState.customer.priority === 'express') mult = 0.20;
  else if (AppState.customer.priority === 'urgent') mult = 0.40;
  const priorityFee = Math.round(subtotal * mult);
  const total = subtotal + priorityFee;

  if (sumSubtotalEl) sumSubtotalEl.textContent = formatRupiah(subtotal);
  if (sumPriorityEl) sumPriorityEl.textContent = priorityFee > 0 ? `+${formatRupiah(priorityFee)}` : 'Rp 0 (Reguler)';
  if (sumTotalEl) sumTotalEl.textContent = formatRupiah(total);

  updateCartBadge();
}

function removeCartItem(index) {
  SoundEffects.playBlip();
  AppState.cart.splice(index, 1);
  renderCartView();
  showToast('✓ Layanan dihapus dari keranjang');
}

function clearCart() {
  if (AppState.cart.length === 0) return;
  if (confirm('Yakin ingin mengosongkan seluruh keranjang?')) {
    SoundEffects.playBlip();
    AppState.cart = [];
    renderCartView();
    showToast('Keranjang telah dikosongkan.');
  }
}

function checkoutToInstagramDM() {
  if (AppState.cart.length === 0) {
    alert('Keranjang masih kosong!');
    return;
  }

  const nameInput = document.getElementById('cart-cust-nama');
  const igInput = document.getElementById('cart-cust-ig');
  const waInput = document.getElementById('cart-cust-wa');
  const dateInput = document.getElementById('cart-deadline-date');
  const timeInput = document.getElementById('cart-deadline-time');
  const notesInput = document.getElementById('cart-cust-notes');

  const nama = nameInput?.value.trim();
  let ig = igInput?.value.trim() || '';
  const wa = waInput?.value.trim() || '-';
  const date = dateInput?.value.trim();
  const time = timeInput?.value.trim() || '23:59';
  const notes = notesInput?.value.trim() || '';

  if (!nama) {
    alert('Mohon isi nama lengkap / panggilan kamu ya kak!');
    nameInput?.focus();
    return;
  }
  if (!ig) {
    alert('Mohon isi username Instagram kamu ya kak (agar admin tahu saat kamu DM)!');
    igInput?.focus();
    return;
  }
  if (!ig.startsWith('@')) {
    ig = '@' + ig;
  }
  if (!date) {
    alert('Mohon pilih tanggal deadline tugas kamu ya kak!');
    dateInput?.focus();
    return;
  }

  SoundEffects.playFanfare();

  const subtotal = AppState.cart.reduce((acc, cur) => acc + cur.price, 0);
  let mult = 0;
  let priorityLabel = 'Reguler';
  if (AppState.customer.priority === 'express') {
    mult = 0.20;
    priorityLabel = '⚡ Kilat (<48 Jam) [+20%]';
  } else if (AppState.customer.priority === 'urgent') {
    mult = 0.40;
    priorityLabel = '🔥 Super Kilat (<24 Jam) [+40%]';
  }
  const priorityFee = Math.round(subtotal * mult);
  const total = subtotal + priorityFee;

  const now = new Date();
  const orderCode = `#JL-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const itemsText = AppState.cart.map((item, i) => {
    let t = `${i + 1}. *${item.title}*\n   • Spesifikasi: ${item.specDesc}\n   • Biaya: ${formatRupiah(item.price)}`;
    if (item.bundleNotice) t += `\n   • Info Bundle: ${item.bundleNotice}`;
    if (item.notes) t += `\n   • Catatan Item: ${item.notes}`;
    return t;
  }).join('\n');

  const igMessage = `Halo Admin Jokify Lab! 🚀
Saya mau order joki tugas/skripsi nih kak, ini rincian pesanan dari website:

📋 *KODE ORDER: ${orderCode}*
────────────────────────
👤 *Nama:* ${nama}
📸 *Akun IG:* ${ig}
📱 *No. HP/WA:* ${wa}
📅 *Deadline:* ${date} (${time} WIB)
⚡ *Prioritas Pengerjaan:* ${priorityLabel}

🛒 *LAYANAN YANG DIPILIH (${AppState.cart.length} Item):*
${itemsText}

💰 *RINCIAN BIAYA:*
• Subtotal Layanan: ${formatRupiah(subtotal)}
• Biaya Prioritas: ${formatRupiah(priorityFee)}
• *TOTAL ESTIMASI: ${formatRupiah(total)}*
────────────────────────
${notes ? `📝 *Catatan Khusus:* ${notes}\n` : ''}💳 *Metode Pembayaran:* QRIS Only

Format ini sudah otomatis tersalin dari website Jokify Lab. Mohon info ketersediaan slot pengerjaan dan barcode QRIS untuk pembayaran DP ya kak. Terima kasih! ✨`;

  window._lastOrderFormattedText = igMessage;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(igMessage).catch(() => {});
  }

  const igDirectUrl = `https://ig.me/m/jokify.lab`;

  const sentModal = document.getElementById('sentModal');
  const sentCode = document.getElementById('sent-code');
  const sentName = document.getElementById('sent-name');
  const sentTotal = document.getElementById('sent-total');
  const sentLink = document.getElementById('sent-ig-link');

  if (sentCode) sentCode.textContent = orderCode;
  if (sentName) sentName.textContent = `${nama} (${ig})`;
  if (sentTotal) sentTotal.textContent = formatRupiah(total);
  if (sentLink) {
    sentLink.href = igDirectUrl;
  }

  if (sentModal) sentModal.classList.add('active');

  showToast('✓ Format order otomatis disalin! Tinggal PASTE di DM Instagram @jokify.lab');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  }

  window.open(igDirectUrl, '_blank');
}

function copyFormattedOrder() {
  if (window._lastOrderFormattedText && navigator.clipboard) {
    navigator.clipboard.writeText(window._lastOrderFormattedText).then(() => {
      showToast('✓ Rincian order berhasil disalin!');
    });
  } else {
    showToast('Silakan buka DM Instagram @jokify.lab.');
  }
}

function initClock() {
  const clockEl = document.getElementById('hero-clock');
  const dateEl = document.getElementById('hero-date');

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  function tick() {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');

    if (clockEl) clockEl.textContent = `${h}:${m}:${s} WIB`;
    if (dateEl) {
      dateEl.textContent = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  tick();
  setInterval(tick, 1000);
}

let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById('retro-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'retro-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove('toast-active');
  void toast.offsetWidth;
  toast.classList.add('toast-active');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast-active');
  }, 2600);
}

function mascotTapEffect(el) {
  SoundEffects.playPop();
  if (!el && typeof event !== 'undefined') {
    el = event.currentTarget || event.target;
  }
  if (el) {
    el.classList.remove('mascot-boing');
    void el.offsetWidth;
    el.classList.add('mascot-boing');
  }
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 28,
      spread: 70,
      origin: { y: 0.35 },
      shapes: ['star', 'circle'],
      colors: ['#fed752', '#6c5ce7', '#ff4757', '#2ed573', '#ff9ff3']
    });
  }
}

function openInstagramDM() {
  SoundEffects.playPop();
  window.open('https://ig.me/m/jokify.lab', '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  renderMenuCatalog();
  initAppleScrollReveal();
  triggerAppleRevealsInView('home');

  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      renderMenuCatalog();
    });
  }

  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      SoundEffects.playBlip();
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.activeCategory = pill.dataset.category;
      renderMenuCatalog();
    });
  });

  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      SoundEffects.enabled = !SoundEffects.enabled;
      soundBtn.textContent = SoundEffects.enabled ? '🔊' : '🔇';
      SoundEffects.playPop();
      showToast(SoundEffects.enabled ? 'Efek Suara: ON' : 'Efek Suara: OFF');
    });
  }

  document.querySelectorAll('input[name="cart-priority"]').forEach(r => {
    r.addEventListener('change', (e) => {
      SoundEffects.playBlip();
      AppState.customer.priority = e.target.value;
      renderCartView();
    });
  });

  const deadlineDate = document.getElementById('cart-deadline-date');
  if (deadlineDate) {
    const today = new Date().toISOString().split('T')[0];
    deadlineDate.min = today;
    deadlineDate.value = today;
  }
});
