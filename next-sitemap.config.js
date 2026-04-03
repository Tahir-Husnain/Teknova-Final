/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'http://localhost:3000', // replace with your actual domain
  generateRobotsTxt: true,            // also creates robots.txt automatically
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,

  // Pages you want excluded from the sitemap
  exclude: [
    '/account',
    '/account/*',
    '/checkout',
    '/cart',
    '/404',
  ],

  // Override priority for specific pages
  additionalPaths: async (config) => [
    { loc: '/',          changefreq: 'daily',   priority: 1.0,  lastmod: new Date().toISOString() },
    { loc: '/products',  changefreq: 'daily',   priority: 0.9,  lastmod: new Date().toISOString() },
    { loc: '/about',     changefreq: 'monthly', priority: 0.7,  lastmod: new Date().toISOString() },
    { loc: '/contact',   changefreq: 'monthly', priority: 0.6,  lastmod: new Date().toISOString() },
    { loc: '/templates', changefreq: 'monthly', priority: 0.6,  lastmod: new Date().toISOString() },
  ],

  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/account', '/checkout', '/cart'] },
    ],
    additionalSitemaps: [
      'https://your-domain.com/sitemap.xml',
    ],
  },
};