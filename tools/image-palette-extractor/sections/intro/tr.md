## Bu araç ne yapar

Image Palette Extractor, bir görseldeki baskın renkleri doğrudan
tarayıcınızda bulur. Resmi örnekler, görsel olarak benzer pikselleri
gruplar ve her renk için HEX, RGB, HSL ve yüzde değerleri içeren pratik
bir palet döndürür.

## İyi kullanım alanları

- Bir ekran görüntüsünden, logodan, fotoğraftan veya taslak görselden marka ya
  da ürün renklerini çıkarın.
- Bir açılış sayfası, küçük resim veya tasarım teslimi için hızlı bir CSS
  paleti oluşturun.
- Bir görselin ne kadarının tek bir baskın renkten, ne kadarının destekleyici
  vurgu renklerinden oluştuğunu karşılaştırın.
- Dosyayı bir sunucuya göndermeden özel görsellerle çalışın.

## Dışa aktarma seçenekleri

Sonuç düz bir HEX listesi, CSS özel özellikleri veya JSON olarak kopyalanabilir.
CSS biçimi `--palette-1` gibi değişkenler istediğinizde kullanışlıdır; JSON ise
renk biçimlerini ve baskınlık oranını betikler ya da tasarım otomasyonu için
bir arada tutar.

## Dikkat edilmesi gerekenler

- Palet çıkarma yaklaşık sonuç verir. Her piksel renginin eksiksiz bir
  envanterini değil, kullanışlı görsel gruplar üretmeyi amaçlar.
- Saydam pikseller varsayılan olarak yok sayılır; böylece ikonlar ve kesilmiş
  görseller paleti çarpıtmaz. Saydamlığın kendisi çalışmanın parçasıysa bunu
  kapatın.
- Hassas kalite ayarı daha fazla piksel örnekler ve çok büyük görsellerde daha
  yavaş olabilir.
