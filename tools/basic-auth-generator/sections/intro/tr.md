## Basic Auth nedir?

Basic Auth, `username:password` değerini Base64 ile kodlayıp `Authorization` başlığına yerleştirir. Basit ve yaygın desteklenen bir yöntemdir, ancak Base64 yalnızca bir kodlamadır, şifreleme değildir.

## Bu araç ne üretir?

- API istemcilerine yapıştırabileceğiniz bir `Authorization: Basic ...` başlığı.
- Hızlı denemeler için çalıştırmaya hazır bir `curl` örneği.
- Her şey tarayıcıda yerel olarak çalışır.

## Nelere dikkat etmelisiniz?

- Basic Auth bilgilerini gönderirken her zaman HTTPS kullanın.
- Başlığı gören herkes özgün kullanıcı adı ve parolayı çözebilir.
- Basic Auth; iç araçlar, staging ortamları ve hızlı API kontrolleri için uygundur.
