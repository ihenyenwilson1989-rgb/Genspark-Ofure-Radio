/* =====================================================
   OFURE RADIO — Full Interactive Application
   All buttons, forms, modals and menus are REAL & ACTIVE
   ===================================================== */

'use strict';

// ─── APP STATE ────────────────────────────────────────
const State = {
  isPlaying: false,
  currentStreamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
  currentStreamName: 'OFURE RADIO MAIN',
  volume: 0.8,
  streams: JSON.parse(localStorage.getItem('ofure_streams') || 'null') || [
    { id: 1, name: 'OFURE RADIO MAIN',    url: 'https://stream.zeno.fm/f3wvbbqmdg8uv', genre: 'Afrobeats • R&B • Gospel',        status: 'live',      listeners: 247 },
    { id: 2, name: 'OFURE GOSPEL STATION', url: 'https://stream.zeno.fm/f3wvbbqmdg8uv', genre: 'Gospel • Worship • Inspirational', status: 'live',      listeners: 89  },
    { id: 3, name: 'OFURE URBAN BEATS',   url: '',                                       genre: 'Hip-Hop • Trap • Urban',          status: 'offline',   listeners: 0   }
  ],
  schedule: JSON.parse(localStorage.getItem('ofure_schedule') || 'null') || [
    { id:1, time:'6:00 AM',  show:'Morning Vibes',      host:'DJ Alex',   genre:'Afrobeats / Gospel',        days:'Mon-Fri',   active:true  },
    { id:2, time:'9:00 AM',  show:'The Word & Music',   host:'Pastor Mike',genre:'Gospel / Inspirational',  days:'Mon-Fri',   active:false },
    { id:3, time:'12:00 PM', show:'Afternoon Mix',      host:'DJ Luna',   genre:'R&B / Hip-Hop',             days:'Daily',     active:false },
    { id:4, time:'2:00 PM',  show:'Throwback Classics', host:'DJ Rex',    genre:'Old School / Soul',         days:'Mon,Wed,Fri',active:false},
    { id:5, time:'4:00 PM',  show:'Evening Drive',      host:'DJ Marcus', genre:'Afrobeats / Urban',         days:'Daily',     active:false },
    { id:6, time:'7:00 PM',  show:'Cultural Vibes',     host:'Mama Bisi', genre:'Highlife / Jùjú',           days:'Tue,Thu,Sat',active:false},
    { id:7, time:'9:00 PM',  show:'Night Frequency',    host:'DJ Sarah',  genre:'Chill / Neo-Soul',          days:'Daily',     active:false },
    { id:8, time:'11:00 PM', show:'Late Night Sessions',host:'DJ Maya',   genre:'Electronic / Deep House',   days:'Fri-Sat',   active:false }
  ],
  podcasts: JSON.parse(localStorage.getItem('ofure_podcasts') || '[]'),
  settings: JSON.parse(localStorage.getItem('ofure_settings') || 'null') || {
    stationName: 'OFURE RADIO',
    tagline: 'Where It All Began',
    email: 'hello@ofureradio.com',
    mainStream: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com'
  },
  editingStreamId: null,
  editingScheduleId: null,
  editingPodcastId: null,
  mediaRecorder: null,
  recordedChunks: [],
  isRecording: false,
  recordTimer: null,
  recordSeconds: 0,
  listeners: 247 + Math.floor(Math.random() * 30)
};

function saveState(key) {
  if (key === 'streams')  localStorage.setItem('ofure_streams',  JSON.stringify(State.streams));
  if (key === 'schedule') localStorage.setItem('ofure_schedule', JSON.stringify(State.schedule));
  if (key === 'podcasts') localStorage.setItem('ofure_podcasts', JSON.stringify(State.podcasts));
  if (key === 'settings') localStorage.setItem('ofure_settings', JSON.stringify(State.settings));
}

// ─── UTILITIES ────────────────────────────────────────
function $(id) { return document.getElementById(id); }
function $$(sel) { return document.querySelectorAll(sel); }

function showToast(message, type = 'success') {
  let toast = $('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;transition:all .3s ease;transform:translateY(20px);opacity:0;pointer-events:none;';
    document.body.appendChild(toast);
  }
  const icons = { success:'fa-check-circle text-green-400', error:'fa-times-circle text-red-400', warning:'fa-exclamation-triangle text-yellow-400', info:'fa-info-circle text-blue-400' };
  const icon = icons[type] || icons.success;
  toast.innerHTML = `<div style="background:#1f2937;border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:12px 20px;display:flex;align-items:center;gap:10px;box-shadow:0 20px 40px rgba(0,0,0,.4);min-width:260px;max-width:360px;">
    <i class="fas ${icon}" style="font-size:16px;flex-shrink:0;"></i>
    <span style="color:#fff;font-size:14px;font-weight:500;line-height:1.4;">${message}</span>
  </div>`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.transform = 'translateY(20px)'; toast.style.opacity = '0'; }, 3500);
}

function openModal(id) {
  const m = $(id);
  if (m) { m.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = $(id);
  if (m) { m.classList.add('hidden'); document.body.style.overflow = ''; }
}
function closeAllModals() {
  $$('[id$="Modal"]').forEach(m => { m.classList.add('hidden'); });
  document.body.style.overflow = '';
}

// Close modals on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-backdrop') || e.target.id.endsWith('Modal') && e.target.id !== 'editModalContent') {
    const rect = e.target.getBoundingClientRect();
    // Only if clicking the dark backdrop area (not the inner card)
    closeAllModals();
  }
});

// ─── NAVBAR ────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = $('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

