## 什么是 Local Font Access？

Local Font Access 是浏览器 API，用于列出设备上安装的字体。

这个工具可以搜索结果、比较相关字重与字样，并为你选中的字体复制 CSS 代码片段。

它仅在安全上下文和受支持的浏览器中可用，并需要用户权限（local-fonts）。

API 返回的 FontData 包含 family、fullName、postscriptName、style 等信息。

### 关键说明

- 用它确认当前设备上 CSS `font-family` 栈需要使用的准确名称。
- 调用必须由用户交互触发。
- Permissions Policy 可能会阻止访问。
- 本工具在本地运行，不会上传字体。
