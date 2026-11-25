## DXF çizimini SVG’ye dönüştürme

**DXF dosyası aç** düğmesine tıklayın veya ASCII biçimindeki bir `.dxf` çizimini araca bırakın. Profil, delikler, eksen çizgileri ve etiketler içeren bir montaj braketi çizimi açmak için **Örnek dene** düğmesine tıklayın. Araç çizimi tarayıcınızda okur ve vektör önizlemesini gösterir. Model alanında seçtiğiniz geometriyi bağımsız bir SVG dosyası olarak kaydetmek için **SVG indir** düğmesine tıklayın.

## Dışa aktarılacak katmanları seçme

İstediğiniz katmanları **Katmanlar** bölümünde seçin. Bir katmanı seçtiğinizde veya seçimden çıkardığınızda önizleme güncellenir. Örneğin bir illüstrasyon için dış hatları ve delikleri dışa aktarabilir, açıklamalı bir çizim için eksen çizgilerini ve etiketleri de ekleyebilirsiniz. SVG, seçili katmanları ayrı vektör grupları olarak saklar.

## Çizim ölçeğini koruma

DXF dosyası milimetre veya inç gibi bir uzunluk birimi belirtiyorsa SVG, fiziksel boyutları milimetre cinsinden kaydeder. Çizim geometrisi dosya içinde özgün ölçeğini korur. Ölçü birimi belirtilmemiş DXF çizimlerinde SVG’nin viewBox değeri çizim koordinatlarını kullanır. Önizleme, ekrandaki kullanılabilir alana sığar. [DXF başlık değişkenleri](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Model alanı geometrisini dışa aktarma

Dönüştürücü, desteklenen çizgileri, çoklu çizgileri, yayları, daireleri, blokları ve metinleri dışa aktarır. Eğriler vektör parçalarıyla çizilir. Desteklenen metinler, mevcut yazı tipleri kullanılarak vektör dış hatlarına dönüştürülür. DXF dosyasını kaydetmeden önce CAD yazılımınızda satır ve sütunlardan oluşan blok dizilerini patlatarak ayrı blok eklemelerine dönüştürün. Geometri bir yerleşim paftasındaysa DXF dosyasını dışa aktarmadan önce model alanına taşıyın. Çizimi incelemek için [DXF Görüntüleyici](../dxf-viewer/) aracında görünümü kaydırın, yakınlaştırın ve katmanları açıp kapatın.
