## 開啟 APK 並檢視應用程式資訊清單

拖放 Android `.apk` 檔案，或選取**開啟 APK 或資訊清單**。檢視器會開啟套件中的 `AndroidManifest.xml`，包括大多數 APK 使用的編譯後二進位 XML。你也可以開啟已擷取的二進位或純文字資訊清單。試用範例 APK，即可查看總覽及解碼後的 XML。檔案會留在瀏覽器中處理。

## 了解套件、版本和 SDK 欄位

**套件名稱**用來識別 Android 應用程式。版本名稱是顯示給使用者的版本標籤，版本代碼則是 Android 用於判斷更新順序的數字。最低 SDK 是資訊清單宣告的最低 Android API 級別，目標 SDK 則是應用程式指定的 API 級別。資訊清單中省略的欄位會顯示為「未指定」。

## 檢視權限並匯出 AndroidManifest.xml

總覽會列出套件宣告的權限名稱。裝置上實際授予哪些權限，由 Android 依作業系統版本、應用程式設定及使用者選擇決定。開啟**資訊清單 XML**，即可檢視元件、意圖篩選器和帶有條件的權限宣告。選取**複製 XML** 或**下載 XML**，即可保留解碼後的檔案。對已編譯資源的參照可能會顯示為 `@0x7f010001` 之類的 ID。

[Android 資訊清單的結構與元素](https://developer.android.com/guide/topics/manifest/manifest-intro)
