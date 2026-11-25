## Test için posta kodları oluşturma

Bir ülke veya bölge seçin, istediğiniz kod sayısını girin ve **Oluştur** düğmesine basın. Listenin tamamını kopyalayabilir veya her satırda bir posta kodu bulunan UTF-8 kodlamalı bir metin dosyası indirebilirsiniz. Sonuçları test formlarını doldurmak, örnek veri hazırlamak ya da ödeme ve kayıt formlarında yerel posta kodlarının nasıl görüntülendiğini kontrol etmek için kullanabilirsiniz.

## Posta kodu biçimlerini karşılaştırma

Posta kodlarında harfler, boşluklar, kısa çizgiler veya başta sıfırlar bulunabilir. ABD’de bir ZIP kodu `02108` biçiminde olabilir. ZIP+4 biçimi buna kısa çizgi ve dört rakam ekler, örneğin `02108-1234`. Birleşik Krallık’ta posta kodu `SW1 2AB`, Kanada’da `K1A 0B1`, Japonya’da `100-0001`, Brezilya’da ise CEP `01001-000` biçiminde olabilir. Oluşturulan kodların biçimini sayfanın dilinden bağımsız olarak seçtiğiniz ülke veya bölge belirler.

Sonuçları bir elektronik tabloya veya veritabanına aktarırken posta kodlarını metin olarak saklayın. `02108` değerini sayı olarak içe aktarırsanız başındaki sıfır silinir ve değer değişir.

## Sonuçları posta gönderiminde kullanabilir miyim?

Faker.js seçilen biçimde örnek kodlar oluşturur. Bu kodlardan bazıları gerçek bir dağıtım bölgesine denk gelebilir. Posta gönderirken gerçek adresin posta kodunu ilgili posta hizmetinden sorgulayın.
