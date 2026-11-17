## Parquet dosyalarını tarayıcınızda inceleyin

Verilere göz atmak ve her alanın fiziksel türünü, mantıksal açıklamasını ve tekrar türünü incelemek için bir `.parquet` dosyası açın veya sürükleyip bırakın. İç içe gruplar şemada görünür kalır. Özet; satır sayısını, sütunları, satır gruplarını, sıkıştırmayı ve varsa dosyayı oluşturan yazılımı gösterir. Dosya seçmeden de sunulan örneği deneyebilirsiniz.

## Verilere göz atın ve CSV veya JSON olarak dışa aktarın

Veriler sayfa sayfa yüklenir. Dosyada gezinmek için sayfa kontrollerini kullanın ve tam değerini okumak için bir hücre seçin. Alanları incelemek için **Şema** sekmesine geçin. Geçerli sayfayı veya tüm satırları UTF-8 CSV ya da JSON dizisi olarak indirmek için **Verileri dışa aktar** seçeneğini kullanın. Tüm dosyanın dışa aktarımı gruplar halinde hazırlanır ve iptal edilebilir.

CSV sütun adlarını içerir; virgül, tırnak ve satır sonu içeren değerleri tırnak içine alır. Null değerler CSV'de boş alanlara dönüşür ve JSON'da `null` olarak kalır. İç içe değerler JSON, ikili değerler onaltılık metin kullanır. JSON, 64 bit tamsayıları korumak için bunları dize olarak yazar. Tarihler ve zaman damgaları milisaniye hassasiyetinde ISO metni kullanır. Ondalık sayılar okuyucunun sayısal hassasiyetine tabidir; bu nedenle bu görüntüleyici, yüksek hassasiyetli ondalık veya zaman damgası verileri için kayıpsız bir dönüştürme aracı değildir.

## Yerel işleme

Dosyanız bir arka plan işçisinde yerel olarak okunur ve hiçbir zaman yüklenmez. Görüntüleyici önce alt bilgiyi, ardından yalnızca göz atmak için gereken satır aralıklarını okur. Parquet satır gruplarının kodunu çözmek yine de önemli miktarda bellek gerektirebilir; dışa aktarım boyutu tarayıcınızın kullanılabilir belleğiyle sınırlıdır. hyparquet ve sıkıştırıcı paketi; sıkıştırılmamış, Snappy, Gzip, Brotli, Zstandard ve LZ4 kodlayıcılarını destekler. Şifrelenmiş Parquet dosyaları desteklenmez.