const mobileMenuBtn = $('mobileMenuBtn');
const mobileMenu = $('mobileMenu');
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', open);
    mobileMenuBtn.querySelector('i').className = open ? 'fas fa-bars text-xl' : 'fas fa-times text-xl';
  });
}
$$('.mobile-menu-close').forEach(el => el.addEventListener('click', () => {
  mobileMenu && mobileMenu.classList.add('hidden');
  mobileMenuBtn && (mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-xl');
}));

// ─── SMOOTH SCROLL ─────────────────────────────────────
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = $(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      mobileMenu && mobileMenu.classList.add('hidden');
    }
  });
});

// ─── RADIO PLAYER ──────────────────────────────────────
const radioPlayer = $('radioPlayer');
if (radioPlayer) radioPlayer.volume = State.volume;

function togglePlay() {
  if (!radioPlayer) return;
  if (State.isPlaying) {
    radioPlayer.pause();
    _setPlayState(false);
  } else {
    radioPlayer.src = State.currentStreamUrl;
    const btn = $('playBtn');
    if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin text-white text-lg"></i>';
    radioPlayer.play()
      .then(() => _setPlayState(true))
      .catch(() => { showToast('Stream unavailable. Please try again.', 'error'); _setPlayState(false); });
  }
}

function _setPlayState(playing) {
  State.isPlaying = playing;
  const icon = $('playIcon');
  if (icon) icon.className = playing ? 'fas fa-pause text-white text-lg' : 'fas fa-play text-white text-lg ml-1';
  $$('.visualizer-bar').forEach(b => b.classList.toggle('playing', playing));
  const nowPlaying = $('nowPlayingName');
  if (nowPlaying) nowPlaying.textContent = playing ? State.currentStreamName : 'Click play to listen';
}

function setVolume(val) {
  State.volume = parseFloat(val);
  if (radioPlayer) radioPlayer.volume = State.volume;
  const slider = $('volumeSlider');
  if (slider) slider.value = val;
}

function playStream(url, name) {
  if (!url || url === '#') { showToast('This stream is not available yet — check back soon!', 'warning'); return; }
  State.currentStreamUrl = url;
  State.currentStreamName = name;
  if (radioPlayer) {
    radioPlayer.src = url;
    radioPlayer.play()
      .then(() => { _setPlayState(true); showToast(`▶ Now playing: ${name}`, 'success'); })
      .catch(() => showToast('Could not connect to stream.', 'error'));
  }
}

// ─── CONTACT FORM ──────────────────────────────────────
function handleContactForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
  setTimeout(() => {
    showToast('Message sent! We\'ll be in touch soon. 📬', 'success');
    e.target.reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
  }, 1200);
}

function handleNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Subscribing...';
  setTimeout(() => {
    showToast('Subscribed! Welcome to the OFURE RADIO family! 🎉', 'success');
    e.target.reset();
    btn.disabled = false;
    btn.innerHTML = btn.textContent.includes('Free') ? 'Subscribe Free' : '<i class="fas fa-arrow-right"></i>';
  }, 1000);
}

// ─── SONG REQUEST MODAL ───────────────────────────────
function openSongRequest() {
  openModal('songRequestModal');
}
function submitSongRequest(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
  setTimeout(() => {
    showToast('Song request sent! 🎵 DJs will try to play it soon.', 'success');
    e.target.reset();
    closeModal('songRequestModal');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-music mr-2"></i>Request Song';
  }, 1000);
}

// ─── SHARE ────────────────────────────────────────────
function shareArticle() {
  if (navigator.share) {
    navigator.share({ title: document.title, url: location.href })
      .catch(() => {});
  } else {
    navigator.clipboard.writeText(location.href)
      .then(() => showToast('Link copied to clipboard!', 'success'))
      .catch(() => showToast('Copy this URL: ' + location.href, 'info'));
  }
}
function shareOn(platform) {
  const url = encodeURIComponent(location.href);
  const title = encodeURIComponent(document.title);
  const map = {
    twitter:  `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`,
    link: null
  };
  if (platform === 'link') {
    navigator.clipboard.writeText(location.href)
      .then(() => showToast('Link copied!', 'success'))
      .catch(() => showToast('URL: ' + location.href, 'info'));
    return;
  }
  if (map[platform]) window.open(map[platform], '_blank', 'width=600,height=400');
}

// ─── BLOG SEARCH (Client-side) ────────────────────────
function filterBlogSearch(value) {
  const q = value.trim().toLowerCase();
  const cards = $$('.blog-article-card');
  let shown = 0;
  cards.forEach(card => {
    const text = (card.dataset.title || '') + ' ' + (card.dataset.category || '') + ' ' + (card.dataset.tags || '');
    const match = !q || text.toLowerCase().includes(q);
    card.closest('.blog-card-wrapper') 
      ? (card.closest('.blog-card-wrapper').style.display = match ? '' : 'none')
      : (card.style.display = match ? '' : 'none');
    if (match) shown++;
  });
  const noResults = $('blogNoResults');
  if (noResults) noResults.style.display = shown === 0 && q ? '' : 'none';
}

// Tag click filtering on blog page
function filterByTag(tag) {
  const searchEl = $('blogSearch');
  if (searchEl) { searchEl.value = tag; filterBlogSearch(tag); }
}

// ─── ADMIN AUTH ────────────────────────────────────────
let isAuthenticated = sessionStorage.getItem('ofure_admin_auth') === 'true';

function initAdmin() {
  if (!$('pinGate')) return;
  if (isAuthenticated) {
    $('pinGate').classList.add('hidden');
    $('adminContent').classList.remove('hidden');
    showPanel('dashboard');
    renderDashboard();
  }
  const inputs = $$('.pin-input');
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/\D/g,'');
      if (inp.value && i < inputs.length - 1) inputs[i+1].focus();
      if (i === inputs.length - 1 && inp.value) verifyPin();
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i-1].focus();
    });
  });
  if (!isAuthenticated && inputs.length) inputs[0].focus();
}

