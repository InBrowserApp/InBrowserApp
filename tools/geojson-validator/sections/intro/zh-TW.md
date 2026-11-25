## 如何檢查 GeoJSON 檔案

開啟 .geojson 或 .json 檔案，或貼上 GeoJSON 文件並選擇 **驗證 GeoJSON**。使用 **試用範例** 可查看有效的 FeatureCollection。您可以編輯輸入內容並再次檢查。檔案與貼上的文字都保留在瀏覽器中。

## 驗證器會檢查什麼

工具會先檢查 JSON 語法，再檢查 GeoJSON 結構，包括 FeatureCollection、Feature、GeometryCollection 和各種幾何圖形類型。位置依 WGS 84 經度、緯度的順序排列。驗證器會檢查座標範圍、線與環的位置最少數量、環是否閉合、圖徵屬性和邊界框結構。空的圖徵集合和 null 圖徵幾何圖形都是有效的。

## 找出並修正問題

像 `$.features[0].geometry.coordinates` 這樣的錯誤路徑會指向第一個圖徵的座標。從指定欄位開始，修正後再次驗證。結果描述的是檔案結構。幾何拓樸問題（例如自相交或重疊）需要另行進行 GIS 檢查。如需直觀查看有效結果，請在 [GeoJSON 檢視器](../geojson-viewer/)中開啟。
