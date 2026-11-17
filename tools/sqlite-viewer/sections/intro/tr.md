## SQLite veritabanlarını tarayıcınızda keşfedin

Tabloları ve görünümleri gezmek, sütunları, dizinleri, yabancı anahtarları ve CREATE ifadelerini incelemek veya salt okunur bir SQL sorgusu çalıştırmak için bir SQLite 3 veritabanı açın. Çalışma alanını keşfetmek için örnek veritabanını deneyin. Dosyanız yerel olarak işlenir ve hiçbir zaman değiştirilmez.

## Sorgulayın ve sonuçları dışa aktarın

Satırlarını yüklemek için bir tablo veya görünüm seçin, ardından verileri filtrelemek, sıralamak veya birleştirmek için SQL'i düzenleyin. **Sorguyu çalıştır** düğmesiyle veya **Ctrl/⌘ + Enter** kısayoluyla tek bir SELECT, WITH veya EXPLAIN ifadesi çalıştırın. Bir hücreye tıklayarak değerinin tamamını inceleyebilir ve kopyalayabilirsiniz.

100, 1.000 veya 10.000 satırlık bir sonuç sınırı seçin ve sonuçları her sayfada 50 satır olacak şekilde gezin. Sorguların süre sınırı 10 saniye, sonuç boyutu sınırı ise 5 MiB'dir. CSV ve JSON dışa aktarmaları, tüm sayfalardaki yüklenmiş satırları içerir.

JSON, yinelenen adları ve NULL değerlerini korumak için sütun adlarını ve satır dizilerini ayrı saklar. Tam sayılar tam doğruluklu ondalık dizgelerdir ve BLOB'lar bir `$blob` onaltılık değeri içerir. CSV bir başlık satırı içerir, NULL için boş alanlar kullanır ve formüle benzeyen metinlerin başına kesme işareti ekler.

## Desteklenen SQLite dosyaları

En fazla 50 MiB boyutunda, şifrelenmemiş bir `.db`, `.sqlite` veya `.sqlite3` dosyası açın. WAL kullanan bir veritabanını açmadan önce kontrol noktası işlemi tamamlanmış bir kopyasını oluşturun; WAL ve günlük ek dosyaları yüklenmez. Özel SQLite uzantıları desteklenmez. Dosyalar ve sorgular otomatik kaydedilmez.
