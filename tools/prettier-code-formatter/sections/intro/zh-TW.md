## Prettier 程式碼格式化器是什麼？

Prettier 程式碼格式化器會直接在你的瀏覽器中執行官方 Prettier
standalone 流程，讓你可以在不把程式碼送到伺服器的情況下整理原始檔。
它適合需要快速整理格式、想比較不同列印設定，或想立刻複製或下載乾淨檔案的情境。

## 支援格式

這次重寫把工具聚焦在 Prettier 已經能在瀏覽器中穩定處理的格式：JavaScript、TypeScript、Flow、JSON、HTML、CSS、SCSS、Less、Markdown、MDX、YAML、GraphQL，以及
Vue、Handlebars 這類相關模板格式。語言選擇器會決定使用哪個 parser，而匯入檔案時只要副檔名可辨識，就會自動偵測 parser。

## 這次重寫怎麼運作

這次重寫把重型格式化邏輯留在主 UI 路徑之外。格式化請求會先由純工具設定組成，再交給延遲載入的 worker
版本 Prettier 流程執行，讓一般輸入維持流暢。大型輸入會暫停自動格式化，並改成明確的 `立即格式化` 動作，這比每次按鍵都重新格式化整份大檔案更可預期。
