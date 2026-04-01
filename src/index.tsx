import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { homePage } from './routes/home'
import { blogPage, blogArticlePage } from './routes/blog'
import { adminPage } from './routes/admin'
import { streamsPage } from './routes/streams'
import { layout } from './layout'
import { getNewsArticles, getArticlesByCategory, getArticleBySlug, newsCategories } from './data/news'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './public' }))

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
