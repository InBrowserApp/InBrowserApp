## Test için rastgele VIN oluşturun

Adedi `1` ile `1000` arasında ayarlayın ve **Oluştur** seçeneğini seçin. Her satır 17 karakterli bir araç kimlik numarası (VIN) içerir. Toplu sonucu bir test formuna veya hesap tablosuna yapıştırmak için **Tümünü kopyala**, her satırda bir VIN içeren metin dosyasını kaydetmek için **TXT indir** seçeneğini kullanın.

## VIN ve kontrol basamağını okuyun

İlk üç karakter üretici tanımlayıcısını oluşturur. Dördüncü ile sekizinci arasındaki karakterler aracı tanımlar ve dokuzuncu karakter kontrol basamağıdır. Son sekiz karakter araç kimlik bölümünü oluşturur. Rakamlarla karıştırılmamaları için `I`, `O` ve `Q` harfleri kullanılmaz. Kontrol basamağı diğer 16 karakterden hesaplanır ve `0` ile `9` arasında bir rakam veya `X` olabilir. Örneğin `1M8GDM9AXKP042788` içinde dokuzuncu karakter `X`’tir.

## Test verilerinde örnek VIN kullanın

Oluşturulan VIN’leri zorunlu alanları, toplu içe aktarımları veya biçim ve kontrol basamağı doğrulamasını denemek için kullanın. Reddedilmeyi test etmek için yalnızca dokuzuncu karakteri farklı bir rakamla değiştirip değeri yeniden gönderin. Oluşturucu sentetik VIN’ler üretir; bu nedenle üretici, model yılı veya seri numarası gibi görünen alanları örnek veri olarak değerlendirin. Tescil, parça arama veya araç geçmişi için aracın üzerinde ya da belgelerinde kayıtlı VIN’i kullanın.
