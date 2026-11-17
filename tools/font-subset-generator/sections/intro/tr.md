## Yazı tipi alt kümesi nedir?

Yazı tipi alt kümesi, belirli bir metin için gereken karakterleri ve bunların
görüntülenmesi için gerekli destekleyici glifleri içerir. Kullanılmayan glifleri
kaldırmak, özellikle büyük Çince, Japonca ve Korece yazı tiplerinde veya metni
sabit bir başlık, logo ya da kampanya sayfasında indirme boyutunu önemli ölçüde
azaltabilir.

## Bu araç nasıl kullanılır?

Bir TTF, OTF, WOFF veya WOFF2 dosyası seçin ve bu yazı tipini kullanacak tüm
metni yapıştırın. Web için WOFF2, sıkıştırılmamış yazı tipi için TTF / OTF seçin
ve alt kümeyi oluşturun. Boyutları karşılaştırın, önizlemeyi kontrol edin ve
yazı tipini eşleşen CSS ile indirin. Yazı tipi işleme, yerel olarak bir
Web Worker içinde çalışır.

## Neler korunur?

HarfBuzz; ligatürler, karakter aralığı ayarları, birleştirici işaretler ve karmaşık
yazı sistemleri için gereken glif bağımlılıklarını ve OpenType dizgi özelliklerini
korur. Hinting ve değişken yazı tipi eksenleri de korunur. Kaynak yazı tipinin
desteklediği durumlarda, kanonik olarak eşdeğer birleşik ve ayrıştırılmış metin
biçimleri de dahil edilir. Önizleme, oluşturulan yazı tipini kullanır; kaynakta
eksik olan karakterler ayrıca listelenir.

## Pratik ipuçları

- Boşlukları, noktalama işaretlerini, sayıları ve gereken tüm çevrilmiş metinleri
  ekleyin. Metniniz temel Latin karakterlerini de içerecekse Latin hazır kümesini
  ekleyin.
- Metniniz her değiştiğinde alt kümeyi yeniden oluşturun. Sabit alt kümeler,
  içeriği önceden bilinen metinler için uygundur; kullanıcıların oluşturduğu
  içeriklerde daha geniş bir karakter kapsamı kullanın.
- Alt küme oluşturmak, özgün yazı tipinde eksik olan karakterleri ekleyemez.
  Alt kümenin dışındaki karakterler için CSS içinde yedek bir yazı tipi bulundurun.
- Lisansı değişikliğe ve web sayfalarına gömmeye izin veren bir yazı tipi kullanın.
  Yazı tipi koleksiyonları (`.ttc` / `.otc`) önce tekil yazı tipleri olarak dışa
  aktarılmalıdır.
- Küçük veya zaten alt kümesi oluşturulmuş yazı tipleri daha fazla küçülmeyebilir.
  WOFF2 genellikle web için en küçük indirme boyutunu sağlar; glif sayısına
  destekleyici glifler de dahildir.
