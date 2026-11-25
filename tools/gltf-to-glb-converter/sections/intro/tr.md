## glTF modelini tek bir GLB dosyasına dönüştürme

`.gltf` modelini, `.bin` arabelleklerini ve dokularını birlikte seçmek için **Dosyaları aç** düğmesine tıklayın. Dokular alt klasörlerdeyse **Klasör aç** düğmesini kullanın. Böylece dönüştürücü, modelde belirtilen yolları izleyebilir. Verileri zaten gömülü glTF dosyaları da desteklenir. Animasyonlu bir piramidi paketlemek için **Örnek dene**, ardından **GLB indir** düğmesine tıklayın. Dosyalar tarayıcınızda işlenir.

## Eksik arabellek veya doku ekleme

JSON biçimindeki bir `.gltf` dosyası `model.bin` ya da `textures/albedo.png` gibi kaynaklara başvurabilir. Dönüştürücü, bulamadığı dosyaların yollarını listeler. Model açıkken eksik kaynakları eklemek için **Dosya ekle** düğmesine tıklayın. Dosyaların özgün adlarını koruyun. Ayrı klasörlerde aynı adlı dosyalar varsa dönüştürücünün dosya yollarını okuyabilmesi için modeli ve başvurulan dosyaları içeren klasörü seçin.

## GLB dosyasını paylaşma ve inceleme

GLB, geometriyi, desteklenen dokuları ve modelin başvurduğu diğer standart verileri dosyaya gömer. Ağlar, malzemeler ve animasyon klipleri korunur. Paketleme, dokuların özgün kodlamasını ve ağ sıkıştırmasını korur. Bu nedenle dosyayı açacağınız yazılımın bu biçimleri desteklemesi gerekir. PNG ve JPEG dokular en geniş glTF yazılım desteğine sahiptir. Boyutları, malzemeleri ve animasyonu incelemek için yalnızca indirdiğiniz dosyayı [GLB / glTF Görüntüleyici](../gltf-viewer/) aracında açın. [glTF 2.0 dosya biçimi](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
