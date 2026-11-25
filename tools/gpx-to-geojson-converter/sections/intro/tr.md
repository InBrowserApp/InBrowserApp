## GPX, GeoJSON’a nasıl dönüştürülür?

Bir .gpx dosyası açın veya GPX XML metnini yapıştırıp **GeoJSON’a dönüştür** seçeneğini kullanın. Sonuçta bir iz, bir rota ve bir yol noktası görmek için **Örneği dene** seçeneğini kullanın. Harita veya CBS projeniz için GeoJSON’u kopyalayın ya da .geojson dosyasını indirin. Dönüştürme tarayıcıda yapılır ve girilen veriler cihazınızda kalır.

## İzler, rotalar ve yol noktaları nasıl dönüştürülür?

Çıktı bir GeoJSON FeatureCollection nesnesidir. Yol noktaları noktalara, rotalar çizgilere dönüşür. Bir iz birden çok kesintisiz bölümden oluşuyorsa bölümler ayrı kalır. Tek konum içeren bir bölüm veya rota noktaya dönüşür. Ad ve not gibi açıklayıcı alanlar ilgili detayla birlikte saklanır.

## Koordinatlar, yükseklik ve zaman

GeoJSON’da konumlar önce boylam, sonra enlem sırasıyla saklanır. Dünya haritalarında göstermek için karşı meridyeni geçen çizgiler 180° boylamında bölünür. Yükseklik bilgisi varsa üçüncü koordinata metre cinsinden yazılır. Noktaların zaman bilgisi detay özniteliklerinde saklanır. Rota ve iz bölümlerindeki zamanlar, konumlarla eşleştirilebilmeleri için koordinat sırasını korur. Çıktıyı [GeoJSON Görüntüleyici](../geojson-viewer/) ile açabilir veya özgün GPX dosyasını [GPX Görüntüleyici ve Yükseklik Profili](../gpx-viewer/) ile inceleyebilirsiniz.
