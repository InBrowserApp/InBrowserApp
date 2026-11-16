## SHA-512/256 (FIPS 180-4) Nedir?

SHA-512/256 (FIPS 180-4), genellikle 64 karakterlik onaltılık bir dize olarak gösterilen 256 bitlik (32 baytlık) bir özet üreten SHA-2 kriptografik özet işlevidir. Farklı başlangıç değerleri ve kısaltılmış bir çıktıyla SHA-512'yi temel alır; SHA-512'nin iç yapısını korurken daha kısa bir özet sağlar.

**Temel özellikleri:**

- **Belirlenimlidir**: Aynı girdi her zaman aynı özeti üretir
- **Hızlı hesaplanır**: Herhangi bir girdi için hızla hesaplanabilir
- **Çığ etkisi**: Girdideki küçük değişiklikler çok farklı çıktılar üretir
- **Geri döndürülemez**: Özeti tersine çevirerek özgün girdiyi bulmak hesaplama açısından uygulanabilir değildir
- **Çakışmaya dayanıklıdır**: Aynı özeti üreten iki farklı girdi bulmak çok zordur

**Yaygın kullanım alanları:**

- Dijital imzalar ve sertifikalar
- Bütünlük denetimleri ve sağlama toplamları
- HMAC yapıları
- Dosya doğrulama ve veri işleme akışları
- 256 bitlik özetler gerektiren protokoller
