## MIDI klavye veya denetleyici nasıl bağlanır?

Bir MIDI aygıtı bağlayın ve işletim sisteminizin aygıtı tanıdığını kontrol edin. **MIDI'yi etkinleştir** seçeneğini seçin, istenirse tarayıcıya MIDI izni verin ve bir giriş seçin. HTTPS üzerinden uyumlu bir tarayıcı kullanın. Monitör seçilen girişi dinler ve mesajları yerel olarak gösterir.

## Notalar ve nota hızı nasıl test edilir?

Bir tuşa veya pad'e basın ve piyanoyu ve mesaj günlüğünü izleyin. Note On, notayı ve genellikle 1 ile 127 arasında bir değer olan nota hızını gösterir. Note Off veya hızı 0 olan bir Note On notayı bırakır. Klavye, MIDI notası 60'ı C4 olarak etiketler. Farklı bir aralığı görmek için başlangıç oktavını değiştirin. Basılı tutulan notalar, gösterilen aralığın dışında olsalar bile listelenir.

## CC, perde bükme ve MIDI saati nasıl incelenir?

Denetim değişikliği (Control Change, CC) numarasını ve değerini görmek için bir düğmeyi, sürgüyü veya pedalı hareket ettirin. Örneğin birçok sustain pedalı CC 64 gönderir. Perde bükme, merkez değeri 0 olacak şekilde gösterilir. MIDI saat darbeleri mesaj günlüğünden ayrı olarak sayılır. Standart bir MIDI saati her dörtlük nota için 24 darbe gönderir. Günlük, her mesajı incelemek için kanal numaralarını ve ham onaltılık baytları içerir.

## MIDI girişim neden yanıt vermiyor?

Kabloyu, güç bağlantısını ve aygıt modunu kontrol edin; seçili bağlantı noktasının denetleyiciye ait olduğundan emin olun. Girişi kullanıyor olabilecek diğer uygulamaları kapatın, ardından aygıtı yeniden bağlayın. Destek, tarayıcıya ve işletim sistemine bağlıdır. Bu araç, normal MIDI erişimiyle standart MIDI mesajlarını dinler. Aygıta özgü System Exclusive (SysEx) mesajları ek izin gerektirir.
