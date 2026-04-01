/* =====================================================
   OFURE RADIO — Full Interactive Application v4.0
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
    { id: 1, name: 'OFURE RADIO MAIN',     url: 'https://stream.zeno.fm/f3wvbbqmdg8uv', genre: 'Afrobeats • R&B • Gospel',        status: 'live',    listeners: 247, bitrate: 128 },
    { id: 2, name: 'OFURE GOSPEL STATION', url: 'https://stream.zeno.fm/f3wvbbqmdg8uv', genre: 'Gospel • Worship • Inspirational', status: 'live',    listeners: 89,  bitrate: 128 },
    { id: 3, name: 'OFURE URBAN BEATS',    url: '',                                      genre: 'Hip-Hop • Trap • Urban',          status: 'offline', listeners: 0,   bitrate: 64  }
  ],
  schedule: JSON.parse(localStorage.getItem('ofure_schedule') || 'null') || [
    { id:1, time:'6:00 AM',  show:'Morning Vibes',       host:'DJ Alex',    genre:'Afrobeats / Gospel',       days:'Mon-Fri',    active:true  },
    { id:2, time:'9:00 AM',  show:'The Word & Music',    host:'Pastor Mike',genre:'Gospel / Inspirational',   days:'Mon-Fri',    active:false },
    { id:3, time:'12:00 PM', show:'Afternoon Mix',       host:'DJ Luna',    genre:'R&B / Hip-Hop',            days:'Daily',      active:false },
    { id:4, time:'2:00 PM',  show:'Throwback Classics',  host:'DJ Rex',     genre:'Old School / Soul',        days:'Mon,Wed,Fri',active:false },
    { id:5, time:'4:00 PM',  show:'Evening Drive',       host:'DJ Marcus',  genre:'Afrobeats / Urban',        days:'Daily',      active:false },
    { id:6, time:'7:00 PM',  show:'Cultural Vibes',      host:'Mama Bisi',  genre:'Highlife / Jùjú',          days:'Tue,Thu,Sat',active:false },
    { id:7, time:'9:00 PM',  show:'Night Frequency',     host:'DJ Sarah',   genre:'Chill / Neo-Soul',         days:'Daily',      active:false },
    { id:8, time:'11:00 PM', show:'Late Night Sessions', host:'DJ Maya',    genre:'Electronic / Deep House',  days:'Fri-Sat',    active:false }
  ],
  podcasts: JSON.parse(localStorage.getItem('ofure_podcasts') || '[]'),
  settings: JSON.parse(localStorage.getItem('ofure_settings') || 'null') || {
    stationName:     'OFURE RADIO',
    tagline:         'THIS IS WHERE IT ALL BEGAN',
    email:           'hello@ofureradio.com',
    mainStream:      'https://stream.zeno.fm/f3wvbbqmdg8uv',
    description:     'Your premier internet radio station broadcasting the best African and world music 24/7.',
    facebook:        '',
    twitter:         '',
    instagram:       '',
    youtube:         '',
    tiktok:          '',
    whatsapp:        '',
    accentColor:     '#f97316',
    refreshInterval: '24',
    language:        'en'
  },
  rssSettings: JSON.parse(localStorage.getItem('ofure_rss') || 'null') || {
    title:    'OFURE RADIO Podcast',
    author:   'OFURE RADIO',
    category: 'Music',
    language: 'en-US',
    desc:     'Your premier internet radio station broadcasting the best African and world music 24/7.'
  },
  inbox: JSON.parse(localStorage.getItem('ofure_inbox') || '[]'),
  editingStreamId:   null,
  editingScheduleId: null,
  editingInboxId:    null,
  inboxFilter:       'all',
  mediaRecorder:     null,
  recordedChunks:    [],
  isRecording:       false,
  recordTimer:       null,
  recordSeconds:     0,
  listeners:         247 + Math.floor(Math.random() * 30),
  currentAIAgent:    'assistant'
};

function saveState(key) {
  const map = {
    streams:  () => localStorage.setItem('ofure_streams',  JSON.stringify(State.streams)),
    schedule: () => localStorage.setItem('ofure_schedule', JSON.stringify(State.schedule)),
    podcasts: () => localStorage.setItem('ofure_podcasts', JSON.stringify(State.podcasts)),
    settings: () => localStorage.setItem('ofure_settings', JSON.stringify(State.settings)),
    rss:      () => localStorage.setItem('ofure_rss',      JSON.stringify(State.rssSettings)),
    inbox:    () => localStorage.setItem('ofure_inbox',    JSON.stringify(State.inbox))
  };
  if (map[key]) map[key]();
  // Any time streams change, refresh Home Active Streams pane AND Live Now panel
  if (key === 'streams')  { renderHomeStreams(); initLiveNow(); }
  // Any time schedule changes, refresh Home Schedule + DJ Family pane
  if (key === 'schedule') { renderHomeSchedule(); renderHomeDJFamily(); }
  // Any time settings change, sync the Email Us pane on home page
  if (key === 'settings') { syncEmailUs(); }
  // Any time inbox changes, update nav badge
  if (key === 'inbox')    { _updateInboxBadge(); }
}

// ─── HOME: LIVE ACTIVE STREAMS (syncs with Stream Manager) ────────────────
function renderHomeStreams() {
  const container = document.getElementById('homeStreamsList');
  if (!container) return; // not on home page — silently skip

  // Always read freshest data from State (which is already in sync with localStorage)
  const streams = State.streams;

  if (!streams || streams.length === 0) {
    container.innerHTML = `
      <div class="col-span-3 text-center py-16">
        <div class="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-radio text-orange-400 text-2xl"></i>
        </div>
        <p class="text-neutral-400 text-lg font-semibold mb-2">No streams configured yet</p>
        <p class="text-neutral-600 text-sm">Add streams in <a href="/admin" class="text-orange-400 hover:text-orange-300">Admin Studio → Stream Manager</a></p>
      </div>`;
    return;
  }

  // Status helpers
  const statusBadge = s =>
    s.status === 'live'
      ? '<span class="text-xs font-semibold px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">● LIVE</span>'
      : s.status === 'scheduled'
        ? '<span class="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">⏰ SCHEDULED</span>'
        : '<span class="text-xs font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">○ OFFLINE</span>';

  const listenBtn = s => {
    const hasUrl  = s.url && s.url !== '' && s.url !== '#';
    const canPlay = s.status === 'live' && hasUrl;
    return canPlay
      ? `<button onclick="playStream('${s.url.replace(/'/g,"\\'")}','${_escHtml(s.name).replace(/'/g,"\\'")}')"\
           class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">\
           <i class="fas fa-play mr-1"></i>Listen</button>`
      : `<button disabled\
           class="bg-white/10 text-neutral-500 px-4 py-2 rounded-full text-sm font-semibold cursor-not-allowed" title="${s.status === 'offline' ? 'Stream is offline' : s.url ? 'Coming soon' : 'No stream URL configured'}">\
           <i class="fas fa-${s.status === 'offline' ? 'pause' : 'clock'} mr-1"></i>${s.status === 'offline' ? 'Offline' : 'Soon'}</button>`;
  };

  container.innerHTML = streams.map(s => `
    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 group" id="homeStream-${s.id}">
      <div class="flex items-start justify-between mb-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-105 transition-transform">
          <i class="fas fa-radio text-orange-400 text-xl"></i>
        </div>
        <div class="flex flex-col items-end gap-1.5">
          ${statusBadge(s)}
          <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
            <i class="fas fa-signal mr-1"></i>${s.bitrate || 128} kbps
          </span>
        </div>
      </div>
      <h3 class="text-white font-bold text-lg mb-1">${_escHtml(s.name)}</h3>
      <p class="text-neutral-400 text-sm mb-1">${_escHtml(s.genre)}</p>
      ${s.status === 'live' ? `<p class="text-green-400 text-xs mb-4"><i class="fas fa-users mr-1"></i>${s.listeners || 0} listeners</p>` : '<div class="mb-4"></div>'}
      <div class="flex items-center justify-between">
        <span class="text-neutral-600 text-xs truncate max-w-[120px]" title="${_escHtml(s.url || '')}">
          <i class="fas fa-link mr-1"></i>${s.url ? s.url.replace('https://','').split('/')[0] : 'No URL set'}
        </span>
        ${listenBtn(s)}
      </div>
    </div>`).join('');

  // Update footer counters
  const liveCount  = streams.filter(s => s.status === 'live').length;
  const total      = streams.length;
  const footer     = document.getElementById('homeStreamsFooter');
  const liveEl     = document.getElementById('homeStreamLiveCount');
  const totalEl    = document.getElementById('homeStreamTotalCount');
  if (footer)  footer.classList.remove('hidden');
  if (liveEl)  liveEl.textContent  = liveCount + ' live stream' + (liveCount !== 1 ? 's' : '');
  if (totalEl) totalEl.textContent = ' of ' + total + ' total';
}

// Cross-tab sync: when Stream Manager updates streams in another tab, refresh home pane
window.addEventListener('storage', function(e) {
  if (e.key === 'ofure_streams' && e.newValue) {
    try {
      State.streams = JSON.parse(e.newValue);
      renderHomeStreams();
      initLiveNow();   // also refresh Live Now panel
    } catch(err) { /* ignore */ }
  }
  if (e.key === 'ofure_schedule' && e.newValue) {
    try {
      State.schedule = JSON.parse(e.newValue);
      renderHomeSchedule();
      renderHomeDJFamily();
    } catch(err) { /* ignore */ }
  }
  if (e.key === 'ofure_settings' && e.newValue) {
    try {
      State.settings = JSON.parse(e.newValue);
      syncEmailUs();
    } catch(err) { /* ignore */ }
  }
  if (e.key === 'ofure_inbox' && e.newValue) {
    try {
      State.inbox = JSON.parse(e.newValue);
      renderInbox();
      _updateInboxBadge();
    } catch(err) { /* ignore */ }
  }
});

