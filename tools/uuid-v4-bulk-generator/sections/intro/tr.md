Veritabanı satırları, API test verileri, nesne anahtarları, test yükleri, içe aktarma şablonları veya tek seferlik operasyon işleri için rastgele kimliklere ihtiyacınız olduğunda doğrudan tarayıcınızda bir UUID v4 tanımlayıcıları toplu işlemi oluşturun.

## UUID v4 Ne Sağlar

UUID v4, büyük ölçüde kriptografik olarak güvenli rastgele baytlardan oluşturulan 128 bitlik bir tanımlayıcıdır. Sürüm ve varyant bitleri RFC 4122 düzeniyle sabitlenir; böylece UUID v4, çok geniş bir rastgele alan taşırken tanıdık `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` biçimine sahip olur.

## Pratik Bir Toplu İşlem Boyutu Seçin

Varsayılan toplu işlem, sayfanın taranmasını zorlaştırmadan birçok test verisi ve elektronik tablo iş akışı için yeterli kimlik sağlar. Daha büyük bir içe aktarma hazırlıyorsanız adedi artırın veya yalnızca bir istek örneği ya da manuel veritabanı düzenlemesi için birkaç tanımlayıcıya ihtiyacınız varsa azaltın.

## Kopyalayın Veya Dışa Aktarın

Oluşturulan listeyi gözden geçirin, ardından düzenleyicinize kopyalayın veya düz metin dosyası olarak indirin. Her değer yerel olarak oluşturulur ve geçerli toplu işlem bu araç tarafından hiçbir zaman yüklenmez.

## Çakışma Rehberi

UUID v4 çakışma riski normal uygulama iş yükleri için son derece düşüktür, ancak veritabanı benzersizlik kısıtının yerine geçmez. Kimliğin birincil anahtar, herkese açık belirteç veya kalıcı referans haline geldiği yerlerde benzersizliği zorunlu kılmaya devam edin.
