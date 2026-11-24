## HAR dosyası nasıl temizlenir?

HAR (HTTP Archive) dosyaları, tarayıcının ağ isteklerini ve yanıtlarını kaydeder. Oturum çerezleri, yetkilendirme belirteçleri, URL’ler ve özel bilgiler içeren mesajlar barındırabilir. Bu araçla destek talebine veya hata raporuna eklemek ya da ekip arkadaşınıza göndermek için temizlenmiş bir kopya oluşturun. Her isteğin yöntemi, durum kodu ve zamanlama bilgileri korunur.

1. Tarayıcınızın geliştirici araçlarını açın ve **Ağ** paneline gidin. Sorunu yeniden oluşturun, ardından günlüğü bir HAR dosyası olarak dışa aktarın. Chrome’da, standart kimlik doğrulama üstbilgilerinin çıkarıldığı bir kopya için **Export HAR (sanitized)** seçeneğini kullanın.
2. Dışa aktardığınız HAR dosyasını burada açın veya bu sayfaya sürükleyip bırakın. Araç, dosyayı seçtiğiniz anda bir kopya hazırlar. Örnek kayıtta nelerin değiştiğini görmek için örneği deneyin.
3. Değişiklik sayılarını inceleyin ve **Temizlenmiş HAR dosyasını indir** seçeneğine tıklayın. Yeni dosya `.sanitized.har` ile biter ve geliştirici araçlarına aktarılabilir veya [HAR Ağ Analizörü](/tr/tools/har-analyzer/) ile açılabilir. İşleme tarayıcınızda gerçekleşir.

## Hangi veriler kaldırılır veya maskelenir?

Çerezler ve `Authorization` ile `X-API-Key` gibi yaygın kimlik doğrulama üstbilgileri kaldırılır. Araç varsayılan olarak URL parametrelerinin değerlerini maskeler ve isteklerin, yanıtların ve kaydedilmiş WebSocket mesajlarının içeriğini kaldırır. Örneğin, `?token=example&page=2` dışa aktarılan dosyada `?token=REDACTED&page=REDACTED` olur. Hata ayıklama için parametre adları korunur. Aynı değer birden fazla alanda yer alsa bile değişen her alan ayrı ayrı sayılır.

Sorunu yeniden oluşturmak için özgün parametre değerlerine veya mesaj içeriklerine ihtiyacınız varsa ilgili seçeneği kapatın. Ana makine adları, URL yolları, diğer üstbilgiler ve tarayıcıya özgü meta veriler hâlâ özel bilgiler içerebilir. Dosyayı paylaşmadan önce bu alanları gözden geçirin.
