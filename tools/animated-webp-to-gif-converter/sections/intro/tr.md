## Animasyonlu WebP'yi GIF'e dönüştürün

Animasyonlu WebP, bir `.webp` dosyasında birden fazla kare saklar. Bir sohbet
uygulaması, belge sitesi veya başka bir platform GIF animasyonu istiyorsa
dosyanızı GIF'e dönüştürün. Kayıplı ve kayıpsız sıkıştırmayla oluşturulmuş
animasyonlu WebP dosyaları desteklenir. İşlem cihazınızda gerçekleşir.

### Animasyonlu WebP, GIF'e nasıl dönüştürülür?

1. **Dosya seç** düğmesine tıklayın veya animasyonlu bir WebP'yi araca bırakın.
2. Kareleri orijinal boyutlarında dönüştürmek için **GIF oluştur**'a tıklayın.
3. GIF'i kontrol etmek için **Oynat**'a, kaydetmek için **GIF indir**'e tıklayın.

### Kare sürelerine ve döngü sayısına ne olur?

Her karenin süresi, GIF'in kullandığı 10 ms birimlerine yuvarlanır. Oynatma
süresi kare başına en az 20 ms'dir. Örneğin, 100 ms'lik bir karenin ardından
250 ms'lik bir kare geliyorsa iki süre de korunur. WebP belirli sayıda
oynatılacak şekilde ayarlanmışsa GIF toplam oynatma sayısını korur. WebP
sonsuz döngüdeyse GIF de sonsuz döngüde oynatılır.

### GIF, saydamlığı ve renkleri nasıl işler?

GIF, kare başına en fazla 256 girdilik indeksli bir palet kullanır ve bir
girdiyi saydamlığa ayırır. WebP kısmi saydamlığı desteklediği için yarı saydam
gölgeler ve yumuşatılmış kenarlar GIF'te farklı görünebilir. Renk zenginliği
yüksek karelerde renk geçişleri bantlar hâlinde görünebilir. Önizlemeyi
kullanmayı planladığınız arka plan üzerinde kontrol edin.

### Sık sorulan sorular

#### Durağan bir WebP'yi dönüştürebilir miyim?

Bu araç animasyon kareleri gerektirir. `.webp` uzantısı hem durağan hem de
animasyonlu görüntülerde kullanılır. Birkaç durağan görüntüden animasyon
oluşturmak için [GIF Oluşturucu](/tr/tools/gif-maker/) aracını kullanın.

#### GIF neden WebP'den daha büyük?

WebP, renkleri ve kareler arasında değişen bölgeleri verimli biçimde sıkıştırır.
Boyutlar ve kare süreleri aynı kalsa bile GIF dosyası daha büyük olabilir.
Hedef platform yükleme boyutunu sınırlıyorsa önizlemenin yanındaki çıktı boyutunu
kontrol edin.

### İlgili animasyon araçları

Ters dönüşüm için [GIF'ten Animasyonlu WebP'ye Dönüştürücü](/tr/tools/gif-to-animated-webp-converter/),
animasyonlu PNG dosyaları için [APNG'den GIF'e Dönüştürücü](/tr/tools/apng-to-gif-converter/)
aracını kullanabilirsiniz.
