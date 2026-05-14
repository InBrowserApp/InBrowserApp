## scrypt nedir?

scrypt, bellek kullanımı yüksek olacak şekilde tasarlanmış, parolaya dayalı bir anahtar türetme işlevidir (KDF). Bir parola ve tuzu belirleyici anahtar baytlarına dönüştürürken kasıtlı olarak CPU zamanı ve bellek harcar; bu da büyük ölçekli parola tahminini basit hash işlemine göre daha maliyetli hale getirir.

**Temel noktalar:**

- `N` (maliyet faktörü), `r` (blok boyutu) ve `p` (paralellik) kullanır
- Daha yüksek `N` ve `r` ayarları bellek ve hesaplama maliyetini artırır
- Yalnızca parola, tuz, parametreler ve çıktı uzunluğu eşleştiğinde aynı türetilmiş anahtarı üretir

**En iyi uygulamalar:**

- Her parola veya gizli değer için benzersiz rastgele bir tuz kullanın
- `N`, `r`, `p`, tuz biçimi ve çıktı uzunluğunu türetilmiş anahtarın yanında saklayın
- Üretimde kullanmadan önce parametreleri desteklemeniz gereken en yavaş cihazda ayarlayın
