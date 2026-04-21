## 什么是用户代理？

User-Agent（UA）字符串用于标识发起请求的浏览器或应用，通常包含浏览器、操作系统、设备和引擎信息。由于 UA 可以被伪造，应将其视为参考而非安全依据。

### 这个解析器会显示什么

这个工具会在你的浏览器中本地解析粘贴的 UA 字符串，并按浏览器、操作系统、引擎、设备、CPU 和 JSON 输出分组显示结果。不会上传任何内容。

### 示例

可以粘贴下面这种常见的 Windows 上 Chrome 字符串：

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

解析结果应识别出 Windows 10 上的 Chrome 115，以及 Blink 引擎和 amd64 CPU 架构。

### 重要提示

现代浏览器越来越依赖 Client Hints，因此单独复制出的 UA 字符串不一定能反映网站在真实请求中看到的全部信息。
