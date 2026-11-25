## Wavefront OBJ dosyasını STL’ye dönüştürme

**Dosya aç** düğmesine tıklayın veya bir `.obj` dosyasını dönüştürücüye bırakın. Küçük bir montaj braketini dönüştürmek için **Örnek dene** düğmesine tıklayın. Araç çokgen yüzleri üçgenlere ayırır. Ardından ikili `.stl` dosyasını kaydetmek için **STL indir** düğmesine tıklayın. Dönüştürme cihazınızda gerçekleşir.

## STL’ye aktarırken neler değişir?

STL, yüzeyleri üçgenler halinde saklar. Malzemeler, doku görselleri, UV koordinatları, bağımsız çizgiler ve noktalar STL dosyasına aktarılmaz. Dönüştürücü, eksenleri ve ölçeği korur. İkili STL, koordinatları 32 bit kayan noktalı sayılar olarak saklar. Bu nedenle çok büyük koordinatların yuvarlanması ince ayrıntıların kaybolmasına yol açabilir. Baskıdan önce dilimleme yazılımında kullanmak istediğiniz ölçü birimini seçin. Örneğin OBJ dosyasındaki 40 koordinat birimlik bir uzunluk, STL dosyasında da 40 koordinat birimi olarak kalır.

Ağda delikler veya başka geometri sorunları olsa da dönüştürme başarılı olabilir. Baskıdan önce sonucu dilimleme yazılımında kontrol edin.

## Sonucu önizleme veya ters yönde dönüştürme

İndirdiğiniz dosyayı [STL Görüntüleyici](../stl-viewer/) aracında açın. Kaynak dosyayı eklediğiniz malzemelerle birlikte [OBJ Görüntüleyici](../obj-viewer/) aracında inceleyebilirsiniz. Ters yönde dönüştürmek için [STL’den OBJ’ye Dönüştürücü](../stl-to-obj-converter/) aracını kullanın.
