## Genel Bakış

JSON Diff Path, iki JSON belgesini karşılaştırır ve her yapısal değişikliği hem JSONPath hem de JSON Pointer çıktısı olan okunabilir bir yol kaydına dönüştürür.

## Ne Zaman Kullanılır

API yükü değişikliklerini incelemeniz, yapılandırma geçişlerini denetlemeniz veya otomasyon için RFC 6902 JSON Patch işlemleri üretmeniz gerektiğinde kullanın.

## Nasıl Çalışır

Araç, her iki JSON girişini ayrıştırır, `add`, `remove` ve `replace` değişikliklerini hesaplar; ardından bu işlemleri filtrelemenize ve aynı sonuç panelinde yol listesi ile JSON Patch çıktısı arasında geçiş yapmanıza olanak tanır.
