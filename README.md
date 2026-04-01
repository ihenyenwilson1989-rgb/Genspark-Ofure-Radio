# OFURE RADIO Website

## Project Overview
- **Name**: OFURE RADIO - Where It All Began
- **Goal**: Premier internet radio station website with live streaming, blog/news magazine, and admin studio
- **Stack**: Hono + TypeScript + TailwindCSS + Cloudflare Pages

## Live URLs
- **Home**: `/`
- **Blog/News Magazine**: `/blog`
- **Blog by Category**: `/blog?category=Entertainment`
- **Article Page**: `/blog/:slug`
- **Admin Studio**: `/admin` (PIN: 1234)
- **API - All News**: `/api/news`
- **API - By Category**: `/api/news?category=Music`
- **API - Single Article**: `/api/news/:slug`

## Features Implemented

### Main Website
- ✅ Full-page hero with animated orbs and live radio player
- ✅ Embedded Zeno.FM stream (https://stream.zeno.fm/f3wvbbqmdg8uv)
- ✅ Visualizer animation while playing
- ✅ About section with DJ lineup
- ✅ Weekly show schedule table
- ✅ Active streams section (3 streams)
- ✅ Blog preview section (latest 3 articles)
- ✅ Contact form + newsletter signup
- ✅ Footer with social links

### Blog & News Magazine (OFURE BEAT)
- ✅ Magazine-style masthead and header
- ✅ Live breaking news ticker
- ✅ Featured hero article with large image
- ✅ Secondary featured articles
- ✅ Full article grid with category badges
- ✅ Category navigation bar (8 categories)
- ✅ Sidebar: Search, Categories, Trending Tags, Newsletter, Radio Widget
- ✅ Individual article pages with full content
- ✅ Pull quotes and styled article body
- ✅ Related articles sidebar
- ✅ Share buttons (Twitter, Facebook, WhatsApp, Copy Link)
- ✅ 12 curated news articles (Entertainment, Music, Celebrity, World News, Sports, Technology, Lifestyle, Africa)
- ✅ Auto-generated content refreshed every 24 hours
- ✅ Real Unsplash images for all articles

### Admin Studio
- ✅ PIN authentication gate (default: 1234, changeable)
- ✅ Sidebar navigation with 8 panels
- ✅ **Dashboard**: Stats overview + quick actions + recent articles
- ✅ **Blog & News Panel**: 
  - View all articles with images, categories, dates
  - Filter by category
  - Search articles
  - Edit article modal
  - Toggle featured status
  - Direct link to view each article live
  - Direct link to view blog
- ✅ **Stream Manager**: View/add/edit/delete stream URLs
- ✅ **Podcast Studio**: Record/upload/RSS management
- ✅ **Show Schedule**: Weekly programming management
- ✅ **AI Studio**: AI chat assistant + AI features (Music, Voice, Script, Blog, Podcast)
- ✅ **Security & PIN**: Change admin PIN
- ✅ **Settings**: Station configuration

## Data Architecture
- **Articles**: Curated in-memory data (12 articles, 8 categories)
- **News Refresh**: Articles include dynamic dates (today/yesterday/2 days ago) auto-updated on each request
- **Storage**: Cloudflare Pages edge (no external database needed)
- **Static Files**: Served from `/public/static/` → `/static/*`

## Tech Stack
- **Backend**: Hono 4.x (TypeScript)
- **Frontend**: TailwindCSS CDN + FontAwesome + Google Fonts
- **Radio**: Zeno.FM stream embedding
- **Images**: Unsplash (free-to-use)
- **Deployment**: Cloudflare Pages / Wrangler

## Development
```bash
npm run build       # Build for production
pm2 start ecosystem.config.cjs  # Start dev server
pm2 restart ofure-radio         # Restart after changes
```

## Deployment
```bash
npm run build
npx wrangler pages deploy dist --project-name ofure-radio
```

## Status
- ✅ All routes working (200 OK)
- ✅ Blog magazine live with 12 articles
- ✅ Admin studio accessible at /admin (PIN: 1234)
- ✅ Live stream embedded
- ✅ No JavaScript errors
- **Platform**: Cloudflare Pages
- **Last Updated**: April 2025
