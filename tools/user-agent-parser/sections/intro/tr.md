## User-Agent nedir?

User-Agent (UA) dizesi isteği yapan tarayıcıyı veya uygulamayı tanımlar ve genellikle tarayıcı, işletim sistemi, cihaz ve motor bilgilerini içerir. Sahte olabileceği için güvenlik sinyali değil, ipucu olarak kullanın.

### Bu ayrıştırıcı neleri gösterir

Bu araç yapıştırdığınız UA dizesini tarayıcınızda yerel olarak ayrıştırır ve sonucu tarayıcı, işletim sistemi, motor, cihaz, CPU ve JSON çıktısı olarak gruplandırır. Hiçbir veri yüklenmez.

### Örnek

Şunun gibi yaygın bir Windows üzeri Chrome dizesi yapıştırın:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

Sonuç, Windows 10 üzerindeki Chrome 115’i, Blink motorunu ve amd64 CPU mimarisini göstermelidir.

### Önemli not

Modern tarayıcılar giderek daha fazla Client Hints kullanıyor. Bu yüzden kopyalanmış bir UA dizesi, bir sitenin gerçek bir istekte görebildiği her şeyi göstermeyebilir.
