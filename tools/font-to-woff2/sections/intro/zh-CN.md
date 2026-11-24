## 如何将 TTF 或 OTF 转换为 WOFF2

选择一个或多个 TrueType（`.ttf`）或 OpenType（`.otf`）字体文件，或将文件拖入转换器。添加文件后即开始转换。字体转换完成后，可以比较原文件和 WOFF2 文件的大小，然后选择**下载 WOFF2**。例如，`Inter-Regular.ttf` 会转换为 `Inter-Regular.woff2`。所有字体处理都在浏览器中进行，文件始终保留在你的设备上。

## 为什么网页字体使用 WOFF2？

WOFF2（Web Open Font Format 2）使用 Brotli 压缩来封装字体数据。与直接提供原始 TTF 或 OTF 文件相比，WOFF2 通常需要传输更少的数据，具体节省多少取决于字体。格式转换会保留完整的字形集和可变字体轴，因此一个可变字体文件仍可覆盖多个字重。如果网站只使用特定字符，可以使用[字体子集生成工具](../font-subset-generator/)进一步减小文件大小。

## 如何在 CSS 中使用 WOFF2 文件

将下载的文件放入网站的字体文件夹，并通过 `@font-face` 引用。确保路径、字重和样式与所使用的文件匹配。以下示例从 `/fonts/` 加载常规字体，并在加载期间使用后备字体显示文本。

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

对于可变字体，请使用该字体实际支持的字重范围，例如 `font-weight: 100 900;`。在网站上托管字体前，请检查其许可证，并测试页面使用的语言和字重。参阅 [MDN 的 @font-face 参考文档](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face)。
