import { getLatestArticles } from '../data/news'

export function homePage(): string {
  const latestNews = getLatestArticles(3)

  const newsCards = latestNews.map(article => `
    <a href="/blog/${article.slug}" class="group block bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-orange-500/50">
      <div class="h-48 overflow-hidden">
        <img src="${article.image}" alt="${article.imageAlt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      </div>
      <div class="p-4">
        <span class="text-xs text-orange-400 font-semibold uppercase tracking-wider">${article.category}</span>
        <h3 class="text-white font-bold mt-1 mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">${article.title}</h3>
        <p class="text-neutral-400 text-sm line-clamp-2">${article.excerpt}</p>
        <div class="flex items-center gap-2 mt-3">
          <span class="text-neutral-500 text-xs"><i class="far fa-clock mr-1"></i>${article.date}</span>
        </div>
      </div>
    </a>
  `).join('')

  return `
  <!-- Navigation -->
  <nav id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-broadcast-tower text-white text-sm"></i>
          </div>
          <div>
            <div class="text-white font-black text-xl tracking-tight font-display">OFURE RADIO</div>
            <div class="text-orange-400 text-xs tracking-widest uppercase font-bold">THIS IS WHERE IT ALL BEGAN</div>
          </div>
        </div>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-6">
          <a href="/" class="text-white hover:text-orange-400 transition-colors text-sm font-medium">Home</a>
          <a href="#about" class="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium">About</a>
          <a href="#schedule" class="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium">Schedule</a>
          <a href="#streams" class="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium">Listen Live</a>
          <a href="/blog" class="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium">Blog</a>
          <a href="#contact" class="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium">Contact</a>
          <a href="/admin" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
            <i class="fas fa-cog mr-1"></i> Admin
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button id="mobileMenuBtn" class="md:hidden text-white p-2">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div id="mobileMenu" class="hidden md:hidden bg-neutral-900/95 backdrop-blur-lg border-t border-white/10">
      <div class="px-4 py-4 space-y-3">
        <a href="/" class="block text-white text-sm font-medium py-2">Home</a>
        <a href="#about" class="block text-neutral-300 text-sm font-medium py-2 mobile-menu-close">About</a>
        <a href="#schedule" class="block text-neutral-300 text-sm font-medium py-2 mobile-menu-close">Schedule</a>
        <a href="#streams" class="block text-neutral-300 text-sm font-medium py-2 mobile-menu-close">Listen Live</a>
        <a href="/blog" class="block text-neutral-300 text-sm font-medium py-2">Blog & News</a>
        <a href="#contact" class="block text-neutral-300 text-sm font-medium py-2 mobile-menu-close">Contact</a>
        <a href="/admin" class="block bg-orange-500 text-white text-sm font-semibold py-2 px-4 rounded-full text-center mt-2">Admin Studio</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-neutral-950 via-purple-950/20 to-neutral-950"></div>
    <div class="absolute inset-0">
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>
    </div>
    <!-- Sound wave decoration -->
    <div class="absolute bottom-0 left-0 right-0 h-32 sound-wave-bg opacity-10"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
      <!-- Live Badge -->
      <div class="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-8">
        <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        <span class="text-red-400 text-sm font-semibold uppercase tracking-wider">Broadcasting Live</span>
      </div>

      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-4 font-display">
        OFURE
        <span class="bg-gradient-to-r from-orange-400 via-orange-500 to-purple-500 bg-clip-text text-transparent">RADIO</span>
      </h1>
      <p class="text-xl md:text-2xl text-orange-400 font-bold mb-4 tracking-widest uppercase">THIS IS WHERE IT ALL BEGAN</p>
      <p class="text-neutral-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
        Your premier destination for the best in Afrobeats, R&B, Hip-Hop, and Gospel. Tune in to great music, exciting shows, and news that matters to you.
      </p>

      <!-- Stream Embed — hydrated by initLiveNow() in app.js -->
      <div class="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-10">
        <div class="flex items-center gap-4 mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-1">
              <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse" id="liveNowDot"></div>
              <span id="liveNowBadge" class="text-green-400 text-sm font-semibold">LIVE NOW</span>
            </div>
            <!-- Stream name + genre updated dynamically from Stream Manager -->
            <p class="text-white font-bold text-lg" id="liveNowName">OFURE RADIO LIVE STREAM</p>
            <p class="text-neutral-400 text-sm" id="liveNowGenre">Afrobeats • R&B • Gospel • Hip-Hop</p>
          </div>
          <button id="playBtn" onclick="togglePlay()" class="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-orange-500/25">
            <i id="playIcon" class="fas fa-play text-white text-lg ml-1"></i>
          </button>
        </div>
        <!-- Radio Player — src set dynamically by initLiveNow() -->
        <audio id="radioPlayer" preload="none"></audio>
        <!-- Visualizer -->
        <div class="flex items-end gap-1 h-8 justify-center" id="visualizer">
          ${Array.from({length: 20}, (_, i) => `<div class="visualizer-bar w-1.5 bg-gradient-to-t from-orange-500 to-purple-500 rounded-full" style="height: ${Math.random() * 28 + 4}px"></div>`).join('')}
        </div>
        <div class="flex items-center justify-between mt-3">
          <!-- Stream source domain — updated dynamically -->
          <span class="text-neutral-500 text-xs" id="liveNowDomain">Loading stream…</span>
          <div class="flex items-center gap-3">
            <button onclick="setVolume(0.3)" class="text-neutral-400 hover:text-white text-xs transition-colors">30%</button>
            <button onclick="setVolume(0.6)" class="text-neutral-400 hover:text-white text-xs transition-colors">60%</button>
            <button onclick="setVolume(1)" class="text-neutral-400 hover:text-white text-xs transition-colors">Max</button>
            <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="0.8" class="w-20 accent-orange-500" onchange="setVolume(this.value)">
          </div>
        </div>
        <!-- Stream selector: switch between live streams without leaving the hero -->
        <div id="liveNowSelector" class="mt-4 hidden">
          <p class="text-neutral-600 text-xs mb-2 uppercase tracking-wider font-semibold">Switch stream</p>
          <div id="liveNowSwitcher" class="flex flex-wrap gap-2"></div>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 justify-center">
        <a href="#streams" class="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg">
          <i class="fas fa-headphones mr-2"></i>Listen Live
        </a>
        <a href="/blog" class="bg-white/10 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors border border-white/20">
          <i class="fas fa-newspaper mr-2"></i>Read Blog
        </a>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <i class="fas fa-chevron-down text-neutral-500"></i>
    </div>
  </section>

  <!-- Stats Bar -->
  <section class="bg-white/5 border-y border-white/10 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div class="text-3xl font-black text-orange-400">24/7</div>
          <div class="text-neutral-400 text-sm mt-1">Live Broadcasting</div>
        </div>
        <div>
          <div class="text-3xl font-black text-purple-400">50K+</div>
          <div class="text-neutral-400 text-sm mt-1">Monthly Listeners</div>
        </div>
        <div>
          <div class="text-3xl font-black text-orange-400">100+</div>
          <div class="text-neutral-400 text-sm mt-1">Countries Reached</div>
        </div>
        <div>
          <div class="text-3xl font-black text-purple-400">15+</div>
          <div class="text-neutral-400 text-sm mt-1">Shows Weekly</div>
        </div>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="py-20 scroll-mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="inline-flex items-center gap-2 text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
            <div class="w-8 h-px bg-orange-400"></div>
            About Us
          </div>
          <h2 class="text-4xl md:text-5xl font-black font-display text-white mb-6 leading-tight">
            Your Sound.<br/>
            <span class="text-orange-400">Your Station.</span>
          </h2>
          <p class="text-neutral-400 text-lg leading-relaxed mb-6">
            OFURE RADIO is a premier internet radio station bringing you the best in Afrobeats, R&B, Hip-Hop, Gospel, and more — 24 hours a day, 7 days a week. Born from a passion for authentic African music and culture, we broadcast to listeners across the globe.
          </p>
          <p class="text-neutral-400 leading-relaxed mb-8">
            From our flagship morning show to late-night vibes, our experienced DJs and hosts curate the perfect soundtrack for every moment of your day. We are more than radio — we are community.
          </p>
          <div class="flex flex-wrap gap-3">
            <span class="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium border border-orange-500/30">Afrobeats</span>
            <span class="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30">R&B / Soul</span>
            <span class="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">Hip-Hop</span>
            <span class="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30">Gospel</span>
            <span class="bg-pink-500/20 text-pink-400 px-4 py-2 rounded-full text-sm font-medium border border-pink-500/30">Urban</span>
          </div>
        </div>
        <div class="relative">
          <div class="bg-gradient-to-br from-orange-500/20 to-purple-600/20 rounded-3xl p-8 border border-white/10">
            <!-- DJ Lineup -->
            <h3 class="text-white font-bold text-xl mb-6 font-display">Our DJ Family</h3>
            <div class="space-y-4">
              ${[
                { name: 'DJ Alex', show: 'Morning Vibes', time: '6AM - 10AM', emoji: '🌅' },
                { name: 'DJ Luna', show: 'Afternoon Mix', time: '12PM - 4PM', emoji: '☀️' },
                { name: 'DJ Marcus', show: 'Evening Drive', time: '4PM - 8PM', emoji: '🌆' },
                { name: 'DJ Sarah', show: 'Night Frequency', time: '8PM - 12AM', emoji: '🌙' },
              ].map(dj => `
              <div class="flex items-center gap-4 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-xl">
                  ${dj.emoji}
                </div>
                <div class="flex-1">
                  <div class="text-white font-semibold">${dj.name}</div>
                  <div class="text-neutral-400 text-sm">${dj.show}</div>
                </div>
                <div class="text-orange-400 text-xs font-medium">${dj.time}</div>
              </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Schedule Section -->
  <section id="schedule" class="py-20 bg-white/2 scroll-mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
          <div class="w-8 h-px bg-orange-400"></div>
          Programming
          <div class="w-8 h-px bg-orange-400"></div>
        </div>
        <h2 class="text-4xl md:text-5xl font-black font-display text-white">Show Schedule</h2>
        <p class="text-neutral-400 mt-3 max-w-xl mx-auto">Never miss your favorite show — tune in at the right time</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left py-3 px-4 text-neutral-400 text-sm font-medium">Time</th>
              <th class="text-left py-3 px-4 text-neutral-400 text-sm font-medium">Show</th>
              <th class="text-left py-3 px-4 text-neutral-400 text-sm font-medium">Host</th>
              <th class="text-left py-3 px-4 text-neutral-400 text-sm font-medium hidden md:table-cell">Genre</th>
              <th class="text-left py-3 px-4 text-neutral-400 text-sm font-medium hidden lg:table-cell">Days</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            ${[
              { time: '6:00 AM', show: 'Morning Vibes', host: 'DJ Alex', genre: 'Afrobeats / Gospel', days: 'Mon - Fri', active: true },
              { time: '9:00 AM', show: 'The Word & Music Hour', host: 'Pastor Mike', genre: 'Gospel / Inspirational', days: 'Mon - Fri', active: false },
              { time: '12:00 PM', show: 'Afternoon Mix', host: 'DJ Luna', genre: 'R&B / Hip-Hop', days: 'Everyday', active: false },
              { time: '2:00 PM', show: 'Throwback Classics', host: 'DJ Rex', genre: 'Old School / Soul', days: 'Mon, Wed, Fri', active: false },
              { time: '4:00 PM', show: 'Evening Drive', host: 'DJ Marcus', genre: 'Afrobeats / Urban', days: 'Everyday', active: false },
              { time: '7:00 PM', show: 'Cultural Vibes', host: 'Mama Bisi', genre: 'Highlife / Jùjú', days: 'Tue, Thu, Sat', active: false },
              { time: '9:00 PM', show: 'Night Frequency', host: 'DJ Sarah', genre: 'Chill / Neo-Soul', days: 'Everyday', active: false },
              { time: '11:00 PM', show: 'Late Night Sessions', host: 'DJ Maya', genre: 'Electronic / Deep House', days: 'Fri - Sat', active: false },
            ].map(row => `
            <tr class="hover:bg-white/3 transition-colors ${row.active ? 'bg-orange-500/5' : ''}">
              <td class="py-4 px-4">
                <span class="text-white font-semibold text-sm">${row.time}</span>
                ${row.active ? '<span class="ml-2 text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">LIVE</span>' : ''}
              </td>
              <td class="py-4 px-4 text-white font-medium">${row.show}</td>
              <td class="py-4 px-4 text-neutral-400 text-sm">${row.host}</td>
              <td class="py-4 px-4 text-neutral-500 text-sm hidden md:table-cell">${row.genre}</td>
              <td class="py-4 px-4 text-neutral-500 text-sm hidden lg:table-cell">${row.days}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Live Streams Section -->
  <section id="streams" class="py-20 scroll-mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
          <div class="w-8 h-px bg-orange-400"></div>
          Live
          <div class="w-8 h-px bg-orange-400"></div>
        </div>
        <h2 class="text-4xl md:text-5xl font-black font-display text-white">Active Streams</h2>
        <p class="text-neutral-400 mt-3 max-w-xl mx-auto">Tune in to our live internet radio broadcasts from anywhere in the world</p>
      </div>

      <!-- Live streams grid — populated dynamically by app.js renderHomeStreams() -->
      <!-- Syncs automatically with Admin → Stream Manager (localStorage) -->
      <div id="homeStreamsList" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Skeleton placeholders shown until JS hydrates -->
        <div class="home-stream-skeleton bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-white/10"></div>
            <div class="w-16 h-6 rounded-full bg-white/10"></div>
          </div>
          <div class="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-1/2 mb-6"></div>
          <div class="flex items-center justify-between">
            <div class="h-4 bg-white/10 rounded w-1/4"></div>
            <div class="w-24 h-9 rounded-full bg-white/10"></div>
          </div>
        </div>
        <div class="home-stream-skeleton bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-white/10"></div>
            <div class="w-16 h-6 rounded-full bg-white/10"></div>
          </div>
          <div class="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-1/2 mb-6"></div>
          <div class="flex items-center justify-between">
            <div class="h-4 bg-white/10 rounded w-1/4"></div>
            <div class="w-24 h-9 rounded-full bg-white/10"></div>
          </div>
        </div>
        <div class="home-stream-skeleton bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-white/10"></div>
            <div class="w-16 h-6 rounded-full bg-white/10"></div>
          </div>
          <div class="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-1/2 mb-6"></div>
          <div class="flex items-center justify-between">
            <div class="h-4 bg-white/10 rounded w-1/4"></div>
            <div class="w-24 h-9 rounded-full bg-white/10"></div>
          </div>
        </div>
      </div>
      <!-- Live stream count badge — updated by renderHomeStreams() -->
      <div id="homeStreamsFooter" class="mt-8 text-center hidden">
        <p class="text-neutral-600 text-sm">
          <span id="homeStreamLiveCount" class="text-green-400 font-semibold"></span>
          <span id="homeStreamTotalCount"></span>
          — managed via <a href="/admin" class="text-orange-400 hover:text-orange-300 transition-colors">Admin Studio → Stream Manager</a>
        </p>
      </div>
    </div>
  </section>

  <!-- Blog Preview Section -->
  <section class="py-20 bg-white/2">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between mb-12">
        <div>
          <div class="inline-flex items-center gap-2 text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
            <div class="w-8 h-px bg-orange-400"></div>
            Latest
          </div>
          <h2 class="text-4xl md:text-5xl font-black font-display text-white">News & Blog</h2>
          <p class="text-neutral-400 mt-2">Entertainment, music, and world news</p>
        </div>
        <a href="/blog" class="hidden md:flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors font-semibold">
          View All <i class="fas fa-arrow-right"></i>
        </a>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        ${newsCards}
      </div>

      <div class="text-center mt-8 md:hidden">
        <a href="/blog" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors inline-block">
          View All Articles
        </a>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="py-20 scroll-mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12">
        <div>
          <div class="inline-flex items-center gap-2 text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
            <div class="w-8 h-px bg-orange-400"></div>
            Get In Touch
          </div>
          <h2 class="text-4xl md:text-5xl font-black font-display text-white mb-6">Contact Us</h2>
          <p class="text-neutral-400 text-lg leading-relaxed mb-8">
            Whether you want to request a song, advertise with us, collaborate on a show, or just share some love — we want to hear from you.
          </p>
          <div class="space-y-4">
            <!-- Email Us — href and displayed address synced from Settings via JS -->
            <a id="emailUsLink" href="mailto:hello@ofureradio.com" class="flex items-center gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
              <div class="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <i class="fas fa-envelope text-orange-400"></i>
              </div>
              <div>
                <div class="text-white font-semibold">Email Us</div>
                <div class="text-neutral-400 text-sm" id="emailUsAddress">hello@ofureradio.com</div>
              </div>
            </a>
            <div class="flex items-center gap-4 bg-white/5 rounded-xl p-4">
              <div class="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <i class="fas fa-globe text-purple-400"></i>
              </div>
              <div>
                <div class="text-white font-semibold">Stream Online</div>
                <div class="text-neutral-400 text-sm">Available worldwide, 24/7</div>
              </div>
            </div>
          </div>
          <div class="flex gap-4 mt-8">
            ${['facebook', 'twitter', 'instagram', 'youtube'].map(s => `
            <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-colors">
              <i class="fab fa-${s} text-white text-sm"></i>
            </a>
            `).join('')}
          </div>
        </div>

        <div class="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 class="text-white font-bold text-xl mb-6">Send a Message</h3>
          <form onsubmit="handleContactForm(event)" id="contactForm" class="space-y-4">
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Your Name</label>
              <input type="text" id="contactName" name="contactName" required
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors" placeholder="John Doe">
            </div>
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Email Address</label>
              <input type="email" id="contactEmail" name="contactEmail" required
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors" placeholder="john@example.com">
            </div>
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Subject</label>
              <select id="contactSubject" name="contactSubject"
                class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                <option value="" class="bg-neutral-900">Choose a subject</option>
                <option value="Song Request" class="bg-neutral-900">🎵 Song Request</option>
                <option value="Advertising" class="bg-neutral-900">📢 Advertising</option>
                <option value="Show Collaboration" class="bg-neutral-900">🎙️ Show Collaboration</option>
                <option value="General Enquiry" class="bg-neutral-900">💬 General Enquiry</option>
                <option value="Other" class="bg-neutral-900">📝 Other</option>
              </select>
            </div>
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Message</label>
              <textarea id="contactMessage" name="contactMessage" required rows="4"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                placeholder="Your message here..."></textarea>
            </div>
            <button type="submit" id="contactSendBtn"
              class="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <i class="fas fa-paper-plane"></i>Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-neutral-900 border-t border-white/10 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div class="md:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
              <i class="fas fa-broadcast-tower text-white text-sm"></i>
            </div>
            <div>
              <div class="text-white font-black text-xl font-display">OFURE RADIO</div>
              <div class="text-orange-400 text-xs tracking-widest uppercase font-bold">THIS IS WHERE IT ALL BEGAN</div>
            </div>
          </div>
          <p class="text-neutral-400 text-sm leading-relaxed max-w-sm">
            Your premier internet radio station broadcasting the best African and world music 24 hours a day, 7 days a week.
          </p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/" class="text-neutral-400 hover:text-orange-400 transition-colors">Home</a></li>
            <li><a href="#about" class="text-neutral-400 hover:text-orange-400 transition-colors">About</a></li>
            <li><a href="#schedule" class="text-neutral-400 hover:text-orange-400 transition-colors">Schedule</a></li>
            <li><a href="/blog" class="text-neutral-400 hover:text-orange-400 transition-colors">Blog & News</a></li>
            <li><a href="#contact" class="text-neutral-400 hover:text-orange-400 transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Newsletter</h4>
          <p class="text-neutral-400 text-sm mb-3">Subscribe for show updates and exclusive content.</p>
          <form onsubmit="handleNewsletter(event)" class="flex gap-2">
            <input type="email" required class="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-orange-500" placeholder="Enter your email">
            <button type="submit" class="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors">
              <i class="fas fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
      <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-neutral-500 text-sm">© 2026 OFURE RADIO. All rights reserved.</p>
        <div class="flex gap-4">
          ${['facebook', 'twitter', 'instagram', 'youtube'].map(s => `
          <a href="#" class="text-neutral-500 hover:text-orange-400 transition-colors">
            <i class="fab fa-${s}"></i>
          </a>
          `).join('')}
        </div>
      </div>
    </div>
  </footer>
  `
}