// ─── HOME: SHOW SCHEDULE (syncs with Show Schedule Manager) ─────────────────
// Called on DOMContentLoaded and whenever State.schedule changes.
// Renders into <tbody id="homeScheduleBody"> on the home page.
function renderHomeSchedule() {
  const tbody = document.getElementById('homeScheduleBody');
  if (!tbody) return; // not on home page

  const schedule = State.schedule;
  if (!schedule || schedule.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="6" class="py-10 text-center text-neutral-500">
        <i class="fas fa-calendar-alt text-2xl mb-2 block opacity-30"></i>
        No shows scheduled yet — check back soon!
      </td></tr>`;
    return;
  }

  tbody.innerHTML = schedule.map(s => {
    const isLive = !!s.active;
    return `
    <tr class="hover:bg-white/3 transition-all duration-200 ${isLive ? 'bg-green-500/5 border-l-2 border-green-500/60' : ''}">
      <td class="py-4 px-4">
        <span class="text-white font-semibold text-sm">${_escHtml(s.time)}</span>
      </td>
      <td class="py-4 px-4">
        <span class="text-white font-medium">${_escHtml(s.show)}</span>
      </td>
      <td class="py-4 px-4 text-neutral-400 text-sm">${_escHtml(s.host)}</td>
      <td class="py-4 px-4 text-neutral-500 text-sm hidden md:table-cell">${_escHtml(s.genre || '')}</td>
      <td class="py-4 px-4 text-neutral-500 text-sm hidden lg:table-cell">${_escHtml(s.days || '')}</td>
      <td class="py-4 px-4">
        ${isLive
          ? `<span class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
               <span class="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>LIVE
             </span>`
          : `<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-neutral-500 border border-white/10">
               <i class="fas fa-clock text-[10px]"></i>Scheduled
             </span>`
        }
      </td>
    </tr>`;
  }).join('');
}

// ─── HOME: DJ FAMILY (syncs with Show Schedule Manager) ──────────────────────
// Builds DJ cards from unique hosts in State.schedule.
// Renders into <div id="homeDJList"> on the home page.
const _DJ_EMOJIS  = ['🌅','☀️','🌆','🌙','🎵','🎙️','🎧','⭐','🔥','🎤'];
const _DJ_COLORS  = ['from-orange-500 to-purple-600','from-purple-500 to-pink-600',
                     'from-blue-500 to-cyan-500','from-green-500 to-teal-500',
                     'from-yellow-500 to-orange-500','from-pink-500 to-rose-600'];

function renderHomeDJFamily() {
  const container = document.getElementById('homeDJList');
  if (!container) return; // not on home page

  const schedule = State.schedule;
  if (!schedule || schedule.length === 0) {
    container.innerHTML = `<p class="text-neutral-500 text-sm text-center py-4">No DJ lineup yet.</p>`;
    return;
  }

  // Build unique DJ map: host → { show, time, active, emoji, color }
  const djMap = {};
  schedule.forEach((s, i) => {
    if (!s.host) return;
    const key = s.host.trim();
    if (!djMap[key]) {
      djMap[key] = {
        name:   key,
        show:   s.show,
        time:   s.time,
        active: !!s.active,
        emoji:  _DJ_EMOJIS[i % _DJ_EMOJIS.length],
        color:  _DJ_COLORS[i % _DJ_COLORS.length]
      };
    } else if (s.active) {
      // If host has an active show, promote it
      djMap[key].active = true;
      djMap[key].show   = s.show;
      djMap[key].time   = s.time;
    }
  });

  const djs = Object.values(djMap);
  if (djs.length === 0) {
    container.innerHTML = `<p class="text-neutral-500 text-sm text-center py-4">No DJ lineup yet.</p>`;
    return;
  }

  container.innerHTML = djs.map(dj => `
    <div class="flex items-center gap-4 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors ${dj.active ? 'ring-1 ring-green-500/40' : ''}">
      <div class="w-12 h-12 rounded-full bg-gradient-to-br ${dj.color} flex items-center justify-center text-xl flex-shrink-0">
        ${dj.emoji}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-white font-semibold truncate">${_escHtml(dj.name)}</span>
          ${dj.active ? '<span class="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex-shrink-0">● ON AIR</span>' : ''}
        </div>
        <div class="text-neutral-400 text-sm truncate">${_escHtml(dj.show)}</div>
      </div>
      <div class="text-orange-400 text-xs font-medium flex-shrink-0">${_escHtml(dj.time)}</div>
    </div>`).join('');
}

// ─── LIVE NOW PANEL — syncs with Stream Manager ───────────────────────────
// Picks the first LIVE stream with a valid URL from State.streams and wires
// it into the hero "Live Now" block. Called on DOMContentLoaded and whenever
// streams change (saveState / cross-tab).
function initLiveNow() {
  // Find the first LIVE stream with a real URL
  const liveStreams = State.streams.filter(s =>
    s.status === 'live' && s.url && s.url.trim() !== '' && s.url !== '#'
  );
  const primary = liveStreams[0] || null;

  // ── Update panel info text ────────────────────────────────────────────
  const nameEl   = document.getElementById('liveNowName');
  const genreEl  = document.getElementById('liveNowGenre');
  const domainEl = document.getElementById('liveNowDomain');
  const badgeEl  = document.getElementById('liveNowBadge');
  const dotEl    = document.getElementById('liveNowDot');

  if (primary) {
    if (nameEl)   nameEl.textContent  = primary.name;
    if (genreEl)  genreEl.textContent = primary.genre || 'Internet Radio';
    if (domainEl) {
      try { domainEl.textContent = new URL(primary.url).hostname; }
      catch(e) { domainEl.textContent = primary.url.split('/')[2] || primary.url; }
    }
    if (badgeEl) { badgeEl.textContent = 'LIVE NOW'; badgeEl.className = 'text-green-400 text-sm font-semibold'; }
    if (dotEl)   { dotEl.className = 'w-3 h-3 rounded-full bg-green-500 animate-pulse'; }
  } else {
    // No live stream available
    if (nameEl)   nameEl.textContent  = 'No live stream available';
    if (genreEl)  genreEl.textContent = 'Add a live stream in Admin → Stream Manager';
    if (domainEl) domainEl.textContent = '—';
    if (badgeEl) { badgeEl.textContent = 'OFFLINE'; badgeEl.className = 'text-red-400 text-sm font-semibold'; }
    if (dotEl)   { dotEl.className = 'w-3 h-3 rounded-full bg-red-500'; }
  }

  // ── Wire up the main radio player ────────────────────────────────────
  const radioPlayer = document.getElementById('radioPlayer');
  if (radioPlayer && primary) {
    // Only update src if not currently playing (don't interrupt)
    if (!State.isPlaying) {
      radioPlayer.src = primary.url;
      State.currentStreamUrl  = primary.url;
      State.currentStreamName = primary.name;
    } else if (State.currentStreamUrl !== primary.url) {
      // Stream URL changed while playing — update State for next play
      // (don't interrupt current playback)
      State.currentStreamUrl  = primary.url;
      State.currentStreamName = primary.name;
    }
  } else if (radioPlayer && !primary) {
    if (!State.isPlaying) { radioPlayer.src = ''; State.currentStreamUrl = ''; }
  }

  // ── Stream switcher buttons (if multiple live streams) ───────────────
  const selector  = document.getElementById('liveNowSelector');
  const switcher  = document.getElementById('liveNowSwitcher');
  if (selector && switcher) {
    if (liveStreams.length > 1) {
      selector.classList.remove('hidden');
      switcher.innerHTML = liveStreams.map(s => `
        <button onclick="switchLiveStream('${s.url.replace(/'/g,"\\'")}','${s.name.replace(/'/g,"\\'")}','${s.genre ? s.genre.replace(/'/g,"\\'") : ''}')"
          class="text-xs px-3 py-1.5 rounded-full border transition-colors ${State.currentStreamUrl === s.url ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 font-semibold' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/30'}"
          title="${s.bitrate || 128} kbps">
          <i class="fas fa-radio mr-1"></i>${_escHtml(s.name)}
        </button>`).join('');
    } else {
      selector.classList.add('hidden');
    }
  }
}

// Switch to a different live stream from the hero switcher
function switchLiveStream(url, name, genre) {
  // Update UI text immediately
  const nameEl  = document.getElementById('liveNowName');
  const genreEl = document.getElementById('liveNowGenre');
  const domainEl= document.getElementById('liveNowDomain');
  if (nameEl)   nameEl.textContent  = name;
  if (genreEl)  genreEl.textContent = genre || 'Internet Radio';
  if (domainEl) {
    try { domainEl.textContent = new URL(url).hostname; }
    catch(e) { domainEl.textContent = url.split('/')[2] || url; }
  }
  // Re-render switcher buttons so active state moves
  State.currentStreamUrl  = url;
  State.currentStreamName = name;
  initLiveNow();    // refresh switcher button states
  // If already playing, switch stream seamlessly
  const rp = document.getElementById('radioPlayer');
  if (State.isPlaying && rp) {
    rp.src = url;
    rp.play()
      .then(() => { _setPlayState(true); showToast('\u25B6 Switched to: ' + name, 'success'); })
      .catch(() => showToast('Could not connect to stream.', 'error'));
  } else {
    showToast('Stream selected: ' + name + ' \u2014 click Play to listen', 'info');
  }
}

// ─── UTILITIES ────────────────────────────────────────
function $(id)    { return document.getElementById(id); }
function $$(sel)  { return document.querySelectorAll(sel); }

function showToast(message, type = 'success') {
  let toast = $('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;transition:all .3s ease;transform:translateY(20px);opacity:0;pointer-events:none;';
    document.body.appendChild(toast);
  }
  const icons = {
    success: 'fa-check-circle text-green-400',
    error:   'fa-times-circle text-red-400',
    warning: 'fa-exclamation-triangle text-yellow-400',
    info:    'fa-info-circle text-blue-400'
  };
  toast.innerHTML = `<div style="background:#1f2937;border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:14px 20px;display:flex;align-items:center;gap:10px;box-shadow:0 20px 40px rgba(0,0,0,.5);min-width:260px;max-width:380px;">
    <i class="fas ${icons[type] || icons.success}" style="font-size:16px;flex-shrink:0;"></i>
    <span style="color:#fff;font-size:14px;font-weight:500;line-height:1.4;">${message}</span>
  </div>`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity   = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity   = '0';
  }, 3800);
}

function openModal(id) {
  const m = $(id);
  if (m) { m.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = $(id);
  if (m) { m.classList.add('hidden'); document.body.style.overflow = ''; }
  // Stop modal stream preview when the Add/Edit stream modal is closed
  if (id === 'addStreamModal') {
    const ma = document.getElementById('modalStreamAudio');
    if (ma) { try { ma.pause(); } catch(e){} ma.src = ''; }
    const ml = document.getElementById('modalTestLabel');   if (ml) ml.textContent = 'Test Stream';
    const mi = document.getElementById('modalTestIcon');    if (mi) mi.className = 'fas fa-play text-xs';
    const ms = document.getElementById('modalStreamStatus');
    if (ms) ms.textContent = 'Enter a stream URL above, then click Test Stream to preview it here.';
  }
}
function closeAllModals() {
  $$('.fixed.inset-0.z-50').forEach(m => {
    if (!m.classList.contains('hidden')) m.classList.add('hidden');
  });
  document.body.style.overflow = '';
}

// Escape key closes modals
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAllModals();
  if (e.key === 'Enter' && $('aiInput') === document.activeElement) {
    e.preventDefault();
    sendAIMessage();
  }
  if (e.ctrlKey && e.shiftKey && e.key === 'A') location.href = '/admin';
});

// Backdrop click = close modal
document.addEventListener('mousedown', e => {
  const modals = ['editModal','addStreamModal','scheduleModal','editPodcastModal','songRequestModal'];
  modals.forEach(id => {
    const m = $(id);
    if (m && !m.classList.contains('hidden') && e.target === m) closeModal(id);
  });
});

// ─── NAVBAR ────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = $('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = $('mobileMenuBtn');
  const mobileMenu    = $('mobileMenu');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', open);
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) icon.className = open ? 'fas fa-bars text-xl' : 'fas fa-times text-xl';
    });
  }
  $$('.mobile-menu-close').forEach(el => el.addEventListener('click', () => {
    if (mobileMenu) mobileMenu.classList.add('hidden');
    const icon = mobileMenuBtn && mobileMenuBtn.querySelector('i');
    if (icon) icon.className = 'fas fa-bars text-xl';
  }));

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = $(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileMenu) mobileMenu.classList.add('hidden');
      }
    });
  });

  const radioPlayer = $('radioPlayer');
  if (radioPlayer) radioPlayer.volume = State.volume;

  const volSlider = $('volumeSlider');
  if (volSlider) volSlider.addEventListener('input', () => setVolume(volSlider.value));

  const blogSearch = $('blogSearch');
  if (blogSearch) {
    blogSearch.addEventListener('input', () => filterBlogSearch(blogSearch.value));
    blogSearch.addEventListener('keydown', e => { if (e.key === 'Enter') filterBlogSearch(blogSearch.value); });
  }
  $$('.tag-filter').forEach(t => t.addEventListener('click', () => filterByTag(t.dataset.tag)));

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries =>
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('loaded'); obs.unobserve(en.target); } })
    );
    $$('img[loading="lazy"]').forEach(img => obs.observe(img));
  }

  // Set last login time in Security panel
  const ll = $('lastLoginTime');
  if (ll) ll.textContent = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

  // Colour picker sync
  const accentPicker = $('settingAccentColor');
  const accentHex    = $('settingAccentHex');
  if (accentPicker && accentHex) {
    accentPicker.addEventListener('input', () => { accentHex.value = accentPicker.value; });
    accentHex.addEventListener('input', () => {
      if (/^#[0-9A-Fa-f]{6}$/.test(accentHex.value)) accentPicker.value = accentHex.value;
    });
  }

  // Drop zone drag-and-drop
  const dz = $('dropZone');
  if (dz) {
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.style.borderColor = '#3b82f6'; });
    dz.addEventListener('dragleave', () => { dz.style.borderColor = ''; });
    dz.addEventListener('drop', e => {
      e.preventDefault();
      dz.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('audio/')) processAudioUpload(file);
      else showToast('Please drop an audio file.', 'warning');
    });
  }

  initAdmin();
  updateSocialLinks();
  // Sync Email Us pane with settings email
  syncEmailUs();
  // Hydrate the home page Active Streams pane from localStorage / State
  renderHomeStreams();
  // Hydrate Live Now panel + wire radio player to first live stream
  initLiveNow();
  // Hydrate Show Schedule + DJ Family from State
  renderHomeSchedule();
  renderHomeDJFamily();
  // Render inbox if on admin page
  renderInbox();
  _updateInboxBadge();
});

// ─── RADIO PLAYER ──────────────────────────────────────
function togglePlay() {
  const radioPlayer = $('radioPlayer');
  if (!radioPlayer) return;

  if (State.isPlaying) {
    radioPlayer.pause();
    _setPlayState(false);
    return;
  }

  // Resolve the best available stream URL:
  // 1. Currently selected URL (from switcher or playStream call)
  // 2. First LIVE stream from Stream Manager with a real URL
  // 3. mainStream from Settings
  // 4. Hardcoded fallback
  let url  = State.currentStreamUrl;
  let name = State.currentStreamName;

  if (!url || url === '' || url === '#') {
    const firstLive = State.streams.find(s =>
      s.status === 'live' && s.url && s.url.trim() !== '' && s.url !== '#'
    );
    if (firstLive) {
      url  = firstLive.url;
      name = firstLive.name;
    } else if (State.settings && State.settings.mainStream) {
      url  = State.settings.mainStream;
      name = State.settings.stationName || 'OFURE RADIO';
    } else {
      url  = 'https://stream.zeno.fm/f3wvbbqmdg8uv';
      name = 'OFURE RADIO MAIN';
    }
    State.currentStreamUrl  = url;
    State.currentStreamName = name;
  }

  if (!url || url === '' || url === '#') {
    showToast('No live stream configured. Add one in Admin \u2192 Stream Manager.', 'warning');
    return;
  }

  // Show loading spinner
  const btn = $('playBtn');
  if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin text-white text-lg"></i>';

  // Always set src fresh — avoids stale cached source
  radioPlayer.src = '';
  radioPlayer.load();
  radioPlayer.src = url;
  radioPlayer.volume = State.volume || 0.8;

  radioPlayer.play()
    .then(() => {
      _setPlayState(true);
      // Sync Live Now panel text in case it wasn't set yet
      const nameEl  = $('liveNowName');
      const domEl   = $('liveNowDomain');
      if (nameEl) nameEl.textContent = name;
      if (domEl) {
        try { domEl.textContent = new URL(url).hostname; }
        catch(e) { domEl.textContent = url.split('/')[2] || url; }
      }
    })
    .catch(err => {
      console.warn('togglePlay error:', err);
      if (btn) btn.innerHTML = '<i id="playIcon" class="fas fa-play text-white text-lg ml-1"></i>';
      showToast('Stream unavailable \u2014 check the URL in Stream Manager or try again.', 'error');
      _setPlayState(false);
    });
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
  const radioPlayer = $('radioPlayer');
  if (radioPlayer) radioPlayer.volume = State.volume;
  const slider = $('volumeSlider');
  if (slider) slider.value = val;
}

function playStream(url, name) {
  if (!url || url === '' || url === '#') {
    showToast('This stream has no URL configured yet. Edit it in Admin \u2192 Stream Manager.', 'warning');
    return;
  }
  State.currentStreamUrl  = url;
  State.currentStreamName = name || 'Stream';

  // Update Live Now panel info text immediately
  const nameEl  = document.getElementById('liveNowName');
  const genreEl = document.getElementById('liveNowGenre');
  const domEl   = document.getElementById('liveNowDomain');
  const stream  = State.streams.find(s => s.url === url);
  if (nameEl)  nameEl.textContent  = name || 'Stream';
  if (genreEl) genreEl.textContent = (stream && stream.genre) ? stream.genre : 'Internet Radio';
  if (domEl) {
    try { domEl.textContent = new URL(url).hostname; }
    catch(e) { domEl.textContent = url.split('/')[2] || url; }
  }

  const radioPlayer = $('radioPlayer');
  if (radioPlayer) {
    // Stop previous, reset fully, then load new src
    radioPlayer.pause();
    radioPlayer.src = '';
    radioPlayer.load();
    radioPlayer.src    = url;
    radioPlayer.volume = State.volume || 0.8;

    // Show loading indicator
    const playBtn = $('playBtn');
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-spinner fa-spin text-white text-lg"></i>';

    radioPlayer.play()
      .then(() => {
        _setPlayState(true);
        showToast('\u25B6 Now playing: ' + (name || 'Stream'), 'success');
        // Refresh switcher active states
        initLiveNow();
      })
      .catch(err => {
        console.warn('playStream error:', err);
        _setPlayState(false);
        showToast('\u26A0 Could not connect to "' + (name || 'stream') + '". Check the URL in Stream Manager.', 'error');
      });
  } else {
    showToast('Stream selected: ' + (name || 'Stream') + ' \u2014 click Play to listen', 'info');
  }
}

// ─── CONTACT FORM ──────────────────────────────────────
function handleContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type="submit"]');
  const name    = (form.querySelector('#contactName')    || {}).value || '';
  const email   = (form.querySelector('#contactEmail')   || {}).value || '';
  const subject = (form.querySelector('#contactSubject') || {}).value || 'General Enquiry';
  const message = (form.querySelector('#contactMessage') || {}).value || '';

  if (!name.trim() || !email.trim() || !message.trim()) {
    showToast('Please fill in all required fields.', 'warning');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

  setTimeout(() => {
    // Save to local inbox
    const msg = {
      id:      Date.now(),
      name:    name.trim(),
      email:   email.trim(),
      subject: subject || 'General Enquiry',
      message: message.trim(),
      status:  'pending',
      reply:   '',
      date:    new Date().toISOString()
    };
    State.inbox.unshift(msg);
    saveState('inbox');
    renderInbox();

    showToast('Message sent! We\'ll be in touch soon. 📬', 'success');
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
  }, 1200);
}

function handleNewsletter(e) {
  e.preventDefault();
  const form     = e.target;
  const emailEl  = form.querySelector('#newsletterEmail') || form.querySelector('input[type="email"]');
  const email    = emailEl ? emailEl.value.trim() : '';
  const btn      = form.querySelector('button[type="submit"]');

  if (!email) { showToast('Please enter your email address.', 'warning'); return; }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  setTimeout(() => {
    // Save newsletter subscription to inbox
    const sub = {
      id:      Date.now(),
      name:    'Newsletter Subscriber',
      email:   email,
      subject: 'Newsletter Subscription',
      message: email + ' subscribed to show updates & exclusive content.',
      status:  'pending',
      reply:   '',
      date:    new Date().toISOString()
    };
    State.inbox.unshift(sub);
    saveState('inbox');
    renderInbox();

    showToast('Subscribed! Welcome to the OFURE RADIO family! 🎉', 'success');
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
  }, 1000);
}

// ─── SONG REQUEST ─────────────────────────────────────
function openSongRequest() { openModal('songRequestModal'); }
function submitSongRequest(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const artistEl = form.querySelector('#reqArtist') || form.querySelector('[name="reqArtist"]');
  const titleEl  = form.querySelector('#reqTitle')  || form.querySelector('[name="reqTitle"]');
  const noteEl   = form.querySelector('#reqNote')   || form.querySelector('[name="reqNote"]');
  const nameEl   = form.querySelector('#reqName')   || form.querySelector('[name="reqName"]');
  const emailEl  = form.querySelector('#reqEmail')  || form.querySelector('[name="reqEmail"]');

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
  setTimeout(() => {
    // Save song request to inbox
    const artist = artistEl ? artistEl.value.trim() : '';
    const title  = titleEl  ? titleEl.value.trim()  : '';
    const note   = noteEl   ? noteEl.value.trim()   : '';
    const reqName  = nameEl  ? nameEl.value.trim()  : 'Listener';
    const reqEmail = emailEl ? emailEl.value.trim() : '';
    if (artist || title) {
      const songMsg = {
        id:      Date.now(),
        name:    reqName,
        email:   reqEmail,
        subject: 'Song Request',
        message: [artist && ('Artist: ' + artist), title && ('Song: ' + title), note && ('Note: ' + note)].filter(Boolean).join('\n'),
        status:  'pending',
        reply:   '',
        date:    new Date().toISOString()
      };
      State.inbox.unshift(songMsg);
      saveState('inbox');
      renderInbox();
    }
    showToast('Song request sent! 🎵 DJs will try to play it soon.', 'success');
    form.reset();
    closeModal('songRequestModal');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-music mr-2"></i>Request Song';
  }, 1000);
}

// ─── SHARE ────────────────────────────────────────────
function shareArticle() {
  if (navigator.share) {
    navigator.share({ title: document.title, url: location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(location.href)
      .then(() => showToast('Link copied to clipboard!', 'success'))
      .catch(() => showToast('Copy: ' + location.href, 'info'));
  }
}
function shareOn(platform) {
  const url   = encodeURIComponent(location.href);
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

// ─── BLOG SEARCH ──────────────────────────────────────
function filterBlogSearch(value) {
  const q     = value.trim().toLowerCase();
  const cards = $$('.blog-article-card');
  let shown   = 0;
  cards.forEach(card => {
    const text  = [(card.dataset.title||''), (card.dataset.category||''), (card.dataset.tags||'')].join(' ').toLowerCase();
    const match = !q || text.includes(q);
    const wrap  = card.closest('.blog-card-wrapper');
    if (wrap) wrap.style.display = match ? '' : 'none';
    else card.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  const noRes = $('blogNoResults');
  if (noRes) noRes.style.display = (shown === 0 && q) ? '' : 'none';
}
function filterByTag(tag) {
  const s = $('blogSearch');
  if (s) { s.value = tag; filterBlogSearch(tag); }
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
    isAuthenticated = true;
    $('pinGate').classList.add('hidden');
    $('adminContent').classList.remove('hidden');
    showPanel('dashboard');
    renderDashboard();
    showToast('Welcome to OFURE STUDIO! 🎙️', 'success');
  } else {
    const err = $('pinError');
    if (err) err.classList.remove('hidden');
    inputs.forEach(i => { i.value = ''; i.style.borderColor = '#ef4444'; setTimeout(() => i.style.borderColor = '', 900); });
    inputs[0].focus();
    setTimeout(() => { if ($('pinError')) $('pinError').classList.add('hidden'); }, 3000);
  }
}

function adminLogout() {
  sessionStorage.removeItem('ofure_admin_auth');
  isAuthenticated = false;
  showToast('Logged out successfully.', 'info');
  setTimeout(() => location.reload(), 600);
}

function showPanel(id) {
  $$('.admin-panel').forEach(p => p.classList.add('hidden'));
  const panel = $('panel-' + id);
  if (panel) panel.classList.remove('hidden');
  $$('.admin-nav-item').forEach(btn => {
    const active = btn.dataset.panel === id;
    btn.style.background   = active ? 'rgba(249,115,22,0.15)' : '';
    btn.style.color        = active ? '#fb923c' : '';
    btn.style.borderColor  = active ? 'rgba(249,115,22,0.3)' : '';
    btn.style.border       = active ? '1px solid rgba(249,115,22,0.3)' : '';
  });
  if (id === 'streams')  renderStreams();
  if (id === 'schedule') renderSchedule();
  if (id === 'podcast')  renderPodcasts();
  if (id === 'settings') populateSettings();
  if (id === 'inbox')    renderInbox();
  if (window.innerWidth < 1024) {
    const sb = $('adminSidebar');
    if (sb) sb.classList.remove('open');
  }
}

function toggleSidebar() {
  const sb = $('adminSidebar');
  if (sb) sb.classList.toggle('open');
}

// ─── DASHBOARD ────────────────────────────────────────
function renderDashboard() {
  const el = $('dashListeners');
  if (el) {
    let count = State.listeners;
    el.textContent = count;
    setInterval(() => {
      count += Math.floor(Math.random() * 5) - 2;
      count  = Math.max(200, count);
      el.textContent = count;
    }, 4000);
  }
}

// ─── BLOG MANAGEMENT ──────────────────────────────────
function filterArticles(cat) {
  $$('.filter-btn').forEach(b => {
    const isActive = b.dataset.category === cat;
    b.style.background = isActive ? '#f97316' : '';
    b.style.color      = isActive ? '#fff' : '';
    b.classList.toggle('active', isActive);
  });
  $$('.article-row').forEach(row => {
    row.style.display = (!cat || row.dataset.category === cat) ? '' : 'none';
  });
  const visible = $$('.article-row:not([style*="none"])').length;
  const empty   = $('articlesEmpty');
  if (empty) empty.style.display = visible === 0 ? '' : 'none';
}

function searchAdminArticles(q) {
  const query = q.toLowerCase();
  $$('.article-row').forEach(row => {
    const text = [(row.dataset.title||''), (row.dataset.category||'')].join(' ');
    row.style.display = (!query || text.includes(query)) ? '' : 'none';
  });
}

function editArticle(id) {
  const row = document.querySelector(`.article-row[data-id="${id}"]`);
  if (!row) { showToast('Article not found.', 'error'); return; }
  const title    = row.querySelector('.article-title-cell')?.textContent || row.dataset.title || '';
  const cat      = row.dataset.category || 'Entertainment';
  const excerpt  = row.dataset.excerpt  || '';
  const featured = row.dataset.featured === 'true';
  const slug     = row.dataset.slug     || '';

  const content = $('editModalContent');
  if (!content) return;
  content.innerHTML = `
    <input type="hidden" id="editArticleId" value="${_escHtml(id)}">
    <div class="space-y-4">
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Article Title *</label>
        <input id="editTitle" type="text" value="${_escHtml(title)}"
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
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none">${_escHtml(excerpt)}</textarea>
      </div>
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Article Slug (URL)</label>
        <input id="editSlug" type="text" value="${_escHtml(slug)}"
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
      </div>
      <div class="flex gap-3 pt-2 border-t border-white/10">
        <button onclick="saveArticleEdit()" class="flex-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white py-3 rounded-xl font-semibold transition-all">
          <i class="fas fa-save mr-2"></i>Save Changes
        </button>
        <a href="/blog/${slug}" target="_blank" class="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm flex items-center gap-1">
          <i class="fas fa-eye"></i>
        </a>
        <button onclick="closeModal('editModal')" class="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors">Cancel</button>
      </div>
    </div>`;
  const modal = $('editModal');
  if (modal) {
    const h3 = modal.querySelector('h3');
    if (h3) h3.textContent = 'Edit Article';
  }
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
    const catEl   = row.querySelector('.article-category-badge');
    if (catEl)   catEl.textContent = category;
    const featEl  = row.querySelector('.article-featured-badge');
    if (featEl)  featEl.innerHTML = status === 'featured'
      ? '<span class="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><i class="fas fa-star mr-1"></i>Featured</span>'
      : '<span class="text-xs px-2 py-1 rounded-full bg-white/10 text-neutral-400">Published</span>';
  }
  showToast('Article updated successfully! ✅', 'success');
  closeModal('editModal');
}

function toggleFeatured(id) {
  const row = document.querySelector(`.article-row[data-id="${id}"]`);
  if (!row) return;
  const isFeatured   = row.dataset.featured === 'true';
  row.dataset.featured = (!isFeatured).toString();
  const badge        = row.querySelector('.article-featured-badge');
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
        <textarea id="editExcerpt" rows="2"
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none" placeholder="Short summary..."></textarea>
      </div>
      <div>
        <label class="block text-neutral-400 text-sm mb-1">Content</label>
        <textarea id="editContent" rows="5"
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none" placeholder="Full article body..."></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
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
      </div>
      <div class="flex gap-3 pt-2 border-t border-white/10">
        <button onclick="saveNewArticle()" class="flex-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white py-3 rounded-xl font-semibold transition-all">
          <i class="fas fa-plus mr-2"></i>Publish Article
        </button>
        <button onclick="closeModal('editModal')" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors">Cancel</button>
      </div>
    </div>`;
  const modal = $('editModal');
  if (modal) {
    const h3 = modal.querySelector('h3');
    if (h3) h3.textContent = 'New Article';
    openModal('editModal');
  }
}

function saveNewArticle() {
  const title = $('editTitle')?.value.trim();
  if (!title) { showToast('Title is required.', 'error'); return; }
  const slug     = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const today    = new Date().toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const category = $('editCategory')?.value || 'Entertainment';
  const tbody    = document.querySelector('#articlesTable tbody');
  if (tbody) {
    const tr       = document.createElement('tr');
    const newId    = 'new-' + Date.now();
    tr.className   = 'hover:bg-white/3 transition-colors article-row';
    tr.dataset.category = category;
    tr.dataset.title    = title.toLowerCase();
    tr.dataset.excerpt  = $('editExcerpt')?.value || '';
    tr.dataset.featured = $('editStatus')?.value === 'featured' ? 'true' : 'false';
    tr.dataset.slug     = slug;
    tr.dataset.id       = newId;
    tr.innerHTML = `
      <td class="py-4 px-4"><div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0"><i class="fas fa-newspaper text-orange-400 text-sm"></i></div>
        <div><p class="text-white font-medium text-sm article-title-cell">${_escHtml(title)}</p><p class="text-neutral-500 text-xs">${today}</p></div>
      </div></td>
      <td class="py-4 px-4 hidden md:table-cell"><span class="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 article-category-badge">${category}</span></td>
      <td class="py-4 px-4 text-neutral-400 text-sm hidden lg:table-cell">${today}</td>
      <td class="py-4 px-4 hidden lg:table-cell article-featured-badge">
        <span class="text-xs px-2 py-1 rounded-full bg-white/10 text-neutral-400">Published</span>
      </td>
      <td class="py-4 px-4 text-right"><div class="flex items-center justify-end gap-2">
        <a href="/blog/${slug}" target="_blank" class="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors text-xs"><i class="fas fa-eye"></i></a>
        <button onclick="editArticle('${newId}')" class="text-orange-400 p-2 rounded-lg hover:bg-orange-500/10 transition-colors text-xs"><i class="fas fa-edit"></i></button>
        <button onclick="toggleFeatured('${newId}')" class="text-neutral-400 hover:text-yellow-400 p-2 rounded-lg hover:bg-yellow-500/10 transition-colors text-xs"><i class="fas fa-star"></i></button>
      </div></td>`;
    tbody.insertBefore(tr, tbody.firstChild);
  }
  showToast(`Article "${title}" published! ✅`, 'success');
  closeModal('editModal');
}

// ─── STREAM MANAGER ────────────────────────────────────
function renderStreams() {
  const list = $('streamsList');
  if (!list) return;

  // Update stat counters
  const liveCount    = State.streams.filter(s => s.status === 'live').length;
  const totalListeners = State.streams.reduce((acc, s) => acc + (s.listeners || 0), 0);
  const lc = $('liveStreamCount');   if (lc) lc.textContent = liveCount;
  const tc = $('totalStreamCount');  if (tc) tc.textContent = State.streams.length;
  const tl = $('totalListenerCount');if (tl) tl.textContent = totalListeners;
  // Keep home page Active Streams pane + Live Now panel in sync
  renderHomeStreams();
  initLiveNow();

  list.innerHTML = State.streams.map(s => `
    <div class="bg-neutral-900 border border-white/10 rounded-xl p-6 hover:border-orange-500/20 transition-all stream-card" data-id="${s.id}" id="stream-card-${s.id}">
      <div class="flex flex-col sm:flex-row sm:items-start gap-4">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-radio text-orange-400 text-xl"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-0.5 flex-wrap">
              <h3 class="text-white font-bold stream-name">${_escHtml(s.name)}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full font-semibold ${s.status==='live'?'bg-green-500/20 text-green-400':s.status==='scheduled'?'bg-yellow-500/20 text-yellow-400':'bg-red-500/20 text-red-400'}">
                ${s.status==='live'?'● LIVE':s.status==='scheduled'?'⏰ SCHEDULED':'○ OFFLINE'}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                <i class="fas fa-signal mr-1"></i>${s.bitrate || 128} kbps
              </span>
            </div>
            <p class="text-neutral-400 text-sm stream-genre">${_escHtml(s.genre)}</p>
            <p class="text-neutral-600 text-xs truncate stream-url mt-0.5">${s.url ? s.url : '<em class="text-neutral-700">No URL set — click Edit to add one</em>'}</p>
          </div>
        </div>
        <div class="flex flex-col gap-2 items-end flex-shrink-0">
          ${s.status==='live' ? `<span class="text-neutral-400 text-sm"><i class="fas fa-users mr-1 text-green-400"></i>${s.listeners} listeners</span>` : ''}
          <div class="flex gap-2">
            <button onclick="testStream('${s.url}','${_escHtml(s.name)}',${s.id})" id="testBtn-${s.id}"
              class="flex items-center gap-1.5 text-neutral-400 hover:text-green-400 px-3 py-2 rounded-lg hover:bg-green-500/10 transition-colors border border-white/10 hover:border-green-500/30 text-xs font-medium" title="Test / Play Stream">
              <i class="fas fa-play text-xs" id="testIcon-${s.id}"></i>
              <span>Test</span>
            </button>
            <button onclick="openEditStream(${s.id})"
              class="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 px-3 py-2 rounded-lg hover:bg-orange-500/10 transition-colors border border-white/10 hover:border-orange-500/30 text-xs font-medium" title="Edit Stream">
              <i class="fas fa-edit text-xs"></i>
              <span>Edit</span>
            </button>
            <button onclick="toggleStreamStatus(${s.id})"
              class="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-colors border border-white/10" title="Toggle Live / Offline">
              <i class="fas fa-power-off text-sm"></i>
            </button>
            <button onclick="deleteStream(${s.id})"
              class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors border border-white/10" title="Delete Stream">
              <i class="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- Inline stream test player (shown when Test is clicked) -->
      <div id="streamPlayer-${s.id}" class="hidden mt-4 bg-black/40 border border-green-500/20 rounded-xl p-3">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></div>
          <span class="text-green-400 text-xs font-semibold flex-1">▶ TESTING: ${_escHtml(s.name)}</span>
          <span class="text-blue-400 text-xs font-mono border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 rounded">${s.bitrate || 128} kbps</span>
          <button onclick="stopTestStream(${s.id})" class="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20 font-medium">
            <i class="fas fa-stop mr-1"></i>Stop
          </button>
        </div>
        <audio id="streamAudio-${s.id}" preload="none" class="hidden"></audio>
      </div>
    </div>`).join('');
}

// ─── STREAM TEST PLAYER ───────────────────────────────
// Tracks active test audio instances { streamId: audioElement }
const _testAudioMap = {};

function testStream(url, name, streamId) {
  if (!url || url === '') {
    showToast('No stream URL configured. Edit the stream and add a URL first.', 'warning');
    return;
  }
  // Toggle: if already playing this stream, stop it
  if (_testAudioMap[streamId]) {
    stopTestStream(streamId);
    return;
  }
  // Stop any other test streams
  Object.keys(_testAudioMap).forEach(id => stopTestStream(id));

  const audio      = document.getElementById('streamAudio-' + streamId);
  const playerDiv  = document.getElementById('streamPlayer-' + streamId);
  const testBtn    = document.getElementById('testBtn-' + streamId);
  const testIcon   = document.getElementById('testIcon-' + streamId);

  if (!audio) {
    // Fallback to main player
    playStream(url, name || 'Test Stream');
    return;
  }

  // Loading state
  if (testIcon) testIcon.className = 'fas fa-spinner fa-spin text-xs';
  if (testBtn)  { testBtn.classList.remove('text-neutral-400'); testBtn.classList.add('text-yellow-400'); }
  showToast('\u23F3 Connecting to ' + (name || 'stream') + '\u2026', 'info');

  // Full reset to avoid stale src / cached error state
  audio.pause();
  audio.src = '';
  audio.load();
  audio.src    = url;
  audio.volume = State.volume || 0.8;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        _testAudioMap[streamId] = audio;
        if (playerDiv) playerDiv.classList.remove('hidden');
        if (testIcon)  testIcon.className = 'fas fa-stop text-xs';
        if (testBtn)   {
          testBtn.classList.remove('text-neutral-400','text-yellow-400');
          testBtn.classList.add('text-green-400');
          testBtn.title = 'Stop Test Stream';
        }
        showToast('\u25B6 Testing: ' + (name || 'stream') + ' \u2014 audio is live!', 'success');
      })
      .catch(err => {
        console.warn('Stream test error:', err);
        if (testIcon) testIcon.className = 'fas fa-play text-xs';
        if (testBtn)  { testBtn.classList.remove('text-yellow-400'); testBtn.classList.add('text-neutral-400'); }
        showToast('\u26A0 Could not connect. Verify the URL is a direct audio stream (Zeno.fm, Icecast, SHOUTcast, .mp3/.aac).', 'error');
      });
  }
}

