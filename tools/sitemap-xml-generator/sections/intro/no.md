## Why this tool is useful

Search engines do not need a massive sitemap system to understand most sites. They need a valid XML document with stable URLs, sensible update hints, and no accidental formatting mistakes. This tool focuses on that core job.

## What it covers

- Build a standard `urlset` sitemap for pages on one site.
- Build a `sitemapindex` document when you already split large sites into multiple sitemap files.
- Work with either absolute URLs or clean relative paths joined against one base URL.

## What to watch for

- Sitemap locations should resolve to final canonical URLs, not temporary redirects.
- `lastmod`, `changefreq`, and `priority` are hints, not guarantees about crawling behavior.
- If every row is already a full URL, turn off automatic base URL joining and keep the XML explicit.
