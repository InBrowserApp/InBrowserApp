## 將 VCF 聯絡人匯出到 CSV 試算表

選擇**vCard 轉 CSV**，開啟 `.vcf` 檔案或貼上檔案內容，再選擇**轉換**。每位聯絡人在 CSV 中各占一列。下載 CSV 後，即可在 Excel、Google 試算表等應用程式中排序或編輯通訊錄。選擇**試用範例**，可查看兩種轉換方向各自的格式。

## 將 CSV 聯絡人清單轉成 vCard

選擇**CSV 轉 vCard**，接著匯入 UTF-8 編碼的 CSV，並在第一列填上欄位名稱。工具會辨識 `Full Name`、`First Name`、`Last Name`、`Email`、`Phone`、`Company`、`Job Title`、`Website`、`Address`、`Notes` 等欄位，也支援通訊錄常見的其他欄名。例如，`First Name,Last Name,Email` 下方的資料列會轉成具有顯示名稱和獨立姓氏、名字欄位的聯絡人。

下載轉換後的 VCF 檔案，即可將聯絡人匯入通訊錄。每列聯絡人資料都會產生一筆 vCard 3.0 記錄。

## 了解 CSV 能保留哪些資料

CSV 使用單一表格儲存資料。工具會保留每張名片中的第一個電子郵件地址、電話號碼、網址和地址。照片、欄位標籤和自訂 vCard 屬性都留在原始 VCF 檔案中。若需要完整備份，請保留原始檔案。轉換作業在瀏覽器中完成。
