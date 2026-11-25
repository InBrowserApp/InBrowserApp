## Toplu test e-posta adresleri oluşturma

Bir alan adı seçin, adres sayısını girin ve **Oluştur** düğmesine basın. Aynı listede farklı alan adları kullanmak için **Herhangi bir örnek alan adı** seçeneğini kullanın. Her adres listede yalnızca bir kez yer alır. Sonuçları bir forma veya elektronik tabloya kopyalayın ya da test verileriniz için her satırda tek adres içeren UTF-8 kodlamalı bir metin dosyası indirin.

## Hangi e-posta alan adlarını kullanabilirim?

Faker.js, `example.com`, `example.net` ve `example.org` alan adlarında adresler oluşturur. Bu [örnekler için ayrılmış alan adları](https://www.iana.org/help/example-domains), belgelerde ve örnek verilerde kullanılır. `alex.morgan42@example.com` adresinde `@` işaretinden önce gelen kısım yerel bölüm, `example.com` ise alan adıdır. Testiniz sabit bir değer bekliyorsa tek bir alan adı kullanın. Filtreleme ve içe aktarmayı sınamak için farklı alan adlarını bir arada kullanın.

## Bu adreslerle neleri test edebilirim?

Bu örneklerle kayıt formu alanlarını, e-posta adresi biçimlerini, hesap listelerini veya veritabanındaki yinelenen kayıtların ayıklanmasını test edin. Araç, posta kutusu açmadan adresleri metin olarak oluşturur. İleti teslimini veya doğrulama bağlantılarını test etmek için kontrolünüzdeki bir posta kutusunu ya da geliştirme amaçlı bir e-posta test ortamını kullanın.
