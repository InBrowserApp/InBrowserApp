## GeoJSON dosyası nasıl denetlenir?

Bir .geojson veya .json dosyası açın ya da GeoJSON metnini yapıştırın. Ardından **GeoJSON’u doğrula** seçeneğini kullanın. Geçerli bir FeatureCollection görmek için **Örneği dene** seçeneğini kullanın. Girdiyi düzenleyip yeniden denetleyebilirsiniz. Dosyalar ve yapıştırılan metin tarayıcınızda kalır.

## Doğrulayıcı neleri denetler?

Araç önce JSON sözdizimini, ardından GeoJSON yapısını denetler. Bu yapıya FeatureCollection, Feature, GeometryCollection ve tekil geometri türleri dahildir. Konumlarda WGS 84 koordinatları önce boylam, sonra enlem sırasıyla yazılır. Araç koordinat aralıklarını, çizgi ve halkalardaki asgari konum sayılarını, halkaların kapalı olup olmadığını, detay özniteliklerini ve sınırlayıcı kutuların yapısını denetler. Boş detay koleksiyonları ve geometrisi null olan detaylar geçerlidir.

## Sorunu bulun ve düzeltin

`$.features[0].geometry.coordinates` gibi bir hata yolu, ilk detayın koordinatlarını işaret eder. Belirtilen alanı düzeltip girdiyi yeniden doğrulayın. Sonuç, dosyanın yapısını tanımlar. Kendi kendine kesişme veya çakışma gibi geometri topolojisi sorunları için ayrı bir CBS denetimi gerekir. Geçerli sonucu haritada incelemek için [GeoJSON Görüntüleyici](../geojson-viewer/) aracında açın.