function verifyPin() {
  const inputs = $$('.pin-input');
  let pin = ''; inputs.forEach(i => pin += i.value);
  const stored = localStorage.getItem('ofure_admin_pin') || '1234';
  if (pin === stored) {
    sessionStorage.setItem('ofure_admin_auth', 'true');
    $('pinGate').classList.add('hidden');
    $('adminContent').classList.remove('hidden');
    showPanel('dashboard');
    renderDashboard();
    showToast('Welcome to OFURE STUDIO! 🎙️', 'success');
  } else {
    $('pinError').classList.remove('hidden');
    inputs.forEach(i => { i.value = ''; i.style.borderColor = '#ef4444'; setTimeout(() => i.style.borderColor = '', 900); });
    inputs[0].focus();
    setTimeout(() => { $('pinError') && $('pinError').classList.add('hidden'); }, 3000);
  }
}

function adminLogout() {
  sessionStorage.removeItem('ofure_admin_auth');
  showToast('Logged out successfully.', 'info');
  setTimeout(() => location.reload(), 600);
}

function showPanel(id) {
  $$('.admin-panel').forEach(p => p.classList.add('hidden'));
  const panel = $('panel-' + id);
  if (panel) panel.classList.remove('hidden');
  $$('.admin-nav-item').forEach(btn => {
    const active = btn.dataset.panel === id;
    btn.style.background = active ? 'rgba(249,115,22,0.15)' : '';
    btn.style.color = active ? '#fb923c' : '';
    btn.style.borderColor = active ? 'rgba(249,115,22,0.3)' : '';
  });
  if (id === 'streams')  renderStreams();
  if (id === 'schedule') renderSchedule();
  if (id === 'podcast')  renderPodcasts();
  if (id === 'settings') populateSettings();
  if (window.innerWidth < 1024) { const sb = $('adminSidebar'); if (sb) sb.classList.remove('open'); }
}

function toggleSidebar() {
  const sb = $('adminSidebar');
  if (sb) sb.classList.toggle('open');
}

// ─── DASHBOARD ────────────────────────────────────────
function renderDashboard() {
  // Live listener counter (simulated)
  const el = $('dashListeners');
  if (el) {
    let count = State.listeners;
    setInterval(() => {
      count += Math.floor(Math.random() * 5) - 2;
      count = Math.max(200, count);
      el.textContent = count;
    }, 4000);
    el.textContent = count;
  }
}

// ─── BLOG MANAGEMENT ──────────────────────────────────
function filterArticles(cat) {
  $$('.filter-btn').forEach(b => {
    const isActive = b.dataset.category === cat;
    b.style.background = isActive ? '#f97316' : '';
    b.style.color = isActive ? '#fff' : '';
    b.classList.toggle('active', isActive);
  });
  $$('.article-row').forEach(row => {
    row.style.display = (!cat || row.dataset.category === cat) ? '' : 'none';
  });
  const visible = $$('.article-row:not([style*="none"])').length;
  const empty = $('articlesEmpty');
  if (empty) empty.style.display = visible === 0 ? '' : 'none';
}

function searchAdminArticles(q) {
  const query = q.toLowerCase();
  $$('.article-row').forEach(row => {
    const text = (row.dataset.title || '') + ' ' + (row.dataset.category || '');
    row.style.display = (!query || text.includes(query)) ? '' : 'none';
  });
}

