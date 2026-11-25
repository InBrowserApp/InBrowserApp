## Bir aralıkta rastgele takvim tarihleri oluşturun

**Başlangıç tarihi** ve **Bitiş tarihi** alanlarını doldurun, bir çıktı biçimi seçin ve **Oluştur** düğmesine basın. Başlangıç ve bitiş tarihleri aralığa dahildir. Örneğin `2024-02-28` ile `2024-03-01` arasında, artık yılın ek günü olan `2024-02-29` da seçilebilir. Aynı tarih bir grupta birden fazla kez çıkabilir. Sonuçları kopyalayın veya her satırda bir tarih bulunan `UTF-8` metin dosyasını indirin.

## ISO biçimini veya sayfanın diline uygun biçimi seçin

Test verileri, elektronik tablolara aktarım veya tarihleri metin olarak kronolojik sıraya koymak için **ISO (YYYY-MM-DD)** biçimini kullanın. Miladi tarihi sayfanın dilinde göstermek için **Sayfanın dilinde tarih** seçeneğini kullanın. Örneğin `2024-02-29`, İngilizce sayfada `Feb 29, 2024`, Almanca sayfada ise `29.02.2024` olarak görünür.

## Saat dilimi değişse de takvim günü aynı kalır

Aralıktaki günlerin başlangıcı ve sonu Eşgüdümlü Evrensel Zaman (UTC) esas alınarak belirlenir. Böylece aralığın iki ucundan birinde seçilen tarih, oluşturucuyu nerede açarsanız açın aynı takvim gününde kalır. Başlangıç ve bitiş için aynı tarihi kullanırsanız her sonuç o tarih olur. Bu, artık yılın ek gününü veya bir ayın ilk ya da son gününü test ederken işe yarar.
