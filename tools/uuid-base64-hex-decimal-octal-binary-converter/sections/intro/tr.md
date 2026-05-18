## Bu araç neyi dönüştürür

Bu dönüştürücü, UUID'yi gerçekte olduğu 128 bit değer olarak ele alır ve yaygın
gösterimleri eşitlenmiş halde tutar. Bir UUID, Base64 değeri, onaltılık dize,
ondalık tam sayı, sekizlik değer veya ikilik değer yapıştırın; diğer biçimler
tarayıcınızda yerel olarak güncellenir.

## Biçimler nasıl okunur

UUID alanı kanonik tireli biçimi gösterir. Onaltılık, aynı 16 baytın 32 küçük
harfli onaltılık basamak olarak gösterimidir. Base64, UUID'nin metin
karakterleri için değil, ham 16 bayt için standart dolgulu Base64'tür.
Ondalık, sekizlik ve ikilik, UUID'yi işaretsiz tek bir 128 bit tam sayı olarak
gösterir; ikilik çıktı baştaki sıfırların görünür kalması için 128 bitin
tamamına soldan sıfırlarla doldurulur.

## Nelere dikkat edilmeli

128 bit UUID aralığının dışındaki değerler reddedilir. Base64 girişi tam olarak
16 bayta çözülmelidir. Dönüştürücü; büyük harfli UUID'ler, `urn:uuid:` önekleri,
süslü parantezler, kompakt 32 onaltılık UUID'ler, uzun sayısal değerlerin
çevresindeki boşluklar ve URL güvenli Base64 gibi yaygın yapıştırılmış
varyantları kabul eder. Dönüştürürken veya örnek UUID oluştururken hiçbir şey
yüklenmez.
