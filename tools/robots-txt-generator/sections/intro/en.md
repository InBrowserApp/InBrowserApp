## What is a robots.txt generator?

A robots.txt generator helps you combine user-agent rules, allow/disallow paths, and sitemap links to create a robots.txt file. Publish it at the site root as /robots.txt so crawlers can read it.

### What this generator helps you do

- Create separate rules for search engines, AI crawlers, or custom bots
- Add `Allow`, `Disallow`, sitemap, and optional advanced directives in one place
- Copy or download a ready-to-publish `robots.txt` file

### Example

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

This example asks crawlers to avoid most of `/admin/`, keeps `/admin/help/` crawlable, and points them to the sitemap.

### Important notes

- Publish the file at `/robots.txt` in your site root
- `robots.txt` is public and advisory, not access control
- `Host` and `Crawl-delay` are not supported by every crawler
