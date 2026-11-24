## 計算 CAR 封存檔或檔案的 Piece CID

選擇你要傳送給 Filecoin 儲存供應商的原始檔案。按下 **計算 Piece CID**，再複製工作流程所需的識別碼。工具也會以位元組顯示填補後的 Piece 大小。瀏覽器會在本機讀取檔案並分段處理，檔案內容會留在你的裝置上。

## 該使用哪一種格式？

**Piece CID（v2）** 遵循 [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md)。它通常以 `bafkzci` 開頭，並包含較新的 Filecoin 工具所需的酬載大小資訊。**舊版 CommP（v1）** 通常以 `baga6ea4` 開頭，適用於傳統的 Filecoin 儲存交易。如果流程需要舊版 Piece CID 和填補後的 Piece 大小，請複製舊版承諾值，並使用旁邊顯示的大小。你可以將任一格式貼到比對欄位，核對檔案是否與現有的承諾值相符。

## 為什麼 IPFS CID 看起來不一樣？

IPFS 根 CID 用來識別區塊，或檔案、目錄的根。Filecoin Piece CID 根據儲存酬載的確切位元組，依 Filecoin 的規則填補並計算雜湊後得出。如果酬載是 CAR 封存檔，請用封存檔本身計算承諾值。兩個 CAR 封存檔即使有相同的 IPFS 根 CID，也可能以不同順序儲存區塊，因此得到不同的 Piece CID。提交儲存交易時，請使用先前計算過的同一份檔案。

格式和填補規則請見 [Filecoin Piece 規格](https://spec.filecoin.io/systems/filecoin_files/piece/)。
