import { NewsArticle, getNewsArticles, getFeaturedArticles, newsCategories } from '../data/news'

function categoryBadge(category: string): string {
  const colors: Record<string, string> = {
    'Entertainment': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Music': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Celebrity': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'World News': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Sports': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Technology': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Lifestyle': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Africa': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  }
  const cls = colors[category] || 'bg-white/10 text-white border-white/20'
  return `<span class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${cls} uppercase tracking-wider">${category}</span>`
}

export function blogPage(activeCategory: string = ''): string {
  const articles = getNewsArticles()
  const featured = getFeaturedArticles()
  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category === activeCategory)
    : articles

  const featuredHero = featured[0]
  const featuredSecondary = featured.slice(1, 3)

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return `
  <!-- Blog Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-lg border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <a href="/" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
              <i class="fas fa-broadcast-tower text-white text-xs"></i>
            </div>
            <span class="text-white font-black text-lg font-display">OFURE RADIO</span>
          </a>
          <span class="text-neutral-600 hidden sm:block">/</span>
          <span class="text-orange-400 font-semibold hidden sm:block">Blog & News</span>
        </div>
        <div class="flex items-center gap-4">
          <a href="/" class="text-neutral-400 hover:text-white text-sm transition-colors hidden md:block">
            <i class="fas fa-home mr-1"></i>Back to Radio
          </a>
          <a href="/admin" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
            <i class="fas fa-cog mr-1"></i>Admin
          </a>
        </div>
      </div>
    </div>
  </nav>

  <div class="pt-16">
    <!-- Magazine Header -->
    <div class="bg-gradient-to-r from-orange-600 via-orange-500 to-purple-600 py-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-white/80 text-xs">
        <span><i class="far fa-calendar mr-1"></i>${today}</span>
        <span>OFURE RADIO NEWS MAGAZINE</span>
        <span class="hidden sm:block"><i class="fas fa-rss mr-1"></i>Auto-updated daily</span>
      </div>
    </div>

    <!-- Masthead -->
    <div class="bg-neutral-900 border-b border-white/10 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 text-orange-400 text-xs font-semibold uppercase tracking-widest mb-2">
          <div class="w-12 h-px bg-orange-500"></div>
          Est. 2020
          <div class="w-12 h-px bg-orange-500"></div>
        </div>
        <h1 class="text-5xl md:text-7xl font-black font-display text-white tracking-tight mb-2">
          OFURE <span class="text-orange-400">BEAT</span>
        </h1>
        <p class="text-neutral-400 text-lg font-light tracking-wider">Entertainment · Music · World News · Culture</p>

        <!-- Ticker -->
        <div class="mt-6 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 overflow-hidden">
          <div class="flex items-center gap-3">
            <span class="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded flex-shrink-0">BREAKING</span>
            <div class="overflow-hidden flex-1">
              <div class="ticker-content text-neutral-300 text-sm whitespace-nowrap">
                🎵 Afrobeats dominates global charts &nbsp;&nbsp;•&nbsp;&nbsp; 🎬 Nollywood conquers international film festivals &nbsp;&nbsp;•&nbsp;&nbsp; ⚽ African athletes shine in global sports &nbsp;&nbsp;•&nbsp;&nbsp; 🤖 AI reshapes entertainment industry &nbsp;&nbsp;•&nbsp;&nbsp; 📻 OFURE RADIO: Broadcasting 24/7 worldwide &nbsp;&nbsp;•&nbsp;&nbsp; 🌍 Climate deal reached after marathon negotiations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Navigation -->
    <div class="bg-neutral-900/50 border-b border-white/5 sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          <a href="/blog" class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeCategory ? 'bg-orange-500 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/10'}">
            All News
          </a>
          ${newsCategories.map(cat => `
          <a href="/blog?category=${encodeURIComponent(cat)}" class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-orange-500 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/10'}">
            ${cat}
          </a>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      ${!activeCategory ? `
      <!-- Featured Hero Article -->
      <section class="mb-12">
        <div class="grid lg:grid-cols-5 gap-6">
          <!-- Main Feature -->
          <a href="/blog/${featuredHero.slug}" class="lg:col-span-3 group block relative overflow-hidden rounded-2xl aspect-video md:aspect-auto md:min-h-[400px]">
            <img src="${featuredHero.image}" alt="${featuredHero.imageAlt}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div class="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
              <div class="mb-3 flex items-center gap-2">
                ${categoryBadge(featuredHero.category)}
                <span class="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">FEATURED</span>
              </div>
              <h2 class="text-white text-2xl md:text-3xl lg:text-4xl font-black font-display leading-tight mb-3 group-hover:text-orange-300 transition-colors">
                ${featuredHero.title}
              </h2>
              <p class="text-neutral-300 text-sm md:text-base line-clamp-2 mb-4">${featuredHero.excerpt}</p>
              <div class="flex items-center gap-4 text-neutral-400 text-sm">
                <span class="flex items-center gap-1"><i class="fas fa-user-circle"></i> ${featuredHero.author}</span>
                <span class="flex items-center gap-1"><i class="far fa-calendar"></i> ${featuredHero.date}</span>
              </div>
            </div>
          </a>

          <!-- Secondary Features -->
          <div class="lg:col-span-2 flex flex-col gap-6">
            ${featuredSecondary.map(article => `
            <a href="/blog/${article.slug}" class="group flex gap-4 bg-neutral-900 rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/40 transition-all duration-300">
              <div class="w-28 sm:w-36 flex-shrink-0 overflow-hidden">
                <img src="${article.image}" alt="${article.imageAlt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" style="min-height:120px">
              </div>
              <div class="p-4 flex flex-col justify-between flex-1">
                ${categoryBadge(article.category)}
                <h3 class="text-white font-bold mt-2 mb-2 line-clamp-3 group-hover:text-orange-400 transition-colors leading-snug">${article.title}</h3>
                <div class="flex items-center gap-2 text-neutral-500 text-xs">
                  <span>${article.author}</span>
                  <span>•</span>
                  <span>${article.date}</span>
                </div>
              </div>
            </a>
            `).join('')}

            <!-- Ad / Promo Box -->
            <div class="bg-gradient-to-br from-orange-600/20 to-purple-600/20 border border-orange-500/20 rounded-xl p-6 text-center">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                <i class="fas fa-headphones text-white text-lg"></i>
              </div>
              <p class="text-white font-bold mb-1">Listen Live Now</p>
              <p class="text-neutral-400 text-sm mb-3">OFURE RADIO is live 24/7</p>
              <a href="/#streams" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors inline-block">
                <i class="fas fa-play mr-1"></i>Tune In
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Divider -->
      <div class="flex items-center gap-4 mb-8">
        <div class="flex-1 h-px bg-white/10"></div>
        <span class="text-orange-400 text-sm font-semibold uppercase tracking-widest">Latest Stories</span>
        <div class="flex-1 h-px bg-white/10"></div>
      </div>
      ` : `
      <!-- Category Header -->
      <div class="mb-10">
        <h2 class="text-3xl font-black font-display text-white mb-2">${activeCategory}</h2>
        <p class="text-neutral-400">Latest news in ${activeCategory}</p>
      </div>
      `}

      <!-- Main Content Grid -->
      <div class="grid lg:grid-cols-3 gap-8">

        <!-- Article Grid (2 cols) -->
        <div class="lg:col-span-2">
          <div class="grid sm:grid-cols-2 gap-6">
            ${filteredArticles.filter(a => !(!activeCategory && a.featured)).map(article => `
            <a href="/blog/${article.slug}" class="group bg-neutral-900 rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10">
              <div class="h-48 overflow-hidden relative">
                <img src="${article.image}" alt="${article.imageAlt}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-3 left-3">
                  ${categoryBadge(article.category)}
                </div>
              </div>
              <div class="p-5">
                <h3 class="text-white font-bold text-lg leading-snug mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors font-display">
                  ${article.title}
                </h3>
                <p class="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3">${article.excerpt}</p>
                <div class="flex items-center justify-between text-xs text-neutral-500 border-t border-white/5 pt-3">
                  <div class="flex items-center gap-1">
                    <div class="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      ${article.author.charAt(0)}
                    </div>
                    <span>${article.author}</span>
                  </div>
                  <span><i class="far fa-calendar mr-1"></i>${article.date}</span>
                </div>
              </div>
            </a>
            `).join('')}
          </div>

          ${filteredArticles.length === 0 ? `
          <div class="text-center py-16">
            <i class="fas fa-newspaper text-neutral-700 text-5xl mb-4"></i>
            <p class="text-neutral-400">No articles found in this category.</p>
          </div>
          ` : ''}
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-8">

          <!-- Search -->
          <div class="bg-neutral-900 border border-white/10 rounded-xl p-5">
            <h3 class="text-white font-bold mb-3"><i class="fas fa-search mr-2 text-orange-400"></i>Search</h3>
            <div class="relative">
              <input type="text" id="blogSearch" placeholder="Search articles..." 
                class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm"
                oninput="filterBlogSearch(this.value)">
              <i class="fas fa-search absolute right-3 top-3 text-neutral-500 text-sm"></i>
            </div>
          </div>

          <!-- Categories -->
          <div class="bg-neutral-900 border border-white/10 rounded-xl p-5">
            <h3 class="text-white font-bold mb-4"><i class="fas fa-tag mr-2 text-orange-400"></i>Categories</h3>
            <ul class="space-y-2">
              <li>
                <a href="/blog" class="flex items-center justify-between text-sm py-1.5 hover:text-orange-400 transition-colors ${!activeCategory ? 'text-orange-400 font-semibold' : 'text-neutral-400'}">
                  <span>All Articles</span>
                  <span class="bg-white/10 px-2 py-0.5 rounded-full text-xs">${getNewsArticles().length}</span>
                </a>
              </li>
              ${newsCategories.map(cat => {
                const count = getNewsArticles().filter(a => a.category === cat).length
                return `
                <li>
                  <a href="/blog?category=${encodeURIComponent(cat)}" class="flex items-center justify-between text-sm py-1.5 hover:text-orange-400 transition-colors ${activeCategory === cat ? 'text-orange-400 font-semibold' : 'text-neutral-400'}">
                    <span>${cat}</span>
                    <span class="bg-white/10 px-2 py-0.5 rounded-full text-xs">${count}</span>
                  </a>
                </li>
                `
              }).join('')}
            </ul>
          </div>

          <!-- Trending Tags -->
          <div class="bg-neutral-900 border border-white/10 rounded-xl p-5">
            <h3 class="text-white font-bold mb-4"><i class="fas fa-fire mr-2 text-orange-400"></i>Trending Tags</h3>
            <div class="flex flex-wrap gap-2">
              ${['Afrobeats', 'Music', 'Nigeria', 'Nollywood', 'Grammy', 'Africa', 'Technology', 'AI', 'Festival', 'Sports', 'Celebrity', 'Radio'].map(tag => `
              <span class="bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 text-neutral-400 hover:text-orange-400 px-3 py-1 rounded-full text-xs cursor-pointer transition-all">#${tag}</span>
              `).join('')}
            </div>
          </div>

          <!-- Newsletter CTA -->
          <div class="bg-gradient-to-br from-orange-600/20 to-purple-600/20 border border-orange-500/20 rounded-xl p-5">
            <h3 class="text-white font-bold mb-2">Stay Updated</h3>
            <p class="text-neutral-400 text-sm mb-4">Get the latest entertainment news delivered to your inbox daily.</p>
            <form onsubmit="handleNewsletter(event)" class="space-y-3">
              <input type="email" required placeholder="Your email address" 
                class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm">
              <button type="submit" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                Subscribe Free
              </button>
            </form>
          </div>

          <!-- Radio Widget -->
          <div class="bg-neutral-900 border border-orange-500/20 rounded-xl p-5">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span class="text-green-400 text-xs font-semibold">LIVE ON AIR</span>
            </div>
            <h3 class="text-white font-bold mb-1">OFURE RADIO</h3>
            <p class="text-neutral-400 text-sm mb-3">Listen while you read</p>
            <button onclick="playStream('https://stream.zeno.fm/f3wvbbqmdg8uv', 'OFURE RADIO')" 
              class="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              <i class="fas fa-play mr-2"></i>Listen Live
            </button>
            <audio id="sidebarRadio" class="hidden"></audio>
          </div>

          <!-- Update Notice -->
          <div class="bg-white/3 border border-white/10 rounded-xl p-4 text-center">
            <i class="fas fa-sync-alt text-orange-400 mb-2"></i>
            <p class="text-neutral-500 text-xs">Articles auto-refresh every 24 hours</p>
            <p class="text-neutral-600 text-xs mt-1">Last updated: ${today}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-neutral-900 border-t border-white/10 py-8 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
          <i class="fas fa-broadcast-tower text-white text-xs"></i>
        </div>
        <span class="text-neutral-400 text-sm">© 2025 OFURE RADIO. All rights reserved.</span>
      </div>
      <div class="flex gap-4">
        <a href="/" class="text-neutral-500 hover:text-orange-400 text-sm transition-colors">Home</a>
        <a href="/blog" class="text-neutral-500 hover:text-orange-400 text-sm transition-colors">Blog</a>
        <a href="/admin" class="text-neutral-500 hover:text-orange-400 text-sm transition-colors">Admin</a>
      </div>
    </div>
  </footer>
  `
}

export function blogArticlePage(article: NewsArticle): string {
  const allArticles = getNewsArticles()
  const related = allArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const paragraphs = article.content.split('\n\n').filter(p => p.trim()).map((p, i) => {
    if (i === 2) {
      // Insert pull quote after 3rd paragraph
      return `
        <p class="text-neutral-300 leading-relaxed mb-6">${p}</p>
        <blockquote class="border-l-4 border-orange-500 pl-6 my-8 bg-orange-500/5 py-4 rounded-r-xl">
          <p class="text-orange-300 text-xl font-semibold italic font-display leading-relaxed">"${p.slice(0, 120).trim()}..."</p>
        </blockquote>
      `
    }
    return `<p class="text-neutral-300 leading-relaxed mb-6">${p}</p>`
  }).join('')

  return `
  <!-- Article Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-lg border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3 min-w-0">
          <a href="/" class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
              <i class="fas fa-broadcast-tower text-white text-xs"></i>
            </div>
          </a>
          <a href="/blog" class="text-neutral-400 hover:text-white text-sm transition-colors flex-shrink-0">
            <i class="fas fa-arrow-left mr-1"></i>Blog
          </a>
          <span class="text-neutral-700 hidden sm:block">/</span>
          <span class="text-neutral-400 text-sm hidden sm:block truncate">${article.title}</span>
        </div>
        <a href="/admin" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0">
          <i class="fas fa-edit mr-1"></i>Edit
        </a>
      </div>
    </div>
  </nav>

  <div class="pt-16">
    <!-- Article Hero -->
    <div class="relative h-64 md:h-96 overflow-hidden">
      <img src="${article.image}" alt="${article.imageAlt}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>
      <div class="absolute inset-0 flex items-end">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">${article.category}</span>
            ${article.tags.slice(0, 2).map(tag => `<span class="bg-white/20 text-white text-xs px-3 py-1 rounded-full">#${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid lg:grid-cols-3 gap-10">

        <!-- Main Article -->
        <article class="lg:col-span-2">
          <!-- Article Meta -->
          <div class="bg-neutral-900 border border-white/10 rounded-2xl p-8 mb-8">
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-black font-display text-white leading-tight mb-6">
              ${article.title}
            </h1>
            
            <div class="flex flex-wrap items-center gap-4 text-sm text-neutral-400 pb-6 border-b border-white/10 mb-6">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  ${article.author.charAt(0)}
                </div>
                <span class="text-white font-medium">${article.author}</span>
              </div>
              <span class="flex items-center gap-1"><i class="far fa-calendar"></i> ${article.date}</span>
              <span class="flex items-center gap-1"><i class="fas fa-tag"></i> ${article.category}</span>
              <span class="ml-auto flex items-center gap-2">
                <button onclick="shareArticle()" class="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors">
                  <i class="fas fa-share"></i> Share
                </button>
              </span>
            </div>

            <!-- Excerpt Lead -->
            <p class="text-neutral-200 text-xl leading-relaxed font-medium mb-8 border-l-4 border-orange-500 pl-4">
              ${article.excerpt}
            </p>

            <!-- Article Body -->
            <div class="article-body prose-style">
              ${paragraphs}
            </div>

            <!-- Tags -->
            <div class="mt-8 pt-6 border-t border-white/10">
              <div class="flex flex-wrap gap-2">
                ${article.tags.map(tag => `
                <span class="bg-white/5 border border-white/10 text-neutral-400 px-3 py-1 rounded-full text-sm">#${tag}</span>
                `).join('')}
              </div>
            </div>

            <!-- Share -->
            <div class="mt-6 pt-6 border-t border-white/10">
              <p class="text-neutral-400 text-sm mb-3 font-medium">Share this article:</p>
              <div class="flex gap-3">
                ${[
                  { icon: 'twitter', color: 'bg-blue-400/20 hover:bg-blue-400/30 text-blue-400', label: 'Twitter' },
                  { icon: 'facebook', color: 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400', label: 'Facebook' },
                  { icon: 'whatsapp', color: 'bg-green-500/20 hover:bg-green-500/30 text-green-400', label: 'WhatsApp' },
                  { icon: 'link', color: 'bg-white/10 hover:bg-white/20 text-neutral-400', label: 'Copy Link' },
                ].map(s => `
                <button onclick="shareOn('${s.icon}')" class="${s.color} p-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm" title="Share on ${s.label}">
                  <i class="fa${s.icon === 'link' ? 's fa-link' : `b fa-${s.icon}`}"></i>
                  <span class="hidden sm:inline">${s.label}</span>
                </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Related Articles -->
          ${related.length > 0 ? `
          <div>
            <h3 class="text-white font-black text-xl font-display mb-6 flex items-center gap-2">
              <span class="w-1 h-6 bg-orange-500 rounded-full inline-block"></span>
              Related Articles
            </h3>
            <div class="space-y-4">
              ${related.map(rel => `
              <a href="/blog/${rel.slug}" class="group flex gap-4 bg-neutral-900 border border-white/10 hover:border-orange-500/30 rounded-xl overflow-hidden transition-all">
                <div class="w-24 flex-shrink-0 overflow-hidden">
                  <img src="${rel.image}" alt="${rel.imageAlt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" style="min-height:90px">
                </div>
                <div class="p-4">
                  <span class="text-orange-400 text-xs font-semibold uppercase">${rel.category}</span>
                  <h4 class="text-white font-bold text-sm mt-1 line-clamp-2 group-hover:text-orange-400 transition-colors">${rel.title}</h4>
                  <span class="text-neutral-500 text-xs mt-1 block">${rel.date}</span>
                </div>
              </a>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </article>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Radio Widget -->
          <div class="bg-gradient-to-br from-orange-600/20 to-purple-600/20 border border-orange-500/20 rounded-xl p-5">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span class="text-green-400 text-xs font-semibold">LIVE NOW</span>
            </div>
            <h3 class="text-white font-bold mb-1">OFURE RADIO</h3>
            <p class="text-neutral-400 text-sm mb-4">Listen while you read</p>
            <button onclick="playStream('https://stream.zeno.fm/f3wvbbqmdg8uv', 'OFURE RADIO')"
              class="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              <i class="fas fa-headphones mr-2"></i>Tune In
            </button>
          </div>

          <!-- More Articles -->
          <div class="bg-neutral-900 border border-white/10 rounded-xl p-5">
            <h3 class="text-white font-bold mb-4 flex items-center gap-2">
              <i class="fas fa-newspaper text-orange-400 text-sm"></i>
              More Stories
            </h3>
            <div class="space-y-4">
              ${allArticles.filter(a => a.id !== article.id).slice(0, 5).map(a => `
              <a href="/blog/${a.slug}" class="group flex gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <img src="${a.image}" alt="${a.imageAlt}" class="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:opacity-80 transition-opacity">
                <div>
                  <span class="text-orange-400 text-xs font-semibold">${a.category}</span>
                  <p class="text-white text-sm font-medium line-clamp-2 group-hover:text-orange-400 transition-colors leading-snug mt-0.5">${a.title}</p>
                  <span class="text-neutral-500 text-xs">${a.date}</span>
                </div>
              </a>
              `).join('')}
            </div>
          </div>

          <!-- Newsletter -->
          <div class="bg-neutral-900 border border-white/10 rounded-xl p-5">
            <h3 class="text-white font-bold mb-2">Daily Newsletter</h3>
            <p class="text-neutral-400 text-sm mb-4">Latest news in your inbox every morning.</p>
            <form onsubmit="handleNewsletter(event)" class="space-y-2">
              <input type="email" required placeholder="Email address" 
                class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm">
              <button type="submit" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-neutral-900 border-t border-white/10 py-8 mt-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
          <i class="fas fa-broadcast-tower text-white text-xs"></i>
        </div>
        <span class="text-neutral-400 text-sm">© 2025 OFURE RADIO. All rights reserved.</span>
      </div>
      <div class="flex gap-4">
        <a href="/" class="text-neutral-500 hover:text-orange-400 text-sm transition-colors">Home</a>
        <a href="/blog" class="text-neutral-500 hover:text-orange-400 text-sm transition-colors">Blog</a>
        <a href="/admin" class="text-neutral-500 hover:text-orange-400 text-sm transition-colors">Admin</a>
      </div>
    </div>
  </footer>
  `
}
