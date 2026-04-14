## What It Does

HTTP Basic Authorization başlığını çözüp Base64’ten kullanıcı adı ve parolayı çıkarın. Hata ayıklama ve API testi için yararlı.

## Accepted Input

Şunun gibi yapıştırın: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
