## Metin veya dosya hash'i nedir?

Hash fonksiyonu metni veya dosya baytlarını sabit uzunlukta bir özete dönüştürür. Aynı giriş ve algoritma her zaman aynı özeti üretir; bu yüzden hash'ler, özel verileri yüklemeden tekrarlanabilir bir parmak izine ihtiyaç duyduğunuzda kullanışlıdır.

## Bu araç ne zaman kullanılır?

Bu aracı indirme sağlama toplamlarını doğrulamak, iki dosyanın aynı olup olmadığını karşılaştırmak, bir metin parçası için hızlı bir parmak izi kaydetmek veya SHA özetleri yayımlayan sistemlerde hata ayıklamak için kullanın. Dosya içe aktarma dosya baytlarını doğrudan hash'ler; metin modu ise düzenleyicide gösterilen UTF-8 metni hash'ler.

## Algoritma seçimi

SHA-256, yeni bütünlük kontrolleri için sağlam bir varsayılandır. SHA-384 ve SHA-512, başka bir sistem bu biçimleri beklediğinde daha uzun SHA-2 özetleri sağlar. SHA-1 eski sistemlerle karşılaştırma için dahil edilmiştir, ancak güvenlik açısından hassas yeni tasarımlarda kullanılmamalıdır.

## Gizlilik ve sınırlamalar

Hash işlemi Web Crypto aracılığıyla tarayıcınızda yerel olarak çalışır ve dosyalar yüklenmez. Hash şifreleme değildir: tek başına bir sırrı koruyamaz; parola saklama için tuz ve iş faktörü içeren özel bir parola hash fonksiyonu gerekir.
