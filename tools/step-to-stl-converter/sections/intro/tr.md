## STEP veya STP dosyasını STL’ye dönüştürme

**Dosya aç** düğmesine tıklayın veya bir `.step` ya da `.stp` dosyasını dönüştürücüye bırakın. Araç, CAD yüzeylerini cihazınızda üçgenlere ayırır ve indirilebilir bir ikili STL dosyası hazırlar. Bir montaj braketini dönüştürmek için **Örnek dene**, sonucu kaydetmek için **STL indir** düğmesine tıklayın.

## 3B baskı için doğru boyutu koruma

STEP dosyası fiziksel boyutları içerir. Dönüştürücü, montajdaki her bileşenin konumu dahil olmak üzere koordinatları milimetre cinsinden dışa aktarır. STL biçimi ölçü birimi içermez. Çıktıyı dilimleme yazılımında açarken milimetreyi seçin. Örneğin STEP dosyasında bir inç olan bir kenar STL dosyasında 25,4 koordinat birimi uzunluğunda olur.

## Dışa aktarılan ağı denetleme

STL dosyası, parçaların üçgenlere ayrılan yüzeylerini montajdaki konumlarıyla birlikte içerir. Düzenlenebilir CAD yüzeyleri, bileşen adları ve montaj yapısı için STEP biçimini kullanın. STL dosyasını [STL Görüntüleyici](../stl-viewer/) aracında inceleyebilir veya kapalı hacmi ve topolojiyi [Ağ Hacmi ve Topoloji Denetleyici](../mesh-inspector/) aracında kontrol edebilirsiniz.

## Özgün modeli inceleme veya dışa aktarma

Boyutları kontrol etmek, CAD modelini döndürmek ve doğrudan araç çubuğundan STL olarak dışa aktarmak için [STEP Görüntüleyici](../step-viewer/) aracını kullanın. Dilimleme yazılımınız STEP dosyalarını içe aktarabiliyorsa özgün dosyayı açın ve ağ ayarlarını o yazılımda seçin. [PrusaSlicer’ın desteklediği dosya biçimleri](https://help.prusa3d.com/article/supported-file-formats_1772)