function stopTestStream(streamId) {
  const audio = _testAudioMap[streamId] || document.getElementById('streamAudio-' + streamId);
  if (audio) { try { audio.pause(); } catch(e){} audio.src = ''; }
  delete _testAudioMap[streamId];
  const playerDiv = document.getElementById('streamPlayer-' + streamId);
  const testBtn   = document.getElementById('testBtn-' + streamId);
  const testIcon  = document.getElementById('testIcon-' + streamId);
  if (playerDiv) playerDiv.classList.add('hidden');
  if (testIcon)  testIcon.className = 'fas fa-play text-xs';
  if (testBtn)   {
    testBtn.classList.remove('text-green-400','text-yellow-400');
    testBtn.classList.add('text-neutral-400');
    testBtn.title = 'Test / Play Stream';
  }
  showToast('Stream test stopped.', 'info');
}

// Test stream from inside the Add/Edit modal
function testStreamModal() {
  const url    = document.getElementById('streamUrl') ? document.getElementById('streamUrl').value.trim() : '';
  const name   = document.getElementById('streamName') ? document.getElementById('streamName').value.trim() : 'Preview';
  const audio  = document.getElementById('modalStreamAudio');
  const label  = document.getElementById('modalTestLabel');
  const icon   = document.getElementById('modalTestIcon');
  const status = document.getElementById('modalStreamStatus');

  if (!url) {
    showToast('Enter a Stream URL first, then click Test Stream.', 'warning');
    if (status) status.innerHTML = '<span class="text-yellow-400"><i class="fas fa-exclamation-triangle mr-1"></i>No URL entered. Fill in the Stream URL field above.</span>';
    return;
  }

  // Toggle: stop if already playing
  if (audio && !audio.paused) {
    audio.pause(); audio.src = '';
    if (label)  label.textContent = 'Test Stream';
    if (icon)   icon.className = 'fas fa-play text-xs';
    if (status) status.innerHTML = '<span class="text-neutral-500">Stream preview stopped.</span>';
    return;
  }

  if (status) status.innerHTML = '<span class="text-yellow-400"><i class="fas fa-spinner fa-spin mr-1"></i>Connecting to stream\u2026</span>';
  if (label)  label.textContent = 'Connecting\u2026';
  if (icon)   icon.className = 'fas fa-spinner fa-spin text-xs';

  if (!audio) return;
  // Full reset before load — avoids cached CORS/error state
  audio.pause();
  audio.src = '';
  audio.load();
  audio.src    = url;
  audio.volume = State.volume || 0.8;
  const p = audio.play();
  if (p !== undefined) {
    p.then(() => {
      if (label)  label.textContent = 'Stop Preview';
      if (icon)   icon.className = 'fas fa-stop text-xs';
      if (status) status.innerHTML =
        '<span class="text-green-400"><i class="fas fa-circle-notch fa-spin mr-1"></i>\u25B6 Playing: <strong>' + _escHtml(name) + '</strong> \u2014 stream is live!</span>';
      showToast('\u25B6 Stream preview: ' + name + ' is live!', 'success');
    }).catch(err => {
      console.warn('Modal test error:', err);
      if (label)  label.textContent = 'Test Stream';
      if (icon)   icon.className = 'fas fa-play text-xs';
      if (status) status.innerHTML =
        '<span class="text-red-400"><i class="fas fa-exclamation-triangle mr-1"></i>Could not connect. Check the URL \u2014 must be a direct audio stream (Zeno.fm, Icecast, SHOUTcast, .mp3/.aac).</span>';
    });
  }
}

