## フィールドの推定方法

変換ツールは、配列の要素をすべて確認します。この例では最初のレコードだけに `active` があるため、省略可能なフィールドになります。一方、`name` は両方のレコードにあり、一方の値は文字列、もう一方は `null` です。そのため、`name` は必須フィールドで、型は `string | null` になります。

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

サンプルの配列が空の場合、要素の型は `unknown` になります。API が返すさまざまな構造のレコードをサンプルに含めると、実際のレスポンスに近い型を生成できます。

## TypeScript と Zod の使い分け

**TypeScript** はエディターやコンパイル時の型チェックに使います。実行時に受け取ったデータを検証するには、**Zod** のスキーマで `apiResponseSchema.safeParse(data)` を呼び出します。生成された Zod ファイルは TypeScript の型もエクスポートします。指定された値や文字列の形式など、API 固有の制約があれば生成コードに追加してください。
