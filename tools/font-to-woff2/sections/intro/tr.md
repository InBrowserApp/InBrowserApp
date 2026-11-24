## TTF veya OTF, WOFF2'ye nasıl dönüştürülür?

Bir veya daha fazla TrueType (`.ttf`) ya da OpenType (`.otf`) yazı tipi dosyası seçin veya dosyaları dönüştürücüye sürükleyin. Dosyaları eklediğinizde dönüştürme hemen başlar. Bir yazı tipi hazır olduğunda orijinal ve WOFF2 dosya boyutlarını karşılaştırın ve **WOFF2'yi indir** seçeneğini seçin. Örneğin, `Inter-Regular.ttf` dosyası `Inter-Regular.woff2` olur. Tüm yazı tipi işlemleri tarayıcınızda gerçekleşir, böylece dosyalar cihazınızda kalır.

## Web yazı tipleri için neden WOFF2 kullanılmalı?

WOFF2 (Web Open Font Format 2), yazı tipi verilerini Brotli sıkıştırmasıyla paketler. Orijinal TTF veya OTF dosyasını sunmaya kıyasla WOFF2 genellikle daha az veri aktarır. Tasarruf miktarı yazı tipine bağlıdır. Biçim dönüştürme, tüm glif kümesini ve değişken yazı tipi eksenlerini korur; böylece tek bir değişken yazı tipi dosyası farklı kalınlıkları kapsamaya devam eder. Siteniz yalnızca belirli karakterleri kullanıyorsa dosyayı daha da küçültmek için bir [yazı tipi alt kümesi oluşturucu](../font-subset-generator/) kullanın.

## CSS'de WOFF2 dosyası nasıl kullanılır?

İndirdiğiniz dosyayı sitenizin yazı tipi klasörüne koyun ve `@font-face` ile dosyaya başvurun. Yolu, kalınlığı ve stili sunacağınız dosyayla eşleştirin. Bu örnek, `/fonts/` klasöründen normal bir yazı tipi yükler ve yükleme sırasında metni yedek yazı tipiyle gösterir.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

Değişken bir yazı tipi için yazı tipinin gerçekten desteklediği kalınlık aralığını kullanın; örneğin `font-weight: 100 900;`. Bir yazı tipini web sitesinde barındırmadan önce lisansını kontrol edin ve sayfalarınızda kullanılan dilleri ve kalınlıkları test edin. [MDN @font-face başvurusuna](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face) bakın.
