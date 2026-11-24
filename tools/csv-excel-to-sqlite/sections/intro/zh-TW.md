## 將試算表轉成 SQLite 資料庫

加入一或多個 CSV 或 Excel 檔案（.xlsx、.xls）。每個 CSV 檔案及每張有資料的 Excel 工作表都會各自轉成一個資料表，並存入同一個資料庫。你可以先預覽欄位、重新命名資料表，再選擇「建立 SQLite 資料庫」。轉換在瀏覽器中完成，檔案會留在你的裝置上。

## 試算表資料如何轉成資料表

預設使用第一列作為欄位名稱。如果第一列就是資料，請取消該資料表的「使用第一列作為欄位名稱」選項。這樣會匯入第一列，並自動產生 `column_1` 等欄位名稱。重複的資料表名稱或欄位名稱會加上數字尾碼，因此加入同名檔案時，兩份資料仍會各自保留。

轉換器會辨識數字欄位，並保留 `00123` 這類文字識別碼開頭的零。空白儲存格會轉成 SQL 的 `NULL` 值。Excel 日期會以 ISO 格式的日期或時間戳記文字儲存，公式儲存格則會使用活頁簿中已儲存的計算結果。若需要更新公式結果，請先在 Excel 中重新計算並儲存活頁簿。

## 用 SQL 查詢結果

選擇「在 SQLite 檢視器中開啟」即可瀏覽資料表並執行查詢。你也可以下載 `.sqlite` 資料庫，使用 SQLite 命令列、Python 或其他 SQLite 工具開啟。例如，將 `orders.csv` 和一份包含 `customers` 工作表的 Excel 活頁簿轉成資料庫後，就能查詢每位客戶的訂單數量。

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

修改範例查詢時，請使用預覽中顯示的資料表和欄位名稱。
