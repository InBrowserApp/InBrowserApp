## Ses kaydı nasıl metne dönüştürülür?

Toplantı kaydını, röportajı, ders kaydını, podcast'i veya sesli notu araca sürükleyip bırakın. Otomatik dil algılamayı açık bırakın veya biliyorsanız kayıtta konuşulan dili seçin. Bir Whisper modeli seçin ve **Sesi metne dönüştür** düğmesine basın. Döküm hazır olduğunda, kaydın ilgili bölümünü dinlemek için zaman damgasını seçin. Metni kopyalamadan veya indirmeden önce isimleri, noktalama işaretlerini ve yanlış tanınan sözcükleri düzeltebilirsiniz.

Araç, tarayıcınızın çözebildiği ses biçimlerini okur. MP3, WAV, M4A, FLAC, OGG ve WebM yaygın örneklerdir. Kodek desteği tarayıcıya göre değişir. Dosya açılmıyorsa kaydı kaydettiğiniz uygulamadan WAV veya MP3 olarak dışa aktarmayı deneyin.

## Hangi ses tanıma modelini seçmeliyim?

Net bir sesli not veya ilk taslak için **Hızlı (Whisper Base)** ile başlayın. **Dengeli (Whisper Small)** sohbetlerde ve farklı aksanları tanımada yardımcı olabilir. **En yüksek doğruluk (Whisper Large V3 Turbo)** anlaşılması zor ses kayıtları için en iyi seçenektir. Daha büyük bir indirme gerektirir ve daha fazla bellek kullanır. Üç model de farklı dilleri destekler ve konuşmayı kaydın özgün dilinde yazıya döker.

Tarayıcı ve grafik donanımı desteklediğinde Whisper, WebGPU kullanır. Araç, WebAssembly aracılığıyla CPU üzerinde de çalışabilir. Seçtiğiniz model ilk çalıştırmada indirilir. Tarayıcınız, önbelleğinde tuttuğu model dosyalarını daha sonra yeniden kullanabilir. İndirme boyutu ve işleme süresi modele ve cihaza göre değişir. Ses kaydı cihazınızda çözülür ve metne dönüştürülür. Model indirilirken ses kaydınız gönderilmez.

## Zaman damgalı metni veya altyazıyı dışa aktarma

- **TXT**, her bölümün başlangıç zamanını gösterir. Örneğin, `[00:02:15.320] Gündemi gözden geçirelim.` kaydın başlamasından yaklaşık iki dakika on beş saniye sonraki bir cümleyi işaret eder. Toplantı notları, röportaj alıntıları ve metinde arama yapmak için kullanabilirsiniz.
- **SRT (SubRip)**, numaralandırılmış her altyazıya başlangıç ve bitiş zamanı ekler. Video düzenleme yazılımlarında yaygın olarak kullanılır.
- **VTT (WebVTT)**, her altyazının başlangıç ve bitiş zamanını da içerir. Altyazı parçalarını destekleyen HTML video oynatıcılarıyla çalışır.

Whisper her bölümün yaklaşık başlangıç ve bitiş zamanını belirler. Paylaşmadan önce önemli alıntıları dinleyin ve altyazı zamanlamasını kontrol edin. Arka plan gürültüsü ve aynı anda konuşan kişiler sonucu etkileyebilir. Döküm, metni zamana göre bölümlere ayırır.
