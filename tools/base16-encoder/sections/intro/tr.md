## Base16 (Hex) nedir?

Base16, onaltılık (hex) olarak da bilinen, her baytı 0-9 ve A-F kullanarak iki karakterle gösteren bir ikiliden-metine kodlamadır. Baytları incelemek, checksum ve kimlikleri temsil etmek için yaygın kullanılır.

**Yaygın kullanım:**

- Hata ayıklama ve günlüklerde ham baytları görmek
- Hash'leri, anahtarları ve ID'leri temsil etmek
- Metin kanallarında ikili veriyi kopyala/yapıştır yapmak

**Notlar:**

- Hex verinin boyutunu iki katına çıkarır (1 bayt -> 2 karakter)
- Bu araç isteğe bağlı `0x` öneklerini kabul eder ve boşlukları yok sayar
