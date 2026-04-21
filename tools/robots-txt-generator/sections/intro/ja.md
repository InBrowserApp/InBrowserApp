## robots.txt ジェネレーターとは？

robots.txt ジェネレーターは、User-agent ルールや Allow/Disallow のパス、Sitemap リンクを組み合わせて robots.txt を作成します。サイトのルートに /robots.txt として配置し、クローラーが読み取れるようにします。

### このジェネレーターでできること

- 検索エンジン、AI クローラー、またはカスタムボットごとに別々のルールを作成できます
- `Allow`、`Disallow`、Sitemap、任意の高度なディレクティブをまとめて追加できます
- 公開できる状態の `robots.txt` をコピーまたはダウンロードできます

### 例

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

この例では、クローラーに `/admin/` の大部分を避けてもらい、`/admin/help/` はクロール可能なままにし、Sitemap の場所も知らせます。

### 重要な注意点

- ファイルはサイトルートの `/robots.txt` に配置してください
- `robots.txt` は公開情報であり助言的なもので、アクセス制御ではありません
- `Host` と `Crawl-delay` はすべてのクローラーでサポートされるわけではありません
