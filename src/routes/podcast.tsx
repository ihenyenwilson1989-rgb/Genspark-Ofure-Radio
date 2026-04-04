export function podcastPage(): string {
  return `
  <!-- Podcast Page Navigation -->
  <nav id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-broadcast-tower text-white text-sm"></i>
          </div>
          <div>
            <div class="text-white font-black text-xl tracking-tight font-display">OFURE RADIO</div>
            <div class="text-orange-400 text-xs tracking-widest uppercase font-bold">THIS IS WHERE IT ALL BEGAN</div>
          </div>
        </a>
        <div class="hidden md:flex items-center gap-6">
          <a href="/" class="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium">Home</a>
          <a href="/#schedule" class="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium">Schedule</a>
          <a href="/#streams" class="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium">Listen Live</a>
          <a href="/blog" class="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium">Blog</a>
          <a href="/podcast" class="text-orange-400 font-semibold text-sm">Podcasts</a>
          <a href="/#contact" class="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium">Contact</a>
          <a href="/admin" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
            <i class="fas fa-cog mr-1"></i> Admin
          </a>
        </div>
        <button id="mobileMenuBtn" class="md:hidden text-white p-2">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>
    </div>
    <div id="mobileMenu" class="hidden md:hidden bg-neutral-900/95 backdrop-blur-lg border-t border-white/10">
      <div class="px-4 py-4 space-y-3">
        <a href="/" class="block text-neutral-300 text-sm font-medium py-2">Home</a>
        <a href="/#schedule" class="block text-neutral-300 text-sm font-medium py-2 mobile-menu-close">Schedule</a>
        <a href="/#streams" class="block text-neutral-300 text-sm font-medium py-2 mobile-menu-close">Listen Live</a>
        <a href="/blog" class="block text-neutral-300 text-sm font-medium py-2">Blog & News</a>
        <a href="/podcast" class="block text-orange-400 text-sm font-semibold py-2">Podcasts</a>
        <a href="/#contact" class="block text-neutral-300 text-sm font-medium py-2 mobile-menu-close">Contact</a>
        <a href="/admin" class="block bg-orange-500 text-white text-sm font-semibold py-2 px-4 rounded-full text-center mt-2">Admin Studio</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="pt-24 pb-12 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="inline-flex items-center gap-2 text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
        <div class="w-8 h-px bg-orange-400"></div>
        OFURE RADIO
        <div class="w-8 h-px bg-orange-400"></div>
      </div>
      <h1 class="text-5xl md:text-6xl font-black font-display text-white mb-4">
        Podcast <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">Episodes</span>
      </h1>
      <p class="text-neutral-400 text-lg max-w-2xl mx-auto mb-8">
        Deep dives, conversations, music analysis and exclusive content from the OFURE RADIO family. Listen anywhere, anytime.
      </p>
      <!-- Live player bar -->
      <div id="podcastHeroPlayer" class="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
        <div class="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
        <span class="text-white text-sm font-medium">OFURE RADIO — Live Stream</span>
        <button onclick="togglePlay()" class="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-colors ml-2">
          <i class="fas fa-play text-white text-xs" id="podcastPlayIcon"></i>
        </button>
      </div>
    </div>
  </section>

  <!-- Stats bar -->
  <div class="bg-white/3 border-y border-white/10 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-2xl font-black text-white" id="podcastStatEpisodes">0</div>
          <div class="text-neutral-500 text-xs uppercase tracking-wider">Episodes</div>
        </div>
        <div>
          <div class="text-2xl font-black text-orange-400">24/7</div>
          <div class="text-neutral-500 text-xs uppercase tracking-wider">Streaming</div>
        </div>
        <div>
          <div class="text-2xl font-black text-white">4+</div>
          <div class="text-neutral-500 text-xs uppercase tracking-wider">Platforms</div>
        </div>
        <div>
          <div class="text-2xl font-black text-purple-400">FREE</div>
          <div class="text-neutral-500 text-xs uppercase tracking-wider">Always</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Filter bar -->
  <section class="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-wrap items-center gap-3 mb-8">
      <span class="text-neutral-400 text-sm font-medium mr-2">Filter:</span>
      <button onclick="filterPodcastPage('all')" id="podFilterAll"
        class="podcast-filter-btn px-4 py-2 rounded-full text-sm font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 transition-colors">
        All Episodes
      </button>
      <button onclick="filterPodcastPage('Song Request')" id="podFilterSong"
        class="podcast-filter-btn px-4 py-2 rounded-full text-sm font-semibold bg-white/5 text-neutral-400 border border-white/10 hover:text-white transition-colors">
        🎵 Music
      </button>
      <button onclick="filterPodcastPage('interview')" id="podFilterInterview"
        class="podcast-filter-btn px-4 py-2 rounded-full text-sm font-semibold bg-white/5 text-neutral-400 border border-white/10 hover:text-white transition-colors">
        🎙️ Interviews
      </button>
      <button onclick="filterPodcastPage('culture')" id="podFilterCulture"
        class="podcast-filter-btn px-4 py-2 rounded-full text-sm font-semibold bg-white/5 text-neutral-400 border border-white/10 hover:text-white transition-colors">
        🌍 Culture
      </button>
      <div class="ml-auto">
        <a href="/admin#podcast" onclick="setTimeout(()=>showPanel&&showPanel('podcast'),300)"
          class="flex items-center gap-2 text-xs text-neutral-500 hover:text-orange-400 transition-colors border border-white/10 hover:border-orange-500/30 rounded-lg px-3 py-2">
          <i class="fas fa-plus"></i> Add Episode (Admin)
        </a>
      </div>
    </div>

    <!-- Episodes grid — populated by JS from localStorage -->
    <div id="podcastPageGrid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Skeleton loaders -->
      ${[1,2,3].map(() => `
      <div class="podcast-skeleton bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
        <div class="h-44 bg-white/10"></div>
        <div class="p-5">
          <div class="h-4 bg-white/10 rounded w-1/3 mb-3"></div>
          <div class="h-5 bg-white/10 rounded w-4/5 mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-full mb-1"></div>
          <div class="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
          <div class="flex gap-2">
            <div class="h-9 bg-white/10 rounded-xl flex-1"></div>
            <div class="h-9 w-9 bg-white/10 rounded-xl"></div>
          </div>
        </div>
      </div>`).join('')}
    </div>

    <!-- Empty state (hidden by default) -->
    <div id="podcastPageEmpty" class="hidden text-center py-20">
      <div class="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-6">
        <i class="fas fa-podcast text-orange-400 text-3xl"></i>
      </div>
      <h2 class="text-white text-2xl font-bold mb-3">No Episodes Yet</h2>
      <p class="text-neutral-400 mb-6 max-w-sm mx-auto">Episodes published from the Admin Podcast Studio will appear here automatically.</p>
      <a href="/admin" class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
        <i class="fas fa-plus"></i> Create First Episode
      </a>
    </div>
  </section>

  <!-- Subscribe platforms -->
  <section class="py-16 bg-gradient-to-r from-orange-500/10 to-purple-600/10 border-y border-white/10">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-black font-display text-white mb-3">Subscribe &amp; Never Miss an Episode</h2>
      <p class="text-neutral-400 mb-8">Available on all major podcast platforms</p>
      <div class="flex flex-wrap justify-center gap-4">
        ${[
          { name: 'Spotify', icon: 'spotify', url: 'https://podcasters.spotify.com/', color: 'green' },
          { name: 'Apple Podcasts', icon: 'apple', url: 'https://podcastsconnect.apple.com/', color: 'purple' },
          { name: 'Google Podcasts', icon: 'google', url: 'https://podcastsmanager.google.com/', color: 'blue' },
          { name: 'TuneIn Radio', icon: 'broadcast-tower', url: 'https://tunein.com/podcasts/', color: 'orange' },
        ].map(p => `
        <a href="${p.url}" target="_blank"
          class="flex items-center gap-3 bg-${p.color}-500/10 border border-${p.color}-500/20 hover:bg-${p.color}-500/20 rounded-xl px-6 py-3 transition-all text-${p.color}-400 font-semibold text-sm">
          <i class="fab fa-${p.icon} text-lg"></i>${p.name}
        </a>`).join('')}
      </div>
      <div class="mt-8 flex items-center justify-center gap-3">
        <div class="flex-1 max-w-sm h-px bg-white/10"></div>
        <span class="text-neutral-600 text-xs uppercase tracking-wider">or use RSS</span>
        <div class="flex-1 max-w-sm h-px bg-white/10"></div>
      </div>
      <div class="mt-4 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 max-w-md mx-auto">
        <i class="fas fa-rss text-orange-400"></i>
        <input type="text" readonly id="podcastRssDisplay" value="https://ofureradio.com/rss.xml"
          class="flex-1 bg-transparent text-neutral-400 text-sm outline-none">
        <button onclick="copyPodcastRSS()" class="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold">
          <i class="fas fa-copy mr-1"></i>Copy
        </button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-neutral-900 border-t border-white/10 py-8">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <p class="text-neutral-500 text-sm">© 2026 OFURE RADIO. All rights reserved.</p>
      <div class="flex justify-center gap-6 mt-4">
        <a href="/" class="text-neutral-500 hover:text-orange-400 text-sm transition-colors">Home</a>
        <a href="/blog" class="text-neutral-500 hover:text-orange-400 text-sm transition-colors">Blog</a>
        <a href="/podcast" class="text-orange-400 text-sm font-medium">Podcasts</a>
        <a href="/#contact" class="text-neutral-500 hover:text-orange-400 text-sm transition-colors">Contact</a>
        <a href="/admin" class="text-neutral-500 hover:text-orange-400 text-sm transition-colors">Admin</a>
      </div>
    </div>
  </footer>

  <!-- hidden audio player for podcast page -->
  <audio id="radioPlayer" preload="none" class="hidden"></audio>
  `
}
