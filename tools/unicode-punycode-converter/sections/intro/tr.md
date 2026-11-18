## Unicode alan adları ile Punycode arasında dönüştürün

`bücher.com` gibi bir alan adını **Unicode Alan Adı** kutusuna yapıştırdığınızda **ASCII Alan Adı** kutusunda `xn--bcher-kva.com` görünür. `xn--` ile başlayan bir alan adını Unicode olarak okumak için **ASCII Alan Adı** kutusuna yapıştırın. Siz yazarken iki alan da güncellenir ve iki biçimi de kopyalayabilirsiniz.

## Hangi biçim ne zaman kullanılır?

Punycode, uluslararası alan adlarındaki (IDN) ASCII dışı karakterleri ASCII harfleri, rakamlar ve kısa çizgilerle gösterir. Dönüştürülen etiket `xn--` ile başlar, `com` gibi ASCII etiketleri olduğu gibi kalır. DNS veya barındırma ayarları ASCII istediğinde bu biçimi kullanın. Bir günlük veya yapılandırma dosyasındaki alan adını okumak için Unicode biçimine dönüştürün.

## Dönüştürücüye ne yapıştırılır?

Yalnızca ana makine adını girin. Örneğin `https://bücher.com/catalog` adresi için `bücher.com` yazın. Alt alan adları da desteklenir. Örneğin `www.bücher.com`, `www.xn--bcher-kva.com` olur.
