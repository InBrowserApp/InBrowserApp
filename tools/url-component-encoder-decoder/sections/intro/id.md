## Apa itu URL Encoding?

URL encoding (juga disebut percent encoding) adalah metode untuk mengkonversi karakter khusus ke dalam format yang dapat dikirim dengan aman melalui internet. URL hanya dapat berisi karakter tertentu, jadi karakter apa pun yang tidak diizinkan harus diencode.

**Cara kerjanya:**

- Karakter khusus dikonversi ke `%` diikuti oleh kode ASCII heksadesimal mereka
- Contoh: spasi menjadi `%20`, `@` menjadi `%40`
- Hanya huruf (A-Z, a-z), angka (0-9), dan beberapa simbol (- \_ . ~) yang tidak perlu encoding

**Contoh umum:**

- Spasi → `%20`
- `@` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Mengapa diperlukan:**

- URL memiliki karakter reserved dengan makna khusus
- Memastikan data dikirim dengan benar
- Mencegah konflik dengan struktur URL
- Diperlukan untuk form web dan panggilan API
