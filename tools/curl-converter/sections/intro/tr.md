## cURL dönüştürücü nedir?

Bir cURL dönüştürücü, cURL komutunu birçok dil ve HTTP istemcisi için doğrudan kullanılabilir koda çevirir. API dokümantasyonu, tarayıcı geliştirici araçları veya terminal geçmişi sana zaten çalışan bir istek verdiğinde ve yöntemi, URL'yi, başlıkları, çerezleri ya da gövdeyi elle yeniden kurmadan bunu uygulama koduna taşımak istediğinde faydalıdır.

**Kredi**
[curlconverter](https://curlconverter.com) (Nick Carneiro) tarafından desteklenir.

## Bu araç ne zaman işe yarar?

- API dokümantasyonunda veya terminal geçmişinde bulunan çalışan bir cURL örneğinden başlamak istediğinde.
- Aynı isteği `fetch`, Python `requests`, Go, Java, PHP ve diğer hedefler arasında karşılaştırıp sonra karar vermek istediğinde.
- Önce hızlı bir temel çıktı üretip ardından projenin hata yönetimi, yeniden deneme, kimlik yenileme ve yapılandırmasını eklemek istediğinde.

## Dönüşümden sonra neleri kontrol etmelisiniz?

- Seçilen hedefin, projenin gerçekten kullandığı HTTP kütüphanesi ve çalışma zamanı ile eşleştiğinden emin olun.
- Uyarıları dikkatle okuyun. Bazı shell quoting kuralları, ortam değişkenleri veya desteklenmeyen cURL bayrakları elle düzenleme gerektirebilir.
- Üretilen kodu commit etmeden önce yer tutucu token'ları, sırları veya örnek URL'leri değiştirin.
