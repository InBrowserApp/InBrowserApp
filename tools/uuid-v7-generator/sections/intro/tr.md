UUID v7, tanımlayıcının başına Unix milisaniye zaman damgası yerleştiren ve kalan bitleri rastgelelikle dolduran modern bir UUID biçimidir. Bu, değerleri pratikte küresel olarak benzersiz kılarken oluşturulma zamanına göre doğal biçimde sıralanabilir tutar.

## Bu Araç Ne Yapar?

Bu oluşturucu UUID v7 değerlerini tamamen tarayıcınızda oluşturur. Tek bir tanımlayıcı veya 100'e kadar toplu değer oluşturabilir, ardından listeyi kopyalayabilir ya da tohum verisi, veritabanı kayıtları, etkinlik sabitleri veya test yükleri için metin dosyası olarak indirebilirsiniz.

## Geçerli Veya Özel Zaman

Normal uygulama kayıtları, içe aktarma anahtarları ve oluşturuldukları zamanı yansıtması gereken test verileri için geçerli zamanı kullanın. Belirli bir anın etrafında sıralanması gereken deterministik görünümlü örneklere, sonradan doldurulan satırlara, yeniden oynatılan olaylara veya sabit test verilerine ihtiyaç duyduğunuzda özel zaman damgasına geçin.

## UUID v7 Ne Zaman Yardımcı Olur?

UUID v7; veritabanlarında, günlüklerde, kuyruklarda ve dağıtık etkinlik akışlarında iyi sıralanan opak tanımlayıcılar istediğinizde kullanışlıdır. Rastgele UUID v4 değerleriyle karşılaştırıldığında UUID v7, daha yeni kayıtlar sıralı anahtar alanının sonuna yakın görünme eğiliminde olduğu için dizin hareketliliğini azaltır.

## Sıralanabilirlik ve Güvenlik Notları

Zaman damgası bölümü milisaniyeleri kaydeder; özel veya gizli bir değer değildir. Bir tanımlayıcının yaklaşık oluşturulma zamanını açığa çıkarmaması gerekiyorsa bunun yerine tamamen rastgele bir biçim kullanın. Bu araç, tek bir toplu üretimde aynı milisaniye için değerleri monoton tutarken UUID v7 sürüm ve varyant bitlerini korur.
