## Tarayıcıda bir HID cihazı nasıl bağlanır?

Oyun kumandası, joystick, pedal veya makro tuş takımı gibi desteklenen bir insan arayüz cihazı bağlayın. **Cihaza bağlan** seçeneğini seçin ve WebHID seçim penceresinde cihazı seçin. Görüntüleyici, donanımı tanımlamaya yardımcı olan üretici kimliğini (VID) ve ürün kimliğini (PID) gösterir. HTTPS üzerinden uyumlu bir masaüstü tarayıcısı kullanın.

## HID koleksiyonları ve rapor kimlikleri nasıl okunur?

Kullanım sayfasını, kullanımını ve rapor kimliklerini görmek için bir koleksiyon açın. Kullanım sayfası ilgili işlevleri gruplandırırken kullanım, bu gruptaki bir işlevi tanımlar. Giriş raporları cihazdan gelen verileri taşır, çıkış raporları ana bilgisayarın gönderebileceği verileri açıklar ve özellik raporları cihaza özgü ayarları veya durumu açıklar. Rapor kimliği 0 ise arayüz açık bir rapor kimliği kullanmıyor demektir.

## Değişen giriş baytları nasıl incelenir?

Canlı onaltılık raporları izlerken her seferinde tek bir kontrolü hareket ettirin. Vurgulanan baytlar, aynı rapor kimliğine sahip önceki veri yükündekilerden farklıdır. Rapor kimliği veri yükünden ayrı gösterilir. En son raporları incelemek için kaydı duraklatın veya listeyi temizleyip yeniden başlayın. Düğmeleri, eksenleri ve diğer alanları yorumlamak için cihazın rapor biçimine bakın.

## Cihazım veya bir koleksiyon neden listelenmiyor?

İşletim sisteminin cihazı tanıdığını kontrol edin, ardından seçim penceresini yeniden açın. Tarayıcılar yaygın klavye ve fare koleksiyonlarını korur ve bazı cihazlar raporlarının yalnızca bir bölümünü web'e sunar. Bu görüntüleyici, seçilen cihazdan giriş raporları alır ve verileri bu sekmede saklar. Standart kontroller için [Oyun Kolu Testi](../gamepad-tester/) veya [Klavye Testi](../keyboard-tester/) aracını deneyin.
