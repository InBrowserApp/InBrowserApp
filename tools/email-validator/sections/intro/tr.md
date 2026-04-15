## E-posta doğrulaması nedir?

E-posta doğrulaması, bir adresin yerel bölüm, `@` işareti, alan adı etiketleri ve üst düzey alan adı için yaygın söz dizimi kurallarına uyup uymadığını kontrol eder. Form testi, örnek verileri temizleme ve göndermeden önce bariz yazım hatalarını yakalama için kullanışlıdır.

### Bu doğrulayıcı neyi kontrol eder

- Yerel bölümü ve alan adını ayıran tek bir `@`
- Tüm adres, yerel bölüm ve alan adı için uzunluk sınırları
- İzin verilen karakterler, nokta yerleşimi, tire kuralları ve TLD yapısı
- Karşılaştırma için alan adını küçük harfe çeviren normalleştirilmiş sonuç

### Örnekler

- Geçerli: `name@example.com`
- Geçerli: `first.last+news@example.co.uk`
- Geçersiz: `name..dots@example.com`
- Geçersiz: `user@-example.com`

Uluslararası alan adları, `user@xn--bcher-kva.example` gibi Punycode ASCII biçiminde girilmelidir.

### Bu aracın kontrol etmediği şeyler

- Posta kutusunun gerçekten var olup olmadığı veya e-posta alıp alamadığı
- DNS, MX, SMTP veya geçici e-posta sağlayıcısı kontrolleri
- Bir sitenin adresi kendi iş kurallarına göre kabul edip etmeyeceği
