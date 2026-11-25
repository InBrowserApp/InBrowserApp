## 將二進位 Plist 檔案轉換成 JSON

選取**開啟二進位 Plist**，或拖放 Apple 二進位 `.plist` 檔案。你可以檢視格式化的 JSON，複製內容，或下載為 `.json` 檔案。二進位屬性列表以 `bplist00` 開頭，常見於 Apple App 套件、偏好設定和封存資料。試用範例即可了解屬性列表的值如何在 JSON 中呈現。

## 將 JSON 轉換成 Apple 二進位屬性列表

選取 **JSON 轉 Plist**，貼上 JSON 或開啟 `.json` 檔案，再選取**轉換成二進位 Plist**，即可下載產生的 `.plist` 檔案。字串、布林值、數字、陣列和物件會轉換成對應的屬性列表型別。請將 `null` 換成其他值，或省略對應的鍵。檔案和貼上的文字都會在瀏覽器中處理。

## 保留日期、位元組資料及大型整數

JSON 沒有日期、位元組資料或鍵式封存 UID 的原生型別。轉換器會加入明確的 `$plist` 標籤，讓這些值在雙向轉換時保留原意。

| Plist 值                   | JSON 範例                                              |
| -------------------------- | ------------------------------------------------------ |
| UTC 日期                   | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Base64 編碼的位元組資料    | `{"$plist":"data","value":"AQID"}`                     |
| 以十進位文字表示的大型整數 | `{"$plist":"integer","value":"9007199254740993"}`      |
| 鍵式封存 UID               | `{"$plist":"uid","value":42}`                          |
| 數值較大的實數             | `{"$plist":"real","value":"1e+100"}`                   |

轉回 Plist 時，請保留這些標籤。超出 JSON 安全整數範圍的值須使用整數標籤，並將十進位值放在引號內。若字典的結構與標籤相同，會以 `dictionary` 標籤包住字典，以保留其中的鍵。轉換會保留資料結構和支援的值。Plist 物件的順序、值為整數的實數（例如 `1.0`）的數值型別和原始二進位資料可能會改變。

[Apple 屬性列表的結構和型別](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)
