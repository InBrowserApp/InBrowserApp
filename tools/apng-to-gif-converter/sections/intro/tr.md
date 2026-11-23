## Animasyonlu PNG'yi GIF'e dönüştürün

APNG, bir PNG dosyasında birden fazla kare saklar. GIF animasyonu bekleyen
sohbet uygulamalarında, forumlarda veya belgelerde kullanmak için dosyanızı
GIF'e dönüştürün. Animasyonlu dosyaların uzantısı `.apng` veya `.png` olabilir.
Dönüştürücü, dosyadaki animasyonu okur ve cihazınızda işler.

### APNG, GIF'e nasıl dönüştürülür?

1. **Dosya seç** düğmesine tıklayın veya animasyonlu bir PNG'yi araca bırakın.
2. Kareleri orijinal boyutlarında dönüştürmek için **GIF oluştur**'a tıklayın.
3. GIF'i kontrol etmek için **Oynat**'a, kaydetmek için **GIF indir**'e tıklayın.

### Kare sürelerine ve döngü sayısına ne olur?

Her karenin süresi, GIF'in kullandığı 10 ms birimlerine yuvarlanır. Oynatma
süresi kare başına en az 20 ms'dir. Örneğin, 100 ms'lik bir karenin ardından
250 ms'lik bir kare geliyorsa iki süre de korunur. Kaynak animasyon bir kez,
birkaç kez veya sonsuza kadar oynatılıyorsa GIF de aynı şekilde oynatılır.
GIF, sonlu animasyonlar için toplam 65.536 oynatmaya izin verir.

### GIF, saydamlığı ve renkleri nasıl işler?

APNG, kısmi saydamlığı ve tam renkli kareleri destekler. GIF, kare başına en
fazla 256 girdilik indeksli bir palet kullanır ve bir girdiyi saydamlığa ayırır.
Yumuşak kenarlar ve gölgeler daha keskin görünebilir, pürüzsüz renk geçişlerinde
bantlar oluşabilir. Paylaşmadan önce GIF önizlemesini kontrol edin. Hedefiniz
animasyonlu PNG'yi destekliyorsa kaynak dosyayı kullanarak tüm renkleri ve kısmi
saydamlığı koruyabilirsiniz.

### Sık sorulan sorular

#### Normal bir PNG'yi dönüştürebilir miyim?

Araç, PNG animasyon verisi içeren dosyalar gerektirir. `.png` uzantılı bir
dosya animasyonlu olabilir. Animasyonda, yalnızca durağan PNG gösterebilen
uygulamalar için ayrı bir yedek görüntü varsa GIF, animasyonun ilk karesiyle başlar.

#### GIF, APNG'den daha küçük olur mu?

Dosya boyutu tuval boyutlarına, kare sayısına ve görüntü ayrıntılarına bağlıdır.
Özellikle kaynak APNG, kareler arasında değişen küçük bölgeleri saklıyorsa GIF
daha büyük olabilir. Çıktı boyutunu GIF önizlemesinin yanında görebilirsiniz.

### İlgili animasyon araçları

Ters dönüşüm için [GIF'ten APNG'ye Dönüştürücü](/tr/tools/gif-to-apng-converter/),
WebP dosyaları için [Animasyonlu WebP'den GIF'e Dönüştürücü](/tr/tools/animated-webp-to-gif-converter/)
aracını kullanabilirsiniz.
