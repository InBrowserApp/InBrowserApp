## 什么是 OpenAPI 转 TypeScript 生成器？

OpenAPI 转 TypeScript 生成器会直接在浏览器中把 OpenAPI 3.x 文档转换为生成的 TypeScript 类型。它适合需要快速预览类型、下载声明文件，或者在不把 schema 发送到服务器的情况下安全测试 `openapi-typescript` 选项的场景。

## 何时使用

当你已经有 JSON 或 YAML 格式的 OpenAPI schema，并且希望为前端应用、SDK 原型或 API 评审生成带类型的请求和响应模型时，可以使用这个工具。在提交输出到仓库之前比较不同生成选项时，它尤其有用。

## 生成前

这个浏览器重写版本支持已打包的 OpenAPI 3.0 和 3.1 文档。如果你的 schema 里仍然包含外部 `$ref` 目标，请先将它们打包或内联，然后再在这里生成最终的 TypeScript 输出。
