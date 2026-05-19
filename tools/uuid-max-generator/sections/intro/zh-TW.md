## 什麼是 max UUID？

max UUID 是標準化的 UUID，其 128 個位元全都設為 1。它的標準文字形式是 `ffffffff-ffff-ffff-ffff-ffffffffffff`，常用來表示最高可能的 UUID 值。

## 何時使用它

當 API、資料庫查詢、fixture 或範圍檢查需要 UUID 形狀的上限或哨兵值時，請使用 max UUID。它適用於測試、遷移指令碼、分頁游標，以及定義明確最大 UUID 值的協定。

## 需要注意什麼

請勿將 max UUID 視為產生出的唯一識別碼。它每次都是相同值，因此若將它存放在預期為真實物件 ID 的位置，可能會隱藏哨兵邏輯、破壞唯一性假設，或讓記錄意外排序到最後。
