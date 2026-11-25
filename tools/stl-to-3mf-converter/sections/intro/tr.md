## STL dosyasını 3MF’ye dönüştürme

**STL koordinat birimi** seçeneğinden birim seçin. Ardından **Dosya aç** düğmesine tıklayın veya bir `.stl` dosyasını dönüştürücüye bırakın. Araç hem ASCII hem de ikili STL dosyalarını açabilir. Bir montaj braketini dönüştürmek için **Örnek dene**, modeli kaydetmek için **3MF indir** düğmesine tıklayın. Birimi değiştirdiğinizde mevcut dosya yeniden dönüştürülür.

## Dilimleme yazılımı için doğru boyutu seçme

STL, koordinatları ölçü birimi belirtmeden saklar. Kaynak dosyada kullanılan birimi seçin. Örneğin STL dosyasında 2 koordinat birimi genişliğinde bir parça, inç seçerseniz 2 inç, milimetre seçerseniz 2 milimetre genişliğinde olur. 3MF bu ölçeği açıkça kaydeder. Böylece uyumlu bir dilimleme yazılımı modeli amaçlanan boyutta okuyabilir.

## 3MF modelini kontrol etme veya ters yönde dönüştürme

3MF dosyası özgün üçgenleri içerir. Ağ, yüzleri tutarlı yönlendirilmiş kapalı bir hacim oluşturuyorsa dönüştürücü ağı katı olarak kaydeder. Açık ağlar ve yüz yönleri tutarsız ağlar yüzey olarak kaydedilir. Malzemeleri ve baskı ayarlarını dilimleme yazılımında belirleyebilirsiniz. Boyutları kontrol etmek için dosyayı [3MF Görüntüleyici](../3mf-viewer/) aracında açın veya özgün modeli [STL Görüntüleyici](../stl-viewer/) aracında inceleyin. Kaynak ağda açıklıklar veya başka topoloji sorunları varsa [Ağ Hacmi ve Topoloji Denetleyici](../mesh-inspector/) aracını kullanın. Ters yönde dönüştürmek için [3MF’den STL’ye Dönüştürücü](../3mf-to-stl-converter/) aracını kullanın. [3MF biçimi hakkında](https://3mf.io/resources/faq/)
