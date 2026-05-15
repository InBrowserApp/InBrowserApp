Hash araçları koleksiyonu, taşınan hash yardımcı araçlarını bir araya getirir; böylece belirli bir aracı açmadan önce doğru algoritmayı seçebilirsiniz. Günlük dosya özetlerini, eski sistem uyumluluk kontrollerini, anahtarlı ileti kimlik doğrulamasını, Subresource Integrity dizelerini, parola hashlemeyi, parola doğrulamayı ve hızlı kriptografik olmayan checksum'ları kapsar.

## When to use these tools

Metin veya dosya için tekrarlanabilir bir parmak izine ihtiyacınız olduğunda, örneğin indirilen bir arşivi yayımlanmış SHA-256 checksum değeriyle karşılaştırırken, kriptografik özet araçlarını kullanın. Sonucun, paylaşılan gizli anahtara sahip birinin iletiyi oluşturduğunu veya onayladığını kanıtlaması gerekiyorsa HMAC kullanın. Ham hızdan çok yapılandırılabilir maliyetin önemli olduğu parola ve anahtar türetme iş akışlarında Argon2, bcrypt, PBKDF2 veya scrypt kullanın.

## Choosing safely

Her hash güvenlik için uygun değildir. MD4, MD5 ve SHA-1 eski sistemler ve uyumluluk kontrolleri için kullanışlıdır, ancak güvenliğe duyarlı yeni bütünlük tasarımlarında kullanılmamalıdır. CRC, Adler-32, MurmurHash, CityHash ve xxHash hızlı checksum veya gruplama hashleridir; kurcalamaya dayanıklı imzalar değildir. Emin değilseniz genel checksum'lar için SHA-256, anahtarlı doğrulama için HMAC-SHA-256 ve parola saklama için Argon2id veya bcrypt tercih edin.

## Privacy and workflow

Bu koleksiyondaki tek tek araçlar tarayıcıda çalışır. Metinler ve dosyalar, seçilen araç tarafından yerel olarak işlenir; bunun tek istisnası aracın açıkça herkese açık arama davranışı belgelediği durumlardır, hash araçlarında buna gerek yoktur. Hassas materyaller için oluşturulan değerleri kullanımdan sonra temizleyin ve gizli bilgileri paylaşılan veya kaydedilen tarayıcı oturumlarına yapıştırmaktan kaçının.
