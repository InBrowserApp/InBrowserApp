## Argon2 doğrulaması nedir?

Argon2 doğrulaması, düz bir parolanın daha önce saklanan kodlanmış Argon2 hash ile aynı sonucu üretip üretmediğini kontrol eder. Kodlanmış hash; Argon2 varyantını, maliyet parametrelerini, salt değerini ve digest değerini içerir. Böylece doğrulayıcı, ayrı ayarlara ihtiyaç duymadan aynı işlemi tekrarlayabilir.

## Bu araç ne zaman kullanılır?

- Kopyalanmış bir parola ile saklanan Argon2 hash değerinin birbirine ait olduğunu doğrulamak
- Parola kayıtlarını sistemler arasında taşırken oturum açma veya geçiş sorunlarını ayıklamak
- Kodlanmış bir Argon2 hash içindeki varyantı ve maliyet parametrelerini incelemek
- Genellikle pepper olarak adlandırılan isteğe bağlı sunucu tarafı secret kullanan hash değerlerini test etmek

## Güvenli doğrulama nasıl yapılır?

1. Kontrol etmek istediğiniz parolayı yapıştırın.
2. `$argon2id$` ile başlayan bir dize gibi tam kodlanmış hash değerini yapıştırın.
3. Secret değerini yalnızca özgün hash onunla oluşturulduysa girin.
4. Doğrulamayı çalıştırın ve eşleşme, eşleşmeme veya geçersiz-hash sonucunu okuyun.

## Güvenlik notları

Doğrulama tarayıcınızda yerel olarak gerçekleşir, ancak yapıştırılan parolalar ve hash değerleri formu sıfırlayana veya sekmeyi kapatana kadar tarayıcı belleğinde kalabilir. Paylaşılan cihazlarda üretim kimlik bilgilerini kullanmaktan kaçının. Yeni parola saklama sistemleri için Argon2id genellikle tercih edilen Argon2 varyantıdır, çünkü yan kanal ve GPU direnci arasında denge sağlar.
