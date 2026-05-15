# UUID çözücü nedir?

Bir UUID çözücü, bir UUID'nin (Universally Unique Identifier) içindeki yapıyı açıklar. Yaygın yapıştırılmış biçimleri normalleştirir, değerin 128 bitlik bir UUID olduğunu denetler ve sürümü, varyantı, ham onaltılık baytları ve kopyalamaya hazır sayısal gösterimleri gösterir.

UUID'ler genellikle opak dizeler olarak ele alınır, ancak sürüm yarım baytı tanımlayıcının nasıl oluşturulduğunu söyler. Sürüm 4 UUID'ler rastgeledir, sürüm 3 ve 5 ada dayalı özetlerdir; 1, 6 ve 7 gibi zaman sıralı sürümler zaman damgası bilgisi taşıyabilir.

## Ne zaman kullanılır?

Bu aracı loglardan, veritabanlarından, API'lerden, iz kayıtlarından veya test verilerinden gelen bir tanımlayıcıyı incelemeniz gerektiğinde kullanın. Bir UUID'nin rastgele mi yoksa zamana dayalı mı olduğunu doğrulamak, başka bir sistem için ondalığa veya Base64'e dönüştürmek ve bir UUID v1 veya v6 düğüm alanının MAC tarzı bir tanımlayıcıyı açığa çıkarıp çıkaramayacağını görmek için yararlıdır.

Çözücü tarayıcınızda çalışır ve UUID değerlerini bir sunucuya göndermez. Kanonik UUID'leri, `urn:uuid:` değerlerini, süslü parantezli UUID'leri, büyük harfli girdiyi ve tire içermeyen 32 karakterlik onaltılık UUID'leri kabul eder.

## Dikkat edilmesi gerekenler

UUID sürüm ve varyant alanları bit yerleşimini açıklar; tanımlayıcının pratikte küresel olarak benzersiz olup olmadığını göstermez. Geçerli görünen bir UUID, kötü üretilmişse veya yanlışlıkla kopyalanmışsa yine de yinelenebilir.

Sürüm 1 ve sürüm 6 UUID'lerde düğüm alanı bir MAC adresi gibi görünebilir. Modern üreticiler bunun yerine multicast bitini ayarlayıp rastgele bir düğüm kullanabilir; bu yüzden üreticiyi kontrol etmiyorsanız bunu bir düğüm tanımlayıcısı olarak değerlendirin.
