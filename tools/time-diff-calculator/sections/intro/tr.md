## Bu araç ne için kullanılır?

Bu hesaplayıcıyı, iki yerel tarih ve saat arasındaki tam geçen süreyi
ölçmek için kullanabilirsiniz; değerler farklı IANA saat dilimlerine
ait olsa bile çalışır. Ofsetleri elle çevirmeden ve yaz saatinin
etkisini tahmin etmeden güvenilir bir sonuç gerektiğinde kullanışlıdır.

## Yaygın kullanım örnekleri

- Bir şehirdeki başlangıç saatini başka bir şehirdeki bitiş saatiyle
  karşılaştırmak.
- Farklı saat dilimlerinde kaydedilmiş loglar, olaylar, uçuşlar veya
  destek zaman aralıkları arasındaki geçen süreyi ölçmek.
- İki zaman damgasının gece yarısını, hafta sonunu veya yaz saati
  değişimini aşıp aşmadığını kontrol etmek.

## Bu hesaplayıcı nasıl çalışır?

- Başlangıç ve bitiş yerel tarih ve saatlerini
  `YYYY-MM-DD HH:mm:ss.SSS` biçiminde girin, ardından her taraf için
  saat dilimini seçin.
- Araç iki zaman damgasını dahili olarak UTC'ye dönüştürür; ardından
  işaretli süreyi, mutlak süreyi, ISO 8601 süresini ve milisaniyeden
  güne kadar toplam değerleri gösterir.
- Geçerli saati hızlıca doldurmak için `Now`, karşılaştırmayı tersine
  çevirmek için `Swap` kullanın. Yaz saati geçişlerinde ofsetler
  değişebilir.
