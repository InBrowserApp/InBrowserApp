## 在瀏覽器中開啟 IPFS 或 Filecoin 的 CAR 檔案

從裝置選擇一個 `.car` 檔案。工具會在本機讀取封存檔並顯示根 CID。如果封存檔內有多個根 CID，請選擇所需的一個。IPFS 和 Filecoin 使用 CAR（Content Addressable aRchive，也就是內容定址封存檔）格式。Apple 資產目錄也使用 `.car` 副檔名，採用的是另一種格式。

## 擷取檔案或將 CAR 內的資料夾轉成 ZIP

開啟資料夾即可查看其中的內容。選取檔案後，按下 **下載檔案** 儲存原始位元組。若要一併匯出資料夾及其子資料夾，請按下 **下載 ZIP**。ZIP 會保留 UnixFS 的資料夾結構。

## 缺少區塊代表什麼？

CAR 將內容儲存成以 CID 識別的區塊。當封存檔只包含部分內容時，根 CID 可能指向封存檔外的區塊。若項目所需的區塊缺失，請從來源取得完整的封存檔，或下載所需區塊都已包含在內的項目。CAR 也能儲存其他 IPLD 格式的資料。此工具擷取的檔案和資料夾採用 UnixFS 格式。[IPLD CAR 格式規格](https://ipld.io/specs/transport/car/)
