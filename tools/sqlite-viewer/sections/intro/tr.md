## SQLite dosyalarını yerel olarak inceleyin

Tabloları ve görünümleri gezmek, sütun tanımlarını, dizinleri, yabancı anahtarları ve CREATE ifadelerini incelemek veya salt okunur bir SQL sorgusu çalıştırmak için bir SQLite 3 veritabanı açın. Dosya seçmeden çalışma alanını keşfetmek için örnek veritabanını deneyin. Dosyalar ve sorgular tarayıcınızda kalır ve otomatik kaydedilmez.

## Sorgulayın ve sonuçları dışa aktarın

Satırlarını önizlemek için bir tablo seçin. SQL'i düzenleyin ve tek bir SELECT, WITH veya EXPLAIN ifadesi çalıştırmak için **Sorguyu çalıştır** düğmesini ya da **Ctrl/⌘ + Enter** kısayolunu kullanın. Sonuç sınırı yüklenen satır sayısını belirler; her sayfada 50 satır gösterilir. Bir sorgu, 5 MiB sonuç boyutu sınırına ulaştığında veya 10 saniye sonra da durabilir. İptal işlemi arayüzün yanıt vermesini sağlar ve sonraki sorguda veritabanı anlık görüntüsünü yeniden yükler.

CSV ve JSON dışa aktarmaları, diğer sayfalardaki satırlar da dahil olmak üzere yüklenmiş sonucu içerir. JSON, yinelenen adları ve NULL değerlerini koruyarak sütun adlarını ve satır dizilerini ayrı saklar. SQLite tam sayıları tam doğruluklu ondalık dizgelere, BLOB'lar ise `$blob` onaltılık değerine sahip nesnelere dönüşür. CSV, NULL için boş alanlar kullanır, özel karakterleri tırnak içine alır ve elektronik tablolarda daha güvenli kullanım için formüle benzeyen metinlerin başına kesme işareti ekler.

## Desteklenen veritabanları ve sınırlar

En fazla 50 MiB boyutunda, şifrelenmemiş bir `.db`, `.sqlite` veya `.sqlite3` dosyası açın. Özgün dosya hiçbir zaman değiştirilmez. Bu araç bellekte bir anlık görüntü yüklediğinden bellek kullanımı dosya boyutunu aşabilir. WAL ve günlük ek dosyaları içe aktarılmaz; burada açmadan önce veritabanı uygulamanızla kontrol noktası işlemi tamamlanmış temiz bir kopya oluşturun. Şifreli veritabanları, özel SQLite uzantıları ve veritabanı düzenleme desteklenmez.
