## 3MF dosyasını STL’ye dönüştürme

**Dosya aç** düğmesine tıklayın veya bir `.3mf` dosyasını araca bırakın. Araç modeli cihazınızda okur ve ikili STL dosyası oluşturur. İki renkli montaj braketi içeren bir baskı yerleşimini kullanmak için **Örnek dene**, sonucu kaydetmek için **STL indir** düğmesine tıklayın.

## Parça boyutlarını ve baskı yerleşimini koruma

Dönüştürücü, ağ koordinatlarını milimetre cinsinden yazar. Baskı tablasındaki parçaların birbirine göre konumu korunur. Buna aynı parçanın birden fazla kopyası da dahildir. Örneğin 3MF’de bir inç uzunluğundaki bir parça, STL’de 25,4 koordinat birimi uzunluğunda olur. STL’yi içe aktarırken yazılım ölçü birimi sorarsa milimetreyi seçin.

## STL dosyasında neler bulunur?

Dönüştürücü, 3MF dosyasında saklanan üçgen ağları okur. Model bir çubuk kafese veya başka bir geometri uzantısına dayanıyorsa önce kaynak uygulamadan bir üçgen ağ dışa aktarın. STL, yüzey üçgenlerini içerir. Renkleri, malzemeleri veya dilimleme ayarlarını korumak için özgün 3MF dosyasını saklayın. Çıktıyı [STL Görüntüleyici](../stl-viewer/) aracında açın veya kaynak modeli [3MF Görüntüleyici](../3mf-viewer/) aracında inceleyin. Sonraki adımda 3MF model paketi gerekiyorsa [STL’den 3MF’ye Dönüştürücü](../stl-to-3mf-converter/) aracını kullanın. [3MF biçimi hakkında](https://3mf.io/resources/faq/)
