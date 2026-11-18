## Klavye testi nasıl yapılır?

**Testi başlat** düğmesine basın ve fiziksel klavyenizdeki tuşlara teker teker basıp bırakın. Tuşu basılı tuttuğunuz sürece ekranda yanar, bıraktığınızda üzerinde küçük bir nokta kalır. Ctrl, Shift ve Alt tuşlarını her iki tarafta da deneyin. Klavyenizde sayısal tuş takımı varsa onu da ayrı olarak test edin. İşaretleri temizleyip yeniden test etmek için **Sıfırla** düğmesini kullanın.

## Tuş kombinasyonlarını, eşzamanlı algılamayı ve gölgelenmeyi test etme

Bir oyunda veya uygulamada kullandığınız bir kombinasyonu deneyin. Örneğin `W`, `A`, `Shift` ve `Space` tuşlarını aynı anda basılı tutun. **Geçerli tuş kombinasyonu** dört tuşu da göstermelidir. **En çok basılı tuş**, değiştirici tuşlar da dâhil olmak üzere bu oturumda tarayıcının aynı anda algıladığı en yüksek tuş sayısını gösterir.

Birden fazla tuşun aynı anda algılanabilmesine rollover denir. Tek başına algılanan bir tuş belirli bir kombinasyonda görünmüyorsa klavye bu girdiyi engelliyor olabilir. Basılmayan bir tuş ekranda görünüyorsa bu, gölgelenme (ghosting) belirtisi olabilir. Farklı tuş grupları farklı sonuç verebileceğinden sorun yaşadığınız kombinasyonu deneyin. [Microsoft’un klavye gölgelenmesi demosu](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## Bir tuş neden algılanmıyor?

Başka bir yere tıkladıysanız veya Tab ya da Esc ile test alanından çıktıysanız **Testi başlat** düğmesine yeniden basın. Klavye veya işletim sistemi Fn ve bazı medya tuşlarını doğrudan işler. Tarayıcı da bazı kısayolları bu sayfaya ulaşmadan işleyebilir. Bir harf tuşu tek başına basıldığında da sürekli algılanmıyorsa aynı tuşu başka bir uygulamada deneyin.

## Neden farklı bir tuş yanıyor?

Şema, tam boyutlu ANSI klavyedeki fiziksel konumları gösterir. Fransızca AZERTY düzeninde `A` tuşuna bastığınızda şemadaki `Q` yanabilir. **Son tuş** alanında, düzeninizin ürettiği `a` değeri fiziksel konumun kodu olan `KeyQ` ile birlikte gösterilir. Kompakt bir klavyeniz varsa klavyenizde bulunan tuşları deneyin. [MDN’in fiziksel tuş kodları kılavuzu](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
