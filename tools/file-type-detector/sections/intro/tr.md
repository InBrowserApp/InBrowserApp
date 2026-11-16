## Dosya Türü Algılama Nasıl Çalışır?

Bu araç, yerel bir dosyanın en fazla ilk 64 KiB bölümünü okur ve ikili
imzasını [file-type](https://github.com/sindresorhus/file-type) ile kontrol eder.
Sonuç; algılanan MIME türünü, beklenen uzantıları ve ilk 256 baytın onaltılık
ve ASCII önizlemesini içerir. Hiçbir şey yüklenmez.

## Uzantı Neden Uyuşmayabilir?

Bir dosyayı yeniden adlandırmak içeriğini değil, adını değiştirir. photo.jpg
adlı bir PNG'nin imzası hâlâ PNG'dir. .jpg ve .jpeg gibi yaygın alternatif
uzantılar kabul edilir. Tarayıcının bildirdiği MIME türü ayrı gösterilir;
çünkü tarayıcı genellikle baytları incelemek yerine dosya adını esas alır.

## Algılama Sınırları

İmzalar birer ipucudur; dosyanın geçerli veya güvenli olduğunun kanıtı değildir.
TXT, CSV ve SVG gibi metin biçimleri tanınmayabilir. Kısa bir örnek, Office
belgesi gibi bir alt türü doğrulayamadan ZIP veya başka bir kapsayıcıyı
tanımlayabilir. Onaltılık önizleme, ham dosya içeriğidir; kriptografik bir
sağlama toplamı değildir.
