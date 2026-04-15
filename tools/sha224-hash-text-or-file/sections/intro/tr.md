## SHA-224 nedir?

SHA-224 (Güvenli Hash Algoritması 224-bit), tipik olarak 56 karakterlik onaltılık sayı olarak gösterilen 224-bit (28-bayt) hash değeri üreten kriptografik bir hash fonksiyonudur. NSA tarafından tasarlanan ve NIST tarafından yayınlanan SHA-2 hash fonksiyon ailesinin bir parçasıdır.

**Temel özellikler:**

- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir
- **Hızlı hesaplama**: Herhangi bir verilen girdi için hızla hesaplanır
- **Çığ etkisi**: Girdideki küçük değişiklikler büyük ölçüde farklı çıktılar üretir
- **Geri döndürülemez**: Hash'i tersine çevirerek orijinal girdiyi bulmak hesaplamalı olarak mümkün değildir
- **Çarpışma dirençli**: Aynı hash'i üreten iki farklı girdi bulmak çok zordur

**Yaygın kullanımlar:**

- Dijital imzalar ve sertifikalar
- Blok zinciri ve kripto para birimleri (bazı sistemler SHA-224 kullanır)
- Şifre depolama (uygun tuzlama ile)
- Dosya bütünlüğü doğrulama
- İş kanıtı algoritmaları
