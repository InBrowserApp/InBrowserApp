## BLAKE3 nedir?

BLAKE3, BLAKE2'den türetilmiş modern bir kriptografik hash fonksiyonudur. Güçlü güvenliği korurken çok yüksek performans ve paralellik için tasarlanmıştır. Varsayılan olarak 256 bitlik hash üretir ve genişletilebilir çıktı uzunluğunu (XOF) destekler.

**Temel özellikler:**

- **Genişletilebilir çıktı uzunluğu**: Herhangi bir uzunlukta hash üretebilir
- **Yüksek performans**: Modern CPU'larda hızlı ve paralelleştirilebilir
- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir
- **Çığ etkisi**: Girdideki küçük değişiklikler dramatik şekilde farklı çıktılar üretir
- **Geri döndürülemez**: Hash'i tersine çevirerek orijinal girdiyi bulmak hesaplamalı olarak mümkün değildir
- **Çarpışma dirençli**: Aynı hash'i üreten iki farklı girdi bulmak çok zordur
- **Anahtarlı hash**: MAC işlevi için isteğe bağlı 32 bayt anahtarı destekler
- **Anahtar türetme**: Anahtar malzemesi ve bağlamdan alt anahtarlar türetebilir

**Yaygın kullanımlar:**

- Dosya bütünlüğü doğrulama
- İçerik adresli depolama ve yineleme kaldırma
- Dijital imzalar ve sertifikalar
- Şifre depolama ve kimlik doğrulama
- Kriptografik protokoller ve sistemler
