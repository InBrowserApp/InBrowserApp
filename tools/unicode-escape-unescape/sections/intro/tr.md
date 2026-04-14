## Unicode Kaçış Nedir?

Unicode kaçış, karakterleri Unicode kod noktalarını temsil eden kodlanmış dizilere dönüştürür. Kaynak kodu, yapılandırma dosyaları veya veri biçimleri belirli karakterleri doğrudan içeremediğinde bu yöntem gereklidir.

**Yaygın kaçış biçimleri:**

- `\uXXXX` — JavaScript / JSON, çoğu programlama dilinde kullanılır
- `\u{XXXXX}` — ES6+ JavaScript, vekil çiftlere gerek kalmadan ek karakterleri destekler
- `&#xXXXX;` / `&#DDDD;` — Onaltılık veya ondalık biçimde HTML varlıkları
- `U+XXXX` — Dokümantasyonda kullanılan standart Unicode gösterimi
- `\xXX` / `%XX` — URL'lerde ve C benzeri dillerde yaygın olan UTF-8 bayt düzeyinde kodlama
- `\UXXXXXXXX` — Herhangi bir kod noktası için Python 8 haneli biçim
- `0xXXXX` — Onaltılık literal gösterim

## Bu araç ne zaman kullanılır?

- ASCII güvenli kodlama gerektiren kaynak kodu veya yapılandırma dosyalarına ASCII dışı karakterler yerleştirirken
- Bozuk metinlerin altında yatan Unicode kod noktalarını inceleyerek hata ayıklarken
- Diller veya biçimler arasında geçiş yaparken farklı kaçış gösterimleri arasında dönüştürme yaparken
- JSON, HTML veya URL bağlamları için varlık kodlamalı karakterlere ihtiyaç duyan metinleri hazırlarken

## Nasıl çalışır?

Sol tarafa düz metin yazın veya yapıştırın; araç, seçilen biçimi kullanarak ASCII dışı karakterleri kaçışlar. Sağ tarafa kaçışlı metin yapıştırın; araç desteklenen tüm biçimleri otomatik olarak algılar ve aynı anda çözer. Her şey tarayıcıda yerel olarak çalışır.