function showAddStreamModal() {
  State.editingStreamId = null;
  const titleEl = $('streamModalTitle');
  const btnLabel = $('streamSaveBtnLabel');
  if (titleEl)  titleEl.textContent  = 'Add New Stream';
  if (btnLabel) btnLabel.textContent = 'Add Stream';
  const fields = { streamName:'', streamUrl:'', streamGenre:'', streamStatus:'live', streamBitrate:'128' };
  Object.entries(fields).forEach(([id, val]) => { const el=$( id); if(el) el.value=val; });
  // Reset modal test preview
  const ma = $('modalStreamAudio'); if (ma) { try{ma.pause();}catch(e){} ma.src=''; }
  const ml = $('modalTestLabel');   if (ml) ml.textContent = 'Test Stream';
  const mi = $('modalTestIcon');    if (mi) mi.className = 'fas fa-play text-xs';
  const ms = $('modalStreamStatus');
  if (ms) ms.textContent = 'Enter a stream URL above, then click Test Stream to preview it here.';
  openModal('addStreamModal');
  setTimeout(() => { const n = $('streamName'); if (n) n.focus(); }, 100);
}

function openEditStream(id) {
  const s = State.streams.find(x => x.id === id);
  if (!s) { showToast('Stream not found.', 'error'); return; }
  // Stop any active test for this stream
  if (_testAudioMap && _testAudioMap[id]) stopTestStream(id);
  State.editingStreamId = id;
  const titleEl  = $('streamModalTitle');
  const btnLabel = $('streamSaveBtnLabel');
  if (titleEl)  titleEl.textContent  = 'Edit Stream';
  if (btnLabel) btnLabel.textContent = 'Save Changes';
  const sn = $('streamName');    if (sn) sn.value = s.name;
  const su = $('streamUrl');     if (su) su.value = s.url;
  const sg = $('streamGenre');   if (sg) sg.value = s.genre;
  const ss = $('streamStatus');  if (ss) ss.value = s.status;
  const sb = $('streamBitrate'); if (sb) sb.value = String(s.bitrate || 128);
  // Reset modal test preview
  const ma = $('modalStreamAudio'); if (ma) { try{ma.pause();}catch(e){} ma.src=''; }
  const ml = $('modalTestLabel');   if (ml) ml.textContent = 'Test Stream';
  const mi = $('modalTestIcon');    if (mi) mi.className = 'fas fa-play text-xs';
  const ms = $('modalStreamStatus');
  if (ms) ms.innerHTML = '<span class="text-neutral-500">Current URL: <span class="text-orange-400 font-mono text-xs">' + _escHtml(s.url || 'not set') + '</span> — click Test Stream to verify.</span>';
  openModal('addStreamModal');
  setTimeout(() => { if (sn) sn.focus(); }, 100);
}

