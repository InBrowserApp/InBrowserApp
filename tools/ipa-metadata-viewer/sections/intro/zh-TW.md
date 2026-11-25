## 開啟 IPA 並檢視主要 App 的中繼資料

拖放 iOS `.ipa` 檔案，或選取**開啟 IPA 檔案**。檢視器會讀取主要 App 的屬性列表，路徑類似 `Payload/Trail Notes.app/Info.plist`。你可以先試用範例 IPA，了解會顯示哪些欄位。解壓縮套件與解析屬性列表都會在瀏覽器中完成。

## 了解套件識別碼、版本與平台

套件識別碼儲存在 `CFBundleIdentifier`，用來識別 App 套件。`CFBundleShortVersionString` 會記錄發行版本，`CFBundleVersion` 則用來識別組建。透過 `MinimumOSVersion` 和 `CFBundleSupportedPlatforms`，可以查看套件記錄的最低系統版本與平台名稱。顯示名稱取自 `CFBundleDisplayName` 或 `CFBundleName`。

## 檢視並匯出 Info.plist

選取 **Info.plist**，即可用易讀的 XML 檢視完整屬性列表，包括總覽中未列出的鍵。檢視器支援二進位和 XML 格式的屬性列表。選取**複製 XML**，可在其他工具中使用易讀版本。選取**下載 Info.plist**，則可儲存原始檔案。畫面顯示的封存路徑指出中繼資料來自哪個 App 套件。

[Apple 資訊屬性列表參考文件](https://developer.apple.com/documentation/bundleresources/information-property-list)
