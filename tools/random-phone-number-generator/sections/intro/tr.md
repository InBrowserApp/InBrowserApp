## Toplu olarak örnek telefon numarası oluşturun

Ülke veya bölgeyi ve numara biçimini seçin, adedi girin ve **Oluştur** düğmesine tıklayın. Sonuçları bir forma kopyalayın veya her satırında bir numara bulunan `UTF-8` kodlu bir metin dosyasını indirin. Bu numaralarla form giriş maskelerini kontrol edebilir, örnek kişi listeleri doldurabilir ya da uygulamanızın telefon numaralarını nasıl saklayıp gösterdiğini test edebilirsiniz.

## Ulusal veya uluslararası biçimi seçin

**Ulusal** seçeneği, seçtiğiniz ülke için Faker.js'in sunduğu biçimlerden birini kullanır. Örneğin ABD numarası `(202) 555-0100`, Birleşik Krallık numarası ise `07700 900123` biçiminde görünebilir. **Uluslararası (E.164)** biçiminde artı işaretini ülke arama kodu ve kalan rakamlar izler. Aralarında boşluk bulunmaz. Örnekler arasında `+12025550100` ve `+447700900123` yer alır.

## Artı işaretini ve baştaki sıfırları koruyun

Telefon numaralarını elektronik tablolarda ve veritabanlarında metin olarak saklayın. Bir elektronik tablo `07700 900123` veya `+447700900123` değerini sayı olarak içe aktarırsa baştaki sıfır veya artı işareti kaybolabilir. Bu numaralar biçim testleri için örnektir. Arama veya SMS testi için kontrolünüzdeki bir test numarasını kullanın.