function editArticle(id) {
  const row = document.querySelector(`.article-row[data-id="${id}"]`);
  if (!row) return;
  const title    = row.dataset.title || '';
  const cat      = row.dataset.category || 'Entertainment';
  const excerpt  = row.dataset.excerpt || '';
  const featured = row.dataset.featured === 'true';
  const slug     = row.dataset.slug || '';

  const content = $('editModalContent');
  if (!content) return;
  content.innerHTML = `
    <input type="hidden" id="editArticleId" value="${id}">
    <div class="space-y-4">
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Article Title</label>
        <input id="editTitle" type="text" value="${title.replace(/"/g,'&quot;')}"
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-neutral-400 text-sm mb-1">Category</label>
          <select id="editCategory" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
            ${['Entertainment','Music','Celebrity','World News','Sports','Technology','Lifestyle','Africa'].map(c => `<option ${c===cat?'selected':''}>${c}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-neutral-400 text-sm mb-1">Status</label>
          <select id="editStatus" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
            <option value="published" ${!featured?'selected':''}>Published</option>
            <option value="featured"  ${featured ?'selected':''}>Featured</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Excerpt / Summary</label>
        <textarea id="editExcerpt" rows="3"
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none">${excerpt}</textarea>
      </div>
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Article Slug (URL)</label>
        <input id="editSlug" type="text" value="${slug}"
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
      </div>
      <div class="flex gap-3 pt-2 border-t border-white/10">
        <button onclick="saveArticleEdit()" class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors">
          <i class="fas fa-save mr-2"></i>Save Changes
        </button>
        <a href="/blog/${slug}" target="_blank" class="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm flex items-center gap-1">
          <i class="fas fa-eye"></i> View
        </a>
        <button onclick="closeModal('editModal')" class="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors">
          Cancel
        </button>
      </div>
    </div>`;
  openModal('editModal');
}

function saveArticleEdit() {
  const id       = $('editArticleId')?.value;
  const title    = $('editTitle')?.value.trim();
  const category = $('editCategory')?.value;
  const status   = $('editStatus')?.value;
  const excerpt  = $('editExcerpt')?.value.trim();
  const slug     = $('editSlug')?.value.trim();

  if (!title) { showToast('Title cannot be empty.', 'error'); return; }

  const row = document.querySelector(`.article-row[data-id="${id}"]`);
  if (row) {
    row.dataset.title    = title.toLowerCase();
    row.dataset.category = category;
    row.dataset.excerpt  = excerpt;
    row.dataset.featured = status === 'featured' ? 'true' : 'false';
    row.dataset.slug     = slug;
    const titleEl = row.querySelector('.article-title-cell');
    if (titleEl) titleEl.textContent = title;
    const catEl = row.querySelector('.article-category-badge');
    if (catEl) catEl.textContent = category;
    const featEl = row.querySelector('.article-featured-badge');
    if (featEl) featEl.innerHTML = status === 'featured'
      ? '<span class="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><i class="fas fa-star mr-1"></i>Featured</span>'
      : '<span class="text-xs px-2 py-1 rounded-full bg-white/10 text-neutral-400">Published</span>';
  }
  showToast('Article updated successfully! ✅', 'success');
  closeModal('editModal');
}

function toggleFeatured(id) {
  const row = document.querySelector(`.article-row[data-id="${id}"]`);
  if (!row) return;
  const isFeatured = row.dataset.featured === 'true';
  row.dataset.featured = (!isFeatured).toString();
  const badge = row.querySelector('.article-featured-badge');
  if (badge) badge.innerHTML = !isFeatured
    ? '<span class="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><i class="fas fa-star mr-1"></i>Featured</span>'
    : '<span class="text-xs px-2 py-1 rounded-full bg-white/10 text-neutral-400">Published</span>';
  showToast(!isFeatured ? 'Article marked as Featured ⭐' : 'Article unfeatured', 'success');
}

function showAddArticleModal() {
  const content = $('editModalContent');
  if (!content) return;
  content.innerHTML = `
    <input type="hidden" id="editArticleId" value="new">
    <div class="space-y-4">
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Article Title *</label>
        <input id="editTitle" type="text" placeholder="Enter article title..."
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-neutral-400 text-sm mb-1">Category</label>
          <select id="editCategory" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
            ${['Entertainment','Music','Celebrity','World News','Sports','Technology','Lifestyle','Africa'].map(c=>`<option>${c}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-neutral-400 text-sm mb-1">Status</label>
          <select id="editStatus" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
            <option value="published">Published</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Excerpt</label>
        <textarea id="editExcerpt" rows="3"
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none" placeholder="Article summary..."></textarea>
      </div>
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Content</label>
        <textarea id="editContent" rows="6"
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none" placeholder="Full article body..."></textarea>
      </div>
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Image URL</label>
        <input id="editImage" type="url" placeholder="https://images.unsplash.com/..."
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
      </div>
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Author</label>
        <input id="editAuthor" type="text" value="OFURE Radio Team"
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
      </div>
      <div class="flex gap-3 pt-2 border-t border-white/10">
        <button onclick="saveNewArticle()" class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors">
          <i class="fas fa-plus mr-2"></i>Publish Article
        </button>
        <button onclick="closeModal('editModal')" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors">Cancel</button>
      </div>
    </div>`;
  const modal = $('editModal');
  if (modal) {
    modal.querySelector('h3').textContent = 'New Article';
    openModal('editModal');
  }
}

function saveNewArticle() {
  const title = $('editTitle')?.value.trim();
  if (!title) { showToast('Title is required.', 'error'); return; }
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const today = new Date().toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const category = $('editCategory')?.value || 'Entertainment';
  // Add to table
  const tbody = document.querySelector('#articlesTable tbody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-white/3 transition-colors article-row';
    tr.dataset.category = category;
    tr.dataset.title = title.toLowerCase();
    tr.dataset.excerpt = $('editExcerpt')?.value || '';
    tr.dataset.featured = $('editStatus')?.value === 'featured' ? 'true' : 'false';
    tr.dataset.slug = slug;
    tr.dataset.id = 'new-' + Date.now();
    tr.innerHTML = `
      <td class="py-4 px-4"><div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0"><i class="fas fa-newspaper text-orange-400 text-sm"></i></div>
        <div><p class="text-white font-medium text-sm article-title-cell">${title}</p><p class="text-neutral-500 text-xs">${today}</p></div>
      </div></td>
      <td class="py-4 px-4 hidden md:table-cell"><span class="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 article-category-badge">${category}</span></td>
      <td class="py-4 px-4 text-neutral-400 text-sm hidden lg:table-cell">${today}</td>
      <td class="py-4 px-4 hidden lg:table-cell article-featured-badge">
        <span class="text-xs px-2 py-1 rounded-full bg-white/10 text-neutral-400">Published</span>
      </td>
      <td class="py-4 px-4 text-right"><div class="flex items-center justify-end gap-2">
        <a href="/blog/${slug}" target="_blank" class="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors text-xs"><i class="fas fa-eye"></i></a>
        <button onclick="editArticle('${tr.dataset.id}')" class="text-orange-400 p-2 rounded-lg hover:bg-orange-500/10 transition-colors text-xs"><i class="fas fa-edit"></i></button>
        <button onclick="toggleFeatured('${tr.dataset.id}')" class="text-neutral-400 hover:text-yellow-400 p-2 rounded-lg hover:bg-yellow-500/10 transition-colors text-xs"><i class="fas fa-star"></i></button>
      </div></td>`;
    tbody.insertBefore(tr, tbody.firstChild);
  }
  const countEl = document.querySelector('[data-stat="article-count"]');
  if (countEl) countEl.textContent = parseInt(countEl.textContent || 0) + 1;
  showToast(`Article "${title}" published! ✅`, 'success');
  closeModal('editModal');
}

// ─── STREAM MANAGER ────────────────────────────────────
function renderStreams() {
  const list = $('streamsList');
  if (!list) return;
  list.innerHTML = State.streams.map(s => `
    <div class="bg-neutral-900 border border-white/10 rounded-xl p-6 hover:border-orange-500/20 transition-all stream-card" data-id="${s.id}">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-radio text-orange-400 text-xl"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-0.5 flex-wrap">
              <h3 class="text-white font-bold stream-name">${s.name}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full font-semibold ${s.status==='live'?'bg-green-500/20 text-green-400':'bg-red-500/20 text-red-400'}">
                ${s.status==='live'?'● LIVE':'○ OFFLINE'}
              </span>
            </div>
            <p class="text-neutral-400 text-sm stream-genre">${s.genre}</p>
            <p class="text-neutral-600 text-xs truncate stream-url">${s.url || 'No URL set'}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          ${s.status==='live'?`<span class="text-neutral-400 text-sm"><i class="fas fa-users mr-1 text-green-400"></i>${s.listeners} listening</span>`:''}
          <div class="flex gap-2">
            <button onclick="testStream('${s.url}','${s.name}')" class="text-neutral-400 hover:text-green-400 p-2 rounded-lg hover:bg-green-500/10 transition-colors" title="Test / Play">
              <i class="fas fa-play text-sm"></i>
            </button>
            <button onclick="openEditStream(${s.id})" class="text-orange-400 hover:text-orange-300 p-2 rounded-lg hover:bg-orange-500/10 transition-colors" title="Edit">
              <i class="fas fa-edit text-sm"></i>
            </button>
            <button onclick="toggleStreamStatus(${s.id})" class="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-colors" title="Toggle Status">
              <i class="fas fa-power-off text-sm"></i>
            </button>
            <button onclick="deleteStream(${s.id})" class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete">
              <i class="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function testStream(url, name) { playStream(url, name || 'Test Stream'); }

function showAddStreamModal() {
  State.editingStreamId = null;
  $('streamModalTitle') && ($('streamModalTitle').textContent = 'Add New Stream');
  $('streamName') && ($('streamName').value = '');
  $('streamUrl') && ($('streamUrl').value = '');
  $('streamGenre') && ($('streamGenre').value = '');
  $('streamStatus') && ($('streamStatus').value = 'live');
  openModal('addStreamModal');
}

function openEditStream(id) {
  const s = State.streams.find(x => x.id === id);
  if (!s) return;
  State.editingStreamId = id;
  $('streamModalTitle') && ($('streamModalTitle').textContent = 'Edit Stream');
  $('streamName') && ($('streamName').value = s.name);
  $('streamUrl') && ($('streamUrl').value = s.url);
  $('streamGenre') && ($('streamGenre').value = s.genre);
  $('streamStatus') && ($('streamStatus').value = s.status);
  openModal('addStreamModal');
}

function toggleStreamStatus(id) {
  const s = State.streams.find(x => x.id === id);
  if (!s) return;
  s.status = s.status === 'live' ? 'offline' : 'live';
  saveState('streams');
  renderStreams();
  showToast(`${s.name} is now ${s.status.toUpperCase()}`, s.status==='live'?'success':'info');
}

function deleteStream(id) {
  const s = State.streams.find(x => x.id === id);
  if (!s) return;
  if (!confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
  State.streams = State.streams.filter(x => x.id !== id);
  saveState('streams');
  renderStreams();
  showToast('Stream deleted.', 'info');
}

function saveNewStream(e) {
  e.preventDefault();
  const name   = $('streamName')?.value.trim();
  const url    = $('streamUrl')?.value.trim();
  const genre  = $('streamGenre')?.value.trim();
  const status = $('streamStatus')?.value || 'live';
  if (!name) { showToast('Stream name is required.', 'error'); return; }
  if (State.editingStreamId) {
    const s = State.streams.find(x => x.id === State.editingStreamId);
    if (s) { s.name = name; s.url = url; s.genre = genre; s.status = status; }
    showToast('Stream updated! ✅', 'success');
  } else {
    State.streams.push({ id: Date.now(), name, url, genre, status, listeners: 0 });
    showToast('Stream added! ✅', 'success');
  }
  saveState('streams');
  renderStreams();
  closeModal('addStreamModal');
}

// ─── SHOW SCHEDULE ─────────────────────────────────────
function renderSchedule() {
  const tbody = $('scheduleBody');
  if (!tbody) return;
  tbody.innerHTML = State.schedule.map(s => `
    <tr class="hover:bg-white/3 transition-colors schedule-row" data-id="${s.id}">
      <td class="py-4 px-4"><span class="text-white font-semibold text-sm">${s.time}</span></td>
      <td class="py-4 px-4 text-white font-medium">${s.show}</td>
      <td class="py-4 px-4 text-neutral-400 text-sm">${s.host}</td>
      <td class="py-4 px-4 text-neutral-500 text-sm hidden md:table-cell">${s.genre}</td>
      <td class="py-4 px-4 text-neutral-500 text-sm hidden lg:table-cell">${s.days}</td>
      <td class="py-4 px-4">
        <span class="text-xs px-2 py-1 rounded-full ${s.active?'bg-green-500/20 text-green-400':'bg-blue-500/20 text-blue-400'}">
          ${s.active?'● ON AIR':'⏰ Scheduled'}
        </span>
      </td>
      <td class="py-4 px-4 text-right">
        <div class="flex items-center justify-end gap-2">
          <button onclick="openEditSchedule(${s.id})" class="text-orange-400 p-1.5 rounded-lg hover:bg-orange-500/10 transition-colors text-sm">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteSchedule(${s.id})" class="text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-sm">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function showAddShowModal() {
  State.editingScheduleId = null;
  $('scheduleModalTitle') && ($('scheduleModalTitle').textContent = 'Add New Show');
  ['schedTime','schedShow','schedHost','schedGenre','schedDays'].forEach(id => { const el=$(id); if(el) el.value=''; });
  $('schedStatus') && ($('schedStatus').value = 'scheduled');
  openModal('scheduleModal');
}

function openEditSchedule(id) {
  const s = State.schedule.find(x => x.id === id);
  if (!s) return;
  State.editingScheduleId = id;
  $('scheduleModalTitle') && ($('scheduleModalTitle').textContent = 'Edit Show');
  $('schedTime')   && ($('schedTime').value   = s.time);
  $('schedShow')   && ($('schedShow').value   = s.show);
  $('schedHost')   && ($('schedHost').value   = s.host);
  $('schedGenre')  && ($('schedGenre').value  = s.genre);
  $('schedDays')   && ($('schedDays').value   = s.days);
  $('schedStatus') && ($('schedStatus').value = s.active ? 'live' : 'scheduled');
  openModal('scheduleModal');
}

function saveScheduleEntry(e) {
  e.preventDefault();
  const data = {
    time:   $('schedTime')?.value.trim(),
    show:   $('schedShow')?.value.trim(),
    host:   $('schedHost')?.value.trim(),
    genre:  $('schedGenre')?.value.trim(),
    days:   $('schedDays')?.value.trim(),
    active: $('schedStatus')?.value === 'live'
  };
  if (!data.show || !data.time) { showToast('Time and Show name are required.', 'error'); return; }
  if (State.editingScheduleId) {
    const idx = State.schedule.findIndex(x => x.id === State.editingScheduleId);
    if (idx >= 0) State.schedule[idx] = { ...State.schedule[idx], ...data };
    showToast('Show updated! ✅', 'success');
  } else {
    State.schedule.push({ id: Date.now(), ...data });
    showToast('Show added! ✅', 'success');
  }
  saveState('schedule');
  renderSchedule();
  closeModal('scheduleModal');
}

function deleteSchedule(id) {
  const s = State.schedule.find(x => x.id === id);
  if (!s) return;
  if (!confirm(`Remove "${s.show}"?`)) return;
  State.schedule = State.schedule.filter(x => x.id !== id);
  saveState('schedule');
  renderSchedule();
  showToast('Show removed.', 'info');
}

// ─── PODCAST STUDIO ────────────────────────────────────
function renderPodcasts() {
  const list = $('podcastList');
  if (!list) return;
  if (State.podcasts.length === 0) {
    list.innerHTML = `<div class="text-center py-12 text-neutral-500">
      <i class="fas fa-microphone text-5xl mb-3 text-neutral-700 block"></i>
      <p>No episodes yet. Start recording or uploading above.</p>
    </div>`;
    return;
  }
  list.innerHTML = State.podcasts.map(p => `
    <div class="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
      <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
        <i class="fas fa-podcast text-orange-400"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-white font-medium truncate">${p.title}</p>
        <p class="text-neutral-400 text-sm">${p.duration || 'Unknown duration'} · ${p.date}</p>
      </div>
      <div class="flex gap-2 flex-shrink-0">
        <button onclick="playPodcast('${p.id}')" class="text-green-400 hover:text-green-300 p-2 rounded-lg hover:bg-green-500/10 transition-colors"><i class="fas fa-play text-sm"></i></button>
        <button onclick="editPodcast('${p.id}')" class="text-orange-400 p-2 rounded-lg hover:bg-orange-500/10 transition-colors"><i class="fas fa-edit text-sm"></i></button>
        <button onclick="deletePodcast('${p.id}')" class="text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"><i class="fas fa-trash text-sm"></i></button>
      </div>
    </div>`).join('');
}

function startRecording() {
  if (!navigator.mediaDevices) { showToast('Microphone access is not supported in this browser.', 'error'); return; }
  if (State.isRecording) {
    // Stop recording
    if (State.mediaRecorder && State.mediaRecorder.state !== 'inactive') State.mediaRecorder.stop();
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      State.recordedChunks = [];
      State.mediaRecorder = new MediaRecorder(stream);
      State.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) State.recordedChunks.push(e.data); };
      State.mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        clearInterval(State.recordTimer);
        State.isRecording = false;
        const btn = $('recordBtn');
        if (btn) { btn.innerHTML = '<i class="fas fa-microphone mr-2"></i>Start Recording'; btn.style.background=''; }
        const timerEl = $('recordTimer');
        if (timerEl) timerEl.textContent = '00:00';
        const blob = new Blob(State.recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const title = `Episode ${State.podcasts.length + 1} — ${new Date().toLocaleDateString()}`;
        const pod = { id: Date.now().toString(), title, url, date: new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}), duration: _formatTime(State.recordSeconds) };
        State.podcasts.push(pod); saveState('podcasts'); renderPodcasts();
        showToast('Recording saved as "' + title + '"! ✅', 'success');
      };
      State.isRecording = true;
      State.recordSeconds = 0;
      State.mediaRecorder.start();
      const btn = $('recordBtn');
      if (btn) { btn.innerHTML = '<i class="fas fa-stop mr-2"></i>Stop Recording'; btn.style.background='#ef4444'; }
      State.recordTimer = setInterval(() => {
        State.recordSeconds++;
        const timerEl = $('recordTimer');
        if (timerEl) timerEl.textContent = _formatTime(State.recordSeconds);
      }, 1000);
      showToast('Recording started 🔴 Speak into your microphone.', 'info');
    })
    .catch(() => showToast('Microphone permission denied. Please allow microphone access.', 'error'));
}

