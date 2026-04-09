## 概覽

JSON Diff Path 會比較兩份 JSON 文件，並將每一個結構變更轉換成可讀的路徑記錄，同時提供 JSONPath 與 JSON Pointer 輸出。

## 何時使用

當你需要檢視 API 載荷變更、檢查設定遷移，或為自動化產生 RFC 6902 JSON Patch 操作時，就很適合使用這個工具。

## 運作方式

這個工具會解析兩份 JSON 輸入，計算 `add`、`remove` 與 `replace` 變更，接著讓你篩選這些操作，並在同一個結果面板中切換路徑清單與 JSON Patch 輸出。
