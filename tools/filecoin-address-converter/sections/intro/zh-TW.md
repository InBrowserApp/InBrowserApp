## 將 Filecoin f410 位址轉成 0x

貼上 `f410` 或 `t410` 位址，再按下 **轉換位址**。工具會驗證 Filecoin 的總和檢查碼，並顯示符合 EIP-55 總和檢查碼的以太坊格式 `0x` 位址。如果錢包或區塊瀏覽器在 Filecoin 上使用以太坊格式的位址，可以複製這個結果。按下 **試用範例** 就能看到轉換結果，無須輸入自己的位址。

## 將 0x 位址轉成 Filecoin 位址

貼上含 40 個十六進位字元的 `0x` 位址。選擇 **主網** 可取得 `f410` 位址，選擇 **測試網** 可取得 `t410` 位址。Calibration 與其他 Filecoin 測試網使用相同的 `t410` 前綴。`0x` 格式沒有網路前綴，同一組位元組可以使用任一 Filecoin 前綴表示。請選擇錢包、區塊瀏覽器或交易所使用的網路。十六進位字元可全為小寫或全為大寫，混合大小寫則須通過 EIP-55 檢查。

## f410 和 t410 是什麼？

這兩種委派位址由 Filecoin 以太坊虛擬機（FEVM）使用。在所選 Filecoin 網路上，`f410` 或 `t410` 位址及其對應的 `0x` 形式代表同一個 20 位元組位址。Filecoin 原生格式使用 Base32 和自己的總和檢查碼。轉換只改變位址的表示方式，底層位元組保持不變，也不會在不同網路之間轉移 FIL。

## 可以轉換 f0、f1、f2 或 f3 位址嗎？

此工具轉換命名空間 `10` 中的 FEVM 委派位址，這些位址以 `f410` 或 `t410` 為前綴。Actor ID 位址、其遮罩表示法 `0xff0000…` 以及其他 Filecoin 位址類型不在支援範圍內。將部分原生位址映射至 Actor 時，需要查詢鏈上狀態。這項轉換會在瀏覽器中完成，無須呼叫 RPC 或連接錢包。

請參閱 [Filecoin 位址類型與轉帳指南](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md)和 [EIP-55 總和檢查碼規格](https://eips.ethereum.org/EIPS/eip-55)。
