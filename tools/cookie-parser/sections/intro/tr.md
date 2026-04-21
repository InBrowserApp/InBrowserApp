## Ne Yapar

Bu araç ham Cookie ve Set-Cookie başlıklarını doğrudan tarayıcıda yapılandırılmış JSON’a ayrıştırır. Tek bir başlık satırı, birden fazla satır veya olağan önekler olmadan yalnızca değerler yapıştırabilirsiniz.

## Cookie Vs. Set-Cookie

Bir Cookie başlığı genellikle istemcinin gönderdiği birden fazla ad/değer çifti içerir. Bir Set-Cookie başlığı ise genellikle tek bir çerezi Path, Secure, HttpOnly, SameSite, Expires veya Max-Age gibi özniteliklerle birlikte tanımlar.

## Notlar

Ayrıştırıcı yerel olarak çalışır ve başlıkları bir sunucuya yüklemez. Geçersiz bölümler ayrı bir listede tutulur, böylece bozuk cookie dizelerini hızlıca fark edebilirsiniz.
