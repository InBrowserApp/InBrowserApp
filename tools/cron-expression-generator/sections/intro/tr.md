## Cron Zamanlamalarını Görsel Olarak Oluşturun

Cron ifadeleri kompakttır, ancak yanlış alandaki küçük bir değişiklik bir işi "hafta içi sabahları" zamanlamasından "her dakika" zamanlamasına taşıyabilir. Bu oluşturucu, her söz dizimi kuralını ezberlemeden standart beş alanlı bir ifade oluşturabilmeniz için her alana kendi kontrollerini sağlar.

### Ne Zaman İşe Yarar

- CI işleri, yedeklemeler, önbellek ısıtma görevleri, raporlar ve diğer yinelenen görevler için zamanlamalar oluşturun.
- Bilinen bir ön ayardan başlayın ve her seferinde bir alanı ince ayarlayın.
- İfadeyi bir zamanlayıcıya yapıştırmadan önce yaklaşan yerel çalıştırma zamanlarını önizleyin.

### Nasıl Kullanılır

1. Hızlı bir ön ayar seçin veya varsayılan ifadeyi koruyup her alanı elle düzenleyin.
2. Her alanın her değerde, belirli aralıklarla, belirli değerlerde veya bir aralıkta çalışıp çalışmayacağını seçin.
3. Oluşturulan ifadeyi ve sonraki çalıştırma önizlemesini gözden geçirin, ardından zamanlayıcınıza kopyalayın.

### Notlar

- Bu araç standart beş alanlı cron üretir: dakika, saat, ayın günü, ay ve haftanın günü.
- Pazar `0` olarak gösterilir; bu, yaygın Unix tarzı cron zamanlayıcıları tarafından kabul edilir.
- Hem ayın günü hem de haftanın günü sınırlandırıldığında birçok cron uygulaması alanlardan biri eşleştiğinde çalışır. Bazı sistemler farklı davranır, bu yüzden bu birleşimi hedef zamanlayıcınızda doğrulayın.
