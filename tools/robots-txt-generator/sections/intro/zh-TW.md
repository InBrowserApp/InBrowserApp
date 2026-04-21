## 什麼是 robots.txt 產生器？

robots.txt 產生器可協助你組合 User-agent 規則、允許/禁止路徑與 Sitemap 連結來生成 robots.txt。將檔案放在網站根目錄的 /robots.txt 供爬蟲讀取。

### 這個產生器可以幫你做什麼

- 為搜尋引擎、AI 爬蟲或自訂機器人分別建立規則
- 在同一處加入 `Allow`、`Disallow`、Sitemap 與可選的進階指令
- 複製或下載可直接發布的 `robots.txt` 檔案

### 範例

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

這個範例會要求爬蟲避開大部分 `/admin/`，保留 `/admin/help/` 可抓取，並告訴它們 Sitemap 的位置。

### 重要說明

- 將檔案發布到網站根目錄的 `/robots.txt`
- `robots.txt` 是公開且僅供提示，不是存取控制
- 並非所有爬蟲都支援 `Host` 和 `Crawl-delay`
