## Data URI neden karşınıza çıkar

Data URI bir dosyayı ve meta verilerini tek bir dizgede toplar. Bu yüzden HTML, CSS, SVG, e-posta şablonları, API yanıtları ve tarayıcı dışa aktarmalarında sık görülür. Küçük varlıklar için kullanışlıdır, ancak elinizde yalnızca kodlanmış değer kaldığında içeriği incelemek zorlaşır.

## Bu dönüştürücü ne sağlar

Tam bir `data:` URI yapıştırarak veriyi tarayıcı içinde yerel olarak çözebilirsiniz. Araç MIME türünü gösterir, yükün Base64 mi yoksa URL kodlu mu olduğunu belirtir, tarayıcı destekliyorsa metin, görsel, ses veya videoyu önizler ve medya türüne göre indirilecek dosya adı önerir.

## Kaydetmeden önce neyi kontrol etmelisiniz

Geçerli bir Data URI bile yanlış MIME türü veya yanıltıcı bir uzantı taşıyabilir. Ayrıntılar panelini beklediğiniz sonuçla karşılaştırın, mümkünse önizlemeyi kontrol edin ve gerekiyorsa indirmeden önce dosya adını değiştirin.
