## IPv6 ULA /48 öneki oluşturun

Ev ağınız, laboratuvarınız veya VPN'iniz için oluşturulan `fd` önekini kopyalayın. Yeni alt ağlar eklediğinizde tekrar kullanabilmek için seçtiğiniz `/48` önekini ağ yapılandırmanızla birlikte kaydedin. Yeni bir önek istediğinizde **Yeni önek oluştur** düğmesini kullanın.

## /64 alt ağı hesaplayın

**Alt ağ kimliği** alanına `0000` ile `ffff` arasında onaltılık bir değer girin. Örneğin `00a0` kimliği, `fd12:3456:789a::/48` öneki içinde `fd12:3456:789a:a0::/64` sonucunu verir. Bir `/48` öneki 65.536 adet `/64` alt ağı sağlar. Böylece yerel ağ, misafir Wi-Fi ağı ve VPN gibi ağlara ayrı önekler atayabilirsiniz.

## fd öneki nereden gelir?

RFC 4193, Benzersiz Yerel Adresleri `fc00::/7` aralığında tanımlar. Yerel olarak atanan yarı, yani `fd00::/8`, `fd` ile başlar. Araç, `/48` önekini oluşturmak için tarayıcının Web Crypto API'siyle üretilen 40 bitlik rastgele bir genel kimlik ekler.

## Benzersiz Yerel Adres ne zaman kullanılır?

Tek bir ağ içinde veya VPN ile bağlı konumlar arasında kalıcı IPv6 adresleri kullanmak için ULA seçin. Bir cihaz, iç hizmetler için ULA kullanırken genel internet trafiği için küresel bir IPv6 adresi de kullanabilir.
