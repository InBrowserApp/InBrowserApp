## chmod nedir?

`chmod` ("change mode"), dosya ve dizin izinlerini değiştirmek için kullanılan bir Unix/Linux komutudur. Bu hesaplayıcı, `755` gibi sayısal izinler, `rwxr-xr-x` gibi sembolik izinler ve onay kutusu matrisi arasında elle hesap yapmadan geçiş yapmanızı sağlar.

## Sayısal izinler nasıl çalışır?

Her basamak bir rolü temsil eder: sahip, grup ve diğerleri. Tek bir basamak içinde `4` okuma, `2` yazma ve `1` çalıştırma anlamına gelir. İstediğiniz izni oluşturmak için değerleri toplayın: `7 = rwx`, `6 = rw-`, `5 = r-x` ve `4 = r--`. Dizinlerde çalıştırma biti ayrıca dizine girebilmeyi de sağlar.

## Yaygın chmod örnekleri

- `chmod 755 script.sh` sahibine tam erişim verir ve diğer herkesin okumasına ve çalıştırmasına izin verir.
- `chmod 644 notes.txt` dosyayı sahibi için yazılabilir tutarken diğerlerinin yalnızca okumasına izin verir.
- `chmod 600 .env` yalnızca sahibin okuyup yazabilmesi nedeniyle özel gizli bilgiler için yaygın bir seçimdir.
- `chmod 775 shared-folder` grup üyelerinin de dosya oluşturup değiştirmesi gereken ekip dizinleri için kullanışlıdır.
