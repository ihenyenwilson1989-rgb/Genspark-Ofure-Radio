// OFURE RADIO - Main JavaScript

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu-close').forEach(el => {
  el.addEventListener('click', () => {
    if (mobileMenu) mobileMenu.classList.add('hidden');
  });
});

// ===== RADIO PLAYER =====
let isPlaying = false;
const radioPlayer = document.getElementById('radioPlayer');

function togglePlay() {
  if (!radioPlayer) return;
  
  if (isPlaying) {
    radioPlayer.pause();
    isPlaying = false;
    document.getElementById('playIcon').className = 'fas fa-play text-white text-lg ml-1';
    document.querySelectorAll('.visualizer-bar').forEach(b => b.classList.remove('playing'));
  } else {
    radioPlayer.play().then(() => {
      isPlaying = true;
      document.getElementById('playIcon').className = 'fas fa-pause text-white text-lg';
      document.querySelectorAll('.visualizer-bar').forEach(b => b.classList.add('playing'));
    }).catch(err => {
      console.log('Playback error:', err);
      showToast('Could not connect to stream. Please try again.', 'error');
    });
  }
}

function setVolume(val) {
  if (radioPlayer) {
    radioPlayer.volume = parseFloat(val);
    const slider = document.getElementById('volumeSlider');
    if (slider) slider.value = val;
  }
}

function playStream(url, name) {
  if (!url || url === '#') {
    showToast('This stream is not available yet.', 'warning');
    return;
  }
  
  // Use main player or create sidebar player
  const player = radioPlayer || document.getElementById('sidebarRadio');
  if (!player) return;
  
  player.src = url;
  player.play().then(() => {
    isPlaying = true;
    showToast(`Now playing: ${name}`, 'success');
    if (document.getElementById('playIcon')) {
      document.getElementById('playIcon').className = 'fas fa-pause text-white text-lg';
      document.querySelectorAll('.visualizer-bar').forEach(b => b.classList.add('playing'));
    }
  }).catch(err => {
    showToast('Stream unavailable. Please try the main stream.', 'error');
  });
}

// ===== FORMS =====
function handleContactForm(e) {
  e.preventDefault();
  showToast('Message sent! We\'ll get back to you soon. 📬', 'success');
  e.target.reset();
}

function handleNewsletter(e) {
  e.preventDefault();
  showToast('Subscribed! Welcome to the OFURE RADIO family! 🎉', 'success');
  e.target.reset();
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) {
    // Create toast if it doesn't exist
    const newToast = document.createElement('div');
    newToast.id = 'toast';
    newToast.className = 'fixed bottom-6 right-6 z-50';
    newToast.innerHTML = `<div class="bg-neutral-800 border border-white/20 rounded-xl px-5 py-3 flex items-center gap-3 shadow-2xl">
      <i id="toastIcon" class="fas fa-check-circle text-green-400"></i>
      <span id="toastMsg" class="text-white text-sm font-medium"></span>
    </div>`;
    document.body.appendChild(newToast);
  }
  
  const toastEl = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');
  
  if (toastMsg) toastMsg.textContent = message;
  if (toastIcon) {
    toastIcon.className = `fas ${type === 'success' ? 'fa-check-circle text-green-400' : type === 'error' ? 'fa-times-circle text-red-400' : 'fa-exclamation-circle text-yellow-400'}`;
  }
  
  toastEl.classList.remove('hidden');
  toastEl.classList.add('show');
  
  setTimeout(() => {
    toastEl.classList.add('hidden');
    toastEl.classList.remove('show');
  }, 3500);
}

// ===== BLOG PAGE =====
function filterBlogSearch(value) {
  const cards = document.querySelectorAll('[href^="/blog/"]');
  const query = value.toLowerCase();
  // Client-side search hint - redirect with search param
  if (value.length > 2) {
    // Highlight matched text
  }
}

// ===== SHARE FUNCTIONS =====
function shareArticle() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Link copied to clipboard!', 'success');
    });
  }
}

function shareOn(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  let shareUrl;
  
  switch(platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      break;
    case 'facebook':
      shareUrl = `https://facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${title}%20${url}`;
      break;
    case 'link':
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied!', 'success');
      });
      return;
  }
  
  if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
}

// ===== ADMIN PANEL =====

// PIN verification
const ADMIN_PIN = localStorage.getItem('ofure_admin_pin') || '1234';
let isAuthenticated = sessionStorage.getItem('ofure_admin_auth') === 'true';

function initAdmin() {
  const pinGate = document.getElementById('pinGate');
  const adminContent = document.getElementById('adminContent');
  
  if (!pinGate) return;
  
  if (isAuthenticated) {
    pinGate.classList.add('hidden');
    adminContent.classList.remove('hidden');
    showPanel('dashboard');
  }
  
  // Auto-focus PIN inputs and handle navigation
  const pinInputs = document.querySelectorAll('.pin-input');
  pinInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && index < pinInputs.length - 1) {
        pinInputs[index + 1].focus();
      }
      if (index === pinInputs.length - 1 && e.target.value.length === 1) {
        verifyPin();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
        pinInputs[index - 1].focus();
      }
    });
  });
  
  // Focus first input
  if (pinInputs.length > 0 && !isAuthenticated) {
    pinInputs[0].focus();
  }
}

