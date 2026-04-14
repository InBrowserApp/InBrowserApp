## 什麼是 JSON Schema？

JSON Schema 是一種描述 JSON 資料結構的標準。它可以用機器可讀的方式表達欄位型別、巢狀結構、必填鍵，以及便於驗證的限制條件。

### 這個產生器會做什麼

貼上一段範例 JSON 後，工具會為物件、陣列、數字、布林值、null，以及常見字串格式推斷出初始 schema。產生結果可以繼續複製、下載與手動調整。

### 範例

例如，給定下面這段範例資料：

**範例輸入**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**產生後的 schema**

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

### 使用建議

- 盡量提供有代表性的樣本資料，尤其是陣列中的多筆記錄，這樣更容易辨識可選欄位。
- 如果輸入只是不完整的範例，可以關閉「推斷必填欄位」。
- 如果你希望預設產生更嚴格的 schema，可以關閉「允許額外屬性」。
- 保持字串格式偵測開啟，可自動識別 email、URI、UUID 和 date-time。
