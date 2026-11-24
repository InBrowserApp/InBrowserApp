## ICS takvim etkinliklerini CSV olarak dışa aktarma

**ICS’den CSV’ye** seçeneğini seçin. iCalendar dosyasını açın veya içeriğini yapıştırın ve **Dönüştür** düğmesine basın. Tabloda her etkinlik kaydı için bir satır yer alır. Satırda başlık, başlangıç, bitiş, konum, açıklama ve varsa tekrarlama kuralı bulunur. Excel veya Google E-Tablolar’da incelemek ya da düzenlemek için CSV dosyasını indirin. Tüm gün süren etkinliklerde saat belirtilmez ve bitiş tarihi etkinliğe dahil değildir. Örneğin, 12 Mayıs’ı kapsayan bir etkinliğin bitiş tarihi 13 Mayıs’tır.

## CSV satırlarından ICS dosyası oluşturma

**CSV’den ICS’ye** seçeneğini seçin ve sütun adlarını görmek için **Örnek dene** düğmesini kullanın. En azından `Title` ve `Start` sütunlarını ekleyin. Tüm gün süren bir etkinlik için `2026-05-12`, yerel saat için `2026-05-12T09:00:00` veya UTC için `2026-05-12T09:00:00Z` yazın. Araç, Google Takvim’in `Subject`, `Start Date`, `Start Time` ve `All Day Event` gibi başlıklarını da tanır. Etkinlikleri takviminize aktarmak için ICS dosyasını indirin.

## Tam yedek için orijinal takvimi saklama

CSV, etkinlik bilgilerini satırlarda saklar. Tekrarlanan etkinlikler için her tekrarın tarihi ayrı ayrı oluşturulmaz. Bunun yerine tekrarlama kuralı yazılır. Dosyaya gömülü saat dilimi tanımları korunur. Ekler, hatırlatıcılar, katılımcılar, tekrar istisnaları ve iptal durumu orijinal takvimde kalır. Dönüştürme işlemi tarayıcınızda yapılır.
