## GLB veya glTF modeli çevrimiçi nasıl açılır?

**Dosyaları aç** düğmesine tıklayın veya modeli görüntüleyiciye bırakın. `.glb` dosyası bir glTF sahnesini ikili bir kapsayıcıda saklar ve çoğu zaman dokularla geometriyi aynı dosyada içerir. `.gltf` dosyası sahneyi JSON olarak tanımlar ve başka dosyalara başvurabilir. Dışa aktarımda `model.bin` ve `albedo.png` gibi dosyalar oluştuysa bunları `model.gltf` ile birlikte seçin. Görüntüleyici dosyaları cihazınızda okur.

## Malzemeleri inceleme ve animasyonları oynatma

Modeli döndürmek için sürükleyin. Yakınlaştırmak veya uzaklaştırmak için fare tekerleğini kullanın ya da iki parmağınızı açıp kapatın. Sahnenin tamamını yeniden görmek için **Ekrana sığdır** düğmesine tıklayın. Malzemelerin altındaki üçgenleri incelemek için **Tel kafes** seçeneğini açın. Dosyada animasyon klipleri varsa bir klip seçin ve **Animasyonu oynat** düğmesine tıklayın. **Örnek dene** düğmesi animasyonlu bir model açar.

## İlgili dosyaları eksik olan modeli açma

Model dosyası harici bir arabellek dosyasına veya görsele başvuruyorsa modeli ve ilgili dosyaları birlikte seçin. Dosyaların özgün adlarını koruyun. Model, görüntüleyicinin açamadığı bir doku sıkıştırma uzantısı kullanıyorsa PNG veya JPEG dokularla yeniden dışa aktarın. İki kapsayıcı hakkında ayrıntılar için [glTF 2.0 belirtimine](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) bakın.

## Diğer 3B dosya biçimlerini görüntüleme

MTL malzemeleri içeren Wavefront ağlarını [OBJ Görüntüleyici](../obj-viewer/) aracında açın. 3B baskıdan önce üçgen ağı incelemek için [STL Görüntüleyici](../stl-viewer/) aracını kullanın.

- [3MF Görüntüleyici](../3mf-viewer/)