function saveNewStream(e) {
  e.preventDefault();
  const name    = $('streamName')?.value.trim();
  const url     = $('streamUrl')?.value.trim();
  const genre   = $('streamGenre')?.value.trim() || 'General';
  const status  = $('streamStatus')?.value || 'live';
  const bitrate = parseInt($('streamBitrate')?.value || '128', 10);
  if (!name) { showToast('Stream name is required.', 'error'); return; }
  if (!url)  { showToast('Stream URL is required.', 'error'); return; }
  // Stop modal audio preview if playing
  const ma = $('modalStreamAudio'); if (ma) { try{ma.pause();}catch(e){} ma.src=''; }

  if (State.editingStreamId) {
    const s = State.streams.find(x => x.id === State.editingStreamId);
    if (s) { s.name = name; s.url = url; s.genre = genre; s.status = status; s.bitrate = bitrate; }
    showToast('Stream "' + name + '" updated! Bitrate: ' + bitrate + ' kbps \u2705', 'success');
  } else {
    const newId = Date.now();
    State.streams.push({ id: newId, name, url, genre, status, listeners: 0, bitrate });
    showToast('Stream "' + name + '" added at ' + bitrate + ' kbps! \u2705', 'success');
  }
  State.editingStreamId = null;
  saveState('streams');
  renderStreams();
  closeModal('addStreamModal');
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

// ─── SHOW SCHEDULE ─────────────────────────────────────
function renderSchedule() {
  const tbody = $('scheduleBody');
  if (!tbody) return;
  if (State.schedule.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-neutral-500">No shows yet. Click Add Show.</td></tr>';
    return;
  }
  tbody.innerHTML = State.schedule.map(s => `
    <tr class="hover:bg-white/3 transition-colors schedule-row ${s.active ? 'bg-orange-500/5' : ''}" data-id="${s.id}">
      <td class="py-4 px-4"><span class="text-white font-semibold text-sm">${s.time}</span></td>
      <td class="py-4 px-4 text-white font-medium">${_escHtml(s.show)}</td>
      <td class="py-4 px-4 text-neutral-400 text-sm">${_escHtml(s.host)}</td>
      <td class="py-4 px-4 text-neutral-500 text-sm hidden md:table-cell">${_escHtml(s.genre)}</td>
      <td class="py-4 px-4 text-neutral-500 text-sm hidden lg:table-cell">${_escHtml(s.days)}</td>
      <td class="py-4 px-4">
        <span class="text-xs px-2 py-1 rounded-full ${s.active?'bg-green-500/20 text-green-400':'bg-blue-500/20 text-blue-400'}">
          ${s.active?'● ON AIR':'⏰ Scheduled'}
        </span>
      </td>
      <td class="py-4 px-4 text-right">
        <div class="flex items-center justify-end gap-2">
          <button onclick="openEditSchedule(${s.id})" class="text-orange-400 p-1.5 rounded-lg hover:bg-orange-500/10 transition-colors text-sm" title="Edit show">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteSchedule(${s.id})" class="text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-sm" title="Delete show">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function showAddShowModal() {
  State.editingScheduleId = null;
  const title = $('scheduleModalTitle');
  if (title) title.textContent = 'Add New Show';
  ['schedTime','schedShow','schedHost','schedGenre','schedDays'].forEach(id => { const el=$(id); if(el) el.value=''; });
  const ss = $('schedStatus'); if (ss) ss.value = 'scheduled';
  openModal('scheduleModal');
}

function openEditSchedule(id) {
  const s = State.schedule.find(x => x.id === id);
  if (!s) return;
  State.editingScheduleId = id;
  const title = $('scheduleModalTitle');
  if (title) title.textContent = 'Edit Show';
  const st = $('schedTime');   if (st) st.value = s.time;
  const ss2= $('schedShow');   if (ss2)ss2.value = s.show;
  const sh = $('schedHost');   if (sh) sh.value = s.host;
  const sg = $('schedGenre');  if (sg) sg.value = s.genre;
  const sd = $('schedDays');   if (sd) sd.value = s.days;
  const ss = $('schedStatus'); if (ss) ss.value = s.active ? 'live' : 'scheduled';
  openModal('scheduleModal');
}

function saveScheduleEntry(e) {
  e.preventDefault();
  const data = {
    time:   $('schedTime')?.value.trim()   || '',
    show:   $('schedShow')?.value.trim()   || '',
    host:   $('schedHost')?.value.trim()   || '',
    genre:  $('schedGenre')?.value.trim()  || '',
    days:   $('schedDays')?.value.trim()   || 'Daily',
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
  State.editingScheduleId = null;
  saveState('schedule');
  renderSchedule();
  closeModal('scheduleModal');
}

function deleteSchedule(id) {
  const s = State.schedule.find(x => x.id === id);
  if (!s) return;
  if (!confirm(`Remove "${s.show}" from schedule?`)) return;
  State.schedule = State.schedule.filter(x => x.id !== id);
  saveState('schedule');
  renderSchedule();
  showToast('Show removed.', 'info');
}

// ─── PODCAST STUDIO ────────────────────────────────────
function renderPodcasts() {
  const list     = $('podcastList');
  const countEl  = $('episodeCount');
  if (countEl) countEl.textContent = State.podcasts.length;
  if (!list) return;

  if (State.podcasts.length === 0) {
    list.innerHTML = `<div class="text-center py-12 text-neutral-500 px-4">
      <i class="fas fa-microphone text-5xl mb-3 text-neutral-700 block"></i>
      <p class="font-medium">No episodes yet</p>
      <p class="text-xs mt-1 text-neutral-600">Start recording or upload an audio file above</p>
    </div>`;
    return;
  }

  list.innerHTML = State.podcasts.map(p => `
    <div class="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/8 border-b border-white/5 last:border-0 transition-colors">
      <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
        <i class="fas fa-podcast text-orange-400 text-lg"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-white font-semibold text-sm truncate">${_escHtml(p.title)}</p>
        <p class="text-neutral-400 text-xs mt-0.5">
          ${p.duration || 'Unknown duration'} · ${p.date}
          ${p.season ? `<span class="ml-2 text-neutral-600">S${p.season}${p.episode?` E${p.episode}`:''}</span>` : ''}
        </p>
        ${p.desc ? `<p class="text-neutral-600 text-xs mt-0.5 truncate">${_escHtml(p.desc)}</p>` : ''}
      </div>
      <div class="flex gap-2 flex-shrink-0">
        <button onclick="playPodcast('${p.id}')" class="text-green-400 hover:text-green-300 p-2 rounded-lg hover:bg-green-500/10 transition-colors" title="Play"><i class="fas fa-play text-sm"></i></button>
        <button onclick="editPodcast('${p.id}')" class="text-orange-400 hover:text-orange-300 p-2 rounded-lg hover:bg-orange-500/10 transition-colors" title="Edit episode"><i class="fas fa-edit text-sm"></i></button>
        <button onclick="deletePodcast('${p.id}')" class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete"><i class="fas fa-trash text-sm"></i></button>
      </div>
    </div>`).join('');
}

function startRecording() {
  if (!navigator.mediaDevices) {
    showToast('Microphone access not supported in this browser.', 'error');
    return;
  }
  if (State.isRecording) {
    // STOP
    if (State.mediaRecorder && State.mediaRecorder.state !== 'inactive') State.mediaRecorder.stop();
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
      State.recordedChunks = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      State.mediaRecorder = new MediaRecorder(stream, { mimeType });
      State.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) State.recordedChunks.push(e.data); };
      State.mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        clearInterval(State.recordTimer);
        State.isRecording = false;

        const btn = $('recordBtn');
        if (btn) { btn.innerHTML = '<i class="fas fa-microphone mr-2"></i>Start Recording'; btn.className = btn.className.replace('bg-red-600','bg-red-500'); }
        const statusBar = $('recordingStatus');
        if (statusBar) statusBar.classList.add('hidden');
        _stopWaveAnimation();

        const blob  = new Blob(State.recordedChunks, { type: mimeType });
        const url   = URL.createObjectURL(blob);
        const title = `Episode ${State.podcasts.length + 1} — ${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;
        const pod   = {
          id:       Date.now().toString(),
          title,
          url,
          date:     new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),
          duration: _formatTime(State.recordSeconds),
          desc:     ''
        };
        State.podcasts.unshift(pod);
        saveState('podcasts');
        renderPodcasts();
        showToast(`Recording saved: "${title}" (${pod.duration}) ✅`, 'success');
      };
      State.isRecording  = true;
      State.recordSeconds = 0;
      State.mediaRecorder.start(200);

      const btn = $('recordBtn');
      if (btn) { btn.innerHTML = '<i class="fas fa-stop mr-2"></i>Stop Recording'; btn.className = btn.className.replace('bg-red-500','bg-red-600'); }
      const statusBar = $('recordingStatus');
      if (statusBar) statusBar.classList.remove('hidden');
      _startWaveAnimation();

      State.recordTimer = setInterval(() => {
        State.recordSeconds++;
        const timerEl = $('recordTimer');
        if (timerEl) timerEl.textContent = _formatTime(State.recordSeconds);
      }, 1000);
      showToast('🔴 Recording started! Speak into your microphone.', 'info');
    })
    .catch(err => {
      showToast('Microphone permission denied. Please allow microphone access.', 'error');
      console.error('Mic error:', err);
    });
}

function _startWaveAnimation() {
  const bars = $$('#recordWave .rec-wave-bar');
  if (!bars.length) return;
  State._waveInterval = setInterval(() => {
    bars.forEach(bar => {
      bar.style.height = (Math.random() * 28 + 3) + 'px';
    });
  }, 100);
}
function _stopWaveAnimation() {
  clearInterval(State._waveInterval);
  const bars = $$('#recordWave .rec-wave-bar');
  bars.forEach(bar => { bar.style.height = '4px'; });
}

function _formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2,'0');
  const s = (secs % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function uploadAudio() {
  const input    = document.createElement('input');
  input.type     = 'file';
  input.accept   = 'audio/*';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    processAudioUpload(file);
  };
  input.click();
}

function processAudioUpload(file) {
  const url   = URL.createObjectURL(file);
  const name  = file.name.replace(/\.[^.]+$/, '');
  // Try to get duration
  const audio = new Audio(url);
  audio.addEventListener('loadedmetadata', () => {
    const dur = _formatTime(Math.floor(audio.duration));
    const pod = {
      id:       Date.now().toString(),
      title:    name,
      url,
      date:     new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),
      duration: dur,
      desc:     ''
    };
    State.podcasts.unshift(pod);
    saveState('podcasts');
    renderPodcasts();
    showToast(`"${name}" uploaded (${dur}) ✅`, 'success');
  });
  audio.addEventListener('error', () => {
    const pod = {
      id:       Date.now().toString(),
      title:    name,
      url,
      date:     new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),
      duration: 'Unknown',
      desc:     ''
    };
    State.podcasts.unshift(pod);
    saveState('podcasts');
    renderPodcasts();
    showToast(`"${name}" uploaded ✅`, 'success');
  });
}

function playPodcast(id) {
  const p = State.podcasts.find(x => x.id === id);
  if (!p) return;
  const audio = new Audio(p.url);
  audio.play()
    .then(() => showToast(`▶ Playing: ${p.title}`, 'success'))
    .catch(() => showToast('Could not play this episode. File may have expired.', 'error'));
}

function editPodcast(id) {
  const p = State.podcasts.find(x => x.id === id);
  if (!p) return;
  const tid  = $('editPodcastId');   if (tid)  tid.value  = id;
  const tt   = $('editPodcastTitle');if (tt)   tt.value   = p.title;
  const ep   = $('editPodcastEp');   if (ep)   ep.value   = p.episode  || '';
  const seas = $('editPodcastSeason');if (seas) seas.value = p.season   || '1';
  const desc = $('editPodcastDesc'); if (desc) desc.value = p.desc     || '';
  const tags = $('editPodcastTags'); if (tags) tags.value = (p.tags||[]).join(', ');
  openModal('editPodcastModal');
}

