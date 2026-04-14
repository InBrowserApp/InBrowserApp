## JSON Schema とは？

JSON Schema は、JSON データの構造を記述するための標準です。フィールド型、ネスト構造、必須キー、検証に使いやすい制約を機械可読な形で表現できます。

### このジェネレーターが行うこと

サンプル JSON を貼り付けると、このツールはオブジェクト、配列、数値、真偽値、null、そして一般的な文字列フォーマットに対する初期 schema を推定します。結果はそのままコピー、ダウンロード、調整ができます。

### 例

たとえば、次のサンプルデータがあるとします。

**サンプル入力**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**生成された schema**

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

### 使い方のヒント

- 特に配列の中では、代表的なサンプルデータを入れると任意フィールドを推定しやすくなります。
- 入力が不完全な例にすぎない場合は「Infer required properties」をオフにしてください。
- より厳しい schema を初期状態で作りたい場合は「Allow additional properties」をオフにしてください。
- email、URI、UUID、date-time を推定するため、文字列フォーマット検出はオンのままにしておくと便利です。
