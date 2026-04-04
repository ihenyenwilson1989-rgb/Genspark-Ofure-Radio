import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { homePage } from './routes/home'
import { blogPage, blogArticlePage } from './routes/blog'
import { adminPage } from './routes/admin'
import { streamsPage } from './routes/streams'
import { podcastPage } from './routes/podcast'
import { layout } from './layout'
import { getNewsArticles, getArticlesByCategory, getArticleBySlug, newsCategories } from './data/news'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './public' }))

// Serve favicon inline
app.get('/favicon.svg', (c) => {
  c.header('Content-Type', 'image/svg+xml')
  return c.body(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#f97316"/>
    <stop offset="100%" style="stop-color:#7c3aed"/>
  </linearGradient></defs>
  <circle cx="50" cy="50" r="48" fill="url(#g)"/>
  <text x="50" y="65" font-family="Arial" font-size="44" font-weight="bold" fill="white" text-anchor="middle">OR</text>
</svg>`)
})

app.get('/favicon.ico', (c) => {
  return c.redirect('/favicon.svg', 301)
})

// Home page
app.get('/', (c) => {
  return c.html(layout(homePage(), 'OFURE RADIO - Where It All Began'))
})

// Blog/News page
app.get('/blog', (c) => {
  const category = c.req.query('category') || ''
  return c.html(layout(blogPage(category), 'OFURE Radio Blog & News Magazine'))
})

// Blog article page
app.get('/blog/:slug', (c) => {
  const slug = c.req.param('slug')
  const article = getArticleBySlug(slug)
  if (!article) {
    return c.html(layout('<div class="min-h-screen flex items-center justify-center text-white"><h1 class="text-4xl">Article Not Found</h1></div>', 'Not Found'), 404)
  }
  return c.html(layout(blogArticlePage(article), article.title + ' | OFURE Radio'))
})

// Streams page (redirect to home #streams)
app.get('/streams', (c) => {
  return c.redirect('/#streams')
})

// Podcast page
app.get('/podcast', (c) => {
  return c.html(layout(podcastPage(), 'Podcasts | OFURE RADIO'))
})

// Admin page
app.get('/admin', (c) => {
  return c.html(layout(adminPage(), 'Admin Studio | OFURE RADIO'))
})

app.get('/admin/*', (c) => {
  return c.html(layout(adminPage(), 'Admin Studio | OFURE RADIO'))
})

// API: Get news articles
app.get('/api/news', (c) => {
  const category = c.req.query('category') || ''
  const articles = category ? getArticlesByCategory(category) : getNewsArticles()
  return c.json({ articles, categories: newsCategories })
})

app.get('/api/news/:slug', (c) => {
  const slug = c.req.param('slug')
  const article = getArticleBySlug(slug)
  if (!article) return c.json({ error: 'Not found' }, 404)
  return c.json({ article })
})

export default app
