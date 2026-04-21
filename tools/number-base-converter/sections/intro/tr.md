Bu araç tam sayıları tarayıcı içinde ikili, sekizli, onlu, onaltılı, Base32, Base36, Base62, Base64 ve 2 ile 64 arasındaki özel tabanlar arasında dönüştürür. Tüm hesaplama BigInt ile yerelde yapılır, böylece büyük değerleri sunucuya göndermeden inceleyebilirsiniz.

## Ne zaman kullanılır

Aynı tam sayı günlüklerde, protokollerde, kimliklerde veya teknik dokümanlarda farklı alfabelerle görünüyorsa bu araç faydalıdır. Herhangi bir alanı düzenlediğinizde diğer tüm alanlar anında yeniden hesaplanır; bu da hata ayıklama, dokümantasyon ve elle doğrulama için kullanışlıdır.

## Taban farkları

36 tabana kadar harfler büyük/küçük harf ayrımı olmadan kabul edilir. Daha yüksek tabanlar büyük ve küçük harfleri farklı rakamlar olarak ele alır; buradaki Base64 satırı da bayt odaklı Base64 metin kodlaması değil, sayısal alfabe `A-Z a-z 0-9 + /` kullanır.

## Dikkat edilmesi gerekenler

Yalnızca negatif olmayan tam sayılar desteklenir. Baştaki sıfırlar biçimlendirme sayılır; bu nedenle dönüştürülen çıktı normalize edilir ve girdiğiniz dolgu sıfırları korunmayabilir.
