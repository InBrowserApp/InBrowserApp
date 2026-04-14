## NanoID nedir?

NanoID, modern web uygulamaları, API'ler ve dahili araçlar için tasarlanmış, URL açısından güvenli ve kompakt bir benzersiz kimlik oluşturucudur. Varsayılan biçim, 64 karakterlik bir alfabeden 21 karakter kullanır; bu da URL'ler, dosya adları ve test verileri için yeterince kısa kalırken yaklaşık 126 bit rastgelelik sağlar.

Bu araçtaki her şey tarayıcınızda yerel olarak çalışır. Özel alfabeniz ve üretilen kimlikler sayfadan dışarı çıkmaz; bu da aracı hızlı prototipleme, fixture üretimi ve tek seferlik operasyonel işler için kullanışlı kılar.

**Temel noktalar:**

- **URL güvenli**: A-Z, a-z, 0-9, - ve \_ kullanır.
- **Özelleştirilebilir**: Uzunluğu ve alfabeyi kısıtlarınıza göre ayarlayın.
- **Güvenli rastgelelik**: Tarayıcıda kriptografik olarak güvenli rastgele değerler kullanır.
- **Düz metin dışa aktarma**: Seed verileri, demo içeriği veya içe aktarmaya hazır listeler gerektiğinde mevcut partiyi kopyalayabilir ya da indirebilirsiniz.

**Pratik öneriler:**

- Çok düşük çakışma olasılığına sahip güçlü, genel amaçlı bir tanımlayıcı istiyorsanız varsayılan 21 karakter uzunluğunu koruyun.
- Daha kısa kimlikler geçici UI token'ları veya yerel mock veriler için uygundur; ancak uzunluk azaldıkça ya da parti boyutu büyüdükçe çakışma riski artar.
- Daha büyük bir alfabe karakter başına daha fazla entropi sağlar; bu yüzden çoğu zaman benzersizlikten çok fazla ödün vermeden kimlikleri daha kısa tutabilirsiniz.
- Özel alfabeler yalnızca benzersiz karakterler içermelidir. Yinelenen karakterler dağılımı bozar; bu araç da sonuç üretmeden önce bunları engeller.
