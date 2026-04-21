## 什麼是使用者代理？

User-Agent（UA）字串用於識別發出請求的瀏覽器或應用程式，通常包含瀏覽器、作業系統、裝置與引擎資訊。由於 UA 可被偽造，應視為參考而非安全依據。

### 這個解析器會顯示什麼

這個工具會在你的瀏覽器中本機解析貼上的 UA 字串，並依瀏覽器、作業系統、引擎、裝置、CPU 和 JSON 輸出分組顯示結果。不會上傳任何內容。

### 範例

可以貼上像下面這樣常見的 Windows 上 Chrome 字串：

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

解析結果應該會辨識出 Windows 10 上的 Chrome 115，以及 Blink 引擎和 amd64 CPU 架構。

### 重要提示

現代瀏覽器越來越依賴 Client Hints，因此單獨複製出的 UA 字串不一定能反映網站在真實請求中看到的全部資訊。
