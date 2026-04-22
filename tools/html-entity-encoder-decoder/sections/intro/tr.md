## Bu araç ne yapar

- Düz metni isimli, ondalık veya onaltılık HTML entity biçimine dönüştürür.
- Entity içeren parçaları tekrar okunabilir metne çözer.
- Her şey tarayıcıda yerel olarak çalışır, bu yüzden verileriniz cihazdan
  çıkmaz.

## Ne zaman kullanılır

- HTML'yi dokümana, şablona veya demoya yapıştırmadan önce özel karakterleri
  escape etmek için.
- `&amp;`, `&#60;` veya `&#x3C;` içeren kopyalanmış işaretlemeyi incelemek için.
- Uyumluluk ihtiyaçları için isimli, ondalık ve onaltılık entity biçimlerini
  karşılaştırmak için.

## Entity biçimleri hakkında notlar

- İsimli entity'ler en okunabilir seçenektir, ancak her karakterin isimli
  karşılığı yoktur.
- Ondalık ve onaltılık entity'ler emoji dahil her Unicode karakterini
  gösterebilir.
- Bilinmeyen veya geçersiz entity'ler çözülürken olduğu gibi bırakılır.
