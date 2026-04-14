## HMAC nedir?

HMAC (Hash Tabanlı Mesaj Kimlik Doğrulama Kodu), bir mesajın hem veri bütünlüğünü hem de özgünlüğünü doğrulamak için gizli bir anahtarı bir hash fonksiyonu ile birleştiren kriptografik bir mekanizmadır.

**Nasıl çalışır:**

1. Gizli anahtar mesajla birleştirilir
2. Bir hash fonksiyonu (SHA-256 gibi) birleştirilmiş verileri işler
3. Sonuç, sabit boyutlu bir kimlik doğrulama kodudur

**Yaygın kullanım durumları:**

- **API Kimlik Doğrulaması**: Göndereni doğrulamak için API isteklerini imzalama
- **JWT Token'ları**: HS256/HS384/HS512 algoritmalarında kullanılır
- **Mesaj Doğrulama**: Verilerin kurcalanmadığından emin olma
- **Webhook İmzaları**: Webhook yüklerini doğrulama

**Güvenlik notları:**

- Her zaman güçlü, rastgele bir gizli anahtar kullanın
- Gizli anahtarınızı gizli tutun
- Yeni uygulamalar için SHA-256 veya üzeri önerilir
- SHA-1 zayıf kabul edilir ve güvenlik açısından kritik kullanımlar için kaçınılmalıdır