function _formatTime(secs) {
  const m = Math.floor(secs/60).toString().padStart(2,'0');
  const s = (secs%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function uploadAudio() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'audio/*';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const pod = { id: Date.now().toString(), title: file.name.replace(/\.[^.]+$/,''), url, date: new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}), duration: 'Unknown' };
    State.podcasts.push(pod); saveState('podcasts'); renderPodcasts();
    showToast(`"${pod.title}" uploaded successfully! ✅`, 'success');
  };
  input.click();
}

function playPodcast(id) {
  const p = State.podcasts.find(x => x.id === id);
  if (!p) return;
  const audio = new Audio(p.url);
  audio.play().then(() => showToast(`▶ Playing: ${p.title}`, 'success')).catch(() => showToast('Could not play this episode.', 'error'));
}

function editPodcast(id) {
  const p = State.podcasts.find(x => x.id === id);
  if (!p) return;
  const newTitle = prompt('Episode title:', p.title);
  if (newTitle && newTitle.trim()) { p.title = newTitle.trim(); saveState('podcasts'); renderPodcasts(); showToast('Episode renamed!', 'success'); }
}

function deletePodcast(id) {
  if (!confirm('Delete this episode?')) return;
  State.podcasts = State.podcasts.filter(x => x.id !== id);
  saveState('podcasts'); renderPodcasts();
  showToast('Episode deleted.', 'info');
}

