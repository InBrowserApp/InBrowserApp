## Apakah URL Encoding?

URL encoding (juga dipanggil percent encoding) adalah kaedah untuk menukar aksara khas kepada format yang boleh dihantar dengan selamat melalui internet. URL hanya boleh mengandungi aksara tertentu, jadi mana-mana aksara yang tidak dibenarkan mesti dikodkan.

**Bagaimana ia berfungsi:**

- Aksara khas ditukar kepada `%` diikuti dengan kod ASCII heksadesimal mereka
- Contoh: ruang menjadi `%20`, `@` menjadi `%40`
- Hanya huruf (A-Z, a-z), nombor (0-9), dan beberapa simbol (- \_ . ~) yang tidak memerlukan pengkodan

**Contoh biasa:**

- Ruang → `%20`
- `@` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Mengapa diperlukan:**

- URL mempunyai aksara terpelihara dengan makna khas
- Memastikan data dihantar dengan betul
- Menghalang konflik dengan struktur URL
- Diperlukan untuk borang web dan panggilan API
