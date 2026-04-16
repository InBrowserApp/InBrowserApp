## BIC/SWIFT nedir?

BIC (Bank Identifier Code), SWIFT kodu olarak da bilinir ve uluslararası ödemelerde finansal kurumları tanımlar.

### BIC Yapısı

BIC 8 veya 11 karakterdir: banka kodu (4 harf), ülke kodu (2 harf), konum kodu (2 alfanümerik) ve isteğe bağlı şube kodu (3 alfanümerik).

### Doğrulama Kuralları

Doğrulama uzunluğu, karakter setini ve ISO 3166 ülke kodlarını kontrol eder.

1. Boşluk ve tireleri kaldırın
2. Formatın 8 veya 11 karakter olduğundan emin olun
3. Banka, ülke, konum ve şube kodlarını ayrıştırın

"XXX" şube kodu veya 8 karakterli BIC, ana şubeyi belirtir.

Konum kodunun ikinci karakteri 0 ise test BIC; 1 ise pasif katılımcıdır.
