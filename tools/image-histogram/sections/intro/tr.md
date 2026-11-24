## Görsel histogramı nasıl görüntülenir?

Bir fotoğraf, ekran görüntüsü veya çizim seçin ya da dosyayı sürükleyip bırakın. Histogram, görselin yanında açılır. Örnek fotoğrafı da deneyebilirsiniz. Önce **Parlaklık** görünümünde genel ton dağılımına bakın. Ardından **RGB** görünümüne geçerek kırmızı, yeşil ve mavi kanalları aynı ölçekte karşılaştırın. Ayrıntılı inceleme için tek bir kanal seçin.

## Gölgeler, orta tonlar ve açık tonlar nasıl okunur?

Yatay eksen 0'dan (en koyu) 255'e (en açık) uzanır. Gölgeler solda, orta tonlar ortada, açık tonlar sağdadır. Bir çubuk ne kadar yüksekse o düzeyde o kadar çok piksel vardır. Tam piksel sayısını görmek için imleci grafiğin üzerinde gezdirin, grafiğe dokunun veya ok tuşlarıyla düzey kaydırıcısını hareket ettirin.

Grafiğin iki ucundan birindeki sivri tepe, ayrıntıların kaybolduğu gölge veya açık ton kırpılmasına işaret edebilir. Örneğin kırmızı kanalda 255 düzeyindeki bir tepe, parlaklık histogramı sağ uca ulaşmasa bile bu kanalın kırpıldığını gösterebilir. Bembeyaz bir arka plan da uçta tepe oluşturabilir, bu yüzden görsel önizlemesine bakın. **Gölgeler** ve **Açık tonlar** göstergeleri, analiz edilen piksellerin yüzde kaçının tam olarak 0 ve 255 düzeyinde olduğunu gösterir.

## Logaritmik ölçek ne zaman kullanılır?

**Doğrusal** ölçekte çubukların yüksekliği piksel sayısıyla doğru orantılıdır. Tek renkli geniş bir alan histogramın kalanını okumayı zorlaştırıyorsa **Logaritmik** ölçeği deneyin. Ölçek seçimi çubukların yüksekliğini etkiler. Her düzeyin tam piksel sayısını grafikten okuyabilirsiniz.

## Görüntüleyici neyi ölçer?

Görüntüleyici, tarayıcının özgün boyutunda işlediği 8 bitlik görselin piksellerini sayar. Parlaklık, kırmızı, yeşil ve mavi kanalların ağırlıklı birleşiminden hesaplanır. En yüksek ağırlık yeşil kanala verilir. Tamamen saydam pikseller atlanır, kısmen saydam piksellerin her biri bir kez sayılır. İşleme sırasında bu piksellerin RGB değerleri yuvarlanabilir. Animasyonlu görsellerde tek bir durağan kare analiz edilir. Görselleriniz cihazınızda işlenir.
