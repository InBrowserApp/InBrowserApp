## 什么是 robots.txt 生成器？

robots.txt 生成器可帮助你组合 User-agent 规则、允许/禁止路径和 Sitemap 链接来生成 robots.txt。将文件发布到站点根目录的 /robots.txt 供爬虫读取。

### 这个生成器可以帮你做什么

- 为搜索引擎、AI 爬虫或自定义机器人分别创建规则
- 在一处添加 `Allow`、`Disallow`、Sitemap 和可选高级指令
- 复制或下载可直接发布的 `robots.txt` 文件

### 示例

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

此示例会要求爬虫避开大部分 `/admin/`，保留 `/admin/help/` 可抓取，并告诉它们 Sitemap 的位置。

### 重要说明

- 将文件发布到站点根目录的 `/robots.txt`
- `robots.txt` 是公开且仅具提示作用，不是访问控制
- 并非所有爬虫都支持 `Host` 和 `Crawl-delay`
