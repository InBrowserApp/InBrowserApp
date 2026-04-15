## PBKDF2 nedir?

PBKDF2 (Password-Based Key Derivation Function 2), tuz ve çok sayıda yineleme kullanarak paroladan kriptografik anahtar türetir. Kaba kuvvet saldırılarını yavaşlatır ve tuz değiştiğinde farklı anahtarlar üretir.

**Temel noktalar:**

- Seçilen bir hash (SHA-1/SHA-256 vb.) ile HMAC kullanır
- Daha fazla yineleme daha yüksek hesaplama maliyeti demektir
- Çıktı uzunluğu yapılandırılabilir

**En iyi uygulamalar:**

- Benzersiz ve rastgele bir tuz kullanın
- Kabul edilebilir performans içinde yinelemeyi artırın
- Yeni sistemler için Argon2 veya scrypt düşünün
