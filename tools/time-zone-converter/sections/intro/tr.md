## Bu araç ne için?

Bu dönüştürücüyü, bir IANA saat dilimindeki yerel tarih ve saati başka bir saat dilimindeki eşdeğer yerel zamana çevirmek için kullanın. Şehirler arasındaki programları karşılaştırmanız gerektiğinde, offset değerlerini elle toplamanıza veya yaz saati uygulamasının etkin olup olmadığını tahmin etmenize gerek kalmaz.

## Yaygın kullanım durumları

- Tokyo'daki bir toplantının New York veya Londra'da aynı takvim gününe denk gelip gelmediğini kontrol etmek.
- Programları, uyarıları veya destek saatlerini yayımlamadan önce offset değerlerini doğrulamak.
- Loglar ve API'ler için karşılık gelen ISO 8601, UTC veya Unix timestamp değerlerini kopyalamak.

## Bu dönüştürücü nasıl çalışır

- İki taraftan herhangi birine `YYYY-MM-DD HH:mm:ss.SSS` biçiminde yerel tarih ve saat girin, ardından kaynak ve hedef saat dilimlerini seçin.
- En son düzenlediğiniz taraf referans kabul edilir. Araç bu anı içeride UTC'ye dönüştürür, ardından diğer saat dilimindeki eşdeğer yerel zamanı gösterir.
- Geçerli zamanı hızlıca doldurmak için `Now`, karşılaştırma yönünü tersine çevirmek için `Swap` kullanın. Yaz saati geçişleri sırasında offset değerleri değişebilir.
