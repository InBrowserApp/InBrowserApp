## STL veya OBJ ağı çevrimiçi nasıl denetlenir?

**Dosya aç** düğmesine tıklayın veya bir `.stl` ya da `.obj` modelini araca bırakın. Araç ağı cihazınızda okur, yüzey alanını ve kapalı hacmi hesaplar, topoloji sorunlarını gösterir. Kendi dosyanızı açmadan önce kapalı bir montaj braketini denetlemek için **Örnek dene** düğmesine tıklayın.

## Yüzey alanı ve hacmi okuma

STL ve OBJ koordinatları ortak bir fiziksel ölçü birimi tanımlamaz. **Koordinat birimi** olarak modeli dışa aktarırken kullandığınız birimi seçin. Alan kare, hacim küp birimlerle gösterilir. Birim seçtiğinizde kayıtlı koordinatlara birim atanır ve ölçek değişmez. Örnekteki braketin koordinatları milimetre cinsindense hacmi 16.016 mm³ olur.

Yüzey alanı, dosyadaki üçgenlerin alanları toplanarak hesaplanır. Yinelenen yüzlerin alanı her kopya için ayrı ayrı sayılır. Ağ topoloji denetimlerini geçerse araç yüzlerin yönünden hacmi hesaplar. Kendiyle kesişen yüzeyler, yanlış yönlendirilmiş kabuklar veya birbiriyle örtüşen kabuklar bu tahmini etkileyebilir. Önemli sonuçları özgün katı modelle karşılaştırın.

## Topoloji sonuçlarını anlama

- Bir **sınır kenarı** tek bir üçgene aittir. Bu kenarlar, deliklerin çevresi de dahil olmak üzere ağın açık sınırlarını gösterir.
- Bir **manifold olmayan kenar** ikiden fazla üçgene aittir. **Manifold olmayan köşe**, böyle bir kenarın ucunda yer alır ya da birbirine bağlı olmayan yüz gruplarının birleştiği köşedir.
- **Tutarsız yüz yönü**, bitişik iki üçgenin ortak kenarını aynı yönde dolaşmasıdır. Doğru yönlendirilmiş komşu yüzler bu kenarı zıt yönlerde dolaşır.
- **Sıfır alanlı yüzlerin** alanı sıfırdır. **Yinelenen yüzler** aynı üçgenin birden fazla kez bulunduğunu gösterir.

Araç, tam olarak aynı konumdaki noktaları tek bir köşe olarak sayar. Kabukları, üçgenlerinin paylaştığı kenarlara göre belirler. Topoloji sorunu bulunduğunda da yüzey alanı ve sorun sayıları gösterilir. Bu sayılar, hacmi kullanmadan önce nelerin düzeltilmesi gerektiğini anlamanıza yardımcı olur.

## Modeli inceleme veya dönüştürme

Modeli 3B olarak veya tel kafes görünümünde incelemek için [STL Görüntüleyici](../stl-viewer/) ya da [OBJ Görüntüleyici](../obj-viewer/) aracını kullanın. Sonraki araç bir STL dosyası gerektiriyorsa [OBJ’den STL’ye Dönüştürücü](../obj-to-stl-converter/) aracını kullanın.
