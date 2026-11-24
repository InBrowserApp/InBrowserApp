## 如何將 SQLite 匯出成 SQL 檔案

開啟或拖放 SQLite 3 資料庫檔案，例如 `.db`、`.sqlite` 或 `.sqlite3`。工具會自動產生 SQL 指令碼。開啟**僅匯出結構**即可省略資料表中的記錄，再按一下**下載 .sql** 儲存完整的指令碼。您也可以用範例資料庫預覽匯出結果。

## SQLite 的 SQL 傾印包含哪些內容

SQL 傾印是可用來重建資料庫的純文字指令碼。其中的 `CREATE` 陳述式會建立資料表、索引、檢視表和觸發程序。完整匯出也會包含用於還原資料的 `INSERT` 陳述式。您可以在 Git 中比對結構變更、保留易於閱讀的備份，或將資料庫移至另一個 SQLite 環境。

來源檔案只留在您的裝置上。如果來源資料庫使用預寫式記錄（WAL），請先匯出可獨立使用的資料庫副本。透過建立資料庫的應用程式或 SQLite 的備份指令製作副本，即可納入記錄中已提交的變更。

## 如何還原 SQL 傾印檔

執行以下指令，把 SQL 指令碼匯入新的 SQLite 資料庫。

```sh
sqlite3 restored.sqlite < database.sql
```

請將 `database.sql` 換成下載的檔名。指令碼採用 SQLite 語法。如果資料庫使用虛擬資料表或擴充功能，請在已備妥必要模組的 SQLite 環境中還原。

若要瀏覽資料表或將查詢結果匯出為 CSV 或 JSON，請開啟 [SQLite 檢視器](../sqlite-viewer/)。若要從試算表建立資料庫，請使用 [CSV 與 Excel 轉 SQLite](../csv-excel-to-sqlite/)。
