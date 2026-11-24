## Bir ses dosyasındaki frekansları inceleyin

Düşük frekanslı bir uğultuyu bulmak, kayıtların frekans içeriğini karşılaştırmak veya kayıtta yüksek frekansların nerede azaldığını görmek için ses spektrumu analiz aracını kullanın. Grafik frekansı hertz (Hz), seviyeyi ise sayısal tam ölçeğe göre desibel (dBFS) cinsinden gösterir. Tepeler, incelenen kayıtta enerjinin en yoğun olduğu frekans bantlarını gösterir.

## Bir ses spektrumu nasıl görüntülenir?

1. Mono veya stereo bir WAV, MP3, M4A, FLAC ya da OGG dosyası seçin veya sürükleyip bırakın. Hangi dosyaların çözümlenebileceği tarayıcınıza bağlıdır.
2. Baskın frekansı bulun. Başka bir frekansı ve seviyesini okumak için grafikte bir noktayı işaretleyin veya o noktaya dokunun. Kaydırıcıyı klavyeyle hareket ettirerek aynı değerleri okuyabilirsiniz.
3. Gerektiğinde logaritmik ve doğrusal ölçekler arasında geçiş yapın. Grafiği incelerken orijinal kaydı oynatıp dinleyebilirsiniz. Analiz ve oynatma cihazınızda yapılır.

## FFT grafiği nasıl okunur?

Araç sesin kodunu 48 kHz örnekleme hızıyla çözer. Dosyanın farklı yerlerinden kısa bölümler alır, bu bölümlere Hann penceresi uygular ve hızlı Fourier dönüşümüyle (FFT) analiz eder. Güç değerlerini ortalayıp stereo kanalları güce göre birleştirir. Böylece iki kanalda fazı farklı olan sesler de grafikte görünür. Grafik 24 kHz’e kadar uzanır. Grafikteki değerler ayrı frekans aralıklarına aittir ve kaydın genel ses yüksekliğinden, örnek tepe seviyesinden veya entegre LUFS değerinden farklıdır.

50 veya 60 Hz yakınındaki keskin bir tepe, elektrik şebekesinden kaynaklanan bir uğultuya işaret edebilir. Yüksek frekanslardaki ani düşüş filtreleme ya da sıkıştırmadan kaynaklanabilir. Tek bir tepe bir harmoniğe ait olabilir. Nota perdesini belirlemeden önce yakınındaki diğer tepelere de bakın.

## Logaritmik veya doğrusal ölçeği ne zaman kullanmalıyım?

Logaritmik ölçek, bas ve orta frekanslara daha çok yer ayırır ve oktavların takibini kolaylaştırır. Doğrusal ölçekte Hz cinsinden eşit farklar aynı uzaklıkta gösterilir. Bu ölçek, aralıkları eşit harmonikleri karşılaştırmayı kolaylaştırır. Bu grafik kaydın genel frekans içeriğini özetler. Bir sesin ne zaman ortaya çıktığını veya frekansının zamanla nasıl değiştiğini görmek için spektrogram kullanabilirsiniz.
