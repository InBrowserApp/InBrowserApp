## IPv6 Benzersiz Yerel Adresi nedir?

IPv6 Benzersiz Yerel Adresi (ULA), siteler, özel ağlar ve birbirine bağlı kuruluşlar içindeki iletişim için tasarlanmıştır. ULA adres alanının tamamı `fc00::/7`'dir. Bu alanın sekizinci biti **L biti**dir: `1` değeri bu oluşturucunun kullandığı, yerel olarak atanmış `fd00::/8` aralığını seçerken `fc00::/8` yarısı farklı bir atama yöntemi için ayrılmıştır.

ULA'lar varsayılan olarak küresel ölçekte erişilebilir değildir; ancak “yerel”, gizli veya otomatik olarak güvenli anlamına gelmez. Operatörler bu yolları yapılandırdığında yönlendirilmiş site sınırlarını, VPN'leri ve özel ara bağlantıları aşabilirler.

## Bu RFC 4193 oluşturucusu bir /48 önekini nasıl oluşturur?

Bu RFC 4193 oluşturucusu, Web Crypto API'den tam olarak 40 rastgele bit ister ve bunları `fd` ile birleştirir. Sonuç, `fd12:3456:789a::/48` gibi istatistiksel olarak benzersiz 48 bitlik bir site önekidir. Oluşturma işlemi tarayıcıda kalır: MAC adresi, zaman damgası, cihaz tanımlayıcısı veya sunucu yanıtı toplamaz.

Toplam `2^40` olası genel kimlik vardır; bu yaklaşık 1,1 trilyondur. Güvenli rastgelelik, kazara yeniden kullanım olasılığını düşürür; ancak bağımsız olarak oluşturulan iki önekin asla çakışmayacağını garanti edemez. Seçtiğiniz `/48` önekini ağ belgelerinize kaydedin ve tutarlı biçimde yeniden kullanın.

## Kullanılabilir 65.536 adet /64 alt ağını planlama

`/48` site önekinden sonra 16 bitlik alt ağ kimliği gelir. `0000` ile `ffff` arasındaki değerler 65.536 olası `/64` ağ sunar. Örneğin, `00a0` alt ağ kimliği `fd12:3456:789a::/48` önekini kanonik `fd12:3456:789a:a0::/64` ağına dönüştürür.

Kalan 64 bit arayüz kimliğidir. Bu araç yalnızca ağ öneklerini planlar; `/128` ana bilgisayar adresleri oluşturmaz veya MAC adreslerinden arayüz tanımlayıcıları türetmez.

## ULA'ların uygun olduğu ve olmadığı yerler

ULA'lar; kararlı iç adresleme, VPN bağlantılı siteler, laboratuvar ağları ve global unicast IPv6 kullanırken bir iç öneki de koruması gereken hizmetler için uygundur. ULA'lar güvenlik duvarı değildir ve doğası gereği bir güvenlik sınırı oluşturmaz. Normal erişim denetimleri uygulayın, site sınırlarında uygunsuz ULA trafiğini filtreleyin ve iç ULA kayıtlarını genel DNS'in dışında tutun.

Bir ana bilgisayar aynı anda hem ULA hem de global unicast adresi kullanabilir. İnternet erişimi için global adresi, ihtiyaç duyulan özel yollar için kalıcı ULA önekini kullanın.
