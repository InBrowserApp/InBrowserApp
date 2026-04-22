## What is a robots.txt generator?

A robots.txt generator helps you create the plain-text file that tells crawlers which parts of your site they may crawl. It combines user-agent groups, allow/disallow rules, sitemap links, and optional directives into a ready-to-publish robots.txt file for your site root.

## What can you configure?

Use this tool to create separate rule groups for different crawlers, apply common presets, list one or more sitemap URLs, and optionally set Host or Crawl-delay values when your target crawlers support them. This is useful when you want broad rules for all bots and stricter rules for paths such as /admin/ or other low-value areas.

## How should you publish the file?

Review the generated output, save it as robots.txt, and upload it to the top level of your domain, such as https://example.com/robots.txt. After publishing, test the file with your search-console or crawler tools and confirm that the paths and sitemap URLs match your live site structure.

## What are the limitations?

robots.txt is a crawl instruction, not an access-control system. It can guide well-behaved crawlers, but it does not protect private content or block direct requests, so sensitive pages should still be protected with authentication or server-side authorization.