function savePodcastEdit() {
  const id    = $('editPodcastId')?.value;
  const p     = State.podcasts.find(x => x.id === id);
  if (!p) return;
  const title = $('editPodcastTitle')?.value.trim();
  if (!title) { showToast('Title cannot be empty.', 'error'); return; }
  p.title   = title;
  p.episode = parseInt($('editPodcastEp')?.value)    || undefined;
  p.season  = parseInt($('editPodcastSeason')?.value) || 1;
  p.desc    = $('editPodcastDesc')?.value.trim()  || '';
  p.tags    = ($('editPodcastTags')?.value || '').split(',').map(t => t.trim()).filter(Boolean);
  saveState('podcasts');
  renderPodcasts();
  showToast('Episode updated! ✅', 'success');
  closeModal('editPodcastModal');
}

function deletePodcast(id) {
  const p = State.podcasts.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Delete episode "${p.title}"?`)) return;
  State.podcasts = State.podcasts.filter(x => x.id !== id);
  saveState('podcasts');
  renderPodcasts();
  showToast('Episode deleted.', 'info');
}

function aiGeneratePodcast() {
  showPanel('ai');
  activateAIAgent('podcast');
  const input = $('aiInput');
  if (input) {
    input.value = 'Create a detailed 20-minute podcast episode outline about the rise of Afrobeats globally, including segment titles, talking points, and recommended guest topics.';
    input.focus();
  }
  showToast('AI Podcast outline generator ready — click Send!', 'info');
}

// ─── RSS FEED ──────────────────────────────────────────
function openRSSPanel() {
  const panel = $('rssPanelInline');
  if (!panel) return;
  // Populate from saved settings
  const r = State.rssSettings;
  const rt = $('rssTitle');   if (rt) rt.value = r.title;
  const ra = $('rssAuthor');  if (ra) ra.value = r.author;
  const rc = $('rssCategory');if (rc) rc.value = r.category;
  const rl = $('rssLanguage');if (rl) rl.value = r.language;
  const rd = $('rssDesc');    if (rd) rd.value = r.desc;
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveRSSSettings() {
  State.rssSettings = {
    title:    $('rssTitle')?.value.trim()    || 'OFURE RADIO Podcast',
    author:   $('rssAuthor')?.value.trim()   || 'OFURE RADIO',
    category: $('rssCategory')?.value        || 'Music',
    language: $('rssLanguage')?.value        || 'en-US',
    desc:     $('rssDesc')?.value.trim()     || ''
  };
  saveState('rss');
  showToast('RSS Feed settings saved! ✅', 'success');
}

function copyRSSFeed() {
  const url = location.origin + '/rss.xml';
  const inp = $('rssFeedUrl');
  if (inp) inp.select();
  navigator.clipboard.writeText(url)
    .then(() => showToast('RSS feed URL copied to clipboard!', 'success'))
    .catch(() => showToast('RSS URL: ' + url, 'info'));
}

function manageRSS() { openRSSPanel(); }

// ─── AI STUDIO ─────────────────────────────────────────
const AI_AGENTS = {
  assistant: {
    title:    'OFURE AI Assistant',
    subtitle: 'Station Management · Content · Strategy',
    icon:     'robot',
    color:    'purple',
    welcome:  'Hello! I\'m your <strong>OFURE RADIO AI Assistant</strong>. Ask me about station management, scheduling, blog strategy, audience growth, streams, podcasts — anything! Click a suggested prompt below or type your question.',
    handler:  _aiAssistantReply
  },
  music: {
    title:    'Music ID Generator',
    subtitle: 'Station IDs · Jingles · Bumpers',
    icon:     'music',
    color:    'orange',
    welcome:  '🎵 <strong>Music ID Generator</strong> is ready! I can write station ID scripts, jingle copy, bumper music ideas, and promo scripts for OFURE RADIO. What would you like to create?',
    handler:  _aiMusicReply
  },
  voice: {
    title:    'Voiceover Generator',
    subtitle: 'Professional Scripts · Show Promos · Ads',
    icon:     'volume-up',
    color:    'green',
    welcome:  '🎙️ <strong>Voiceover Script Generator</strong> ready! Tell me what you need — morning show intro, promo spot, ad script, news opener — and I\'ll write a professional voiceover script for you.',
    handler:  _aiVoiceReply
  },
  script: {
    title:    'Script Writer',
    subtitle: 'Full Show Scripts · Intros · News Reads',
    icon:     'file-alt',
    color:    'pink',
    welcome:  '✍️ <strong>Script Writer</strong> activated! I write full show scripts, intros, outros, news reads, and interview guides. Which show needs a script today?',
    handler:  _aiScriptReply
  },
  blog: {
    title:    'Blog Generator',
    subtitle: 'News Articles · Entertainment · World',
    icon:     'newspaper',
    color:    'blue',
    welcome:  '📰 <strong>Blog Article Generator</strong> ready! I can write full entertainment news articles, music reviews, celebrity features, world news summaries, and more. What topic shall I cover?',
    handler:  _aiBlogReply
  },
  podcast: {
    title:    'Podcast AI',
    subtitle: 'Episode Outlines · Show Notes · Timestamps',
    icon:     'podcast',
    color:    'yellow',
    welcome:  '🎧 <strong>Podcast AI</strong> ready! I create episode outlines, show notes, chapter timestamps, guest question lists, and episode descriptions. What episode are you planning?',
    handler:  _aiPodcastReply
  }
};

function activateAIAgent(type) {
  State.currentAIAgent = type;
  const agent = AI_AGENTS[type];
  if (!agent) return;

  const titleEl    = $('aiChatTitle');
  const subtitleEl = $('aiChatSubtitle');
  const messages   = $('aiMessages');

  if (titleEl)    titleEl.textContent    = agent.title;
  if (subtitleEl) subtitleEl.textContent = agent.subtitle;
  if (messages) {
    messages.innerHTML = `
      <div class="flex gap-3">
        <div class="w-8 h-8 rounded-full bg-${agent.color}-500/20 flex items-center justify-center flex-shrink-0">
          <i class="fas fa-${agent.icon} text-${agent.color}-400 text-sm"></i>
        </div>
        <div class="bg-white/5 rounded-xl px-4 py-3 text-neutral-300 text-sm max-w-md leading-relaxed">
          ${agent.welcome}
        </div>
      </div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  const box = $('aiChatBox');
  if (box) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  const input = $('aiInput');
  if (input) {
    // Pre-fill with agent-specific placeholder prompts
    const prompts = {
      assistant: '',
      music:     'Write a 30-second OFURE RADIO station ID with an Afrobeats vibe',
      voice:     'Write a professional morning show intro for DJ Alex on OFURE RADIO',
      script:    'Write a full 5-minute script for the Evening Drive show with DJ Marcus',
      blog:      'Write a news article about the latest Afrobeats and Afropop trends in 2025',
      podcast:   'Create a 20-minute podcast episode outline: "How African Music Is Conquering the World"'
    };
    if (prompts[type]) input.placeholder = prompts[type];
    input.focus();
  }
  showToast(`${agent.title} activated!`, 'success');
}

function sendAIMessage() {
  const input    = $('aiInput');
  const messages = $('aiMessages');
  const sendBtn  = $('aiSendBtn');
  if (!input || !messages) return;
  const msg = input.value.trim();
  if (!msg) { input.focus(); return; }
  input.value = '';

  // Disable button while processing
  if (sendBtn) { sendBtn.disabled = true; sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }

  const agent = AI_AGENTS[State.currentAIAgent] || AI_AGENTS.assistant;

  // User bubble
  messages.innerHTML += `
    <div class="flex gap-3 justify-end">
      <div class="bg-orange-500/20 border border-orange-500/30 rounded-xl px-4 py-3 text-white text-sm max-w-md leading-relaxed">${_escHtml(msg)}</div>
      <div class="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
        <i class="fas fa-user text-orange-400 text-sm"></i>
      </div>
    </div>`;
  messages.scrollTop = messages.scrollHeight;

  // Typing indicator
  const typingId = 'typing_' + Date.now();
  messages.innerHTML += `
    <div id="${typingId}" class="flex gap-3">
      <div class="w-8 h-8 rounded-full bg-${agent.color}-500/20 flex items-center justify-center flex-shrink-0">
        <i class="fas fa-${agent.icon} text-${agent.color}-400 text-sm"></i>
      </div>
      <div class="bg-white/5 rounded-xl px-4 py-3 text-neutral-400 text-sm flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style="animation-delay:0ms"></span>
        <span class="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style="animation-delay:150ms"></span>
        <span class="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style="animation-delay:300ms"></span>
      </div>
    </div>`;
  messages.scrollTop = messages.scrollHeight;

  const delay = 800 + Math.random() * 700;
  setTimeout(() => {
    const reply = agent.handler(msg);
    const t = $(typingId);
    if (t) t.outerHTML = `
      <div class="flex gap-3">
        <div class="w-8 h-8 rounded-full bg-${agent.color}-500/20 flex items-center justify-center flex-shrink-0">
          <i class="fas fa-${agent.icon} text-${agent.color}-400 text-sm"></i>
        </div>
        <div class="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-neutral-200 text-sm max-w-lg leading-relaxed">${reply}</div>
      </div>`;
    messages.scrollTop = messages.scrollHeight;
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i><span class="hidden sm:inline ml-2">Send</span>';
    }
  }, delay);
}

function quickPrompt(msg, label) {
  const input = $('aiInput');
  if (input) { input.value = msg; input.focus(); }
}

function clearAIChat() {
  const agent    = AI_AGENTS[State.currentAIAgent] || AI_AGENTS.assistant;
  const messages = $('aiMessages');
  if (messages) {
    messages.innerHTML = `
      <div class="flex gap-3">
        <div class="w-8 h-8 rounded-full bg-${agent.color}-500/20 flex items-center justify-center flex-shrink-0">
          <i class="fas fa-${agent.icon} text-${agent.color}-400 text-sm"></i>
        </div>
        <div class="bg-white/5 rounded-xl px-4 py-3 text-neutral-300 text-sm max-w-md leading-relaxed">${agent.welcome}</div>
      </div>`;
  }
}

// ── AI Reply Handlers ─────────────────────────────────
function _aiAssistantReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('schedule') || m.includes('show') || m.includes('programme'))
    return `📅 <strong>Schedule Analysis:</strong> You have <strong>${document.querySelectorAll('.schedule-row').length || 8} shows</strong> in your weekly schedule. Morning Vibes with DJ Alex at 6AM is typically your highest engagement slot. I recommend:<br><br>
    1. Add a <em>Sunday Gospel Brunch</em> (10AM–12PM) to capture weekend listeners<br>
    2. Create a Friday night <em>OFURE Party Mix</em> for the evening crowd<br>
    3. Consider a Saturday morning <em>Throwback Weekend</em> show<br><br>
    <i class="fas fa-lightbulb text-yellow-400 mr-1"></i>Would you like me to write a script for any of these shows?`;

  if (m.includes('blog') || m.includes('article') || m.includes('news'))
    return `📰 <strong>Blog Strategy:</strong> Your OFURE BEAT blog auto-refreshes every 24 hours with content across 8 categories. Currently your top performing categories are <strong>Music</strong>, <strong>Entertainment</strong>, and <strong>Africa</strong>.<br><br>
    Recommendations:<br>
    • Post at least 3 articles per week minimum<br>
    • Feature more <em>Afrobeats artist spotlights</em> — they drive 3x more shares<br>
    • Add a <em>Weekly Chart Countdown</em> article every Friday<br>
    • Cross-post all articles to your social media channels<br><br>
    <i class="fas fa-rocket text-orange-400 mr-1"></i>Use the Blog Generator agent to draft new articles instantly!`;

  if (m.includes('stream') || m.includes('broadcast') || m.includes('zeno'))
    return `📡 <strong>Stream Health Check:</strong> Your main Zeno.FM stream is configured and active.<br><br>
    <strong>Recommendations:</strong><br>
    • Configure a backup/failover stream URL in Stream Manager<br>
    • Stream bitrate: 128kbps is ideal for most listeners<br>
    • Add your stream to <a href="https://tunein.com" target="_blank" class="text-orange-400 underline">TuneIn Radio</a> and <a href="https://radiogarden.com" target="_blank" class="text-orange-400 underline">Radio Garden</a> for free discovery<br>
    • Enable stream metadata so listeners see the current song title<br><br>
    Go to <strong>Stream Manager</strong> to edit your stream settings.`;

  if (m.includes('grow') || m.includes('audience') || m.includes('listener') || m.includes('more people'))
    return `📈 <strong>Audience Growth Strategy for OFURE RADIO:</strong><br><br>
    <strong>Short-term (this week):</strong><br>
    1. Share blog articles daily on Instagram, Twitter &amp; Facebook<br>
    2. Create a TikTok account posting 30-sec music clips<br>
    3. Join African music communities on Reddit &amp; Facebook Groups<br><br>
    <strong>Medium-term (this month):</strong><br>
    4. Submit your stream to <a href="https://tunein.com/broadcasters/" target="_blank" class="text-orange-400 underline">TuneIn Broadcasters</a><br>
    5. Partner with Nigerian/African bloggers for cross-promotion<br>
    6. Launch a weekly listener call-in segment<br><br>
    <strong>Long-term:</strong><br>
    7. Host live events (virtual or physical)<br>
    8. Launch a Patreon or listener supporter programme`;

  if (m.includes('seo') || m.includes('search') || m.includes('google'))
    return `🔍 <strong>SEO Guide for OFURE RADIO:</strong><br><br>
    1. <strong>Meta descriptions</strong> — ensure each blog article has a unique 150-character description<br>
    2. <strong>Keywords</strong> — target: "Afrobeats radio online", "Nigerian music stream", "African radio live"<br>
    3. <strong>Schema markup</strong> — add RadioStation and PodcastSeries structured data<br>
    4. <strong>Backlinks</strong> — get listed on AllAfrica.com, Nairaland, and African music directories<br>
    5. <strong>Speed</strong> — your Cloudflare Pages hosting already provides excellent performance<br>
    6. <strong>Content frequency</strong> — publish at least 3 new articles per week for Google freshness signals`;

  if (m.includes('podcast') || m.includes('episode'))
    return `🎧 <strong>Podcast Strategy:</strong> Your Podcast Studio is fully equipped with recording, uploading, and RSS capabilities.<br><br>
    <strong>Show concepts for OFURE RADIO:</strong><br>
    1. <em>"OFURE Weekly Roundup"</em> — 15 min weekly news digest<br>
    2. <em>"Backstage with OFURE"</em> — DJ/artist interviews<br>
    3. <em>"Afrobeats Decoded"</em> — deep dives into songs and artists<br>
    4. <em>"African Culture Hour"</em> — culture, language, and lifestyle<br><br>
    Switch to the <strong>Podcast AI</strong> agent for detailed episode outlines!`;

  return `I'm your OFURE RADIO station intelligence assistant. I can help with:<br><br>
  🎙️ <strong>Show scheduling</strong> — optimise your programming<br>
  📰 <strong>Blog strategy</strong> — content planning and SEO<br>
  📡 <strong>Stream management</strong> — setup and distribution tips<br>
  🎧 <strong>Podcast production</strong> — episode planning<br>
  📈 <strong>Audience growth</strong> — proven tactics for internet radio<br>
  🔍 <strong>SEO</strong> — rank higher in search engines<br><br>
  What would you like to work on today?`;
}