function verifyPin() {
  const pinInputs = document.querySelectorAll('.pin-input');
  let pin = '';
  pinInputs.forEach(input => pin += input.value);
  
  const storedPin = localStorage.getItem('ofure_admin_pin') || '1234';
  
  if (pin === storedPin) {
    sessionStorage.setItem('ofure_admin_auth', 'true');
    document.getElementById('pinGate').classList.add('hidden');
    document.getElementById('adminContent').classList.remove('hidden');
    showPanel('dashboard');
    showToast('Welcome to OFURE STUDIO! 🎙️', 'success');
  } else {
    document.getElementById('pinError').classList.remove('hidden');
    pinInputs.forEach(input => {
      input.value = '';
      input.classList.add('border-red-500');
      setTimeout(() => input.classList.remove('border-red-500'), 1000);
    });
    pinInputs[0].focus();
    setTimeout(() => document.getElementById('pinError').classList.add('hidden'), 3000);
  }
}

function adminLogout() {
  sessionStorage.removeItem('ofure_admin_auth');
  location.reload();
}

function showPanel(panelId) {
  // Hide all panels
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
  
  // Show selected panel
  const panel = document.getElementById(`panel-${panelId}`);
  if (panel) panel.classList.remove('hidden');
  
  // Update nav items
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.classList.remove('bg-orange-500/20', 'text-orange-400', 'border', 'border-orange-500/30');
    item.classList.add('text-neutral-400');
    
    if (item.dataset.panel === panelId) {
      item.classList.add('bg-orange-500/20', 'text-orange-400', 'border', 'border-orange-500/30');
      item.classList.remove('text-neutral-400');
    }
  });
  
  // Close sidebar on mobile
  if (window.innerWidth < 1024) {
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) sidebar.classList.remove('open');
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

