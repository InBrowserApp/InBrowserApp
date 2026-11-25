## İkili Plist dosyasını JSON’a dönüştürme

**İkili Plist dosyası aç** seçeneğini kullanın veya bir Apple ikili `.plist` dosyası bırakın. Biçimlendirilmiş JSON’u inceleyin, kopyalayın veya bir `.json` dosyası olarak indirin. İkili özellik listeleri `bplist00` imzasıyla başlar ve Apple uygulama paketlerinde, tercihlerde ve arşivlenmiş verilerde kullanılır. Örnek, özellik listesi değerlerinin JSON’da nasıl göründüğünü gösterir.

## JSON’u Apple ikili özellik listesine dönüştürme

**JSON → Plist** seçeneğine geçin, JSON yapıştırın veya bir `.json` dosyası açın. Ardından **İkili Plist’e dönüştür** seçeneğini kullanın. Oluşturulan `.plist` dosyasını indirin. Dizeler, mantıksal değerler, sayılar, diziler ve nesneler, özellik listesindeki karşılık gelen türlere dönüştürülür. `null` yerine başka bir değer girin veya anahtarını kaldırın. Dosyalar ve yapıştırılan metin tarayıcınızda işlenir.

## Tarihleri, baytları ve büyük tam sayıları koruma

JSON’da tarih, bayt verisi ve anahtarlı arşiv UID’si için yerleşik türler yoktur. Dönüştürücü, bu değerlerin iki yönde de anlamını korumak için açık `$plist` etiketleri kullanır.

| Plist değeri                        | JSON örneği                                            |
| ----------------------------------- | ------------------------------------------------------ |
| UTC cinsinden tarih                 | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Base64 olarak baytlar               | `{"$plist":"data","value":"AQID"}`                     |
| Ondalık metin olarak büyük tam sayı | `{"$plist":"integer","value":"9007199254740993"}`      |
| Anahtarlı arşiv UID’si              | `{"$plist":"uid","value":42}`                          |
| Büyük reel sayı                     | `{"$plist":"real","value":"1e+100"}`                   |

Plist’e geri dönüştürürken etiketleri koruyun. JSON’un güvenli tam sayı aralığı dışındaki değerlerde tam sayı etiketiyle birlikte ondalık değeri tırnak içinde yazın. Bir etiketle aynı yapıya sahip bir sözlük, anahtarlarını korumak için `dictionary` etiketiyle sarılır. Dönüşüm yapıyı ve desteklenen değerleri korur. Plist nesnelerinin sırası, `1.0` gibi tam sayı değerine sahip reel sayıların türü ve özgün ikili veriler değişebilir.

[Apple özellik listelerinin yapısı ve türleri](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)