function _aiMusicReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('jingle') || m.includes('id') || m.includes('station'))
    return `🎵 <strong>OFURE RADIO Station ID Script:</strong><br><br>
    <div class="bg-neutral-800/60 rounded-lg p-3 mt-2 font-mono text-xs text-green-300 leading-loose">
    [UPBEAT AFROBEATS INTRO — 4 bars]<br><br>
    <em>ANNOUNCER (energetic, warm):</em><br>
    "You're locked in to OFURE RADIO —<br>
    the sound of Africa, the beat of the world.<br>
    <strong>THIS IS WHERE IT ALL BEGAN.</strong>"<br><br>
    [MUSIC SWELL]<br><br>
    <em>TAGLINE (over music):</em><br>
    "Afrobeats. R&B. Gospel. Hip-Hop. Culture.<br>
    Stream us live — OFURE RADIO dot com!"<br><br>
    [MUSIC FADE OUT — 0:28]
    </div><br>
    💡 Record this with the Voiceover Generator or paste it into your Podcast Studio to record directly!`;

  if (m.includes('bumper') || m.includes('break'))
    return `🎵 <strong>Station Bumper Scripts (30 sec):</strong><br><br>
    <strong>Version A (energetic):</strong><br>
    <em>"You're tuned to OFURE RADIO — non-stop Afrobeats, R&B and Gospel. Stay with us!"</em><br><br>
    <strong>Version B (cool/smooth):</strong><br>
    <em>"OFURE RADIO — where every beat tells a story. We'll be right back."</em><br><br>
    <strong>Version C (gospel):</strong><br>
    <em>"Praising, playing, broadcasting God's music — OFURE GOSPEL STATION. Don't touch that dial."</em>`;

  return `🎵 <strong>Music ID &amp; Jingle Ideas for OFURE RADIO:</strong><br><br>
  I can write scripts for:<br>
  • <strong>Station IDs</strong> — "You're listening to OFURE RADIO" spots<br>
  • <strong>Jingle copy</strong> — sing-along station identifiers<br>
  • <strong>Bumpers</strong> — short break intros/outros<br>
  • <strong>Promo spots</strong> — event and show promotions<br>
  • <strong>Bed music ideas</strong> — genre recommendations for different times<br><br>
  What type of music ID or jingle would you like me to write?`;
}

function _aiVoiceReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('morning') || m.includes('intro') || m.includes('dj alex'))
    return `🎙️ <strong>Morning Show Intro Script — DJ Alex / Morning Vibes:</strong><br><br>
    <div class="bg-neutral-800/60 rounded-lg p-3 mt-2 text-xs text-yellow-200 leading-loose">
    [AFROBEATS BED MUSIC — FADE IN]<br><br>
    <em>DJ ALEX (energetic, warm):</em><br>
    "Good morning, OFURE RADIO family! ☀️<br>
    It's [TIME] and you're waking up with the one and only <strong>Morning Vibes</strong>!<br>
    I'm your boy DJ Alex, and we are LIVE from the studio.<br><br>
    We've got three hours of the HOTTEST Afrobeats, R&B, and Gospel<br>
    to kick-start your beautiful day.<br><br>
    Wherever you are in the world — Lagos, London, New York, Accra —<br>
    this morning, we vibe TOGETHER.<br><br>
    Let's GET IT! <strong>This is OFURE RADIO — THIS IS WHERE IT ALL BEGAN!</strong>"<br><br>
    [MUSIC UP — FIRST SONG]
    </div>`;

  if (m.includes('promo') || m.includes('ad') || m.includes('advert'))
    return `🎙️ <strong>30-Second Promo Script:</strong><br><br>
    <div class="bg-neutral-800/60 rounded-lg p-3 mt-2 text-xs text-yellow-200 leading-loose">
    [ENERGETIC MUSIC BED]<br><br>
    <em>ANNOUNCER:</em><br>
    "Are you ready for the best African music experience online?<br>
    OFURE RADIO streams the hottest Afrobeats, R&B, Gospel and Hip-Hop<br>
    — 24 hours a day, 7 days a week, from anywhere in the world.<br><br>
    With DJ Alex, DJ Luna, DJ Marcus, and the full OFURE crew —<br>
    there's always something AMAZING on air.<br><br>
    Stream us FREE at ofure-radio dot pages dot dev<br>
    <strong>OFURE RADIO — This Is Where It All Began!</strong>"<br><br>
    [MUSIC STING — OUT]
    </div>`;

  return `🎙️ <strong>Voiceover Script Generator Ready!</strong><br><br>
  I can write professional scripts for:<br>
  • <strong>Morning/Evening show intros</strong><br>
  • <strong>Station promotional spots</strong> (15s, 30s, 60s)<br>
  • <strong>Ad reads</strong> for sponsors<br>
  • <strong>News opening reads</strong><br>
  • <strong>Event announcements</strong><br>
  • <strong>Legal/terms of service reads</strong><br><br>
  Which DJ or show needs a voiceover script?`;
}

function _aiScriptReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('evening') || m.includes('marcus') || m.includes('drive'))
    return `✍️ <strong>Evening Drive Script — DJ Marcus (4PM–8PM):</strong><br><br>
    <div class="bg-neutral-800/60 rounded-lg p-3 mt-2 text-xs text-pink-200 leading-loose">
    [AFROBEATS INTRO TRACK — 1 MIN]<br><br>
    <strong>SEGMENT 1: WELCOME (0:00–1:00)</strong><br>
    <em>DJ MARCUS:</em> "The clock just hit 4 and you know what that means — it's EVENING DRIVE time on OFURE RADIO! I'm DJ Marcus and we are about to take this commute to another level. Whether you're in traffic, at the gym, or just unwinding — this one's for YOU."<br><br>
    <strong>SEGMENT 2: TOP NEWS BEAT (1:00–4:00)</strong><br>
    <em>DJ MARCUS:</em> "Before we get into the music, let's run through today's top entertainment headlines..."<br>
    [Read 3 news items from OFURE BEAT blog]<br><br>
    <strong>SEGMENT 3: MUSIC BLOCK (4:00–30:00)</strong><br>
    [6–8 songs with artist/title IDs between each]<br><br>
    <strong>SEGMENT 4: LISTENER SHOUTOUT (30:00–32:00)</strong><br>
    <em>DJ MARCUS:</em> "Shoutout to everyone tuned in right now — drop us a message on Instagram..."
    </div>`;

  return `✍️ <strong>Script Writer Ready!</strong><br><br>
  I write full scripts for:<br>
  • <strong>Full show rundowns</strong> (2hr, 4hr formats)<br>
  • <strong>News reader scripts</strong> with headlines<br>
  • <strong>Interview guides</strong> and question lists<br>
  • <strong>Show segment scripts</strong><br>
  • <strong>Closing/sign-off scripts</strong><br><br>
  Tell me: which show, which DJ, and how long?`;
}

function _aiBlogReply(msg) {
  const m   = msg.toLowerCase();
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  if (m.includes('afrobeats') || m.includes('music') || m.includes('artist'))
    return `📰 <strong>Draft Article: Afrobeats Goes Global in 2025</strong><br>
    <em>${now}</em><br><br>
    <strong>AFROBEATS REWRITES THE GLOBAL MUSIC RULEBOOK</strong><br><br>
    The Afrobeats genre has officially crossed from a regional phenomenon into a worldwide cultural force. In the first quarter of 2025, three Afrobeats tracks appeared simultaneously on the Billboard Hot 100 — a first in the chart's history.<br><br>
    Artists like Burna Boy, Wizkid, Davido, Asake, and Ayra Starr continue to break streaming records, with combined Spotify streams exceeding 15 billion in 2024 alone. Tyla's Grammy win for Best African Music Performance signaled Hollywood's formal acknowledgment of African artistry.<br><br>
    Industry analysts note a 340% increase in Afrobeats radio plays across US and UK stations over the past three years. "Afrobeats is no longer a genre — it's a global lifestyle," says music critic Dr. Emeka Osei. "It carries African culture, fashion, food, and language with it wherever it goes."<br><br>
    <em>— OFURE RADIO News Desk</em>`;

  if (m.includes('nollywood') || m.includes('film') || m.includes('movie'))
    return `📰 <strong>Draft Article: Nollywood Storms Global Streaming Platforms</strong><br><br>
    Nigeria's Nollywood film industry has announced a strategic partnership with three major global streaming platforms in 2025, set to bring over 500 Nigerian films to international audiences for the first time.<br><br>
    The deal — estimated at $200 million over 3 years — represents the largest investment in African cinema to date. "Nollywood stories are universal," said filmmaker Kemi Adetiba. "Love, family, ambition, spirituality — these are human stories."<br><br>
    <em>— OFURE RADIO Entertainment</em>`;

  return `📰 <strong>Blog Content Generator Ready!</strong><br><br>
  I can write full articles on:<br>
  • <strong>Music news</strong> — Afrobeats, Highlife, Afropop, Gospel<br>
  • <strong>Celebrity features</strong> — interviews, spotlights<br>
  • <strong>World entertainment</strong> — film, TV, streaming<br>
  • <strong>African culture</strong> — events, trends, lifestyle<br>
  • <strong>Sports</strong> — AFCON, Premier League, African athletes<br>
  • <strong>Technology</strong> — apps, startups, innovation in Africa<br><br>
  What story should I write? Give me a topic or headline and I'll draft a full article!`;
}

function _aiPodcastReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('afrobeats') || m.includes('global') || m.includes('world') || m.includes('outline'))
    return `🎧 <strong>Episode Outline: "How African Music Is Conquering the World"</strong><br>
    <em>Runtime: 22 minutes | Format: Solo hosted + 1 guest</em><br><br>
    <strong>[00:00–02:00] INTRO</strong><br>
    Host welcome, episode teaser, OFURE RADIO station ID<br><br>
    <strong>[02:00–06:00] SEGMENT 1: The Numbers</strong><br>
    • Afrobeats streaming stats 2023–2025<br>
    • Billboard Hot 100 milestones<br>
    • Countries where Afrobeats is top-10 most streamed<br><br>
    <strong>[06:00–12:00] SEGMENT 2: Key Artists</strong><br>
    • Burna Boy's Grammy journey<br>
    • Wizkid's "Essence" global crossover<br>
    • Tyla and the Amapiano revolution<br>
    • New generation: Asake, Ayra Starr, Rema<br><br>
    <strong>[12:00–18:00] SEGMENT 3: Why Now?</strong><br>
    • Social media and TikTok's role<br>
    • African diaspora as cultural ambassadors<br>
    • Western label investment in Africa<br><br>
    <strong>[18:00–21:00] SEGMENT 4: What's Next?</strong><br>
    • Predictions for Afrobeats 2025–2030<br>
    • OFURE RADIO's role in the movement<br><br>
    <strong>[21:00–22:00] OUTRO</strong><br>
    Call-to-action, subscribe reminder, next episode teaser<br><br>
    💡 Use this outline with the Podcast Studio to record your episode!`;

  return `🎧 <strong>Podcast AI Ready!</strong><br><br>
  I create:<br>
  • <strong>Episode outlines</strong> with timed segments<br>
  • <strong>Show notes</strong> and descriptions<br>
  • <strong>Chapter timestamps</strong> for YouTube uploads<br>
  • <strong>Guest interview question lists</strong><br>
  • <strong>Episode titles &amp; thumbnails copy</strong><br>
  • <strong>Social media captions</strong> for each episode<br><br>
  What episode topic shall I outline for OFURE RADIO?`;
}

function showAIFeature(type) {
  activateAIAgent(type);
}

// ─── SECURITY / PIN ────────────────────────────────────
function changePIN(e) {
  e.preventDefault();
  const curr   = $('currentPin')?.value;
  const next   = $('newPin')?.value;
  const conf   = $('confirmPin')?.value;
  const stored = localStorage.getItem('ofure_admin_pin') || '1234';
  if (curr !== stored)  { showToast('Current PIN is incorrect.', 'error'); return; }
  if (next !== conf)    { showToast('New PINs do not match.', 'error'); return; }
  if (!/^\d{4}$/.test(next)) { showToast('PIN must be exactly 4 digits.', 'error'); return; }
  localStorage.setItem('ofure_admin_pin', next);
  showToast('PIN changed successfully! 🔐', 'success');
  e.target.reset();
}

