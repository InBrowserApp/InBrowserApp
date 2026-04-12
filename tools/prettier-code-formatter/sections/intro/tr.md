## Prettier Kod Biçimlendirici Nedir?

Prettier Kod Biçimlendirici, resmi Prettier standalone akışını doğrudan
tarayıcınızda çalıştırır; böylece kaynak dosyaları kodu bir sunucuya göndermeden
düzenleyebilirsiniz. Hızlı bir biçimlendirme yapmak, farklı satır genişliği
ayarlarını karşılaştırmak veya hemen kopyalanıp indirilebilecek temiz bir dosya
elde etmek istediğinizde kullanışlıdır.

## Desteklenen Biçimler

Bu yeniden yazım, aracı Prettier'ın tarayıcıda zaten iyi desteklediği biçimlere
odaklı tutar: JavaScript, TypeScript, Flow, JSON, HTML, CSS, SCSS, Less,
Markdown, MDX, YAML, GraphQL ve Vue ile Handlebars gibi ilgili şablon biçimleri.
Dil seçici hangi ayrıştırıcının çalışacağını belirler; bir dosya içe
aktarılırsa, uzantı tanınabildiğinde ayrıştırıcı otomatik olarak algılanır.

## Bu Yeniden Yazım Nasıl Çalışır?

Yeniden yazım, ağır biçimlendirme mantığını ana kullanıcı arayüzü yolunun
dışında tutar. Biçimlendirme istekleri saf, araç yerel yapılandırmadan
oluşturulur ve ardından tembel yüklenen iş parçacığı destekli bir Prettier
akışında çalıştırılır; böylece normal yazma işlemi akıcı kalır. Büyük girdiler
otomatik biçimlendirmeyi duraklatır ve daha öngörülebilir bir `Şimdi
biçimlendir` eylemine geçer.
