## 在 Unicode 網域與 Punycode 之間轉換

將 `bücher.com` 之類的網域貼到 **Unicode 網域**，就會在 **ASCII 網域** 得到 `xn--bcher-kva.com`。將 `xn--` 網域貼到 **ASCII 網域**，則可查看 Unicode 寫法。輸入時，另一個欄位會即時更新，兩種格式都可複製。

## 何時使用哪一種格式

Punycode 使用 ASCII 字母、數字和連字號，表示國際化網域名稱（IDN）中的非 ASCII 字元。經過轉換的網域標籤以 `xn--` 開頭，`com` 等原本就是 ASCII 的標籤維持原樣。若 DNS 或主機代管設定要求 ASCII，請使用 ASCII 版本。要讀取記錄檔或設定檔裡的網域名稱時，可以轉成 Unicode。

## 轉換時要貼上什麼

只需要輸入主機名稱。例如，若網址是 `https://bücher.com/catalog`，貼上 `bücher.com` 即可。工具也支援子網域，例如 `www.bücher.com` 會轉成 `www.xn--bcher-kva.com`。