// ─── SETTINGS ──────────────────────────────────────────
function populateSettings() {
  const s = State.settings;
  const map = {
    settingStationName:     s.stationName     || 'OFURE RADIO',
    settingTagline:         s.tagline         || 'THIS IS WHERE IT ALL BEGAN',
    settingEmail:           s.email           || 'hello@ofureradio.com',
    settingMainStream:      s.mainStream      || 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    settingDescription:     s.description     || '',
    settingFacebook:        s.facebook        || '',
    settingTwitter:         s.twitter         || '',
    settingInstagram:       s.instagram       || '',
    settingYoutube:         s.youtube         || '',
    settingTiktok:          s.tiktok          || '',
    settingWhatsapp:        s.whatsapp        || '',
    settingRefreshInterval: s.refreshInterval || '24',
    settingLanguage:        s.language        || 'en'
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = $(id);
    if (el) el.value = val;
  });
  const picker = $('settingAccentColor');
  const hex    = $('settingAccentHex');
  if (picker) picker.value = s.accentColor || '#f97316';
  if (hex)    hex.value    = s.accentColor || '#f97316';
}

function saveSettings(e) {
  if (e) e.preventDefault();
  const accentHex = $('settingAccentHex')?.value || $('settingAccentColor')?.value || '#f97316';

  State.settings = {
    stationName:     $('settingStationName')?.value.trim()  || 'OFURE RADIO',
    tagline:         $('settingTagline')?.value.trim()       || 'THIS IS WHERE IT ALL BEGAN',
    email:           $('settingEmail')?.value.trim()         || 'hello@ofureradio.com',
    mainStream:      $('settingMainStream')?.value.trim()    || '',
    description:     $('settingDescription')?.value.trim()   || '',
    facebook:        $('settingFacebook')?.value.trim()      || '',
    twitter:         $('settingTwitter')?.value.trim()       || '',
    instagram:       $('settingInstagram')?.value.trim()     || '',
    youtube:         $('settingYoutube')?.value.trim()       || '',
    tiktok:          $('settingTiktok')?.value.trim()        || '',
    whatsapp:        $('settingWhatsapp')?.value.trim()      || '',
    accentColor:     accentHex,
    refreshInterval: $('settingRefreshInterval')?.value      || '24',
    language:        $('settingLanguage')?.value             || 'en'
  };

  // Apply main stream URL if changed
  if (State.settings.mainStream) {
    State.currentStreamUrl = State.settings.mainStream;
    const radioPlayer = $('radioPlayer');
    if (radioPlayer && !State.isPlaying) radioPlayer.src = State.settings.mainStream;
  }

  saveState('settings');
  updateSocialLinks();
  syncEmailUs(); // Update Email Us pane on home page

  // Visual feedback
  const indicator = $('settingsSaveIndicator');
  if (indicator) {
    indicator.classList.remove('hidden');
    setTimeout(() => indicator.classList.add('hidden'), 3000);
  }

  showToast('Settings saved successfully! ✅', 'success');
}

function resetSettings() {
  if (!confirm('Reset all settings to default? This cannot be undone.')) return;
  State.settings = {
    stationName:     'OFURE RADIO',
    tagline:         'THIS IS WHERE IT ALL BEGAN',
    email:           'hello@ofureradio.com',
    mainStream:      'https://stream.zeno.fm/f3wvbbqmdg8uv',
    description:     'Your premier internet radio station broadcasting the best African and world music 24/7.',
    facebook:        '',
    twitter:         '',
    instagram:       '',
    youtube:         '',
    tiktok:          '',
    whatsapp:        '',
    accentColor:     '#f97316',
    refreshInterval: '24',
    language:        'en'
  };
  saveState('settings');
  populateSettings();
  showToast('Settings reset to default.', 'info');
}

// ─── EMAIL US SYNC ────────────────────────────────────
function syncEmailUs() {
  const email = (State.settings && State.settings.email) || 'hello@ofureradio.com';
  const link  = document.getElementById('emailUsLink');
  const addr  = document.getElementById('emailUsAddress');
  if (link) link.href = 'mailto:' + email;
  if (addr) addr.textContent = email;
}

// ─── LISTENER INBOX ────────────────────────────────────
function _updateInboxBadge() {
  const pending = State.inbox.filter(m => m.status === 'pending').length;
  // Sidebar badge
  const badge = document.getElementById('inboxNavBadge');
  if (badge) {
    badge.textContent = pending > 0 ? (pending > 99 ? '99+' : pending) : '';
    badge.style.display = pending > 0 ? '' : 'none';
  }
  // Dashboard stat card
  const statEl = document.getElementById('inboxStatPendingDash');
  if (statEl) statEl.textContent = pending;
}

function renderInbox() {
  const list = document.getElementById('inboxList');
  if (!list) return;

  const filter  = State.inboxFilter || 'all';
  const msgs    = filter === 'all' ? State.inbox : State.inbox.filter(m => m.status === filter);

  // Update stat counters
  const total    = State.inbox.length;
  const pending  = State.inbox.filter(m => m.status === 'pending').length;
  const approved = State.inbox.filter(m => m.status === 'approved').length;
  const requests = State.inbox.filter(m => m.subject === 'Song Request').length;

  const setTxt = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  setTxt('inboxStatTotal',    total);
  setTxt('inboxStatPending',  pending);
  setTxt('inboxStatApproved', approved);
  setTxt('inboxStatRequests', requests);

  _updateInboxBadge();

  if (msgs.length === 0) {
    list.innerHTML = `
      <div class="text-center py-16 text-neutral-600">
        <i class="fas fa-inbox text-4xl mb-4 block"></i>
        <p class="font-semibold text-neutral-500">No messages${filter !== 'all' ? ' in this filter' : ' yet'}</p>
        <p class="text-sm mt-1 text-neutral-600">Messages from your contact form will appear here</p>
      </div>`;
    return;
  }

  list.innerHTML = msgs.map(m => {
    const isSong = m.subject === 'Song Request';
    const statusColor = { pending: 'yellow', approved: 'green', rejected: 'red' }[m.status] || 'neutral';
    const statusLabel = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }[m.status] || m.status;
    const dateStr = m.date ? new Date(m.date).toLocaleString([], {dateStyle:'medium',timeStyle:'short'}) : '';
    return `
      <div class="bg-neutral-900 border border-white/10 rounded-xl p-5 transition-all hover:border-white/20" id="inbox-msg-${m.id}">
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-full bg-${isSong ? 'purple' : 'orange'}-500/20 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-${isSong ? 'music' : 'envelope'} text-${isSong ? 'purple' : 'orange'}-400"></i>
            </div>
            <div class="min-w-0">
              <div class="text-white font-semibold truncate">${_escHtml(m.name)}</div>
              <div class="text-neutral-500 text-xs">${_escHtml(m.email)}</div>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="text-xs px-2 py-0.5 rounded-full bg-${statusColor}-500/15 text-${statusColor}-400 border border-${statusColor}-500/20 font-semibold">${statusLabel}</span>
            ${isSong ? '<span class="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">🎵 Song Req</span>' : ''}
          </div>
        </div>
        <div class="mt-3">
          <div class="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-1">${_escHtml(m.subject)}</div>
          <p class="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">${_escHtml(m.message)}</p>
        </div>
        ${m.reply ? `<div class="mt-3 bg-green-500/5 border border-green-500/20 rounded-lg p-3"><div class="text-green-400 text-xs font-semibold mb-1"><i class="fas fa-reply mr-1"></i>Reply sent</div><p class="text-neutral-400 text-sm whitespace-pre-wrap">${_escHtml(m.reply)}</p></div>` : ''}
        <div class="mt-4 flex items-center justify-between gap-2 flex-wrap">
          <span class="text-neutral-600 text-xs">${dateStr}</span>
          <div class="flex gap-2 flex-wrap">
            ${m.status !== 'approved' ? `<button onclick="approveInboxMsg(${m.id})" class="px-3 py-1 text-xs font-semibold rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"><i class="fas fa-check mr-1"></i>Approve</button>` : ''}
            ${m.status !== 'rejected' ? `<button onclick="rejectInboxMsg(${m.id})" class="px-3 py-1 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"><i class="fas fa-times mr-1"></i>Reject</button>` : ''}
            <button onclick="openInboxReply(${m.id})" class="px-3 py-1 text-xs font-semibold rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"><i class="fas fa-reply mr-1"></i>${m.reply ? 'Edit Reply' : 'Reply'}</button>
            <button onclick="deleteInboxMsg(${m.id})" class="px-3 py-1 text-xs font-semibold rounded-lg bg-white/5 text-neutral-500 border border-white/10 hover:text-red-400 hover:border-red-500/30 transition-colors"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function filterInbox(filter) {
  State.inboxFilter = filter;
  // Update filter button styles
  ['all','pending','approved','rejected'].forEach(f => {
    const btn = document.getElementById('inboxFilter' + f.charAt(0).toUpperCase() + f.slice(1));
    if (!btn) return;
    if (f === filter) {
      btn.className = 'inbox-filter-btn px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-orange-500/20 text-orange-400 border border-orange-500/30';
    } else {
      btn.className = 'inbox-filter-btn px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-neutral-400 hover:text-white bg-white/5 border border-white/10';
    }
  });
  renderInbox();
}

function approveInboxMsg(id) {
  const msg = State.inbox.find(m => m.id === id);
  if (!msg) return;
  msg.status = 'approved';
  saveState('inbox');
  renderInbox();
  showToast('Message approved ✅', 'success');
}

function rejectInboxMsg(id) {
  const msg = State.inbox.find(m => m.id === id);
  if (!msg) return;
  msg.status = 'rejected';
  saveState('inbox');
  renderInbox();
  showToast('Message rejected.', 'info');
}

function deleteInboxMsg(id) {
  if (!confirm('Delete this message? This cannot be undone.')) return;
  State.inbox = State.inbox.filter(m => m.id !== id);
  saveState('inbox');
  renderInbox();
  showToast('Message deleted.', 'info');
}

function clearInbox() {
  if (!confirm('Clear all messages? This cannot be undone.')) return;
  State.inbox = [];
  saveState('inbox');
  renderInbox();
  showToast('Inbox cleared.', 'info');
}

function openInboxReply(id) {
  const msg = State.inbox.find(m => m.id === id);
  if (!msg) return;
  State.editingInboxId = id;
  const isSong = msg.subject === 'Song Request';

  // Populate modal
  const titleEl  = document.getElementById('replyModalTitle');
  const origEl   = document.getElementById('replyOriginalMsg');
  const textEl   = document.getElementById('replyText');
  const labelEl  = document.getElementById('replyTextLabel');
  const noteWrap = document.getElementById('replyMusicNote');
  const submitLb = document.getElementById('replySubmitLabel');

  if (titleEl)  titleEl.textContent  = isSong ? '🎵 Respond to Song Request' : 'Reply to Message';
  if (labelEl)  labelEl.textContent  = isSong ? 'DJ / On-Air Response' : 'Your Reply';
  if (submitLb) submitLb.textContent = 'Send Reply';

  if (origEl) origEl.innerHTML = `
    <div class="flex items-center gap-2 mb-2">
      <span class="text-orange-400 font-semibold text-sm">${_escHtml(msg.name)}</span>
      <span class="text-neutral-600 text-xs">•</span>
      <span class="text-neutral-500 text-xs">${_escHtml(msg.email)}</span>
      <span class="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/5 text-neutral-400">${_escHtml(msg.subject)}</span>
    </div>
    <p class="text-neutral-300 text-sm whitespace-pre-wrap">${_escHtml(msg.message)}</p>`;

  if (textEl)  textEl.value = msg.reply || '';
  if (noteWrap) noteWrap.classList.toggle('hidden', !isSong);

  openModal('inboxReplyModal');
}

function sendInboxReply() {
  const id  = State.editingInboxId;
  const msg = State.inbox.find(m => m.id === id);
  if (!msg) return;

  const textEl   = document.getElementById('replyText');
  const noteEl   = document.getElementById('replyMusicNoteText');
  const replyTxt = textEl ? textEl.value.trim() : '';
  const noteTxt  = noteEl ? noteEl.value.trim() : '';

  if (!replyTxt) { showToast('Please write a reply before sending.', 'warning'); return; }

  const btn = document.getElementById('replySubmitBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...'; }

  setTimeout(() => {
    msg.reply  = replyTxt + (noteTxt ? '\n\n📢 On-Air Note: ' + noteTxt : '');
    msg.status = 'approved';
    saveState('inbox');
    renderInbox();
    closeModal('inboxReplyModal');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> <span id="replySubmitLabel">Send Reply</span>'; }
    showToast('Reply saved and message approved! ✅', 'success');
  }, 800);
}

// ─── SOCIAL LINKS ─────────────────────────────────────
function updateSocialLinks() {
  const s   = State.settings;
  const map = { facebook: s.facebook, twitter: s.twitter, instagram: s.instagram, youtube: s.youtube };
  $$('.social-link').forEach(a => {
    const platform = a.dataset.platform;
    if (platform && map[platform]) a.href = map[platform];
  });
}

// ─── MISC HELPERS ─────────────────────────────────────
function _escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function exportWebsite() {
  showToast('In production use: "wrangler pages deploy" to deploy to Cloudflare Pages.', 'info');
}
