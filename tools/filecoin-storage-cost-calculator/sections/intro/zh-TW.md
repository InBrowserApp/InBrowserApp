## 估算 Filecoin Onchain Cloud 儲存費用

輸入資料大小、**保留期限（天）**和**複本數量**。計算器會依 Filecoin Warm Storage Service 的費率，估算為每份複本建立及儲存一個新資料集的費用。結果包含每月儲存與證明費用、所選期限內的支出，以及建立資料集和新增 Piece 的費用。金額以 USDFC 計算。Filecoin 以 30 天為一個計費月。

## 儲存費用如何估算？

每個使用中的資料集都要按資料大小支付儲存費，另加固定的資料持有證明（PDP）費用。例如，每 TiB 的儲存費為 2.50 USDFC、每份複本的證明費為 0.12 USDFC 時，儲存 1 TiB 資料的兩份複本，每 30 天約需 5.24 USDFC。工具依你輸入的資料大小估算。Filecoin 根據承載資料的葉節點確定實際計費大小，每個 Piece 最多可能因此增加 31 位元組。

## 規劃上傳費用和可退還的準備金

展開**上傳詳細資料**，輸入每份複本的 Piece 數量及上傳批次數量。預設以每份複本一個批次估算。將 Piece 數量留空，可依 Synapse SDK 的 63.5 GiB 上傳上限估算所需的最少 Piece 數量，也可以手動輸入實際數量。每份複本都需要支付資料集建立費用，新增 Piece 時另須支付每個批次的基本費用和每個 Piece 的費用。整個生命週期的準備金，是服務預先保留以支付操作費用的餘額。畫面會獨立顯示準備金，服務結算後會解除鎖定未使用的資金。這項估算涵蓋新上傳和所選儲存期限，擷取資料及後續操作另行收費。請參閱 [Synapse SDK 大小限制](https://docs.filecoin.cloud/developer-guides/synapse/#size-constraints)。

## Filecoin 費率的來源

頁面採用結果旁標有日期的參考費率計算。按下**重新取得主網費率**，可透過公開的 Filecoin RPC 讀取 Warm Storage 定價合約。瀏覽器會採用傳回的費率，並顯示費率來源的區塊。即使查詢失敗，仍可使用參考費率計算。

實際計費大小、各帳戶所需資金和完整費用明細，請參閱 [Filecoin 儲存費用指南](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/)。
