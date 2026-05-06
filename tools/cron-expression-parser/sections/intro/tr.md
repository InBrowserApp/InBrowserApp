## Cron Zamanlamalarını Devreye Almadan Önce Anlayın

Cron ifadeleri kısadır, ancak küçük bir alan hatası bir işin amaçlanandan çok daha sık ya da çok daha seyrek çalışmasına neden olabilir. Bu ayrıştırıcı ifadeyi tarayıcınızda doğrular, zamanlamayı sade bir dille açıklar, her alanı parçalar ve yaklaşan çalıştırma zamanlarını önizler.

### Ne Zaman Kullanılır

- Bir sunucuya, CI sistemine veya görev çalıştırıcıya eklemeden önce dağıtım, yedekleme, temizlik ya da bildirim zamanlamasını kontrol edin.
- Kopyaladığınız bir cron ifadesini gerçekten beklediğiniz zamanlamayla karşılaştırın.
- Bir seferde tek alanı değiştirip açıklamanın güncellenmesini izleyerek cron sözdizimini öğretin veya hatalarını ayıklayın.

### Desteklenen Biçim

Bu araç standart beş alanlı Unix cron ifadelerini destekler: dakika, saat, ayın günü, ay ve haftanın günü. Ayrıca saniye düzeyinde hassasiyeti destekleyen zamanlayıcılar için başında saniye bulunan altı alanlı bir ifadeyi de kabul eder.

### Sonucu Okuma

Özet sade dilli bir açıklama verir; alan tablosu ise ham ifadenin nasıl bölündüğünü gösterir. Yaklaşan çalıştırma zamanları tarayıcınızın yerel saat dilimini kullanır, bu nedenle bunları işi çalıştıracak zamanlayıcının kullandığı saat dilimiyle karşılaştırın.

### Notlar

- Haftanın günü değerlerinde Pazar için genellikle `0` veya `7` kullanılır; `MON` ya da `FRI` gibi adlar da kabul edilir.
- `JAN` veya `DEC` gibi ay adları üretim zamanlamalarını gözden geçirmeyi kolaylaştırabilir.
- Zamanlayıcınız farklı bir cron lehçesi kullanıyorsa `?`, `L`, `W` veya `#` gibi özel belirteçleri o zamanlayıcının kendi belgelerinde doğrulayın.
