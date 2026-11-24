## 為 IPFS 產生 DNSLink TXT 記錄

DNSLink 可將網域或子網域指向內容路徑。輸入網域，再貼上 IPFS CID、IPFS 路徑或 IPNS 路徑。在 DNS 服務商的管理介面新增 TXT 記錄，填入產生的 **名稱** 和 **TXT 值**。例如，`www.example.com` 的記錄名稱是 `_dnslink.www.example.com`。如果 DNS 編輯介面會自動加上 `example.com`，在名稱欄位輸入 `_dnslink.www` 即可。

## 檢查 DNSLink 指向何處

按下 **檢查已發布的記錄**，查看 Cloudflare 和 Google 的 TXT 查詢結果。將目標留空可查詢現有設定，輸入預期目標則可比對已發布的值。變更記錄後，在快取到期前，解析器可能仍會傳回舊值。顯示的 TTL 代表這筆 DNS 回應還可在快取中保留多久。

## 更新自訂網域下的 IPFS 網站

使用 IPFS CID 可直接指向檔案的固定版本，也可以使用 IPNS 路徑指向可更新的名稱。DNSLink 告訴支援它的用戶端和閘道應解析哪些內容。若要透過自己的 HTTPS 網域提供這些內容，請設定支援 DNSLink 的閘道，再將網域指向該閘道。[IPFS 自訂網域與 DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