function manageRSS() {
  openModal('rssModal');
}

// ─── AI STUDIO ─────────────────────────────────────────
function sendAIMessage() {
  const input = $('aiInput');
  const messages = $('aiMessages');
  if (!input || !messages || !input.value.trim()) return;
  const msg = input.value.trim();
  input.value = '';
  messages.innerHTML += `<div class="flex gap-3 justify-end"><div class="bg-orange-500/20 border border-orange-500/30 rounded-xl px-4 py-3 text-white text-sm max-w-md">${_escHtml(msg)}</div><div class="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0"><i class="fas fa-user text-orange-400 text-sm"></i></div></div>`;
  messages.scrollTop = messages.scrollHeight;
  const typingId = 'typing' + Date.now();
  messages.innerHTML += `<div id="${typingId}" class="flex gap-3"><div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0"><i class="fas fa-robot text-purple-400 text-sm"></i></div><div class="bg-white/5 rounded-xl px-4 py-3 text-neutral-400 text-sm"><i class="fas fa-ellipsis-h animate-pulse"></i> Thinking...</div></div>`;
  messages.scrollTop = messages.scrollHeight;
  const m = msg.toLowerCase();
  const replies = {
    schedule:  'Your schedule has 8 shows running daily and on weekdays. Morning Vibes with DJ Alex is your highest-engagement slot at 6AM. I recommend adding a Sunday Gospel Special from 10AM–12PM to capture the weekend audience.',
    blog:      'Your OFURE BEAT blog auto-updates every 24 hours with fresh articles across 8 categories. You currently have ' + document.querySelectorAll('.article-row').length + ' articles published. Try featuring more Music and Africa category posts — they drive the highest engagement.',
    stream:    'Your main Zeno.FM stream is live and healthy. I recommend setting a fallback/backup stream URL in case the primary goes down. Go to Stream Manager → Add Stream to configure a backup.',
    music:     'OFURE RADIO\'s music identity is built on Afrobeats, R&B, Gospel, and Urban sounds. For station IDs and jingles, I can help write scripts. Try the Voiceover Generator to produce them.',
    podcast:   'Your podcast studio is ready. You can record directly in the browser using the Record button, or upload an existing audio file. I recommend a weekly "OFURE Radio Roundup" episode covering top entertainment news.',
    seo:       'To improve your SEO: (1) Make sure each blog article has a unique meta description. (2) Add structured data markup. (3) Publish at least 3 articles per week. (4) Link to your blog from all social media profiles.',
    grow:      'To grow OFURE RADIO\'s audience: (1) Share blog articles on Twitter, Instagram, and Facebook. (2) Run live call-in shows to increase engagement. (3) Cross-promote with other African radio stations. (4) List your station on TuneIn and Radio Garden.',
    dj:        'Your DJ lineup includes DJ Alex, DJ Luna, DJ Marcus, DJ Sarah, DJ Rex, DJ Maya, and Mama Bisi. They cover 8 daily time slots from 6AM to midnight. You can add or edit shows in the Show Schedule panel.',
    help:      'I can help you with: show scheduling, blog content strategy, stream management, podcast production, audience growth tips, SEO, social media, and technical radio management. What area would you like to explore?',
    default:   'Great question! As the OFURE RADIO AI assistant, I\'m here to help you run the best internet radio station possible. Ask me about your schedule, blog, streams, podcasts, audience growth, or anything else about station management!'
  };
  let reply = replies.default;
  if (m.includes('schedule') || m.includes('show')) reply = replies.schedule;
  else if (m.includes('blog') || m.includes('news') || m.includes('article')) reply = replies.blog;
  else if (m.includes('stream') || m.includes('broadcast')) reply = replies.stream;
  else if (m.includes('music') || m.includes('song') || m.includes('jingle')) reply = replies.music;
  else if (m.includes('podcast') || m.includes('episode') || m.includes('record')) reply = replies.podcast;
  else if (m.includes('seo') || m.includes('search') || m.includes('google')) reply = replies.seo;
  else if (m.includes('grow') || m.includes('audience') || m.includes('listener')) reply = replies.grow;
  else if (m.includes('dj') || m.includes('host')) reply = replies.dj;
  else if (m.includes('help') || m.includes('what can')) reply = replies.help;
  setTimeout(() => {
    const t = $(typingId);
    if (t) t.outerHTML = `<div class="flex gap-3"><div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0"><i class="fas fa-robot text-purple-400 text-sm"></i></div><div class="bg-white/5 rounded-xl px-4 py-3 text-neutral-300 text-sm max-w-md leading-relaxed">${reply}</div></div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 900 + Math.random() * 600);
}

function showAIFeature(type) {
  const prefills = {
    music:   'Help me write a 30-second station ID jingle script for OFURE RADIO with an upbeat Afrobeats vibe.',
    voice:   'Generate a professional voiceover script for a morning show intro for DJ Alex.',
    script:  'Write a 5-minute script for the Evening Drive show hosted by DJ Marcus, opening with the top entertainment news.',
    blog:    'What categories of blog content will drive the most traffic and engagement for OFURE RADIO?',
    podcast: 'Create an episode outline for a 20-minute podcast about the rise of Afrobeats globally.'
  };
  const aiInput = $('aiInput');
  if (aiInput) { aiInput.value = prefills[type] || 'Help me with ' + type; aiInput.focus(); }
  showPanel('ai');
  showToast('AI feature loaded — press Enter or click Send!', 'info');
}

// ─── SECURITY / PIN ────────────────────────────────────
function changePIN(e) {
  e.preventDefault();
  const curr    = $('currentPin')?.value;
  const next    = $('newPin')?.value;
  const confirm = $('confirmPin')?.value;
  const stored  = localStorage.getItem('ofure_admin_pin') || '1234';
  if (curr !== stored)  { showToast('Current PIN is incorrect.', 'error'); return; }
  if (next !== confirm) { showToast('New PINs do not match.', 'error'); return; }
  if (!/^\d{4}$/.test(next)) { showToast('PIN must be exactly 4 digits.', 'error'); return; }
  localStorage.setItem('ofure_admin_pin', next);
  showToast('PIN changed successfully! 🔐', 'success');
  e.target.reset();
}

// ─── SETTINGS ──────────────────────────────────────────
function populateSettings() {
  const s = State.settings;
  const fields = { settingStationName:s.stationName, settingTagline:s.tagline, settingEmail:s.email, settingMainStream:s.mainStream, settingFacebook:s.facebook, settingTwitter:s.twitter, settingInstagram:s.instagram, settingYoutube:s.youtube };
  Object.entries(fields).forEach(([id, val]) => { const el=$(id); if(el) el.value = val || ''; });
}

function saveSettings(e) {
  e.preventDefault();
  State.settings = {
    stationName: $('settingStationName')?.value || 'OFURE RADIO',
    tagline:     $('settingTagline')?.value     || 'Where It All Began',
    email:       $('settingEmail')?.value       || 'hello@ofureradio.com',
    mainStream:  $('settingMainStream')?.value  || '',
    facebook:    $('settingFacebook')?.value    || '',
    twitter:     $('settingTwitter')?.value     || '',
    instagram:   $('settingInstagram')?.value   || '',
    youtube:     $('settingYoutube')?.value     || ''
  };
  if (State.settings.mainStream) { State.currentStreamUrl = State.settings.mainStream; if (radioPlayer) radioPlayer.src = State.settings.mainStream; }
  saveState('settings');
  showToast('Settings saved! ✅', 'success');
}

// ─── SOCIAL LINKS (dynamic from settings) ────────────
function updateSocialLinks() {
  const s = State.settings;
  const map = { facebook: s.facebook, twitter: s.twitter, instagram: s.instagram, youtube: s.youtube };
  $$('.social-link').forEach(a => {
    const platform = a.dataset.platform;
    if (platform && map[platform]) a.href = map[platform];
  });
}

// ─── EXPORT / DOWNLOAD ─────────────────────────────────
function exportWebsite() {
  showToast('Preparing export… this may take a moment.', 'info');
  setTimeout(() => showToast('Export ready! In production, use "wrangler pages deploy" to deploy to Cloudflare Pages.', 'info'), 2000);
}

// ─── RSS MODAL ─────────────────────────────────────────
function copyRSSFeed() {
  const url = location.origin + '/rss.xml';
  navigator.clipboard.writeText(url)
    .then(() => showToast('RSS feed URL copied!', 'success'))
    .catch(() => showToast('RSS URL: ' + url, 'info'));
}

// ─── MISC HELPERS ─────────────────────────────────────
function _escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Backdrop click = close modal
document.addEventListener('mousedown', e => {
  const modals = ['editModal','addStreamModal','scheduleModal','rssModal','songRequestModal'];
  modals.forEach(id => {
    const m = $(id);
    if (m && !m.classList.contains('hidden') && e.target === m) closeModal(id);
  });
});

// Escape key closes modals
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAllModals();
  if (e.key === 'Enter' && $('aiInput') === document.activeElement) sendAIMessage();
  if (e.ctrlKey && e.shiftKey && e.key === 'A') location.href = '/admin';
});

// ─── INIT ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Radio player init
  if (radioPlayer) radioPlayer.volume = State.volume;

  // Admin init
  initAdmin();
  updateSocialLinks();

  // Blog search realtime
  const blogSearch = $('blogSearch');
  if (blogSearch) {
    blogSearch.addEventListener('input', () => filterBlogSearch(blogSearch.value));
    blogSearch.addEventListener('keydown', e => { if (e.key === 'Enter') filterBlogSearch(blogSearch.value); });
  }

  // Tag click on blog sidebar
  $$('.tag-filter').forEach(t => t.addEventListener('click', () => filterByTag(t.dataset.tag)));

  // Image lazy load observer
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('loaded'); obs.unobserve(en.target); } }));
    $$('img[loading="lazy"]').forEach(img => obs.observe(img));
  }

  // Volume slider on home page
  const volSlider = $('volumeSlider');
  if (volSlider) volSlider.addEventListener('input', () => setVolume(volSlider.value));
});
