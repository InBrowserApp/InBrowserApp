AES şifre çözme, aynı AES anahtar materyaliyle şifrelenmiş veriden düz metni geri getirir. Bu araç, InBrowser.App AES Şifreleyici tarafından üretilen JSON zarfı için tasarlanmıştır. Zarf; algoritmayı, anahtar türetme ayarlarını, salt değerini, IV değerini, şifreli metni ve düz metin meta verilerini birlikte tutarken parola veya ham anahtar ayrı kalır.

Tüm işlemler tarayıcı Web Crypto API ile yerel olarak gerçekleşir. Şifrelenmiş JSON, parola, ham anahtar ve çözülen sonuç yüklenmez.

## Bu Araç Ne Zaman Kullanılır?

Birisi size `inbrowser-aes-v1` JSON zarfı verdiğinde veya eşleşen AES Şifreleyici sayfasıyla daha önce şifrelediğiniz bir notu, token'ı, yapılandırma parçasını ya da dosyayı geri almanız gerektiğinde kullanın.

Zarf bir parolayla oluşturulduysa aynı parolayı girin; araç saklanan PBKDF2 hash değerini, yineleme sayısını, salt değerini, AES modunu ve anahtar uzunluğunu yeniden kullanır. Zarf ham anahtarla oluşturulduysa zarfta kayıtlı tam uzunluktaki onaltılık anahtarı yapıştırın.

## Pratik Notlar

AES-GCM şifrelenmiş verinin kimliğini doğrular; bu yüzden yanlış anahtarlar veya değiştirilmiş JSON, değiştirilmiş düz metin döndürmek yerine başarısız olmalıdır. AES-CBC ve AES-CTR uyumlu zarfların şifresini çözebilir, ancak şifreli metnin kimliğini tek başlarına doğrulamazlar.

Parolayı veya ham anahtarı JSON zarfından ayrı tutun. Hem zarfa hem de anahtar materyaline sahip olan herkes düz metni geri alabilir. Dosya zarflarında, kurtarılan indirme JSON'da saklanan özgün dosya adını ve medya türünü kullanır.
