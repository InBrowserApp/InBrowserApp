## PRC Resident ID nedir?

18 karakterlik PRC Resident ID numarası adres kodu, doğum tarihi, sıra kodu ve kontrol basamağı içerir. Bu doğrulayıcı bu parçaları çevrimdışı kontrol eder ve numaranın yapısını anlamaya yardımcı olur.

### Doğrulama nasıl çalışır

- Boşlukları ve tireleri kaldırır, son karakteri büyük `X` olarak normalleştirir
- Tam olarak 18 karakter ister: 17 rakam ve son karakter olarak bir rakam veya `X`
- İlk 6 rakamı 2023 idari bölünme veri setiyle eşleştirir ve 8 haneli doğum tarihini ayrıştırır
- İlk 17 rakamdan kontrol basamağını yeniden hesaplar ve son karakterle karşılaştırır

### Sonuçta ne gösterilir

- Bölge dökümü: eyalet, şehir, ilçe ve ham bölge kodu
- Doğum tarihi, mevcut yaş, sıra kodu ve sıra kodundan türetilen cinsiyet
- Hata ayıklama için normalize edilmiş kimlik numarası ile beklenen ve gerçek kontrol basamağı

### Örnek

`110101199001010015` şu şekilde okunabilir:

- `110101` -> Pekin, Dongcheng bölgesi
- `19900101` -> doğum tarihi `1990-01-01`
- `001` -> sıra kodu
- `5` -> kontrol basamağı

### Önemli not

Bu araç yalnızca çevrimdışı yapısal ve sağlama toplamı doğrulaması yapar. Bu kontrollerden geçen bir numara, gerçek veya halen geçerli bir kimlik belgesini kanıtlamaz.

Bölge adları 2023 idari bölünme veri setine dayanmaktadır.
