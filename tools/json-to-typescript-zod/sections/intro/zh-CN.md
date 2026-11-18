## 如何推断字段类型

工具会检查数组中的每条记录。示例中，`active` 只出现在第一条记录里，所以是可选字段。两条记录都有 `name`，值分别是字符串和 `null`，因此 `name` 是必填字段，类型为 `string | null`。

```json
[
  { "id": 1, "name": "Ada", "active": true },
  { "id": 2, "name": null }
]
```

```ts
export type ApiResponse = Array<{
  id: number
  name: string | null
  active?: boolean
}>
```

空数组的元素类型会推断为 `unknown`。示例涵盖的记录结构越多，生成的类型就越贴近接口的实际响应。

## 什么时候用 TypeScript，什么时候用 Zod

**TypeScript** 适合在开发和编译时检查类型。需要在运行时校验接口返回的数据时，可以用 **Zod**，调用 `apiResponseSchema.safeParse(data)`。生成的 Zod 文件也会导出 TypeScript 类型。接口有固定取值或格式要求时，可以在生成的校验代码里补充规则。
