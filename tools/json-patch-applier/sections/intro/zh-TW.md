## 如何套用 JSON Patch

在第一個編輯區貼上原始 JSON 文件，再在第二個編輯區貼上 RFC 6902 JSON Patch 陣列。選擇 **套用補丁**，即可預覽和複製修改後的 JSON。如要產生補丁，可用 [JSON 差異路徑](../json-diff-path/) 比較修改前後的文件，再複製 **JSON Patch** 輸出。請將補丁套用到用於比較的同一份原始文件。

## JSON Patch 範例

原始文件有一個狀態和一個標籤。

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

以下補丁先檢查原始狀態，再更新狀態並加入一個標籤。

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

結果為 `{"status":"published","tags":["api","release"]}`。

## 支援的操作與 JSON Pointer 語法

- `add` 新增或覆寫物件成員、插入陣列元素，或在根路徑上取代整份文件。
- `remove` 刪除現有的值。`replace` 則將現有的值換成新值。
- `move` 將現有的值從 `from` 指向的位置移到 `path`。`copy` 則會在目標位置插入獨立的副本。
- `test` 檢查 `path` 指向的值是否等於指定的 `value`，並維持文件原樣。

路徑採用 RFC 6901 JSON Pointer。陣列索引從零開始，因此 `/tags/0` 指向第一個標籤。當操作向陣列新增元素時，`/tags/-` 會將元素加到陣列尾端。物件的鍵若包含斜線，請用 `~1` 表示，波浪號則用 `~0` 表示。例如，`/a~1b` 指向名為 `a/b` 的鍵。空路徑 `""` 指向整份文件，而 `/` 指向以空字串為鍵的成員。

## JSON Patch 操作失敗的原因

操作會依陣列順序執行，每項操作都以先前操作的結果為準。若目標不存在、陣列索引超出範圍，或 `test` 的比對結果不符，工具會標出第一項失敗的操作並停止處理。整個補丁都成功套用後，才會顯示 JSON 預覽。套用空補丁陣列 `[]` 會傳回原始文件。

補丁由瀏覽器在本機套用，原始 JSON 和補丁都留在你的瀏覽器中。
