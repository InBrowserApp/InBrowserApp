## 依交易 ID 查詢 Filecoin 儲存交易

輸入 Filecoin 主網 Storage Market 的 **交易 ID**（數字），再按下 **查詢交易**。按下 **試用範例** 可載入真實的公開記錄，查看狀態、儲存供應商、客戶、日期及 Piece CID。這裡查詢的是 Storage Market 交易。Filecoin Onchain Cloud 使用獨立的資料集 ID。

## 如何解讀 Filecoin 交易狀態

已啟用表示鏈上已記錄啟用，且尚未到預定結束時間。待啟用表示交易在預定開始紀元結束前仍可啟用。工具也會顯示已過開始時間但尚未啟用、已到期，或市場狀態記錄了罰沒的情況。起訖紀元來自交易提案，工具會依照鏈上的紀元排程換算成 UTC 日期。

## 將交易的 Piece CID 與本機檔案比對

Piece CID 是交易中記錄的 Filecoin Piece 承諾值。複製這個值，再使用 Filecoin Piece CID 計算器計算本機檔案或 CAR 的承諾值，以便比對。結果也會顯示依 Filecoin 規則填補後的 Piece 大小。已驗證的交易帶有 Filecoin Plus 驗證標記。

## 查找較早的 Filecoin 交易

瀏覽器會先查詢 Filecoin 主網目前的市場狀態。若記錄已離開目前的市場狀態，工具可顯示 Filfox 收錄的原始交易條款，並標示為歷史記錄。條款包含預定起訖日期和交易各方。按下 **在 Filfox 檢視** 可在區塊瀏覽器開啟同一個交易 ID。

如需了解鏈上傳回的欄位，請參閱 [Filecoin Storage Market RPC 參考文件](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal)。
