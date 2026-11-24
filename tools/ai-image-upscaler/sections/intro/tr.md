## Yapay zekâ ile görsel nasıl büyütülür?

1. JPG, PNG veya WebP biçiminde bir görsel seçin ya da buraya sürükleyip bırakın. Küçük olsa bile elinizdeki en iyi kopyayı kullanın.
2. **2×** veya **4×** seçin ve çıktı boyutlarını kontrol edin. 400 × 300 piksellik bir görsel 2× ile 800 × 600, 4× ile 1600 × 1200 piksele çıkar.
3. **Görseli büyüt** düğmesine basın. Kenarları ve dokuları incelemek için karşılaştırma kaydırıcısını hareket ettirin. Sonucu kayıpsız PNG olarak indirin.

## Yapay zekâ destekli süper çözünürlük nedir?

Süper çözünürlük, düşük çözünürlüklü bir görselin piksel cinsinden boyutlarını artırır. InBrowser.App, mevcut piksellerden daha ince kenarları ve dokuları tahmin eden, eğitilmiş Real-ESRGAN modelini kullanır. Böylece küçük fotoğraflar, çizimler ve sıkıştırılmış web görselleri büyütüldüklerinde daha net görünebilir. Önizlemede yüzleri, küçük yazıları ve ince desenleri kontrol edin. Yeni ayrıntılar modelin tahminidir ve asıl görüntüden farklı olabilir.

## 2× ve 4× büyütme arasında nasıl seçim yapılır?

Küçük bir görseli daha büyük bir tasarıma yerleştirmek gibi durumlarda 2× genellikle yeterlidir. Küçük bir taramayı daha büyük boyutta görüntülemek gibi durumlarda 4× seçin. Her kenarı iki katına çıkarmak piksel sayısını dört katına çıkarır. Her kenar dört katına çıktığında piksel sayısı on altı katına çıkar. Kaynak görselin her kenarı en fazla 2.048 piksel, toplam çözünürlüğü ise en fazla 1 megapiksel olabilir.

## Büyütme işlemi cihazımda mı gerçekleşir?

Evet. İlk büyütme işlemini başlattığınızda tarayıcınız Real-ESRGAN modelini indirir. Tarayıcı, WebGPU kullanılabiliyorsa görseli cihazınızda WebGPU ile işler. WebAssembly üzerinden CPU'yu da kullanabilir. İlk çalıştırma daha uzun sürebilir. İşlem süresi görselin boyutuna ve cihazınıza bağlıdır. Görseliniz işlem boyunca cihazınızda kalır.
