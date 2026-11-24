## 将 Mermaid 转成 PDF

将 Mermaid 代码粘贴到编辑器，或拖入 `.mmd` 文件。也可以选择**打开文件**，或从 Markdown 文档复制一整段带围栏的 `mermaid` 代码块。确认预览后，选择页面尺寸，再点击**下载 PDF**。图表和 PDF 都在浏览器内生成。

想快速试用，可以选择**加载示例**，或粘贴下面从左向右排列的审批流程。

```mermaid
flowchart LR
  Draft --> Review
  Review --> Approved
```

## 按分享或打印需求选择页面尺寸

**按图表尺寸**会生成一页刚好容纳完整图表的 PDF。选择 **A4** 或 **US Letter** 时，工具会留出页边距，将整幅图缩放到一页内，较宽的图会采用横向。如果流程较复杂，放进一张纸后文字可能偏小。主要在屏幕上查看时，可以选**按图表尺寸**，方便放大阅读。

## 矢量 PDF 和 SVG 各适合什么场景

矢量 PDF 适合放进报告、讲义或邮件附件，放大后线条和箭头仍然清晰。要嵌入网页或在矢量编辑器里调整，可以下载 **SVG**。请保留 Mermaid 源码，便于以后修改图表。需要实时编辑或导出 PNG 时，可以使用 [Mermaid 预览器](../mermaid-previewer/)。

PDF 会把文字标签保存为矢量轮廓。要复制或修改标签文字，请使用源文件。

## 无法渲染图表时怎么处理

请检查第一行是否声明了图表类型，例如 `flowchart LR` 或 `sequenceDiagram`。从 Markdown 复制时，只粘贴 Mermaid 代码块。渲染失败时编辑器会保留原来的代码，修改后即可重试。其他图表类型可以查阅 [Mermaid 语法参考](https://mermaid.js.org/intro/syntax-reference.html)。
