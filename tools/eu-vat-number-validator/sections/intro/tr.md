## AB KDV numarası nedir?

KDV kimlik numarası, Katma Değer Vergisi için kayıtlı işletmelere bir AB üye devleti tarafından verilir. İki harfli bir ülke kodu ile başlar (örneğin Belçika için `BE` veya Yunanistan için `EL`), ardından ülkeye özgü rakam ve bazen harflerden oluşan bir dizi gelir. Vergi makamları bunu sınır ötesi ticareti ve iade taleplerini izlemek için kullanır; bu nedenle faturalar, sözleşmeler veya satın alma kayıtlarındaki hatalar bir ödemeyi kolayca engelleyebilir veya bir denetimi tetikleyebilir.

## Bu araç aslında neyi kontrol eder

Bu denetleyici, tamamı tarayıcınızda çalışan üç bağımsız doğrulama yürütür:

1. **Ülke kodu** — baştaki iki harf, KDV sistemine katılan bir AB üye devletiyle eşleşmelidir (Yunanistan için kullanılan özel `EL` kodu dahil).
2. **Biçim** — kalan karakterler, ülkenin belgelenmiş KDV biçimiyle eşleşmelidir. Örneğin, Belçika KDV'si tam olarak on basamaktır, Avusturya KDV'si `U` ile başlar ve ardından sekiz basamak gelir, Hollanda KDV'si ise `<dokuz basamak>B<iki basamak>` biçimindedir.
3. **Sağlama toplamı** — ülkenin KDV kurallarında belirleyici bir sağlama toplamı mevcut olduğunda (Avusturya, Belçika, Danimarka, Finlandiya, Fransa, Almanya, İtalya, Hollanda, Polonya, Portekiz, İspanya, İsveç), son basamak veya harf yeniden hesaplanır ve karşılaştırılır.

Üçünü de geçen bir numara sözdizimsel olarak iyi biçimlendirilmiştir. Bu, işletmenin şu anda kayıtlı olduğunu doğrulamakla aynı şey değildir — bunun için hâlâ Avrupa Komisyonu'nun VIES hizmetine veya yerel vergi dairesine ihtiyacınız vardır. Bu araç en iyi şekilde o son kontrolden önce kullanılır: bir VIES sorgusunun yanlış nedenle başarısız olmasına yol açan yazım hatalarını, yer değiştirmiş basamakları ve kopyala-yapıştır hatalarını yakalamak için.

## Sıklıkla yakaladığı sorunlar

- İlk bakışta doğru görünen ancak bir ülke eksik olan numaralar (örneğin `US` veya `UK` ile başlayanlar).
- Bir elektronik tablo tarafından kırpılan ve bir basamak eksik kalan öndeki sıfırlar.
- Bir faturalama sistemi tarafından yapıştırılan boşluklar, noktalar veya tireler — araç bunları normalleştirip sonucu kontrol eder.
- Klasik Yunanca `GR` ile KDV `EL` karışıklığı; biçim kontrolü bunu hemen reddeder.

## Sonuç kartı neyi gösterir

Basit bir geçerli/geçersiz rozetinin ötesinde, sonuç ülkeyi, normalleştirilmiş numarayı, ülkenin beklediği biçimi ve sağlama toplamının geçip geçmediğini, başarısız olup olmadığını veya ülke bir sağlama toplamı yayımlamadığı için atlanıp atlanmadığını ayrıntılı olarak gösterir. Bu ayrıntı, bir reddi açıklamanız gerektiğinde işe yarar — "biçim tamam, sağlama toplamı uyuşmuyor" ifadesi "geçersiz" demekten çok daha eyleme geçirilebilirdir.

## Gizlilik

Her kontrol tarayıcınızda yerel olarak çalışır. Hiçbir şey bir sunucuya gönderilmez, kayda alınmaz veya kendi tarayıcınızın localStorage'ı dışında bir yerde saklanmaz (yazdığınız son girdi sayfa yeniden yüklendiğinde hayatta kalsın diye). Bir müşterinin KDV numarasını nereye gideceğinden endişelenmeden yapıştırabilirsiniz.
