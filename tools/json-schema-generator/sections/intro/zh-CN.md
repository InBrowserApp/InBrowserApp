## 什么是 JSON Schema？

JSON Schema 是一种描述 JSON 数据结构的标准。它可以用机器可读的方式表达字段类型、嵌套结构、必填键以及便于校验的约束条件。

### 这个生成器会做什么

粘贴一段示例 JSON 后，工具会为对象、数组、数字、布尔值、null 以及常见字符串格式推断出初始 schema。生成结果可以继续复制、下载和手动调整。

### 示例

例如，给定下面这段示例数据：

**示例输入**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**生成后的 schema**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "price": { "type": "number" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "published": { "type": "boolean" }
  },
  "required": ["id", "title", "price", "tags", "published"]
}
```

### 使用建议

- 尽量提供有代表性的样例数据，尤其是数组中的多条记录，这样更容易识别可选字段。
- 如果输入只是一个不完整示例，可以关闭“推断必填字段”。
- 如果你希望默认生成更严格的 schema，可以关闭“允许额外属性”。
- 保持字符串格式检测开启，可自动识别 email、URI、UUID 和 date-time。
