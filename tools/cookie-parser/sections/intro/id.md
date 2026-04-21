## Apa yang diurai oleh alat ini?

Tempel header Cookie dari permintaan atau satu maupun beberapa baris Set-Cookie dari respons. Pengurai akan mengekstrak nama cookie, nilai, dan fragmen yang salah format menjadi JSON terstruktur untuk inspeksi cepat.

## Cookie vs. Set-Cookie

Gunakan Cookie untuk header yang dikirim browser kembali ke server. Gunakan Set-Cookie untuk header respons yang menentukan atribut seperti Path, Max-Age, SameSite, Secure, atau HttpOnly.

## Tips agar hasil lebih rapi

- Anda dapat menempelkan baris header lengkap atau pasangan cookie mentah saja.
- Beberapa baris Set-Cookie didukung.
- Fragmen tidak valid ditampilkan terpisah agar pasangan atau atribut yang salah format mudah ditemukan.
