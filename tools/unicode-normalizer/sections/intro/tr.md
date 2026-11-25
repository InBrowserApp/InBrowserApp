## Unicode metin nasıl normalleştirilir?

Metni **Özgün metin** alanına yazın veya yapıştırın, ardından bir normalleştirme biçimi seçin. Siz yazdıkça veya biçimi değiştirdikçe sonuç güncellenir. Normalleştirilmiş metni başka bir uygulamada kullanmak için **Sonucu kopyala** düğmesine basın. Dönüşüm tarayıcınızda yapılır ve metniniz cihazınızda kalır.

## Hangi Unicode normalleştirme biçimini seçmeliyim?

- **NFC (kanonik birleştirme)** genel metinler için iyi bir varsayılan seçimdir. Birleşik karakter mevcutsa harf ile vurgu işaretini tek bir kod noktasında birleştirir. Saklamadan veya karşılaştırmadan önce eşdeğer yazımları aynı biçime getirmek için kullanabilirsiniz.
- **NFD (kanonik ayrıştırma)** dizileri temel harf ve birleştirici vurgu işareti gibi kanonik bileşenlerine ayırır. İşaretleri tek tek incelemek veya işlemek istediğinizde kullanabilirsiniz.
- **NFKC (uyumluluk birleştirmesi)** tam genişlikli harfler ve ligatürler gibi uyumluluk karakterlerini de eşdeğerleriyle değiştirir. Bu ayrımların önemli olmadığı arama ve eşleştirme işlemlerinde yararlıdır.
- **NFKD (uyumluluk ayrıştırması)** aynı uyumluluk dönüşümlerini uygular ve sonucu ayrıştırılmış biçimde bırakır. Bu özellik metin analizinde işe yarayabilir.

## Normalleştirilmiş metin neden aynı görünebilir?

**é** harfi tek başına `U+00E9` olarak veya **e** harfinin ardından birleştirici akut aksan işareti gelerek (`U+0065 U+0301`) kaydedilebilir. NFC ilk gösterimi, NFD ise ikincisini üretir. İki metin aynı görünse bile ilk karakterlerin hangi sırayla kodlandığını görmek için **Kod noktalarını karşılaştır** bölümünü açın.

Gözle görülebilen değişiklikleri de görmek için **Örnek dene** düğmesine basın. NFKC, **ＡＢＣ ① ﬁ** metnini **ABC 1 fi** biçimine dönüştürür. NFC bu uyumluluk ayrımlarını korur.

## Normalleştirme anlamı ne zaman değiştirebilir?

NFKC ve NFKD, bir formüldeki üst simge veya listedeki daire içine alınmış sayı gibi biçimsel ayrımları kaldırabilir. Bu ayrımlar önemliyse NFC'yi seçin. Büyük ve küçük harf dönüşümü, vurgu işaretlerini kaldırma ve UTF-8 ile UTF-16 gibi kodlamalar arasında dönüşüm ayrı işlemlerdir.

Ayrıntılar için [Unicode standardının normalleştirme biçimleri ekine](https://www.unicode.org/reports/tr15/) bakın.
