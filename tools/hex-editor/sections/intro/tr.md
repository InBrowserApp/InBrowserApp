## İkili dosyaları çevrimiçi görüntüleyin ve düzenleyin

Yerel bir dosyayı Onaltılık Düzenleyici'de açın veya buraya sürükleyip bırakın. Baytların düzenini keşfetmek için **Örneği dene** seçeneğini de kullanabilirsiniz. Bir dosya başlığını incelemek, PNG dosyasındaki `89 50 4E 47` gibi bir sihirli sayıyı kontrol etmek, yazdırılamayan baytları incelemek veya belirli bir konumdaki bilinen bir değeri değiştirmek için bu aracı kullanın.

## Ofsetleri, onaltılık baytları ve ASCII'yi okuyun

Soldaki ofset, o satırdaki ilk baytın sıfırdan başlayan konumudur. Ortada her bayt, `00` ile `FF` arasında iki onaltılık rakamla gösterilir. ASCII sütunu aynı baytlara karşılık gelen yazdırılabilir karakterleri gösterir; diğer değerler için nokta kullanır. Örneğin `48 65 6C 6C 6F` baytları `Hello` olarak görünür.

Doğrudan 26. ofsetteki bayta atlamak için `1A` veya `0x1A` gibi onaltılık bir ofset girin. Yakındaki baytlara göz atmak için sayfa kontrollerini kullanın. Düzenleyici bir seferde bir sayfa okur; böylece büyük bir dosyanın küçük bir bölümünü inceleyebilirsiniz.

## Baytların üzerine yazın ve bir kopya kaydedin

Onaltılık bir bayt seçin ve iki rakam girin. Düzenleyici, karşılık gelen ASCII karakterini günceller ve sonraki bayta geçer. Baytlar arasında gezinmek için ok tuşlarını, değişiklikleri geri almak veya yeniden uygulamak için **Geri al** ya da **Yinele** seçeneğini kullanın. Üzerine yazmak dosyanın uzunluğunu ve diğer baytların konumlarını değiştirmez.

Sonucu kaydetmek için **Kopyayı indir** seçeneğini kullanın. Orijinal dosya değişmeden kalır; tüm okuma ve düzenleme işlemleri tarayıcınızda gerçekleşir.
