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
                { id: 'inbox', icon: 'inbox', label: 'Listener Inbox', inboxBadge: true },
                { id: 'security', icon: 'shield-alt', label: 'Security & PIN' },
                { id: 'settings', icon: 'cog', label: 'Settings' },
              ].map((item, i) => `
              <button onclick="showPanel('${item.id}')" 
                class="admin-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm ${i === 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}"
                data-panel="${item.id}">
                <i class="fas fa-${item.icon} w-4 text-center"></i>
                <span class="font-medium">${item.label}</span>
                ${item.badge ? `<span class="ml-auto bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full">${item.badge}</span>` : ''}
                ${item.inboxBadge ? `<span id="inboxNavBadge" class="ml-auto bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full" style="display:none"></span>` : ''}
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

            <!-- ═══════════════════════════════════════════ -->
            <!-- DASHBOARD PANEL -->
            <!-- ═══════════════════════════════════════════ -->
            <div id="panel-dashboard" class="admin-panel">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">Dashboard</h1>
                <p class="text-neutral-400">Welcome to OFURE RADIO Admin Studio</p>
              </div>

              <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                ${[
                  { label: 'Blog Articles', value: articles.length.toString(), icon: 'newspaper', color: 'orange' },
                  { label: 'Featured Posts', value: featuredCount.toString(), icon: 'star', color: 'yellow' },
                  { label: 'Live Streams', value: '2', icon: 'radio', color: 'green' },
                  { label: 'Monthly Listeners', value: '50K+', icon: 'headphones', color: 'purple' },
                ].map(stat => `
                <div class="bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-xl p-4">
                  <div class="flex items-center justify-between mb-2">
                    <i class="fas fa-${stat.icon} text-${stat.color}-400 text-xl"></i>
                    <span class="w-2 h-2 rounded-full bg-${stat.color}-400 animate-pulse"></span>
                  </div>
                  <div class="text-2xl font-black text-white" ${stat.label === 'Monthly Listeners' ? 'id="dashListeners"' : ''}>${stat.value}</div>
                  <div class="text-neutral-400 text-sm">${stat.label}</div>
                </div>
                `).join('')}
                <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 cursor-pointer hover:bg-yellow-500/15 transition-colors" onclick="showPanel('inbox')">
                  <div class="flex items-center justify-between mb-2">
                    <i class="fas fa-inbox text-yellow-400 text-xl"></i>
                    <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                  </div>
                  <div class="text-2xl font-black text-white" id="inboxStatPendingDash">0</div>
                  <div class="text-neutral-400 text-sm">Pending Messages</div>
                </div>
              </div>

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

            <!-- ═══════════════════════════════════════════ -->
            <!-- BLOG MANAGEMENT PANEL -->
            <!-- ═══════════════════════════════════════════ -->
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

              <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                <i class="fas fa-info-circle text-blue-400 mt-0.5 flex-shrink-0"></i>
                <div>
                  <p class="text-blue-300 font-semibold text-sm">Auto-Generated News Content</p>
                  <p class="text-blue-400/70 text-xs mt-1">Articles are automatically curated and refreshed every 24 hours. You can review, edit, or override any article below.</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mb-6">
                <button onclick="filterArticles('')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-orange-500 text-white" data-category="">All</button>
                ${['Entertainment', 'Music', 'Celebrity', 'World News', 'Sports', 'Technology', 'Lifestyle', 'Africa'].map(cat => `
                <button onclick="filterArticles('${cat}')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors border border-white/10" data-category="${cat}">${cat}</button>
                `).join('')}
              </div>

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
                      <tr class="hover:bg-white/3 transition-colors article-row"
                        data-id="${a.id}"
                        data-category="${a.category}"
                        data-title="${a.title.toLowerCase()}"
                        data-excerpt="${a.excerpt.replace(/"/g,'&quot;').slice(0,200)}"
                        data-featured="${a.featured}"
                        data-slug="${a.slug}">
                        <td class="py-4 px-4">
                          <div class="flex items-center gap-3">
                            <img src="${a.image}" alt="${a.imageAlt}" class="w-10 h-10 object-cover rounded-lg flex-shrink-0">
                            <div class="min-w-0">
                              <p class="text-white font-medium text-sm truncate max-w-xs article-title-cell">${a.title}</p>
                              <p class="text-neutral-500 text-xs truncate max-w-xs hidden sm:block">${a.excerpt.slice(0, 60)}...</p>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 px-4 hidden md:table-cell">
                          <span class="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 article-category-badge">${a.category}</span>
                        </td>
                        <td class="py-4 px-4 text-neutral-400 text-sm hidden lg:table-cell">${a.date}</td>
                        <td class="py-4 px-4 hidden lg:table-cell article-featured-badge">
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

            <!-- ═══════════════════════════════════════════ -->
            <!-- STREAM MANAGER PANEL -->
            <!-- ═══════════════════════════════════════════ -->
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

              <!-- Stream stats -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <div class="text-2xl font-black text-green-400" id="liveStreamCount">2</div>
                  <div class="text-neutral-400 text-xs mt-1">Live Streams</div>
                </div>
                <div class="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                  <div class="text-2xl font-black text-orange-400" id="totalStreamCount">3</div>
                  <div class="text-neutral-400 text-xs mt-1">Total Streams</div>
                </div>
                <div class="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                  <div class="text-2xl font-black text-purple-400" id="totalListenerCount">336</div>
                  <div class="text-neutral-400 text-xs mt-1">Total Listeners</div>
                </div>
              </div>

              <!-- Stream cards rendered by JS -->
              <div class="grid gap-4" id="streamsList">
                <div class="text-center py-8 text-neutral-500">
                  <i class="fas fa-spinner fa-spin text-3xl mb-3 text-neutral-700 block"></i>
                  <p>Loading streams...</p>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════ -->
            <!-- PODCAST STUDIO PANEL -->
            <!-- ═══════════════════════════════════════════ -->
            <div id="panel-podcast" class="admin-panel hidden">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">Podcast Studio</h1>
                <p class="text-neutral-400">Create, record, upload and manage podcast episodes</p>
              </div>

              <!-- Recording status bar -->
              <div id="recordingStatus" class="hidden mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full bg-red-500 animate-ping flex-shrink-0"></span>
                    <div>
                      <p class="text-red-400 font-bold text-sm">🔴 RECORDING IN PROGRESS</p>
                      <p class="text-red-300/70 text-xs">Speak clearly into your microphone</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-red-400 font-mono font-bold text-xl" id="recordTimer">00:00</span>
                    <button onclick="startRecording()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                      <i class="fas fa-stop mr-2"></i>Stop
                    </button>
                  </div>
                </div>
                <!-- Waveform visualizer -->
                <div class="flex items-end gap-0.5 h-8 mt-3 justify-center" id="recordWave">
                  ${Array.from({length: 40}, () => `<div class="rec-wave-bar bg-red-500/60 w-1 rounded-full" style="height:4px"></div>`).join('')}
                </div>
              </div>

              <!-- Four action cards -->
              <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <!-- Record Episode -->
                <div class="bg-neutral-900 border border-white/10 hover:border-red-500/40 rounded-xl p-6 transition-all group">
                  <div class="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition-colors">
                    <i class="fas fa-microphone text-red-400 text-xl"></i>
                  </div>
                  <h3 class="text-white font-bold mb-1">Record Episode</h3>
                  <p class="text-neutral-400 text-xs mb-4">Record directly in your browser using your microphone</p>
                  <button id="recordBtn" onclick="startRecording()"
                    class="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <i class="fas fa-microphone"></i> Start Recording
                  </button>
                </div>

                <!-- Upload Audio -->
                <div class="bg-neutral-900 border border-white/10 hover:border-blue-500/40 rounded-xl p-6 transition-all group">
                  <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                    <i class="fas fa-upload text-blue-400 text-xl"></i>
                  </div>
                  <h3 class="text-white font-bold mb-1">Upload Audio</h3>
                  <p class="text-neutral-400 text-xs mb-4">Upload MP3, WAV, AAC, OGG or any audio file</p>
                  <button onclick="uploadAudio()"
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <i class="fas fa-upload"></i> Choose File
                  </button>
                  <!-- Drop zone -->
                  <div id="dropZone" class="mt-3 border-2 border-dashed border-white/10 rounded-lg p-3 text-center text-neutral-500 text-xs hover:border-blue-500/40 transition-colors cursor-pointer" onclick="uploadAudio()">
                    <i class="fas fa-cloud-upload-alt mr-1"></i> or drag & drop here
                  </div>
                </div>

                <!-- AI Generate -->
                <div class="bg-neutral-900 border border-white/10 hover:border-purple-500/40 rounded-xl p-6 transition-all group">
                  <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <i class="fas fa-robot text-purple-400 text-xl"></i>
                  </div>
                  <h3 class="text-white font-bold mb-1">AI Generate</h3>
                  <p class="text-neutral-400 text-xs mb-4">Let AI write and outline your next podcast episode</p>
                  <button onclick="aiGeneratePodcast()"
                    class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <i class="fas fa-magic"></i> Generate Outline
                  </button>
                </div>

                <!-- RSS Feed -->
                <div class="bg-neutral-900 border border-white/10 hover:border-orange-500/40 rounded-xl p-6 transition-all group">
                  <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                    <i class="fas fa-rss text-orange-400 text-xl"></i>
                  </div>
                  <h3 class="text-white font-bold mb-1">RSS Feed</h3>
                  <p class="text-neutral-400 text-xs mb-4">Manage your podcast RSS feed for distribution</p>
                  <button onclick="openRSSPanel()"
                    class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <i class="fas fa-rss"></i> Manage RSS
                  </button>
                </div>
              </div>

              <!-- Inline RSS Panel (shown/hidden) -->
              <div id="rssPanelInline" class="hidden bg-neutral-900 border border-orange-500/20 rounded-xl p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-white font-bold flex items-center gap-2"><i class="fas fa-rss text-orange-400"></i> RSS Feed Manager</h3>
                  <button onclick="document.getElementById('rssPanelInline').classList.add('hidden')" class="text-neutral-400 hover:text-white transition-colors"><i class="fas fa-times"></i></button>
                </div>
                <div class="space-y-4">
                  <div class="bg-white/5 rounded-xl p-4">
                    <p class="text-neutral-400 text-xs mb-1">Your Podcast RSS Feed URL</p>
                    <div class="flex gap-2">
                      <input id="rssFeedUrl" type="text" readonly value="${'https://ofureradio.com/rss.xml'}"
                        class="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                      <button onclick="copyRSSFeed()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        <i class="fas fa-copy mr-1"></i>Copy
                      </button>
                    </div>
                  </div>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-neutral-400 text-xs mb-1">Podcast Title</label>
                      <input id="rssTitle" type="text" value="OFURE RADIO Podcast" class="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-xs mb-1">Author</label>
                      <input id="rssAuthor" type="text" value="OFURE RADIO" class="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-xs mb-1">Category</label>
                      <select id="rssCategory" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500">
                        <option>Music</option><option>Entertainment</option><option>News</option><option>Talk Radio</option><option>Arts</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-xs mb-1">Language</label>
                      <select id="rssLanguage" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500">
                        <option>en-US</option><option>en-GB</option><option>yo</option><option>ig</option><option>ha</option>
                      </select>
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-neutral-400 text-xs mb-1">Description</label>
                      <textarea id="rssDesc" rows="2" class="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 resize-none">Your premier internet radio station broadcasting the best African and world music 24/7.</textarea>
                    </div>
                  </div>
                  <!-- Distribution platforms -->
                  <div>
                    <p class="text-neutral-400 text-xs font-semibold mb-2 uppercase tracking-wider">Submit to Platforms</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                      ${[
                        { name: 'Spotify Podcasters', icon: 'spotify', url: 'https://podcasters.spotify.com/', color: 'green' },
                        { name: 'Apple Podcasts', icon: 'apple', url: 'https://podcastsconnect.apple.com/', color: 'purple' },
                        { name: 'Google Podcasts', icon: 'google', url: 'https://podcastsmanager.google.com/', color: 'blue' },
                        { name: 'TuneIn Radio', icon: 'broadcast-tower', url: 'https://tunein.com/podcasts/', color: 'orange' },
                      ].map(p => `
                      <a href="${p.url}" target="_blank" class="flex items-center gap-2 bg-${p.color}-500/10 border border-${p.color}-500/20 rounded-xl p-3 hover:bg-${p.color}-500/20 transition-colors text-xs text-${p.color}-400 font-medium">
                        <i class="${p.icon.includes('fa-') ? 'fas' : 'fab'} fa-${p.icon}"></i> ${p.name}
                      </a>`).join('')}
                    </div>
                  </div>
                  <button onclick="saveRSSSettings()" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors">
                    <i class="fas fa-save mr-2"></i>Save RSS Settings
                  </button>
                </div>
              </div>

              <!-- ══ PODCAST GENERATOR ══ -->
              <div class="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl overflow-hidden mb-6">
                <div class="p-5 border-b border-yellow-500/20">
                  <div class="flex items-center justify-between flex-wrap gap-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        <i class="fas fa-magic text-yellow-400 text-lg"></i>
                      </div>
                      <div>
                        <h2 class="text-white font-bold">Podcast Episode Generator</h2>
                        <p class="text-neutral-400 text-xs">Generate a full episode from an AI outline — fill in the details, then publish to the Podcast page</p>
                      </div>
                    </div>
                    <button onclick="openPodcastGenerator()"
                      class="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2.5 px-5 rounded-xl text-sm transition-colors shadow-lg">
                      <i class="fas fa-wand-magic-sparkles"></i> Generate Episode
                    </button>
                  </div>
                </div>

                <!-- Quick-fill from AI Studio outline -->
                <div class="p-5 grid md:grid-cols-3 gap-4">
                  <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <i class="fas fa-robot text-purple-400 text-sm"></i>
                      <span class="text-white text-xs font-semibold">From AI Studio</span>
                    </div>
                    <p class="text-neutral-500 text-xs leading-relaxed">Click <strong class="text-yellow-400">Generate Outline</strong> in the AI Studio Podcast AI, then come back here to convert it into a real episode.</p>
                    <button onclick="showPanel('ai'); setTimeout(()=>activateAIAgent('podcast'),200)"
                      class="mt-3 w-full text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 rounded-lg py-2 transition-colors font-semibold">
                      <i class="fas fa-robot mr-1"></i> Open Podcast AI
                    </button>
                  </div>
                  <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <i class="fas fa-file-alt text-blue-400 text-sm"></i>
                      <span class="text-white text-xs font-semibold">Paste Outline</span>
                    </div>
                    <p class="text-neutral-500 text-xs leading-relaxed">Copy an outline from the AI chat or write your own, then paste it into the generator to build the episode metadata.</p>
                    <button onclick="openPodcastGenerator()"
                      class="mt-3 w-full text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-lg py-2 transition-colors font-semibold">
                      <i class="fas fa-paste mr-1"></i> Paste & Generate
                    </button>
                  </div>
                  <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <i class="fas fa-paper-plane text-green-400 text-sm"></i>
                      <span class="text-white text-xs font-semibold">Publish to Page</span>
                    </div>
                    <p class="text-neutral-500 text-xs leading-relaxed">Generated episodes go into the Episodes list below. Click <strong class="text-green-400">Publish</strong> to make them live on the Podcast page.</p>
                    <a href="/podcast" target="_blank"
                      class="mt-3 w-full text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 rounded-lg py-2 transition-colors font-semibold flex items-center justify-center gap-1">
                      <i class="fas fa-external-link-alt"></i> View Podcast Page
                    </a>
                  </div>
                </div>
              </div>

              <!-- Episodes list -->
              <div class="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden">
                <div class="p-4 border-b border-white/10 flex items-center justify-between">
                  <h2 class="text-white font-bold flex items-center gap-2">
                    <i class="fas fa-list text-orange-400"></i> Episodes
                    <span id="episodeCount" class="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full">0</span>
                  </h2>
                  <div class="flex items-center gap-3">
                    <a href="/podcast" target="_blank" class="text-neutral-500 hover:text-orange-400 text-xs transition-colors flex items-center gap-1">
                      <i class="fas fa-external-link-alt"></i> Podcast Page
                    </a>
                    <span class="text-neutral-500 text-xs hidden sm:flex items-center gap-1">
                      <i class="fas fa-info-circle"></i> Click edit to rename/update
                    </span>
                  </div>
                </div>
                <div id="podcastList">
                  <div class="text-center py-12 text-neutral-500">
                    <i class="fas fa-microphone text-5xl mb-3 text-neutral-700 block"></i>
                    <p class="font-medium">No episodes yet</p>
                    <p class="text-xs mt-1">Start recording, upload audio, or use the Episode Generator above</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ══ PODCAST GENERATOR MODAL ══ -->
            <div id="podcastGeneratorModal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
              <div class="bg-neutral-900 border border-yellow-500/30 rounded-2xl w-full max-w-3xl my-8">
                <div class="p-6 border-b border-white/10 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <i class="fas fa-magic text-yellow-400"></i>
                    </div>
                    <div>
                      <h3 class="text-white font-bold text-lg">Podcast Episode Generator</h3>
                      <p class="text-neutral-500 text-xs">Fill in details or paste an AI outline to create a publishable episode</p>
                    </div>
                  </div>
                  <button onclick="closeModal('podcastGeneratorModal')" class="text-neutral-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div class="p-6 space-y-5">
                  <!-- Episode metadata -->
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                      <label class="block text-neutral-400 text-sm mb-2">Episode Title <span class="text-red-400">*</span></label>
                      <input type="text" id="genEpTitle" placeholder="e.g. How Afrobeats Is Conquering the World"
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Episode Number</label>
                      <input type="number" id="genEpNumber" min="1" placeholder="e.g. 12"
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Season</label>
                      <input type="number" id="genEpSeason" min="1" value="1"
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Host / DJ</label>
                      <input type="text" id="genEpHost" placeholder="e.g. DJ Alex"
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Duration (estimate)</label>
                      <input type="text" id="genEpDuration" placeholder="e.g. 22 min"
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Genre / Category</label>
                      <select id="genEpCategory"
                        class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors">
                        <option value="Music">Music</option>
                        <option value="Culture">Culture</option>
                        <option value="Interview">Interview</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Gospel">Gospel</option>
                        <option value="Talk">Talk Radio</option>
                        <option value="News">News &amp; Current Affairs</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Tags (comma-separated)</label>
                      <input type="text" id="genEpTags" placeholder="afrobeats, culture, music"
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors">
                    </div>
                  </div>

                  <!-- Show notes / description -->
                  <div>
                    <label class="block text-neutral-400 text-sm mb-2">Episode Description / Show Notes</label>
                    <textarea id="genEpDesc" rows="4"
                      class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                      placeholder="A brief description of what listeners can expect in this episode..."></textarea>
                  </div>

                  <!-- Outline / Script -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <label class="text-neutral-400 text-sm">AI Outline / Script <span class="text-neutral-600 text-xs">(paste from AI Studio → Podcast AI)</span></label>
                      <button onclick="autoFillFromAI()" class="text-xs text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1">
                        <i class="fas fa-magic"></i> Auto-fill from AI Chat
                      </button>
                    </div>
                    <textarea id="genEpOutline" rows="8"
                      class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors resize-none font-mono text-xs"
                      placeholder="[00:00–02:00] INTRO&#10;Host welcome and episode teaser&#10;&#10;[02:00–08:00] SEGMENT 1: Topic...&#10;• Point 1&#10;• Point 2&#10;&#10;...paste your AI-generated outline here"></textarea>
                  </div>

                  <!-- Publish toggle -->
                  <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                    <input type="checkbox" id="genEpPublish" class="w-4 h-4 accent-orange-500" checked>
                    <div>
                      <label for="genEpPublish" class="text-white text-sm font-semibold cursor-pointer">Publish to Podcast Page immediately</label>
                      <p class="text-neutral-500 text-xs">Unchecked = saved as draft in Episodes list only</p>
                    </div>
                  </div>

                  <!-- Action buttons -->
                  <div class="flex gap-3 pt-2">
                    <button onclick="generateAndSavePodcastEpisode()"
                      class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                      <i class="fas fa-magic"></i> Generate &amp; Save Episode
                    </button>
                    <button onclick="closeModal('podcastGeneratorModal')"
                      class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════ -->
            <!-- AI STUDIO PANEL -->
            <!-- ═══════════════════════════════════════════ -->
            <div id="panel-ai" class="admin-panel hidden">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">AI Studio</h1>
                <p class="text-neutral-400">Power your radio station with intelligent AI tools</p>
              </div>

              <!-- 6 AI Agent Cards -->
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                <!-- 1. AI Assistant -->
                <div class="bg-gradient-to-br from-purple-500/15 to-blue-500/15 border border-purple-500/20 hover:border-purple-500/40 rounded-xl p-5 transition-all group cursor-pointer" onclick="activateAIAgent('assistant')">
                  <div class="flex items-start justify-between mb-3">
                    <div class="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i class="fas fa-robot text-purple-400 text-lg"></i>
                    </div>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">● Active</span>
                  </div>
                  <h3 class="text-white font-bold mb-1">AI Assistant</h3>
                  <p class="text-neutral-400 text-xs mb-3">Station management, scheduling, audience growth — ask anything</p>
                  <button class="w-full bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white py-2 rounded-lg text-xs font-semibold transition-all border border-purple-500/30 hover:border-purple-500">
                    <i class="fas fa-comments mr-1"></i>Open Chat
                  </button>
                </div>

                <!-- 2. Music ID Generator -->
                <div class="bg-gradient-to-br from-orange-500/15 to-red-500/15 border border-orange-500/20 hover:border-orange-500/40 rounded-xl p-5 transition-all group cursor-pointer" onclick="activateAIAgent('music')">
                  <div class="flex items-start justify-between mb-3">
                    <div class="w-11 h-11 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i class="fas fa-music text-orange-400 text-lg"></i>
                    </div>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">● Active</span>
                  </div>
                  <h3 class="text-white font-bold mb-1">Music ID Generator</h3>
                  <p class="text-neutral-400 text-xs mb-3">Generate station ID scripts, jingles &amp; bumper music ideas</p>
                  <button class="w-full bg-orange-500/30 hover:bg-orange-500 text-orange-300 hover:text-white py-2 rounded-lg text-xs font-semibold transition-all border border-orange-500/30 hover:border-orange-500">
                    <i class="fas fa-wand-magic-sparkles mr-1"></i>Generate Now
                  </button>
                </div>

                <!-- 3. Voiceover Generator -->
                <div class="bg-gradient-to-br from-green-500/15 to-cyan-500/15 border border-green-500/20 hover:border-green-500/40 rounded-xl p-5 transition-all group cursor-pointer" onclick="activateAIAgent('voice')">
                  <div class="flex items-start justify-between mb-3">
                    <div class="w-11 h-11 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i class="fas fa-volume-up text-green-400 text-lg"></i>
                    </div>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">● Active</span>
                  </div>
                  <h3 class="text-white font-bold mb-1">Voiceover Generator</h3>
                  <p class="text-neutral-400 text-xs mb-3">Professional voiceover scripts for shows, ads and promos</p>
                  <button class="w-full bg-green-500/30 hover:bg-green-600 text-green-300 hover:text-white py-2 rounded-lg text-xs font-semibold transition-all border border-green-500/30 hover:border-green-500">
                    <i class="fas fa-microphone-alt mr-1"></i>Write Script
                  </button>
                </div>

                <!-- 4. Script Writer -->
                <div class="bg-gradient-to-br from-pink-500/15 to-purple-500/15 border border-pink-500/20 hover:border-pink-500/40 rounded-xl p-5 transition-all group cursor-pointer" onclick="activateAIAgent('script')">
                  <div class="flex items-start justify-between mb-3">
                    <div class="w-11 h-11 rounded-xl bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i class="fas fa-file-alt text-pink-400 text-lg"></i>
                    </div>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">● Active</span>
                  </div>
                  <h3 class="text-white font-bold mb-1">Script Writer</h3>
                  <p class="text-neutral-400 text-xs mb-3">Full show scripts, intros, outros and news reads</p>
                  <button class="w-full bg-pink-500/30 hover:bg-pink-600 text-pink-300 hover:text-white py-2 rounded-lg text-xs font-semibold transition-all border border-pink-500/30 hover:border-pink-500">
                    <i class="fas fa-pencil-alt mr-1"></i>Write Script
                  </button>
                </div>

                <!-- 5. Blog Generator -->
                <div class="bg-gradient-to-br from-blue-500/15 to-teal-500/15 border border-blue-500/20 hover:border-blue-500/40 rounded-xl p-5 transition-all group cursor-pointer" onclick="activateAIAgent('blog')">
                  <div class="flex items-start justify-between mb-3">
                    <div class="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i class="fas fa-newspaper text-blue-400 text-lg"></i>
                    </div>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">● Active</span>
                  </div>
                  <h3 class="text-white font-bold mb-1">Blog Generator</h3>
                  <p class="text-neutral-400 text-xs mb-3">Auto-generate entertainment &amp; world news articles on demand</p>
                  <button class="w-full bg-blue-500/30 hover:bg-blue-600 text-blue-300 hover:text-white py-2 rounded-lg text-xs font-semibold transition-all border border-blue-500/30 hover:border-blue-500">
                    <i class="fas fa-pen mr-1"></i>Generate Article
                  </button>
                </div>

                <!-- 6. Podcast AI -->
                <div class="bg-gradient-to-br from-yellow-500/15 to-orange-500/15 border border-yellow-500/20 hover:border-yellow-500/40 rounded-xl p-5 transition-all group cursor-pointer" onclick="activateAIAgent('podcast')">
                  <div class="flex items-start justify-between mb-3">
                    <div class="w-11 h-11 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i class="fas fa-podcast text-yellow-400 text-lg"></i>
                    </div>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">● Active</span>
                  </div>
                  <h3 class="text-white font-bold mb-1">Podcast AI</h3>
                  <p class="text-neutral-400 text-xs mb-3">Episode outlines, show notes, timestamps and descriptions</p>
                  <button class="w-full bg-yellow-500/30 hover:bg-yellow-600 text-yellow-300 hover:text-white py-2 rounded-lg text-xs font-semibold transition-all border border-yellow-500/30 hover:border-yellow-500">
                    <i class="fas fa-list-alt mr-1"></i>Create Outline
                  </button>
                </div>
              </div>

              <!-- AI Chat Box -->
              <div id="aiChatBox" class="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden">
                <div class="p-4 border-b border-white/10 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <i class="fas fa-robot text-purple-400 text-sm"></i>
                    </div>
                    <div>
                      <h3 class="text-white font-bold text-sm" id="aiChatTitle">OFURE AI Assistant</h3>
                      <p class="text-neutral-500 text-xs" id="aiChatSubtitle">Station Management &bull; Content &bull; Strategy</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-green-400 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
                    </span>
                    <button onclick="clearAIChat()" class="text-neutral-500 hover:text-white text-xs transition-colors px-2 py-1 rounded-lg hover:bg-white/10">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                <div id="aiMessages" class="h-72 overflow-y-auto p-4 space-y-3">
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-robot text-purple-400 text-sm"></i>
                    </div>
                    <div class="bg-white/5 rounded-xl px-4 py-3 text-neutral-300 text-sm max-w-md leading-relaxed">
                      Hello! I'm your <strong class="text-white">OFURE RADIO AI Assistant</strong>. I can help you with station management, show scheduling, blog content, stream setup, podcast production, and audience growth strategies. Click any AI agent card above or type your question below!
                    </div>
                  </div>
                </div>
                <!-- Suggested prompts -->
                <div class="px-4 pb-2 flex gap-2 flex-wrap">
                  ${[
                    { label: '📅 Schedule Help', msg: 'Help me optimize my show schedule for maximum listener engagement' },
                    { label: '📝 Write Blog Post', msg: 'Generate a blog article about the latest Afrobeats trends in 2025' },
                    { label: '🎙️ Morning Intro', msg: 'Write a 30-second morning show intro script for DJ Alex' },
                    { label: '📈 Grow Audience', msg: 'Give me 5 strategies to grow OFURE RADIO\'s audience in Africa and diaspora' },
                  ].map(p => `
                  <button onclick="quickPrompt('${p.msg.replace(/'/g,"\\'")}','${p.label}')" class="text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/30 text-neutral-400 hover:text-white px-3 py-1.5 rounded-full transition-all">
                    ${p.label}
                  </button>`).join('')}
                </div>
                <div class="p-4 border-t border-white/10 flex gap-3">
                  <input type="text" id="aiInput" placeholder="Ask anything about managing OFURE RADIO..."
                    class="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 text-sm"
                    onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault();sendAIMessage();}">
                  <button onclick="sendAIMessage()" id="aiSendBtn"
                    class="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
                    <i class="fas fa-paper-plane"></i>
                    <span class="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════ -->
            <!-- SCHEDULE PANEL -->
            <!-- ═══════════════════════════════════════════ -->
            <div id="panel-schedule" class="admin-panel hidden">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h1 class="text-3xl font-black font-display text-white mb-1">Show Schedule</h1>
                  <p class="text-neutral-400">Manage your weekly programming</p>
                </div>
                <button onclick="showAddShowModal()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                  <i class="fas fa-plus mr-1"></i>Add Show
                </button>
              </div>
              <div class="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-white/10 bg-white/3">
                        <th class="text-left py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider">Time</th>
                        <th class="text-left py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider">Show</th>
                        <th class="text-left py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider">Host</th>
                        <th class="text-left py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Genre</th>
                        <th class="text-left py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Days</th>
                        <th class="text-left py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider">Status</th>
                        <th class="text-right py-3 px-4 text-neutral-400 text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody id="scheduleBody" class="divide-y divide-white/5">
                      <!-- Populated by JS renderSchedule() -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════ -->
            <!-- INBOX PANEL -->
            <!-- ═══════════════════════════════════════════ -->
            <div id="panel-inbox" class="admin-panel hidden">
              <div class="mb-6 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 class="text-3xl font-black font-display text-white mb-1">Listener Inbox</h1>
                  <p class="text-neutral-400">Messages, song requests and enquiries from your listeners</p>
                </div>
                <div class="flex gap-2 flex-wrap">
                  <button onclick="filterInbox('all')" id="inboxFilterAll"
                    class="inbox-filter-btn active px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    All
                  </button>
                  <button onclick="filterInbox('pending')" id="inboxFilterPending"
                    class="inbox-filter-btn px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-neutral-400 hover:text-white bg-white/5 border border-white/10">
                    <span class="w-2 h-2 rounded-full bg-yellow-400 inline-block mr-1"></span>Pending
                  </button>
                  <button onclick="filterInbox('approved')" id="inboxFilterApproved"
                    class="inbox-filter-btn px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-neutral-400 hover:text-white bg-white/5 border border-white/10">
                    <span class="w-2 h-2 rounded-full bg-green-400 inline-block mr-1"></span>Approved
                  </button>
                  <button onclick="filterInbox('rejected')" id="inboxFilterRejected"
                    class="inbox-filter-btn px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-neutral-400 hover:text-white bg-white/5 border border-white/10">
                    <span class="w-2 h-2 rounded-full bg-red-400 inline-block mr-1"></span>Rejected
                  </button>
                  <button onclick="clearInbox()" class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-neutral-500 hover:text-red-400 bg-white/5 border border-white/10">
                    <i class="fas fa-trash mr-1"></i>Clear All
                  </button>
                </div>
              </div>

              <!-- Inbox stats bar -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-neutral-900 border border-white/10 rounded-xl p-4 text-center">
                  <div class="text-2xl font-black text-white" id="inboxStatTotal">0</div>
                  <div class="text-neutral-400 text-xs mt-1">Total Messages</div>
                </div>
                <div class="bg-neutral-900 border border-yellow-500/20 rounded-xl p-4 text-center">
                  <div class="text-2xl font-black text-yellow-400" id="inboxStatPending">0</div>
                  <div class="text-neutral-400 text-xs mt-1">Pending Review</div>
                </div>
                <div class="bg-neutral-900 border border-green-500/20 rounded-xl p-4 text-center">
                  <div class="text-2xl font-black text-green-400" id="inboxStatApproved">0</div>
                  <div class="text-neutral-400 text-xs mt-1">Approved</div>
                </div>
                <div class="bg-neutral-900 border border-orange-500/20 rounded-xl p-4 text-center">
                  <div class="text-2xl font-black text-orange-400" id="inboxStatRequests">0</div>
                  <div class="text-neutral-400 text-xs mt-1">Song Requests</div>
                </div>
              </div>

              <!-- Messages list -->
              <div id="inboxList" class="space-y-4">
                <div class="text-center py-16 text-neutral-600">
                  <i class="fas fa-inbox text-4xl mb-4 block"></i>
                  <p class="font-semibold">No messages yet</p>
                  <p class="text-sm mt-1">Messages from your contact form will appear here</p>
                </div>
              </div>
            </div>

            <!-- Reply / Edit Message Modal (shared) -->
            <div id="inboxReplyModal" class="fixed inset-0 z-50 hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div class="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 class="text-white font-bold text-lg" id="replyModalTitle">Reply to Message</h3>
                  <button onclick="closeModal('inboxReplyModal')" class="text-neutral-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div class="p-6 space-y-4">
                  <!-- Original message summary -->
                  <div class="bg-white/5 border border-white/10 rounded-xl p-4" id="replyOriginalMsg"></div>
                  <!-- Reply / response textarea -->
                  <div>
                    <label class="block text-neutral-400 text-sm mb-2" id="replyTextLabel">Your Reply</label>
                    <textarea id="replyText" rows="6"
                      class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      placeholder="Write your reply here…"></textarea>
                  </div>
                  <!-- For song request: add Now Playing note -->
                  <div id="replyMusicNote" class="hidden">
                    <label class="block text-neutral-400 text-sm mb-2">On-Air Note (shown to listener)</label>
                    <input type="text" id="replyMusicNoteText"
                      class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="e.g. Your song will be played at 3:00 PM today!">
                  </div>
                  <div class="flex gap-3">
                    <button onclick="sendInboxReply()" id="replySubmitBtn"
                      class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                      <i class="fas fa-paper-plane"></i><span id="replySubmitLabel">Send Reply</span>
                    </button>
                    <button onclick="closeModal('inboxReplyModal')"
                      class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════ -->
            <!-- SECURITY PANEL -->
            <!-- ═══════════════════════════════════════════ -->
            <div id="panel-security" class="admin-panel hidden">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">Security &amp; PIN</h1>
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
                      <i class="fas fa-lock mr-2"></i>Update PIN
                    </button>
                  </form>
                </div>
                <div class="bg-neutral-900 border border-white/10 rounded-xl p-6 mt-4">
                  <h2 class="text-white font-bold mb-3">Session Info</h2>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between"><span class="text-neutral-400">Session Status</span><span class="text-green-400 font-semibold">Active</span></div>
                    <div class="flex justify-between"><span class="text-neutral-400">Admin Level</span><span class="text-white">Super Admin</span></div>
                    <div class="flex justify-between"><span class="text-neutral-400">Last Login</span><span class="text-neutral-300" id="lastLoginTime">Just now</span></div>
                  </div>
                  <button onclick="adminLogout()" class="mt-4 w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <i class="fas fa-sign-out-alt mr-2"></i>Logout
                  </button>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════ -->
            <!-- SETTINGS PANEL — fully wired with proper IDs -->
            <!-- ═══════════════════════════════════════════ -->
            <div id="panel-settings" class="admin-panel hidden">
              <div class="mb-8">
                <h1 class="text-3xl font-black font-display text-white mb-1">Settings</h1>
                <p class="text-neutral-400">Station configuration &amp; social media links</p>
              </div>

              <form onsubmit="saveSettings(event)" id="settingsForm">
                <!-- Station Info -->
                <div class="bg-neutral-900 border border-white/10 rounded-xl p-6 mb-6">
                  <h2 class="text-white font-bold mb-5 flex items-center gap-2">
                    <i class="fas fa-broadcast-tower text-orange-400"></i> Station Information
                  </h2>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Station Name</label>
                      <input type="text" id="settingStationName" placeholder="OFURE RADIO"
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Station Tagline</label>
                      <input type="text" id="settingTagline" placeholder="THIS IS WHERE IT ALL BEGAN"
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Contact Email</label>
                      <input type="email" id="settingEmail" placeholder="hello@ofureradio.com"
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Main Stream URL</label>
                      <input type="url" id="settingMainStream" placeholder="https://stream.zeno.fm/..."
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-neutral-400 text-sm mb-2">Station Description</label>
                      <textarea id="settingDescription" rows="2" placeholder="Describe your radio station..."
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"></textarea>
                    </div>
                  </div>
                </div>

                <!-- Social Media -->
                <div class="bg-neutral-900 border border-white/10 rounded-xl p-6 mb-6">
                  <h2 class="text-white font-bold mb-5 flex items-center gap-2">
                    <i class="fas fa-share-alt text-orange-400"></i> Social Media Links
                  </h2>
                  <div class="grid md:grid-cols-2 gap-4">
                    ${[
                      { id: 'settingFacebook',  icon: 'facebook',  label: 'Facebook URL',  placeholder: 'https://facebook.com/ofureradio',  color: 'blue'   },
                      { id: 'settingTwitter',   icon: 'twitter',   label: 'Twitter / X URL', placeholder: 'https://twitter.com/ofureradio',  color: 'sky'    },
                      { id: 'settingInstagram', icon: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/ofureradio', color: 'pink'   },
                      { id: 'settingYoutube',   icon: 'youtube',   label: 'YouTube URL',   placeholder: 'https://youtube.com/@ofureradio',  color: 'red'    },
                      { id: 'settingTiktok',    icon: 'tiktok',    label: 'TikTok URL',    placeholder: 'https://tiktok.com/@ofureradio',   color: 'purple' },
                      { id: 'settingWhatsapp',  icon: 'whatsapp',  label: 'WhatsApp Link', placeholder: 'https://wa.me/...',                color: 'green'  },
                    ].map(f => `
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">
                        <i class="fab fa-${f.icon} text-${f.color}-400 mr-1"></i>${f.label}
                      </label>
                      <input type="url" id="${f.id}" placeholder="${f.placeholder}"
                        class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                    </div>`).join('')}
                  </div>
                </div>

                <!-- Appearance -->
                <div class="bg-neutral-900 border border-white/10 rounded-xl p-6 mb-6">
                  <h2 class="text-white font-bold mb-5 flex items-center gap-2">
                    <i class="fas fa-palette text-orange-400"></i> Appearance
                  </h2>
                  <div class="grid md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Primary Accent Color</label>
                      <div class="flex gap-2">
                        <input type="color" id="settingAccentColor" value="#f97316"
                          class="w-12 h-11 rounded-lg cursor-pointer bg-transparent border border-white/20 p-0.5">
                        <input type="text" id="settingAccentHex" value="#f97316" placeholder="#f97316"
                          class="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-orange-500 text-sm">
                      </div>
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Blog Auto-Refresh</label>
                      <select id="settingRefreshInterval" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
                        <option value="24">Every 24 hours</option>
                        <option value="12">Every 12 hours</option>
                        <option value="6">Every 6 hours</option>
                        <option value="1">Every hour</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-neutral-400 text-sm mb-2">Default Language</label>
                      <select id="settingLanguage" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
                        <option value="en">English</option>
                        <option value="yo">Yoruba</option>
                        <option value="ig">Igbo</option>
                        <option value="ha">Hausa</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Save Button -->
                <div class="flex items-center gap-4">
                  <button type="submit"
                    class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-95 text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20">
                    <i class="fas fa-save"></i> Save Settings
                  </button>
                  <button type="button" onclick="resetSettings()"
                    class="bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white px-6 py-3.5 rounded-xl font-semibold transition-all border border-white/10">
                    <i class="fas fa-undo mr-1"></i> Reset to Default
                  </button>
                  <span id="settingsSaveIndicator" class="hidden text-green-400 text-sm font-semibold flex items-center gap-1">
                    <i class="fas fa-check-circle"></i> Saved!
                  </span>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- MODALS -->
    <!-- ═══════════════════════════════════════════════════ -->

    <!-- Edit Article Modal -->
    <div id="editModal" class="fixed inset-0 z-50 hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 class="text-white font-bold text-xl">Edit Article</h3>
          <button onclick="closeModal('editModal')" class="text-neutral-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="p-6" id="editModalContent"></div>
      </div>
    </div>

    <!-- Add/Edit Stream Modal -->
    <div id="addStreamModal" class="fixed inset-0 z-50 hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-lg">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 class="text-white font-bold text-xl" id="streamModalTitle">Add New Stream</h3>
          <button onclick="closeModal('addStreamModal')" class="text-neutral-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <form onsubmit="saveNewStream(event)" class="p-6 space-y-4">
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Stream Name *</label>
            <input type="text" id="streamName" required
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="e.g. OFURE GOSPEL STATION">
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Stream URL *</label>
            <input type="url" id="streamUrl" required
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="https://stream.zeno.fm/...">
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Genre / Description</label>
            <input type="text" id="streamGenre"
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="e.g. Afrobeats • R&amp;B • Gospel">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Status</label>
              <select id="streamStatus" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                <option value="live">🟢 Live</option>
                <option value="offline">🔴 Offline</option>
                <option value="scheduled">🟡 Scheduled</option>
              </select>
            </div>
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Bitrate</label>
              <select id="streamBitrate" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                <option value="32">32 kbps — Low (mobile data)</option>
                <option value="48">48 kbps — Economy</option>
                <option value="64">64 kbps — Standard</option>
                <option value="96">96 kbps — Good quality</option>
                <option value="128" selected>128 kbps — Recommended</option>
                <option value="160">160 kbps — High quality</option>
                <option value="192">192 kbps — Studio quality</option>
                <option value="256">256 kbps — Broadcast HD</option>
                <option value="320">320 kbps — Maximum fidelity</option>
              </select>
            </div>
          </div>
          <!-- Test / Play stream preview inside modal -->
          <div class="bg-black/30 border border-white/10 rounded-xl p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-neutral-400 text-sm font-medium"><i class="fas fa-headphones mr-2 text-orange-400"></i>Test Stream Preview</span>
              <button type="button" onclick="testStreamModal()"
                class="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-green-500/30">
                <i class="fas fa-play text-xs" id="modalTestIcon"></i>
                <span id="modalTestLabel">Test Stream</span>
              </button>
            </div>
            <div id="modalStreamStatus" class="text-xs text-neutral-600 italic">Enter a stream URL above, then click Test Stream to preview it here.</div>
            <audio id="modalStreamAudio" preload="none" class="hidden"></audio>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit"
              class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors">
              <i class="fas fa-save mr-2"></i><span id="streamSaveBtnLabel">Add Stream</span>
            </button>
            <button type="button" onclick="closeModal('addStreamModal')"
              class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Schedule Modal -->
    <div id="scheduleModal" class="fixed inset-0 z-50 hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-lg">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 class="text-white font-bold text-xl" id="scheduleModalTitle">Add Show</h3>
          <button onclick="closeModal('scheduleModal')" class="text-neutral-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <form onsubmit="saveScheduleEntry(event)" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Air Time *</label>
              <input type="text" id="schedTime" required placeholder="e.g. 6:00 AM"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Days</label>
              <input type="text" id="schedDays" placeholder="e.g. Mon-Fri"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
            </div>
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Show Name *</label>
            <input type="text" id="schedShow" required placeholder="e.g. Morning Vibes"
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Host / DJ</label>
              <input type="text" id="schedHost" placeholder="e.g. DJ Alex"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Status</label>
              <select id="schedStatus" class="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
                <option value="scheduled">Scheduled</option>
                <option value="live">On Air</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Genre</label>
            <input type="text" id="schedGenre" placeholder="e.g. Afrobeats / Gospel"
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors">
              <i class="fas fa-save mr-2"></i>Save Show
            </button>
            <button type="button" onclick="closeModal('scheduleModal')" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Podcast Modal -->
    <div id="editPodcastModal" class="fixed inset-0 z-50 hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-lg">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 class="text-white font-bold text-xl">Edit Episode</h3>
          <button onclick="closeModal('editPodcastModal')" class="text-neutral-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <input type="hidden" id="editPodcastId">
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Episode Title *</label>
            <input type="text" id="editPodcastTitle"
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Episode Number</label>
              <input type="number" id="editPodcastEp" min="1" placeholder="1"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-neutral-400 text-sm mb-2">Season</label>
              <input type="number" id="editPodcastSeason" min="1" value="1"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
            </div>
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Description / Show Notes</label>
            <textarea id="editPodcastDesc" rows="3"
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none"
              placeholder="What is this episode about?"></textarea>
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-2">Tags (comma separated)</label>
            <input type="text" id="editPodcastTags" placeholder="afrobeats, music, entertainment"
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
          </div>
          <div class="flex gap-3 pt-2">
            <button onclick="savePodcastEdit()"
              class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors">
              <i class="fas fa-save mr-2"></i>Save Episode
            </button>
            <button onclick="closeModal('editPodcastModal')"
              class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div id="globalToast" style="position:fixed;bottom:24px;right:24px;z-index:9999;transition:all .3s ease;transform:translateY(20px);opacity:0;pointer-events:none;"></div>
  </div>
  `
}
