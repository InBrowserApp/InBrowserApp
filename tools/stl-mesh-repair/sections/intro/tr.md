## STL dosyası çevrimiçi nasıl onarılır?

**Dosya aç** düğmesine tıklayın veya ASCII ya da ikili bir `.stl` dosyasını araca bırakın. Onarım cihazınızda gerçekleşir. Yinelenen, sıfır alanlı ve ters yönlü yüzleri olan küçük bir ağı görmek için **Örnek dene** düğmesine tıklayın. Sonuçları karşılaştırın ve özgün boyutları ve koordinatları koruyan yeni bir ikili dosya kaydetmek için **STL indir** düğmesine tıklayın.

## Ağ onarımında neler değişir?

Araç, birebir yinelenen üçgenleri ve sıfır alanlı üçgenleri kaldırır. Komşu yüzlerin yönlerini karşılaştırır. İki yön seçeneğinden birinde daha az yüzü ters çevirerek tutarlı bir yön elde edilebiliyorsa yüzleri buna göre yeniden yönlendirir. Ağdaki noktalar aynı konumlarda kalır. Açık sınırlar, yönü belirsiz yüzler ve manifold olmayan birleşimler elle onarım gerektirebilir. Delikler, neredeyse çakışan noktalar ve kesişimler olduğu gibi kalır. [3B baskıda yaygın ağ sorunları](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Onarım öncesi ve sonrası topolojiyi karşılaştırma

Üçgenlerin, yinelenen yüzlerin ve sıfır alanlı yüzlerin sayılarını kontrol edin. Rapor ayrıca yüz yönleri tutarsız kenarları, açık sınırları ve kalan manifold olmayan kenar ve köşeleri gösterir. İndirilen dosyayı 3B olarak incelemek için [STL Görüntüleyici](../stl-viewer/) aracında açın. Yüzey alanı veya kapalı hacim için [Ağ Hacmi ve Topoloji Denetleyici](../mesh-inspector/) aracını kullanın. STL denetim raporunda topoloji sorunları varsa doğrudan **STL’yi onar** düğmesine de tıklayabilirsiniz.
