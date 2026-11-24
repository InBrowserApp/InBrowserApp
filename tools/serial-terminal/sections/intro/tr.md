## Tarayıcıdaki seri terminal nasıl kullanılır?

Arduino, ESP32, Raspberry Pi Pico veya USB seri adaptörünüzü bir veri kablosuyla bağlayın. Cihazın kullandığı baud hızını (örneğin 9600 veya 115200) ayarlayın, ardından **Bağlan** seçeneğine tıklayın ve tarayıcıda cihazın bağlantı noktasını seçin. Bu seri monitör 8 veri biti, eşlik biti olmadan, bir durdurma biti ve akış denetimi olmadan çalışır (8N1).

## Metin ve onaltılık bayt gönderme

Metin UTF-8 olarak gönderilir. Cihazınız komutları göndermek için satır sonu kullanıyorsa LF, CR veya CR + LF seçin. İkili komutlar için **Onaltılık** seçeneğini seçin ve `41 54 0D 0A` gibi tam baytlar girin. Onaltılık biçimde baytlar girildiği gibi, otomatik satır sonu eklenmeden gönderilir.

## Seri günlükleri okuma ve kaydetme

Günlük, gelen (RX) ve giden (TX) verileri zaman damgalarıyla gösterir. Metin bozuk görünüyorsa baytları ayrı ayrı incelemek için Onaltılık biçimine geçin. Veri gelmeye devam ederken önceki bir kaydı incelemek için kaydırmayı duraklatın veya saklanan günlüğü bir metin dosyası olarak indirin. Seri veriler, siz kaydetmeyi seçene kadar bu sekmede kalır.

## Cihazıma neden bağlanamıyorum?

Web Serial destekleyen güncel bir tarayıcı kullanın ve işletim sisteminin seri bağlantı noktasını tanıdığından emin olun. Başka bir kablo deneyin ve bağlantı noktasını kullanan diğer seri monitörleri kapatın. Cihaz bağlanıyor ancak okunamayan metin üretiyorsa baud hızını kontrol edin ve baytları Onaltılık biçiminde görüntülemeyi deneyin.
