import { getNewsArticles } from '../data/news'

export function adminPage(): string {
  const articles = getNewsArticles()
  const featuredCount = articles.filter(a => a.featured).length

  return `
  <div class="min-h-screen bg-neutral-950">
    <!-- Admin Nav -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-neutral-900 border-b border-white/10">
      <div class="flex items-center justify-between h-16 px-4 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
            <i class="fas fa-broadcast-tower text-white text-xs"></i>
          </div>
          <div>
            <div class="text-white font-black text-sm font-display">OFURE STUDIO</div>
            <div class="text-orange-400 text-xs">Admin Control Panel</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden md:flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-green-400 text-xs font-semibold">LIVE</span>
          </div>
          <a href="/" class="text-neutral-400 hover:text-white text-sm transition-colors hidden md:block">
            <i class="fas fa-external-link-alt mr-1"></i>View Site
          </a>
          <button onclick="adminLogout()" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <i class="fas fa-sign-out-alt mr-1"></i>Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- PIN Gate -->
    <div id="pinGate" class="fixed inset-0 z-40 bg-neutral-950 flex items-center justify-center">
      <div class="bg-neutral-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 text-center">
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-shield-alt text-white text-2xl"></i>
        </div>
        <h2 class="text-white font-black text-2xl font-display mb-2">OFURE STUDIO</h2>
        <p class="text-neutral-400 text-sm mb-6">Enter your admin PIN to continue</p>
        <div class="flex justify-center gap-3 mb-6">
          ${[0,1,2,3].map(i => `
          <input type="password" maxlength="1" class="pin-input w-12 h-12 text-center text-white text-xl font-bold bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-orange-500 transition-colors" data-index="${i}" inputmode="numeric">
          `).join('')}
        </div>
        <div id="pinError" class="text-red-400 text-sm mb-4 hidden">Incorrect PIN. Try again.</div>
        <button onclick="verifyPin()" class="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
          <i class="fas fa-unlock mr-2"></i>Enter Studio
        </button>
        <p class="text-neutral-600 text-xs mt-4">Default PIN: 1234</p>
        <a href="/" class="block text-neutral-500 hover:text-neutral-300 text-sm mt-3 transition-colors">
          <i class="fas fa-arrow-left mr-1"></i>Back to website
        </a>
      </div>
    </div>

    <!-- Admin Content (hidden until PIN verified) -->
    <div id="adminContent" class="hidden pt-16">

      <!-- Sidebar + Main -->
      <div class="flex min-h-screen">

        <!-- Sidebar -->
        <div id="adminSidebar" class="fixed left-0 top-16 bottom-0 w-64 bg-neutral-900 border-r border-white/10 overflow-y-auto z-30 transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
          <div class="p-4">
            <nav class="space-y-1">
              ${[
                { id: 'dashboard', icon: 'th-large', label: 'Dashboard' },
                { id: 'blog', icon: 'newspaper', label: 'Blog & News', badge: articles.length.toString() },
                { id: 'streams', icon: 'radio', label: 'Stream Manager' },
                { id: 'podcast', icon: 'microphone', label: 'Podcast Studio' },
                { id: 'schedule', icon: 'calendar-alt', label: 'Show Schedule' },
                { id: 'ai', icon: 'robot', label: 'AI Studio' },
                { id: 'security', icon: 'shield-alt', label: 'Security & PIN' },
                { id: 'settings', icon: 'cog', label: 'Settings' },
              ].map((item, i) => `
              <button onclick="showPanel('${item.id}')" 
                class="admin-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm ${i === 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}"
                data-panel="${item.id}">
                <i class="fas fa-${item.icon} w-4 text-center"></i>
                <span class="font-medium">${item.label}</span>
                ${item.badge ? `<span class="ml-auto bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full">${item.badge}</span>` : ''}
              </button>
              `).join('')}
            </nav>
          </div>
          <div class="p-4 border-t border-white/10 mt-auto">
            <a href="/" class="flex items-center gap-2 text-neutral-400 hover:text-white text-sm transition-colors">
              <i class="fas fa-external-link-alt"></i>
              <span>View Live Site</span>
            </a>
            <a href="/blog" class="flex items-center gap-2 text-neutral-400 hover:text-white text-sm transition-colors mt-2">
              <i class="fas fa-newspaper"></i>
              <span>View Blog</span>
            </a>
          </div>
        </div>

        <!-- Mobile Sidebar Toggle -->
        <button onclick="toggleSidebar()" class="lg:hidden fixed bottom-6 left-4 z-40 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <i class="fas fa-bars text-white"></i>
        </button>

        <!-- Main Content -->
        <div class="flex-1 lg:ml-64 min-w-0">
          <div class="p-4 lg:p-8">

            <!-- Dashboard Panel -->
            <div id="panel-dashboard" class="admin-panel">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">Dashboard</h1>
                <p class="text-neutral-400">Welcome to OFURE RADIO Admin Studio</p>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                ${[
                  { label: 'Blog Articles', value: articles.length.toString(), icon: 'newspaper', color: 'orange' },
                  { label: 'Featured Posts', value: featuredCount.toString(), icon: 'star', color: 'yellow' },
                  { label: 'Live Streams', value: '2', icon: 'radio', color: 'green' },
                  { label: 'Monthly Listeners', value: '50K+', icon: 'headphones', color: 'purple' },
                ].map(stat => `
                <div class="bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-xl p-4">
                  <div class="flex items-center justify-between mb-2">
                    <i class="fas fa-${stat.icon} text-${stat.color}-400 text-xl"></i>
                  </div>
                  <div class="text-2xl font-black text-white">${stat.value}</div>
                  <div class="text-neutral-400 text-sm">${stat.label}</div>
                </div>
                `).join('')}
              </div>

              <!-- Quick Actions -->
              <div class="bg-neutral-900 border border-white/10 rounded-xl p-6 mb-8">
                <h2 class="text-white font-bold mb-4">Quick Actions</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  ${[
                    { icon: 'newspaper', label: 'Manage Blog', action: "showPanel('blog')" },
                    { icon: 'radio', label: 'Streams', action: "showPanel('streams')" },
                    { icon: 'microphone', label: 'Podcasts', action: "showPanel('podcast')" },
                    { icon: 'robot', label: 'AI Studio', action: "showPanel('ai')" },
                  ].map(a => `
                  <button onclick="${a.action}" class="flex flex-col items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/30 rounded-xl p-4 transition-all group">
                    <i class="fas fa-${a.icon} text-orange-400 text-xl group-hover:scale-110 transition-transform"></i>
                    <span class="text-white text-sm font-medium">${a.label}</span>
                  </button>
                  `).join('')}
                </div>
              </div>

              <!-- Recent Blog Articles -->
              <div class="bg-neutral-900 border border-white/10 rounded-xl p-6">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-white font-bold">Recent Blog Articles</h2>
                  <button onclick="showPanel('blog')" class="text-orange-400 hover:text-orange-300 text-sm transition-colors">
                    View All <i class="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
                <div class="space-y-3">
                  ${articles.slice(0, 5).map(a => `
                  <div class="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <img src="${a.image}" alt="${a.imageAlt}" class="w-12 h-12 object-cover rounded-lg flex-shrink-0">
                    <div class="flex-1 min-w-0">
                      <p class="text-white font-medium text-sm truncate">${a.title}</p>
                      <p class="text-neutral-500 text-xs">${a.category} • ${a.date}</p>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <a href="/blog/${a.slug}" target="_blank" class="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="View article">
                        <i class="fas fa-eye text-xs"></i>
                      </a>
                      <button onclick="editArticle('${a.id}')" class="text-orange-400 hover:text-orange-300 p-1.5 rounded-lg hover:bg-orange-500/10 transition-colors" title="Edit article">
                        <i class="fas fa-edit text-xs"></i>
                      </button>
                      ${a.featured ? `<span class="text-yellow-400 text-xs"><i class="fas fa-star"></i></span>` : ''}
                    </div>
                  </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Blog Management Panel -->
            <div id="panel-blog" class="admin-panel hidden">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h1 class="text-3xl font-black font-display text-white mb-1">Blog & News</h1>
                  <p class="text-neutral-400">Manage news articles and blog posts</p>
                </div>
                <div class="flex gap-3">
                  <a href="/blog" target="_blank" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors border border-white/20">
                    <i class="fas fa-external-link-alt mr-1"></i>View Blog
                  </a>
                  <button onclick="showAddArticleModal()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                    <i class="fas fa-plus mr-1"></i>New Article
                  </button>
                </div>
              </div>

              <!-- Blog Stats -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                ${[
                  { label: 'Total Articles', value: articles.length.toString(), color: 'text-orange-400' },
                  { label: 'Featured', value: featuredCount.toString(), color: 'text-yellow-400' },
                  { label: 'Entertainment', value: articles.filter(a => a.category === 'Entertainment').length.toString(), color: 'text-purple-400' },
                  { label: 'Music', value: articles.filter(a => a.category === 'Music').length.toString(), color: 'text-green-400' },
                ].map(s => `
                <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div class="text-2xl font-black ${s.color}">${s.value}</div>
                  <div class="text-neutral-400 text-xs mt-1">${s.label}</div>
                </div>
                `).join('')}
              </div>

              <!-- Auto-refresh Notice -->
              <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                <i class="fas fa-info-circle text-blue-400 mt-0.5 flex-shrink-0"></i>
                <div>
                  <p class="text-blue-300 font-semibold text-sm">Auto-Generated News Content</p>
                  <p class="text-blue-400/70 text-xs mt-1">Articles are automatically curated and refreshed every 24 hours. You can review, edit, or override any article below. New articles will appear on the live blog automatically.</p>
                </div>
              </div>

              <!-- Category Filter -->
              <div class="flex flex-wrap gap-2 mb-6">
                <button onclick="filterArticles('')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-orange-500 text-white" data-category="">All</button>
                ${['Entertainment', 'Music', 'Celebrity', 'World News', 'Sports', 'Technology', 'Lifestyle', 'Africa'].map(cat => `
                <button onclick="filterArticles('${cat}')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors border border-white/10" data-category="${cat}">${cat}</button>
                `).join('')}
              </div>

              <!-- Articles Table -->
              <div class="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden">
                <div class="p-4 border-b border-white/10 flex items-center justify-between">
                  <h2 class="text-white font-semibold">All Articles</h2>
                  <div class="relative">
                    <input type="text" id="adminArticleSearch" placeholder="Search articles..." oninput="searchAdminArticles(this.value)"
                      class="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-orange-500 pr-8">
                    <i class="fas fa-search absolute right-2.5 top-2.5 text-neutral-500 text-xs"></i>
                  </div>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full" id="articlesTable">
                    <thead>
                      <tr class="border-b border-white/10 bg-white/3">
                        <th class="text-left py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider">Article</th>
                        <th class="text-left py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Category</th>
                        <th class="text-left py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Date</th>
                        <th class="text-left py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Status</th>
                        <th class="text-right py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                      ${articles.map(a => `
                      <tr class="hover:bg-white/3 transition-colors article-row" data-category="${a.category}" data-title="${a.title.toLowerCase()}">
                        <td class="py-4 px-4">
                          <div class="flex items-center gap-3">
                            <img src="${a.image}" alt="${a.imageAlt}" class="w-10 h-10 object-cover rounded-lg flex-shrink-0">
                            <div class="min-w-0">
                              <p class="text-white font-medium text-sm truncate max-w-xs">${a.title}</p>
                              <p class="text-neutral-500 text-xs truncate max-w-xs hidden sm:block">${a.excerpt.slice(0, 60)}...</p>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 px-4 hidden md:table-cell">
                          <span class="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">${a.category}</span>
                        </td>
                        <td class="py-4 px-4 text-neutral-400 text-sm hidden lg:table-cell">${a.date}</td>
                        <td class="py-4 px-4 hidden lg:table-cell">
                          ${a.featured 
                            ? '<span class="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><i class="fas fa-star mr-1"></i>Featured</span>'
                            : '<span class="text-xs px-2 py-1 rounded-full bg-white/10 text-neutral-400">Published</span>'
                          }
                        </td>
                        <td class="py-4 px-4 text-right">
                          <div class="flex items-center justify-end gap-2">
                            <a href="/blog/${a.slug}" target="_blank" 
                              class="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors text-xs" title="View article">
                              <i class="fas fa-eye"></i>
                            </a>
                            <button onclick="editArticle('${a.id}')" 
                              class="text-orange-400 hover:text-orange-300 p-2 rounded-lg hover:bg-orange-500/10 transition-colors text-xs" title="Edit article">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="toggleFeatured('${a.id}')" 
                              class="p-2 rounded-lg transition-colors text-xs ${a.featured ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-500/10' : 'text-neutral-400 hover:text-yellow-400 hover:bg-yellow-500/10'}" title="Toggle featured">
                              <i class="fas fa-star"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Stream Manager Panel -->
            <div id="panel-streams" class="admin-panel hidden">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h1 class="text-3xl font-black font-display text-white mb-1">Stream Manager</h1>
                  <p class="text-neutral-400">Manage your internet radio stream URLs</p>
                </div>
                <button onclick="showAddStreamModal()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                  <i class="fas fa-plus mr-1"></i>Add Stream
                </button>
              </div>

              <div class="grid gap-4" id="streamsList">
                ${[
                  { name: 'OFURE RADIO MAIN', url: 'https://stream.zeno.fm/f3wvbbqmdg8uv', genre: 'Afrobeats • R&B • Gospel', status: 'live', listeners: 247 },
                  { name: 'OFURE GOSPEL STATION', url: 'https://stream.example.com/gospel', genre: 'Gospel • Worship • Inspirational', status: 'live', listeners: 89 },
                  { name: 'OFURE URBAN BEATS', url: 'https://stream.example.com/urban', genre: 'Hip-Hop • Trap • Urban', status: 'offline', listeners: 0 },
                ].map((s, i) => `
                <div class="bg-neutral-900 border border-white/10 rounded-xl p-6 hover:border-orange-500/20 transition-colors">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-radio text-orange-400 text-xl"></i>
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2 mb-0.5">
                          <h3 class="text-white font-bold">${s.name}</h3>
                          <span class="text-xs px-2 py-0.5 rounded-full ${s.status === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                            ${s.status === 'live' ? '● LIVE' : '○ OFFLINE'}
                          </span>
                        </div>
                        <p class="text-neutral-400 text-sm">${s.genre}</p>
                        <p class="text-neutral-600 text-xs truncate">${s.url}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-4">
                      ${s.status === 'live' ? `<span class="text-neutral-400 text-sm"><i class="fas fa-users mr-1 text-green-400"></i>${s.listeners} listening</span>` : ''}
                      <div class="flex gap-2">
                        <button onclick="testStream('${s.url}')" class="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors" title="Test stream">
                          <i class="fas fa-play text-sm"></i>
                        </button>
                        <button onclick="editStream(${i})" class="text-orange-400 hover:text-orange-300 p-2 rounded-lg hover:bg-orange-500/10 transition-colors" title="Edit stream">
                          <i class="fas fa-edit text-sm"></i>
                        </button>
                        <button onclick="deleteStream(${i})" class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete stream">
                          <i class="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                `).join('')}
              </div>
            </div>

            <!-- Podcast Studio Panel -->
            <div id="panel-podcast" class="admin-panel hidden">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">Podcast Studio</h1>
                <p class="text-neutral-400">Create and manage podcast episodes</p>
              </div>

              <div class="grid md:grid-cols-2 gap-6 mb-8">
                ${[
                  { icon: 'microphone', title: 'Record Episode', desc: 'Use your browser to record directly', action: 'startRecording()' },
                  { icon: 'upload', title: 'Upload Audio', desc: 'Upload an audio file from your device', action: 'uploadAudio()' },
                  { icon: 'robot', title: 'AI Generate', desc: 'Generate episode content with AI', action: "showPanel('ai')" },
                  { icon: 'rss', title: 'RSS Feed', desc: 'Manage your podcast RSS feed', action: 'manageRSS()' },
                ].map(item => `
                <button onclick="${item.action}" class="flex items-center gap-4 bg-neutral-900 border border-white/10 hover:border-orange-500/30 rounded-xl p-6 text-left transition-all group">
                  <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                    <i class="fas fa-${item.icon} text-orange-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-white font-bold">${item.title}</h3>
                    <p class="text-neutral-400 text-sm">${item.desc}</p>
                  </div>
                </button>
                `).join('')}
              </div>

              <div class="bg-neutral-900 border border-white/10 rounded-xl p-6">
                <h2 class="text-white font-bold mb-4">Recent Episodes</h2>
                <div class="text-center py-8 text-neutral-500">
                  <i class="fas fa-microphone text-4xl mb-3 text-neutral-700"></i>
                  <p>No episodes yet. Start recording or uploading above.</p>
                </div>
              </div>
            </div>

            <!-- AI Studio Panel -->
            <div id="panel-ai" class="admin-panel hidden">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">AI Studio</h1>
                <p class="text-neutral-400">Power your radio station with AI capabilities</p>
              </div>

              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                ${[
                  { icon: 'robot', title: 'AI Assistant', desc: 'Ask me anything about managing OFURE RADIO', gradient: 'from-purple-500/20 to-blue-500/20', action: "document.getElementById('aiChatBox').classList.remove('hidden')" },
                  { icon: 'music', title: 'AI Music Gen', desc: 'Generate music for station IDs', gradient: 'from-orange-500/20 to-red-500/20', action: "showAIFeature('music')" },
                  { icon: 'volume-up', title: 'Voiceover Gen', desc: 'Generate professional voiceovers', gradient: 'from-green-500/20 to-cyan-500/20', action: "showAIFeature('voice')" },
                  { icon: 'file-alt', title: 'Script Writer', desc: 'AI-written show scripts', gradient: 'from-pink-500/20 to-purple-500/20', action: "showAIFeature('script')" },
                  { icon: 'newspaper', title: 'Blog Generator', desc: 'Auto-generate news articles', gradient: 'from-blue-500/20 to-teal-500/20', action: "showAIFeature('blog')" },
                  { icon: 'podcast', title: 'Podcast AI', desc: 'AI-assisted podcast creation', gradient: 'from-yellow-500/20 to-orange-500/20', action: "showAIFeature('podcast')" },
                ].map(item => `
                <button onclick="${item.action}" class="flex flex-col items-start gap-3 bg-gradient-to-br ${item.gradient} border border-white/10 hover:border-white/20 rounded-xl p-6 text-left transition-all group">
                  <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i class="fas fa-${item.icon} text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-white font-bold">${item.title}</h3>
                    <p class="text-neutral-400 text-sm">${item.desc}</p>
                  </div>
                </button>
                `).join('')}
              </div>

              <!-- AI Chat -->
              <div id="aiChatBox" class="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden">
                <div class="p-4 border-b border-white/10 flex items-center gap-2">
                  <i class="fas fa-robot text-purple-400"></i>
                  <h3 class="text-white font-bold">OFURE AI Assistant</h3>
                  <span class="ml-auto text-xs text-neutral-500">Powered by AI</span>
                </div>
                <div id="aiMessages" class="h-64 overflow-y-auto p-4 space-y-3">
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-robot text-purple-400 text-sm"></i>
                    </div>
                    <div class="bg-white/5 rounded-xl px-4 py-3 text-neutral-300 text-sm max-w-md">
                      Hello! I'm your OFURE RADIO AI assistant. Ask me anything about managing your station, scheduling shows, or generating content!
                    </div>
                  </div>
                </div>
                <div class="p-4 border-t border-white/10 flex gap-3">
                  <input type="text" id="aiInput" placeholder="Ask me anything about managing OFURE RADIO..." 
                    class="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 text-sm"
                    onkeydown="if(event.key==='Enter') sendAIMessage()">
                  <button onclick="sendAIMessage()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Schedule Panel -->
            <div id="panel-schedule" class="admin-panel hidden">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">Show Schedule</h1>
                <p class="text-neutral-400">Manage your weekly programming</p>
              </div>
              <div class="bg-neutral-900 border border-white/10 rounded-xl p-6">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-white font-bold">Weekly Schedule</h2>
                  <button class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                    <i class="fas fa-plus mr-1"></i>Add Show
                  </button>
                </div>
                <div class="space-y-3">
                  ${[
                    { time: '6:00 AM', show: 'Morning Vibes', host: 'DJ Alex', days: 'Mon-Fri', status: 'live' },
                    { time: '12:00 PM', show: 'Afternoon Mix', host: 'DJ Luna', days: 'Daily', status: 'scheduled' },
                    { time: '4:00 PM', show: 'Evening Drive', host: 'DJ Marcus', days: 'Daily', status: 'scheduled' },
                    { time: '9:00 PM', show: 'Night Frequency', host: 'DJ Sarah', days: 'Daily', status: 'scheduled' },
                  ].map(show => `
                  <div class="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                    <span class="text-white font-semibold w-20 text-sm flex-shrink-0">${show.time}</span>
                    <div class="flex-1">
                      <div class="text-white font-medium">${show.show}</div>
                      <div class="text-neutral-400 text-sm">${show.host} • ${show.days}</div>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full ${show.status === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}">
                      ${show.status === 'live' ? '● ON AIR' : '⏰ Scheduled'}
                    </span>
                    <button class="text-neutral-400 hover:text-orange-400 p-2 rounded-lg hover:bg-white/10 transition-colors">
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                  </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Security Panel -->
            <div id="panel-security" class="admin-panel hidden">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">Security & PIN</h1>
                <p class="text-neutral-400">Manage admin access settings</p>
              </div>
              <div class="max-w-md">
                <div class="bg-neutral-900 border border-white/10 rounded-xl p-6">
                  <h2 class="text-white font-bold mb-4">Change Admin PIN</h2>
                  <form onsubmit="changePIN(event)" class="space-y-4">
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Current PIN</label>
                      <input type="password" id="currentPin" maxlength="4" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500" placeholder="••••">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">New PIN</label>
                      <input type="password" id="newPin" maxlength="4" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500" placeholder="••••">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Confirm New PIN</label>
                      <input type="password" id="confirmPin" maxlength="4" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500" placeholder="••••">
                    </div>
                    <button type="submit" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors">
                      Update PIN
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <!-- Settings Panel -->
            <div id="panel-settings" class="admin-panel hidden">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">Settings</h1>
                <p class="text-neutral-400">Station configuration</p>
              </div>
              <div class="bg-neutral-900 border border-white/10 rounded-xl p-6">
                <h2 class="text-white font-bold mb-4">Station Settings</h2>
                <div class="space-y-4">
                  ${[
                    { label: 'Station Name', value: 'OFURE RADIO', type: 'text' },
                    { label: 'Tagline', value: 'Where It All Began', type: 'text' },
                    { label: 'Contact Email', value: 'hello@ofureradio.com', type: 'email' },
                    { label: 'Main Stream URL', value: 'https://stream.zeno.fm/f3wvbbqmdg8uv', type: 'url' },
                  ].map(field => `
                  <div>
                    <label class="block text-neutral-400 text-sm mb-2">${field.label}</label>
                    <input type="${field.type}" value="${field.value}" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
                  </div>
                  `).join('')}
                  <button class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Edit Article Modal -->
    <div id="editModal" class="fixed inset-0 z-50 hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 class="text-white font-bold text-xl">Edit Article</h3>
          <button onclick="closeModal('editModal')" class="text-neutral-400 hover:text-white transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="p-6 space-y-4" id="editModalContent">
          <!-- Populated dynamically -->
        </div>
      </div>
    </div>

    <!-- Add Stream Modal -->
    <div id="addStreamModal" class="fixed inset-0 z-50 hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-lg">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 class="text-white font-bold text-xl">Add New Stream</h3>
          <button onclick="closeModal('addStreamModal')" class="text-neutral-400 hover:text-white transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <form onsubmit="saveNewStream(event)" class="p-6 space-y-4">
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Stream Name</label>
            <input type="text" required class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" placeholder="e.g. OFURE GOSPEL STATION">
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Stream URL</label>
            <input type="url" required class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" placeholder="https://stream.example.com/stream">
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Genre / Description</label>
            <input type="text" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" placeholder="e.g. Afrobeats • R&B • Gospel">
          </div>
          <button type="submit" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors">
            <i class="fas fa-plus mr-2"></i>Add Stream
          </button>
        </form>
      </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast" class="fixed bottom-6 right-6 z-50 hidden">
      <div class="bg-neutral-800 border border-white/20 rounded-xl px-5 py-3 flex items-center gap-3 shadow-2xl">
        <i id="toastIcon" class="fas fa-check-circle text-green-400"></i>
        <span id="toastMsg" class="text-white text-sm font-medium"></span>
      </div>
    </div>
  </div>
  `
}
