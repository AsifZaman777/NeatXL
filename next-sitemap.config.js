/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://neatxl.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/admin/*', '/private/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/private/'],
      },
    ],
    additionalSitemaps: [
      'https://neatxl.com/sitemap.xml',
    ],
  },
  changefreq: 'weekly',
  priority: 1.0,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Custom priority for different pages
    let priority = config.priority;
    
    if (path === '/') {
      priority = 1.0;
    } else if (path === '/dashboard') {
      priority = 0.8;
    } else if (path === '/pricing') {
      priority = 0.7;
    } else if (path === '/contact') {
      priority = 0.6;
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
