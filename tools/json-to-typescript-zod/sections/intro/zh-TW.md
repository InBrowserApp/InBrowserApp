## 如何推斷欄位

轉換器會檢查陣列中的每個元素。範例中只有第一筆資料包含 `active`，因此會將它推斷為選用欄位。兩筆資料都有 `name`，其中一筆的值是字串，另一筆是 `null`，所以 `name` 是必填欄位，型別為 `string | null`。

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

如果範例陣列沒有元素，元素型別會是 `unknown`。範例涵蓋 API 可能回傳的各種資料結構，產生的型別就會更貼近實際資料。

## 何時使用 TypeScript 或 Zod

使用 **TypeScript** 在編輯器中或編譯時檢查型別。使用 **Zod** 呼叫 `apiResponseSchema.safeParse(data)`，即可在執行時驗證傳入資料。產生的 Zod 檔案也會匯出 TypeScript 型別。如果 API 有特定的允許值或字串格式，可在產生的驗證程式碼中補上這些規則。