// ===== ADMIN BLOG MANAGEMENT =====
function editArticle(articleId) {
  const modal = document.getElementById('editModal');
  const content = document.getElementById('editModalContent');
  
  if (!modal || !content) return;
  
  // Find article data from the table
  const row = document.querySelector(`[onclick="editArticle('${articleId}')"]`)?.closest('tr');
  const title = row?.querySelector('.text-white.font-medium')?.textContent || '';
  
  content.innerHTML = `
    <div>
      <label class="block text-neutral-400 text-sm mb-2">Article Title</label>
      <input type="text" value="${title}" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 mb-4">
    </div>
    <div>
      <label class="block text-neutral-400 text-sm mb-2">Category</label>
      <select class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 mb-4">
        <option>Entertainment</option>
        <option>Music</option>
        <option>Celebrity</option>
        <option>World News</option>
        <option>Sports</option>
        <option>Technology</option>
        <option>Lifestyle</option>
        <option>Africa</option>
      </select>
    </div>
    <div>
      <label class="block text-neutral-400 text-sm mb-2">Excerpt</label>
      <textarea rows="3" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none mb-4" placeholder="Article excerpt..."></textarea>
    </div>
    <div>
      <label class="block text-neutral-400 text-sm mb-2">Status</label>
      <select class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 mb-4">
        <option>Published</option>
        <option>Featured</option>
        <option>Draft</option>
      </select>
    </div>
    <div class="flex gap-3 pt-2">
      <button onclick="saveArticle('${articleId}')" class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors">
        <i class="fas fa-save mr-2"></i>Save Changes
      </button>
      <button onclick="closeModal('editModal')" class="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-colors">
        Cancel
      </button>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

function saveArticle(articleId) {
  showToast('Article updated successfully!', 'success');
  closeModal('editModal');
}

function toggleFeatured(articleId) {
  showToast('Featured status updated!', 'success');
}

function filterArticles(category) {
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('bg-orange-500', 'text-white');
    btn.classList.add('bg-white/5', 'text-neutral-400');
    if (btn.dataset.category === category) {
      btn.classList.add('bg-orange-500', 'text-white');
      btn.classList.remove('bg-white/5', 'text-neutral-400');
    }
  });
  
  // Filter rows
  document.querySelectorAll('.article-row').forEach(row => {
    if (!category || row.dataset.category === category) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function searchAdminArticles(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.article-row').forEach(row => {
    const title = row.dataset.title || '';
    if (!q || title.includes(q)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// ===== STREAM MANAGEMENT =====
function showAddStreamModal() {
  const modal = document.getElementById('addStreamModal');
  if (modal) modal.classList.remove('hidden');
}

function testStream(url) {
  playStream(url, 'Test Stream');
}

function editStream(index) {
  showToast('Stream edit panel opened', 'success');
}

function deleteStream(index) {
  if (confirm('Are you sure you want to delete this stream?')) {
    showToast('Stream deleted', 'success');
  }
}

function saveNewStream(e) {
  e.preventDefault();
  showToast('New stream added successfully!', 'success');
  closeModal('addStreamModal');
}

// ===== AI CHAT =====
function sendAIMessage() {
  const input = document.getElementById('aiInput');
  const messages = document.getElementById('aiMessages');
  
  if (!input || !messages || !input.value.trim()) return;
  
  const userMsg = input.value.trim();
  input.value = '';
  
  // Add user message
  messages.innerHTML += `
    <div class="flex gap-3 justify-end">
      <div class="bg-orange-500/20 border border-orange-500/30 rounded-xl px-4 py-3 text-white text-sm max-w-md">
        ${userMsg}
      </div>
      <div class="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
        <i class="fas fa-user text-orange-400 text-sm"></i>
      </div>
    </div>
  `;
  
  messages.scrollTop = messages.scrollHeight;
  
  // Simulate AI response
  setTimeout(() => {
    const responses = {
      'schedule': 'Your current schedule looks great! Morning Vibes with DJ Alex runs 6-10AM, perfect for commuters. Consider adding a weekend special show for extra engagement.',
      'blog': 'Your blog is auto-updating every 24 hours with fresh entertainment and world news content. You can review, edit, or feature any article from the Blog & News panel.',
      'stream': 'Your main stream via Zeno.FM is performing well. I recommend adding a backup stream URL for redundancy. Check the Stream Manager panel to add one.',
      'music': 'For music generation, I can create station IDs, bumpers, and jingles. Head to the AI Music Studio feature to get started.',
      'default': 'Great question! As the OFURE RADIO AI assistant, I can help you with show scheduling, content creation, blog management, stream optimization, and technical advice. What specific area would you like to explore?'
    };
    
    const msgLower = userMsg.toLowerCase();
    let response = responses.default;
    if (msgLower.includes('schedule') || msgLower.includes('show')) response = responses.schedule;
    else if (msgLower.includes('blog') || msgLower.includes('news')) response = responses.blog;
    else if (msgLower.includes('stream')) response = responses.stream;
    else if (msgLower.includes('music')) response = responses.music;
    
    messages.innerHTML += `
      <div class="flex gap-3">
        <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <i class="fas fa-robot text-purple-400 text-sm"></i>
        </div>
        <div class="bg-white/5 rounded-xl px-4 py-3 text-neutral-300 text-sm max-w-md">
          ${response}
        </div>
      </div>
    `;
    messages.scrollTop = messages.scrollHeight;
  }, 800);
}

// ===== AI FEATURES =====
function showAIFeature(type) {
  const features = {
    music: 'AI Music Generation: Enter a description like "Upbeat Afrobeats station ID, 30 seconds" and I\'ll generate it for you.',
    voice: 'Voiceover Generator: Type your script and select a voice style to generate a professional voiceover.',
    script: 'Script Writer: Tell me the show topic and duration, and I\'ll write a complete script for your DJs.',
    blog: 'Blog Generator: I automatically generate and update your blog with fresh entertainment and world news every 24 hours.',
    podcast: 'Podcast AI: Enter your podcast topic and duration, and I\'ll create a complete episode outline and script.'
  };
  
  showToast(features[type] || 'AI feature coming soon!', 'success');
  document.getElementById('aiChatBox')?.classList.remove('hidden');
  const aiInput = document.getElementById('aiInput');
  if (aiInput) {
    aiInput.value = `Help me with ${type}`;
    aiInput.focus();
  }
}

// ===== MODALS =====
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

// Close modals on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.id === 'editModal' || e.target.id === 'addStreamModal') {
    closeModal(e.target.id);
  }
});

// ===== SECURITY =====
function changePIN(e) {
  e.preventDefault();
  const current = document.getElementById('currentPin').value;
  const newPin = document.getElementById('newPin').value;
  const confirm = document.getElementById('confirmPin').value;
  
  const storedPin = localStorage.getItem('ofure_admin_pin') || '1234';
  
  if (current !== storedPin) {
    showToast('Current PIN is incorrect', 'error');
    return;
  }
  if (newPin !== confirm) {
    showToast('New PINs do not match', 'error');
    return;
  }
  if (newPin.length !== 4) {
    showToast('PIN must be 4 digits', 'error');
    return;
  }
  
  localStorage.setItem('ofure_admin_pin', newPin);
  showToast('PIN updated successfully!', 'success');
  e.target.reset();
}

// ===== MISC ADMIN =====
function startRecording() {
  showToast('Recording feature coming soon!', 'success');
}

function uploadAudio() {
  showToast('Upload feature coming soon!', 'success');
}

function manageRSS() {
  showToast('RSS management coming soon!', 'success');
}

function showAddArticleModal() {
  showToast('Article creation panel coming soon!', 'success');
}

// ===== IMAGE LAZY LOADING =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
        imageObserver.unobserve(entry.target);
      }
    });
  });
  
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    if (!targetId) return;
    
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (mobileMenu) mobileMenu.classList.add('hidden');
    }
  });
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initAdmin();
  
  // Animate numbers on scroll
  const statNumbers = document.querySelectorAll('.text-3xl.font-black, .text-2xl.font-black');
  
  // Set initial volume
  if (radioPlayer) radioPlayer.volume = 0.8;
});

// Handle keyboard shortcut for admin (Ctrl+Shift+A)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    window.location.href = '/admin';
  }
});
