## Apa Yang Dilakukan

Alat ini mengurai header Cookie dan Set-Cookie mentah menjadi JSON terstruktur langsung di browser Anda. Anda dapat menempel satu baris header, beberapa baris, atau hanya nilainya tanpa prefiks biasa.

## Cookie Vs. Set-Cookie

Header Cookie biasanya berisi beberapa pasangan nama/nilai yang dikirim oleh klien. Header Set-Cookie biasanya mendefinisikan satu cookie beserta atribut seperti Path, Secure, HttpOnly, SameSite, Expires, atau Max-Age.

## Catatan

Parser ini berjalan secara lokal dan tidak mengunggah header ke server. Segmen yang tidak valid disimpan dalam daftar terpisah agar Anda bisa cepat menemukan string cookie yang salah format.
